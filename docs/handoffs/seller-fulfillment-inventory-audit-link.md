# Seller Fulfillment Inventory Audit Link Handoff

## Feature Overview
Seller order batch allocation entries now deep-link into admin inventory audit filters for faster fulfillment trace review.

## Completed Work
- Seller order item batch allocations render as links.
- Links target `/admin?section=inventoryAudit&batchId=...&orderId=...`.
- Admin page reads inventory audit query params into draft/applied filters.
- Admin page opens the `inventoryAudit` section when those params are present.

## Changed Areas
- `front-end-web/src/pages/shops-page.tsx`
- `front-end-web/src/pages/admin-page.tsx`
- `front-end-web/src/styles.css`

## Verification
- Backend focused test: `npm test -- get-admin-inventory-audit.use-case.spec.ts` passed.
- Backend build: `npm run build` passed.
- Frontend build: `npm run build` passed.

## Constraints Preserved
- No backend/schema changes.
- Inventory audit remains read-only and admin-only.
- Minimal frontend-only route/query bridge.

## Recommended Next Feature
Add insufficient-batch-stock and idempotent-allocation backend tests.
