import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { catchError, mergeMap, Observable, of } from 'rxjs';
import {
  ReadServicePointVersion,
  ReadStopPointWorkflow,
  ServicePointsService,
  StopPointWorkflowService,
} from '../../../../api';
import { Pages } from '../../../pages';
import { map } from 'rxjs/operators';

export interface StopPointWorkflowDetailData {
  workflow: ReadStopPointWorkflow;
  servicePoint: ReadServicePointVersion[];
}

@Injectable({ providedIn: 'root' })
export class StopPointWorkflowDetailResolver {
  constructor(
    private readonly workflowService: StopPointWorkflowService,
    private readonly servicePointService: ServicePointsService,
    private readonly router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<StopPointWorkflowDetailData | undefined> {
    const idParameter = parseInt(route.paramMap.get('id') || '0');
    return this.workflowService.getStopPointWorkflow(idParameter).pipe(
      catchError(() => {
        this.router
          .navigate([Pages.SEPODI.path], {
            state: { notDismissSnackBar: true },
          })
          .then();
        return of(undefined);
      }),
      mergeMap((workflow) => {
        if (workflow) {
          return this.servicePointService
            .getServicePointVersionsBySloid(workflow.sloid!)
            .pipe(
              map((servicePoint) => {
                return {
                  workflow: workflow,
                  servicePoint: servicePoint,
                };
              })
            );
        }
        return of();
      })
    );
  }
}

export const stopPointWorkflowDetailResolver: ResolveFn<
  StopPointWorkflowDetailData | undefined
> = (route: ActivatedRouteSnapshot) =>
  inject(StopPointWorkflowDetailResolver).resolve(route);
