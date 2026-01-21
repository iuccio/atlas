import { Component, inject, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { TableComponent } from '../../../../core/components/table/table.component';
import { TableColumn } from '../../../../core/components/table/table-column';
import { TableFilter } from '../../../../core/components/table-filter/config/table-filter';
import { TthDossier } from '../../../../api/model/tthDossier';
import { HearingStatus, SwissCanton } from '../../../../api';
import { Cantons } from '../../../../core/cantons/Cantons';
import { ActivatedRoute, Router } from '@angular/router';
import { TthTableFilterSettingsService } from '../../tth-table-filter-settings.service';
import { Pages } from '../../../pages';
import { TableService } from '../../../../core/components/table/table.service';
import { TablePagination } from '../../../../core/components/table/table-pagination';

@Component({
  selector: 'atlas-tth-dossier-overview',
  imports: [TableComponent],
  templateUrl: './tth-dossier-overview.component.html',
  providers: [TableService],
})
export class TthDossierOverviewComponent implements OnInit {
  private readonly dossierInternalService = inject(DossierInternalService);
  private readonly tableService = inject(TableService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  tthDossiers: TthDossier[] = [];
  totalCount$ = 0;
  tableColumns: TableColumn<TthDossier>[] = [];
  tableFilterConfig!: TableFilter<unknown>[][];
  hearingStatus = HearingStatus.Active;

  ngOnInit(): void {
    this.tableColumns = this.getTableColumns();
    this.tableFilterConfig = this.tableService.initializeFilterConfig(
      TthTableFilterSettingsService.createDossierSettings(),
      Pages.TTH_DOSSIERS
    );
  }

  getOverview(pagination: TablePagination) {
    this.dossierInternalService
      .getOverview(
        this.tableService.filter.chipSearch.getActiveSearch(),
        this.tableService.filter.multiSelectDossierStatus.getActiveSearch(),
        this.tableService.filter.multiSelectDossierCanton.getActiveSearch(),
        pagination.page,
        pagination.size
      )
      .pipe(catchError(this.handleError()))
      .subscribe((container) => {
        this.tthDossiers = container.objects!;
        this.totalCount$ = container.totalCount!;

        console.log('Dossier overview:', container.objects);
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

  editDossier(id: number) {
    this.router.navigate(['dossiers', id], { relativeTo: this.route });
  }

  mapToShortCanton(canton: SwissCanton) {
    return Cantons.fromSwissCanton(canton)?.short;
  }

  private getTableColumns(): TableColumn<TthDossier>[] {
    return [
      { headerTitle: 'ID', value: 'id' },
      {
        headerTitle: 'TTH.STATEMENT_STATUS_HEADER',
        value: 'dossierStatus',
      },
      {
        headerTitle: 'TTH.SWISS_CANTON',
        value: 'swissCanton',
        callback: this.mapToShortCanton,
      },
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
