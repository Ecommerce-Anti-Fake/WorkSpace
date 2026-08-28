# Shipping Options MVP

Status: Completed on 2026-05-26. Carrier booking adapter, GHN booking, GHN fee/address parcel snapshot, and buyer GHN location selector slices added on 2026-05-26. GHN tracking/status sync backend and seller UI refresh slice added on 2026-05-28. GHN hardening slice added on 2026-05-29. Backend address/shipping contract was refreshed on 2026-06-29 so FE stores only province/ward internal address codes and backend resolves GHN district/ward internally. Offer-level shipping providers were removed on 2026-07-03; shipping carriers are now system-level catalog/config.

Decision: do not add internal logistics/support staff roles for this slice. The marketplace uses system-level shipping carriers, not per-offer shipping methods. GHN is the only active carrier integration for the current scope; GHTK/Viettel Post/J&T can remain inactive catalog placeholders until their adapters are implemented.

## Implemented

- Added `ShippingCarrier` catalog as the system-level carrier surface.
- Migration `20260703110000_system_shipping_carriers` drops the old `offer_shipping_method` table. Offers no longer own shipping providers.
- Seed keeps only `GHN` active. Future carriers can be added by activating catalog rows and implementing adapter support.
- Seller create/edit offer no longer accepts `shippingProviderCodes`. Offer responses no longer include `shippingMethods`.
- Buyer cart checkout sends selected `shippingOptionCode` from `POST /cart/shipping-options`; legacy direct order creation can still accept provider snapshots.
- Retail order creation validates the selected provider against active system carriers, stores provider snapshot fields, and includes shipping fee in buyer payable/total amount.
- Cart item responses no longer include offer shipping methods; buyer checkout loads selectable shipping choices through the cart-item shipping quote endpoint.
- Seller can create a shipment booking for a processing order through an adapter boundary.
- Booking stores `shippingTrackingCode`, moves fulfillment to `SHIPPING`, writes `SHIPPING_BOOKED` audit, and notifies the buyer.
- Seller offer forms capture parcel weight and dimensions; integrated carriers require this parcel snapshot.
- Retail checkout captures GHN district/ward snapshot; GHN checkout requires district id and ward code.
- GHN quote uses the order destination and parcel snapshot to set `shippingFeeAmount`; GHN booking uses the same snapshot and stores GHN `order_code` as tracking code.
- Buyer cart checkout now replaces manual GHN district/ward code entry with GHN province/district/ward selectors backed by backend GHN master-data endpoints.
- GHN checkout auto-resolves available service when `GHN_FROM_DISTRICT_ID` is configured; otherwise it falls back to the configured/default `GHN_SERVICE_TYPE_ID`.
- Buyer cart checkout now quotes available shipping options for the selected cart item and renders them as radio-card choices with provider/service fee before order creation.
- Buyer cart shipping quotes are requested through `POST /cart/shipping-options` with the selected `cartItemIds`. The backend loads the buyer's default address, groups selected cart items by shop, quotes each shop once per option, then returns total buyer-facing options across the selected shops.
- The cart-level shipping quote response exposes only buyer-facing total option data (`optionCode`, provider/method name, total fee, longest estimated delivery) and does not expose GHN `shippingServiceId` / `shippingServiceTypeId`.
- User addresses now persist provider-neutral address fields (`provinceCode`, `provinceName`, `wardCode`, `wardName`, `addressLine`) instead of public GHN district/ward fields. The current internal ward code format embeds enough GHN mapping data for the backend to resolve `districtId` and `wardCode` when quoting.
- Shop profiles now accept provider-neutral warehouse address fields (`warehouseAddress`, `warehouseProvinceCode`, `warehouseProvinceName`, `warehouseWardCode`, `warehouseWardName`). The gateway derives internal GHN origin district from `warehouseWardCode`; FE should not send warehouse district fields.
- `POST /cart/shipping-options` now falls back to the buyer's default address when destination fields are omitted, so checkout quote callers do not need to pass GHN district/ward after the address book has stored the provider-neutral ward code.
- `POST /cart/shipping-options` resolves the buyer destination from the buyer's default address and each shop origin from the shop `warehouseWardCode`. GHN available-services uses the shop warehouse district as `from_district`, and GHN fee quotes include `from_district_id` when quoting cart shipping.
- `GHN_FROM_DISTRICT_ID` is now only a fallback for direct GHN service lookup callers that do not pass an origin district. Cart shipping quotes should use the shop warehouse address from DB.
- `POST /cart/checkout` accepts multiple selected cart items and only requires `cartItemIds`, `paymentMethod`, and `shippingOptionCode`. Checkout re-quotes the selected option server-side from the buyer's default address.
- Gateway address location reads are now routed through `AddressCatalogService`, keeping `GET /addresses/provinces` and `GET /addresses/wards` provider-neutral at the public/controller boundary. The current catalog provider still uses GHN master-data internally until a second carrier or dedicated address dataset is approved.
- Gateway shipping ownership is consolidated under `GatewayShippingModule`; existing public routes remain stable.
- Cart checkout layout now opens directly from cart into a two-column payment screen: order/address/shipping cards on the left, payment method/discount/summary cards on the right.
- Shipping quote calls are now gated to the payment screen so cart view does not show checkout quote API errors.
- Address book save/edit now includes district in the stored address line, matching checkout address completeness requirements.
- Seller order detail surfaces the stored GHN district, ward, and service snapshot before booking so GHN booking can be tested from the current seller order flow.
- Non-GHN providers are not active in the current catalog. Do not expose GHTK/Viettel Post/J&T until adapter behavior is implemented.
- `POST /cart/shipping-options` returns only carriers with real quote behavior: GHN quotes through the adapter, `SELF_DELIVERY` can return 0đ only when active, and inactive/unintegrated GHTK/Viettel Post/J&T are skipped instead of returning fake 0đ options.
- Cart GHN quotes filter services by resolved parcel weight. Parcels under 20,000g do not quote/display GHN `Hàng nặng`/`Hang nang`; GHN buyer-facing labels are normalized to `Nhanh`, `Chuẩn`, or `Tiết kiệm` where possible.
- Seeded retail shoe offers use buyer-quote realistic parcel data: price `2990000`, weight `1000g`, and dimensions `35x25x15cm`.
- Seller can sync a booked order's carrier status through the shipping adapter. GHN uses the order detail endpoint and maps `delivered` to fulfillment `DELIVERED`; other GHN statuses keep fulfillment at `SHIPPING` while writing a carrier sync audit row.
- Tracking sync is intentionally GHN-only. Non-GHN providers can still be booked locally where configured, but carrier status sync rejects them instead of pretending to poll a carrier.
- Seller order detail exposes `Đồng bộ vận chuyển` for orders in `SHIPPING` with a tracking code; it calls `POST /orders/:id/shipping/sync`, reloads seller orders, and reloads fulfillment audit.
- Carrier booking/sync events are now part of `GET /orders/:id/audit`: `SHIPPING_BOOKED`, `SHIPPING_STATUS_SYNCED`, and `SHIPPING_STATUS_SYNC_FAILED`.
- Failed GHN sync attempts write retryable audit metadata before rethrowing the carrier error, so sellers can retry and admins can inspect provider/tracking/error context.
- Seller order detail now explains GHN-only sync behavior and prevents manual delivered updates for GHN orders with tracking codes; GHN delivery should come from carrier sync.
- Admin order timeline now labels carrier booking/sync/failure rows and shows provider, tracking code, provider status, and retryable state from audit metadata.
- GHN envs now stay credential/config-only: `GHN_BASE_URL`, `GHN_TOKEN`, `GHN_SHOP_ID`, optional `GHN_FROM_DISTRICT_ID`, `GHN_SERVICE_TYPE_ID`, `GHN_PAYMENT_TYPE_ID`, `GHN_REQUIRED_NOTE`.
- GHN master-data lookups for `GET /addresses/provinces` and `GET /addresses/wards` send only the `Token` header. Do not send `ShopId` on province/district/ward master-data calls, because GHN can reject these public location reads with shop lookup errors.

