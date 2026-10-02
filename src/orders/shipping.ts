/**
 * orders/shipping - numbers helpers for the orders domain.
 */

/** Clamp a value into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Round to a fixed number of decimal places. */
export function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Percentage of a total; 0 when the total is zero. */
export function percentOf(part: number, total: number): number {
  return total === 0 ? 0 : roundTo((part / total) * 100, 2);
}
