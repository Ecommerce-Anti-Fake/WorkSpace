# Failed Payment UX Handoff

## Feature Overview
Failed payOS payments now surface clearly to buyers and are recorded on the backend without cancelling the order automatically.

## Completed Work
- Backend marks still-pending payOS orders as `FAILED` when payOS sends a non-success webhook.
- Failed payment transitions write `PAYMENT_STATUS_CHANGED` audit logs.
- Checkout result failure copy tells buyers to inspect the order, avoid manual transfers, and wait for reconciliation if money was deducted.
- Backend now supports retrying failed payOS payment from the existing pending order.
- Buyer order cards now show a retry-payment action for failed pending payOS orders.
- Buyer order detail/list labels failed payment as `Thanh toán thất bại` and shows a failed-payOS next-step hint.

## Business Rules
- payOS webhook remains the source of truth for provider payment state.
- Failed payOS payment does not mark the order paid.
- Failed payOS payment does not cancel the order or restore inventory automatically.
- Buyers can still cancel pending failed-payment orders through the existing cancel flow.
- Buyers can retry pending failed payOS orders without creating a duplicate order.

## Schema/API Changes
- No schema changes.
- New backend endpoint: `POST /orders/:id/retry-payos-payment`.
- Reuses `PaymentIntent.paymentStatus = FAILED`.
- Retry resets `PaymentIntent.paymentStatus` to `PENDING` and stores the new `PAYOS:<paymentLinkId>` provider ref.
- Reuses `audit_log` with `action = PAYMENT_STATUS_CHANGED` and `toStatus = FAILED`.

## Deployment/Test Status
- Focused backend test: pass (`handle-payos-webhook.use-case.spec.ts`).
- Focused backend retry test: pass (`retry-payos-payment.use-case.spec.ts`).
- Backend build: pass.
- Frontend build: pass.

## Pending Work
- None for failed-payment retry UX.

## Important Constraints
- Do not treat failed payment as paid without a successful payOS webhook.
- Do not auto-cancel failed payments unless business rules change.
- Do not expose payOS secrets in audit metadata or UI.

## Recommended Next Steps
- Add cancelled/refunded payment audit rows if those transitions need buyer/seller/admin timeline visibility.
