# Product Search Filters Handoff

Last updated: 2026-06-12

## Status

Task 11 is complete. Catalog discovery now supports richer API-backed filters and keeps frontend filter state in URL params.

## API Contract

`GET /products/offers` supports these optional query params:

- `q`: keyword search across offer title/description, shop name, category name, product model name, and brand name.
- `categoryId`: exact category filter.
- `brandId`: exact product model brand filter.
- `minPrice`, `maxPrice`: numeric price bounds.
- `location`: matches linked supply batch origin fields.
- `shopType`: one of `NORMAL`, `HANDMADE`, `MANUFACTURER`, `DISTRIBUTOR`.
- `salesChannel`: `retail`, `wholesale`, or `all`; retail/wholesale include `BOTH` sales-mode offers.
- `sort`: `featured`, `newest`, `price-asc`, or `price-desc`.
- `page`: 1-based page number; defaults to 1 when pagination is requested.
- `pageSize`: items per page; defaults to 20 and is capped at 100.

Offer list responses include `brandId` for catalog continuity.
The public offer list response is projected through `OfferListItemResponseDto`, a compact catalog summary. It intentionally omits shop display fields, shop type, category name, and product model name; create/update/seller offer endpoints still use the full `OfferResponseDto`.
Public `GET /products/offers` returns `{ total, page, pageSize, items }`; legacy internal RPC calls without pagination still receive an array.
Public `GET /products/offers/:id` omits shop-related fields (`shopId`, `shopName`, `shopType`). Consumers should call `GET /shops/by-offer/:offerId` when they need the shop summary for an offer.

## Implementation Notes

- Contract types live in `back-end/libs/contracts/src/microservice/patterns.ts`.
- Gateway validation lives in `ListOffersQueryDto`.
- `ListOffersQueryDto` filters are optional; leaving every query param empty lists all active public offers.
- Filtering is implemented in `ProductRepository.findAllOffers` with Prisma predicates over offer, shop, category, product model, brand, and linked batch origin relations.
- The frontend product catalog fetches `/products/brands`, renders brand/price/location/verification/shop-type controls, reflects all selected filters in URL search params, and sends `page/pageSize` to `/products/offers` for server-side pagination.
- No database migration or external search service was introduced.

## Verification

- `npm test -- offer.controller.spec.ts product-repository.spec.ts --runInBand` in `back-end`.
- `npx nest build api-gateway` and `npx nest build catalog-service` in `back-end`.
- `npm run build` in `front-end-web`.

Note: full `npm run build` in `back-end` currently fails before TypeScript compilation at `prisma generate` because the local Windows `.bin` launcher resolves to a quoted path that is not recognized.

## Next Recommendation

Best next step: extend the same paginated envelope to the next highest-traffic list endpoint after confirming the frontend consumer shape.
