import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementPersonalInformationComponent } from './statement-personal-information.component';
import { translateServiceProvider } from '../../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StringListComponent } from '../../../../core/form-components/string-list/string-list.component';
import { SwissCanton, TimetableHearingStatementV2 } from '../../../../api';

const statementSender = new FormGroup({
  city: new FormControl(),
  firstName: new FormControl(),
  lastName: new FormControl(),
  organisation: new FormControl(),
  street: new FormControl(),
  zip: new FormControl(),
  emails: new FormControl(['a@a.ch']),
});

const formGroup = new FormGroup({
  statementSender: statementSender,
  documents: new FormBuilder().array([]),
});

const statement: TimetableHearingStatementV2 = {
  id: 1234,
  swissCanton: SwissCanton.Aargau,
  statement: 'Mehr Busse bitte',
  statementSender: {
    emails: new Set(['fan@yb.ch', 'fan@nap.ch']),
  },
};

describe('StatementPersonalInformation', () => {
  let component: StatementPersonalInformationComponent;
  let fixture: ComponentFixture<StatementPersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementPersonalInformationComponent, StringListComponent],
      providers: [translateServiceProvider, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(StatementPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('form', formGroup);
    fixture.componentRef.setInput('statement', statement);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get email', () => {
    expect(component.emails).toEqual('fan@yb.ch\n' + 'fan@nap.ch');
  });
});
