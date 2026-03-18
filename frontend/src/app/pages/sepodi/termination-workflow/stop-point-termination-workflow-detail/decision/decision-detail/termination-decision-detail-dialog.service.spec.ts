import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { TerminationDecisionDetailDialogService } from './termination-decision-detail-dialog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TerminationDecision } from '../../../../../../api/model/terminationDecision';
import { TerminationDecisionFormGroup } from '../../stop-point-termination-workflow-detail-form-group';
import moment from 'moment';
import { TerminationWorkflowStatus } from '../../../../../../api/model/terminationWorkflowStatus';
import TerminationDecisionPersonEnum = TerminationDecision.TerminationDecisionPersonEnum;

describe('TerminationDecisionDetailDialogService', () => {
  let service: TerminationDecisionDetailDialogService;
  let dialogMock: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    });
    service = TestBed.inject(TerminationDecisionDetailDialogService);
  });

  it('should open dialog', async () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    const result = await firstValueFrom(
      service.openDialog(
        1,
        false,
        TerminationWorkflowStatus.Started,
        TerminationDecisionPersonEnum.InfoPlus,
        new FormGroup<TerminationDecisionFormGroup>({
          examinantMail: new FormControl(''),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          judgementIcon: new FormControl(''),
          organisation: new FormControl(''),
          judgement: new FormControl('YES'),
          motivation: new FormControl(),
          terminationDate: new FormControl(moment()),
          terminationDecisionPerson: new FormControl(
            TerminationDecisionPersonEnum.InfoPlus
          ),
        }),
        new Date('9999-12-14')
      )
    );
    expect(result).toBe(true);
    expect(dialogMock.open).toHaveBeenCalled();
  });
});
