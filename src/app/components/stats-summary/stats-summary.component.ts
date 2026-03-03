import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stats-summary',
  templateUrl: './stats-summary.component.html',
})
export class StatsSummaryComponent {
  averages = input<{ systolic: number; diastolic: number } | null>(null);
}
