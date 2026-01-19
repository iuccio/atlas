import { TestBed } from '@angular/core/testing';
import { AtlasApiService } from '../atlas-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from '../../../core/auth/user/user.service';
import { TthUserAdministrationService } from './tth-user-administration.service';

describe('TthUserAdministrationService', () => {
  let service: TthUserAdministrationService;
  let apiService: AtlasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TthUserAdministrationService, AtlasApiService,
        { provide: HttpClient, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    });

    service = TestBed.inject(TthUserAdministrationService);
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
