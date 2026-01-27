import { Component, inject, Inject } from '@angular/core';
import { DialogCloseComponent } from '../../../../core/components/dialog/close/dialog-close.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { DialogContentComponent } from '../../../../core/components/dialog/content/dialog-content.component';
import { DialogFooterComponent } from '../../../../core/components/dialog/footer/dialog-footer.component';
import { FormsModule } from '@angular/forms';
import { DialogData } from '../../../../core/components/dialog/dialog.data';
import { InfoIconComponent } from '@atlas/form';

@Component({
  selector: 'atlas-tth-export-anonymization-choice-dialog',
  templateUrl: './tth-export-anonymization-choice-dialog.component.html',
  imports: [
    DialogCloseComponent,
    TranslatePipe,
    MatRadioButton,
    MatRadioGroup,
    DialogContentComponent,
    DialogFooterComponent,
    FormsModule,
    InfoIconComponent,
  ],
})
export class TthExportAnonymizationChoiceDialogComponent {
  isAnonymizedExport = true;

  constructor(
    private readonly dialogRef: MatDialogRef<TthExportAnonymizationChoiceDialogComponent> = inject(
      MatDialogRef<TthExportAnonymizationChoiceDialogComponent>
    ),
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close() {
    this.dialogRef.close(null);
  }

  confirm() {
    this.dialogRef.close({ isAnonymized: this.isAnonymizedExport });
  }
}
