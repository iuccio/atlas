import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
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

  it('should open confirmation dialog', async () => {
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    const result = await firstValueFrom(
      service.onClick(StatementStatus.Accepted, [], undefined, 'SINGLE')
    );
    expect(result).toBe(true);
    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
  });
});
