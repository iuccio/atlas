import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { StatementSelectComponent } from '../statement-select.component';
import { StatementSelectData } from './statement-select-dialog.service';
import { AtlasSpacerComponent } from '../../../../../core/components/spacer/atlas-spacer.component';
import {
  TimetableHearingStatementDocument,
  TimetableHearingStatementSenderV2,
  TimetableHearingStatementV2,
  TransportCompany,
} from '../../../../../api';
import { TablePagination } from '../../../../../core/components/table/table-pagination';
import { addElementsToArrayWhenNotUndefined } from '../../../../../core/util/arrays';
import { TimetableHearingStatementInternalService } from '../../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { TableService } from '../../../../../core/components/table/table.service';
import { TableColumn } from '../../../../../core/components/table/table-column';
import { TableFilter } from '../../../../../core/components/table-filter/config/table-filter';
import { TableComponent } from '../../../../../core/components/table/table.component';
import { TthTableFilterSettingsService } from '../../../tth-table-filter-settings.service';
import { Pages } from '../../../../pages';

@Component({
  selector: 'atlas-statement-select-dialog',
  templateUrl: './statement-select-dialog.component.html',
  styleUrls: ['./statement-select-dialog.component.scss'],
  imports: [
    MatDialogClose,
    ReactiveFormsModule,
    MatDialogActions,
    TranslatePipe,
    StatementSelectComponent,
    AtlasSpacerComponent,
    TableComponent,
  ],
  providers: [TranslatePipe],
})
export class StatementSelectDialogComponent implements OnInit {
  data = inject<StatementSelectData>(MAT_DIALOG_DATA);
  selectedStatements: number[] = [];

  private readonly dialogRef =
    inject<MatDialogRef<StatementSelectDialogComponent>>(MatDialogRef);
  private readonly timetableHearingStatementsService = inject(
    TimetableHearingStatementInternalService
  );
  private readonly tableService = inject(TableService);
  readonly tableColumns: TableColumn<TimetableHearingStatementV2>[] = [
    { headerTitle: 'ID', value: 'id' },
    {
      headerTitle: 'TTH.TIMETABLE_FIELD_LASTNAME',
      value: 'statementSender',
      callback: this.mapToLastname,
    },
    {
      headerTitle: 'TTH.TRANSPORT_COMPANY',
      value: 'responsibleTransportCompaniesDisplay',
    },
    {
      headerTitle: 'TTH.TIMETABLE_FIELD_NUMBER',
      value: 'timetableFieldNumber',
      disabled: true,
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
        icon: 'bi bi-file-earmark-plus',
        clickCallback: this.addStatement,
        applicationType: 'TIMETABLE_HEARING',
        buttonDataCy: 'duplicate-hearing',
        title: 'TTH.BUTTON.DUPLICATE',
        buttonType: 'icon',
        disabled: false,
      },
    },
  ];

  mapToLastname(statementSender: TimetableHearingStatementSenderV2) {
    return statementSender.lastName;
  }

  isDocumentExisting(documents: Array<TimetableHearingStatementDocument>) {
    return documents.length > 0;
  }

  statements: TimetableHearingStatementV2[] = [];
  totalCount$ = 0;
  tableFilterConfig!: TableFilter<unknown>[][];

  ngOnInit() {
    this.selectedStatements = this.data.selectedStatements;
    this.tableFilterConfig = this.tableService.initializeFilterConfig(
      TthTableFilterSettingsService.createSettings(),
      Pages.TTH_ACTIVE
    );
  }

  confirm() {
    this.dialogRef.close(this.selectedStatements);
  }

  cancel() {
    this.dialogRef.close();
  }

  addStatement(row: TimetableHearingStatementV2) {
    if (this.selectedStatements.includes(row.id!)) {
      return;
    }
    this.selectedStatements = [...this.selectedStatements, row.id!];
  }

  getAdditionalStatements(pagination: TablePagination) {
    this.timetableHearingStatementsService
      .getStatements(
        this.data.timetableHearingYear,
        this.data.swissCanton,
        this.tableService.filter.chipSearch.getActiveSearch(),
        this.tableService.filter.multiSelectStatementStatus.getActiveSearch(),
        this.tableService.filter.searchSelectTTFN.getActiveSearch()?.ttfnid,
        (
          this.tableService.filter.searchSelectTU.getActiveSearch() as TransportCompany[]
        )
          ?.map((tu) => tu.id)
          .filter(
            (numberOrUndefined): numberOrUndefined is number =>
              !!numberOrUndefined
          ),
        pagination.page,
        pagination.size,
        addElementsToArrayWhenNotUndefined(
          pagination.sort,
          'ttfnid,ASC',
          'id,ASC'
        )
      )
      .subscribe((container) => {
        this.statements = container.objects!;
        this.totalCount$ = container.totalCount!;
      });
  }
}
