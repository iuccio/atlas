import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { OverviewToTabShareDataService } from '../overview-tab/service/overview-to-tab-share-data.service';
import { TimetableHearingYearInternalService } from '../../../api/service/lidi/timetable-hearing-year-internal.service';
import { HearingStatus, TimetableHearingYear } from '../../../api';
import moment from 'moment';
import { Cantons } from '../../../core/cantons/Cantons';
import { TthUtils } from '../util/tth-utils';
import { MatSelectChange } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pages } from '../../pages';
import { OverviewTabHeadingComponent } from '../overview-tab/overview-tab-heading/overview-tab-heading.component';
import { SelectComponent } from '../../../core/form-components/select/select.component';
import { NgOptimizedImage } from '@angular/common';
import { TableService } from '../../../core/components/table/table.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'atlas-tth-overview-base',
  imports: [
    OverviewTabHeadingComponent,
    SelectComponent,
    NgOptimizedImage,
    RouterOutlet,
  ],
  templateUrl: './tth-overview-base.component.html',
})
export class TthOverviewBaseComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overviewToTabService = inject(OverviewToTabShareDataService);
  private readonly timetableHearingYearsService = inject(
    TimetableHearingYearInternalService
  );
  private readonly tableService = inject(TableService);

  cantonShort!: string;
  hearingStatus!: HearingStatus;
  foundTimetableHearingYear: TimetableHearingYear = {
    timetableYear: moment().toDate().getFullYear() + 1,
    hearingFrom: moment().toDate(),
    hearingTo: moment().toDate(),
  };

  YEAR_DROPDOWN_OPTIONS: number[] = [];
  yearSelection = 0;

  CANTON_DROPDOWN_OPTIONS = Cantons.cantonsWithSwiss.map(
    (value) => value.short
  );
  defaultDropdownCantonSelection = this.CANTON_DROPDOWN_OPTIONS[0];

  noTimetableHearingYearFound = false;
  noPlannedTimetableHearingYearFound = false;

  get isHearingYearActive(): boolean {
    return TthUtils.isHearingStatusActive(this.hearingStatus);
  }

  ngOnInit(): void {
    this.initializeBaseComponent();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.initializeBaseComponent();
      });
  }

  private initializeBaseComponent(): void {
    this.hearingStatus = this.route.snapshot.data.hearingStatus;
    this.syncCantonShortSharedData();
    this.defaultDropdownCantonSelection =
      this.initDefaultDropdownCantonSelection();

    if (TthUtils.isHearingStatusActive(this.hearingStatus)) {
      this.initOverviewActiveTable();
    }

    if (TthUtils.isHearingStatusPlanned(this.hearingStatus)) {
      this.initOverviewPlannedTable();
    }

    if (TthUtils.isHearingStatusArchived(this.hearingStatus)) {
      this.initOverviewArchivedTable();
    }
  }

  changeSelectedCantonFromDropdown(selectedCanton: MatSelectChange): void {
    const canton = selectedCanton.value.toLowerCase();
    this.overviewToTabService.changeData(canton);
    this.navigateTo(canton, this.foundTimetableHearingYear.timetableYear);
    this.tableService.resetTableSettings();
  }

  changeSelectedYearFromDropdown(selectedYear: MatSelectChange): void {
    this.foundTimetableHearingYear.timetableYear = selectedYear.value;
    this.overviewToTabService.setTimetableHearingYear(
      this.foundTimetableHearingYear
    );
    this.navigateTo(this.cantonShort.toLowerCase(), selectedYear.value);
    this.tableService.resetTableSettings();
  }

  private navigateTo(canton: string, timetableYear: number): void {
    const currentUrl = this.router.url;
    let currentView = Pages.TTH_STATEMENTS.path;

    if (currentUrl.includes('/' + Pages.TTH_DOSSIERS.path)) {
      currentView = Pages.TTH_DOSSIERS.path;
    }

    this.router.navigate(
      [
        Pages.TTH.path,
        canton.toLowerCase(),
        this.hearingStatus.toLowerCase(),
        currentView,
      ],
      {
        queryParams: { year: timetableYear },
        queryParamsHandling: 'merge',
      }
    );
  }

  private syncCantonShortSharedData(): void {
    this.overviewToTabService.cantonShort$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => (this.cantonShort = res));
    this.overviewToTabService.changeData(this.cantonShort);
    this.checkIfRoutedCantonExists();
  }

  private checkIfRoutedCantonExists(): void {
    const swissCantonEnum = Cantons.getSwissCantonEnum(this.cantonShort);
    if (!swissCantonEnum) {
      this.noTimetableHearingYearFound = true;
      this.router.navigate([Pages.TTH.path]).then();
    }
  }

  private initDefaultDropdownCantonSelection(): string {
    return this.CANTON_DROPDOWN_OPTIONS[
      this.CANTON_DROPDOWN_OPTIONS.findIndex(
        (value) => value.toLowerCase() === this.cantonShort.toLowerCase()
      )
    ];
  }

  private initOverviewActiveTable(): void {
    this.overviewToTabService.setTimetableHearingYearLoading(true);

    this.timetableHearingYearsService
      .getHearingYears([HearingStatus.Active])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((timetableHearingYears) => {
        if (timetableHearingYears.length === 0) {
          this.noTimetableHearingYearFound = true;
          this.overviewToTabService.setNoTimetableHearingYearFound(true);
          this.getPlannedTimetableYearWhenNoActiveFound();
        } else {
          this.noTimetableHearingYearFound = false;
          this.overviewToTabService.setNoTimetableHearingYearFound(false);
          this.foundTimetableHearingYear = timetableHearingYears[0];
          this.overviewToTabService.setTimetableHearingYear(
            this.foundTimetableHearingYear
          );
          this.overviewToTabService.setTimetableHearingYearLoading(false);
        }
      });
  }

  private getPlannedTimetableYearWhenNoActiveFound(): void {
    this.timetableHearingYearsService
      .getHearingYears([HearingStatus.Planned])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((timetableHearingYears) => {
        if (timetableHearingYears && timetableHearingYears?.length >= 1) {
          const foundTimetableHearingYears =
            TthUtils.sortByTimetableHearingYear(timetableHearingYears, false);
          this.foundTimetableHearingYear = foundTimetableHearingYears[0];
          this.overviewToTabService.setTimetableHearingYear(
            this.foundTimetableHearingYear
          );
        } else {
          this.noTimetableHearingYearFound = true;
          this.noPlannedTimetableHearingYearFound = true;
          this.overviewToTabService.setNoPlannedTimetableHearingYearFound(true);
          this.overviewToTabService.setNoTimetableHearingYearFound(true);
        }
        this.overviewToTabService.setTimetableHearingYearLoading(false);
      });
  }

  private initOverviewPlannedTable(): void {
    this.getTimetableHearingYear(HearingStatus.Planned, false);
  }

  private initOverviewArchivedTable(): void {
    this.getTimetableHearingYear(HearingStatus.Archived, true);
  }

  private getTimetableHearingYear(
    hearingStatus: HearingStatus,
    sortReverse: boolean
  ): void {
    this.overviewToTabService.setTimetableHearingYearLoading(true);

    this.timetableHearingYearsService
      .getHearingYears([hearingStatus])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((timetableHearingYears) => {
        if (timetableHearingYears.length === 0) {
          this.noTimetableHearingYearFound = true;
          this.overviewToTabService.setNoTimetableHearingYearFound(true);
        } else {
          this.noTimetableHearingYearFound = false;
          this.overviewToTabService.setNoTimetableHearingYearFound(false);
          const foundTimetableHearingYears =
            TthUtils.sortByTimetableHearingYear(
              timetableHearingYears,
              sortReverse
            );
          this.setFoundHearingYear(foundTimetableHearingYears);
        }
        this.overviewToTabService.setTimetableHearingYearLoading(false);
      });
  }

  private setFoundHearingYear(
    timetableHearingYears: TimetableHearingYear[]
  ): void {
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
      this.yearSelection = this.YEAR_DROPDOWN_OPTIONS[0];
      this.foundTimetableHearingYear = timetableHearingYears[0];

      this.overviewToTabService.setTimetableHearingYear(
        this.foundTimetableHearingYear
      );
    }
  }

  private setFoundHearingYearWhenQueryParamIsProvided(
    timetableHearingYears: TimetableHearingYear[],
    paramYear: number
  ): void {
    const matchedHearingYear = timetableHearingYears.find(
      (value) => value.timetableYear === paramYear
    );

    if (matchedHearingYear) {
      this.foundTimetableHearingYear = matchedHearingYear;
      this.yearSelection = paramYear;
      this.overviewToTabService.setTimetableHearingYear(
        this.foundTimetableHearingYear
      );
    } else {
      this.yearSelection = this.YEAR_DROPDOWN_OPTIONS[0];
      this.foundTimetableHearingYear = timetableHearingYears[0];
      this.overviewToTabService.setTimetableHearingYear(
        this.foundTimetableHearingYear
      );
      this.router
        .navigate(
          [
            Pages.TTH.path,
            this.cantonShort.toLowerCase(),
            this.hearingStatus.toLowerCase(),
          ],
          { queryParamsHandling: 'merge' }
        )
        .then();
    }
  }
}
