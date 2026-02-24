import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { OpenCantonDossierInMailService } from './open-canton-dossier-in-mail.service';
import { translateServiceProvider } from '../../../../../app.testing.mocks';
import { TimetableHearingStatementInternalService } from '../../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { SwissCanton, TimetableHearingStatementV2 } from '../../../../../api';
import { AppTestingModule } from '../../../../../app.testing.module';
import { of } from 'rxjs';

const translatePipeSpy = jasmine.createSpyObj('translatePipe', ['transform']);
translatePipeSpy.transform
  .withArgs('TTH.DOSSIER.TOPIC')
  .and.returnValue('Thema')

  .withArgs('TTH.DOSSIER.BO_QUESTION')
  .and.returnValue('Frage an das Transportunternehmen')

  .withArgs('TTH.DOSSIER.BO_ANSWER')
  .and.returnValue('Rückmeldung des Transportunternehmens')

  .withArgs('TTH.DOSSIER.INTERNAL_COMMENT')
  .and.returnValue('Interne Begründung zum Zweck der Dokumentation')

  .withArgs('TTH.DOSSIER.PUBLIC_COMMENT')
  .and.returnValue('Öffentliche Begründung für Stellungnehmende')

  .withArgs('TTH.DOSSIER.STATEMENTS')
  .and.returnValue('Stellungnahmen des Dossiers');

const statementWithAnonymStatement: TimetableHearingStatementV2 = {
  id: 456,
  swissCanton: SwissCanton.Bern,
  statement: 'Mehr Bös pls',
  statementAnonymous: true,
  statementSender: {
    emails: new Set('mail@buerger.ch'),
  },
};

const statementWithAnonymizedStatement: TimetableHearingStatementV2 = {
  id: 123,
  swissCanton: SwissCanton.Bern,
  statement: 'Secret statement',
  statementAnonymous: false,
  anonymousStatement: 'This is an anonymized statement',
  statementSender: {
    emails: new Set('mail@buerger.ch'),
  },
};

const timetableHearingStatementInternalService = jasmine.createSpyObj(
  'TimetableHearingStatementInternalService',
  ['getStatement']
);
timetableHearingStatementInternalService.getStatement
  .withArgs(statementWithAnonymStatement.id)
  .and.returnValue(of(statementWithAnonymStatement))
  .withArgs(statementWithAnonymizedStatement.id)
  .and.returnValue(of(statementWithAnonymizedStatement));

describe('OpenDossierInMailService', () => {
  let openDossierInMailService: OpenCantonDossierInMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        translateServiceProvider,
        { provide: OpenCantonDossierInMailService },
        { provide: TranslatePipe, useValue: translatePipeSpy },
        {
          provide: TimetableHearingStatementInternalService,
          useValue: timetableHearingStatementInternalService,
        },
      ],
    })
      .compileComponents()
      .then();

    openDossierInMailService = TestBed.inject(OpenCantonDossierInMailService);
  });

  it('should open mailto link', () => {
    spyOn(window, 'open');

    openDossierInMailService.openDossierInMailClient({
      topic: 'Thema',
      question: 'Frage an das Transportunternehmen',
      answer: 'Rückmeldung des Transportunternehmens',
      internalComment: 'Interne Begründung zum Zweck der Dokumentation',
      publicComment: 'Öffentliche Begründung für Stellungnehmende',
      statementIds: [456, 123],
    });

    const expectedMailToLink =
      'mailto:?subject=Dossier%20%22Thema%22&body=Thema%3A%0AThema%0A%0AFrage%20an%20das%20Transportunternehmen%3A%0AFrage%20an%20das%20Transportunternehmen%0A%0AR%C3%BCckmeldung%20des%20Transportunternehmens%3A%0AR%C3%BCckmeldung%20des%20Transportunternehmens%0A%0AInterne%20Begr%C3%BCndung%20zum%20Zweck%20der%20Dokumentation%3A%0AInterne%20Begr%C3%BCndung%20zum%20Zweck%20der%20Dokumentation%0A%0A%C3%96ffentliche%20Begr%C3%BCndung%20f%C3%BCr%20Stellungnehmende%3A%0A%C3%96ffentliche%20Begr%C3%BCndung%20f%C3%BCr%20Stellungnehmende%0A%0AStellungnahmen%20des%20Dossiers%3A%0A%5B456%5D%3A%20Mehr%20B%C3%B6s%20pls%0A%0A%5B123%5D%3A%20This%20is%20an%20anonymized%20statement%0A%0A';
    expect(window.open).toHaveBeenCalledWith(expectedMailToLink, '_self');
  });
});
