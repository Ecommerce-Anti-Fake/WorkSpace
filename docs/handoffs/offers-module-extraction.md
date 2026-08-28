# Offers Module Extraction

## Objective

Move core offer ownership from `back-end/libs/products` into `back-end/libs/offers` and remove the legacy `/products` prefix from core offer APIs now that `Offer` is the canonical product/listing identity.

## Boundaries

- Keep existing RPC message pattern values for offer operations to avoid broad gateway/catalog-service contract churn.
- Move core offer DTOs, mapper, repository, use cases, tests, RPC controller, and Nest module out of `libs/products`.
- Migrate core offer REST routes in this slice:
  - `POST /products/offers` -> `POST /offers`
  - `GET /products/offers` -> `GET /offers`
  - `GET/PATCH /products/offers/:id` -> `GET/PATCH /offers/:id`
  - `GET/POST /products/offers/:offerId/batch-links` -> `GET/POST /offers/:offerId/batch-links`
  - `GET /products/seller/shops/:shopId/offers` -> `GET /shops/:shopId/offers`
- Do not migrate offer media/document/review routes in this slice; those are owned by `offer-assets` and `reviews`.
- Preserve Prisma schema and seed data.
- Preserve unrelated dirty frontend/backend changes.

## Plan

1. Add route contract coverage for canonical core offer paths.
2. Move offer files from `libs/products` to `libs/offers` and rename repository/controller/module symbols.
3. Wire `OffersModule` into catalog-service and add TS/Jest path aliases.
4. Update API Gateway offer DTO imports and controller prefix.
5. Update frontend core offer callers and verify with focused tests/builds.

## Completion

- Added `libs/offers` with core offer DTOs, mapper, repository, use cases, tests, RPC controller, and Nest module.
- Removed the tracked runtime contents of `libs/products/src`.
- API Gateway core offer controller now exposes `/offers` and public `/shops/:shopId/offers`.
- `GET /shops/:shopId/offers?page=1&pageSize=20` does not require Authorization, returns active offers only, and uses the same paginated `{ total, page, pageSize, items }` response as `GET /offers`; each item is the compact `OfferListItemResponseDto` shape.
- Frontend core offer calls were migrated off `/products/offers`.
