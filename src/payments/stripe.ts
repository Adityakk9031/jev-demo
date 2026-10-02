/**
 * payments/stripe - identifiers helpers for the payments domain.
 */

/** Normalize an identifier to a URL-safe slug. */
export function normalizeId(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** True when the value is already a valid slug. */
export function isValidId(raw: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw.trim().toLowerCase());
}
