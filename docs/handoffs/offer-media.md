# Offer Media Handoff

## Feature Overview
Seller uploads/manages offer product images and supporting documents. Images feed listing, shop, and detail pages.

## Completed Work
- Backend offer media/document APIs added.
- Seller can upload/list/delete offer images.
- Seller can select/set primary image where supported.
- Seller can upload/delete offer documents where schema supports it.
- Frontend offer form includes media/document management.
- Public offer detail now returns media-derived `imageUrls` directly; the buyer detail page no longer calls the offer media API for gallery images.
- Offer media/document commands, DTOs, persistence, and RPC handlers were extracted from `libs/products` into `libs/offer-assets`.

## Business Rules
- Only owner shop can manage offer media/documents.
- File type/size validation applies at upload boundary.
- Listings prefer thumbnail/primary offer image, then fallback.
- Offer creation accepts image Data URLs and uploads them server-side to Cloudinary; persisted offer media must expose the resulting HTTPS URL. Existing HTTPS image references remain supported.
- Product creation option values accept only an optional `image` Data URL; the backend uploads it to Cloudinary, persists the resulting `mediaAssetId`, and assigns `sortOrder` by value position within the group. Client-supplied `mediaAssetId` and `sortOrder` are not part of the create contract.
- Product gallery images now accept only image Data URLs; variant updates accept only `image`, `priceOverride`, and `availableQuantity`, with image upload and asset persistence handled by the backend.
- Seller offer-media and offer-document management routes were historically removed from the gateway. As of 2026-08-03, authenticated offer image signature/upload/replace routes are active again for seller product editing.
- Documents are supporting proof, not master data.

## Schema/API Changes
- Uses existing offer media/media asset/document relations.
- Offer responses expose thumbnail/media fields consumed by frontend.
- The first created product image is persisted with `mediaType=thumbnail`; admin, public offer, order, analytics, and live-commerce projections prefer that row before falling back to another media row.
- `GET /products/offers/:id` exposes `thumbnailUrl` plus de-duplicated `imageUrls` and omits `shippingMethods`; shipping management APIs remain separate from the public detail payload.

## Deployment/Test Status
- Backend commit: `8695af9`.
- Frontend commit: `a588386`.
- Later backend/frontend builds passed.
- Offer-assets extraction: 5 focused suites / 7 tests and the full backend build passed on 2026-06-22.

## Pending Work
- Verify Cloudinary cleanup policy for deleted assets.

## Important Constraints
- Do not allow media management for another shop's offer.
- Keep Cloudinary secrets backend-only.

## Recommended Next Steps
- Add media delete audit and cleanup checks.

## Update 2026-08-03

- Seller offer image replacement is active again through authenticated gateway routes. The browser requests backend Cloudinary signatures, uploads directly to Cloudinary, then calls the owner-checked replace route.
- Cloudinary secrets remain backend-only; the replace route sets the first uploaded image as thumbnail and removes old offer-media rows after the new batch is stored.
- Deploy the gateway/catalog/frontend changes and run an authenticated seller upload smoke against the hosted environment.

## Update 2026-08-03 (media editor UX)

- Seller product detail now exposes an explicit `Cập nhật ảnh` editor instead of coupling image changes to the general offer form.
- The editor loads the owner-checked media list, keeps existing images, allows adding only the remaining slots up to four images, and shows an accessible X action for per-image deletion.
- Deleting the primary image promotes the next image; deleting the last remaining image is rejected. Sellers can also explicitly choose another primary image.
- Added authenticated gateway routes for listing, deleting, and setting primary offer media. The existing add route is now used for append semantics; the replace route remains for compatibility.
