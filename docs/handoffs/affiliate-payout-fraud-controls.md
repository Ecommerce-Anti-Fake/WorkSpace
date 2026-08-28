# Affiliate Program, Attribution, and Settlement Handoff

Last updated: 2026-07-23

## Product Rules

- A verified shop creates and funds every currently supported affiliate program.
- New programs may target the whole `SHOP` or one `OFFER` owned by that shop. Existing `BRAND` programs remain readable and eligible for attribution/settlement, but new `BRAND` programs are rejected. `PLATFORM` remains unsupported.
- The account owning the code used by the buyer receives Tier 1 commission.
- That account's direct parent receives Tier 2 commission. Deeper network levels remain visible for tree management but receive no commission from that conversion.
- Tier 1 must be greater than zero, Tier 2 cannot exceed Tier 1, and their sum cannot exceed 100%.
- Commission base is the eligible product gross amount minus shop-funded product discounts. Shipping and system-funded product discounts do not reduce this base.
- Checkout rejects a manually entered code if it is inactive, self-referring, outside the purchased scope, or cannot be funded from the owning shop's seller receivable. A signed link attribution is best-effort and is skipped when no longer eligible.

## Attribution and APIs

- Public active programs: `GET /api/affiliate/programs?page=&pageSize=`.
- Resolve a code into a signed link token: `POST /api/affiliate/attributions/resolve`.
- A manual checkout code takes priority over a stored link token.
- `AFFILIATE_ATTRIBUTION_SECRET` signs link tokens with HMAC-SHA256 and is mandatory with at least 32 characters. It is intentionally independent from `JWT_SECRET`.
- Active programs, commissions, and program members use bounded pagination (`pageSize <= 100`).
- Program members expose `parentAccountId`, `parentDisplayName`, and `networkDepth`, making the direct parent and tree level explicit.
- Attribution metadata stores versioned, money-safe snapshots of eligible offer/shop/brand items and shop-funded discount amounts.

## Money Lifecycle

1. Checkout creates one pending conversion per order, with only positive Tier 1/Tier 2 ledger entries.
2. The owning shop's seller receivable is checked before attribution is persisted.
3. When the order completes, escrow release credits:
   - each shop's remaining receivable to `PENDING`;
   - the funding shop's commission reserve to `LOCKED` instead of `PENDING`;
   - the platform remainder to `AVAILABLE` (or debits platform revenue for a platform-funded subsidy).
4. The conversion becomes `APPROVED`; commission entries become `LOCKED` with `availableAt = releaseAt + commissionHoldDays`.
5. The settlement worker moves each mature commission from the shop's `LOCKED` balance to the affiliate user's `AVAILABLE` balance.

Settlement is serializable and idempotent per commission through `AUTO:<commissionId>` payout keys and `AFFILIATE_LEDGER:<commissionId>:CREDIT` wallet keys. One malformed row is logged and isolated instead of blocking later candidates. Configure the polling interval with `AFFILIATE_SETTLEMENT_INTERVAL_MS`; default is one hour.

For newly created programs, `commissionHoldDays` is a system policy sourced from `AFFILIATE_COMMISSION_HOLD_DAYS` (default `7`, valid `1..30`). Seller requests cannot override it. Existing programs retain their stored snapshot, so changing the environment value affects only programs created afterward. Program slugs are generated from the program name when omitted; the optional slug input remains available for older API clients.

Legacy manual payout APIs remain for old `MANUAL` programs, but new shop programs are created as `AUTOMATIC` and manual payout money is also shop-funded.

## Refunds and Disputes

- `OrderItem` persists exact shop discount, system discount, and platform fee allocations. Legacy orders use an explicit proportional fallback.
- Partial refund requests require `Idempotency-Key`. `OrderRefund` uniquely records `(orderId, idempotencyKey)`, normalized quantities, total amount, and status.
- Repeated requests with the same key and payload return the current order without changing inventory, escrow, wallets, or commission entries. Reusing a key with another payload is rejected.
- Cumulative refunded quantities prevent over-refund. `OrderRefundShopGroup` records buyer, seller, platform, base, and discount reductions per `OrderShopGroup`.
- Escrow release after a partial refund pays only remaining per-shop receivables and uses the remaining `escrow.heldAmount`.
- A seller may partially refund only items belonging to that seller's shop group. One seller cannot refund, open, or resolve an aggregate multi-shop order for other shops.
- A dispute on a paid order freezes held escrow. A dispute after completion re-locks the exact remaining contribution from each shop and platform, while counting any existing affiliate reserve as already locked.
- A completed-order dispute refund consumes those locked balances plus the affiliate reserve, credits the buyer, returns unused reserve to the funding shop, cancels affiliate artifacts, and restores only remaining inventory.

