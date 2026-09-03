# Compact UAT seed handoff

## Scope

`back-end/prisma/seed.ts` runs the current Prisma seed phases against an
explicitly isolated UAT PostgreSQL database. It is a destructive disposable
fixture operation, not a production migration or deployment step.

The supported command is:

```powershell
npm.cmd run uat:reset
npm.cmd run uat:verify
```

The command checks `UAT_ENVIRONMENT`, `NODE_ENV`, `DATABASE_URL`,
`UAT_DATABASE_TARGET`, `UAT_DATABASE_NAME`, `UAT_DATABASE_HOST_ALLOWLIST`,
`UAT_ISOLATION_CONFIRMED` and `UAT_PRODUCTION_DATABASE_TARGET` before it can
clear data. It does not accept the former hosted-database bypass.

## Fixture coverage

- 8 synthetic users with reusable `BUYER_UAT`, `SELLER_UAT`,
  `AFFILIATE_UAT` and `ADMIN_UAT` aliases.
- 6 synthetic shops, 18 synthetic offers with placeholder media, documents,
  option groups, variants and stock.
- 24 orders with valid `completed`, `paid`, `shipping`, `pending` and
  `cancelled` lifecycle examples, plus carts, payments, escrow, reviews,
  disputes, wallets, vouchers, COD, affiliate, social, chat, live,
  notifications, reports and moderation records.
- A deterministic positive QR label whose code is injected at runtime, hashed
  at seed time and checked through the real verification lookup. The plaintext
  code is never stored in source or documentation.
- Pending KYC, Shop and offer moderation rows for the implemented Admin review
  queues. Unsupported Admin journeys remain truthful `NOT_IMPLEMENTED`.

## Synthetic data and media

Names, addresses, phone numbers, business identifiers, products, posts,
messages, ledger values and media metadata are disposable UAT values. Seeded
media uses safe placeholder URLs and does not claim a Cloudinary upload.
Wallet, payment, withdrawal and affiliate rows are non-payable documentation
fixtures; they do not create financial or provider obligations.

## Accounts and secrets

Account email values and `UAT_TEST_PASSWORD` are supplied through the approved
secure UAT mechanism and are not recorded here. The same rule applies to
`DATABASE_URL`, JWT secrets, Firebase, PayOS, GHN, Agora, Cloudinary, VietQR,
Redis and payout credentials. Only secret names and configuration status may
be documented.

See [`uat-fixture-environment.md`](uat-fixture-environment.md) for the complete
architecture, provider matrix, browser procedure, cleanup policy and external
provisioning gate.
