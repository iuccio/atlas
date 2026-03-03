import { Injectable } from '@angular/core';
import { Pages } from '../../pages/pages';
import { Page } from '../model/page';
import { PermissionService } from '../auth/permission/permission.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private _viewablePages: BehaviorSubject<Page[]> = new BehaviorSubject([
    ...Pages.pages,
    ...(environment.ttfnEnabled ? [Pages.TTFN] : []),
  ]);
  enabledPages: Observable<Page[]> = this._viewablePages
    .asObservable()
    .pipe(map((pages) => this.filterSubpagesForRole(pages)));

  constructor(private readonly permissionService: PermissionService) {}

  addPagesBasedOnPermissions() {
    const pagesToAdd: Page[] = [
      ...(this.permissionService.mayAccessTimetableHearing()
        ? [Pages.TTH]
        : []),
      ...(this.permissionService.mayAccessBulkImport() &&
      environment.bulkImportEnabled
        ? [Pages.BULK_IMPORT]
        : []),
      ...(this.permissionService.isAdmin ? [...Pages.adminPages] : []),
    ];

    this._viewablePages.next([...this._viewablePages.value, ...pagesToAdd]);
  }

  private filterSubpagesForRole(pages: Page[]): Page[] {
    const userType = this.permissionService.getTthApplicationUserType();

    return pages.map((page) => {
      if (page.path !== Pages.TTH.path) return page;

      if (userType === 'BO_TTH') {
        return { ...page, subpages: undefined };
      }

      return page;
    });
  }
}
