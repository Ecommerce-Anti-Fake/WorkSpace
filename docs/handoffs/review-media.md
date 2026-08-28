# Review Media Handoff

## Feature Overview
Buyer review flow supports verified purchase reviews with optional image media and product-detail display.

## Review List API Spec
- Canonical route: `GET /offers/:offerId/reviews`; `offerId` must be a UUID.
- Missing offers return `404`; existing offers without reviews return `{ total: 0, averageRating: 0, items: [] }`.
- Reviews are matched only through `Review.orderItem.offerId` and ordered by `createdAt desc`.
- Response items expose only `id`, `rating`, `comment`, `authorName`, `media`, and ISO `createdAt`.
- Missing buyer display names use `Nguoi mua da xac minh`; media is always `Array<{ fileUrl: string }>`.
- `averageRating` is rounded to one decimal.
- Verification: focused review use-case/repository/controller tests and API gateway/catalog builds.

## Completed Work
- Buyer can create/update review for eligible purchased item.
- `GET /offers/:offerId/reviews` now validates UUIDs, checks offer existence, and returns the compact review-list contract; the previous `/products/offers/:offerId/reviews` route remains an alias.
- Review listing now matches only `Review.orderItem.offerId`, selects only public fields, normalizes media URLs, and rounds the aggregate rating to one decimal.
- On 2026-06-22, review and review-media backend ownership moved from `libs/products` to the dedicated `libs/reviews` bounded-context module without changing public contracts or eligibility rules.
- Review media upload works in production.
- Product detail shows reviews and review images.
- Filter "Có hình ảnh" works.
- Eligibility is based on latest eligible completed/delivered purchase item for the offer.

## Business Rules
- User can review only after item/order is delivered or completed.
- Review is linked to `OrderItem`.
- Latest eligible purchase is used; stale older purchases should not create new reviews.
- Existing review for latest eligible item should be updated.

## Schema/API Changes
- Review uses `orderItemId`; offer context comes through order item.
- Review media uses signed Cloudinary upload flow.
- Product detail review API returns media where needed.

## Deployment/Test Status
- Review-list contract verification: 7 focused tests passed; API gateway and catalog service builds passed on 2026-06-22.
- Production review-media flow manually verified.
- Extraction verification added focused eligibility, duplicate-update, upload-signature, and Cloudinary-ownership tests; 4/4 passed, followed by a successful full backend build.
- Backend/frontend are deployed.
- Review UI polish intentionally deferred.

## Pending Work
- Add backend tests for latest-purchase eligibility.
- Add pagination and low-star filters.
- Improve review UI/UX later.

## Important Constraints
- Do not allow reviews for unpaid/pending/cancelled orders.
- Do not attach reviews to arbitrary offers without purchase verification.

## Recommended Next Steps
- Add focused review eligibility and duplicate-prevention tests.
