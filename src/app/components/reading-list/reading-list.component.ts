import { Component, input, output } from '@angular/core';
import { Reading } from '../../models/reading.model';
import { ReadingRowComponent } from '../reading-row/reading-row.component';

@Component({
  selector: 'app-reading-list',
  imports: [ReadingRowComponent],
  templateUrl: './reading-list.component.html',
})
export class ReadingListComponent {
  readings = input.required<Reading[]>();
  edit = output<Reading>();
  delete = output<string>();
}
