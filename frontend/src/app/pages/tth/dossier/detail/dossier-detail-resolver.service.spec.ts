import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  DossierDetailResolver,
  dossierResolver,
} from './dossier-detail-resolver.service';
import { Observable, of, throwError } from 'rxjs';
import { TthDossier } from '../../../../api/model/tthDossier';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { HearingStatus, SwissCanton } from '../../../../api';

const dossier: TthDossier = {
  swissCanton: SwissCanton.Bern,
  boContactMail: 'info@bls.ch',
  boDeadlineToAnswer: new Date('2014-12-14'),
  questions: [{ question: 'Habt ihr mehr Busse?' }],
  statementIds: [1000],
  id: 1234,
  topic: 'Mehr Busse bitte',
};

describe('DossierDetailResolver', () => {
  const dossierInternalService = jasmine.createSpyObj(
    'DossierInternalService',
    ['getDossier']
  );
  const router = jasmine.createSpyObj('Router', {
    navigate: Promise.resolve(true),
  });

  let resolver: DossierDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DossierDetailResolver,
        {
          provide: DossierInternalService,
          useValue: dossierInternalService,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    });
    resolver = TestBed.inject(DossierDetailResolver);

    dossierInternalService.getDossier.and.returnValue(of(dossier));
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get dossier from service', () => {
    const mockRoute = {
      paramMap: convertToParamMap({ id: '1234' }),
    } as ActivatedRouteSnapshot;
    mockRoute.data = { hearingStatus: HearingStatus.Archived };

    const result = TestBed.runInInjectionContext(() =>
      dossierResolver(mockRoute, {} as RouterStateSnapshot)
    ) as Observable<TthDossier | undefined>;

    result.subscribe((statement) => {
      expect(statement).toBeTruthy();
      expect(statement!.id).toBe(1234);
    });
  });

  it('should be undefined on add', () => {
    const mockRoute = {
      paramMap: convertToParamMap({ id: 'add' }),
    } as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      dossierResolver(mockRoute, {} as RouterStateSnapshot)
    ) as Observable<TthDossier | undefined>;

    result.subscribe((statement) => {
      expect(statement).toBeUndefined();
    });
  });

  it('should route on error', () => {
    dossierInternalService.getDossier.and.returnValue(
      throwError(() => 'Dossier not found')
    );

    const mockRoute = {
      paramMap: convertToParamMap({ id: '1234' }),
    } as ActivatedRouteSnapshot;
    mockRoute.data = { hearingStatus: HearingStatus.Archived };

    const result = TestBed.runInInjectionContext(() =>
      dossierResolver(mockRoute, {} as RouterStateSnapshot)
    ) as Observable<TthDossier | undefined>;
    result.subscribe((statement) => {
      expect(statement).toBeUndefined();
    });
    expect(router.navigate).toHaveBeenCalled();
  });
});
