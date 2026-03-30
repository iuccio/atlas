import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { AddExaminantsDialogService } from './add-examinants-dialog.service';

describe('AddExaminantsDialogService', () => {
  let service: AddExaminantsDialogService;

  let dialogSpy: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogSpy = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(AddExaminantsDialogService);
  });

  it('should open add examinants dialog', async () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) } as never);

    const result = await firstValueFrom(service.openDialog(1));
    expect(result).toBe(true);
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
