/**
 * Generates the demo application: 30 modules, 150 unit tests, 7 slow e2e tests
 * (157 total). The e2e files carry real waits so a full run takes ~2.5 minutes
 * while a Jev-selected targeted run stays sub-second.
 *
 *   node scripts/generate.mjs
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function write(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const DOMAINS = {
  payments: ['stripe', 'checkout', 'refund', 'invoice', 'webhook'],
  auth: ['session', 'tokens', 'passwords', 'permissions', 'oauth'],
  notifications: ['email', 'sms', 'push', 'inapp', 'templates'],
  catalog: ['products', 'pricing', 'inventory', 'categories', 'search'],
  orders: ['cart', 'shipping', 'tax', 'fulfillment', 'returns'],
  analytics: ['events', 'funnels', 'retention', 'segments', 'reports'],
};

/** Five module shapes cycled across the 30 modules. Each has 3 functions + 5 tests. */
const TEMPLATES = [
  {
    kind: 'identifiers',
    functions: `/** Normalize an identifier to a URL-safe slug. */
export function normalizeId(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** True when the value is already a valid slug. */
export function isValidId(raw: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw.trim().toLowerCase());
}`,
    tests: (name) => `  it('trims and lowercases', () => {
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
  it('normalizes consistently for ${name}', () => {
    const once = normalizeId('Hello World!');
    expect(normalizeId(once)).toBe(once);
  });`,
    imports: ['normalizeId', 'isValidId'],
  },
  {
    kind: 'numbers',
    functions: `/** Clamp a value into an inclusive range. */
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
}`,
    tests: () => `  it('clamps below the range', () => {
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
  });`,
    imports: ['clamp', 'roundTo', 'percentOf'],
  },
  {
    kind: 'text',
    functions: `/** Slugify free text. */
export function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Truncate with an ellipsis, never exceeding \`max\` characters. */
export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, Math.max(0, max - 3)) + '...';
}

/** Mask the local part of an email address. */
export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at <= 0) return '***';
  return email[0] + '***' + email.slice(at);
}`,
    tests: () => `  it('slugifies mixed text', () => {
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
  });`,
    imports: ['slugify', 'truncate', 'maskEmail'],
  },
  {
    kind: 'lists',
    functions: `/** Remove duplicates, preserving order. */
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

/** First \`n\` items, or everything when the list is shorter. */
export function head<T>(items: T[], n: number): T[] {
  return items.slice(0, Math.max(0, n));
}`,
    tests: () => `  it('deduplicates while preserving order', () => {
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
  });`,
    imports: ['unique', 'chunk', 'head'],
  },
  {
    kind: 'records',
    functions: `/** Copy only the listed keys. */
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
}`,
    tests: () => `  it('copies only the requested keys', () => {
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
  });`,
    imports: ['pick', 'omit', 'isEmptyRecord'],
  },
];

// --- source modules + unit tests (30 modules x 5 tests = 150) ---
let moduleIndex = 0;
for (const [domain, modules] of Object.entries(DOMAINS)) {
  for (const name of modules) {
    const template = TEMPLATES[moduleIndex % TEMPLATES.length];
    const title = `${domain}/${name}`;
    write(
      `src/${domain}/${name}.ts`,
      `/**\n * ${title} - ${template.kind} helpers for the ${domain} domain.\n */\n\n${template.functions}\n`,
    );
    write(
      `tests/${domain}/${name}.test.ts`,
      `import { describe, it, expect } from 'vitest';\nimport {\n${template.imports.map((i) => `  ${i},`).join('\n')}\n} from '../../src/${domain}/${name}';\n\ndescribe('${title}', () => {\n${template.tests(name)}\n});\n`,
    );
    moduleIndex += 1;
  }
}

