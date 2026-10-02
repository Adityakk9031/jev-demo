# Jev demo app

A small application used to demo **Jev Build Sentinel**: `157` tests that take
`~2m30s` to run in full.

| | |
| --- | --- |
| Unit tests | 150 (30 modules x 5) - sub-second |
| E2E tests | 7 across 3 suites - carry the real latency |
| Full suite | `npm test` |

Scenarios: edit `README.md` (SKIP), touch `src/payments/*` (TARGETED), add a
`db/migrations/*.sql` file (FULL - never optimized).
