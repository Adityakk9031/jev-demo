/**
 * auth/passwords - text helpers for the auth domain.
 */

/** Slugify free text. */
export function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Truncate with an ellipsis, never exceeding `max` characters. */
export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, Math.max(0, max - 3)) + '...';
}

/** Mask the local part of an email address. */
export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at <= 0) return '***';
  return email[0] + '***' + email.slice(at);
}
