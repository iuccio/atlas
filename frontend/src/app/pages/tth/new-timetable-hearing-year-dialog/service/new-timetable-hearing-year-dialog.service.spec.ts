import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';
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

  it('should open confirmation new timetable hearing year dialog and pass success value - true', async () => {
    timetableHearingDialogSpy.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    const result = await firstValueFrom(
      newTimetableHearingYearDialogService.openDialog()
    );
    expect(result).toBe(true);
    expect(timetableHearingDialogSpy.open).toHaveBeenCalledTimes(1);
  });

  it('should open confirmation new timetable hearing year dialog and pass cancel value - false', async () => {
    timetableHearingDialogSpy.open.mockReturnValue({
      afterClosed: () => of(false),
    } as ReturnType<MatDialog['open']>);

    const result = await firstValueFrom(
      newTimetableHearingYearDialogService.openDialog()
    );
    expect(result).toBe(false);
    expect(timetableHearingDialogSpy.open).toHaveBeenCalledTimes(1);
  });
});
