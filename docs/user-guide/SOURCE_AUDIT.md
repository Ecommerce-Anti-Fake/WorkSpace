# AntiFake Source and Evidence Audit

This is the source-side bridge for the user guide. It records what the current
frontend, backend and schema expose; it does not replace production UAT. A
feature is only `VERIFIED` in the guide matrix when this audit is paired with
matching runtime evidence.

## Audit boundary

Local Journey Center follow-up: Front-End commit `02fcbfb` persists a manually
selected Desktop/Mobile platform in session storage, and commit `13c18f4` adds
a real journey overview state with explicit start-step links. Focused local
browser coverage passes. This source audit is not production evidence; the
current deployed revision and cross-viewport retest are recorded in the
targeted production verification sections of the canonical evidence matrix
and visual manifest.

| Area | Source entry points inspected | Source finding | Documentation consequence |
|---|---|---|---|
| Public discovery | `Front-End/src/App.tsx` routes for `/`, `/search`, `/categories`, `/product/:id`, `/shop/:shopId`, `/community`, `/live` and `/live/:id` | Guest discovery and catalog shells are present | Guide may describe navigation; product actions remain evidence-scoped |
| Help and journeys | `Front-End/src/App.tsx` `/help/*`; `Front-End/src/data/helpCenter.ts`; `Front-End/src/pages/help/index.tsx`; `Front-End/src/components/help/contextualHelpLink.tsx`; `Front-End/src/components/layout/footer.tsx` | Role filters, search, journey overview/start links, deep step links, progress, previous/next, platform override and contextual-help links are implemented | Help links can be source-verified; final visual claims still require captured evidence |
| Authentication | `Front-End/src/routes/protectedRoute.tsx`; `back-end/libs/security/src/guards/jwt-auth.guard.ts`; `active-user.guard.ts`; `roles.guard.ts` | Protected routes and backend identity/role checks are separate boundaries | Help copy must not imply that hidden UI bypasses authorization |
| Buyer purchase | `Front-End/src/pages/cart/index.tsx`; `src/pages/checkout/index.tsx`; `src/services/cart.api.ts`; `src/services/product.api.ts`; `back-end/libs/orders/src/presentation/rpc/orders.rpc-controller.ts` | Cart, shipping options and cart/Buy Now quote contracts exist; the seeded-demo cart badge quantity check passed with restoration and has sanitized Desktop/Mobile visual pairs, and the Buy Now read-only quote path passed Desktop/Laptop/Mobile, while cart quote/order runtime remains blocked by AF-B-003 | Checkout article remains `PARTIAL`; describe badge feedback separately and never promise an order without a successful quote |
| Buyer account | `Front-End/src/pages/profile/userProfile.tsx`; `Front-End/src/pages/profile/addressPage.tsx`; `Front-End/src/pages/profile/ordersPage.tsx`; `Front-End/src/pages/profile/walletPage.tsx`; `Front-End/src/components/layout/profileSidebar.tsx`; `Front-End/src/App.tsx` protected profile routes | Authenticated production read-only profile, address, order-list and wallet surfaces passed; the former `/profile/verify-history` sidebar target now points to supported public `/qr` navigation in `3c512a8`, with production regression passing 3/3 across Desktop/Laptop/Mobile | B01 and B05 remain `PARTIAL`; mutations, ownership-after-reload, order transitions/review/dispute and server-backed QR history remain pending |
| Buyer orders | `Front-End/src/pages/profile/ordersPage.tsx`; `src/components/order/orderDetail.tsx`; orders RPC controller | Buyer order listing/detail paths and backend patterns exist; authenticated production order-list read-only surface passed | Read-only instructions are evidence-scoped; mutations remain pending |
| QR verification | `Front-End/src/pages/qr/index.tsx`; `Front-End/src/services/verification.api.ts`; `back-end/apps/api-gateway/src/modules/verification/verification.controller.ts`; `back-end/libs/catalog-metadata/src/application/use-cases/verify-product.use-case.ts`; `back-end/prisma/schema.prisma` (`VerificationLabel`, `ProvenanceEvent`); `back-end/prisma/seeds/05-batches-qr.seed.ts`; `docs/UAT_ISSUES.md` AF-Q-001 | Code/link input and client-side PNG/JPEG/WebP image decoding reach the server-owned hash lookup and return verified, suspicious, inactive or not-found states; deployed production code/link/image negative checks returned `200 GET` + `NOT_FOUND` across three viewports; public B03/open and B03/enter-code entry/input states are visually verified at Desktop/Mobile | Article is `PARTIAL`; public entry/input visuals are accepted, while a known positive fixture and final result visual remain pending |
| Seller onboarding | `Front-End/src/components/sellerRegistration/sellerRegistration.tsx`; `src/pages/shop/seller/dashboard/index.tsx`; `src/components/dashboard/sellerGettingStarted.tsx` | Registration, dashboard and state-derived checklist are present | Checklist is `SOURCE_VERIFIED`; authenticated state transitions and visuals remain pending |
| Seller products | `Front-End/src/pages/shop/seller/productManagement/index.tsx`; `src/pages/shop/seller/productManagement/detail.tsx`; `back-end/libs/offers/src/presentation/rpc/offers.rpc-controller.ts` | Create/update/moderate offer patterns and offer status fields exist; authenticated read-only list/detail passed with 5 active product records | Product articles are `PARTIAL`; create/edit mutations and final visuals remain pending |
| Seller orders | `Front-End/src/pages/shop/seller/orderManagement/index.tsx`; orders RPC controller | Seller order list, summary and fulfillment patterns exist; authenticated read-only list/detail passed with 13 delivered historical orders | Processing article is `PARTIAL`; transition walkthrough and final visuals remain pending |
| Seller wallet | `Front-End/src/pages/shop/seller/wallet/index.tsx`; `src/services/wallet.api.ts`; `back-end/libs/wallet/src/presentation/rpc/wallet.rpc-controller.ts` | Wallet balances, payout accounts, withdrawals and COD settlement contracts exist; read-only balance/ledger and masked verified payout account passed | Wallet article is `PARTIAL`; provider/mutation evidence and final visuals remain pending |
| Vouchers | Seller/admin voucher pages; `src/services/voucher.api.ts`; orders RPC controller; `Voucher` schema model | Voucher creation/listing/status and order allocation are represented; authenticated Seller read-only route smoke passed across Desktop/Laptop/Mobile | Seller voucher article is `PARTIAL`; buyer/admin and authenticated mutation evidence remain pending |
| Chat | User, seller and admin chat routes; `src/components/chat`; `back-end/libs/chat/src/presentation/rpc/chat.rpc-controller.ts`; `ChatThread`/`ChatMessage` schema models | Durable buyer/seller threads and messages exist, with realtime support in common infrastructure | Chat article remains evidence-scoped until two-session runtime UAT |
| Livestream | Guest/live/seller routes; `src/services/live.api.ts`; `back-end/libs/live-commerce/src/presentation/rpc/live-commerce.rpc-controller.ts`; live schema models | Discovery, sessions, comments, vouchers, reminders and provider fields exist; public live-origin product-detail state was inspected read-only | Buyer/seller live articles remain `PARTIAL` until provider/authenticated UAT; B09/shop reuses the accepted B02 product-detail visual |
| Affiliate | Buyer/seller affiliate pages; `src/services/affiliate.api.ts`; `back-end/libs/affiliate/src/presentation/rpc/affiliate.rpc-controller.ts`; affiliate schema models | Programs, accounts, codes, conversions, commissions and payouts are modeled | Article remains `PARTIAL`; conversion/payout walkthrough pending |
| Admin operations | Admin routes under `Front-End/src/App.tsx`; admin RPC patterns; `User.role`, `User.accountStatus`, KYC, moderation and wallet schema fields | Admin surface and backend controls exist; production read-only route inventory passed for dashboard, users, Shop registrations, product registrations, vouchers, wallet, chat and withdrawals | A01, A02, A04, A05, A08 and A09 are `PARTIAL`; A03, A06, A07 and A10 are `NOT_IMPLEMENTED` in the current frontend route map; the router has no `/admin/kyc`, `/admin/moderation`, `/admin/orders` or `/admin/audit` route; no bypass or synthetic sign-off |

