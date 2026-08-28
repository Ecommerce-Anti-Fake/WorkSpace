# Retry Failed payOS Payment Handoff

## Feature Overview
Buyers can retry a failed payOS payment from the existing pending order. The backend creates a new payOS checkout link, updates the payment provider reference, and resets payment status to `PENDING`.

## Completed Work
- Added authenticated endpoint: `POST /orders/:id/retry-payos-payment`.
- Added orders microservice message pattern: `orders.retry-payos-payment`.
- Added `RetryPayOSPaymentUseCase`.
- Added repository update to set a new `PaymentIntent.providerRef` and reset `paymentStatus` to `PENDING`.
- Added focused unit coverage for successful retry, seller rejection, and invalid paid/non-pending retry.
- Added frontend buyer order action for failed pending payOS orders.
- Frontend calls `POST /orders/:id/retry-payos-payment` and redirects to the returned `payOSCheckoutUrl`.
- Retry now writes a buyer retry payment audit row (`FAILED -> PENDING`) labeled as waiting for provider confirmation.

## Business Rules
- Only the retail buyer can retry.
- Order must remain `pending`.
- Payment intent must be `PAYOS` and `FAILED`.
- Retry does not create a new order.
- Retry does not alter inventory, escrow, fulfillment, or mark the order paid.
- payOS webhook for the new payment link remains the paid-state source of truth.
- Retry audit entries are buyer actions, not provider confirmations.

## Schema/API Changes
- No schema changes.
- New REST endpoint: `POST /orders/:id/retry-payos-payment`.
- Response reuses `OrderResponseDto` and includes `payOSOrderCode`, `payOSPaymentLinkId`, `payOSCheckoutUrl`, and `payOSQrCode`.
- New contract type: `RetryPayOSPaymentMessage`.
- Retry audit uses `PAYMENT_STATUS_CHANGED` with metadata `event = PAYOS_PAYMENT_RETRY` and `providerConfirmation = false`.

## Deployment/Test Status
- Focused tests passed:
  - `retry-payos-payment.use-case.spec.ts`
  - `handle-payos-webhook.use-case.spec.ts`
- Stale old-link and duplicate success/failure webhook cases are covered, including stale failed callbacks and duplicate failed callbacks after the order is already paid.
- Backend build passed.
- Frontend build passed.

## Pending Work
- None for this slice.

## Important Constraints
- Do not expose payOS credentials outside backend.
- Do not treat retry as paid until payOS success webhook arrives.
- Do not create duplicate orders for retry.

## Recommended Next Steps
- Add cancelled/refunded payment audit rows if those transitions need buyer/seller/admin timeline visibility.
