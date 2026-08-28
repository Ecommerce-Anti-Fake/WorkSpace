# Offer Management Handoff

## Feature Overview
Seller manages shop offers by selecting an existing brand or entering a new brand name. `Offer` is now the primary product/listing identity; legacy `ProductModel` has been removed from the active schema/API path.

## Completed Work
- Backend offer APIs added: public shop offer list plus authenticated seller create, update, hide/show.
- Frontend seller offer list and create/edit form added.
- Seller no longer selects product model for normal offer creation.
- Seller can now create a normal offer without selecting product model; backend writes offer identity snapshot directly and does not create an implicit `ProductModel`.
- `Offer` now owns product identity snapshot fields: `brandId`, `modelName`, `gtin`, and `verificationPolicy`.
- Admin ProductModel management UI was removed from the admin page; admin now manages brand/category only.
- API gateway ProductModel endpoints were removed after the offer-first migration.
- Seller resale draft UI no longer fetches `/products/models`; it uses `SupplyBatch` identity snapshots for model/category/brand display.
- Distribution page no longer fetches `/products/models`; shipment, batch, and pricing forms use offer/batch identity snapshots.
- Distribution pricing UI no longer creates model-scoped policies; new policies are network/category scoped and send no `productModelId`.
- Affiliate program creation no longer accepts `PRODUCT_MODEL` scope.
- Supply batch creation accepts `offerId` or explicit `brandId`/`categoryId`/`modelName` identity snapshots.
- `Offer` owns listing identity directly.
- Offer status and stock are visible.
- Admin lists offers through `GET /api/offers/admin/list-offer` with optional `offerStatus` and `moderationStatus` filters plus `page`/`pageSize`; omitting both statuses returns all offers.
- Admin reviews an offer through `PATCH /api/offers/admin/:offerId/moderation-status`; it updates only `moderationStatus` and nullable `moderationReason` and leaves seller-controlled `offerStatus` unchanged.

## Business Rules
- Seller can manage only offers for owned shop.
- Seller may submit an existing `brandId`. If it is absent, seller may submit `brandName`; backend reuses an exact case-insensitive match or creates a `seller_declared` Brand and persists its ID on the Offer.
- At least one of `brandId` or non-empty `brandName` is required. `brandId` takes precedence when both are provided.
- Normal offer creation does not require brand authorization or batch allocation. Brand review and offer moderation remain separate concerns.
- Admin manages category and can still manage brand master data; ProductModel should not be exposed as a primary admin workflow.
- Seller cannot directly manage product model master data from offer form.
- Seller offer creation is offer-first: normal create requires an approved category and either an existing brand ID or seller-entered brand name. Resale drafts from received batches remain available as a separate compatibility flow.
- New offer reads/filters should prefer offer snapshot fields over `ProductModel` for brand/model identity.
- Offer requires valid price and stock.
- Offer can be active/hidden/out of stock.
- `offerStatus` is seller-controlled (`active`, `inactive`, or the existing `draft` state). `moderationStatus` is admin/system-controlled (`pending`, `approved`, `rejected`, `banned`). Public catalog reads require `offerStatus = active` and `moderationStatus = approved`.

