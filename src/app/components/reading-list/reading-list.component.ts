import { Component, input, output, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Reading } from '../../models/reading.model';

@Component({
  selector: 'app-reading-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './reading-list.component.html',
})
export class ReadingListComponent {
  readings = input.required<Reading[]>();
  edit = output<Reading>();
  delete = output<string>();

  deletingId = signal<string | null>(null);
  displayedColumns = ['recordedAt', 'systolic', 'diastolic', 'pulse', 'notes', 'actions'];

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  truncate(text: string, max = 80): string {
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
