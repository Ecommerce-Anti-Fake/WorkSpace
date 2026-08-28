# Order Item Lineage Handoff

## Feature Overview
Backend can resolve upstream resale provenance for an order item by walking `OrderItemBatchAllocation.batch.sourceOrderItemId` until the terminal manufacturer/source batch.

## Completed Work
- Added authenticated API: `GET /distribution/lineage/order-items/:orderItemId`.
- Added distribution RPC contract: `distribution.get-order-item-lineage`.
- Added `GetOrderItemLineageUseCase` with root access checks:
  - order buyer user
  - seller shop owner
  - buyer shop owner
- Added repository query for order item, seller/buyer shop metadata, batch allocations, source batch metadata, and distribution node level/type.
- Seller identity and seller ownership checks are resolved from the order item's offer shop, not legacy `Order.shopId`.
- Response includes:
  - `terminalBatches`: upstream batches with no `sourceOrderItemId`, usually manufacturer/source batches.
  - `hops`: upstream-to-target order item hops, each with seller/buyer shop and consumed batch allocations.
- Recursion is read-only and capped to avoid cyclic lineage loops.
- Added frontend `LineageChain` renderer.
- Buyer order detail calls the lineage endpoint for the selected order item and renders the full chain when available.
- Offer detail calls the lineage endpoint from the first linked `sourceOrderItemId` when authenticated and falls back to the existing batch-link chain when unavailable.
- Seller order detail exposes "Xem chuỗi nguồn hàng" from fulfillment batch allocations and renders the same chain.
- Admin order timeline detail exposes item-level lineage buttons so support can inspect the chain during order review.
- Added compact authenticated lineage deep links/query params:
  - Buyer: `/orders/:orderId?lineageItem=:orderItemId`
  - Seller: `/shops?section=orders&orderId=:orderId&lineageItem=:orderItemId`
  - Admin/support: `/admin?section=orders&orderId=:orderId&lineageItem=:orderItemId`
- Buyer, seller, and admin lineage sections expose "Copy link" actions.

## Contract
- REST: `GET /distribution/lineage/order-items/:orderItemId`
- Auth: `JwtAuthGuard` + `ActiveUserGuard`
- Main response DTO: `OrderItemLineageResponseDto`
- Intended consumer: order/offer detail screens that already know an order item id or allocation `sourceOrderItemId`.

## Verification
- Focused backend test passed: `npm test -- get-order-item-lineage.use-case.spec.ts`.
- Backend build passed: `npm run build`.
- Frontend build passed: `npm run build`.
- Frontend build passed again after compact deep links: `npm run build` on 2026-05-20.
- Browser smoke loaded product/order routes via Vite; API calls failed only because local backend was not running.
- Browser smoke loaded seller/admin protected routes via Vite; both redirected to auth without frontend runtime crash.

## Changed Areas
- `back-end/libs/contracts/src/microservice/patterns.ts`
- `back-end/apps/api-gateway/src/modules/distribution/*`
- `back-end/libs/distribution/src/application/dto/network.dto.ts`
- `back-end/libs/distribution/src/application/use-cases/get-order-item-lineage.use-case.ts`
- `back-end/libs/distribution/src/infrastructure/persistence/distribution-pricing.repository.ts`
- `back-end/libs/distribution/src/presentation/rpc/distribution-pricing.rpc-controller.ts`
- `front-end-web/src/components/lineage-chain.tsx`
- `front-end-web/src/pages/orders-page.tsx`
- `front-end-web/src/pages/offer-detail-page.tsx`
- `front-end-web/src/pages/shops-page.tsx`
- `front-end-web/src/pages/admin-page.tsx`
- `front-end-web/src/styles.css`

## Constraints Preserved
- No schema changes.
- No inventory/order mutation.
- Root order item must be visible to the requester; upstream hops are returned only after root access passes.
- Existing inventory audit and allocation responses remain unchanged.

## Recommended Next Feature
Start buyer report flow. Public unauthenticated provenance is intentionally out of scope because users must log in before viewing lineage.
