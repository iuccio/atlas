import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TthOverviewBaseComponent } from './tth-overview-base.component';
import { HearingStatus, TimetableHearingYear } from '../../../api';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewToTabShareDataService } from '../overview-tab/service/overview-to-tab-share-data.service';
import { TableService } from '../../../core/components/table/table.service';
import { of, Subject } from 'rxjs';
import { TimetableHearingYearInternalService } from '../../../api/service/lidi/timetable-hearing-year-internal.service';
import { TranslatePipe } from '@ngx-translate/core';
import { translateServiceProvider } from '../../../app.testing.mocks';

const mockTimetableHearingYearsService = jasmine.createSpyObj(
  'TimetableHearingYearInternalService',
  ['getHearingYears']
);

const hearingYear2024: TimetableHearingYear = {
  timetableYear: 2024,
  hearingFrom: moment().toDate(),
  hearingTo: moment().toDate(),
};

const hearingYear2025: TimetableHearingYear = {
  timetableYear: 2025,
  hearingFrom: moment().toDate(),
  hearingTo: moment().toDate(),
};

describe('TthOverviewBaseComponent', () => {
  let component: TthOverviewBaseComponent;
  let fixture: ComponentFixture<TthOverviewBaseComponent>;
  let route: ActivatedRoute;
  let tableService: jasmine.SpyObj<TableService>;
  let routerEventsSubject: Subject<Event>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
      url: '/tth/ch/active/statements',
    });

    tableService = jasmine.createSpyObj('TableService', ['resetTableSettings']);

    await TestBed.configureTestingModule({
      imports: [TthOverviewBaseComponent],
      providers: [
        {
          provide: TimetableHearingYearInternalService,
          useValue: mockTimetableHearingYearsService,
        },
        OverviewToTabShareDataService,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { hearingStatus: HearingStatus.Active },
              params: { canton: 'ch' },
              queryParams: {},
            },
          },
        },
        { provide: TableService, useValue: tableService },
        { provide: TranslatePipe },
        translateServiceProvider,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TthOverviewBaseComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);

    mockTimetableHearingYearsService.getHearingYears.and.returnValue(
      of([hearingYear2024, hearingYear2025])
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load timetable hearing years for Active status', () => {
      fixture.detectChanges();

      expect(
        mockTimetableHearingYearsService.getHearingYears
      ).toHaveBeenCalledWith([HearingStatus.Active]);
      expect(component.foundTimetableHearingYear).toEqual(hearingYear2024);
    });

    it('should set noTimetableHearingYearFound when no years exist', () => {
      mockTimetableHearingYearsService.getHearingYears.and.returnValue(of([]));

      fixture.detectChanges();

      expect(component.noTimetableHearingYearFound).toBeTruthy();
    });
  });

  describe('Hearing Status', () => {
    it('should handle Planned hearing status', () => {
      route.snapshot.data = { hearingStatus: HearingStatus.Planned };

      fixture.detectChanges();

      expect(component.isHearingYearActive).toBeFalsy();
      expect(component.isHearingYearPlanned).toBeTruthy();
      expect(
        mockTimetableHearingYearsService.getHearingYears
      ).toHaveBeenCalledWith([HearingStatus.Planned]);
    });
  });
});
