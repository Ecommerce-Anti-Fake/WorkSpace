# Seller Orders Handoff

## Feature Overview
Seller manages orders for their shop: list, detail, and fulfillment status updates.

## Completed Work
- Backend seller order APIs exist.
- Seller shop order list now returns a paginated compact payload for table/list views.
- Seller can list eligible shop orders with pagination and a shop-level fulfillment `status` filter, and can view details separately.
- Seller can update fulfillment status.
- In multi-shop orders, seller cancellation is scoped to the owned `OrderShopGroup`: only a `PENDING` group can be cancelled, only that group's inventory is restored, and the aggregate order fulfillment status is resynchronized. Single-shop cancellation keeps the existing whole-order reversal flow.
- Frontend seller order management page exists.
- Buyer/admin views expose basic order status.
- Seller dashboard overview UI was redesigned to match the premium AntiFake white/red layout: left sidebar, top header, KPI cards, revenue chart, recent orders, and best-selling products.
- Seller dashboard analytics API now provides real KPI values, growth percentages, revenue series, recent orders, and top products for the owned shop through the shop-scoped route.
- Seller summary metrics API is split from dashboard analytics: `GET /shops/:shopId/summary-metrics?from=YYYY-MM-DD&to=YYYY-MM-DD` returns only `{ range, revenue, orders, offers }`.
- Seller daily chart API is split from dashboard analytics: `GET /shops/:shopId/daily-metrics?days=7&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD` returns only `{ range, series }` for revenue and order count charts.
- Seller revenue drilldown tab now supports date filtering, revenue-contributing order rows, and client-side CSV export.
- Cart read responses now use `shops[]` groups with `shopId`, `shopName`, and grouped `items[]`; the duplicate legacy flat cart `items[]` array is no longer exposed. Order read responses still expose grouped `shops[]` alongside order-level `items[]`.
- Multi-shop order projections resolve `sellerShopId`/`sellerShopName` from canonical shop groups and item offer shops. Legacy `Order.shopId` is only a fallback for pre-group records.
- Admin dispute projections expose additive `shops[]`; the existing singular seller fields remain compatibility fields using the first canonical shop because disputes do not yet store `orderShopGroupId`.

## Business Rules
- Seller can only access orders for owned shop.
- Fulfillment flow: `PENDING` -> `PROCESSING` -> `SHIPPING` -> `DELIVERED`.
- `PROCESSING` requires paid order or COD.
- `SHIPPING` requires `PROCESSING`.
- `DELIVERED` requires `SHIPPING`.
- Closed orders cannot be updated.
- COD can be marked paid on delivery.

## Schema/API Changes
- Order response includes fulfillment, payment, seller/buyer/shop, and item fields.
- Cart responses include `shops[]` for shop-grouped item rendering. Cart items no longer expose offer `shippingMethods`; checkout shipping choices are loaded through `POST /cart/items/:cartItemId/shipping-options`.
- Seller fulfillment endpoint validates ownership and transition order.
- `GET /orders/seller/shops/:shopId?status=all&page=1&pageSize=20` returns `{ total, page, pageSize, items }`; each item contains `orderId`, `customer: { id, name, email }`, `orderAmount`, `status`, and `createdAt` as the order date. `status` comes from the matching `OrderShopGroup.fulfillmentStatus` (with the order-level value as a legacy fallback); the compact seller list intentionally omits aggregate `orderStatus`. The filter accepts only `all`, `PENDING`, `PROCESSING`, `SHIPPING`, `DELIVERED`, or `CANCELLED`; `all` or an omitted value returns every fulfillment status. The list includes COD orders and payOS orders whose payment status is `PAID`; unpaid/failed payOS orders are excluded. OpenAPI exposes the filter values as an enum and invalid values fail request validation.
- `GET /shops/:shopId/dashboard-analytics?days=7&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD` returns `{ range, stats, series, recentOrders, topProducts, revenueOrders }` and reuses seller shop ownership validation. Keep this for the full dashboard payload.
- Seller dashboard/summary/daily revenue is shop profit, not buyer-paid order total: for grouped orders it must use the matching `OrderShopGroup.sellerReceivableAmount` for the requested `shopId`. Do not fall back to `buyerPayableAmount` or `totalAmount`, because those can include shipping and other shops in a multi-shop order. Product/item counts for these seller metrics must also be scoped to the matching order shop group.
- `GET /shops/:shopId/best-selling-products?limit=10` returns only completed/delivered sales for offers whose `offer.shopId` also equals the route `shopId`; the order-item query must keep both `orderShopGroup.shopId = shopId` and `offer.shopId = shopId` so corrupted or legacy cross-shop item/group rows cannot leak foreign offers.
- `GET /shops/:shopId/daily-metrics?days=7&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD` returns compact daily chart data: `{ range, series }`, where each series point is `{ date, label, revenue, orders }`. Use `series[].revenue` for daily revenue charts and `series[].orders` for daily order-count charts. The route is owned by the shop gateway module and delegates to orders-service with the same seller shop ownership validation.
- `GET /shops/:shopId/summary-metrics?from=YYYY-MM-DD&to=YYYY-MM-DD` returns compact KPI cards for revenue, order count, and sold offer item quantity, with growth compared to the immediately preceding same-length date range. `growthPercent` is negative when the current range is lower than the previous range, for example `-25` means down 25%. The gateway route lives in the shop module while the aggregate still delegates to orders-service for order-item data.
- `GET /shops/:shopId/order-status-summary` returns `{ totalOrders, pendingOrders, shippingOrders, completedOrders }` across all dates. Pending uses `fulfillmentStatus=PENDING`, shipping uses `fulfillmentStatus=SHIPPING`, and completed uses `orderStatus=completed` or `fulfillmentStatus=DELIVERED`. Access is restricted to the shop owner.

