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
const timetableHearingStatementInternalService = jasmine.createSpyObj(
  'TimetableHearingStatementInternalService',
  ['getStatement']
);

timetableHearingStatementInternalService.getStatement.and.returnValue(
  of(statement)
);

const dossierInternalService = jasmine.createSpyObj('DossierInternalService', [
  'answerQuestion',
]);
dossierInternalService.answerQuestion.and.returnValue(of<void>(undefined));

const notificationService = jasmine.createSpyObj('NotificationService', [
  'success',
]);

describe('BoDossierDetail', () => {
  let component: BoDossierDetailComponent;
  let fixture: ComponentFixture<BoDossierDetailComponent>;

  beforeEach(async () => {
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
    fixture.detectChanges();
    //when
    component.sendAnswer();
    //then
    expect(dossierInternalService.answerQuestion).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
    expect(component.form.disabled).toBeTrue();
    expect(component.isDossierStatusBoCheck).toBeFalse();
  });
});
