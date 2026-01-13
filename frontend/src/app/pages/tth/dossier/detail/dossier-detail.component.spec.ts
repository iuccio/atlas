import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierDetailComponent } from './dossier-detail.component';
import { ActivatedRoute } from '@angular/router';
import { AppTestingModule } from '../../../../app.testing.module';
import { SwissCanton, TimetableHearingStatementV2 } from '../../../../api';
import { of } from 'rxjs';
import { TimetableHearingStatementInternalService } from '../../../../api/service/lidi/timetable-hearing-statement-internal.service';

const statement: TimetableHearingStatementV2 = {
  id: 456,
  swissCanton: SwissCanton.Bern,
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DossierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
