# Endpoint performance matrix

Current measured evidence is limited to safe guest `GET` requests. The values
below are three sequential samples from production, so they are useful for
triage but insufficient for SLA or capacity claims.

| Role | Method | Endpoint | p50 | p95/p99 | Status/error | Payload |
| --- | --- | --- | ---: | ---: | --- | ---: |
| Guest | GET | `/api/health` | 24.8 ms | 124.9 ms | 200 / 0% | 139 B |
| Guest | GET | `/api/offers?page=1&pageSize=10` | 333.0 ms | 713.5 ms | 200 / 0% | 6,239 B |
| Guest | GET | `/api/categories` | 43.2 ms | 44.3 ms | 200 / 0% | 993 B |
| Guest | GET | `/api/brands` | 47.1 ms | 48.2 ms | 200 / 0% | 786 B |
| Guest | GET | `/api/shops?page=1&pageSize=10` | 382.3 ms | 846.8 ms | 200 / 0% | 2,070 B |
| Guest | GET | `/api/live/sessions?filter=all` | 208.0 ms | 241.6 ms | 200 / 0% | 4,106 B |

Query count and DB duration are now emitted by the backend request telemetry,
but were not exposed by the public response and therefore remain `unknown` for
this pre-deployment run. Cache hit/miss and pool wait metrics remain unknown;
they must not be inferred from endpoint latency.

See [`public-read.json`](../../artifacts/performance/baseline/public-read.json)
for the raw diagnostic output and [`api-inventory.md`](./api-inventory.md) for
the complete static route index.
