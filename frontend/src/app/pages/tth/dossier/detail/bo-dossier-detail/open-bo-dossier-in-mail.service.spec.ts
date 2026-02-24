import { TestBed } from '@angular/core/testing';

import { OpenBoDossierInMailService } from './open-bo-dossier-in-mail.service';
import { AppTestingModule } from '../../../../../app.testing.module';
import { TranslatePipe } from '@ngx-translate/core';
import { translateServiceProvider } from '../../../../../app.testing.mocks';

const translatePipeSpy = jasmine.createSpyObj('translatePipe', ['transform']);
translatePipeSpy.transform
  .withArgs('TTH.DOSSIER.INQUIRY_FROM_THE_CANTON')
  .and.returnValue('Rückfrage des Kantons')
  .withArgs('TTH.CANTON.BE')
  .and.returnValue('Bern');

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
    spyOn(window, 'open');

    service.openDossierInMail({
      topic: 'Thema',
      cantonQuestion: 'Frage an das Transportunternehmen',
      swissCanton: 'BERN',
    });

    const result =
      'mailto:?subject=Dossier%20%22Thema%22&body=R%C3%BCckfrage%20des%20Kantons%20%5BBern%5D%20%0AFrage%20an%20das%20Transportunternehmen';
    expect(window.open).toHaveBeenCalledWith(result, '_self');
  });
});
