import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoDossierDetailComponent } from './bo-dossier-detail.component';
import { AppTestingModule } from '../../../../../app.testing.module';
import { TthDossier } from '../../../../../api/model/tthDossier';
import { SwissCanton, TimetableHearingStatementV2 } from '../../../../../api';
import { DossierStatus } from '../../../../../api/model/dossierStatus';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TimetableHearingStatementInternalService } from '../../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { FormatPipe } from '../../../../../core/components/table/pipe/format.pipe';
import { DossierInternalService } from '../../../../../api/service/workflow/dossier-internal.service';
import { NotificationService } from '../../../../../core/notification/notification.service';
import SpyObj = jasmine.SpyObj;

const dossier: TthDossier = {
  swissCanton: SwissCanton.Bern,
  boContactMail: 'info@bls.ch',
  boDeadlineToAnswer: new Date('2014-12-14'),
  questions: [{ question: 'Habt ihr mehr Busse?', id: 123 }],
  statementIds: [1000],
  id: 1234,
  topic: 'Mehr Busse bitte',
  dossierStatus: DossierStatus.DossierBoCheck,
};

const statement: TimetableHearingStatementV2 = {
  id: 456,
  swissCanton: SwissCanton.Bern,
  timetableYear: 2023,
  statement: 'Mehr Bös pls',
  statementSender: {
    emails: new Set('me@sbb.ch'),
  },
  documents: [],
};

describe('BoDossierDetail', () => {
  let component: BoDossierDetailComponent;
  let fixture: ComponentFixture<BoDossierDetailComponent>;

  let timetableHearingStatementInternalService: SpyObj<TimetableHearingStatementInternalService>;
  let dossierInternalService: SpyObj<DossierInternalService>;
  let notificationService: SpyObj<NotificationService>;

  beforeEach(async () => {
    timetableHearingStatementInternalService = jasmine.createSpyObj(
      'TimetableHearingStatementInternalService',
      {
        getStatement: of(statement),
      }
    );

    dossierInternalService = jasmine.createSpyObj('DossierInternalService', {
      answerQuestion: of<void>(undefined),
    });

    notificationService = jasmine.createSpyObj('NotificationService', [
      'success',
    ]);

    const activatedRoute = {
      snapshot: {
        data: {
          dossier: dossier,
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [BoDossierDetailComponent, AppTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: TimetableHearingStatementInternalService,
          useValue: timetableHearingStatementInternalService,
        },
        {
          provide: DossierInternalService,
          useValue: dossierInternalService,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
        FormatPipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoDossierDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sendAnswer when form is valid', () => {
    //given
    component.form.controls.answerToCanton.setValue('Ich bin einverstanden!');
    //when
    component.sendAnswer();
    //then
    expect(dossierInternalService.answerQuestion).toHaveBeenCalledOnceWith(
      123,
      { answerToCanton: 'Ich bin einverstanden!' }
    );
    expect(notificationService.success).toHaveBeenCalledOnceWith(
      'TTH.DOSSIER.NOTIFICATION.SENT_TO_CANTON'
    );
    expect(component.form.disabled).toBeTrue();
    expect(component.isDossierStatusBoCheck).toBeFalse();
  });

  it('should open mailto on openInMail()', () => {
    //given
    spyOn(window, 'open');
    //when
    component.openInMail();
    //then
    expect(window.open).toHaveBeenCalledOnceWith(
      'mailto:?subject=Dossier%20%22Mehr%20Busse%20bitte%22&body=TTH.DOSSIER.INQUIRY_FROM_THE_CANTON%20%5BTTH.CANTON.BE%5D%20%0AHabt%20ihr%20mehr%20Busse%3F',
      '_self'
    );
  });
});
