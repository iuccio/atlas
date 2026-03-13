import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  LineVersionWorkflow,
  Status,
  WorkflowProcessingStatus,
} from '../../../api';
import { LineWorkflowDialogService } from './line-workflow-dialog.service';
import { mock } from 'vitest-mock-extended';
import { DialogComponent } from '../../components/dialog/dialog.component';

describe('LineWorkflowDialogService', () => {
  let service: LineWorkflowDialogService;

  const matDialog = mock<MatDialog>();
  const matDialogRef = mock<MatDialogRef<DialogComponent>>();
  matDialogRef.afterClosed.mockReturnValue(of(true));
  matDialog.open.mockReturnValue(matDialogRef);

  beforeEach(() => {
    // Config
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: matDialog }],
    });

    // Arrangement
    service = TestBed.inject(LineWorkflowDialogService);
  });

  it('should open new workflow', () => {
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

    expect(matDialog.open).toHaveBeenCalled();
  });

  it('should open existing workflow', () => {
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

    expect(matDialog.open).toHaveBeenCalled();
  });
});
