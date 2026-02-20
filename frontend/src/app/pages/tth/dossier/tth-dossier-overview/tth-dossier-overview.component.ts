import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { catchError, combineLatest, EMPTY } from 'rxjs';
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
import { OverviewToTabShareDataService } from '../../overview-tab/service/overview-to-tab-share-data.service';
import { TthUtils } from '../../util/tth-utils';
import { TimetableHearingYearInternalService } from '../../../../api/service/lidi/timetable-hearing-year-internal.service';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TthDossierOverviewMenuComponent } from '../tth-dossier-overview-menu/tth-dossier-overview-menu.component';
import { addElementsToArrayWhenNotUndefined } from '../../../../core/util/arrays';

@Component({
  selector: 'atlas-tth-dossier-overview',
  imports: [TableComponent, TthDossierOverviewMenuComponent],
  templateUrl: './tth-dossier-overview.component.html',
  providers: [TableService],
})
export class TthDossierOverviewComponent implements OnInit {
  private readonly dossierInternalService = inject(DossierInternalService);
  private readonly tableService = inject(TableService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly overviewToTabService = inject(OverviewToTabShareDataService);
  private readonly timetableHearingYearsService = inject(
    TimetableHearingYearInternalService
  );
  private destroyRef = inject(DestroyRef);

  tthDossiers: TthDossier[] = [];
  totalCount$ = 0;
  tableColumns: TableColumn<TthDossier>[] = [];
  tableFilterConfig!: TableFilter<unknown>[][];
  hearingStatus = HearingStatus.Active;

  sorting = 'topic,asc';

  get cantonShort() {
    return this.overviewToTabService.getCantonShort();
  }
  get foundTimetableHearingYear() {
    return this.overviewToTabService.getTimetableHearingYear();
  }
  get noTimetableHearingYearFound() {
    return this.overviewToTabService.getNoTimetableHearingYearFound();
  }

  ngOnInit(): void {
    combineLatest([
      this.overviewToTabService.timetableHearingYear$,
      this.overviewToTabService.timetableHearingYearLoading$,
    ])
      .pipe(
        filter(([year, loading]) => !loading && !!year?.timetableYear),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadData();
      });
  }

  private loadData() {
    this.hearingStatus = this.route.snapshot.data.hearingStatus;

    if (TthUtils.isHearingStatusActive(this.hearingStatus)) {
      this.tableColumns = this.getTableColumns();
      this.tableFilterConfig = this.tableService.initializeFilterConfig(
        TthTableFilterSettingsService.createDossierSettings(),
        Pages.TTH_DOSSIERS
      );
      this.initOverviewTable();
    }

    if (TthUtils.isHearingStatusArchived(this.hearingStatus)) {
      this.tableColumns = this.getTableColumns();
      this.tableFilterConfig = this.tableService.initializeFilterConfig(
        TthTableFilterSettingsService.createDossierSettings(),
        Pages.TTH_DOSSIERS
      );
      this.initOverviewTable();
    }
  }

  getOverview(pagination: TablePagination) {
    this.dossierInternalService
      .getOverview(
        this.foundTimetableHearingYear.timetableYear,
        Cantons.getSwissCantonFromShort(this.cantonShort),
        this.tableService.filter.chipSearch.getActiveSearch(),
        this.tableService.filter.multiSelectDossierStatus.getActiveSearch(),
        pagination.page,
        pagination.size,
        addElementsToArrayWhenNotUndefined(
          pagination.sort,
          this.sorting,
          'id,ASC'
        )
      )
      .pipe(catchError(this.handleError()))
      .subscribe((container) => {
        this.tthDossiers = container.objects!;
        this.totalCount$ = container.totalCount!;
      });
  }

  private handleError() {
    return () => {
      return EMPTY;
    };
  }

  editDossier(id: number) {
    this.router
      .navigate([id], {
        relativeTo: this.route,
      })
      .then();
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
      {
        headerTitle: '',
        value: 'editor',
        disabled: false,
        customCell: true,
      },
    ];
  }

  private initOverviewTable() {
    this.getOverview({
      page: this.tableService.pageIndex,
      size: this.tableService.pageSize,
      sort: this.tableService.sortString,
    });
  }
}
