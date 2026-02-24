import { inject, Injectable } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SwissCanton } from '../../../../../api';
import { Cantons } from '../../../../../core/cantons/Cantons';

export interface BoDossierMailData {
  topic: string;
  cantonQuestion: string;
  swissCanton: SwissCanton;
}

@Injectable({
  providedIn: 'root',
})
export class OpenBoDossierInMailService {
  private readonly translatePipe = inject(TranslatePipe);

  openDossierInMail(data: BoDossierMailData) {
    const subject = 'Dossier ' + `"${data.topic}"`;
    const canton = this.getCantonLabel(data.swissCanton);
    const inquiryFromCantonLabel = this.getInquiryFromCantonLabel();
    const body = `${inquiryFromCantonLabel} [${canton}] \n${data.cantonQuestion}`;

    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_self'
    );
  }

  private getInquiryFromCantonLabel() {
    return this.translatePipe.transform('TTH.DOSSIER.INQUIRY_FROM_THE_CANTON');
  }

  private getCantonLabel(swissCanton: SwissCanton) {
    return this.translatePipe.transform(
      'TTH.CANTON.' + Cantons.fromSwissCanton(swissCanton)?.short
    );
  }
}
