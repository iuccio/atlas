import { Routes } from '@angular/router';
import { Pages } from '../pages';
import { HearingStatus } from '../../api';
import { statementResolver } from './statement/statement-detail.resolver';
import { canLeaveDirtyForm } from '../../core/leave-guard/leave-dirty-form-guard.service';
import { inject } from '@angular/core';
import { PermissionService } from '../../core/auth/permission/permission.service';
import { dossierResolver } from './dossier/detail/dossier-detail-resolver.service';

const statementActiveDetailPath = `${Pages.TTH_OVERVIEW_DETAIL.path}/${Pages.TTH_ACTIVE.path}/${Pages.TTH_STATEMENT_DETAILS.path}`;
const statementPlannedDetailPath = `${Pages.TTH_OVERVIEW_DETAIL.path}/${Pages.TTH_PLANNED.path}/${Pages.TTH_STATEMENT_DETAILS.path}`;
const statementArchivedDetailPath = `${Pages.TTH_OVERVIEW_DETAIL.path}/${Pages.TTH_ARCHIVED.path}/${Pages.TTH_STATEMENT_DETAILS.path}`;

export async function loadStatementDetailRoute() {
  const permissionService = inject(PermissionService);
  if (permissionService.getTthApplicationUserType() === 'BO_TTH') {
    const m =
      await import('./statement/statement-detail/bo-statement-detail/bo-statement-detail.component');
    return m.BoStatementDetailComponent;
  }
  if (permissionService.getTthApplicationUserType() === 'CANTON_TTH') {
    const m =
      await import('./statement/statement-detail/canton-statement-detail/canton-statement-detail.component');
    return m.CantonStatementDetailComponent;
  }
  throw new Error('No component statement found for you!!!');
}

export async function loadDossierDetailRoute() {
  const permissionService = inject(PermissionService);
  if (permissionService.getTthApplicationUserType() === 'BO_TTH') {
    const m =
      await import('./dossier/detail/bo-dossier-detail/bo-dossier-detail.component');
    return m.BoDossierDetailComponent;
  }
  if (permissionService.getTthApplicationUserType() === 'CANTON_TTH') {
    const m =
      await import('./dossier/detail/canton-dossier-detail/canton-dossier-detail.component');
    return m.CantonDossierDetailComponent;
  }
  throw new Error('No component statement found for you!!!');
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./overview/timetable-hearing-overview.component').then(
        (m) => m.TimetableHearingOverviewComponent
      ),
  },
  {
    path: statementActiveDetailPath,
    loadComponent: loadStatementDetailRoute,
    canDeactivate: [canLeaveDirtyForm],
    resolve: {
      statement: statementResolver,
    },
    data: {
      hearingStatus: HearingStatus.Active,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: `${Pages.TTH_OVERVIEW_DETAIL.path}/${Pages.TTH_ACTIVE.path}/${Pages.TTH_DOSSIERS.path}/:id`,
    loadComponent: loadDossierDetailRoute,
    canDeactivate: [canLeaveDirtyForm],
    resolve: {
      dossier: dossierResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: statementPlannedDetailPath,
    loadComponent: () =>
      import('././statement/statement-detail/canton-statement-detail/canton-statement-detail.component').then(
        (m) => m.CantonStatementDetailComponent
      ),
    canDeactivate: [canLeaveDirtyForm],
    resolve: {
      statement: statementResolver,
    },
    data: {
      hearingStatus: HearingStatus.Planned,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: statementArchivedDetailPath,
    loadComponent: () =>
      import('./statement/statement-detail/canton-statement-detail/canton-statement-detail.component').then(
        (m) => m.CantonStatementDetailComponent
      ),
    canDeactivate: [canLeaveDirtyForm],
    resolve: {
      statement: statementResolver,
    },
    data: {
      hearingStatus: HearingStatus.Archived,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: Pages.TTH_PLANNED.path,
    loadComponent: () =>
      import('./overview-detail/overview-detail.component').then(
        (m) => m.OverviewDetailComponent
      ),
    data: {
      hearingStatus: HearingStatus.Planned,
    },
  },
  {
    path: Pages.TTH_ARCHIVED.path,
    loadComponent: () =>
      import('./overview-detail/overview-detail.component').then(
        (m) => m.OverviewDetailComponent
      ),
    data: {
      hearingStatus: HearingStatus.Archived,
    },
  },
  {
    path: Pages.TTH_OVERVIEW_DETAIL.path,
    loadComponent: () =>
      import('./overview-tab/overview-tab.component').then(
        (m) => m.OverviewTabComponent
      ),
    children: [
      {
        path: Pages.TTH_ACTIVE.path,
        loadComponent: () =>
          import('./overview-detail/overview-detail.component').then(
            (m) => m.OverviewDetailComponent
          ),
        data: {
          hearingStatus: HearingStatus.Active,
        },
      },
      {
        path: Pages.TTH_DOSSIERS.path,
        loadComponent: () =>
          import('./dossier/tth-dossier-overview/tth-dossier-overview.component').then(
            (m) => m.TthDossierOverviewComponent
          ),
        data: {
          hearingStatus: HearingStatus.Active,
        },
      },

      { path: '**', redirectTo: Pages.TTH_ACTIVE.path },
    ],
  },
  { path: '**', redirectTo: Pages.TTH.path },
];
