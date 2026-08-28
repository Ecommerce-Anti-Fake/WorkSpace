# Finance Reconciliation Dashboard Handoff

Last updated: 2026-07-21

## Scope

Task 9 is complete. Admin now has a read-only finance reconciliation dashboard over orders, payment intents, escrow, refunds, seller payout readiness, and affiliate commission liability.

## Backend

- `GET /orders/admin/finance-reconciliation`
  - Admin-only.
  - Filters: `fromDate`, `toDate`, `shopId`, `orderId`, `paymentStatus`, `escrowStatus`, `page`, `pageSize`, `sortOrder`.
  - Returns paginated rows plus summary totals.
- `OrdersRepository.findAdminFinanceReconciliation`
  - Reads `Order`, `OrderShopGroup`, `PaymentIntent`, `Escrow`, `Shop`, and `AffiliateConversion.commissionEntries`.
  - Filters `shopId` through `OrderShopGroup.shopId`; finance rows use the matching group identity and group-level amounts instead of legacy `Order.shopId`.
  - Derives seller payout state:
    - `READY_FOR_PAYOUT` when escrow is `RELEASED`.
    - `HELD_IN_ESCROW` when escrow is `HELD`.
    - `FROZEN` when escrow is `FROZEN`.
    - `REFUNDED` / `CANCELLED` when payment or escrow reaches those states.
- Summary totals include buyer payable, platform fee, seller receivable, ready seller payout, held escrow, frozen escrow, refund total, affiliate pending liability, and affiliate paid.
- Rows and summary also include platform-funded and shop-funded voucher expenses from `OrderVoucherAllocation`; partial item refunds retain proportional voucher reversal details in the order audit trail.

## Frontend

- `front-end-web/src/pages/admin-page.tsx`
  - Adds `Tai chinh` admin sidebar section.
  - Calls `/orders/admin/finance-reconciliation`.
  - Shows summary cards and per-order reconciliation rows.
  - Filters are read-only dashboard filters; no payout mutation is implemented in this slice.

## Verification

Passed on 2026-05-25:
- `npm test -- get-admin-finance-reconciliation.use-case.spec.ts orders.repository.spec.ts` in `back-end`
- `npm run build` in `back-end`
- `npm run build` in `front-end-web`

## Remaining Work

Task 10 should build on this dashboard:
- affiliate self-referral/circular referral prevention
- UI for conversion approval/rejection and payout management
- payout reconciliation status transitions
- fraud/reversal handling before commissions become payable

Best next feature: Task 10 harden affiliate payout and fraud controls.
