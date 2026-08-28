# Compact UAT seed handoff

## Scope

`back-end/prisma/seed.ts` now runs all seed phases against the current Prisma
schema. It is a destructive disposable-UAT fixture, not a production migration
or deployment step.

## Fixture coverage

- 8 users, including `admin@antifake.io.vn`, 6 shops, 6 brands/categories,
  18 offers with media, documents, option groups, variants, and stock.
- 24 orders and 48 multi-shop order groups, plus compact fixtures for carts,
  payments, escrow, reviews, disputes, wallets, vouchers, COD, affiliate,
  social, chat, live commerce, notifications, reports, and moderation.
- QR labels, provenance, batches, and distribution networks/shipments are kept
  small to reduce database usage on repeated test resets.
- Every seeded shop has a warehouse address and parseable internal ward code;
  every seeded user has a default address with the same shipping metadata, so
  checkout shipping quote/order flows have a valid origin and destination.
- Home Flash Sale consumes the real public offer list; it has no local product
  sample data.
- Offer media URLs are selected by product type (milk, water, coffee, noodles,
  cosmetics, cookware, fashion, tea, baby formula, and stationery). Existing
  UAT data can receive the image update without a destructive reseed via
  `npm.cmd run db:update-offer-media`.

## Safety and verification

- `clearSeedData()` covers the current FK graph, including wallet, voucher,
  auth, order-group, social-media, and live-voucher tables.
- Hosted URLs are rejected unless `SEED_ALLOW_HOSTED_DB=true` is explicitly set.
- The clear transaction uses an extended timeout for hosted UAT poolers.
- Compact reset/reseed completed on the approved UAT database; all 6 shops have
  valid warehouse metadata and all 8 users have default shipping addresses.

## Accounts

Seeded-account passwords are supplied through the approved secure UAT
mechanism and are not recorded in documentation. The admin login identifier is
`admin@antifake.io.vn`.
