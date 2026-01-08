import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TthExportAnonymizationChoiceDialogComponent } from '../tth-export-anonymization-choice-dialog.component';
import { DialogData } from '../../../../../core/components/dialog/dialog.data';

@Injectable({
  providedIn: 'root',
})
export class TthExportAnonymizationChoiceDialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const data: DialogData = {
      title: 'TTH.DIALOG.EXPORT_ANONYMIZATION_CHOICE_TITLE',
      message: 'TTH.DIALOG.EXPORT_ANONYMIZATION_CHOICE_MESSAGE',
      cancelText: 'TTH.DIALOG.CANCEL',
      confirmText: 'TTH.DIALOG.CONFIRM',
    };

    this.dialog.open(TthExportAnonymizationChoiceDialogComponent, {
      data: data,
      disableClose: true,
      panelClass: 'atlas-dialog-panel',
      backdropClass: 'atlas-dialog-backdrop',
    });
  }
}
