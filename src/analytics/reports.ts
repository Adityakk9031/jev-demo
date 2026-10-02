/**
 * analytics/reports - records helpers for the analytics domain.
 */

/** Copy only the listed keys. */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Partial<T> {
  const out: Partial<T> = {};
  for (const key of keys) if (key in obj) out[key] = obj[key];
  return out;
}

/** Copy everything except the listed keys. */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Partial<T> {
  const out: Partial<T> = { ...obj };
  for (const key of keys) delete out[key];
  return out;
}

/** True when the record has no own keys. */
export function isEmptyRecord(obj: object): boolean {
  return Object.keys(obj).length === 0;
}
