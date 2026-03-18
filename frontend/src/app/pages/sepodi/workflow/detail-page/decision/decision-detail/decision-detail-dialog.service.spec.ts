import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { DecisionDetailDialogService } from './decision-detail-dialog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ExaminantFormGroup } from '../../detail-form/stop-point-workflow-detail-form-group';
import { DecisionType, WorkflowStatus } from '../../../../../../api';

describe('DecisionDetailDialogService', () => {
  let service: DecisionDetailDialogService;

  let dialogSpy: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogSpy = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(DecisionDetailDialogService);
  });

  it('should open dialog', async () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) } as never);

    const result = await firstValueFrom(
      service.openDialog(
        1,
        WorkflowStatus.Hearing,
        new FormGroup<ExaminantFormGroup>({
          mail: new FormControl(''),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          judgementIcon: new FormControl(''),
          organisation: new FormControl(''),
          personFunction: new FormControl(''),
          judgement: new FormControl('YES'),
          id: new FormControl(1),
          decisionType: new FormControl(DecisionType.Voted),
          defaultExaminant: new FormControl(false),
        })
      )
    );
    expect(result).toBe(true);
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
