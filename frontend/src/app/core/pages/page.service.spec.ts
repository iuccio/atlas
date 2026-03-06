import { TestBed } from '@angular/core/testing';
import { PageService } from './page.service';
import {
  PermissionService,
  TthApplicationUserType,
} from '../auth/permission/permission.service';
import { Pages } from '../../pages/pages';

const permissionServiceMock: Partial<PermissionService> = {
  mayAccessBulkImport: () => true,
  mayAccessTimetableHearing: () => true,
  mayAccessTtfn: () => true,
  isAdmin: true,
  getTthApplicationUserType: () => 'CANTON_TTH' as TthApplicationUserType,
};

describe('PageService', () => {
  let pageService: PageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PageService,
        { provide: PermissionService, useValue: permissionServiceMock },
      ],
    });
    pageService = TestBed.inject(PageService);
  });

  it('should provide default pages', (done) => {
    pageService.enabledPages.subscribe((enabledPages) => {
      expect(enabledPages).toHaveSize(6);
      done();
    });
  });

  it('should add all pages if allowed', (done) => {
    pageService.addPagesBasedOnPermissions();
    pageService.enabledPages.subscribe((enabledPages) => {
      expect(enabledPages).toHaveSize(9);
      done();
    });
  });

  it('should remove TTH subpages for BO_TTH user', (done) => {
    permissionServiceMock.getTthApplicationUserType = () =>
      'BO_TTH' as TthApplicationUserType;
    pageService.addPagesBasedOnPermissions();

    pageService.enabledPages.subscribe((enabledPages) => {
      const tthPage = enabledPages.find((p) => p.path === Pages.TTH.path);
      expect(tthPage).toBeDefined();
      expect(tthPage?.subpages).toBeUndefined();
      done();
    });
  });

  it('should keep TTH subpages for CANTON_TTH user', (done) => {
    permissionServiceMock.getTthApplicationUserType = () =>
      'CANTON_TTH' as TthApplicationUserType;
    pageService.addPagesBasedOnPermissions();

    pageService.enabledPages.subscribe((enabledPages) => {
      const tthPage = enabledPages.find((p) => p.path === Pages.TTH.path);
      expect(tthPage).toBeDefined();
      expect(tthPage?.subpages).toBeDefined();
      done();
    });
  });
});
