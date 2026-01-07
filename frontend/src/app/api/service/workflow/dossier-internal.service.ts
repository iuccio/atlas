import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AtlasApiService } from '../atlas-api.service';
import { TthDossier } from '../../model/tthDossier';

@Injectable({
  providedIn: 'root',
})
export class DossierInternalService {

  private readonly BASE_PATH = '/workflow/internal/tth/dossier';

  private readonly atlasApiService = inject(AtlasApiService);

  public getDossier(id: number): Observable<TthDossier> {
    this.atlasApiService.validateParams({ id });
    return this.atlasApiService.get(`${this.BASE_PATH}/${encodeURIComponent(String(id))}`);
  }

}
