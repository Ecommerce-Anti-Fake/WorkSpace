# AntiFake system flow map

## Scope and source snapshot

This map is derived from the current `back-end` and `Front-End` trees on 2026-08-04. It is an audit artifact, not a claim that every path has passed runtime testing.

- Frontend: Vite + React 19, `Front-End/src/App.tsx`, `Front-End/src/services/*`.
- HTTP entrypoint: NestJS API gateway, global prefix `/api`, Swagger at `/swagger`.
- Backend transport: gateway HTTP plus TCP `ClientProxy` calls to five embedded/standalone services.
- Durable store: PostgreSQL through Prisma 7 `PrismaService`; merged schema has 97 models.
- Ephemeral/realtime: Redis when enabled, Socket.IO at `/api/socket.io`, notification/dashboard SSE, FCM delivery attempts.
- Media: Cloudinary/provider adapters are called from media and domain flows; media URLs are persisted as `MediaAsset` relations.

## Topology

```text
Browser
  ├─ React routes/layouts/guards
  ├─ service APIs + authFetch
  ├─ Socket.IO /api/socket.io
  └─ SSE /api/user/notifications/events and /api/user/dashboard/events
       │ HTTPS
       ▼
API Gateway (/api)
  ├─ request-id + structured request/error logs
  ├─ validation, JWT/optional JWT, role guards, rate limits
  ├─ local gateway modules: cart, chat, live, notification, social, media, realtime
  └─ TCP RPC clients
       ├─ auth-service: auth/session/registration identity
       ├─ users-service: user/profile/address/KYC/notification persistence
       ├─ catalog-service: catalog, offers, shops, distribution, wallet adapters
       ├─ orders-service: cart/checkout/order/payment/shipping/review/report/moderation
       └─ affiliate-service: affiliate program/account/conversion/settlement
       │
       ├─ PrismaService → PostgreSQL
       ├─ Redis realtime coordination/cache (optional, fallback is process-local)
       └─ Cloudinary/GHN/PayOS/Firebase/Agora external providers
```

## Roles observed in source

The `User.role` field is a string, not a Prisma enum. The source explicitly enforces `admin` on admin endpoints and `user`/`admin` on selected user endpoints. Seller, affiliate, manufacturer and distributor are primarily ownership/domain capabilities checked by use-cases, shop state and distribution membership rather than separate global role enum values.

| Persona | Frontend surfaces | Main risk profile |
|---|---|---|
| Guest | home, search, categories, product/shop detail, public live/community/QR | public list payload, search/filter, rate limits |
| Buyer/user | profile, address, cart, checkout, orders, wallet, chat, notification, KYC, favorites, reviews | auth/session, order/payment correctness, private data |
| Seller/shop owner | `/seller/*`, shop/business info, products/offers, inventory, orders, vouchers, live, affiliate | ownership checks, dashboard aggregates, media and mutations |
| Affiliate member/owner | affiliate dashboard and seller affiliate pages | conversion/commission/payout fan-out and idempotency |
| Distributor | distribution surfaces and provenance/lineage | batch/order lineage, inventory locks and deep pagination |
| Admin | `/admin/*`, moderation, KYC, wallet, finance, user/shop/product review | expensive aggregates and privileged mutations |
| Realtime client | chat, notification, live rooms | connection fan-out, Redis fallback, reconnect/backpressure |

## Frontend route and flow map

| Flow | Routes/pages | Service/hook entrypoints | Primary API families |
|---|---|---|---|
| Public catalog | `/`, `/search`, `/categories`, `/product/:id`, `/shop/:shopId` | `product.api.ts`, `category.api.ts`, `brand.api.ts`, `shop.api.ts` | offers, categories, brands, shops, reviews |
| Auth/account | `/auth`, `/login`, `/register`, `/auth/email-action`, `/profile/*` | `auth.api.ts`, `user.api.ts`, Firebase bridge | auth, profile, security, address, KYC |
| Buyer commerce | `/cart`, `/checkout`, payment pages, `/profile/orders` | `cart.api.ts`, `order.api.ts`, `payment.api.ts`, `voucher.api.ts` | cart, quote, checkout, order, payment, shipping |
| Buyer engagement | `/wishlist`, `/messages`, `/chat`, `/notification`, `/community` | favorites, chat, notification, community APIs; realtime hooks | favorites, chat, notifications, social, SSE/Socket.IO |
| Seller operations | `/seller/dashboard`, products, orders, wallet, affiliate, vouchers, live, shop-info | product/shop/order/wallet/affiliate/voucher/live APIs | offers, media, shop, order, wallet, affiliate, live |
| Distribution | distribution UI components and order/lineage entrypoints | distribution calls in product/order/admin services | distribution, batch, shipment, provenance |
| Admin operations | `/admin/*` | `admin.api.ts`, wallet, order, shop, product APIs | users, KYC, shop/product approval, moderation, finance |