## API/Contract

- `GET /shipping-carriers`
- `POST /products/offers` accepts optional parcel fields only; it does not accept `shippingProviderCodes`.
- `PATCH /products/offers/:offerId` accepts optional parcel fields only; it does not accept `shippingProviderCodes`.
- `GET /addresses/provinces` returns province/city options as `{ provinceCode, provinceName }`.
- `GET /addresses/wards?provinceCode=...` returns ward/commune options as `{ provinceCode, wardCode, wardName }`.
- `POST /user/addresses` and `PATCH /user/addresses/:addressId` accept `recipientName`, `phone`, `addressLine`, optional `provinceCode`, `provinceName`, `wardCode`, `wardName`, `isDefault`; mutation responses are `{ success: true }`.
- `POST /shops` and `PATCH /shops/:shopId/profile` accept optional warehouse fields `warehouseAddress`, `warehouseProvinceCode`, `warehouseProvinceName`, `warehouseWardCode`, `warehouseWardName`; mutation responses are `{ success: true }`.
- `POST /cart/checkout` accepts `{ cartItemIds, paymentMethod, shippingOptionCode }`. COD returns `{ success: true, orderId }`; PayOS returns `{ orderId, orderCode, paymentLinkId, checkoutUrl }`.
- Payment status is read from the normal order detail; checkout-session status routes no longer exist.
- `POST /cart/items/:cartItemId/checkout` is the older single-item checkout route and should not be used by new FE checkout screens.
- `POST /cart/shipping-options` accepts `{ "cartItemIds": ["..."] }` and returns selectable shipping options with total fee across selected cart items. Items from the same shop are packed into one quote, and multi-shop carts are quoted per shop then aggregated by option.
- `POST /orders` accepts `shippingProviderCode?: string` plus shipping district/ward/service fields.
- `POST /orders/:id/shipping/book`
- `POST /orders/:id/shipping/sync`
- `GET /orders/:id/audit` includes carrier audit events and metadata for admin/seller order timelines.
- `GET /user/addresses/default` returns the current user's default shipping address or `null`.
- Route ownership note: admin user management now uses `/admin/users` and `/admin/users/:id`; do not reintroduce `GET /user/:id`, because it can shadow `/user/addresses` depending on controller registration order.

