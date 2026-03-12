import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
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

  it('should open add examinants dialog', () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) } as never);

    service.openDialog(1).subscribe((result) => expect(result).toBe(true));

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
