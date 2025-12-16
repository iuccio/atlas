import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { loadStatementDetailRoute, routes } from './tth-routing';
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
    expect(tthRoutes.length).toBe(6);
  });

  it('should load CantonStatementDetailComponent', () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', [
      'isTthCanton',
      'isTthBoUser',
    ]);
    permissionServiceSpy.isTthCanton.and.returnValue(true);
    permissionServiceSpy.isTthBoUser.and.returnValue(false);

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
        console.log(component);
        expect(component).toBeDefined();
        expect(component.name).toBe('CantonStatementDetailComponent');
      });

      expect(result).toBeDefined();
    });
  });

  it('should load BoStatementDetailComponent', () => {
    const permissionServiceSpy = jasmine.createSpyObj('PermissionService', [
      'isTthCanton',
      'isTthBoUser',
    ]);
    permissionServiceSpy.isTthCanton.and.returnValue(false);
    permissionServiceSpy.isTthBoUser.and.returnValue(true);

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
        console.log(component);
        expect(component).toBeDefined();
        expect(component.name).toBe('BoStatementDetailComponent');
      });

      expect(result).toBeDefined();
    });
  });
});