## Deployment/Test Status
- Backend build: pass.
- Frontend build: pass.
- Frontend build after seller dashboard redesign: pass (`npm run build` in `front-end-web`, 2026-05-29).
- Seller dashboard analytics focused test: pass (`npm test -- get-seller-shop-dashboard-analytics.use-case.spec.ts`, 2026-05-29).
- Seller revenue drilldown focused test: pass (`npm test -- get-seller-shop-dashboard-analytics.use-case.spec.ts`, 2026-05-29).
- Backend build after analytics API: pass (`npm run build` in `back-end`, 2026-05-29).
- Frontend build after wiring analytics API: pass (`npm run build` in `front-end-web`, 2026-05-29).
- Frontend build after revenue drilldown: pass (`npm run build` in `front-end-web`, 2026-05-29).
- Backend full build after revenue drilldown is blocked by pre-existing `UsersIdentityAdapter` missing `updatePassword` in api-gateway/auth adapters; focused seller analytics tests still pass.
- Focused fulfillment use-case test: pass.
- Multi-shop cancellation and shop-scoped allocation regression tests: pass (`npm test -- update-order-fulfillment.use-case.spec.ts order-reversal.service.spec.ts orders.repository.spec.ts --runInBand`, 2026-07-09).
- Shop grouping mapper test: pass (`npm test -- orders.mapper.spec.ts`, 2026-06-15).
- Orders service build after shop-grouped response mapping: pass (`npx nest build orders-service`, 2026-06-15). Full backend `npm run build` is blocked in this Windows shell by the Prisma npm shim path before TypeScript starts.
- Seller summary metrics focused tests and builds: pass (`npm test -- get-seller-shop-summary-metrics.use-case.spec.ts order.controller.spec.ts shop.controller.spec.ts --runInBand`, `npx nest build api-gateway`, `npx nest build orders-service`, 2026-06-29).
- Shop-scoped dashboard analytics route tests and builds: pass (`npm test -- get-seller-shop-summary-metrics.use-case.spec.ts get-seller-shop-dashboard-analytics.use-case.spec.ts order.controller.spec.ts shop.controller.spec.ts`, `npx nest build api-gateway`, `npx nest build orders-service`, 2026-06-29).
- Seller daily metrics focused tests: pass (`npx jest --runInBand get-seller-shop-daily-metrics.use-case.spec.ts shop.controller.spec.ts`, 2026-07-03).
- Seller shop revenue scoping regression tests: pass (`npm test -- get-seller-shop-dashboard-analytics.use-case.spec.ts get-seller-shop-daily-metrics.use-case.spec.ts get-seller-shop-summary-metrics.use-case.spec.ts --runInBand`, 2026-07-09). These cover multi-shop orders where aggregate order totals include shipping and another shop's receivable amount.
- Seller shop order compact list tests and builds: pass (`npm test -- list-seller-shop-orders.use-case.spec.ts order.controller.spec.ts`, `npx nest build api-gateway`, `npx nest build orders-service`, 2026-06-29).
- Seller order status summary focused tests and builds: pass (`npm test -- get-seller-shop-order-status-summary.use-case.spec.ts shop.controller.spec.ts orders.repository.spec.ts`, `npx nest build api-gateway`, `npx nest build orders-service`, 2026-07-01).
- Related commits: backend `98d7fc8`, frontend `670f556`.

## Pending Work
- Add fulfillment audit/timeline.
- Add invalid-transition and seller-ownership tests.
- Add deeper dashboard drilldowns for Khách hàng/Marketing/Báo cáo once those tabs need full pages.

## Important Constraints
- Do not allow cross-shop order access.
- Do not skip fulfillment states.
- Do not auto-complete order at delivery unless business rule changes.

## Recommended Next Steps
- Implement fulfillment timeline/audit.
