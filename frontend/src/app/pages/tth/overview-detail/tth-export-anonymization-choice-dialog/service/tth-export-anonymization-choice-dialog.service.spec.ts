import { TestBed } from '@angular/core/testing';

import { TthExportAnonymizationChoiceDialogService } from './tth-export-anonymization-choice-dialog.service';

describe('TthExportAnonymizationChoiceDialogService', () => {
  let service: TthExportAnonymizationChoiceDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TthExportAnonymizationChoiceDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
