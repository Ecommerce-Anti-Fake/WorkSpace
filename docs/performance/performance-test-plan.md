# AntiFake performance test plan

## Objective

Measure the current system across guest, buyer, seller, affiliate, distributor, admin and realtime flows; identify measured bottlenecks; make narrow reversible changes; and compare before/after data. This plan follows the requirement in `docs/Performance_Testing_Requirement.md` and keeps production smoke separate from load testing.

## Acceptance thresholds

| Area | Initial gate |
|---|---|
| Normal read API | p95 < 500 ms at 20 concurrent users |
| Complex API/dashboard | p95 < 1,000 ms at normal load |
| Error rate | < 1%; no connection timeout or repeated Redis timeout |
| Database | no deadlock; no unbounded query count; no unexplained pool saturation |
| Realtime | reconnect recovers durable data; ephemeral events may be rate-limited/dropped safely |
| Frontend | build/lint/typecheck/E2E pass; no new API contract or loading-state regression |
| Production | smoke only; never load test or execute real money/destructive mutations |

Core Web Vitals remain runtime targets where browser traces are available: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. These are not asserted from source inspection alone.

## Phase 1: source audit and map

Completed before application optimization:

- [x] Frontend routes/layouts/guards/services/hooks/store/realtime/upload/error/loading paths inventoried.
- [x] Gateway controllers, service modules, TCP clients, RPC patterns and service entrypoints inventoried.
- [x] Prisma schema, indexes/uniques, migrations/seeds and repository query locations inventoried.
- [x] `docs/performance/system-flow-map.md`, `api-inventory.md`, and `database-query-map.md` created.
- [x] This plan created before product-code changes.

## Phase 2: baseline instrumentation

Implemented in the backend: gateway request logs carry request ID, status,
total duration, payload bytes, service-call count/duration/errors, and
in-process query count/DB duration. Prisma emits slow-query metadata at
`PRISMA_SLOW_QUERY_THRESHOLD_MS` (default 200 ms) without SQL or parameter
values. Cross-process request correlation and pool-wait metrics remain
deployment/infrastructure follow-up items.

1. Record commit SHA, target URL, Node version, database/provider region and whether Redis is enabled. Never print credentials.
2. Run backend and frontend quality gates before changes.
3. Capture safe health and public read timings with a small deterministic script.
4. Capture production-like authenticated read timings only with an existing seeded account and redacted output.
5. If a local/staging database is available, enable Prisma query events or database-side timing and record query count, p50/p95/p99, payload bytes, active connections and slow-query samples.
6. Store machine-readable summaries under `artifacts/performance/baseline/` and the narrative in `baseline-report.md`.

Required baseline fields:

`p50`, `p95`, `p99`, throughput, error rate, timeout rate, query count/request, DB execution time, response bytes, CPU, RAM, swap, active DB connections, Redis hit/miss/latency, event-loop delay and memory growth.

If a field cannot be measured in the current environment, record `blocked` with the exact dependency; do not invent a value.

## Flow test matrix

| Persona | Safe flow coverage | Production action | Local/staging action |
|---|---|---|---|
| Guest | home, category, search/filter, product, shop, live list, community, public QR | GET only | repeat at controlled concurrency |
| Buyer | login, profile/address/KYC status, catalog, cart read/update only where test DB, order list/detail, chat/notification recovery | existing account; read-only preferred | checkout quote and test order only on isolated fixture; no real payment |
| Seller | dashboard, shop, product/offer/variant/inventory reads, order list, stats, live state | read-only | mutations only against disposable/staging fixture |
| Affiliate | dashboard, program/code/conversion/commission reads | read-only | attribution/conversion/payout fixture with idempotency assertions |
| Distributor | networks, memberships, batches, inventory summary, lineage | read-only | shipment/receive flow only on isolated fixture |
| Admin/moderator | dashboard, KYC/shop/product/report/dispute/risk/finance/inventory reads | read-only | mutation tests only with approved test records |
| Realtime | notification SSE, chat Socket.IO, live reaction/comment channels | minimal connection smoke | multi-client fan-out, reconnect, Redis fallback and burst tests |

For each flow record API sequence, repeated calls, serial/parallel opportunity, duration, response bytes, status, timeout, extra fields, missing pagination, N+1 suspicion, cache behavior and UI loading/error/empty state.

## Query and database audit

Prioritize in this order: public offers/products/categories/brands/shops; cart/checkout/order; user/KYC; payment/wallet; QR/provenance; notification/chat; social; affiliate; live; dashboards.

For each measured suspect:

1. Link the endpoint and frontend flow.
2. Capture the Prisma query shape and equivalent SQL.
3. Run `EXPLAIN (ANALYZE, BUFFERS)` on local/staging production-like data.
4. Record planning/execution time, scan, rows, removed rows, buffers, sort/memory, index and waits.
5. Only then choose select projection, query batching/parallelism, pagination, index or short transaction.

Never add an index solely because a column exists, add Redis to hide a slow/wrong query, or put an external network call inside a DB transaction.

## Load profiles

Run only on local/staging. Use `autocannon`, k6 or an equivalent already installed tool; do not add a dependency without need.

| Profile | Concurrency | Duration | Workload |
|---|---:|---:|---|
| Baseline | 1–5 | 30 s | health + public catalog reads |
| Normal | 20 | 2 min | weighted guest/catalog + authenticated reads |
| Growth | 50 | 5 min | catalog/order/notification/chat mix |
| Peak | 100 | 5 min | catalog + dashboard + realtime connection mix |
| Burst | 10 → 100 | short ramp | Flash Sale/live-like read burst and recovery |
| Extended | 200–300 | only if staging permits | explicit approval and resource monitoring |

Do not benchmark payment gateways, real withdrawals, refunds, destructive admin actions or real production users.

## Optimization slices

Each slice must be independently testable and rollbackable:

1. Observability/measurement only.
2. Public catalog/search/product/shop projections and pagination.
3. Auth/user/KYC reads.
4. Cart/checkout/order reads and transaction boundaries.
5. Payment/wallet.
6. QR/provenance.
7. Chat/notification/realtime.
8. Social/community.
9. Affiliate.
10. Livestream.
11. Seller/admin dashboard aggregates.
12. Connection pool/DB-wide review.

Per slice: baseline → smallest change → focused test → benchmark after → frontend build/typecheck/E2E if contract-adjacent → rollback note → separate commit.

## Evidence layout

```text
artifacts/performance/
  baseline/
    metadata.json
    public-read.json
    authenticated-read.json
    query-samples.json
  final/
    normal-load.json
    peak-load.json
    burst-recovery.json
    resource-summary.json
```

Narrative outputs:

- `baseline-report.md`
- `flow-test-results.md`
- `endpoint-performance-matrix.md`
- `optimization-report.md`
- `cache-key-map.md`
- `load-test-report.md`
- `README.md`

## Exit criteria

- All source maps are current and generated inventory is reproducible.
- Production smoke evidence is clearly separated from local/staging performance evidence.
- Every optimization has before/after numbers or is explicitly rejected as unproven.
- Build, lint, typecheck, focused tests, regression tests and relevant browser flows pass.
- No API contract, permission, payment, KYC or durable-data safety regression.
- Remaining blocked gates name the missing staging/provider access and owner action.
