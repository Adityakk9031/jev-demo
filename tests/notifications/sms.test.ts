import { describe, it, expect } from 'vitest';
import {
  clamp,
  roundTo,
  percentOf,
} from '../../src/notifications/sms';

describe('notifications/sms', () => {
  it('clamps below the range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it('clamps above the range', () => {
    expect(clamp(99, 0, 10)).toBe(10);
  });
  it('leaves in-range values untouched', () => {
    expect(clamp(7, 0, 10)).toBe(7);
  });
  it('rounds to the requested precision', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
  });
  it('computes percentages and handles a zero total', () => {
    expect(percentOf(50, 200)).toBe(25);
    expect(percentOf(5, 0)).toBe(0);
  });
});
