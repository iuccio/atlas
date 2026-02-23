import { TestBed } from '@angular/core/testing';

import { TthDossierOverviewComponent } from './tth-dossier-overview.component';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { TableService } from '../../../../core/components/table/table.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewToTabShareDataService } from '../../overview-tab/service/overview-to-tab-share-data.service';
import { SwissCanton } from '../../../../api';
import { of, throwError } from 'rxjs';

describe('TthDossierOverviewComponent', () => {
  let component: TthDossierOverviewComponent;
  let dossierService: jasmine.SpyObj<DossierInternalService>;
  let tableService: jasmine.SpyObj<TableService>;
  let router: jasmine.SpyObj<Router>;
  let overviewToTabService: OverviewToTabShareDataService;

  beforeEach(() => {
    dossierService = jasmine.createSpyObj('DossierInternalService', [
      'getOverview',
    ]);

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

    TestBed.configureTestingModule({
      providers: [
        TthDossierOverviewComponent,
        OverviewToTabShareDataService,
        { provide: DossierInternalService, useValue: dossierService },
        { provide: TableService, useValue: tableService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
    });

    component = TestBed.inject(TthDossierOverviewComponent);
    overviewToTabService = TestBed.inject(OverviewToTabShareDataService);

    // Setup für den Service
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

  it('should get canton short from service', () => {
    expect(component.cantonShort).toBe('ZH');
  });

  it('should get timetable hearing year from service', () => {
    expect(component.foundTimetableHearingYear.timetableYear).toBe(2024);
  });

  it('should call getOverview with correct parameters', () => {
    const mockContainer = { objects: [], totalCount: 0 };
    dossierService.getOverview.and.returnValue(of(mockContainer));

    component.getOverview({ page: 0, size: 10, sort: 'topic,asc' });

    expect(dossierService.getOverview).toHaveBeenCalledWith(
      2024,
      jasmine.any(String),
      jasmine.anything(),
      [],
      0,
      10,
      jasmine.any(Array)
    );
    expect(component.totalCount$).toBe(0);
  });

  it('should navigate to edit dossier', async () => {
    router.navigate.and.returnValue(Promise.resolve(true));

    component.editDossier(123);

    expect(router.navigate).toHaveBeenCalledWith([123], {
      relativeTo: jasmine.anything(),
    });
  });

  it('should map SwissCanton to short format', () => {
    const result = component.mapToShortCanton(SwissCanton.Zurich);

    expect(result).toBeTruthy();
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
