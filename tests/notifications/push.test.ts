import { describe, it, expect } from 'vitest';
import {
  slugify,
  truncate,
  maskEmail,
} from '../../src/notifications/push';

describe('notifications/push', () => {
  it('slugifies mixed text', () => {
    expect(slugify('Refund  Policy!!')).toBe('refund-policy');
  });
  it('leaves short text unchanged', () => {
    expect(truncate('short', 10)).toBe('short');
  });
  it('truncates long text with an ellipsis', () => {
    expect(truncate('abcdefghij', 6)).toBe('abc...');
  });
  it('masks the local part but keeps the domain', () => {
    expect(maskEmail('ada@example.com')).toBe('a***@example.com');
  });
  it('degrades safely without an @ sign', () => {
    expect(maskEmail('not-an-email')).toBe('***');
  });
});
