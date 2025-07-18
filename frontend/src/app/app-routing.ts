import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Pages } from './pages/pages';
import { canActivateTimetableHearing } from './core/auth/guards/timetable-hearing.guard';
import { loggedInUsers } from './core/auth/guards/login.guard';
import { adminUser } from './core/auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: Pages.TTFN.path,
    loadChildren: () =>
      import('./pages/ttfn/ttfn-routing').then((r) => r.routes),
    data: { headerTitle: Pages.TTFN.headerTitle },
  },
  {
    path: Pages.BULK_IMPORT.path,
    loadChildren: () =>
      import('./pages/bulk-import/bulk-import-routing').then((r) => r.routes),
    data: { headerTitle: Pages.BULK_IMPORT.headerTitle },
    canActivate: [loggedInUsers],
  },
  {
    path: Pages.LIDI.path,
    loadChildren: () =>
      import('./pages/lidi/lidi.routing').then((r) => r.routes),
    data: { headerTitle: Pages.LIDI.headerTitle },
  },
  {
    path: Pages.BODI.path,
    loadChildren: () =>
      import('./pages/bodi/bodi-routing').then((r) => r.routes),
    data: { headerTitle: Pages.BODI.headerTitle },
  },
  {
    path: Pages.SEPODI.path,
    loadChildren: () =>
      import('./pages/sepodi/sepodi-routing').then((r) => r.routes),
    data: { headerTitle: Pages.SEPODI.headerTitle },
  },
  {
    path: Pages.TTH.path,
    loadChildren: () => import('./pages/tth/tth-routing').then((r) => r.routes),
    data: { headerTitle: Pages.TTH.headerTitle },
    canActivate: [canActivateTimetableHearing],
  },
  {
    path: Pages.PRM.path,
    loadChildren: () => import('./pages/prm/prm-routing').then((r) => r.routes),
    data: { headerTitle: Pages.PRM.headerTitle },
  },
  {
    path: Pages.USER_ADMINISTRATION.path,
    loadChildren: () =>
      import('./pages/user-administration/user-administration-routing').then(
        (r) => r.routes
      ),
    data: { headerTitle: Pages.USER_ADMINISTRATION.headerTitle },
    canActivate: [adminUser],
  },
  {
    path: Pages.HOME.path,
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: {
      headerTitle: Pages.HOME.headerTitle,
    },
  },
  { path: '**', redirectTo: Pages.HOME.path },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRouting {}
