# Wallet Handoff

Last updated: 2026-08-05

## Current scope

- User wallet:
  - `GET /api/wallet/me`
  - `GET /api/wallet/me/transactions`
  - `POST /api/wallet/me/top-ups`
  - payout-account and withdrawal routes documented in `secure-wallet-withdrawals.md`
- Shop wallet:
  - balance, ledger, payout accounts, withdrawals, PayOS top-up, and COD obligations
  - `POST /api/shops/:shopId/wallet/top-ups`
  - `GET /api/shops/:shopId/wallet/cod-settlements`
- Admin wallet:
  - platform snapshots, reconciliation, payout-account review for legacy records, and manual withdrawal completion
  - withdrawal flow is `PENDING -> PROCESSING -> COMPLETED`, with `REJECTED` and `CANCELLED` terminal states; admin uses `Duyệt` / `Từ chối` for pending requests and `Chuyển tiền` for processing requests
- UAT-only withdrawal fixtures can be replaced with `npm run db:seed:withdrawals` in `back-end`; this targets only `SEED-WITHDRAWAL-*` rows and leaves the rest of the seed/data intact
- Frontend routes:
  - `/profile/wallet`
  - `/seller/wallet`
  - `/admin/wallet`
  - `/payment` hosts the shared embedded PayOS form for user and shop top-up

## Money invariants

- Money remains `Prisma.Decimal`.
- Balance changes go through serializable, idempotent, double-entry ledger transactions.
- PayOS top-up credit requires a valid webhook signature, matching amount, successful provider code, and a pending `WalletTopUp`.
- User/shop top-up creation navigates internally to `/payment` with
  `{ checkoutUrl, paymentLinkId, amount, topUpId }`; shop state also carries the
  authenticated `shopId`. The frontend never credits either wallet.
- Embedded PayOS success returns to the originating wallet with a
  `topUp=returned` pending-webhook notice. Cancel returns with
  `topUp=cancelled`.
- User and shop top-ups use destination-scoped idempotency keys.
- After a shop top-up is credited, outstanding COD obligations are collected oldest-first in the same transaction.
- Withdrawal request moves `AVAILABLE -> LOCKED`.
- `PROCESSING` is the admin-approved state and does not move money. Admin `COMPLETED` requires a transfer reference and then debits `LOCKED`.
- Reject/cancel/final failure unlocks funds exactly once.
- A shop with any outstanding COD obligation cannot withdraw until the obligation is settled.

## COD behavior

- COD cash collected by the shop is not represented as platform escrow.
- At successful delivery, the shop owes only:
  - the group platform fee after completed refund allocation
  - applicable automatic affiliate commission funded by that shop
- If balance is sufficient, the obligation is debited automatically.
- If balance is insufficient, delivery and existing-order processing continue. A durable obligation and notification are created.
- Default grace is 72 hours. Once overdue, checkout rejects new orders containing that shop.
- Paying the debt automatically restores eligibility to receive new orders.
- Full contract and rollout details are in `cod-shop-settlement.md`.

## Configuration and migrations

- Existing encryption secret: `PAYOUT_ACCOUNT_ENCRYPTION_KEY` (32 bytes).
- Existing PayOS secrets: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECK_SUM_KEY` or `PAYOS_CHECKSUM_KEY`.
- Bank lookup:
  - `BANK_ACCOUNT_LOOKUP_ENABLED=true`
  - `VIETQR_CLIENT_ID`
  - `VIETQR_API_KEY`
  - optional `VIETQR_API_BASE_URL`
- COD:
  - `COD_SHOP_SETTLEMENT_ENABLED=true`
  - optional `COD_DEBT_GRACE_HOURS=72`
- Optional PayOS URLs:
  - `PAYOS_WALLET_RETURN_URL`
  - `PAYOS_WALLET_CANCEL_URL`
  - `PAYOS_SHOP_WALLET_RETURN_URL`
  - `PAYOS_SHOP_WALLET_CANCEL_URL`
- Feature flags stay off until deployed smoke:
  - `SELLER_WITHDRAWALS_ENABLED`
  - `BUYER_WITHDRAWALS_ENABLED`
  - `PAYOS_PAYOUT_ENABLED=false`
- New migrations:
- `20260727120000_provider_bank_verification`
- `20260727130000_cod_shop_settlements`
- `20260805100000_add_dispute_wallet_transaction_types`

## Verification

Passed locally on 2026-08-05:

- Prisma merge, validate, and generate
- 16 focused backend suites, 78 tests
- `api-gateway`, `orders-service`, and `catalog-service` Nest builds
- frontend TypeScript/Vite production build
- focused withdrawal/reconciliation wallet tests (9 tests)

Not proven locally:

- deployed migrations against production-like data
- authenticated browser flow with real Firebase SMS/email
- live VietQR lookup
- live embedded PayOS user/shop top-up and webhook
- concurrent database/ledger smoke
- deployed application migration and authenticated admin browser smoke for the wallet/reconciliation page

## Next step

Deploy migrations and configuration to staging, then smoke one complete shop COD case: insufficient balance → notification → PayOS top-up → automatic collection → checkout eligibility restored.