## Schema/API Changes
- Uses existing `Offer` and `Shop`; no active `ProductModel` relation remains.
- `CreateOfferDto` accepts optional `brandId` and optional trimmed `brandName` (1-255 characters), while the create use case requires at least one. Existing IDs are validated; name fallback uses case-insensitive exact lookup before creating a `seller_declared` Brand. Offer identity also includes `title`, `categoryId`, description, image references, price, VND currency, stock, item condition, `gtin`, `model`, and parcel dimensions. `model` maps to persisted `modelName`; `verificationPolicy = manual_review` refers to offer moderation, not required brand authorization.
- Migration `20260527110000_offer_identity_snapshot` backfills offer identity fields from `product_model`.
- Migration `20260527130000_offer_product_model_nullable` makes `offer.product_model_id` nullable.
- Migration `20260527123000_supply_batch_product_model_nullable` makes `supply_batch.product_model_id` nullable so batch identity can come from offer/snapshot data.
- Migration `20260528022858_remove_product_model` drops legacy product-model FKs/columns/table and rebuilds `AffiliateScopeType` without `PRODUCT_MODEL`.
- Gateway `/products/models` list/detail/create endpoints are removed.
- Frontend no longer consumes `/products/models`.
- Seller write APIs validate owner shop; `GET /shops/:shopId/offers` accepts optional `offerStatus` and `moderationStatus` filters plus `page`/`pageSize`. Omitted status filters return every offer for that shop because the gateway sends `includeInactive: true`; explicit `offerStatus` and/or `moderationStatus` filters are still applied. Public `GET /offers` keeps the default public catalog filters (`offerStatus = active`, `moderationStatus = approved`). Both list surfaces use the same paginated response plus compact offer item fields, including `moderationStatus` and nullable `moderationReason`.
- Offer response includes media-derived thumbnail fields where available.
- `POST /offers` accepts `application/json` for the current seller shop: `title`, `categoryId`, existing `brandId` or fallback `brandName` (for example `Nike`), `description`, `productImages[]` (1-10 image references), `price`, `currency: VND`, `availableQuantity`, `itemCondition: new|used`, `gtin`, `model`, `weightGrams`, `lengthCm`, `widthCm`, and `heightCm`. It does not accept `distributionNodeId` or batch allocation in the normal create request. The gateway maps the public parcel names to persisted `parcel*` fields and resolves the shop from the authenticated seller.
- `POST /offers` returns only an acknowledgement (`success`, `message`) to the seller-facing API. It does not return offer/product fields after create because newly created shop products go through moderation before they should be treated as publishable product data.
- New non-draft offers are created with `offerStatus = active` and database-default `moderationStatus = pending`; explicitly requested drafts keep `offerStatus = draft`. Migration `20260704000000_add_offer_moderation_status` backfills existing offers as `approved`.
- Migration `20260708000000_add_offer_moderation_reason` adds nullable `offer.moderation_reason`; moderation reasons are trimmed and limited to 1000 characters at the gateway boundary.
- Migration `20260708130000_remove_offer_verification_level` removes the ambiguous `Offer.verificationLevel` field and `OrderItem.verificationLevelSnapshot`. Offer approval is represented only by admin-owned `moderationStatus`; public search no longer accepts `verificationStatus`.
- Offer create/update no longer accepts `shippingProviderCodes`, and offer responses no longer include `shippingMethods`. Shipping providers are system-level carrier catalog/config; the current active carrier is GHN only.
- Offer create accepts optional sales option groups and values; see `offer-sales-options.md`. Offer detail returns ordered option groups with optional owned `MediaAsset` projections.
- Seller can create option-combination Variants through `POST /api/offers/:offerId/variants`; see `offer-variants.md`.

## Deployment/Test Status
- Backend commit: `4048006`.
- Frontend commit: `0e77484`.
- Later backend/frontend builds passed.
- Offer-first identity snapshot verification passed: focused backend tests (`create-offer.use-case.spec.ts`, `product-repository.spec.ts`), backend build, and frontend build.
- Offer nullable ProductModel verification passed: focused backend tests (`create-offer.use-case.spec.ts`, `allocate-offer-batches.use-case.spec.ts`) and backend build.
- Create-offer acknowledgement and JSON request mapping are covered by `offer.controller.spec.ts` and `create-offer.use-case.spec.ts`; verify the boundary with those focused tests and `npx nest build api-gateway`.

## Pending Work
- Add tests for offer owner validation.
- Improve form validation messages.
- Consider offer edit audit history.
- `SupplyBatch` and `DistributionShipmentItem` now have product identity snapshots; wholesale pricing resolver can work without `productModelId` and falls back to category/default policies.
- Distribution batch creation no longer requires `productModelId`; it resolves identity from `offerId`, explicit snapshot fields, or legacy `productModelId`.
- Offer batch allocation matches by legacy `productModelId` when present, otherwise by offer/batch identity snapshot.
- Before resetting a real database, run the final ProductModel removal migration or use `prisma migrate reset` on disposable data.

## Important Constraints
- Seller APIs must not mutate category or require brand authorization for normal offer creation. The only automatic brand write is creation of a `seller_declared` Brand when `brandId` is absent and no case-insensitive name match exists.
- Do not reintroduce ProductModel dependencies; offer/batch/shipment snapshots are the source for product identity.
- Do not reintroduce admin ProductModel CRUD UI unless the compatibility migration is explicitly reversed.
- Do not reintroduce offer-level shipping-provider selection; keep carrier availability under the system shipping catalog/adapter boundary.
- Keep scope limited to owner shop offers.

## Recommended Next Steps
- Reset/seed a disposable database and smoke-test offer create, batch create, shipment create, wholesale pricing, and affiliate program creation.
