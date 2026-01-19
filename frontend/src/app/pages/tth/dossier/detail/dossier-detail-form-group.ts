import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwissCanton } from '../../../../api';
import { AtlasCharsetsValidator } from '../../../../core/validation/charsets/atlas-charsets-validator';
import { AtlasFieldLengthValidator } from '../../../../core/validation/field-lengths/atlas-field-length-validator';
import { WhitespaceValidator } from '../../../../core/validation/whitespace/whitespace-validator';
import moment, { Moment } from 'moment/moment';
import { TthDossier } from '../../../../api/model/tthDossier';
import { DossierStatus } from '../../../../api/model/dossierStatus';

export interface DossierDetailFormGroup {
  id: FormControl<number | null | undefined>;
  statementIds: FormControl<number[] | null | undefined>;
  swissCanton: FormControl<SwissCanton | null | undefined>;
  topic: FormControl<string | null | undefined>;
  internalComment: FormControl<string | null | undefined>;
  publicComment: FormControl<string | null | undefined>;
  boContactMail: FormControl<string | null | undefined>;
  boDeadlineToAnswer: FormControl<Moment | null | undefined>;
  question: FormControl<string | null | undefined>;
  dossierStatus: FormControl<DossierStatus | null | undefined>;
}

export class DossierFormGroupBuilder {
  static buildFormGroup(
    dossier?: TthDossier
  ): FormGroup<DossierDetailFormGroup> {
    return new FormGroup<DossierDetailFormGroup>({
      id: new FormControl(dossier?.id),
      statementIds: new FormControl(dossier?.statementIds, [
        Validators.required,
      ]),
      swissCanton: new FormControl(dossier?.swissCanton),
      topic: new FormControl(dossier?.topic, [
        Validators.required,
        AtlasFieldLengthValidator.length_255,
        WhitespaceValidator.blankOrEmptySpaceSurrounding,
      ]),
      internalComment: new FormControl(dossier?.internalComment, [
        Validators.maxLength(5000),
        WhitespaceValidator.blankOrEmptySpaceSurrounding,
      ]),
      publicComment: new FormControl(dossier?.publicComment, [
        Validators.maxLength(5000),
        WhitespaceValidator.blankOrEmptySpaceSurrounding,
      ]),
      boContactMail: new FormControl(dossier?.boContactMail, [
        AtlasFieldLengthValidator.length_255,
        AtlasCharsetsValidator.email,
      ]),
      boDeadlineToAnswer: new FormControl(
        dossier?.boDeadlineToAnswer ? moment(dossier.boDeadlineToAnswer) : null
      ),
      question: new FormControl(dossier?.questions.at(0)?.question, [
        Validators.maxLength(5000),
        WhitespaceValidator.blankOrEmptySpaceSurrounding,
      ]),
      dossierStatus: new FormControl(dossier?.dossierStatus),
    });
  }

  static getDossier(form: FormGroup<DossierDetailFormGroup>): TthDossier {
    const dossier: TthDossier = {
      id: form.controls.id.value!,
      statementIds: form.controls.statementIds.value!,
      swissCanton: form.controls.swissCanton.value!,
      topic: form.controls.topic.value!,
      internalComment: form.controls.internalComment.value!,
      publicComment: form.controls.publicComment.value!,
      boContactMail: form.controls.boContactMail.value!,
      boDeadlineToAnswer: form.controls.boDeadlineToAnswer.value?.toDate(),
      dossierStatus: form.controls.dossierStatus.value!,
      questions: [],
    };
    if (form.controls.question.value) {
      dossier.questions = [
        {
          question: form.controls.question.value,
        },
      ];
    }
    return dossier;
  }
}
