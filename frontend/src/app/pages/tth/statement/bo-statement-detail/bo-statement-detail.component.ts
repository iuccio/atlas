import { Component, EventEmitter, input, Output } from '@angular/core';
import { StatementDataComponent } from '../statement-data/statement-data.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  StatementDetailFormGroup,
  TimetableHearingStatementDocumentGroup,
} from '../statement-detail-form-group';
import { TimetableHearingStatementV2 } from '../../../../api';
import { CommentComponent } from '../../../../core/form-components/comment/comment.component';
import { DetailPageContainerComponent } from '../../../../core/components/detail-page-container/detail-page-container.component';
import { DetailPageContentComponent } from '../../../../core/components/detail-page-content/detail-page-content.component';
import { AtlasButtonComponent } from '../../../../core/components/button/atlas-button.component';
import { DetailFooterComponent } from '../../../../core/components/detail-footer/detail-footer.component';
import { AtlasLabelFieldComponent } from '@atlas/form';
import { FileComponent } from '../../../../core/components/file-upload/file/file.component';

@Component({
  selector: 'atlas-bo-statement-detail',
  imports: [
    StatementDataComponent,
    CommentComponent,
    DetailPageContainerComponent,
    DetailPageContentComponent,
    AtlasButtonComponent,
    DetailFooterComponent,
    AtlasLabelFieldComponent,
    FileComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bo-statement-detail.component.html',
  styleUrls: ['./bo-statement-detail.component.scss'],
})
export class BoStatementDetailComponent {
  form = input.required<FormGroup<StatementDetailFormGroup>>();
  ttfnValidOn = input.required<Date>();
  statement = input.required<TimetableHearingStatementV2>();

  @Output() backToOverview = new EventEmitter<void>();
  @Output() downloadFile = new EventEmitter<string>();

  private _anonymDocuments!: FormGroup<TimetableHearingStatementDocumentGroup>[];

  back() {
    this.backToOverview.emit();
  }

  downloadPdf(fileName: string) {
    this.downloadFile.emit(fileName);
  }

  get anonymDocuments(): FormGroup<TimetableHearingStatementDocumentGroup>[] {
    this._anonymDocuments = this.form().controls.documents.controls.filter(
      (control: FormGroup<TimetableHearingStatementDocumentGroup>) => {
        return control.getRawValue().anonymous === true;
      }
    );
    return this._anonymDocuments;
  }
}
