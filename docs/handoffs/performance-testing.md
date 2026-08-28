# Performance testing handoff

## Current state — 2026-08-04

- Phase 1 source maps and test plan are in `docs/performance/`.
- Safe production `GET` baseline and frontend shell smoke are recorded under
  `artifacts/performance/baseline/`.
- Gateway request telemetry now records request ID, status, duration, payload
  bytes, service-call count/duration/errors, query count, and DB duration;
  Prisma logs only structured slow-query metadata (default threshold 200 ms).
- Public shop summary N+1 was reduced from `2 + 2N` static calls to four
  batched calls per non-empty page; focused tests and catalog build pass.
- No migration, cache layer, production data, or production load was changed.

## Next handoff action

Provide an isolated staging URL, observability access, and test fixtures. Run
authenticated role/realtime smoke and the load profiles in
`docs/performance/load-test-report.md`, then repeat the shop endpoint baseline
after deployment.

## Guardrails

Use `EXPLAIN (ANALYZE, BUFFERS)` before adding indexes. Keep provider/deployed
claims separate from local proof. Never place credentials or tokens in reports
or artifacts.
