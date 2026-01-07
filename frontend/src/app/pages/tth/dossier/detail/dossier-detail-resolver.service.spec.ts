import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { DossierDetailResolver } from './dossier-detail-resolver.service';
import { of } from 'rxjs';
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
  dossierInternalService.getDossier.and.returnValue(of(dossier));

  let resolver: DossierDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DossierDetailResolver,
        {
          provide: DossierInternalService,
          useValue: dossierInternalService,
        },
      ],
    });
    resolver = TestBed.inject(DossierDetailResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get dossier from service', () => {
    const mockRoute = {
      paramMap: convertToParamMap({ id: '1234' }),
    } as ActivatedRouteSnapshot;
    mockRoute.data = { hearingStatus: HearingStatus.Archived };
    const statement = resolver.resolve(mockRoute);

    statement.subscribe((statement) => {
      expect(statement).toBeTruthy();
      expect(statement!.id).toBe(1234);
    });
  });
});
