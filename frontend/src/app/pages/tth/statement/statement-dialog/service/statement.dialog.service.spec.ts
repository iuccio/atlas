import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { SwissCanton } from '../../../../../api';
import { StatementDialogService } from './statement.dialog.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  StatementDetailFormGroup,
  StatementSenderFormGroup,
  TimetableHearingStatementDocumentGroup,
} from '../../statement-detail/statement-detail-form-group';

const document = new FormGroup<TimetableHearingStatementDocumentGroup>({
  id: new FormControl(),
  anonymous: new FormControl(),
  fileName: new FormControl(),
  fileSize: new FormControl(),
});

const documentArray = new FormArray<
  FormGroup<TimetableHearingStatementDocumentGroup>
>([document]);

const form = new FormGroup<StatementDetailFormGroup>({
  id: new FormControl(),
  timetableYear: new FormControl(),
  statementStatus: new FormControl(),
  ttfnid: new FormControl(),
  responsibleTransportCompanies: new FormControl(),
  oldSwissCanton: new FormControl(SwissCanton.Zurich),
  swissCanton: new FormControl(SwissCanton.Bern),
  statementSender: new FormGroup<StatementSenderFormGroup>({
    firstName: new FormControl(),
    lastName: new FormControl(),
    organisation: new FormControl(),
    zip: new FormControl(),
    city: new FormControl(),
    street: new FormControl(),
    emails: new FormControl(),
  }),
  stopPlace: new FormControl(),
  statement: new FormControl(),
  statementAnonymous: new FormControl(),
  publicComment: new FormControl(),
  internalComment: new FormControl(),
  cantonTransferComment: new FormControl(),
  topic: new FormControl(),
  documents: documentArray,
  etagVersion: new FormControl(),
  editor: new FormControl(),
  anonymousStatement: new FormControl(),
});

describe('StatementDialogService', () => {
  let service: StatementDialogService;

  let dialogSpy: Mocked<Pick<MatDialog, 'open'>>;

  beforeEach(() => {
    dialogSpy = { open: vi.fn() };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(StatementDialogService);
  });

  it('should open statement comment dialog and pass cancel value - true', async () => {
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);

    const result = await firstValueFrom(service.openDialog(form));
    expect(result).toBe(true);
    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
  });

  it('should open statement comment dialog and pass cancel value - false', async () => {
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(false),
    } as ReturnType<MatDialog['open']>);

    const result = await firstValueFrom(service.openDialog(form));
    expect(result).toBe(false);
    expect(dialogSpy.open).toHaveBeenCalledTimes(1);
  });
});