## UI

The active frontend is `anti-fake-front-end`:

- `/affiliate` is a compact dashboard with public program discovery. `/affiliate?tab=member` opens the user KPI, joined-program, link/code, and commission-history view; invalid tab values fall back to public programs.
- `/seller/affiliate` is the verified-shop management surface inside Seller Center. It receives the single verified `shopId` from `SellerLayout` instead of calling `/shops/mine` again.
- The profile sidebar links to user Affiliate, while the seller header links to shop Affiliate.
- The shop uses a paginated program dashboard and accessible create/edit modal. Scope supports only the whole shop or one active/approved offer and does not expose slug or commission-hold controls.
- Commercial configuration is disabled after the first member or conversion. `CLOSED` is terminal and view-only.
- Program, reconciliation, commission, and member lists have pagination and independent loading/error/empty/retry states.
- Earnings show pending, locked, paid, and cancelled money; each locked ledger row shows `availableAt`.
- The page explains the two paid tiers separately from `networkDepth` and states that the shop funds the program.
- Checkout supports link capture plus a manually entered code. Manual codes are enforced against the final cart/order scope by the backend.

## Database and Deployment

Apply migrations in timestamp order after merging split Prisma schemas:

1. `20260722180000_affiliate_automatic_settlement`
2. `20260722200000_order_refund_accounting`

Required deployment configuration:

```text
AFFILIATE_ATTRIBUTION_SECRET=<random value of at least 32 characters>
AFFILIATE_SETTLEMENT_INTERVAL_MS=3600000
AFFILIATE_COMMISSION_HOLD_DAYS=7
```

Run `npm run prisma:merge`, `npx prisma validate`, and `npx prisma generate` before service builds.

## Verification on 2026-07-22

- 28 focused suites / 104 tests passed across affiliate attribution, commission, program, pagination, settlement, refund, release-escrow, dispute authorization, multi-shop dispute funding, and idempotency.
- Type-check passed independently for API Gateway, Affiliate Service, and Orders Service.
- `npm run build` passed in `anti-fake-front-end`.
- ESLint passed for the touched affiliate, attribution capture, checkout, shop API, and checkout contract files. Full-repository lint still reports pre-existing errors in unrelated modules.
- `/affiliate` rendered in a real browser at desktop and 390px mobile widths. Its API request returned 404 because the local backend stack had not been restarted with the new routes, so live API behavior remains unverified.
- On 2026-07-23, `/affiliate?tab=member` rendered the logged-out user state in a real browser, an invalid `tab` fell back to programs, and unauthenticated `/seller/affiliate` redirected to `/auth`. The local Vite session had no `VITE_API_BASE_URL`, so authenticated shop API behavior remains unverified.
- On 2026-07-23, affiliate program creation was narrowed to `SHOP`/`OFFER`, seller-supplied hold values were removed, and backend-generated slugs plus the environment-owned hold policy were covered by 19 affiliate suites / 49 passing tests. Affiliate Service and API Gateway builds passed; the focused seller Affiliate frontend lint and production build passed.
- On 2026-07-23, both Affiliate pages were redesigned as operational dashboards. Six focused backend suites / 11 tests, both backend entrypoint type-checks, the frontend production build, and focused frontend ESLint passed. Browser QA covered 1366x768 and 390x844; seller-populated states used browser-level mocked API data because the local backend stack was not running.

## Remaining Runtime Proof

- Apply both migrations to a non-production database and smoke a real wallet order through checkout, completion, hold expiry, and settlement.
- Smoke one partial refund and one completed multi-shop dispute with real persisted wallet balances.
- Restart deployed services before browser verification; a static build does not prove live RPC, worker scheduling, or payment-provider behavior.
