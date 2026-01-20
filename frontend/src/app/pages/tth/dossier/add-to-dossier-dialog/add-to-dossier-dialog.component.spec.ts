import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToDossierDialogComponent } from './add-to-dossier-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppTestingModule } from '../../../../app.testing.module';
import { SwissCanton, TimetableHearingStatementV2 } from '../../../../api';
import { AddToDossierData } from './add-to-dossier-dialog.service';
import { DossierInternalService } from '../../../../api/service/workflow/dossier-internal.service';

const statement: TimetableHearingStatementV2 = {
  id: 456,
  swissCanton: SwissCanton.Bern,
  statement: 'Mehr Bös pls',
  statementSender: {
    emails: new Set('me@sbb.ch'),
  },
  documents: [],
};
const dialogData: AddToDossierData = {
  title: 'TTH.DIALOG.STATUS_CHANGE',
  message: 'TTH.DIALOG.STATUS_CHANGE',
  cancelText: 'COMMON.CANCEL',
  confirmText: 'COMMON.APPLY',
  statement: statement,
};

const dialogRefSpy = jasmine.createSpyObj('dialogRef', ['close']);

const dossierInternalService = jasmine.createSpyObj('DossierInternalService', {
  updateDossier: of(statement),
});

describe('AddToDossierDialogComponent', () => {
  let component: AddToDossierDialogComponent;
  let fixture: ComponentFixture<AddToDossierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, AddToDossierDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
        {
          provide: DossierInternalService,
          useValue: dossierInternalService,
        },
        { provide: TranslatePipe },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToDossierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should close dialog', () => {
    //when
    component.cancel();
    //then
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should confirm dialog', () => {
    //when
    component.form.controls.dossier.setValue({
      id: 1,
      topic: 'Dossier 1',
      statementIds: [],
    });
    component.confirm();
    //then
    expect(dossierInternalService.updateDossier).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
