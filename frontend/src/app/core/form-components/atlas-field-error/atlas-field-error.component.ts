import { Component, computed, inject, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidationService } from '../../validation/validation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'atlas-field-error',
  templateUrl: './atlas-field-error.component.html',
  styleUrls: ['./atlas-field-error.component.scss'],
  imports: [TranslatePipe],
})
export class AtlasFieldErrorComponent {
  readonly control = input.required<AbstractControl | null>();
  readonly ctrlErrors = input<ValidationErrors | null>();
  protected readonly errors = computed(() => this.getErrors(this.ctrlErrors()));

  private readonly validationService = inject(ValidationService);

  private getErrors(ctrlErrors?: ValidationErrors | null) {
    return this.validationService.getValidation(ctrlErrors ?? null);
  }
}
