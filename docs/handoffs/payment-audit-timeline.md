# Payment Audit Timeline Handoff

## Feature Overview
Payment status changes are audited on orders and shown in existing buyer, seller, and admin order detail timelines.

## Completed Work
- `markOrderPaid` now writes `PAYMENT_STATUS_CHANGED` audit logs inside the payment transaction.
- payOS webhook uses the order buyer or shop owner as the audit actor for paid confirmations.
- COD auto-payment during seller delivery passes the seller actor into the audit write.
- Existing `GET /orders/:id/fulfillment-audit` response now includes payment audit entries for compatibility.
- Added preferred generic route `GET /orders/:id/audit`; `GET /orders/:id/fulfillment-audit` remains a deprecated compatibility alias.
- Frontend buyer, seller, and admin order timelines now call `GET /orders/:id/audit` only.
- Buyer/seller order timelines show a payment step; admin order timeline labels payment audit rows separately.
- Failed payOS webhooks write `PAYMENT_STATUS_CHANGED` entries from the previous payment status to `FAILED`.
- Retrying failed payOS payment resets payment status to `PENDING` with a new provider ref and writes a `FAILED -> PENDING` payment audit row labeled as buyer retry, not provider confirmation.
- Cancellation/refund reversal paths write `PAYMENT_STATUS_CHANGED` entries to `CANCELLED` or `REFUNDED` with the buyer, seller, or admin actor that triggered the transition.

## Business Rules
- payOS webhook remains the source of truth for payOS paid state.
- Audit entries must not include payOS secrets.
- Buyer timeline remains sanitized according to the existing order audit use case.

## Schema/API Changes
- No schema changes.
- Generic order audit route: `GET /orders/:id/audit`.
- Deprecated compatibility route remains: `GET /orders/:id/fulfillment-audit`.
- Frontend query helper uses a single path again; no frontend fallback remains.
- Retry endpoint added in payment flow: `POST /orders/:id/retry-payos-payment`.
- Payment audit still reuses `audit_log` with:
  - `targetType = ORDER`
  - `action = PAYMENT_STATUS_CHANGED`
  - `fromStatus = previous payment status`
  - `toStatus = PAID`, `FAILED`, `PENDING`, `CANCELLED`, or `REFUNDED`

## Deprecation Plan
- Deprecated route: `GET /orders/:id/fulfillment-audit`.
- Replacement route: `GET /orders/:id/audit`.
- Target removal date: 2026-06-15.
- Removal requires zero production/API gateway hits on `/fulfillment-audit` for 14 consecutive days and external consumer migration confirmation.
- After confirmation, remove only the public REST compatibility route and its controller spec; keep the internal order-audit use case/RPC path unless a separate internal rename is scheduled.

## Deployment/Test Status
- Backend focused tests passed:
  - `orders.controller.spec.ts`
  - `get-order-fulfillment-audit.use-case.spec.ts`
  - `mark-order-paid.use-case.spec.ts`
  - `update-order-fulfillment.use-case.spec.ts`
  - `handle-payos-webhook.use-case.spec.ts` (duplicate success/failure and stale old-link success/failure regression cases)
  - `cancel-order.use-case.spec.ts`
  - `refund-order.use-case.spec.ts`
  - `resolve-order-dispute.use-case.spec.ts`
  - `resolve-admin-dispute.use-case.spec.ts`
  - `orders.repository.spec.ts`
- Backend build passed.
- Frontend build passed.
- Cancelled/refunded audit update did not require frontend changes.

## Pending Work
- Remove `/orders/:id/fulfillment-audit` after the 2026-06-15 removal gate passes.
- Production/API gateway log check attempted on 2026-05-18. Backend deployment is documented as Render, but this workspace has no Render service ID/API key or local access-log export available to query. The 14-day zero-hit removal gate remains unverified.

## Recommended Next Steps
- Query Render/API gateway access logs for `/orders/*/fulfillment-audit` over a dated 14-day window and record the exact zero-hit range before removing the compatibility route.
