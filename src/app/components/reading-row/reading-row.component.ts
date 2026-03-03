import { Component, input, output } from '@angular/core';
import { Reading } from '../../models/reading.model';

@Component({
  selector: 'app-reading-row',
  templateUrl: './reading-row.component.html',
})
export class ReadingRowComponent {
  reading = input.required<Reading>();
  edit = output<void>();
  delete = output<void>();

  confirmingDelete = false;

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  truncate(text: string, max = 80): string {
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}
