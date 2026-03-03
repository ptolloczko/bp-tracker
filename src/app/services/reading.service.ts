import { computed, Injectable, signal } from '@angular/core';
import { Reading } from '../models/reading.model';

@Injectable({ providedIn: 'root' })
export class ReadingService {
  private readonly STORAGE_KEY = 'bp-tracker-readings';

  readonly readings = signal<Reading[]>(this.load());

  readonly averages = computed(() => {
    const r = this.readings();
    if (!r.length) return null;
    const avg = (vals: number[]) => vals.reduce((a, b) => a + b, 0) / vals.length;
    const round1 = (n: number) => Math.round(n * 10) / 10;
    return {
      systolic:  round1(avg(r.map(x => x.systolic))),
      diastolic: round1(avg(r.map(x => x.diastolic))),
    };
  });

  add(reading: Omit<Reading, 'id'>): void {
    this.readings.update(r => [...r, { ...reading, id: crypto.randomUUID() }]);
    this.save();
  }

  update(id: string, changes: Omit<Reading, 'id'>): void {
    this.readings.update(r => r.map(x => x.id === id ? { ...changes, id } : x));
    this.save();
  }

  delete(id: string): void {
    this.readings.update(r => r.filter(x => x.id !== id));
    this.save();
  }

  private load(): Reading[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.readings()));
  }
}
