import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoStatementDetailComponent } from './bo-statement-detail.component';
import { translateServiceProvider } from '../../../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { statement } from '../../statement-test-util.spec';
import { ActivatedRoute } from '@angular/router';

describe('BoStatementDetail', () => {
  let component: BoStatementDetailComponent;
  let fixture: ComponentFixture<BoStatementDetailComponent>;

  beforeEach(async () => {
    const activatedRoute = {
      snapshot: {
        data: {
          statement: statement,
        },
        params: {
          canton: 'be',
        },
      },
    };
    await TestBed.configureTestingModule({
      imports: [BoStatementDetailComponent],
      providers: [
        translateServiceProvider,
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoStatementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get anonymus document', () => {
    expect(component.anonymDocuments).toHaveSize(1);
    expect(component.anonymDocuments[0].getRawValue()).toEqual({
      id: 1,
      anonymous: true,
      fileName: 'file1',
      fileSize: 12,
    });
  });

  it('should show statement when statementAnonymous is true', () => {
    //given & when
    component.form.controls.statementAnonymous.setValue(true);
    //then
    expect(component.getStatementControlName()).toBe('statement');
  });

  it('should show anonymousStatement when statementAnonymous is false', () => {
    //given & when
    component.form.controls.statementAnonymous.setValue(false);
    //then
    expect(component.getStatementControlName()).toBe('anonymousStatement');
  });
});