### Buyer QR navigation update - 2026-08-27

The profile sidebar no longer exposes the absent `/profile/verify-history`
route. Front-End commit `3c512a8` points that entry to the supported public
`/qr` verification page; the production `e2e/profile-navigation.spec.ts`
regression passed on Desktop, Laptop and Mobile. A server-backed verification
history feature still does not exist and remains outside guide claims.

## Backend/API/UI gap inventory

This inventory separates source existence, frontend availability and runtime
evidence. A backend controller or a local mocked test is not production
verification.

| Gap or boundary | Source evidence | Current status | Documentation rule |
|---|---|---|---|
| Admin KYC, moderation, order oversight and audit UI | Backend KYC, moderation and order controllers expose admin operations; `Front-End/src/App.tsx` has no `/admin/kyc`, `/admin/moderation`, `/admin/orders` or `/admin/audit` route | `NOT_IMPLEMENTED` for A03, A06, A07 and A10 | Do not publish step instructions or final visuals for absent routes; retain the Help status guard |
| QR verification history | Profile navigation now targets `/qr`; no server-backed verification-history route or API is present in the current source audit | `NOT_IMPLEMENTED` / documented gap DOC-010 | Document one-off verification only; make no history or saved-result claim |
| Payment, wallet withdrawal and provider mutations | Frontend services/pages and backend payment, wallet and provider controllers exist | `PARTIAL` or `BLOCKED_EXTERNAL`; no approved production mutation/provider run | Do not claim successful payment, payout, withdrawal, webhook or provider behavior from source alone |
| Affiliate conversion/payout and livestream provider flow | Frontend affiliate/live surfaces and backend affiliate/live controllers exist | `PARTIAL`; conversion, payout and authenticated provider evidence remain pending | Keep articles source/runtime scoped until the corresponding walkthrough passes |
| Chat metadata enrichment | `Front-End/src/components/message/chatHeader.tsx` marks avatar, verification and online fields as not returned by the backend | UI messaging is present; metadata is an API gap | Do not describe those metadata indicators as available behavior |
| Local mocks and fixtures | `Front-End/e2e/checkout-quote.spec.ts`, `buy-now-checkout.spec.ts`, `header-badges.spec.ts`, `flash-sale-navigation.spec.ts`, `profile-navigation.spec.ts` and `qr-verification.spec.ts` use route interception, init scripts or fixtures | Local/test-only evidence | Keep these tests labelled local or mocked; they cannot upgrade production UAT or final screenshot status |