## Verification

- `npm test -- create-offer.use-case.spec.ts create-retail-order.use-case.spec.ts retail-order-lifecycle.integration.spec.ts` in `back-end`
- `npm test -- book-order-shipping.use-case.spec.ts update-order-fulfillment.use-case.spec.ts` in `back-end`
- `npm test -- shipping-carrier-adapter.service.spec.ts book-order-shipping.use-case.spec.ts` in `back-end`
- `npm test -- shipping-carrier-adapter.service.spec.ts` in `back-end`
- `npm test -- book-order-shipping.use-case.spec.ts` in `back-end`
- `npm test -- quote-cart-item-shipping-options.use-case.spec.ts` in `back-end`
- `npm test -- quote-cart-shipping-options.use-case.spec.ts` in `back-end` passed on 2026-06-28.
- `npx nest build api-gateway` in `back-end` passed on 2026-06-28.
- `npm test -- quote-cart-shipping-options.use-case.spec.ts quote-cart-item-shipping-options.use-case.spec.ts manage-user-addresses.use-case.spec.ts` in `back-end` passed on 2026-06-28 after structured address persistence.
- `npx prisma generate` in `back-end` passed on 2026-06-29 after provider-neutral address schema changes.
- `npm test -- quote-cart-shipping-options.use-case.spec.ts quote-cart-item-shipping-options.use-case.spec.ts manage-user-addresses.use-case.spec.ts create-shop.use-case.spec.ts` in `back-end` passed on 2026-06-29.
- `npm test -- quote-cart-shipping-options.use-case.spec.ts` in `back-end` passed on 2026-06-29 after the selected-cart-items quote contract.
- `npm test -- quote-cart-shipping-options.use-case.spec.ts shipping-carrier-adapter.service.spec.ts --runInBand` in `back-end` passed on 2026-07-07 after cart shipping started using buyer default address and shop warehouse origin for GHN quotes.
- `npx nest build api-gateway`, `npx nest build orders-service`, `npx nest build users-service`, and `npx nest build shops-service` in `back-end` passed on 2026-06-29.
- `npm test -- shipping-carrier-adapter.service.spec.ts`, `npx nest build orders-service`, and `npx nest build api-gateway` in `back-end` passed on 2026-06-29 after removing `ShopId` from GHN master-data headers.
- `npm test -- address-catalog.service.spec.ts` and `npx nest build api-gateway` in `back-end` passed on 2026-06-29 after introducing the provider-neutral gateway address catalog boundary.
- `npm test -- create-offer.use-case.spec.ts update-offer.use-case.spec.ts quote-cart-shipping-options.use-case.spec.ts quote-cart-item-shipping-options.use-case.spec.ts create-order.use-case.spec.ts --runInBand` in `back-end` passed on 2026-07-03 after moving shipping providers from offer-level to system-level carriers.
- `npm test -- quote-cart-shipping-options.use-case.spec.ts` in `back-end` passed on 2026-07-09 after GHN heavy-service filtering, integrated-carrier-only cart quote options, GHN label normalization, and retail shoe seed parcel correction.
- `npm test -- shipping-carrier-adapter.service.spec.ts sync-order-shipping-status.use-case.spec.ts` in `back-end` passed on 2026-05-28.
- `npm test -- get-order-fulfillment-audit.use-case.spec.ts sync-order-shipping-status.use-case.spec.ts` in `back-end` passed on 2026-05-29.
- `npm run build` in `back-end` passed on 2026-05-29.
- `npm run build` in `front-end-web` passed on 2026-05-29.
- `npm run build` in `front-end-web` passed on 2026-05-28 after seller tracking refresh UI.
- `npm run build` in `back-end`
- `npm run build` in `front-end-web`

## Next

Best next feature: continue Phase 5 with account security flows: forgot/reset password, change password, and email/OTP decision.
