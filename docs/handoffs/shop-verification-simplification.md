# Shop Verification Simplification

Shop creation no longer requires category-specific document verification.

## Current behavior

- Shop status values are `pending_kyc`, `pending_document`, `pending_verification`, `rejected`, and `verified`.
- `pending_kyc` means the owner has not submitted a complete FRONT/BACK KYC document set yet.
- `pending_document` means owner KYC FRONT/BACK exists, but at least one required shop-level legal document is still missing.
- `pending_verification` means owner KYC FRONT/BACK and every active required legal document for the shop type exist, and admin review is pending.
- `rejected` means admin rejected the submitted registration packet. Read/recompute flows preserve this state until the owner submits updated KYC or shop legal documents.
- Submitting updated shop legal documents recomputes the complete packet: incomplete packets return to `pending_document`; complete packets move from `rejected` to `pending_verification`.
- Submitting KYC moves `pending_kyc` or `rejected` shops to the conservative `pending_document` state; legal-document submission performs the requirement-completeness check.
- Seeded shop-type requirements include `BUSINESS_LICENSE` for `NORMAL`, `HANDMADE`, `MANUFACTURER`, and `DISTRIBUTOR`; `HANDMADE` also keeps `HANDMADE_PROOF`.
- New shop category registrations are created as `approved` with `approvedAt` set at creation time.
- Verification summaries no longer emit `CATEGORY_APPROVAL_REQUIRED`; category entries report `requiredVerification: false`.
- `GET /api/shops/:shopId/verification-summary` includes top-level `reviewNote: string | null` for rejected verification feedback. It prefers the rejected owner KYC note, then the latest rejected shop legal document note.
- Category document APIs, RPC contracts, use-cases, DTOs, seed data, Prisma model, and admin detail payload groups were removed.
- Shop-level legal documents are submitted through one multipart endpoint:
  - `POST /shops/:shopId/documents`
  - body fields: `docTypes` plus `files`, matched by array order
  - backend uploads each image to `shops/:shopId/documents` and stores it under the corresponding `docType`
  - the public `POST /shops/:shopId/documents/upload-signatures` route is no longer exposed by the API gateway.
- `GET /api/shops/:shopId/documents` returns the latest submitted document for each active legal-document requirement of the shop type, with files attached to each submission under `files`. It returns an empty array when none exists and does not include root-level `fileUrl` / `mediaAssetId`, category, or brand data.
- Admin shop listing uses `GET /api/shops/admin/list-shop`; omitting `shopStatus` returns all shops, while providing it filters by the actual shop status.
- Admin can read the full shop registration packet through `GET /api/shops/admin/:shopId/registration-detail`. The response is split into `basicInfo`, `legalProfile`, and `identityProfile` so frontend/admin review screens can show shop basics, shop legal documents, and owner CCCD/KYC documents without using the public shop detail route.
- `GET /api/shops/admin/:shopId/verification-detail` returns the compact review contract: `shop`, `owner`, `categories`, `kyc`, and requirement-based `documents`. Each document exposes only requirement metadata, latest review `status`, and latest submission file URLs.
- Admin reviews a shop registration through the existing shop document review surface, now shop-scoped: `POST /api/shops/admin/:shopId/documents/review`. The request no longer carries `documentId`; body keeps `reviewStatus` as enum `approved | rejected` plus optional `reviewNote`. This single action reviews pending legal documents and the owner KYC/CCCD shown by `registration-detail`.
- Admin review is rejected when the registration packet does not contain KYC FRONT/BACK and every active required legal document. Rejecting sets `shopStatus = rejected`; approving reviews the latest submission for each required document type and sets `verified` only when KYC and all required documents are approved.

## Schema

- `ShopBusinessCategory` remains because shop-category registration is still needed for shop categories and offer category checks.
- `ShopCategoryDocument` / `shop_category_document` was removed.
- Migration `20260703000000_drop_shop_category_document` drops the old table.

## Verification

- Prisma client: `npx prisma generate`
- Focused tests: `npm test -- admin.controller.spec.ts get-admin-shop-verification-detail.use-case.spec.ts create-shop.use-case.spec.ts get-shop-verification-summary.use-case.spec.ts shops.repository.spec.ts orders.repository.spec.ts`
- Registration detail focused tests: `npm test -- get-admin-shop-registration-detail.use-case.spec.ts admin.controller.spec.ts --runInBand`
- Shop registration review focused tests: `npm test -- review-shop-document.use-case.spec.ts admin.controller.spec.ts --runInBand`
- KYC/shop status sync focused tests: `npm test -- shops.repository.spec.ts submit-user-kyc.use-case.spec.ts --runInBand`
- Build: `npx nest build api-gateway`
