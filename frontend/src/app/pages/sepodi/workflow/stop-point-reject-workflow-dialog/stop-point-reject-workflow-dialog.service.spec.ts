import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

import { StopPointRejectWorkflowDialogService } from './stop-point-reject-workflow-dialog.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('StopPointRejectWorkflowDialogService', () => {
  let service: StopPointRejectWorkflowDialogService;

  let dialogSpy: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogSpy = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(StopPointRejectWorkflowDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open new Cancel workflow', () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) } as never);

    service
      .openDialog(123, 'CANCEL')
      .subscribe((result) => expect(result).toBe(true));

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should open new Reject workflow', () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) } as never);

    service
      .openDialog(123, 'REJECT')
      .subscribe((result) => expect(result).toBe(true));

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should return Cancel Title', () => {
    const result = service.getTitle('CANCEL');
    expect(result).toBe('WORKFLOW.BUTTON.CANCEL');
  });

  it('should return new Reject Title', () => {
    const result = service.getTitle('REJECT');
    expect(result).toBe('WORKFLOW.BUTTON.REJECT');
  });
});
