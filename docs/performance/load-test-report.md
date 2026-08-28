# Load test report

## Status

No concurrent load was sent to production. Local/staging load was not executed
because no safe local or staging base URL with isolated data and provider
configuration was available during this run. The repository `.env` contains
provider-backed configuration, so it was not used as permission to run a load
against an unknown target.

This is a blocked execution gate, not a fabricated pass.

## Ready scripts and profiles

- [`measure-http.mjs`](../../scripts/performance/measure-http.mjs): bounded
  timing probe with configurable paths, iterations, and concurrency.
- [`smoke-readonly.mjs`](../../scripts/performance/smoke-readonly.mjs): GET-only
  route smoke for production serving/routing.

Run only against an approved local/staging `PERF_BASE_URL`:

1. Baseline: 1–5 clients, 30 seconds.
2. Normal: 20 clients, 2 minutes.
3. Growth: 50 clients, 5 minutes.
4. Peak: 100 clients, 5 minutes.
5. Burst: ramp 10 → 100 clients and verify recovery.

Record p50/p95/p99, throughput, error rate, status distribution, payload size,
request IDs, service/query timing, DB pool waits, Redis behavior, CPU, memory,
and connection errors. Stop immediately on error rate ≥1%, connection timeout,
deadlock, memory growth, or provider throttling.

## Required follow-up

Provision an isolated staging target and authenticated fixtures, then run the
profile in [`performance-test-plan.md`](./performance-test-plan.md). Compare
the same commit before/after each optimization and retain raw artifacts under
`artifacts/performance/<run-id>/`.

