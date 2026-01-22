import { Component, effect, inject, input, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TimetableHearingStatementDocument,
  TimetableHearingStatementV2,
} from '../../../../api';
import { TimetableHearingStatementInternalService } from '../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { TableComponent } from '../../../../core/components/table/table.component';
import { TableColumn } from '../../../../core/components/table/table-column';
import { Router } from '@angular/router';
import { Pages } from '../../../pages';
import { Cantons } from '../../../../core/cantons/Cantons';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'atlas-statement-select',
  imports: [FormsModule, ReactiveFormsModule, TableComponent, TranslatePipe],
  templateUrl: './statement-select.component.html',
})
export class StatementSelectComponent {
  selectedStatements = model.required<number[]>();
  removeOptionEnabled = input(true);
  showRemoveOption = input(true);

  private readonly timetableHearingStatementInternalService = inject(
    TimetableHearingStatementInternalService
  );
  private readonly router = inject(Router);

  eyeColumn: TableColumn<TimetableHearingStatementV2> = {
    headerTitle: '',
    value: 'etagVersion',
    button: {
      icon: 'bi bi-eye',
      clickCallback: () => {},
      applicationType: 'TIMETABLE_HEARING',
      buttonDataCy: 'seeStatement',
      buttonType: 'icon',
      disabled: () => false,
    },
  };

  defaultTableColumns: TableColumn<TimetableHearingStatementV2>[] = [
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
    {
      headerTitle: '',
      value: 'etagVersion',
      disabled: true,
      button: {
        icon: 'bi bi-trash',
        clickCallback: this.removeStatement,
        applicationType: 'TIMETABLE_HEARING',
        buttonDataCy: 'removeStatement',
        title: 'COMMON.DELETE',
        buttonType: 'icon',
        disabled: () => !this.removeOptionEnabled(),
      },
    },
  ];
  statements: TimetableHearingStatementV2[] = [];

  get tableColumns(): TableColumn<TimetableHearingStatementV2>[] {
    if (this.showRemoveOption()) {
      return this.defaultTableColumns;
    }
    const boTableColumns = this.defaultTableColumns.slice(0, -1);
    boTableColumns.push(this.eyeColumn);
    return boTableColumns;
  }

  constructor() {
    effect(() => {
      this.loadStatementsToTable();
    });
  }

  isDocumentExisting(documents: Array<TimetableHearingStatementDocument>) {
    return documents.length > 0;
  }

  removeStatement(statement: TimetableHearingStatementV2) {
    const updatedStatementIds = this.selectedStatements().filter(
      (id) => id !== statement.id
    );
    this.selectedStatements.set(updatedStatementIds);
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

  loadStatementsToTable() {
    if (this.selectedStatements().length === 0) {
      this.statements = [];
    } else {
      forkJoin(
        this.selectedStatements().map((id) =>
          this.timetableHearingStatementInternalService.getStatement(id)
        )
      ).subscribe((statements) => {
        this.statements = statements;
      });
    }
  }
}
