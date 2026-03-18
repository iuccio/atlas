import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi, type Mocked } from 'vitest';

import { OpenBoDossierInMailService } from './open-bo-dossier-in-mail.service';
import { AppTestingModule } from '../../../../../app.testing.module';
import { TranslatePipe } from '@ngx-translate/core';
import { translateServiceProvider } from '../../../../../app.testing.mocks';

const translatePipeSpy: Mocked<Pick<TranslatePipe, 'transform'>> = {
  transform: vi.fn((key: string | null | undefined) => {
    switch (key) {
      case 'TTH.DOSSIER.INQUIRY_FROM_THE_CANTON':
        return 'Rückfrage des Kantons';
      case 'TTH.CANTON.BE':
        return 'Bern';
      default:
        return key;
    }
  }),
};

describe('OpenBoDossierInMailService', () => {
  let service: OpenBoDossierInMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        translateServiceProvider,
        { provide: OpenBoDossierInMailService },
        { provide: TranslatePipe, useValue: translatePipeSpy },
      ],
    })
      .compileComponents()
      .then();

    service = TestBed.inject(OpenBoDossierInMailService);
  });

  it('should open mailto link', () => {
    const windowOpenSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null);

    service.openDossierInMail({
      topic: 'Thema',
      cantonQuestion: 'Frage an das Transportunternehmen',
      swissCanton: 'BERN',
    });

    const result =
      'mailto:?subject=Dossier%20%22Thema%22&body=R%C3%BCckfrage%20des%20Kantons%20%5BBern%5D%0AFrage%20an%20das%20Transportunternehmen';
    expect(windowOpenSpy).toHaveBeenCalledWith(result, '_self');
  });
});
