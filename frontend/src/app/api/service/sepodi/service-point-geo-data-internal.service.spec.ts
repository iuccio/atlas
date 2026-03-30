import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY } from 'rxjs';

import { AtlasApiService } from '../atlas-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from '../../../core/auth/user/user.service';
import { ServicePointGeoDataInternalService } from './service-point-geo-data-internal.service';
import { SpatialReference } from '../../model/spatialReference';

describe('ServicePointGeoDataInternalService', () => {
  let service: ServicePointGeoDataInternalService;
  let apiService: AtlasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServicePointGeoDataInternalService,
        AtlasApiService,
        { provide: HttpClient, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    });

    service = TestBed.inject(ServicePointGeoDataInternalService);
    apiService = TestBed.inject(AtlasApiService);
    vi.spyOn(apiService, 'validateParams');
    vi.spyOn(apiService, 'get').mockImplementation(() => EMPTY);
    vi.spyOn(apiService, 'put').mockImplementation(() => EMPTY);
    vi.spyOn(apiService, 'post').mockImplementation(() => EMPTY);
  });

  it('should getLocationInformation', () => {
    service.getLocationInformation({
      east: 123,
      north: 123,
      spatialReference: SpatialReference.Lv95,
    });

    expect(apiService.get).toHaveBeenCalledExactlyOnceWith(
      '/service-point-directory/internal/geodata/reverse-geocode',
      expect.any(HttpParams),
    );
  });
});
