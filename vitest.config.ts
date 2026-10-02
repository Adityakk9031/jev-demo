import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // E2E suites drive a shared environment, so files run serially - the way
    // CI would run them. This is what makes the full suite take ~2.5 minutes.
    fileParallelism: false,
    testTimeout: 120_000,
  },
});
