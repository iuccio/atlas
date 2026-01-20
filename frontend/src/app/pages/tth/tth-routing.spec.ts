import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  loadDossierDetailRoute,
  loadStatementDetailRoute,
  routes,
} from './tth-routing';
import { provideHttpClient } from '@angular/common/http';
import { PermissionService } from '../../core/auth/permission/permission.service';

describe('TTH Routing', () => {
  it('should construct router with tth routes', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    const router = TestBed.inject(Router);
    expect(router).toBeTruthy();
    const tthRoutes = router.config;
    expect(tthRoutes.length).toBe(7);
  });

  it('should load CantonStatementDetailComponent', () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', [
      'getTthApplicationUserType',
    ]);
    permissionServiceSpy.getTthApplicationUserType.and.returnValue(
      'CANTON_TTH'
    );

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        {
          provide: PermissionService,
          useValue: permissionServiceSpy,
        },
      ],
    }).runInInjectionContext(async () => {
      const router = TestBed.inject(Router);
      expect(router).toBeTruthy();
      const result = loadStatementDetailRoute().then((component) => {
        expect(component).toBeDefined();
        expect(component.name).toBe('CantonStatementDetailComponent');
      });

      expect(result).toBeDefined();
    });
  });

  it('should load BoStatementDetailComponent', () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', [
      'getTthApplicationUserType',
    ]);
    permissionServiceSpy.getTthApplicationUserType.and.returnValue('BO_TTH');

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        {
          provide: PermissionService,
          useValue: permissionServiceSpy,
        },
      ],
    }).runInInjectionContext(async () => {
      const router = TestBed.inject(Router);
      expect(router).toBeTruthy();
      const result = loadStatementDetailRoute().then((component) => {
        expect(component).toBeDefined();
        expect(component.name).toBe('BoStatementDetailComponent');
      });

      expect(result).toBeDefined();
    });
  });

  it('should load BoDossierDetailComponent', () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', [
      'getTthApplicationUserType',
    ]);
    permissionServiceSpy.getTthApplicationUserType.and.returnValue('BO_TTH');

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        {
          provide: PermissionService,
          useValue: permissionServiceSpy,
        },
      ],
    }).runInInjectionContext(async () => {
      const router = TestBed.inject(Router);
      expect(router).toBeTruthy();
      const result = loadDossierDetailRoute().then((component) => {
        expect(component).toBeDefined();
        expect(component.name).toBe('BoDossierDetailComponent');
      });

      expect(result).toBeDefined();
    });
  });

  it('should load CantonDossierDetailComponent', () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', [
      'getTthApplicationUserType',
    ]);
    permissionServiceSpy.getTthApplicationUserType.and.returnValue(
      'CANTON_TTH'
    );

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        {
          provide: PermissionService,
          useValue: permissionServiceSpy,
        },
      ],
    }).runInInjectionContext(async () => {
      const router = TestBed.inject(Router);
      expect(router).toBeTruthy();
      const result = loadDossierDetailRoute().then((component) => {
        expect(component).toBeDefined();
        expect(component.name).toBe('CantonDossierDetailComponent');
      });

      expect(result).toBeDefined();
    });
  });
});
