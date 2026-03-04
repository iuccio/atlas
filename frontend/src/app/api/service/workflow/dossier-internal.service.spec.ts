import {TestBed} from '@angular/core/testing';
import {AtlasApiService} from '../atlas-api.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserService} from '../../../core/auth/user/user.service';
import {DossierInternalService} from './dossier-internal.service';
import {TthDossier} from '../../model/tthDossier';
import {SwissCanton} from '../../model/swissCanton';
import {DossierStatus} from '../../model/dossierStatus';
import {BoAnswer} from '../../model/boAnswer';

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
    spyOn(apiService, 'put');
    spyOn(apiService, 'validateParams').and.callThrough();
    spyOn(apiService, 'paramsOf').and.callThrough();
  });

  it('should get dossier', () => {
    // when
    service.getDossier(5);

    // then
    expect(apiService.get).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier/5');
  });

  it('should get dossier overview', () => {
    // when
    service.getOverview(2026, SwissCanton.Bern, undefined, ['Busse']);

    // then
    expect(apiService.get).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier', jasmine.any(HttpParams));
  });

  it('should create dossier', () => {
    // when
    service.createDossier(dossier);

    // then
    expect(apiService.post).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier', dossier);
  });

  it('should update dossier', () => {
    // when
    service.updateDossier(dossier);

    // then
    expect(apiService.put).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier/1234', dossier);
  });

  it('should send dossier to bo', () => {
    // when
    service.sendDossierToBo(5);

    // then
    expect(apiService.post).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier/5/send-to-bo');
  });

  it('should complete dossier', () => {
    // when
    service.completeDossier(5, DossierStatus.Accepted);

    // then
    expect(apiService.post).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier/5/complete/ACCEPTED');
  });


  it('should answer question', () => {
    // when
    const baAnswer: BoAnswer = {answerToCanton: "Alles gut!"}
    service.answerQuestion(5, baAnswer);

    // then
    expect(apiService.post).toHaveBeenCalledOnceWith('/workflow/internal/tth/dossier/answer/5', baAnswer);
  });

});
