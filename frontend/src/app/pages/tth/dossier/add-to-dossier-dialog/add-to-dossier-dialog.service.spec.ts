import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AddToDossierDialogService } from './add-to-dossier-dialog.service';
import { TimetableHearingStatementV2 } from '../../../../api';

describe('AddToDossierDialogService', () => {
  let service: AddToDossierDialogService;

  const dialogSpy = jasmine.createSpyObj('dialog', ['open']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(AddToDossierDialogService);
  });

  it('should open confirmation dialog', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of([1000]) });

    service
      .openDialog({} as TimetableHearingStatementV2)
      .subscribe((result) => expect(result).toEqual([1000]));

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
