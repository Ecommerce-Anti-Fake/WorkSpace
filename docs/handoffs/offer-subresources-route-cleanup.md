# Offer Subresources Route Cleanup

## Objective

Remove the remaining legacy `/products` prefix from offer media, offer document, offer review, order-item review, and review-media REST APIs after core offers were moved to canonical `/offers` routes.

## Boundaries

- Keep existing module ownership:
  - offer media/documents stay in `offer-assets`
  - offer reviews/review media stay in `reviews`
- Keep RPC message patterns unchanged.
- Do not change Prisma schema, repository logic, or response shapes.
- Preserve unrelated dirty frontend/backend changes.

## Routes Migrated

- `POST /products/offers/:offerId/media/upload-signatures` -> `POST /offers/:offerId/media/upload-signatures`
- `POST/GET /products/offers/:offerId/media` -> `POST/GET /offers/:offerId/media`
- `PATCH /products/offers/:offerId/media/:mediaId/primary` -> `PATCH /offers/:offerId/media/:mediaId/primary`
- `DELETE /products/offers/:offerId/media/:mediaId` -> `DELETE /offers/:offerId/media/:mediaId`
- `POST /products/offers/:offerId/documents/upload-signatures` -> `POST /offers/:offerId/documents/upload-signatures`
- `POST/GET /products/offers/:offerId/documents` -> `POST/GET /offers/:offerId/documents`
- `DELETE /products/offers/:offerId/documents/:documentId` -> `DELETE /offers/:offerId/documents/:documentId`
- `GET/POST /products/offers/:offerId/reviews` -> `GET/POST /offers/:offerId/reviews`
- `POST /products/order-items/:orderItemId/review` -> `POST /order-items/:orderItemId/review`
- `POST /products/reviews/:reviewId/media/upload-signatures` -> `POST /reviews/:reviewId/media/upload-signatures`
- `POST /products/reviews/:reviewId/media` -> `POST /reviews/:reviewId/media`

## Completion

- API Gateway media and review controllers now expose canonical non-products routes.
- Frontend offer detail, shop offer media/document management, order item reviews, and review media upload callers were migrated.
- Added route contract coverage for media and review controllers.
