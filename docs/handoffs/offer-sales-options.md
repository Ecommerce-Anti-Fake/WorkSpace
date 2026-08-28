# Offer Sales Options Handoff

## Objective
Allow a seller to declare ordered sales option groups and values while creating an Offer. An option value may reference an owned `MediaAsset`; responses expose only its `id` and `secureUrl`.

## Contract
- `POST /api/offers` accepts optional `optionGroups[]` with `displayName` and at least one `values[]` entry.
- Values contain `text`, optional nullable `mediaAssetId`, optional nullable
  base64 Data URL `image`, and optional `sortOrder`. `mediaAssetId` and `image`
  are mutually exclusive.
- Group display names are unique per Offer. Value text is unique per group.
- Detail reads groups by `createdAt ASC`; values remain ordered by `sortOrder ASC`, then `createdAt ASC`.
- Offer detail returns only `optionGroups[].{ id, displayName, values }`; each value contains `id`, `text`, and `mediaAsset: { id, secureUrl } | null`.

## Persistence and Validation
- `OfferOptionGroup` belongs to `Offer` with cascade delete.
- `OfferOptionValue` belongs to its group with cascade delete and optionally belongs to `MediaAsset` with `SET NULL` on media deletion.
- Database unique constraints enforce `(offerId, displayName)` and `(optionGroupId, text)`.
- Referenced media assets must exist and have `ownerUserId` equal to the authenticated seller.
- Inline option images accept JPEG, PNG, WebP, or GIF up to 5 MB. The backend
  uploads them to Cloudinary, creates a seller-owned `MediaAsset`, and stores
  its ID on `OfferOptionValue`.
- Offers with option groups may omit `price` and `availableQuantity`, which
  persist as zero. Offers without option groups retain `price > 0` and
  `availableQuantity >= 1`.
- When option groups are present, Offer, existing product-image references, groups, and values are created in one Prisma transaction.

## Boundaries
- Create and detail only; option editing is not included. Variants are not
  created during offer creation.
- Cart, Order, and Checkout are unchanged. Variant persistence is documented separately in `offer-variants.md`.
- Images are never copied into an `imageUrl` field; `MediaAsset.secureUrl` is the source.

## Verification
- Generate schema: `npm run prisma:generate`
- Focused tests: `npx jest create-offer.use-case.spec.ts offers.mapper.spec.ts offers.repository.spec.ts offer.controller.spec.ts --runInBand`
- Build: `npm run build`
