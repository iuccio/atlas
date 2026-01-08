import { Component, inject } from '@angular/core';
import { DialogCloseComponent } from '../../../../core/components/dialog/close/dialog-close.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogContentComponent } from '../../../../core/components/dialog/content/dialog-content.component';
import { DialogFooterComponent } from '../../../../core/components/dialog/footer/dialog-footer.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AppTestingModule } from '../../../../app.testing.module';
import { TextFieldComponent } from '../../../../core/form-components/text-field/text-field.component';

@Component({
  selector: 'app-tth-export-anonymization-choice-dialog',
  imports: [
    DialogCloseComponent,
    DialogContentComponent,
    DialogFooterComponent,
    TranslatePipe,
    MatRadioButton,
    MatRadioGroup,
    AppTestingModule,
    TextFieldComponent,
  ],
  templateUrl: './tth-export-anonymization-choice-dialog.component.html',
})
export class TthExportAnonymizationChoiceDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<TthExportAnonymizationChoiceDialogComponent>
  );

  close(result?: boolean) {
    this.dialogRef.close(result);
  }

  downloadCsv() {
    console.log('downloadCsv called');
  }
}
