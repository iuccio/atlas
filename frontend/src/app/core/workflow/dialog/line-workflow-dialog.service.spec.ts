import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import {
  LineVersionWorkflow,
  Status,
  WorkflowProcessingStatus,
} from '../../../api';
import { LineWorkflowDialogService } from './line-workflow-dialog.service';

describe('LineWorkflowDialogService', () => {
  let service: LineWorkflowDialogService;

  let dialogStub: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    // Mocking
    dialogStub = { open: vi.fn() };

    // Config
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogStub }],
    });

    // Arrangement
    service = TestBed.inject(LineWorkflowDialogService);
  });

  it('should open new workflow', () => {
    dialogStub.open.mockReturnValue({ afterClosed: () => of(true) } as any);

    service
      .openNew(
        {
          id: 123,
          validFrom: new Date(),
          validTo: new Date(),
          slnid: 'ch:1:slnid:1000003',
          businessOrganisation: 'ch:1:sboid:110000',
          status: Status.Draft,
          versionNumber: 0,
        },
        'description'
      )
      .subscribe((result) => expect(result).toBe(true));

    expect(dialogStub.open).toHaveBeenCalled();
  });

  it('should open existing workflow', () => {
    dialogStub.open.mockReturnValue({ afterClosed: () => of(true) } as any);

    service
      .openExisting(
        {
          id: 123,
          validFrom: new Date(),
          validTo: new Date(),
          slnid: 'ch:1:slnid:1000003',
          businessOrganisation: 'ch:1:sboid:110000',
          status: Status.Draft,
          versionNumber: 0,
          lineVersionWorkflows: new Set<LineVersionWorkflow>([
            {
              workflowId: 1,
              workflowProcessingStatus: WorkflowProcessingStatus.InProgress,
            },
          ]),
        },
        'description'
      )
      .subscribe((result) => expect(result).toBe(true));

    expect(dialogStub.open).toHaveBeenCalled();
  });
});
