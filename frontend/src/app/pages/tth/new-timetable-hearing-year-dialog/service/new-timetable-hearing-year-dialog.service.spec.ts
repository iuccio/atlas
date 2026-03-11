import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi, type Mocked } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NewTimetableHearingYearDialogService } from './new-timetable-hearing-year-dialog.service';

describe('NewTimetableHearingYearDialogService', () => {
  let newTimetableHearingYearDialogService: NewTimetableHearingYearDialogService;

  let timetableHearingDialogSpy: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    timetableHearingDialogSpy = { open: vi.fn() };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: timetableHearingDialogSpy }],
    });
    newTimetableHearingYearDialogService = TestBed.inject(
      NewTimetableHearingYearDialogService
    );
  });

  it('should open confirmation new timetable hearing year dialog and pass success value - true', () => {
    timetableHearingDialogSpy.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    newTimetableHearingYearDialogService
      .openDialog()
      .subscribe((result) => expect(result).toBe(true));

    expect(timetableHearingDialogSpy.open).toHaveBeenCalledTimes(1);
  });

  it('should open confirmation new timetable hearing year dialog and pass cancel value - false', () => {
    timetableHearingDialogSpy.open.mockReturnValue({
      afterClosed: () => of(false),
    } as ReturnType<MatDialog['open']>);

    newTimetableHearingYearDialogService
      .openDialog()
      .subscribe((result) => expect(result).toBe(false));

    expect(timetableHearingDialogSpy.open).toHaveBeenCalledTimes(1);
  });
});
