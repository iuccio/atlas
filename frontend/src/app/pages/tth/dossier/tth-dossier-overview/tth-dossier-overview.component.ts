import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { TableComponent } from '../../../../core/components/table/table.component';
import { TableColumn } from '../../../../core/components/table/table-column';
import { TableFilter } from '../../../../core/components/table-filter/config/table-filter';
import { TthDossier } from '../../../../api/model/tthDossier';
import {
  HearingStatus,
  SwissCanton,
  TimetableHearingYear,
} from '../../../../api';
import { Cantons } from '../../../../core/cantons/Cantons';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TthTableFilterSettingsService } from '../../tth-table-filter-settings.service';
import { Pages } from '../../../pages';
import { TableService } from '../../../../core/components/table/table.service';
import { TablePagination } from '../../../../core/components/table/table-pagination';
import { OverviewToTabShareDataService } from '../../overview-tab/service/overview-to-tab-share-data.service';
import moment from 'moment/moment';
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

  cantonShort!: string;
  tthDossiers: TthDossier[] = [];
  totalCount$ = 0;
  tableColumns: TableColumn<TthDossier>[] = [];
  tableFilterConfig!: TableFilter<unknown>[][];
  hearingStatus = HearingStatus.Active;
  CANTON_DROPDOWN_OPTIONS = Cantons.cantonsWithSwiss.map(
    (value) => value.short
  );
  defaultDropdownCantonSelection = this.CANTON_DROPDOWN_OPTIONS[0];
  foundTimetableHearingYear: TimetableHearingYear = {
    timetableYear: moment().toDate().getFullYear() + 1,
    hearingFrom: moment().toDate(),
    hearingTo: moment().toDate(),
  };

  YEAR_DROPDOWN_OPTIONS: number[] = [];
  yearSelection = this.YEAR_DROPDOWN_OPTIONS[0];
  noTimetableHearingYearFound = false;
  sorting = 'topic,asc';

  get isHearingYearActive(): boolean {
    return TthUtils.isHearingStatusActive(this.hearingStatus);
  }

  ngOnInit(): void {
    this.loadData();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadData();
      });
  }

  loadData() {
    this.hearingStatus = this.route.snapshot.data.hearingStatus;
    this.syncCantonShortSharedDate();
    this.defaultDropdownCantonSelection =
      this.initDefaultDropdownCantonSelection();
    if (TthUtils.isHearingStatusActive(this.hearingStatus)) {
      this.initOverviewActiveTable();
      this.tableColumns = this.getTableColumns();
      this.tableFilterConfig = this.tableService.initializeFilterConfig(
        TthTableFilterSettingsService.createDossierSettings(),
        Pages.TTH_DOSSIERS
      );
    }

    if (TthUtils.isHearingStatusArchived(this.hearingStatus)) {
      this.tableColumns = this.getTableColumns();
      this.tableFilterConfig = this.tableService.initializeFilterConfig(
        TthTableFilterSettingsService.createDossierSettings(),
        Pages.TTH_DOSSIERS
      );
      this.getTimetableHearingYear(HearingStatus.Archived, true);
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

  private initDefaultDropdownCantonSelection() {
    return this.CANTON_DROPDOWN_OPTIONS[
      this.CANTON_DROPDOWN_OPTIONS.findIndex(
        (value) => value.toLowerCase() === this.cantonShort.toLowerCase()
      )
    ];
  }

  private syncCantonShortSharedDate() {
    this.overviewToTabService.cantonShort$.subscribe(
      (res) => (this.cantonShort = res)
    );
    this.overviewToTabService.changeData(this.cantonShort);
  }

  private initOverviewTable() {
    this.getOverview({
      page: this.tableService.pageIndex,
      size: this.tableService.pageSize,
      sort: this.tableService.sortString,
    });
  }

  private getTimetableHearingYear(
    hearingStatus: HearingStatus,
    sortReverse: boolean
  ) {
    this.timetableHearingYearsService
      .getHearingYears([hearingStatus])
      .subscribe((timetableHearingYears) => {
        if (timetableHearingYears.length === 0) {
          this.noTimetableHearingYearFound = true;
        } else if (timetableHearingYears.length >= 1) {
          const foundTimetableHearingYears =
            TthUtils.sortByTimetableHearingYear(
              timetableHearingYears,
              sortReverse
            );
          this.setFoundHearingYear(foundTimetableHearingYears);
          this.initOverviewTable();
        }
      });
  }

  private initOverviewActiveTable() {
    this.timetableHearingYearsService
      .getHearingYears([HearingStatus.Active])
      .subscribe((timetableHearingYears) => {
        if (timetableHearingYears) {
          if (timetableHearingYears.length === 0) {
            this.noTimetableHearingYearFound = true;
          } else if (timetableHearingYears.length >= 1) {
            this.foundTimetableHearingYear = timetableHearingYears[0];

            this.tableColumns = this.getTableColumns();
            this.initOverviewTable();
          }
        }
      });
  }

  setFoundHearingYear(timetableHearingYears: TimetableHearingYear[]) {
    this.YEAR_DROPDOWN_OPTIONS = timetableHearingYears.map(
      (value) => value.timetableYear
    );
    const paramYear = this.route.snapshot.queryParams.year;
    if (paramYear) {
      this.setFoundHearingYearWhenQueryParamIsProvided(
        timetableHearingYears,
        Number(paramYear)
      );
    } else {
      this.setYearSelection(this.YEAR_DROPDOWN_OPTIONS[0]);
      this.foundTimetableHearingYear = timetableHearingYears[0];
    }
  }

  private setFoundHearingYearWhenQueryParamIsProvided(
    timetableHearingYears: TimetableHearingYear[],
    paramYear: number
  ) {
    const matchedHearingYear = timetableHearingYears.find(
      (value) => value.timetableYear === paramYear
    );
    if (matchedHearingYear) {
      this.foundTimetableHearingYear = matchedHearingYear;
      this.setYearSelection(
        this.YEAR_DROPDOWN_OPTIONS[
          this.YEAR_DROPDOWN_OPTIONS.findIndex(
            (value) => value === matchedHearingYear.timetableYear
          )
        ]
      );
    } else {
      this.setYearSelection(this.YEAR_DROPDOWN_OPTIONS[0]);
      this.foundTimetableHearingYear = timetableHearingYears[0];
      this.router
        .navigate([
          Pages.TTH.path,
          this.cantonShort.toLowerCase(),
          this.hearingStatus.toLowerCase(),
        ])
        .then();
    }
  }

  private setYearSelection(year: number) {
    this.yearSelection = year;
  }
}
