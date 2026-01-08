import { Component, inject, model, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SwissCanton,
  TimetableHearingStatementDocument,
  TimetableHearingStatementV2,
} from '../../../../api';
import { TimetableHearingStatementInternalService } from '../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { TableComponent } from '../../../../core/components/table/table.component';
import { TableColumn } from '../../../../core/components/table/table-column';
import { Router } from '@angular/router';
import { Pages } from '../../../pages';
import { Cantons } from '../../../../core/cantons/Cantons';

export interface SelectedStatements {
  swissCanton?: SwissCanton;
  statementIds: number[];
}

@Component({
  selector: 'atlas-statement-select',
  imports: [FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './statement-select.component.html',
  styleUrls: ['./statement-select.component.scss'],
})
export class StatementSelectComponent implements OnInit {
  selectedStatements = model.required<SelectedStatements>();

  private readonly timetableHearingStatementInternalService = inject(
    TimetableHearingStatementInternalService
  );
  private readonly router = inject(Router);

  tableColumns: TableColumn<TimetableHearingStatementV2>[] = [
    { headerTitle: 'ID', value: 'id' },
    {
      headerTitle: 'TTH.TRANSPORT_COMPANY',
      value: 'responsibleTransportCompaniesDisplay',
    },
    {
      headerTitle: 'TTH.TIMETABLE_FIELD_NUMBER_DESCRIPTION',
      value: 'timetableFieldDescription',
      disabled: true,
    },
    {
      headerTitle: 'COMMON.EDIT_ON',
      value: 'editionDate',
      formatAsDate: true,
    },
    {
      headerTitle: 'TTH.TIMETABLE_FIELD_DOCUMENT',
      value: 'documents',
      icon: {
        icon: 'bi bi-paperclip',
        callback: this.isDocumentExisting,
      },
    },
  ];
  statements: TimetableHearingStatementV2[] = [];

  isDocumentExisting(documents: Array<TimetableHearingStatementDocument>) {
    return documents.length > 0;
  }

  ngOnInit() {
    this.loadSwissCanton();
    this.selectedStatements.subscribe(() => {
      console.log('selectedStatements changed', this.selectedStatements());
      this.getOverview();
    });
  }

  private loadSwissCanton() {
    if (
      !this.selectedStatements()?.swissCanton &&
      this.selectedStatements()?.statementIds.length > 0
    ) {
      this.timetableHearingStatementInternalService
        .getStatement(this.selectedStatements().statementIds[0]!)
        .subscribe((statement) => {
          this.selectedStatements.set({
            statementIds: this.selectedStatements().statementIds,
            swissCanton: statement.swissCanton,
          });
        });
    }
  }

  removeStatement(statement: TimetableHearingStatementV2) {
    const updatedStatementIds = this.selectedStatements().statementIds.filter(
      (id) => id !== statement.id
    );
    this.selectedStatements.set({
      statementIds: updatedStatementIds,
      swissCanton: this.selectedStatements().swissCanton,
    });
  }

  goToStatement(statement: TimetableHearingStatementV2) {
    this.router
      .navigate([
        Pages.TTH.path,
        Cantons.fromSwissCanton(statement.swissCanton)?.path,
        Pages.TTH_ACTIVE.path,
        statement.id,
      ])
      .then();
  }

  getOverview() {
    const loadedStatements: TimetableHearingStatementV2[] = [];
    this.selectedStatements().statementIds.forEach((id) => {
      this.timetableHearingStatementInternalService
        .getStatement(id)
        .subscribe((statement) => {
          loadedStatements.push(statement);
        });
    });
    this.statements = loadedStatements;
    console.log('loaded statements for table', this.statements);
  }
}
