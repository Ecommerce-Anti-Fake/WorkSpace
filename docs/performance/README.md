# Performance testing

Status: **source audit and safe production baseline complete; authenticated,
instrumented staging/load gates pending**.

## Deliverables

- [`system-flow-map.md`](./system-flow-map.md) — frontend, gateway, TCP services, persistence, Redis, and provider topology.
- [`api-inventory.md`](./api-inventory.md) — generated static gateway route and frontend caller inventory.
- [`database-query-map.md`](./database-query-map.md) — merged Prisma model/index and static query map.
- [`performance-test-plan.md`](./performance-test-plan.md) — roles, thresholds, profiles, and evidence contract.
- [`baseline-report.md`](./baseline-report.md) — current build and safe production read baseline.
- [`flow-test-results.md`](./flow-test-results.md) — current role/flow evidence and pending gates.
- [`endpoint-performance-matrix.md`](./endpoint-performance-matrix.md) — measured endpoint matrix.
- [`cache-key-map.md`](./cache-key-map.md) — current Redis/realtime namespaces and TTLs.
- [`optimization-report.md`](./optimization-report.md) — completed shop-summary N+1 reduction and rollback.
- [`load-test-report.md`](./load-test-report.md) — load execution status and staging runbook.

## Scripts and artifacts

- [`generate-source-inventory.mjs`](../../scripts/performance/generate-source-inventory.mjs) regenerates the static API/database maps.
- [`measure-http.mjs`](../../scripts/performance/measure-http.mjs) performs bounded HTTP timing probes.
- [`smoke-readonly.mjs`](../../scripts/performance/smoke-readonly.mjs) performs GET-only route smoke.
- [`baseline/`](../../artifacts/performance/baseline/) contains the current raw production read artifacts.

## Completion gates

The remaining gates are a safe staging target, authenticated role flows,
multi-client realtime smoke, and concurrent load with raw artifacts. Runtime
request/query instrumentation is implemented in the backend, but production
deployment must be reviewed and verified before using it for live comparison or
claiming the shop query optimization improved latency.
