import { describe, it, expect } from 'vitest';
import {
  normalizeId,
  isValidId,
} from '../../src/analytics/events';

describe('analytics/events', () => {
  it('trims and lowercases', () => {
    expect(normalizeId('  Stripe ID ')).toBe('stripe-id');
  });
  it('collapses invalid characters into single dashes', () => {
    expect(normalizeId('a//b__c')).toBe('a-b-c');
  });
  it('accepts a clean id', () => {
    expect(isValidId('order-42')).toBe(true);
  });
  it('rejects an empty string', () => {
    expect(isValidId('')).toBe(false);
    expect(normalizeId('   ')).toBe('');
  });
  it('normalizes consistently for events', () => {
    const once = normalizeId('Hello World!');
    expect(normalizeId(once)).toBe(once);
  });
});
