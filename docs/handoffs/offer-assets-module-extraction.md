# Offer Assets Module Extraction

## Objective

Move offer media and supporting documents from `back-end/libs/products` into `back-end/libs/offer-assets` while preserving ownership, upload validation, primary-media behavior, RPC/REST contracts, and Prisma models.

## Boundaries

- Keep existing `/products/offers/:id/media` and document routes and RPC values.
- Preserve Cloudinary ownership, MIME/size/folder validation, and document-number hashing.
- Do not change cleanup policy, frontend behavior, or schema.
- Preserve unrelated seed changes.

## Plan

1. Add offer-assets DTO, mapper, repository, use cases, RPC controller, and module.
2. Move existing focused tests.
3. Wire catalog-service and API Gateway imports.
4. Remove asset ownership from `libs/products`.
5. Run focused tests and backend build.

## Completion

- Added `libs/offer-assets` with dedicated DTOs, mapper, repository, use cases, RPC controller, and Nest module.
- Moved offer media/document ownership, validation, hashing, and primary-media behavior out of `libs/products`.
- Kept existing REST routes, RPC message patterns, Prisma models, Cloudinary integration, and catalog media projections unchanged.
- Wired `OfferAssetsModule` into catalog-service and switched API Gateway DTO imports to `@offer-assets`.
- Verification: 5 focused suites / 7 tests passed; full backend build passed on 2026-06-22.
