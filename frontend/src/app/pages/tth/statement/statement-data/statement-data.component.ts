import { Component, inject, input } from '@angular/core';
import { AtlasLabelFieldComponent } from '@atlas/form';
import { TextFieldComponent } from '../../../../core/form-components/text-field/text-field.component';
import { TimetableFieldNumberSelectComponent } from '../../../../core/form-components/ttfn-select/timetable-field-number-select.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TransportCompanySelectComponent } from '../../../../core/form-components/tu-select/transport-company-select.component';
import { FormGroup } from '@angular/forms';
import { StatementDetailFormGroup } from '../statement-detail/statement-detail-form-group';
import {
  TimetableFieldNumber,
  TimetableHearingStatementV2,
  TransportCompany,
} from '../../../../api';
import { TimetableHearingStatementInternalService } from '../../../../api/service/lidi/timetable-hearing-statement-internal.service';

@Component({
  selector: 'atlas-statement-data',
  imports: [
    AtlasLabelFieldComponent,
    TextFieldComponent,
    TimetableFieldNumberSelectComponent,
    TranslatePipe,
    TransportCompanySelectComponent,
  ],
  templateUrl: './statement-data.component.html',
})
export class StatementDataComponent {
  form = input.required<FormGroup<StatementDetailFormGroup>>();
  ttfnValidOn = input.required<Date>();
  statement = input.required<TimetableHearingStatementV2>();

  private readonly timetableHearingStatementsService = inject(
    TimetableHearingStatementInternalService
  );

  ttfnSelectionChanged(newTtfn?: TimetableFieldNumber) {
    if (newTtfn) {
      this.timetableHearingStatementsService
        .getResponsibleTransportCompanies(
          newTtfn.ttfnid!,
          this.form().value.timetableYear! - 1
        )
        .subscribe((result: TransportCompany[]) => {
          this.form().controls.responsibleTransportCompanies.setValue(result);
        });
    }
  }
}
