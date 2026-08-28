# Shop Public API Handoff

Last updated: 2026-07-06

## Status

Public shop summary APIs are available for marketplace/catalog consumers.

## API Contract

`GET /shops?page=1&pageSize=20`

Returns:

```ts
{
  total: number;
  page: number;
  pageSize: number;
  items: Shop[];
}
```

`GET /shops/by-offer/:offerId`

Returns:

```ts
export type Shop = {
  shopId: string;
  shopName: string;
  phone: string | null;
  shopAvatar: string;
  shopBanner: string;
  rating: number;
  totalOffer: number;
  totalSale: number;
  totalReview: number;
  createdAt: string;
  verify: boolean;
};
```

`GET /shops/:id`

Returns the same `Shop` shape above, resolved directly by `shopId`.

`GET /shops/:shopId/categories`

Returns approved public categories for a verified shop:

```ts
Array<{
  categoryId: string;
  categoryName: string;
  imageUrl: string | null;
}>
```

## Implementation Notes

- Gateway routes live in `back-end/apps/api-gateway/src/modules/shop/shop.controller.ts`.
- Seller-facing shop document and verification routes stay under the `Shop-Document` Swagger tag in `media/shop-document.controller.ts`.
- Admin-only shop verification/review routes live under the `Admin` Swagger tag in `admin/admin-shop-verification.controller.ts` with canonical `/shops/admin/...` URLs.
- RPC patterns are `shops.find-public`, `shops.find-by-offer`, `shops.find-by-id`, and `shops.find-categories-by-shop-id`.
- Authenticated owner route `GET /shops/mine` uses a separate compact projection and does not return `registeredCategories`; category reads stay on dedicated category endpoints.
- `GET /shops/mine` includes nullable `avatar` and `banner` URLs from the shop media relations.
- `PATCH /shops/:shopId/profile` consumes `multipart/form-data`; scalar profile fields remain optional and `avatar`/`banner` each accept at most one image (JPEG, PNG, WebP, or GIF; max 5 MB). New files replace old Cloudinary assets after the owner-scoped database update succeeds.
- Shop phone is required when creating a shop and is optional/nullable only for legacy records and profile updates. It is included in public summaries/details and `GET /shops/mine`.
- Shop summaries are built in `ShopsRepository` from `Shop`, `Review`, and `OrderItem`.
- Shop category lists are built from approved `ShopBusinessCategory` rows for verified shops only; the public payload includes category `imageUrl` for display but intentionally omits registration status, risk tier, review notes, documents, and offer data.
- `shopAvatar` and `shopBanner` come from `Shop.avatarMedia.secureUrl` and `Shop.bannerMedia.secureUrl`; missing media returns `''`.
- Public list only includes shops with `shopStatus = verified`.
- `totalOffer` comes from `Shop._count.offers`.
- `totalSale` sums sold item quantity for completed/delivered shop orders.
- `totalReview` counts reviews for orders belonging to the shop; `rating` is rounded to one decimal.
- `createdAt` is an ISO string from `Shop.createdAt`; `verify` is true when `shopStatus = verified`.
- Public offer detail no longer includes shop fields; use `GET /shops/by-offer/:offerId` beside `GET /products/offers/:id`.

## Verification

- `npm test -- shop.controller.spec.ts list-my-shops.use-case.spec.ts update-shop-profile.use-case.spec.ts --runInBand` in `back-end`.
- `npx nest build api-gateway` in `back-end`.
- `npx nest build catalog-service` in `back-end`.

## Next Recommendation

Update the seller profile form to submit optional `avatar` and `banner` files as multipart fields.
