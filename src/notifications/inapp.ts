/**
 * notifications/inapp - lists helpers for the notifications domain.
 */

/** Remove duplicates, preserving order. */
export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

/** Split a list into fixed-size batches. */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) throw new Error('size must be positive');
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** First `n` items, or everything when the list is shorter. */
export function head<T>(items: T[], n: number): T[] {
  return items.slice(0, Math.max(0, n));
}
