import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogManageTthComponent } from './dialog-manage-tth.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimetableHearingYear } from '../../../api';
import { NotificationService } from '../../../core/notification/notification.service';
import { of } from 'rxjs';
import {
  MockAtlasButtonComponent,
  translateServiceProvider,
} from '../../../app.testing.mocks';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppTestingModule } from '../../../app.testing.module';
import { TimetableHearingYearInternalService } from '../../../api/service/lidi/timetable-hearing-year-internal.service';
import { TthYearInternalService } from '../../../api/service/workflow/tth-year-internal.service';

@Component({
  selector: 'atlas-slide-toggle',
  template: '<p>MockAtlasSlideToggleComponent</p>',
  imports: [AppTestingModule],
})
class MockAtlasSlideToggleComponent {
  @Input() toggle = false;
  @Output() toggleChange = new EventEmitter<boolean>();
}

describe('DialogManageTthComponent', () => {
  let component: DialogManageTthComponent;
  let fixture: ComponentFixture<DialogManageTthComponent>;

  let tthYearLidiServiceSpy: jasmine.SpyObj<TimetableHearingYearInternalService>;
  let tthYearWfServiceSpy: jasmine.SpyObj<TthYearInternalService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let matDialogRefSpy: jasmine.SpyObj<
    MatDialogRef<DialogManageTthComponent, boolean>
  >;

  const matDialogDataMock = 2020;
  const tthYear: Partial<TimetableHearingYear> = {
    statementEditable: true,
    statementCreatableInternal: false,
    statementCreatableExternal: true,
  };

  beforeEach(async () => {
    tthYearLidiServiceSpy =
      jasmine.createSpyObj<TimetableHearingYearInternalService>(
        'TthServiceSpy',
        ['getHearingYear', 'updateTimetableHearingSettings']
      );
    tthYearWfServiceSpy = jasmine.createSpyObj<TthYearInternalService>([
      'closeTimetableHearing',
    ]);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>(
      'NotificationServiceSpy',
      ['success', 'error']
    );
    matDialogRefSpy = jasmine.createSpyObj<
      MatDialogRef<DialogManageTthComponent, boolean>
    >('MatDialogRefSpy', ['close']);

    await TestBed.configureTestingModule({
      providers: [
        translateServiceProvider,
        {
          provide: MAT_DIALOG_DATA,
          useValue: matDialogDataMock,
        },
        {
          provide: TimetableHearingYearInternalService,
          useValue: tthYearLidiServiceSpy,
        },
        {
          provide: TthYearInternalService,
          useValue: tthYearWfServiceSpy,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceSpy,
        },
        {
          provide: MatDialogRef<DialogManageTthComponent, boolean>,
          useValue: matDialogRefSpy,
        },
      ],
      imports: [
        AppTestingModule,
        DialogManageTthComponent,
        MockAtlasButtonComponent,
        MockAtlasSlideToggleComponent,
      ],
    }).compileComponents();

    tthYearLidiServiceSpy.getHearingYear.and
      .stub()
      .and.returnValue(of(tthYear));

    fixture = TestBed.createComponent(DialogManageTthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize', () => {
    expect(component).toBeTruthy();
    expect(component.currentView).toEqual(component.manageView);
    expect(tthYearLidiServiceSpy.getHearingYear).toHaveBeenCalledOnceWith(2020);
  });

  it('should handleSaveAndCloseClick', () => {
    tthYearLidiServiceSpy.updateTimetableHearingSettings.and
      .stub()
      .and.returnValue(of({}));

    component.handleSaveAndCloseClick();
    expect(component.actionButtonsDisabled).toBeTrue();
    expect(
      tthYearLidiServiceSpy.updateTimetableHearingSettings
    ).toHaveBeenCalledOnceWith(2020, {
      statementEditable: true,
      statementCreatableInternal: false,
      statementCreatableExternal: true,
    } as TimetableHearingYear);
    expect(matDialogRefSpy.close).toHaveBeenCalledOnceWith(true);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith(
      'TTH.MANAGE_TIMETABLE_HEARING.SUCCESSFUL_SAVE_NOTIFICATION'
    );
  });

  it('should handleCloseViewTthCloseClick', () => {
    tthYearWfServiceSpy.closeTimetableHearing.and
      .stub()
      .and.returnValue(of({}));

    component.handleCloseViewTthCloseClick();

    expect(component.actionButtonsDisabled).toBeTrue();
    expect(tthYearWfServiceSpy.closeTimetableHearing).toHaveBeenCalledOnceWith(
      2020
    );
    expect(matDialogRefSpy.close).toHaveBeenCalledOnceWith(true);
    expect(notificationServiceSpy.success).toHaveBeenCalledOnceWith(
      'TTH.CLOSE_TIMETABLE_HEARING.SUCCESSFUL_CLOSE_NOTIFICATION'
    );
  });
});
