# Escrow Lifecycle Handoff

Last updated: 2026-07-27

## Scope

Task 8 is complete. Escrow is now active business state attached to orders, not only a modeled table.

Implemented lifecycle:
- Payment success moves escrow to `HELD`, sets `heldAmount`, sets `holdAt`, and writes `ESCROW_STATUS_CHANGED`.
- Buyer/seller completion of a delivered order moves escrow to `RELEASED`.
- Open disputes block completion and move escrow to `FROZEN`.
- Dispute resolution without refund restores escrow to `HELD` for paid orders or `RELEASED` for completed orders.
- Refund and cancellation flows move escrow to `REFUNDED` or `CANCELLED` while preserving payment audit updates.
- Buyer, seller, and admin order screens show escrow status, held amount, hold timestamp, and release timestamp.
- COD is explicitly outside escrow:
  - COD orders are created with escrow status `NOT_APPLICABLE`.
  - Marking an aggregate COD order paid after final delivery does not create a hold or reset fulfillment.
  - Completing a COD order skips escrow release.
  - Shop platform-fee and affiliate obligations use `CodShopSettlement`; see `cod-shop-settlement.md`.

## Backend Touchpoints

- `back-end/libs/orders/src/infrastructure/persistence/orders.repository.ts`
  - Central escrow transition helper: `updateEscrowStatusWithAudit`.
  - Public use-case helper: `updateEscrowStatusForOrder`.
  - `markOrderPaid` now holds escrow with audit.
  - `completeOrder` now releases escrow with actor context.
- `back-end/libs/orders/src/application/services/order-reversal.service.ts`
  - Cancel, refund, and dispute resolution update escrow state alongside payment state.
- `back-end/libs/orders/src/application/use-cases/open-order-dispute.use-case.ts`
  - Freezes escrow after a dispute is opened.
- `back-end/libs/orders/src/application/use-cases/complete-order.use-case.ts`
  - Blocks completion while an open dispute exists.
- `back-end/libs/orders/src/application/use-cases/orders.mapper.ts`
  - Exposes `escrowHeldAmount` in order responses.

## Frontend Touchpoints

- `front-end-web/src/pages/orders-page.tsx`
  - Buyer order detail shows escrow status, held amount, hold date, release date.
- `front-end-web/src/pages/shops-page.tsx`
  - Seller order detail shows escrow status, held amount, hold date, release date.
- `front-end-web/src/pages/admin-page.tsx`
  - Admin order list/detail exposes escrow state for inspection.

## Verification

Passed on 2026-05-21:
- `npm test -- mark-order-paid.use-case.spec.ts complete-order.use-case.spec.ts open-order-dispute.use-case.spec.ts resolve-admin-dispute.use-case.spec.ts order-reversal.service.spec.ts` in `back-end`
- `npm run build` in `back-end`
- `npm run build` in `front-end-web`

## Remaining Work

Escrow state is implemented inside order/payment/dispute flows. Real finance operations still need Task 9:
- platform fee aggregation
- seller receivable reporting
- refund/dispute reconciliation
- affiliate liability reconciliation
- payout status dashboard

Best next feature: Task 9 finance reconciliation dashboard.
