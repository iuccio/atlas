import { describe, expect, it } from 'vitest';
import { InstanceOfPipe } from './instance-of.pipe';

describe('InstanceOfPipe', () => {
  it('create an instance', () => {
    const pipe = new InstanceOfPipe();
    expect(pipe).toBeTruthy();
  });
});
