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
import { MatSelectChange } from '@angular/material/select';
import { TthUtils } from '../util/tth-utils';

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
  let overviewToTabService: OverviewToTabShareDataService;
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
    overviewToTabService = TestBed.inject(OverviewToTabShareDataService);

    mockTimetableHearingYearsService.getHearingYears.and.returnValue(
      of([hearingYear2024, hearingYear2025])
    );

    overviewToTabService.changeData('ZH');
    overviewToTabService.setTimetableHearingYear({
      timetableYear: 2024,
      hearingFrom: new Date(),
      hearingTo: new Date(),
    });
    overviewToTabService.setTimetableHearingYearLoading(false);
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

    it('should handle Archived hearing status', () => {
      route.snapshot.data = { hearingStatus: HearingStatus.Archived };
      spyOn(TthUtils, 'isHearingStatusArchived').and.returnValue(true);
      spyOn(component, 'initOverviewArchivedTable');

      fixture.detectChanges();

      expect(component.hearingStatus).toBe(HearingStatus.Archived);
    });
  });

  describe('Archived Table Initialization', () => {
    it('should initialize archived table when hearing status is archived', () => {
      route.snapshot.data = { hearingStatus: HearingStatus.Archived };
      spyOn(component, 'initOverviewArchivedTable');

      fixture.detectChanges();

      expect(component.initOverviewArchivedTable).toHaveBeenCalled();
    });
  });

  describe('changeSelectedCantonFromDropdown', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.foundTimetableHearingYear = {
        timetableYear: 2024,
        hearingFrom: new Date(),
        hearingTo: new Date(),
      };
    });

    it('should change canton and navigate', () => {
      const mockSelectChange = {
        value: 'ZH',
      } as MatSelectChange;

      spyOn(overviewToTabService, 'changeData');
      spyOn(component, 'navigateTo');

      component.changeSelectedCantonFromDropdown(mockSelectChange);

      expect(overviewToTabService.changeData).toHaveBeenCalledWith('zh');
      expect(component.navigateTo).toHaveBeenCalledWith('zh', 2024);
      expect(tableService.resetTableSettings).toHaveBeenCalled();
    });

    it('should convert canton to lowercase', () => {
      const mockSelectChange = {
        value: 'BE',
      } as MatSelectChange;

      spyOn(overviewToTabService, 'changeData');
      spyOn(component, 'navigateTo');

      component.changeSelectedCantonFromDropdown(mockSelectChange);

      expect(overviewToTabService.changeData).toHaveBeenCalledWith('be');
      expect(component.navigateTo).toHaveBeenCalledWith('be', 2024);
    });
  });

  describe('changeSelectedYearFromDropdown', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.foundTimetableHearingYear = {
        timetableYear: 2024,
        hearingFrom: new Date(),
        hearingTo: new Date(),
      };
      component.cantonShort = 'ZH';
    });

    it('should change year and navigate', () => {
      const mockSelectChange = {
        value: 2025,
      } as MatSelectChange;

      spyOn(overviewToTabService, 'setTimetableHearingYear');
      spyOn(component, 'navigateTo');

      component.changeSelectedYearFromDropdown(mockSelectChange);

      expect(component.foundTimetableHearingYear.timetableYear).toBe(2025);
      expect(overviewToTabService.setTimetableHearingYear).toHaveBeenCalledWith(
        component.foundTimetableHearingYear
      );
      expect(component.navigateTo).toHaveBeenCalledWith('zh', 2025);
      expect(tableService.resetTableSettings).toHaveBeenCalled();
    });

    it('should update timetable hearing year object', () => {
      const mockSelectChange = {
        value: 2026,
      } as MatSelectChange;

      spyOn(overviewToTabService, 'setTimetableHearingYear');
      spyOn(component, 'navigateTo');
      component.cantonShort = 'BE';

      component.changeSelectedYearFromDropdown(mockSelectChange);

      expect(component.foundTimetableHearingYear.timetableYear).toBe(2026);
    });
  });
});
