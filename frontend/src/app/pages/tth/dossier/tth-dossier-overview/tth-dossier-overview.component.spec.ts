import { TestBed } from '@angular/core/testing';
import { TthDossierOverviewComponent } from './tth-dossier-overview.component';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { TableService } from '../../../../core/components/table/table.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewToTabShareDataService } from '../../overview-tab/service/overview-to-tab-share-data.service';
import { HearingStatus, SwissCanton } from '../../../../api';
import { of, throwError } from 'rxjs';
import { Cantons } from '../../../../core/cantons/Cantons';
import { TthDossier } from '../../../../api/model/tthDossier';
import { DossierStatus } from '../../../../api/model/dossierStatus';
import { PermissionService } from '../../../../core/auth/permission/permission.service';
import { UserService } from '../../../../core/auth/user/user.service';

const activatedRouteStub = {
  snapshot: {
    params: {},
    queryParams: {},
    data: { hearingStatus: HearingStatus.Active },
  },
  params: of({}),
  queryParams: of({}),
};

describe('TthDossierOverviewComponent', () => {
  let component: TthDossierOverviewComponent;
  let dossierService: jasmine.SpyObj<DossierInternalService>;
  let tableService: jasmine.SpyObj<TableService>;
  let router: jasmine.SpyObj<Router>;
  let overviewToTabService: OverviewToTabShareDataService;
  let activatedRoute: ActivatedRoute;
  let permissionServiceSpy: jasmine.SpyObj<PermissionService>;
  let userService: jasmine.SpyObj<UserService>;

  function createTestBed() {
    TestBed.configureTestingModule({
      providers: [
        TthDossierOverviewComponent,
        OverviewToTabShareDataService,
        { provide: DossierInternalService, useValue: dossierService },
        { provide: PermissionService, useValue: permissionServiceSpy },
        { provide: UserService, useValue: userService },
        { provide: TableService, useValue: tableService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    });

    component = TestBed.inject(TthDossierOverviewComponent);
    overviewToTabService = TestBed.inject(OverviewToTabShareDataService);

    overviewToTabService.setCantonShort('ZH');
    overviewToTabService.setTimetableHearingYear({
      timetableYear: 2024,
      hearingFrom: new Date(),
      hearingTo: new Date(),
    });
    overviewToTabService.setTimetableHearingYearLoading(false);
  }

  beforeEach(() => {
    dossierService = jasmine.createSpyObj('DossierInternalService', [
      'getOverview',
    ]);

    permissionServiceSpy = jasmine.createSpyObj('PermissionService', [
      'getTthApplicationUserType',
    ]);

    userService = jasmine.createSpyObj(
      'UserService',
      ['setCurrentUserAndLoadPermissions'],
      { currentUser: { email: 'test@example.com', sbbuid: 'u123456' } }
    );

    tableService = jasmine.createSpyObj(
      'TableService',
      ['initializeFilterConfig'],
      {
        pageIndex: 0,
        pageSize: 10,
        sortString: 'topic,asc',
        filter: {
          chipSearch: { getActiveSearch: () => '' },
          multiSelectDossierStatus: { getActiveSearch: () => [] },
        },
      }
    );

    router = jasmine.createSpyObj('Router', ['navigate']);

    createTestBed();

    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Getters', () => {
    it('should get canton short from service', () => {
      expect(component.cantonShort()).toBe('ZH');
    });

    it('should get timetable hearing year from service', () => {
      expect(component.timetableYear().timetableYear).toBe(2024);
    });

    it('should return timetableHearingYearFound from service', () => {
      overviewToTabService.setTimetableHearingYearFound(true);
      expect(component.isTimetableHearingYearFound()).toBe(true);
    });

    it('should check if hearing year is active', () => {
      overviewToTabService.setHearingStatus(HearingStatus.Active);
      expect(component.isHearingYearActive()).toBe(true);
    });

    it('should return true when canton is swiss', () => {
      overviewToTabService.setCantonShort('CH');
      expect(component.isSwissCanton()).toBe(true);
    });

    it('should return false when canton is not swiss', () => {
      overviewToTabService.setCantonShort('ZH');
      expect(component.isSwissCanton()).toBe(false);
    });
  });

  describe('loadData', () => {
    it('should initialize table for active hearing status', () => {
      spyOn(component, 'initOverviewTable');
      overviewToTabService.setHearingStatus(HearingStatus.Active);
      dossierService.getOverview.and.returnValue(
        of({ objects: [], totalCount: 0 })
      );

      component.loadData();

      expect(component.hearingStatus()).toBe(HearingStatus.Active);
      expect(component.tableColumns).toBeDefined();
      expect(tableService.initializeFilterConfig).toHaveBeenCalled();
    });

    it('should initialize table for archived hearing status', () => {
      activatedRoute.snapshot.data = { hearingStatus: HearingStatus.Archived };
      overviewToTabService.setHearingStatus(HearingStatus.Archived);
      spyOn(component, 'initOverviewTable');
      dossierService.getOverview.and.returnValue(
        of({ objects: [], totalCount: 0 })
      );

      component.loadData();

      expect(component.hearingStatus()).toBe(HearingStatus.Archived);
      expect(component.tableColumns).toBeDefined();
    });
  });

  describe('getOverview', () => {
    it('should call getOverview with correct parameters if canton', () => {
      dossierService.getOverview.and.returnValue(
        of({ objects: [], totalCount: 0 })
      );

      component.getOverview({ page: 0, size: 10, sort: 'topic,asc' });

      expect(dossierService.getOverview).toHaveBeenCalledWith(
        2024,
        jasmine.any(String),
        undefined,
        jasmine.anything(),
        [],
        0,
        10,
        jasmine.any(Array)
      );
      expect(component.totalCount).toBe(0);
    });

    it('should call getOverview with correct parameters if bo', () => {
      TestBed.resetTestingModule();
      permissionServiceSpy.getTthApplicationUserType.and.returnValue('BO_TTH');
      createTestBed();

      dossierService.getOverview.and.returnValue(
        of({ objects: [], totalCount: 0 })
      );

      component.getOverview({ page: 0, size: 10, sort: 'topic,asc' });

      expect(dossierService.getOverview).toHaveBeenCalledWith(
        2024,
        jasmine.any(String),
        'u123456',
        jasmine.anything(),
        [DossierStatus.DossierBoCheck],
        0,
        10,
        jasmine.any(Array)
      );
      expect(component.totalCount).toBe(0);
    });

    it('should update tthDossiers and totalCount on success', () => {
      const mockDossiers: TthDossier[] = [
        {
          id: 1,
          topic: 'Test',
          swissCanton: SwissCanton.Zurich,
          statementIds: [],
          questions: [],
          dossierStatus: 'ADDED',
        },
      ];
      dossierService.getOverview.and.returnValue(
        of({ objects: mockDossiers, totalCount: 1 })
      );

      component.getOverview({ page: 0, size: 10, sort: 'topic,asc' });

      expect(component.tthDossiers).toEqual(mockDossiers);
      expect(component.totalCount).toBe(1);
    });

    it('should handle error gracefully', (done) => {
      dossierService.getOverview.and.returnValue(
        throwError(() => new Error('Test error'))
      );

      component.getOverview({ page: 0, size: 10, sort: '' });

      setTimeout(() => {
        expect(component.tthDossiers).toEqual([]);
        done();
      }, 100);
    });
  });

  describe('editDossier', () => {
    it('should navigate to edit dossier', async () => {
      router.navigate.and.returnValue(Promise.resolve(true));

      component.editDossier(123);

      expect(router.navigate).toHaveBeenCalledWith([123], {
        relativeTo: jasmine.anything(),
      });
    });
  });

  describe('mapToShortCanton', () => {
    it('should map SwissCanton to short format', () => {
      const result = component.mapToShortCanton(SwissCanton.Zurich);
      expect(result).toBeTruthy();
    });

    it('should return undefined for unmapped canton', () => {
      spyOn(Cantons, 'fromSwissCanton').and.returnValue(undefined);
      const result = component.mapToShortCanton(SwissCanton.Zurich);
      expect(result).toBeUndefined();
    });
  });

  describe('initOverviewTable', () => {
    it('should call getOverview with table service parameters', () => {
      spyOn(component, 'getOverview');

      component.initOverviewTable();

      expect(component.getOverview).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        sort: 'topic,asc',
      });
    });
  });
});
