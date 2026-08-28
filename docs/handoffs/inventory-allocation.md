# Inventory Allocation Handoff

## Feature Overview
Batch allocation is retained as an optional legacy/distribution capability but is temporarily disabled in normal seller order fulfillment. Normal orders use `Offer.availableQuantity` as their inventory source.

## Completed Work
- Seller can link offer to batch/lô hàng.
- Offer detail can expose batch/source info.
- Checkout reserves offer stock only.
- Moving an order or seller shop group to `PROCESSING` now updates fulfillment directly and does not consume or require batch quantity.
- Allocation persists in `OrderItemBatchAllocation`.
- Seller/buyer/admin order responses include batch trace info.
- Existing allocation prevents double-consume.
- Fulfillment allocation resolves inventory ownership from the active `OrderShopGroup.shopId` (or the item offer shop for legacy single-shop rows), never from legacy `Order.shopId`.
- Cancelling one multi-shop group restores offer and batch inventory only for items linked to that group.
- Fulfillment status changes write `ORDER` audit logs.
- Seller order detail shows a fulfillment audit timeline.
- Admin inventory audit page is implemented.
- Seller order batch allocation entries deep-link to admin inventory audit filters.
- Backend regression tests cover insufficient fulfillment batch stock.
- Backend regression tests cover idempotent fulfillment allocation for already allocated order items.
- `SupplyBatch` now owns product identity snapshot fields (`brandId`, `categoryId`, `modelName`, `gtin`, `verificationPolicy`) and no longer depends on `ProductModel`.
- `DistributionShipmentItem` now owns product identity snapshot fields and accepts batch-only shipment items without `ProductModel`.

## Business Rules
- Seller can only link/consume batches for owned shop.
- Normal `PROCESSING` does not read, validate, or consume linked offer batch stock.
- Batch quantity does not gate seller confirmation for normal orders.
- Batch must belong to same seller shop.
- Offer stock is reserved at checkout and remains the primary stock for normal orders.

## Schema/API Changes
- Existing `OrderItemBatchAllocation` is now active trace table.
- Migration `20260527113000_supply_batch_identity_snapshot` backfills batch identity fields from `product_model`.
- Migration `20260527120000_distribution_shipment_item_identity_snapshot` backfills shipment item identity fields from `supply_batch`/`product_model`.
- Migration `20260528022858_remove_product_model` drops legacy ProductModel columns/FKs/table after identity snapshots exist.
- Order response includes `items[].batchAllocations[]`:
  - `batchId`, `quantity`, `batchNumber`, `sourceName`, `countryOfOrigin`, `sourceType`, `receivedAt`
- Backend method added:
  - `OrdersRepository.allocateOrderBatchesAndUpdateFulfillment(id, fulfillmentStatus)`
- The method and historical allocation records remain for compatibility, but `UpdateOrderFulfillmentUseCase` no longer calls it for `PROCESSING`.
- API added:
  - `GET /orders/:id/audit`
  - `GET /orders/:id/fulfillment-audit` (deprecated compatibility alias; target removal 2026-06-15 after external usage clears)
  - `GET /distribution/admin/inventory-audit`
- `OrderInventoryService.reserveForOrder()` no longer consumes batches.

## Deployment/Test Status
- Backend build: pass.
- Frontend build: pass.
- Focused fulfillment test: pass.
- Focused fulfillment audit tests: pass.
- Focused inventory audit test: pass.
- Focused inventory allocation regression test: pass (`orders.repository.spec.ts`).
- Multi-shop group-2 allocation and group-scoped restoration regression tests: pass (`update-order-fulfillment.use-case.spec.ts`, `order-reversal.service.spec.ts`, `orders.repository.spec.ts`, 2026-07-09).
- Supply batch snapshot verification passed: `create-supply-batch.use-case.spec.ts`, `create-distribution-shipment.use-case.spec.ts`, `receive-wholesale-order-inventory.use-case.spec.ts`, `allocate-offer-batches.use-case.spec.ts`, backend build, frontend build.
- Distribution shipment/pricing snapshot verification passed: `create-distribution-shipment.use-case.spec.ts`, `resolve-wholesale-pricing.use-case.spec.ts`, `create-pricing-policy.use-case.spec.ts`, backend build, frontend build.
- Backend commit: `98d7fc8`.
- Frontend commit: `670f556`.

## Pending Work
- Improve allocation display UI.

## Important Constraints
- Do not consume batch at checkout.
- Do not decrement offer stock twice.
- Do not reintroduce mandatory batch allocation when seller confirms a normal order.
- Do not allow another shop's batch to satisfy order.
- Older orders with allocations must not consume again.
- New inventory reads must use `SupplyBatch` snapshot fields for product identity.
- New shipment reads must use `DistributionShipmentItem` snapshot fields for product identity.

## Recommended Next Steps
- After DB reset/seed, smoke-test allocation from a linked batch through `PROCESSING` and confirm order batch trace data still renders.
