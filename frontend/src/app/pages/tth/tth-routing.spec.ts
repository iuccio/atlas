import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import {
  loadDossierDetailRoute,
  loadStatementDetailRoute,
  routes,
} from './tth-routing';
import { provideHttpClient } from '@angular/common/http';
import { PermissionService } from '../../core/auth/permission/permission.service';
import { Location } from '@angular/common';

const testRoutes: Routes = [
  {
    path: 'timetable-hearing',
    children: routes,
  },
];

fdescribe('TTH Routing', () => {
  it('should construct router with tth routes', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    const router = TestBed.inject(Router);
    expect(router).toBeTruthy();
    const tthRoutes = router.config;
    expect(tthRoutes.length).toBe(8);
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
        expect(component.name).toBe('_CantonStatementDetailComponent');
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
        expect(component.name).toBe('_BoStatementDetailComponent');
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
        expect(component.name).toBe('_BoDossierDetailComponent');
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
        expect(component.name).toBe('_CantonDossierDetailComponent');
      });

      expect(result).toBeDefined();
    });
  });

  it('should redirect active to statements', (done) => {
    TestBed.configureTestingModule({
      providers: [provideRouter(testRoutes)],
    });

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    router.navigateByUrl('/timetable-hearing/zh/active').then(() => {
      expect(location.path()).toBe('/timetable-hearing/zh/active/statements');
      done();
    });
  });

  it('should redirect archived to statements', (done) => {
    TestBed.configureTestingModule({
      providers: [provideRouter(testRoutes)],
    });

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    router.navigateByUrl('/timetable-hearing/zh/archived').then(() => {
      expect(location.path()).toBe('/timetable-hearing/zh/archived/statements');
      done();
    });
  });

  it('should resolve archived dossier route', (done) => {
    TestBed.configureTestingModule({
      providers: [provideRouter(testRoutes)],
    });

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    router.navigateByUrl('/timetable-hearing/zh/archived/dossiers').then(() => {
      expect(location.path()).toBe('/timetable-hearing/zh/archived/dossiers');
      done();
    });
  });

  it('should resolve active dossier route', (done) => {
    TestBed.configureTestingModule({
      providers: [provideRouter(testRoutes)],
    });

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    router.navigateByUrl('/timetable-hearing/zh/active/dossiers').then(() => {
      expect(location.path()).toBe('/timetable-hearing/zh/active/dossiers');
      done();
    });
  });
});
