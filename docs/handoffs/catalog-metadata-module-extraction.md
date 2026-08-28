# Catalog Metadata Module Extraction

## Objective

Move brand, category, and shipping-carrier catalog metadata ownership from `back-end/libs/products` into `back-end/libs/catalog-metadata`, and remove the legacy `/products` prefix from metadata REST APIs.

## Boundaries

- Keep existing RPC message pattern values to avoid broad gateway/catalog-service churn.
- Keep offer creation/update lookups in `ProductRepository` where offers still need brand/category/shipping validation.
- Migrate only metadata REST routes in this slice:
  - `GET/POST /products/brands` -> `GET/POST /brands`
  - `GET/POST /products/categories` -> `GET/POST /categories`
  - `GET /products/shipping-carriers` -> `GET /shipping-carriers`
- Preserve Prisma schema and seed data.
- Preserve unrelated dirty frontend/backend changes.

## Plan

1. Add route contract tests for canonical metadata paths.
2. Add `libs/catalog-metadata` DTOs, mapper, repository, use cases, RPC controller, and Nest module.
3. Wire `CatalogMetadataModule` into catalog-service and Jest/TS path aliases.
4. Remove metadata ownership from `libs/products`.
5. Update frontend callers and verify with focused tests/builds.

## Completion

- Added `libs/catalog-metadata` with dedicated DTOs, mapper, repository, use cases, RPC controller, module, and repository tests.
- Removed brand/category/shipping-carrier list/create ownership from `libs/products`.
- API Gateway metadata controllers now expose `/brands`, `/categories`, and `/shipping-carriers`.
- Frontend consumers were migrated off `/products/brands`, `/products/categories`, and `/products/shipping-carriers`.
- Category metadata now supports nullable `imageUrl` for representative category images. `GET /categories` returns `imageUrl`; admin `POST /categories` consumes `multipart/form-data` with fields `name`, optional `parentId`/`riskTier`, and required image file field `image`, then uploads the file and returns only `{ success: true, message }`.
