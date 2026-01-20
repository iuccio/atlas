import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddToDossierDialogComponent } from './add-to-dossier-dialog.component';
import { filter } from 'rxjs/operators';
import { TimetableHearingStatementV2 } from '../../../../api';
import { DialogData } from '../../../../core/components/dialog/dialog.data';

@Injectable({
  providedIn: 'root',
})
export class AddToDossierDialogService {
  private readonly dialog = inject(MatDialog);

  openDialog(statement: TimetableHearingStatementV2): Observable<number[]> {
    const selectStatementsData: AddToDossierData = {
      title: 'TTH.DIALOG.STATUS_CHANGE',
      message: 'TTH.DIALOG.STATUS_CHANGE',
      cancelText: 'COMMON.CANCEL',
      confirmText: 'COMMON.SAVE',
      statement: statement,
    };
    const dialogRef = this.dialog.open(AddToDossierDialogComponent, {
      data: selectStatementsData,
      disableClose: true,
      panelClass: 'atlas-dialog-panel',
      backdropClass: 'atlas-dialog-backdrop',
    });

    return dialogRef.afterClosed().pipe(filter((i) => i));
  }
}

export interface AddToDossierData extends DialogData {
  statement: TimetableHearingStatementV2;
}
