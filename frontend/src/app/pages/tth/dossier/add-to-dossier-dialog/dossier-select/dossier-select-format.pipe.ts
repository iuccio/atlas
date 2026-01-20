import { Pipe, PipeTransform } from '@angular/core';
import { TthDossier } from '../../../../../api/model/tthDossier';

@Pipe({
  name: 'dossierSelectFormat',
  pure: true,
})
export class DossierSelectFormatPipe implements PipeTransform {
  transform(dossier: TthDossier): string {
    return `${dossier.id!} - ${dossier.topic}`;
  }
}
