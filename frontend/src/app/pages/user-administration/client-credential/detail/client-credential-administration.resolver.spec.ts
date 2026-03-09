import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClientCredential } from '../../../../api';
import { AppTestingModule } from '../../../../app.testing.module';
import {
  ClientCredentialAdministrationResolver,
  clientCredentialResolver,
} from './client-credential-administration.resolver';
import { ClientCredentialAdministrationService } from '../../../../api/service/user-administration/client-credential-administration.service';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

const clientCredential: ClientCredential = {
  clientCredentialId: '23456789',
};

const routerStateSnapshot = {} as any;

describe('ClientCredentialAdministrationResolver', () => {
  let clientCredentialAdministrationService: Mocked<
    Pick<ClientCredentialAdministrationService, 'getClientCredential'>
  >;
  let resolver: ClientCredentialAdministrationResolver;

  beforeEach(() => {
    clientCredentialAdministrationService = {
      getClientCredential: vi.fn().mockReturnValue(of(clientCredential)),
    };
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        ClientCredentialAdministrationResolver,
        {
          provide: ClientCredentialAdministrationService,
          useValue: clientCredentialAdministrationService,
        },
      ],
    });
    resolver = TestBed.inject(ClientCredentialAdministrationResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get client credential from service to display', () => {
    const mockRoute = {
      paramMap: convertToParamMap({ clientId: '23456789' }),
    } as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      clientCredentialResolver(mockRoute, routerStateSnapshot)
    ) as Observable<ClientCredential>;

    result.subscribe((snapshot) => {
      expect(snapshot.clientCredentialId).toBe('23456789');
    });
    expect(
      clientCredentialAdministrationService.getClientCredential
    ).toHaveBeenCalledExactlyOnceWith('23456789');
  });
});
