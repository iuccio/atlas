import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi, type Mocked } from 'vitest';
import { TthChangeStatusDialogService } from './tth-change-status-dialog.service';
import { StatementStatus } from '../../../../../api';

describe('TthChangeStatusDialogService', () => {
  let service: TthChangeStatusDialogService;

  const dialogSpy: Mocked<Pick<MatDialog, 'open'>> = {
    open: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(TthChangeStatusDialogService);
  });

  it('should open confirmation dialog', () => {
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    service
      .onClick(StatementStatus.Accepted, [], undefined, 'SINGLE')
      .subscribe((result) => expect(result).toBe(true));

    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
  });
});
