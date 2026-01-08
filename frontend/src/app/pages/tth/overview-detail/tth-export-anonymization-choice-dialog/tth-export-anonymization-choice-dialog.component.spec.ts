import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TthExportAnonymizationChoiceDialogComponent } from './tth-export-anonymization-choice-dialog.component';

describe('TthExportAnonymizationChoiceDialogComponent', () => {
  let component: TthExportAnonymizationChoiceDialogComponent;
  let fixture: ComponentFixture<TthExportAnonymizationChoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TthExportAnonymizationChoiceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TthExportAnonymizationChoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
