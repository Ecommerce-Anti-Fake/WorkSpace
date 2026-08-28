# Optimization report

## Implemented slice: public shop summaries

`findPublicShopSummaries` previously loaded a page of shops and then executed
one review aggregate plus one sales aggregate per shop. For a ten-shop page,
the static pattern was `2 + 2N = 22` database calls (count, page query, and
two aggregates per shop).

The implementation now keeps the public response contract but batches the two
metrics with parameterized grouped SQL queries and maps results by shop ID. A
non-empty page uses four database calls: count, page query, grouped review
metrics, and grouped sales metrics. No migration, index, API contract, cache,
or production data was changed.

## Evidence

- TDD red test first proved the old path made zero `$queryRaw` calls.
- Focused repository test after the change: 10 tests passed.
- `nest build catalog-service`: passed.
- The deployed production baseline measured shops at p50 382.3 ms and p95/p99
  846.8 ms before this local change was deployed.

The production artifact has not been re-measured after deployment, so an actual
latency improvement is intentionally not claimed. The next measurement must use
the same endpoint and sample profile on staging, then repeat after deployment.

## Deferred candidates

Index additions require `EXPLAIN (ANALYZE, BUFFERS)` evidence against the target
database. Search `contains` predicates, offer/shop filters, and relation-heavy
catalog paths remain candidates, but no index was added without that evidence.
Frontend bundle warnings and existing lint findings remain baseline items, not
an accidental scope expansion.

## Rollback

Rollback the code slice with `git revert <performance-slice-commit>` in the
backend repository. No database rollback is required because this slice has no
migration.

