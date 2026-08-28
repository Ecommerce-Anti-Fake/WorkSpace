# COD Shop Settlement

Status: implemented behind feature flag; staging smoke pending

Last updated: 2026-07-27

## Business rule

The courier/buyer pays COD cash to the shop. The platform does not fabricate an escrow balance for that cash.

When one shop group is delivered, the shop owes:

`net platform fee + applicable automatic shop-funded affiliate commission`

It does not owe the gross COD order value.

## Lifecycle

1. When a COD group moves to `PROCESSING`, `prepare` calculates the expected obligation. If the shop balance is short, a warning notification is created.
2. When that group moves to `DELIVERED`, `activate` recalculates from persisted order/refund/affiliate data.
3. If balance is enough:
   - debit shop `AVAILABLE`
   - credit platform revenue for the platform fee
   - reserve applicable affiliate amount in shop `LOCKED`
   - mark settlement `SETTLED`
4. If balance is short:
   - mark settlement `OUTSTANDING`
   - preserve the original due date on retries
   - notify the shop
   - do not block delivery, completion, cancellation of other pending groups, or existing-order processing
5. A successful shop top-up collects outstanding obligations oldest-first in the same serializable ledger transaction.

## Restrictions

- Any outstanding COD obligation blocks shop withdrawals.
- Before inventory reservation, checkout checks all involved shops for overdue obligations.
- Default grace is 72 hours.
- After the due time, new checkout containing the shop fails with:
  - code: `SHOP_COD_DEBT_OVERDUE`
  - `shopId`
  - `dueAt`
- Eligibility is derived from open obligations. No manual unlock is required after payment.

## Aggregate orders and shipping

- Settlement is per `OrderShopGroup`.
- A group can settle independently without changing another shop's group.
- Aggregate COD payment becomes `PAID` only after all active groups are delivered.
- Carrier status sync delegates the delivered transition to the same fulfillment use case, so manual and provider-driven delivery share settlement logic.

## Data and APIs

- Model: `CodShopSettlement`
- Statuses: `PENDING`, `OUTSTANDING`, `SETTLED`, `REVERSED`
- Unique key: `orderShopGroupId`
- Main collection ledger idempotency key: `COD_SETTLEMENT:<groupId>:COLLECT`
- Shop API: `GET /api/shops/:shopId/wallet/cod-settlements`
- Shop wallet response includes:
  - `codAmountDue`
  - `requiredTopUpAmount`
  - `hasCodDebt`
  - `hasOverdueCodDebt`
  - `nextCodDebtDueAt`

## Configuration

- `COD_SHOP_SETTLEMENT_ENABLED=true`
- `COD_DEBT_GRACE_HOURS=72` (allowed range: 1–720)
- `PAYOS_SHOP_WALLET_RETURN_URL` and `PAYOS_SHOP_WALLET_CANCEL_URL` are optional

## Verification

Passed locally:

- obligation calculation and automatic collection
- insufficient-balance debt and notification
- 72-hour checkout restriction
- oldest-first top-up collection
- withdrawal blocking
- aggregate COD final-delivery timing
- carrier-sync delegation
- COD no-escrow behavior
- focused backend aggregate: 16 suites, 78 tests
- Prisma validation, three service builds, and frontend production build

Still required:

- staging migration
- authenticated seller UI smoke
- live PayOS shop top-up/webhook
- concurrent top-up/delivery retry smoke against PostgreSQL
