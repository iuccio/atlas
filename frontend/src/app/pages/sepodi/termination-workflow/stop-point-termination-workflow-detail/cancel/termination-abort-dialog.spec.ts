import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

import { TerminationAbortDialogService } from './termination-abort-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { TerminationAbortFormGroup } from '../stop-point-termination-workflow-detail-form-group';

describe('TerminationAbortDialog', () => {
  let service: TerminationAbortDialogService;
  let dialogMock: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    });
    service = TestBed.inject(TerminationAbortDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    service
      .openDialog(
        1,
        new FormGroup<TerminationAbortFormGroup>({
          abortComment: new FormControl(''),
        })
      )
      .subscribe((result) => {
        expect(result).toBe(true);
        expect(dialogMock.open).toHaveBeenCalled();
      });
  });
});
