import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { ReadServicePointVersion, ServicePointsService } from '../../../../api';
import { catchError, Observable } from 'rxjs';
import { Pages } from '../../../pages';

@Injectable({ providedIn: 'root' })
export class PrmPanelResolver {
  constructor(
    private readonly servicePointsService: ServicePointsService,
    private readonly router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Array<ReadServicePointVersion>> {
    const sloidParameter = route.paramMap.get('stopPointSloid') || '';

    return this.servicePointsService
      .getServicePointVersionsBySloid(sloidParameter)
      .pipe(
        catchError(() =>
          this.router
            .navigate([Pages.PRM.path], {
              state: { notDismissSnackBar: true },
            })
            .then(() => [])
        )
      );
  }
}
export const prmPanelResolver: ResolveFn<Array<ReadServicePointVersion>> = (
  route: ActivatedRouteSnapshot
) => inject(PrmPanelResolver).resolve(route);
