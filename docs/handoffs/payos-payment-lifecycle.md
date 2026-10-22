# PayOS payment lifecycle — 2026-10-22

Status: lifecycle released; presentation restored in the follow-up UI task. This document supersedes the
older payment handoffs for back navigation, expiry and resume behavior when released.

## Scope and financial invariants

Applies to ORDER, USER_WALLET_TOP_UP and SHOP_WALLET_TOP_UP. The server sends
PayOS `expiredAt` (Unix seconds) for a 15-minute lifetime and persists that exact
deadline. Reopening a payment does not create a link or restart the deadline.
The frontend renders the official `qrCode` as SVG, retaining the embedded form.
Back navigation only navigates; cancellation is a separate confirmed action.

Only a verified webhook or authenticated server-to-PayOS reconciliation confirms
payment. Client callbacks merely request reconciliation. PAID dominates cancellation
and expiry. Wallet credits and order escrow holds require atomic idempotency.
Order retries retain prior link identities so late paid callbacks can be accounted
for. A cancelled order must not resume fulfillment after stock has been restored;
late incoming funds remain accounted for and require the existing finance review.

## Historical dry-run

Executed against the configured local environment on 2026-10-22 using a database
transaction set to READ ONLY. No migration, cleanup, balance mutation, link creation,
cancellation or transfer was executed by the audit.

- PENDING order payments: 0.
- PENDING wallet top-ups: 17; all fit the 100-per-kind sample limit.
- Provider GET requests returned HTTP 200 with provider code 214 for all 17.
  Their actual payment status could not be confirmed with this environment/channel.
- No historical cleanup is authorized by this report. Existing rows without a known
  expiry remain outside the new automatic reconciliation sweep.
- Evidence: [historical-dry-run.txt](../evidence/payos-lifecycle/historical-dry-run.txt).
  Identifiers are hashed; credentials, connection strings and link URLs are omitted.

Command: `npm run payos:audit -- --dry-run [--provider]`. There is no apply mode.

## Migration and deployment

Use the existing PR/main GitHub Actions deployment. Apply additive Prisma migrations
only through that workflow; never reset or seed the deployed database. Backend must
be deployed and healthy before the frontend relying on resume endpoints is merged.
Retain additive database structures if code rollback is necessary. Existing workflow
rollback rebuilds the previous code and explicitly does not roll back migrations.

Current public runtime is UAT_DEMO per ADR-002; payment/provider operations retain
independent authorization boundaries. Real transactions and transfers are excluded
from this task's automated verification.

## Verification evidence

Lifecycle backend dec24b7 and frontend ec8c7b5 were deployed successfully; the UI follow-up is documented separately. Mocked provider/browser checks do not prove
real bank settlement or webhook delivery. Record each result in the evidence report.

Existing dependency audit baseline after clean locked installs: frontend 12 high;
backend 44 total (2 critical). Runtime-only audit: frontend 6 high; backend 27 total
(1 critical, 15 high, 11 moderate). No dependency versions changed for this feature.
Full backend ESLint currently reports 7,478 errors / 61 warnings across the existing
repository, including formatting errors in untouched bootstrap/controller files.
Do not represent a focused lint pass as a repository-wide pass.

## Official references

- [PayOS API](https://payos.vn/docs/api/): create-link expiry and QR payload,
  status lookup, cancellation and webhook contracts.
- [PayOS return URL](https://payos.vn/docs/du-lieu-tra-ve/return-url/): browser
  return data is informational and must not establish ledger state.

## API summary

All resume/cancel routes are authenticated; owners are checked before any provider
request. The returned contract includes status, expiresAt, serverTime, amount,
paymentLinkId, checkoutUrl/qrCode (only when resumable), canResume/canRetry where
applicable. HTTP success alone does not mean the financial action succeeded.

| Flow | Resume | Cancel |
|---|---|---|
| ORDER | GET /api/orders/:id/payos-payment | POST /api/orders/:id/payos-payment/cancel |
| USER_WALLET_TOP_UP | POST /api/wallet/me/top-ups/:paymentLinkId/resume | POST /api/wallet/me/top-ups/:paymentLinkId/cancel |
| SHOP_WALLET_TOP_UP | POST /api/shops/:shopId/wallet/top-ups/:paymentLinkId/resume | POST /api/shops/:shopId/wallet/top-ups/:paymentLinkId/cancel |

Wallet list: GET the corresponding wallet prefix plus /top-ups. ORDER retry retains
POST /api/orders/:id/retry-payos-payment. Wallet retries return to the appropriate
wallet's create-top-up flow with a new idempotency key. Never retry an unknown
provider outcome by blindly creating a new order.
