import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AtlasApiService } from '../atlas-api.service';
import { HttpClient } from '@angular/common/http';
import { BusinessOrganisationInternalService } from './business-organisation-internal.service';
import { BusinessOrganisationVersion } from '../../model/businessOrganisationVersion';
import { UserService } from '../../../core/auth/user/user.service';
import { EMPTY } from 'rxjs';

describe('BusinessOrganisationInternalService', () => {
  let service: BusinessOrganisationInternalService;
  let apiService: AtlasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BusinessOrganisationInternalService,
        AtlasApiService,
        { provide: HttpClient, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    });

    service = TestBed.inject(BusinessOrganisationInternalService);
    apiService = TestBed.inject(AtlasApiService);

    vi.spyOn(apiService, 'validateParams');
    vi.spyOn(apiService, 'paramsOf');
    vi.spyOn(apiService, 'post').mockImplementation(() => EMPTY);
    vi.spyOn(apiService, 'delete').mockImplementation(() => EMPTY);
    vi.spyOn(apiService, 'put').mockImplementation(() => EMPTY);
  });

  it('should createBusinessOrganisationVersion', () => {
    const version: BusinessOrganisationVersion = {} as BusinessOrganisationVersion;

    service.createBusinessOrganisationVersion(version);

    expect(apiService.validateParams).toHaveBeenCalledExactlyOnceWith({
      businessOrganisationVersion: version,
    });
    expect(apiService.post).toHaveBeenCalledExactlyOnceWith(
      '/business-organisation-directory/internal/business-organisations/versions',
      version
    );
  });

  it('should deleteBusinessOrganisation', () => {
    const sboid = '123-abc';

    service.deleteBusinessOrganisation(sboid);

    expect(apiService.validateParams).toHaveBeenCalledExactlyOnceWith({
      sboid,
    });
    expect(apiService.delete).toHaveBeenCalledExactlyOnceWith(
      '/business-organisation-directory/internal/business-organisations/' + encodeURIComponent(sboid)
    );
  });

  it('should revokeBusinessOrganisation', () => {
    const sboid = '456-def';

    service.revokeBusinessOrganisation(sboid);

    expect(apiService.validateParams).toHaveBeenCalledExactlyOnceWith({
      sboid,
    });
    expect(apiService.post).toHaveBeenCalledExactlyOnceWith(
      '/business-organisation-directory/internal/business-organisations/' + encodeURIComponent(sboid) + '/revoke'
    );
  });

  it('should updateBusinessOrganisationVersion', () => {
    const id = 42;
    const version: BusinessOrganisationVersion = {} as BusinessOrganisationVersion;

    service.updateBusinessOrganisationVersion(id, version);

    expect(apiService.validateParams).toHaveBeenCalledExactlyOnceWith({
      id,
      businessOrganisationVersion: version,
    });
    expect(apiService.put).toHaveBeenCalledExactlyOnceWith(
      '/business-organisation-directory/internal/business-organisations/versions/' + id,
      version
    );
  });
});
