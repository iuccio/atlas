import { describe, expect, it } from 'vitest';
import { DecisionFormGroupBuilder } from './decision-form-group';
import { JudgementType } from '../../../../../../api';

describe('DecisionFormGroupBuilder', () => {
  it('should formGroup with motivation validator for yes', () => {
    const formGroup = buildFormGroup();

    formGroup.controls.judgement.setValue(JudgementType.Yes);
    expect(formGroup.valid).toBe(true);
  });

  it('should formGroup with motivation validator for no', () => {
    const formGroup = buildFormGroup();

    formGroup.controls.judgement.setValue(JudgementType.No);
    expect(formGroup.valid).toBe(false);
  });

  it('should formGroup with motivation validator for no with motivation', () => {
    const formGroup = buildFormGroup();

    formGroup.controls.judgement.setValue(JudgementType.No);
    formGroup.controls.motivation.setValue('Ich judge');
    expect(formGroup.valid).toBe(true);
  });

  function buildFormGroup() {
    const formGroup = DecisionFormGroupBuilder.buildFormGroup();
    formGroup.patchValue({
      firstName: 'Dänu',
      lastName: 'GymOne',
      organisation: 'Fitness',
      personFunction: 'Trainer',
    });
    return formGroup;
  }
});