## Backend flow mapping

Each HTTP request follows: controller → gateway RPC/local service → domain use-case/repository → Prisma query → table/index → DTO mapper. The generated route-level source index is [api-inventory.md](./api-inventory.md); the generated model/query index is [database-query-map.md](./database-query-map.md).

| Domain | Gateway controller/module | RPC target or local path | Key tables and query concerns |
|---|---|---|---|
| Auth | `modules/auth/auth.controller.ts` | auth-service; users identity adapter | `User`, `AuthIdentity`, `AuthSession`, registration/reset tables; token/session lookups |
| User/profile/address | `user`, `address`, `address-location` | users-service | `User`, `UserAddress`, profile media; user-scoped pagination |
| KYC | `kyc`, media document controllers | users-service + media | KYC/submission/document/media joins; sensitive payloads |
| Catalog metadata | category/brand controllers | catalog-service | `Category`, `Brand`, authorizations; public lists and admin mutations |
| Products/offers | offer controller + RPC | catalog-service | `Offer`, variants/options/media/documents/batches; list projection, page caps |
| Shops | shop + shop-document controllers | catalog-service/users-service | `Shop`, documents, categories, authorizations; dashboard aggregates |
| Cart/checkout | cart controller | orders-service | `Cart`, `CartItem`, quote/checkout transaction; external shipping outside transaction |
| Order/fulfillment | order/order-shipping controllers | orders-service | `Order`, shop groups/items/allocations; status/time/shop indexes |
| Payment/wallet | payment + wallet controllers | orders-service/catalog-service adapters | payment intents, wallets, ledger/withdrawal/payout tables; idempotency and locks |
| Shipping | shipping/order-shipping controllers | orders-service + GHN adapter | order/shop group shipping state; timeout/retry and provider calls |
| Affiliate | affiliate controller | affiliate-service | program/account/code/conversion/ledger/payout; count+list fan-out |
| Distribution | distribution controller | catalog-service | network/node/batch/shipment/pricing/lineage; deep relationship traversal |
| Chat | chat controller + Socket.IO service | local gateway + users/orders data | `ChatThread`, `ChatMessage`, attachments; cursor history and fan-out |
| Notification | notification controller + SSE | users-service persistence + local broker | `Notification`, FCM token/delivery; unread index and reconnect recovery |
| Social | social controller | local gateway/social library | posts/comments/reactions/shares/media; feed and nested comment pagination |
| Live commerce | live controller + realtime gateways | local gateway/live library + Agora provider | session/comments/offers/reminders; scheduled lists, fan-out and leases |
| Moderation/report | moderation/report controllers | orders-service | reports/disputes/cases/risk/audit; admin aggregates and evidence payload |
| Review | review controller | orders-service | review/media/order item; eligibility and list projection |
| Voucher | voucher controller | orders-service/catalog dependencies | voucher/redemption/allocation; status/time/owner filters |
| Media/upload | media controllers and signed upload flows | local gateway + provider | `MediaAsset` and owner relations; payload/provider latency |

## Infrastructure and measurement gaps

Existing source evidence shows request-id/timing/error logs, health, route-scoped in-process rate limiting, TCP service ports, Redis realtime configuration/fallback, SSE and Socket.IO. It does not yet provide a uniform production-safe metric for Prisma query duration/count, response bytes, cache hit/miss or connection pool saturation. Those are measurement tasks, not assumptions to be “fixed” with Redis.

The current Prisma service constructs a client from `DATABASE_URL` and connects at module init. Connection limits and pool timeout are provider/URL-level concerns; no production value is changed by this audit without a measured saturation case.

## Audit boundaries

- Production (`https://antifake.io.vn`) is read-only smoke only: health, public GETs, login with existing seed account, and safe authenticated GETs. No real payment/refund/withdrawal, delete, admin mutation, checkout or destructive load.
- Local/staging owns benchmark/load testing. Seed data is used only where the target database and accounts are explicitly available.
- Any endpoint not statically matched to a frontend caller remains in the inventory; it is not deleted or labelled dead until runtime evidence and owner review exist.
