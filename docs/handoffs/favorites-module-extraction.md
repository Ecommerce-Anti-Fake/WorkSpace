# Favorites Module Extraction

## Objective

Move offer favorite ownership from `back-end/libs/products` into `back-end/libs/favorites` and remove the legacy `/products` prefix from public favorite APIs now that active offer identity no longer depends on `ProductModel`.

## Boundaries

- Keep existing RPC message pattern values for favorite operations to avoid broad catalog-service/gateway contract churn.
- Move repository/use-case/RPC ownership out of `libs/products`.
- Migrate only favorite REST routes in this slice:
  - `GET /products/favorites` -> `GET /favorites`
  - `POST /products/offers/:offerId/favorite` -> `POST /offers/:offerId/favorite`
  - `DELETE /products/offers/:offerId/favorite` -> `DELETE /offers/:offerId/favorite`
- Preserve Prisma models and favorite response shape.
- Preserve unrelated seed changes.

## Plan

1. Add `libs/favorites` repository, use cases, RPC controller, and Nest module.
2. Wire `FavoritesModule` into catalog-service.
3. Remove favorite providers, handlers, repository methods, and tests from `libs/products`.
4. Update API Gateway favorite routes and frontend consumers.
5. Run focused tests and builds.

## Completion

- Added `libs/favorites` with dedicated repository, use cases, RPC controller, module, and focused repository tests.
- Removed favorite runtime ownership from `libs/products`.
- Public favorite routes now use `/favorites` and `/offers/:offerId/favorite`.
- Frontend offer detail favorite calls were migrated to the new routes.
