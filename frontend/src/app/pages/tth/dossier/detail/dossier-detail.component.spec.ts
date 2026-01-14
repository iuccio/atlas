import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierDetailComponent } from './dossier-detail.component';
import { ActivatedRoute } from '@angular/router';
import { AppTestingModule } from '../../../../app.testing.module';
import { SwissCanton, TimetableHearingStatementV2 } from '../../../../api';
import { of } from 'rxjs';
import { TimetableHearingStatementInternalService } from '../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { TthDossier } from '../../../../api/model/tthDossier';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';
import { StatementSelectDialogService } from '../statement-select/dialog/statement-select-dialog.service';
import { NotificationService } from '../../../../core/notification/notification.service';

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
  {
    getStatement: of(statement),
  }
);
const dossier: TthDossier = {
  swissCanton: SwissCanton.Bern,
  boContactMail: 'info@bls.ch',
  boDeadlineToAnswer: new Date('2014-12-14'),
  questions: [{ question: 'Habt ihr mehr Busse?' }],
  statementIds: [1000],
  id: 1234,
  topic: 'Mehr Busse bitte',
};
const dossierInternalService = jasmine.createSpyObj('DossierInternalService', {
  createDossier: of(dossier),
});

const statementSelectDialogService = jasmine.createSpyObj(
  'StatementSelectDialogService',
  {
    select: of([1, 2]),
  }
);

const notificationService = jasmine.createSpyObj('NotificationService', [
  'success',
]);

describe('DossierDetailComponent', () => {
  let component: DossierDetailComponent;
  let fixture: ComponentFixture<DossierDetailComponent>;

  const activatedRoute = {
    snapshot: {
      data: {
        dossier: undefined,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierDetailComponent, AppTestingModule],
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
          provide: StatementSelectDialogService,
          useValue: statementSelectDialogService,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DossierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load new mode', () => {
    expect(component.swissCanton).toBe(SwissCanton.Bern);
    expect(component.timetableHearingYear).toBe(2023);

    expect(component.isNew).toBeTrue();
    expect(component.form.enabled).toBeTrue();
  });

  it('should save dossier', () => {
    component.form.controls.topic.setValue('Takt Bern Salem');
    component.selectedStatements = [456];

    component.save();
    expect(dossierInternalService.createDossier).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should open statement select dialog', () => {
    component.openAddStatementsDialog();

    expect(statementSelectDialogService.select).toHaveBeenCalled();
    expect(component.selectedStatements).toEqual([1, 2]);
  });
});
