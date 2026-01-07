import { TestBed } from '@angular/core/testing';
import { AtlasApiService } from '../atlas-api.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../core/auth/user/user.service';
import { DossierInternalService } from './dossier-internal.service';
import { TthDossier } from '../../model/tthDossier';
import { SwissCanton } from '../../model/swissCanton';

describe('DossierInternalService', () => {
  let service: DossierInternalService;
  let apiService: AtlasApiService;

  const dossier: TthDossier = {
    swissCanton: SwissCanton.Bern,
    boContactMail: 'info@bls.ch',
    boDeadlineToAnswer: new Date('2014-12-14'),
    questions: [{ question: 'Habt ihr mehr Busse?' }],
    statementIds: [1000],
    id: 1234,
    topic: 'Mehr Busse bitte',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DossierInternalService,
        AtlasApiService,
        { provide: HttpClient, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    });
    service = TestBed.inject(DossierInternalService);
    apiService = TestBed.inject(AtlasApiService);
    spyOn(apiService, 'get');
    spyOn(apiService, 'post');
    spyOn(apiService, 'validateParams').and.callThrough();
    spyOn(apiService, 'paramsOf').and.callThrough();
  });

  it('should get dossier', () => {
    // when
    service.getDossier(5);

    // then
    expect(apiService.get).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier/5');
  });

  it('should create dossier', () => {
    // when
    service.createDossier(dossier);

    // then
    expect(apiService.post).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier', dossier);
  });

});
