# Admin Users API

Status: Updated on 2026-07-07.

## Contract

- `GET /admin/users`
- Query:
  - `status=all|active|inactive|blocked|banned` (default `all`; `banned` means any non-active account)
  - `page` (default `1`)
  - `pageSize` (default `10`, maximum `100`)
- Response contains page metadata, global user/shop/account-status counts, and `items`.
- `totalItems` follows the selected status filter; `totalUser`, `totalShop`, `activeUser`, and `bannedUser` are unfiltered summary counts.
- Each item exposes `id`, `email`, `displayName`, `avatar`, latest `shopName`, localized `accountStatus`, and `createdAt`.

### User detail

- `GET /admin/users/:id`
- Requires an active admin access token; returns `404` when the user does not exist.
- Response is `{ user, shop }`; `shop` is always present and is `null` when the user has no shop.
- `user.statistics` contains buyer order count, authored social-post count, submitted-report count, and the percentage of received reviews rated 4 or 5 (`positiveRate`, rounded to an integer; `0` without reviews).
- Contact verification reflects whether the account has a stored email/phone. `sellerVerified` is true when the latest shop is verified.
- When multiple shops exist, `shop` is the latest shop by `createdAt`.
- Shop sales, revenue, and sold quantity only include delivered shop order groups. `productCount` is the shop offer count; `category` joins approved registered category names.

Success criteria:

- The response fields match the admin detail contract and contain no generic success/message wrapper.
- User and shop metrics are computed server-side from persisted data.
- The endpoint keeps the existing `/admin/users/:id` route and admin guards.

## Verification

- `npm test -- list-users.use-case.spec.ts --runInBand`
- `npm test -- get-user-by-id.use-case.spec.ts --runInBand`
- `npx nest build api-gateway`
- `npx nest build users-service`