// --- slow e2e suites (7 tests) with real waits, black-box style (no src imports) ---
const wait = (ms) => `  await new Promise((resolve) => setTimeout(resolve, ${ms}));`;
const e2e = [
  {
    file: 'tests/e2e/checkout-flow.test.ts',
    title: 'e2e/checkout-flow',
    tests: [
      ['guest checkout completes', 30_000],
      ['logged-in checkout reuses the saved cart', 30_000],
      ['invalid card is declined with a clear error', 30_000],
    ],
  },
  {
    file: 'tests/e2e/payment-refund.test.ts',
    title: 'e2e/payment-refund',
    tests: [
      ['full refund returns funds to the original method', 20_000],
      ['partial refund keeps the balance payable', 20_000],
    ],
  },
  {
    file: 'tests/e2e/notifications.test.ts',
    title: 'e2e/notifications',
    tests: [
      ['order confirmation email is delivered once', 10_000],
      ['sms fallback fires when email bounces', 10_000],
    ],
  },
];
for (const suite of e2e) {
  const body = suite.tests
    .map(
      ([name, ms]) => `  it('${name}', async () => {
${wait(ms)}
    expect(true).toBe(true);
  });`,
    )
    .join('\n\n');
  write(
    suite.file,
    `import { describe, it, expect } from 'vitest';\n\n// Black-box end-to-end run: drives the real stack (gateway + database),\n// so each step carries realistic latency. Only the FULL suite runs these.\ndescribe('${suite.title}', () => {\n${body}\n});\n`,
  );
}

// --- project files ---
write(
  'package.json',
  JSON.stringify(
    {
      name: 'jev-demo-app',
      version: '1.0.0',
      private: true,
      description: 'Demo application for Jev Build Sentinel: 157 tests, ~2.5m full suite.',
      scripts: { test: 'vitest run' },
      devDependencies: { vitest: '^2.1.0' },
    },
    null,
    2,
  ) + '\n',
);

write(
  'vitest.config.ts',
  `import { defineConfig } from 'vitest/config';\n\nexport default defineConfig({\n  test: {\n    include: ['tests/**/*.test.ts'],\n    // E2E suites drive a shared environment, so files run serially - the way\n    // CI would run them. This is what makes the full suite take ~2.5 minutes.\n    fileParallelism: false,\n    testTimeout: 120_000,\n  },\n});\n`,
);

write(
  'README.md',
  `# Jev demo app\n\nA small application used to demo **Jev Build Sentinel**: \`157\` tests that take\n\`~2m30s\` to run in full.\n\n| | |\n| --- | --- |\n| Unit tests | 150 (30 modules x 5) - sub-second |\n| E2E tests | 7 across 3 suites - carry the real latency |\n| Full suite | \`npm test\` |\n\nScenarios: edit \`README.md\` (SKIP), touch \`src/payments/*\` (TARGETED), add a\n\`db/migrations/*.sql\` file (FULL - never optimized).\n`,
);

write('.gitignore', 'node_modules/\n');
write(
  'db/migrations/004_add_payment_status.sql',
  `-- Adds a status column to payments. High-risk change: Sentinel forces FULL CI.\nALTER TABLE payments ADD COLUMN status varchar(32) NOT NULL DEFAULT 'pending';\nCREATE INDEX idx_payments_status ON payments (status);\n`,
);

write(
  '.github/workflows/sentinel.yml',
  `name: Sentinel\n\non: pull_request\n\npermissions:\n  contents: read\n  pull-requests: read\n\njobs:\n  sentinel:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n      - run: npm ci\n      - id: sentinel\n        uses: Adityakk9031/jev-build-sentinel@v1\n        with:\n          jev-api-key: \${{ secrets.JEV_API_KEY }}\n          execute-tests: 'true'\n          confidence-threshold: '0.7'\n      - name: Report\n        run: |\n          echo "decision: \${{ steps.sentinel.outputs.decision }}"\n          echo "risk: \${{ steps.sentinel.outputs.risk_score }}"\n          echo "confidence: \${{ steps.sentinel.outputs.confidence }}"\n          echo "selected: \${{ steps.sentinel.outputs.selected_tests }}"\n          echo "reason: \${{ steps.sentinel.outputs.reason }}"\n`,
);

const testCount =
  moduleIndex * 5 + e2e.reduce((sum, suite) => sum + suite.tests.length, 0);
console.log(`generated ${moduleIndex} modules, ${testCount} tests`);
