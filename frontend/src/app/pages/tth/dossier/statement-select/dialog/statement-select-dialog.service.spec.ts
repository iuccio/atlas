import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi, type Mocked } from 'vitest';
import { StatementSelectDialogService } from './statement-select-dialog.service';
import { SwissCanton } from '../../../../../api';

describe('StatementSelectDialogService', () => {
  let service: StatementSelectDialogService;

  const dialogSpy: Mocked<Pick<MatDialog, 'open'>> = { open: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(StatementSelectDialogService);
  });

  it('should open confirmation dialog', () => {
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of([1000]),
    } as ReturnType<MatDialog['open']>);

    service
      .select([1000], SwissCanton.Bern, 2020)
      .subscribe((result) => expect(result).toEqual([1000]));

    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
  });
});
