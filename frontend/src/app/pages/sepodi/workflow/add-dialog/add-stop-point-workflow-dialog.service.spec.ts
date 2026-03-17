import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { AddStopPointWorkflowDialogService } from './add-stop-point-workflow-dialog.service';
import { BERN_WYLEREGG } from '../../../../../test/data/service-point';

describe('AddStopPointWorkflowDialogService', () => {
  let service: AddStopPointWorkflowDialogService;

  let dialogSpy: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogSpy = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(AddStopPointWorkflowDialogService);
  });

  it('should open new workflow', async () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(true) } as never);

    const result = await firstValueFrom(service.openDialog(BERN_WYLEREGG));
    expect(result).toBe(true);
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
