import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TthExportAnonymizationChoiceDialogComponent } from './tth-export-anonymization-choice-dialog.component';
import { AppTestingModule } from '../../../../app.testing.module';
import { BaseChangeDialogComponent } from '../base-change-dialog/base-change-dialog.component';
import { FormModule } from '../../../../core/module/form.module';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../../core/components/dialog/dialog.service';
import { of } from 'rxjs';

describe('TthExportAnonymizationChoiceDialogComponent', () => {
  let component: TthExportAnonymizationChoiceDialogComponent;
  let fixture: ComponentFixture<TthExportAnonymizationChoiceDialogComponent>;

  const dialogServiceSpy = jasmine.createSpyObj(DialogService, {
    confirmLeave: of({}),
  });
  const dialogRefSpy = jasmine.createSpyObj(['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TthExportAnonymizationChoiceDialogComponent,
        AppTestingModule,
        BaseChangeDialogComponent,
        FormModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: TranslatePipe },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      TthExportAnonymizationChoiceDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
