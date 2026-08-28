# Inventory Audit Handoff

## Feature Overview
Admin can audit inventory movement history across batches, shops, offers, and orders.

## Completed Work
- Added admin-only API: `GET /distribution/admin/inventory-audit`.
- Added distribution RPC contract, DTOs, use case, repository query, mapper, and module wiring.
- Admin page has `Audit tồn kho` section with filters:
  - text search
  - batch ID
  - shop ID
  - offer ID
  - order ID
- UI shows movement totals and rows for:
  - `BATCH_RECEIVED`
  - `OFFER_RESERVED`
  - `FULFILLMENT_ALLOCATED`
  - `FULFILLMENT_RESTORED`
- Admin page accepts deep links such as `/admin?section=inventoryAudit&batchId=...&orderId=...`.
- Seller order batch allocation entries link directly into those admin audit filters.

## Verification
- Backend focused test: `npm test -- get-admin-inventory-audit.use-case.spec.ts` passed.
- Backend build: `npm run build` passed.
- Frontend build: `npm run build` passed.

## Changed Areas
- Backend contracts and API gateway distribution route/RPC.
- Distribution use case, mapper, repository query, DTOs, module/RPC wiring.
- Frontend admin page.
- Frontend seller order batch allocation links.

## Constraints Preserved
- Read-only audit endpoint.
- No schema changes.
- No fulfillment or stock mutation during audit reads.
- Admin route guarded by `RolesGuard`.

## Recommended Next Feature
Add insufficient-batch-stock and idempotent-allocation backend tests.
