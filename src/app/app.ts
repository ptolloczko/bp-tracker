import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { Reading } from './models/reading.model';
import { ReadingService } from './services/reading.service';
import { ReadingFormComponent } from './components/reading-form/reading-form.component';
import { StatsSummaryComponent } from './components/stats-summary/stats-summary.component';
import { ReadingListComponent } from './components/reading-list/reading-list.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatCardModule, ReadingFormComponent, StatsSummaryComponent, ReadingListComponent],
  templateUrl: './app.html',
})
export class App {
  private service = inject(ReadingService);

  readings = this.service.readings;
  averages = this.service.averages;
  editingReading = signal<Reading | null>(null);

  onSaved(data: Omit<Reading, 'id'>): void {
    const editing = this.editingReading();
    if (editing) {
      this.service.update(editing.id, data);
    } else {
      this.service.add(data);
    }
    this.editingReading.set(null);
  }

  onEdit(reading: Reading): void {
    this.editingReading.set(reading);
  }

  onDelete(id: string): void {
    this.service.delete(id);
  }

  onCancelled(): void {
    this.editingReading.set(null);
  }
}