## State and permission inventory

The schema and source use these authoritative state families:

- `User.accountStatus` and `User.role` govern account/session eligibility and
  role-scoped access.
- `Shop.shopStatus` and `UserKyc.verificationStatus` represent onboarding and
  verification progress.
- `Offer.offerStatus` and `Offer.moderationStatus` distinguish created,
  submitted, approved and published product states.
- `Order.orderStatus` and `Order.fulfillmentStatus` represent buyer/seller
  order progress; `OrderShopGroup.fulfillmentStatus` carries shop-level
  fulfillment state.
- `Voucher.status`, `Wallet.status`, affiliate account/conversion/commission
  statuses and `LiveCommerceSession.status` govern their respective journeys.

The seller Getting Started checklist derives completion from live responses for
Shop, offers, vouchers and order summaries. A request failure clears the
checklist and exposes retry; it does not mark items complete.

## Evidence rule

Source inspection supports article structure, prerequisites, route links and
status labels. It does not prove deployment, provider behavior, successful
mutations, final screenshots or accessibility across the production revision.
Those claims remain tracked in `docs/UAT_TEST_MATRIX.md`,
`docs/UAT_ISSUES.md`, `docs/UAT_REPORT.md` and
`docs/user-guide/VISUAL_MANIFEST.md`.

Audit snapshot: 2026-08-27. Front-End `8157ffa` is the current deployed
Help/Journey revision; its route-safe visual bindings, Help evidence-status
metadata, public footer verification deep link and absent-Admin status guard
were verified in the production cross-viewport regression. Re-run this audit when routes, API
contracts, guards or schema state fields change.

Authenticated read-only follow-up: deployment run `32955596021` for Front-End
`717550e` passed the safe Buyer/Seller route smoke and related affiliate,
orders, chat, live-entry and non-admin permission checks across the required
Desktop/Laptop/Mobile viewports. This is runtime route evidence only; it does
not prove mutation, provider, payment or final screenshot completion.
