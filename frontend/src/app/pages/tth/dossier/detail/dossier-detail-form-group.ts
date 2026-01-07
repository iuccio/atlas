import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwissCanton } from '../../../../api';
import { AtlasCharsetsValidator } from '../../../../core/validation/charsets/atlas-charsets-validator';
import { AtlasFieldLengthValidator } from '../../../../core/validation/field-lengths/atlas-field-length-validator';
import { WhitespaceValidator } from '../../../../core/validation/whitespace/whitespace-validator';
import moment, { Moment } from 'moment/moment';
import { TthDossier } from '../../../../api/model/tthDossier';

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
        dossier?.boDeadlineToAnswer ? moment(dossier.boDeadlineToAnswer) : null,
        [Validators.required]
      ),
      question: new FormControl(dossier?.questions.at(0)?.question, [
        Validators.maxLength(5000),
        WhitespaceValidator.blankOrEmptySpaceSurrounding,
      ]),
    });
  }
}
