import { describe, it, expect } from 'vitest';
import {
  pick,
  omit,
  isEmptyRecord,
} from '../../src/analytics/reports';

describe('analytics/reports', () => {
  it('copies only the requested keys', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 });
  });
  it('removes the listed keys', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 });
  });
  it('ignores keys that are not present', () => {
    expect(pick({ a: 1 }, ['b' as 'a'])).toEqual({});
  });
  it('detects empty records', () => {
    expect(isEmptyRecord({})).toBe(true);
  });
  it('detects non-empty records', () => {
    expect(isEmptyRecord({ a: 1 })).toBe(false);
  });
});
