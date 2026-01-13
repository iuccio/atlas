import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { StatementSelectDialogComponent } from './statement-select-dialog.component';
import { DialogData } from '../../../../../core/components/dialog/dialog.data';
import { SwissCanton } from '../../../../../api';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StatementSelectDialogService {
  private dialogRef?: MatDialogRef<StatementSelectDialogComponent>;

  constructor(private dialog: MatDialog) {}

  select(
    selectedStatements: number[],
    swissCanton: SwissCanton,
    timetableHearingYear: number
  ): Observable<number[]> {
    const selectStatementsData: StatementSelectData = {
      title: 'TTH.DIALOG.STATUS_CHANGE',
      message: 'TTH.DIALOG.STATUS_CHANGE',
      cancelText: 'COMMON.CANCEL',
      confirmText: 'COMMON.APPLY',
      selectedStatements: selectedStatements,
      swissCanton: swissCanton,
      timetableHearingYear: timetableHearingYear,
    };
    this.dialogRef = this.dialog.open(StatementSelectDialogComponent, {
      data: selectStatementsData,
      disableClose: true,
      panelClass: 'atlas-dialog-panel',
      backdropClass: 'atlas-dialog-backdrop',
    });

    return this.dialogRef.afterClosed().pipe(filter((i) => i));
  }
}

export interface StatementSelectData extends DialogData {
  selectedStatements: number[];
  swissCanton: SwissCanton;
  timetableHearingYear: number;
}
