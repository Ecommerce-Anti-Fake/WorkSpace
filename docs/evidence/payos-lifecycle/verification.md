# PayOS verification evidence — 2026-10-22

## Local results

| Gate | Result |
|---|---|
| Frontend ESLint | PASS |
| Frontend TypeScript + production build | PASS; existing chunk-size warning |
| Frontend PayOS unit tests | 11/11 PASS |
| Isolated browser tests | 12/12 PASS; three flows, widths 320/768/1024/1440 |
| Backend full build | PASS; gateway/auth/users/catalog/orders/affiliate |
| Backend application TypeScript | PASS |
| Backend focused PayOS tests | 71/71 PASS |
| Backend wallet tests | 105 PASS, plus added scheduler-fairness regression PASS |
| New lifecycle/audit/integration-file lint | PASS |
| Prisma schema validation | PASS |
| Full backend test suite | 879 PASS /44 FAIL, 250 suites; same 12 failing files and44 failures as baseline |
| Baseline70f9bb5 full suite | 834 PASS /44 FAIL,248 suites |
| Repository-wide backend lint | FAIL:7478 errors/61 warnings, existing errors in untouched files |
| Global backend tsc including legacy specs | FAIL: old test fixtures/contracts; app tsconfig passes |
| Dependency audit | Existing findings; see handoff; no dependency version changes |

## Scenario matrix

Each browser scenario runs for ORDER, USER_WALLET_TOP_UP and SHOP_WALLET_TOP_UP.
Provider/API behavior is mocked. These results do not prove real bank processing.

| Scenario | Evidence |
|---|---|
| QR and MM:SS countdown | Official QR field rendered as SVG; backend tests verify15-minute expiredAt |
| Back then continue | Real order-list/wallet resume action; same paymentLinkId; cancel calls remain zero |
| Refresh | Deadline remains server-derived; no new15-minute lifetime |
| Close tab and reopen | Original tab closed; new tab uses durable flow/reference/shopId URL |
| Manual cancel | Confirmation required; unconfirmed response never shows cancelled; PAID wins race |
| Expiry while open | QR disappears at deadline and expiry message renders |
| Expiry with no browser | Backend scheduler tests exercise provider reconciliation independently |
| Success | Only server PAID changes result; fake SDK success alone remains pending |
| Payment at expiry / late webhook | Backend dominance/idempotency tests; browser race fixtures |
| Duplicate webhook | Backend wallet/order regression tests; actual PostgreSQL check is CI gate |
| Retry after expiry | Managed link closed/reconciled; same order; new link only on explicit retry |
| Mobile/tablet/desktop |320/768/1024/1440 widths, SVG sizes and no horizontal overflow asserted |

## Historical state

Database READ ONLY dry-run found17 PENDING wallet rows and0 PENDING orders.
All provider reads returned business code214. No cleanup, wallet credit, escrow
mutation, migration, real link creation or real transfer was performed by the audit.
See [historical dry-run](historical-dry-run.txt).

## Financial recovery boundaries

Legacy links without stored expiry cannot receive a fabricated deadline or resume
QR. Managed terminal links are reconciled for seven days; signed late success remains
accepted after that window. Late funds on a cancelled/restocked order are accounted
for without reopening fulfillment; finance must review refund/overpayment handling.
If distinct attempts are both paid, the order escrow hold stays idempotent and both
attempt identities remain available for finance review; this change does not automate
an overpayment refund.

## Release

Frontend PR: https://github.com/Ecommerce-Anti-Fake/Front-End/pull/1
Backend PR: https://github.com/Ecommerce-Anti-Fake/Back-End/pull/2

Backend dec24b7 and frontend ec8c7b5 deployed successfully; all post-merge CI passed. Backend deployed first. See release.json for exact SHAs and run IDs. Both temporary branches were deleted locally/remotely. PostgreSQL additive-migration drift check and concurrent ledger scenarios passed. Public homepage/asset200, SDK ready, guest payment route redirects to /auth (expected auth-refresh401). No real transfers or historical cleanup occurred.
