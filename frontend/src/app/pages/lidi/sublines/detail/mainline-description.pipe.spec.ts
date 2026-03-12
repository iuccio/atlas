import { MainlineDescriptionPipe } from './mainline-description.pipe';
import { Line } from '../../../../api';
import { TranslatePipe } from '@ngx-translate/core';
import { describe, expect, it, vi } from 'vitest';

describe('MainlineDescriptionPipe', () => {
  const translatePipe = {
    transform: vi
      .fn()
      .mockReturnValue('LIDI.SUBLINE.NO_LINE_DESIGNATION_AVAILABLE'),
  } as unknown as TranslatePipe;

  const pipe = new MainlineDescriptionPipe(translatePipe);

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return description if available', () => {
    const line = { description: 'desc' } as Line;
    expect(pipe.transform(line)).toBe('desc');
  });

  it('should return translated fallback if no description', () => {
    const line = { swissLineNumber: 'swissLineNumber' } as Line;
    expect(pipe.transform(line)).toBe(
      '(LIDI.SUBLINE.NO_LINE_DESIGNATION_AVAILABLE)'
    );
  });
});
