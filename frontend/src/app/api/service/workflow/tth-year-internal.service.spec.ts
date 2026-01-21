import { TestBed } from '@angular/core/testing';
import { AtlasApiService } from '../atlas-api.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../core/auth/user/user.service';
import { TthYearInternalService } from './tth-year-internal.service';

describe('TthYearInternalService', () => {
  let service: TthYearInternalService;
  let apiService: AtlasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TthYearInternalService,
        AtlasApiService,
        { provide: HttpClient, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    });
    service = TestBed.inject(TthYearInternalService);
    apiService = TestBed.inject(AtlasApiService);
    spyOn(apiService, 'post');
    spyOn(apiService, 'validateParams').and.callThrough();
  });

  it('should closeTimetableHearing', () => {
    service.closeTimetableHearing(2025);

    expect(apiService.validateParams).toHaveBeenCalledOnceWith({
      year: 2025,
    });
    expect(apiService.post).toHaveBeenCalledOnceWith(
      '/workflow/internal/tth/year/close/2025',
    );
  });
});
