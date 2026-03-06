import { inject } from '@angular/core';
import { PermissionService } from '../../core/auth/permission/permission.service';
import { Router, UrlTree } from '@angular/router';
import { Pages } from '../pages';
import { Cantons } from '../../core/cantons/Cantons';

export const boUserGuard = (): boolean | UrlTree => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  const userType = permissionService.getTthApplicationUserType();

  if (userType === 'BO_TTH') {
    return router.parseUrl(
      `/${Pages.TTH.path}/${Cantons.swiss.path}/${Pages.TTH_ACTIVE.path}/${Pages.TTH_DOSSIERS.path}`
    );
  }
  return true;
};
