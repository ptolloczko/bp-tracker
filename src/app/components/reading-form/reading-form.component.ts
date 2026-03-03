import { Component, effect, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Reading, VALIDATION } from '../../models/reading.model';

@Component({
  selector: 'app-reading-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reading-form.component.html',
})
export class ReadingFormComponent {
  reading = input<Reading | null>(null);
  saved = output<Omit<Reading, 'id'>>();
  cancelled = output<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      systolic:   [null, [Validators.required, Validators.min(VALIDATION.systolic.min),  Validators.max(VALIDATION.systolic.max)]],
      diastolic:  [null, [Validators.required, Validators.min(VALIDATION.diastolic.min), Validators.max(VALIDATION.diastolic.max)]],
      pulse:      [null, [Validators.required, Validators.min(VALIDATION.pulse.min),     Validators.max(VALIDATION.pulse.max)]],
      recordedAt: [this.nowLocal(), Validators.required],
      notes:      ['', Validators.maxLength(VALIDATION.notes.maxLength)],
    });

    effect(() => {
      const r = this.reading();
      if (r) {
        this.form.patchValue({ ...r, recordedAt: this.toLocalDatetime(r.recordedAt) });
      } else {
        this.form.reset({ recordedAt: this.nowLocal() });
      }
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { systolic, diastolic, pulse, recordedAt, notes } = this.form.value;
    this.saved.emit({
      systolic:   +systolic,
      diastolic:  +diastolic,
      pulse:      +pulse,
      recordedAt: new Date(recordedAt).toISOString(),
      notes:      notes || undefined,
    });
    this.form.reset({ recordedAt: this.nowLocal() });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  field(name: string) {
    return this.form.get(name)!;
  }

  private nowLocal(): string {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  private toLocalDatetime(iso: string): string {
    const d = new Date(iso);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
