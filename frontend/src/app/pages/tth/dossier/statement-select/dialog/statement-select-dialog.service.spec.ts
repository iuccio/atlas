import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StatementSelectDialogService } from './statement-select-dialog.service';
import { StatementStatus } from '../../../../../api';

describe('StatementSelectDialogService', () => {
  let service: StatementSelectDialogService;

  const dialogSpy = jasmine.createSpyObj('dialog', ['open']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(StatementSelectDialogService);
  });

  it('should open confirmation dialog', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });

    service
      .onClick(StatementStatus.Accepted, [], undefined, 'SINGLE')
      .subscribe((result) => expect(result).toBeTrue());

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
