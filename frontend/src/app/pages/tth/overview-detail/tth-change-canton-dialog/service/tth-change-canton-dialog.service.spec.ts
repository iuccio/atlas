import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { TthChangeCantonDialogService } from './tth-change-canton-dialog.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';
import { SwissCanton } from '../../../../../api';

describe('TthChangeCantonDialogService', () => {
  let service: TthChangeCantonDialogService;
  const dialogSpy: Mocked<Pick<MatDialog, 'open'>> = { open: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(TthChangeCantonDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open confirmation dialog', async () => {
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    const result = await firstValueFrom(service.onClick(SwissCanton.Bern, []));
    expect(result).toBe(true);
    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
  });
});
