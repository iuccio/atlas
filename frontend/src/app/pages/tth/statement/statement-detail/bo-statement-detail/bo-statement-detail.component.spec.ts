import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BoStatementDetailComponent } from './bo-statement-detail.component';
import { translateServiceProvider } from '../../../../../app.testing.mocks';
import { provideHttpClient } from '@angular/common/http';
import { statement } from '../../statement-test-util';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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
        provideHttpClientTesting(),
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
    expect(component.anonymDocuments).toHaveLength(1);
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
