import { Component, inject, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { TableComponent } from '../../../../core/components/table/table.component';
import { TableColumn } from '../../../../core/components/table/table-column';
import { SelectionModel } from '@angular/cdk/collections';
import { TableFilter } from '../../../../core/components/table-filter/config/table-filter';
import { TthDossier } from '../../../../api/model/tthDossier';
import { ContainerTthDossier } from '../../../../api/model/containerTthDossier';

@Component({
  selector: 'atlas-tth-dossier-overview',
  imports: [TableComponent],
  templateUrl: './tth-dossier-overview.component.html',
})
export class TthDossierOverviewComponent implements OnInit {
  private readonly dossierInternalService = inject(DossierInternalService);

  tthDossiers: TthDossier[] = [];
  totalCount$ = 0;
  tableColumns: TableColumn<TthDossier>[] = [];
  selectedCheckBox = new SelectionModel<TthDossier>(true, []);
  isCheckBoxModeActive = false;
  tableFilterConfig!: TableFilter<unknown>[][];

  ngOnInit(): void {
    this.tableColumns = this.getTableColumns();
    this.getOverview();
  }

  getOverview() {
    this.dossierInternalService
      .getOverview()
      .pipe(catchError(this.handleError()))
      .subscribe((container: ContainerTthDossier[]) => {
        console.log('Dossier overview:', container);
      });
  }

  private handleError() {
    return () => {
      return EMPTY;
    };
  }

  test() {
    console.log('test');
  }

  private getTableColumns(): TableColumn<TthDossier>[] {
    return [
      {
        headerTitle: 'TTH.STATEMENT_STATUS_HEADER',
        value: 'dossierStatus',
      },
      {
        headerTitle: 'TTH.SWISS_CANTON',
        value: 'swissCanton',
      },
      { headerTitle: 'ID', value: 'id' },
      {
        headerTitle: 'TTH.DOSSIER.TOPIC',
        value: 'topic',
      },
      {
        headerTitle: 'COMMON.EDIT_ON',
        value: 'editionDate',
        formatAsDate: true,
      },
    ];
  }
}
