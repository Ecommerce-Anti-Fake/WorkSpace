# Performance baseline report

**Date:** 2026-08-04  
**Scope:** source/build baseline plus safe, unauthenticated production reads.  
**Production targets:** `https://antifake.io.vn` and `https://api.antifake.io.vn`.

## Safety boundary

The production run used only HTTP `GET`, without credentials, request bodies, or
concurrency. No checkout, payment, admin mutation, seller mutation, seed/reset,
or load test was sent to production. The frontend smoke only checked that the
public shell was served and did not prove that protected data was authorized.

## Production API read baseline

Three sequential samples per endpoint were collected by
[`measure-http.mjs`](../../scripts/performance/measure-http.mjs). The report
contains timings, response sizes, statuses, and error rate; response bodies and
credentials are never written.

| Endpoint | Status | p50 | p95/p99 | Bytes | Error rate |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/api/health` | 200 | 24.8 ms | 124.9 ms | 139 | 0% |
| `/api/offers?page=1&pageSize=10` | 200 | 333.0 ms | 713.5 ms | 6,239 | 0% |
| `/api/categories` | 200 | 43.2 ms | 44.3 ms | 993 | 0% |
| `/api/brands` | 200 | 47.1 ms | 48.2 ms | 786 | 0% |
| `/api/shops?page=1&pageSize=10` | 200 | 382.3 ms | 846.8 ms | 2,070 | 0% |
| `/api/live/sessions?filter=all` | 200 | 208.0 ms | 241.6 ms | 4,106 | 0% |

The raw artifact is [`public-read.json`](../../artifacts/performance/baseline/public-read.json).
This is a small diagnostic baseline, not a load result and not a deployment
comparison.

## Production frontend GET-only smoke

Twelve public/protected shell routes returned HTTP 200 with no redirect:
`/`, `/auth`, `/search`, `/categories`, `/live`, `/community`, `/cart`,
`/profile`, `/notification`, `/messages`, `/seller`, `/admin`.

The root route took 3,184.7 ms; the remaining shell routes took approximately
7–15 ms. The artifact is [`production-frontend-smoke.json`](../../artifacts/performance/baseline/production-frontend-smoke.json).
This verifies serving/routing only; it is not a browser interaction or role-flow
pass.

## Local quality baseline

- Frontend build: passed.
- Frontend lint: failed before this slice with 72 problems (64 errors, 8 warnings), mostly existing React effect and explicit-`any` findings.
- Backend Prisma merge: passed.
- Focused backend health/rate-limit/bootstrap/exception tests: 18 tests passed.
- Backend full CI test command: timed out after 124 seconds without a useful failure signal.
- Backend typecheck: failed on pre-existing test/mock and Prisma typing mismatches.
- Runtime instrumentation build: passed for `api-gateway`; request logs now
  carry service-call count/duration/errors, query count, DB duration, payload
  bytes, status, and request ID. Prisma
  emits structured slow-query events at `PRISMA_SLOW_QUERY_THRESHOLD_MS`
  (default 200 ms) without SQL or parameter values.

These findings are recorded as baseline gates; unrelated lint/type cleanup was
not mixed into the performance slice.

## Pending gates

Authenticated role flows, realtime multi-client behavior, and concurrent load
require a safe local or staging target. The new query telemetry has not been
deployed/re-verified on production in this run, so no production optimization
claim is made.
