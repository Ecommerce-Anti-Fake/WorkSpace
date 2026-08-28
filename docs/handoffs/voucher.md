# Voucher

## Status

Voucher foundation and checkout lifecycle implemented on 2026-07-21.

## Implemented

- Added Prisma voucher, redemption, and order allocation models.
- Added system/shop ownership, percentage, fixed amount, and free-shipping types.
- Added explicit voucher funding source (`PLATFORM` or `SHOP`) and scope checks for all products, shop, offer, and variant.
- Added Decimal-based pricing calculations with percentage caps, minimum order checks, and proportional system-discount allocation.
- Cart checkout accepts one system voucher, shop vouchers by shop group, and shipping voucher selections; the backend revalidates active codes and recalculates seller/platform amounts, including platform free-ship vouchers.
- Buy Now accepts voucher fields without reading or mutating cart items, and persists the same pricing/allocation snapshot as the quote.
- Added seller/admin CRUD, activate/deactivate, redemption listing, and active buyer listing endpoints.
- Added `/cart/checkout/quote` and `/offers/buy-now/quote` backend quote endpoints.
- Checkout UI requests the cart quote when voucher/shipping selections change.
- Checkout creates voucher allocations and redemptions transactionally; payment success marks redemptions used, failed payment/cancelled pending orders release them.
- Full order refunds release used redemptions while retaining allocation snapshots.
- Partial wallet refunds accept item quantities, restore only the selected inventory, refund the net item amount, and persist proportional shop/system voucher reversal details in the order audit log.
- Voucher usage is rechecked and reserved inside a serializable order transaction with idempotency-key handling.
- Admin system voucher management now exposes a contract-complete creation form for discount type, amount/cap, minimum order, scope, usage limits, and local date range, with client validation and a live preview.
- Admin voucher listing now includes status/search filters, normalized money fields, status badges, and activate/pause actions through the existing admin status route.
- Seller voucher management now reuses the same contract-complete form with shop-specific copy and scope choices, while continuing to create through `POST /shops/:shopId/vouchers`.

## Accounting boundary

- Shop product discounts reduce the shop commission base and seller receivable.
- System discounts do not reduce seller receivable.
- Current aggregate order still exposes the legacy total `discountAmount`; detailed funding attribution is available in `OrderVoucherAllocation`.
- Usage limits are checked again inside the serializable reservation transaction; the idempotency key prevents duplicate checkout reservations.

## Verification

- `npx prisma validate` passed.
- `npm run build:deploy` passed in `back-end`.
- `npm run build` passed in `anti-fake-front-end`.
- `voucher-pricing.service.spec.ts` passed (3 tests).
- `nest build orders-service` passed.
- Finance reconciliation now exposes platform/shop voucher expense totals per summary and row.
- Voucher management now exposes seller/admin detail/update/activate/deactivate routes and admin redemption pagination.
- Scope and minimum-order checks are applied to product and free-shipping vouchers in both Cart and Buy Now.
- Existing checkout/create-order focused tests currently fail before voucher assertions because their fixtures omit the now-required variant boundary.
- 2026-07-22 deploy DI follow-up: `GatewayVoucherModule` now imports `GatewayUserModule`, which exports the `UserIdentityPort` required by `ActiveUserGuard`. The focused module regression test and `npx nest build api-gateway` passed.
- 2026-08-05 admin UI follow-up: `test/voucher-form.test.mjs`, targeted voucher ESLint, and `npm run build` passed. Authenticated visual browser verification remains pending because the available Chrome DevTools profile was locked and the isolated browser had no admin session.
- 2026-08-05 seller UI follow-up: seller form reuse, typed shop payload, focused ESLint, voucher form tests, and `npm run build` passed.

## Next step

Run migration/deployed smoke with real shop/admin accounts and verify partial wallet refund ledger entries against the audit snapshot. External PayOS partial-refund integration remains provider-dependent.
