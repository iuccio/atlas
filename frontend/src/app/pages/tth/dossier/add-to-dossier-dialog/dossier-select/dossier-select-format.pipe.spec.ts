import { describe, expect, it } from 'vitest';
import { DossierSelectFormatPipe } from './dossier-select-format.pipe';
import { TthDossier } from '../../../../../api/model/tthDossier';

describe('DossierSelectFormatPipe', () => {
  it('format dossier', () => {
    const pipe = new DossierSelectFormatPipe();
    expect(pipe).toBeTruthy();
    expect(
      pipe.transform({
        id: 1,
        topic: 'Test Dossier',
      } as TthDossier)
    ).toBe('1 - Test Dossier');
  });
});
