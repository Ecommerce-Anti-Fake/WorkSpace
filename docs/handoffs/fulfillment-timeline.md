# Fulfillment Timeline Handoff

## Feature Overview
Fulfillment status changes are audited and rendered as order detail timelines for seller, buyer, and admin views.

## Completed Work
- Fulfillment status changes write `ORDER` audit logs.
- Added `GET /orders/:id/fulfillment-audit`.
- Added generic `GET /orders/:id/audit` as the preferred order audit route.
- Seller order detail renders fulfillment audit timeline via `GET /orders/:id/audit`.
- Buyer order detail renders a sanitized fulfillment timeline via `GET /orders/:id/audit`.
- Admin order management renders the full fulfillment audit timeline via `GET /orders/:id/audit`.
- Existing order timeline now also includes payment audit entries.
- Older orders still show derived timeline from current status.
- Seller order batch allocation entries now link to admin inventory audit with `batchId` + `orderId` filters.

## Business Rules
- Every fulfillment status change should create an audit entry.
- Entry should include actor, from status, to status, note, and timestamp.
- Seller sees timeline for own shop orders.
- Buyer sees sanitized timeline for own orders.
- Admin sees full timeline.

## Schema/API Changes
- Prefer existing `audit_log` table.
- Suggested target:
  - `targetType = ORDER`
  - `targetId = order.id`
- `GET /orders/:id/audit` accepts requester role through the gateway/RPC contract so admins can read full entries.
- `GET /orders/:id/fulfillment-audit` remains a deprecated compatibility alias.
- Frontend order timeline queries use `/audit` only.
- Buyer responses from the audit use case hide actor user ID/email.

## Deprecation Plan
- Deprecated route: `GET /orders/:id/fulfillment-audit`.
- Replacement route: `GET /orders/:id/audit`.
- Deprecation type: advisory until external consumer usage is confirmed clear.
- Target removal date: 2026-06-15.
- Removal gate:
  - local frontend remains on `/audit` only;
  - API gateway/access logs show zero `/fulfillment-audit` hits for 14 consecutive days;
  - known external API consumers confirm migration to `/audit`.
- Removal work after gate passes:
  - delete the `getFulfillmentAudit` REST method from the API gateway controller;
  - remove the compatibility-route controller spec;
  - keep the internal orders RPC/use-case names unless a later internal rename is explicitly scheduled.

## Deployment/Test Status
- Backend focused tests passed:
  - `orders.controller.spec.ts`
  - `update-order-fulfillment.use-case.spec.ts`
  - `get-order-fulfillment-audit.use-case.spec.ts`
- Backend build passed.
- Frontend build passed.

## Pending Work
- Remove `/orders/:id/fulfillment-audit` after the 2026-06-15 removal gate passes.
- Production/API gateway log check attempted on 2026-05-18. Backend deployment is documented as Render, but this workspace has no Render service ID/API key or local access-log export available to query. Do not count the 14-day zero-hit requirement as satisfied until Render/API gateway access logs confirm a concrete zero-hit window.

## Important Constraints
- Do not log secrets.
- Keep buyer timeline sanitized.
- Avoid broad order module refactor.
- Audit write should be transactionally consistent with fulfillment update.

## Recommended Next Steps
- Query Render/API gateway access logs for `/orders/*/fulfillment-audit` over a dated 14-day window and record the exact zero-hit range before 2026-06-15.
