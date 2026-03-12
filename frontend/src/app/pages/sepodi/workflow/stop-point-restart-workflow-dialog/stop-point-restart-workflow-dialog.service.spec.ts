import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

import { StopPointRestartWorkflowDialogService } from './stop-point-restart-workflow-dialog.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('StopPointRestartWorkflowDialogService', () => {
  let service: StopPointRestartWorkflowDialogService;

  let dialogSpy: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogSpy = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(StopPointRestartWorkflowDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open new resart workflow', () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) } as never);

    service
      .openDialog(123, 'RESTART')
      .subscribe((result) => expect(result).toBe(true));

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
