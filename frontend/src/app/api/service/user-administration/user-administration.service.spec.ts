import {TestBed} from '@angular/core/testing';
import {AtlasApiService} from '../atlas-api.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserService} from '../../../core/auth/user/user.service';
import {UserAdministrationService} from "./user-administration.service";

describe('UserAdministrationService', () => {
  let service: UserAdministrationService;
  let apiService: AtlasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAdministrationService, AtlasApiService,
        { provide: HttpClient, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    });

    service = TestBed.inject(UserAdministrationService);
    apiService = TestBed.inject(AtlasApiService);
    spyOn(apiService, 'validateParams').and.callThrough();
    spyOn(apiService, 'get');
  });

  it('should searchBoDossierAnsweringUsers', () => {
    service.searchBoDossierAnsweringUsers('mail@sbb.ch');

    expect(apiService.get).toHaveBeenCalledOnceWith(
      '/user-administration/v1/search-bo-dossier-answering-users', jasmine.any(HttpParams)
    );
  });

});
