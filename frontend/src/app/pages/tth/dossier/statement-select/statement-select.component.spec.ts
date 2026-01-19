import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementSelectComponent } from './statement-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTestingModule } from '../../../../app.testing.module';
import { of } from 'rxjs';
import { SwissCanton, TimetableHearingStatementV2 } from '../../../../api';
import { TimetableHearingStatementInternalService } from '../../../../api/service/lidi/timetable-hearing-statement-internal.service';
import { FormatPipe } from '../../../../core/components/table/pipe/format.pipe';

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
const router = jasmine.createSpyObj('Router', {
  navigate: Promise.resolve(true),
});

describe('StatementSelectComponent', () => {
  let component: StatementSelectComponent;
  let fixture: ComponentFixture<StatementSelectComponent>;

  const activatedRoute = {
    snapshot: {
      data: {
        dossier: undefined,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementSelectComponent, AppTestingModule],
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
          provide: Router,
          useValue: router,
        },
        {
          provide: FormatPipe,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatementSelectComponent);
    fixture.componentRef.setInput('selectedStatements', [1000]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove statement', () => {
    component.selectedStatements.set([1000]);

    component.removeStatement({ id: 1000 } as TimetableHearingStatementV2);

    expect(component.selectedStatements()).toEqual([]);
  });

  it('should go to statement', () => {
    component.goToStatement({
      id: 1000,
      swissCanton: SwissCanton.Bern,
    } as TimetableHearingStatementV2);

    expect(router.navigate).toHaveBeenCalledWith([
      'timetable-hearing',
      'be',
      'active',
      1000,
    ]);
  });
});
