import { describe, expect, it } from 'vitest';
import { isEmpty } from './strings';

describe('Strings Util Test', () => {
  it('isEmpty: should return true on empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('isEmpty: should return false on not empty string', () => {
    expect(isEmpty('test')).toBe(false);
  });
});
