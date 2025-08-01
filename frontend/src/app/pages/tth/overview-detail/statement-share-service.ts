import { Injectable } from '@angular/core';
import { StatementStatus, TimetableHearingStatementV2 } from '../../../api';

@Injectable({
  providedIn: 'root',
})
export class StatementShareService {
  private _statement!: TimetableHearingStatementV2 | undefined;

  get statement() {
    return this._statement;
  }

  set statement(statement: TimetableHearingStatementV2 | undefined) {
    this._statement = statement;
  }

  public clearCachedStatement() {
    this._statement = undefined;
  }

  public getCloneStatement(): TimetableHearingStatementV2 {
    return {
      timetableYear: this.statement!.timetableYear,
      statementStatus: StatementStatus.Received,
      ttfnid: this.statement!.ttfnid,
      timetableFieldNumber: this.statement!.timetableFieldNumber,
      timetableFieldDescription: this.statement!.timetableFieldDescription,
      swissCanton: this.statement!.swissCanton,
      stopPlace: this.statement!.stopPlace,
      responsibleTransportCompanies:
        this.statement!.responsibleTransportCompanies,
      statementSender: this.statement!.statementSender,
      statement: this.statement!.statement,
      justification: this.statement!.justification,
      comment: this.statement!.comment,
    };
  }
}
