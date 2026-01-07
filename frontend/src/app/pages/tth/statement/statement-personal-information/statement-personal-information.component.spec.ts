import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatementPersonalInformationComponent } from './statement-personal-information.component';
import { translateServiceProvider } from '../../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { StringListComponent } from '../../../../core/form-components/string-list/string-list.component';
import { statement, statementFormGroup } from '../statement-test-util.spec';

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
    fixture.componentRef.setInput('form', statementFormGroup);
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
