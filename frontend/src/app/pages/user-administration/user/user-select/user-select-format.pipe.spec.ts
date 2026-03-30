import { beforeEach, describe, expect, it } from 'vitest';
import { UserSelectFormatPipe } from './user-select-format.pipe';
import { Permission } from '../../../../api';

describe('UserSelectFormatPipe', () => {
  let pipe: UserSelectFormatPipe;

  beforeEach(() => {
    pipe = new UserSelectFormatPipe();
  });

  it('format user', () => {
    expect(pipe).toBeTruthy();
    expect(
      pipe.transform({
        sbbUserId: 'uid',
        permissions: new Set<Permission>(),
        displayName: 'Test User',
        mail: 'test.user@sbb.ch',
      })
    ).toBe('Test User (test.user@sbb.ch)');
  });

  it('format user without mail', () => {
    expect(
      pipe.transform({
        sbbUserId: 'uid',
        permissions: new Set<Permission>(),
        displayName: 'Test User',
      })
    ).toBe('Test User ');
  });
});
