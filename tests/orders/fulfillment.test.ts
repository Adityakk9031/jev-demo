import { describe, it, expect } from 'vitest';
import {
  unique,
  chunk,
  head,
} from '../../src/orders/fulfillment';

describe('orders/fulfillment', () => {
  it('deduplicates while preserving order', () => {
    expect(unique([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
  });
  it('chunks into equal batches', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });
  it('keeps a trailing partial batch', () => {
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
  });
  it('returns the requested prefix', () => {
    expect(head([1, 2, 3], 2)).toEqual([1, 2]);
  });
  it('handles empty input', () => {
    expect(unique([])).toEqual([]);
    expect(chunk([], 3)).toEqual([]);
  });
});
