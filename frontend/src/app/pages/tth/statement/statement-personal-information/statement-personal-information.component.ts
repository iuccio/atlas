import { Component, input } from '@angular/core';
import { TextFieldComponent } from '../../../../core/form-components/text-field/text-field.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { StatementDetailFormGroup } from '../statement-detail/statement-detail-form-group';
import { AtlasClipboardComponent } from '../../../../core/form-components/atlas-clipboard/atlas-clipboard.component';
import { StringListComponent } from '../../../../core/form-components/string-list/string-list.component';
import { AtlasCharsetsValidator } from '../../../../core/validation/charsets/atlas-charsets-validator';
import { AtlasFieldLengthValidator } from '../../../../core/validation/field-lengths/atlas-field-length-validator';
import { TimetableHearingStatementV2 } from '../../../../api';

@Component({
  selector: 'app-statement-personal-information',
  imports: [
    TextFieldComponent,
    TranslatePipe,
    AtlasClipboardComponent,
    StringListComponent,
  ],
  templateUrl: './statement-personal-information.component.html',
})
export class StatementPersonalInformationComponent {
  form = input.required<FormGroup<StatementDetailFormGroup>>();
  statement = input<TimetableHearingStatementV2>();
  readonly emailValidator = [
    AtlasCharsetsValidator.email,
    AtlasFieldLengthValidator.length_100,
  ];

  get emails(): string {
    if (this.statement()?.statementSender.emails) {
      return Array.from(this.statement()!.statementSender.emails!).join('\n');
    }
    return '';
  }
}
