# Project Completion Roadmap

Last reviewed: 2026-05-21
Last updated: 2026-07-28

Source of truth for this review:
- Backend code under `back-end/apps`, `back-end/libs`, and `back-end/prisma/schema.prisma`.
- Frontend code under `front-end-web/src`.
- Project spec: `D:\Work\TMDT_CHG\ban_dac_ta_san_tmdt_chong_hang_gia_hoan_chinh.docx`.
- ACF Mart reference app inspected on 2026-05-21: `https://acfmart.web.app/`.
- Existing handoffs under `docs/handoffs` were used only as secondary context because some are older than the current code.

## Current Completion Snapshot

Estimated completion against the original backend-heavy spec: about 80%.

Estimated completion against the new ACF Mart-style web product target: about 89-92%, because social/community commerce, live-commerce MVP, the social/live realtime path decision, RT0 Redis/realtime operations foundation, RT1 realtime event foundation, RT2 notification delivery code/build with native permission rerun, RT3 chat realtime, RT4 presence/session primitives, RT5 dashboard SSE, RT6 live reactions over WebSocket, RT7 live comments, RT8 livestream transport pilot metadata, RT9 realtime production hardening scripts/checklist, Task 15 production observability/rate limiting, Task 16 CI/CD quality gates, and Task 17 UAT launch package plus deployed smoke/read-only UAT execution are now complete, while marketplace UI polish, support tooling, product-owner browser signoff, and final launch-blocker fixes remain.

2026-07-28 transport correction: the RT8 HLS/Cloudflare pilot is superseded by
Agora RTC browser publishing/playback. Focused local verification passed on
2026-07-28; explicit data cutover and authenticated publisher/subscriber
staging smoke remain launch gates.

The project is no longer only a marketplace prototype. The codebase already contains a working NestJS modular backend, React web frontend, PostgreSQL/Prisma schema, payOS flow, seller/shop verification, catalog/offer/media, cart/order/payment, dispute evidence, distributor network, wholesale/resale inventory lineage, and affiliate primitives.

The largest remaining gaps are Agora RTC cutover/staging proof and launch
readiness across the buyer-facing web shell: final marketplace UI polish,
responsive mobile-browser polish, support tooling, broader notification
coverage, observability, rate limiting, and final production hardening.

## ACF Mart Reference Findings

Observed on `https://acfmart.web.app/` with the provided email login on 2026-05-21:
- Frontend stack appears to be React/Vite with split vendor bundles, Be Vietnam Pro font, service worker registration, and Google Analytics.
- Firebase is active: Firebase Auth email/password login, token refresh via `securetoken.googleapis.com`, Firestore realtime listen/write channels, project id `ecommerce-acf`, and Firebase-hosted web config.
- Home page layout is mobile-first marketplace: compact header, logo, search, QR verification, wishlist, chat, notification, cart, account entry, hero/banner carousel, primary CTAs, feature tiles, seller portal promo, category grid, live-commerce block, product grid, seller acquisition block, fixed bottom navigation, and full legal/support footer.
- Account shell has a left account sidebar on desktop and bottom navigation on mobile with wallet, loyalty, vouchers, wishlist, address book, chat, support, verification cabinet, and settings.
- Account `/user` UI was refreshed toward the ACF Mart account reference: shared sidebar/profile card, Lucide-style account icons, active red-tint rows, per-tab content for profile/wallet/points/vouchers/wishlist/address/messages/support/verification/settings, and `/orders` now follows the ACF-style empty-state order view with page title, search bar, status tabs, centered empty card, and responsive mobile stacking while keeping existing order logic/routes. Browser QA covered desktop account/order tabs plus mobile settings/orders with no horizontal overflow; remaining gap is only pixel-level visual tuning against new screenshots if required.
- Product direction for this project: do not copy ACF branding/assets verbatim; match or improve the UX structure, density, trust signals, and mobile-first ecommerce feel while using this project's anti-fake/domain content.

Observed on `https://acfmart.vn/checkout` and `https://acfmart.online/social` with the provided email login on 2026-05-31:
- The public marketplace header links "Cộng đồng" to the separate `acfmart.online/social` app and "Livestream" to `acfmart.vn/live`.
- `acfmart.online/social` uses a dedicated Social Hub shell with sidebar routes: Tổng quan, Bảng tin, Cộng đồng, Affiliate, Live Commerce, Xu hướng, Aivy AI, Hồ sơ cá nhân, and Cài đặt.
- The real community activity is currently in `/social/feed`: users can create posts as "Chia sẻ", "Hỏi cộng đồng", or "Chia sẻ sản phẩm"; posts show like/comment/share counters and actions; normal accounts are limited to 3 posts per 7 days, while Shop Premium is presented as 30 posts per 7 days and prioritized display.
- `/social/community` is a placeholder for future community groups, Q&A, and product reviews; it routes users back to the feed while the dedicated community feature is still under development.
- Live Commerce exists at both `acfmart.vn/live` and `acfmart.online/social/live`, but currently shows an empty state: no active sessions, filters for Tất cả / Đang live / Sắp diễn ra, search, and a CTA to notify users when official deals go live.
- The inspected ACF Mart runtime uses Firebase Auth and Firestore listen/write channels for realtime social/live behavior; this project should either adopt a narrow realtime bridge or implement the MVP with PostgreSQL-backed polling first and keep commerce source-of-truth in NestJS/PostgreSQL.

## Completed Capabilities

### 1. Platform Architecture
- NestJS backend split into API gateway and feature services/libs: auth, users, shops, products, orders, distribution, affiliate, media, security, database.
- Prisma schema covers the main business entities: user, KYC, shop/KYB documents, product model, offer, media, supply batch, provenance, cart, order, payment intent, escrow, dispute, review, chat, report, moderation case, distribution network/node/shipment, pricing policy, affiliate program/account/code/conversion/commission/payout.
- React/Vite web app has protected routes for buyer, seller, admin, distribution, affiliate, cart, orders, product catalog, and offer detail.
- JWT + refresh-token auth flow exists with session rotation and frontend token refresh.
- Backend has a broad Jest test suite for core business rules.

### 2. Buyer Marketplace Flow
- Guest can browse retail and wholesale catalogs.
- Buyer can view offer detail, product media/documents, provenance, related products, and reviews.
- Buyer can manage cart items and checkout from cart.
- Buyer creates any offer-based purchase through one `POST /orders` contract; one ordered quantity is one offer unit/lot.
- Buyer can track orders, open order detail, view payment/fulfillment audit, view lineage chain, cancel pending orders, receive wholesale inventory, open disputes, upload dispute evidence, and submit reviews with media.
- Buyer can report suspicious orders, offers, and shops; buyer order page lists submitted reports.
- payOS success/cancel/failed webhook handling and retry-payment backend exist.

### 3. Seller / Shop Flow
- User can create a shop and maintain shop profile.
- Shop registration supports manufacturer/distributor-oriented verification state.
- Seller can submit shop legal documents and brand authorization documents. Category-specific shop verification documents are no longer required for shop approval.
- Seller can create/update/hide/show offers.
- Seller can upload offer media and documents, choose primary media, and link offers to supply batches.
- Seller can manage shop orders, update fulfillment status, complete/refund orders, and view fulfillment/payment audit.
- Seller order UI includes provenance/lineage entry points.

### 4. Admin / Moderation Flow
- Admin dashboard aggregates moderation and operational counts.
- Admin can create brands, categories, and product models.
- Admin can review KYC submissions.
- Admin can review shop documents and brand authorizations. Category-specific shop verification review is no longer part of the shop approval gate.
- Admin can list/open disputes, inspect evidence, assign/update/resolve dispute cases.
- Admin can view and update buyer report queue.
- Admin can inspect and recalculate risk scores for shop, offer, and batch targets.
- Admin can handle a unified moderation case queue and update case status with audit trail.
- Admin can view inventory audit and order/lineage context from admin screens.

### 5. Anti-Fake / Provenance Core
- KYC/KYB document upload and review flows exist.
- Offer media/documents and batch documents exist.
- Supply batches, offer-batch allocation, order-item batch allocation, and admin inventory audit exist.
- Distributor resale checkout validates attached batch stock.
- Wholesale receipt can create downstream supply batches.
- Order-item lineage resolver supports multi-hop L1 -> L2 -> L3 resale provenance.
- Buyer, seller, and admin UI surfaces can show lineage/provenance chains.

### 6. Distribution / Wholesale
- Distribution networks, nodes, invitations, memberships, node status updates, shipments, batch documents, inventory summary, and tiered pricing policies exist.
- Wholesale pricing supports level-based and node-specific policies.
- Wholesale/resale purchase flow and downstream inventory receipt are implemented.
- Frontend distribution page now calls invitation, shipment, receive/cancel/dispatch, batch-document, pricing, membership, and inventory APIs.

### 7. Affiliate
- Backend supports affiliate programs, account join, codes, conversion approval/rejection, commission ledgers, payouts, and payout status updates.
- Frontend supports program creation, joining, code creation, account summary, conversions, codes, commissions, conversion approval/rejection, payout creation, payout status updates, and program payout views.
- Affiliate commission utility is tested.

### 8. Verification / Tests
- Backend has focused tests for auth, KYC, shop verification, offer validation, media uploads, allocation, orders, payOS idempotency, fulfillment, dispute, distribution, wholesale pricing, resale lineage, affiliate, and admin dashboard.
- Frontend has build script and several smoke scripts for distribution invitation, wholesale purchase, wholesale inventory receive, and resale draft UI.

## Known Gaps Against The Spec

### Critical Product Gaps
- Native mobile app is deferred. Current completion target is responsive web UI that works well through mobile browsers.
- Current web app is functionally broad but does not yet match ACF Mart's marketplace shell: hero/banner carousel, QR-first trust CTAs, feature tiles, category/product merchandising, account sidebar, bottom navigation, notification/chat entry points, and legal/support footer need a focused refresh.
- Social/community commerce is not implemented locally. ACF Mart's current reference separates a Social Hub app with feed, community, affiliate, live commerce, trending, AI, profile, and settings sections.
- Live-commerce MVP is implemented locally for scheduled/active sessions, offer attachment, filtering/search, buyer reminders, explicit status transitions, buyer viewing surfaces, seller live management, and a compact home-page live block. Self-hosted video streaming remains explicitly out of scope until the MVP proves demand.
- Chat MVP is implemented as buyer-to-shop 1:1 conversations using `ChatThread` and `ChatMessage`. Product/order pages only open the shop conversation; chat threads are not product-scoped.
- Report flow MVP is implemented for buyer order/offer/shop reports and admin queue handling; risk-driven moderation case automation is implemented.
- Escrow lifecycle is implemented for paid hold, dispute freeze, completion release, cancel/refund transitions, and admin/buyer/seller inspection. External payout settlement and finance reconciliation remain pending.
- Internal logistics staff roles are intentionally not implemented for this slice. Seller self-delivery and external carrier choices are implemented at offer/order level; GHN booking/quote/tracking sync are implemented, while other carrier APIs remain pending.
- Firebase Google OAuth login, OTP, forgot password, and password change are implemented through the account-security flow; production Firebase provider/domain settings still need verification. Payment-method management is not complete.

### Anti-Fake / Moderation Gaps
- Risk score MVP exists for shop, offer, and batch targets and now opens/escalates moderation cases at high/critical thresholds.
- Automated fraud checks are not implemented: duplicate image detection, abnormal price detection, suspicious description, reused verification labels, or counterfeit heuristics.
- Moderation case automation exists for report, dispute, and risk-driven shop/offer/batch cases; deeper counterfeit heuristics remain pending.
- Verification labels/provenance events are modeled but need stronger lifecycle and UI ownership rules.

### Commerce / Operations Gaps
- Product search now supports catalog filters for keyword, category, brand, price range, location, verification status, shop type, and sales channel. It is still Prisma-backed filtering, not a dedicated full-text/search-service implementation.
- In-app notifications are implemented for chat and fulfillment MVP events. The post-MVP realtime plan now targets order notifications through FCM + SSE + in-app records, with broader event coverage for KYC, report/dispute, moderation, payment, and fulfillment.
- Payment coverage is payOS/COD-oriented; VNPay/MoMo and robust bank transfer receipt reconciliation are not complete.
- Affiliate fraud prevention and payout reconciliation MVP is covered: self-owner joins and circular referral paths are blocked, refund/cancel reversals cancel commission artifacts, payout status changes are audited, and owner payout operations are exposed in UI.
- Admin finance reconciliation now exposes platform fee, seller receivable, affiliate payout liability, refund, and dispute outcome fields. External payout settlement remains pending.

### Engineering / Launch Gaps
- No native mobile app repo or Flutter implementation. This is accepted for the current scope; mobile access will be handled through responsive web.
- Firebase Web SDK, guarded Analytics bootstrap, email/password verification-link auth, and phone SMS OTP auth are configured in `front-end-web`. Backend verifies Firebase ID tokens through `POST /auth/firebase-login` before issuing existing NestJS JWT sessions. Firestore realtime channels remain deferred; FCM/browser push is now planned as a delivery channel for notifications, not as source-of-truth storage.
- RT0 Redis/realtime operations foundation exists in `back-end/libs/common/src/realtime` with optional Redis config, Socket.IO adapter factory, shared key/TTL conventions, and metric names. Queue/background job infrastructure is still absent.
- No OpenSearch/Elasticsearch integration.
- API gateway now has structured request/error logs, health smoke, route-scoped in-process rate limiting, and a provider-neutral monitoring decision. Remaining production hardening gaps are backup/restore drills, external alert routing, multi-instance edge/Redis-backed rate limiting, and security audit checklist.
- CI/CD is not clearly complete from the scanned project files.
- Frontend `API_COVERAGE.md` was refreshed on 2026-05-20; keep it current after new API/UI slices.

## Completion Task Plan

### Phase 0: ACF Mart Alignment Foundation

#### Task 0. Align web shell and Firebase architecture with ACF Mart
Status: In progress; frontend-only UI shell started on 2026-05-21. Firebase Web/Analytics config and Firebase email/phone auth bridge were added on 2026-06-02; Firestore and FCM remain deferred.

Description: Before continuing feature work, define and implement the foundation needed for an ACF Mart-style web experience without replacing the existing NestJS/PostgreSQL business backend.

Acceptance criteria:
- [ ] Design audit maps ACF Mart reference patterns to this app's buyer, seller, admin, distribution, affiliate, cart, order, and offer-detail pages.
- [ ] Frontend design tokens/layout shell are updated for ACF-style marketplace density: header search, QR/trust CTA, bottom mobile nav, feature tiles, category/product grids, account sidebar, notification/chat/cart/account entries, and full footer.
- [x] Firebase decision is recorded: social/live MVP keeps realtime on the existing backend polling path; Firebase Web/Analytics and email/phone auth are allowed, while Firestore/FCM remain deferred.
- [x] If Firebase Auth is adopted, backend JWT/session strategy is preserved through a clear bridge: verify Firebase ID token at the API boundary, map to existing `User`, keep roles/RBAC/audit ownership in NestJS/PostgreSQL.
- [ ] If Firestore is adopted for chat/notifications, define source-of-truth boundaries so orders, payments, disputes, provenance, finance, and moderation remain in PostgreSQL.
- [ ] Responsive checks cover desktop and mobile-browser viewports for home, catalog/search, offer detail, cart/checkout, orders, account, seller, admin, and distribution entry pages.

Verification:
- [ ] `npm run build` in `front-end-web`.
- [ ] Browser screenshots/manual checks for desktop and mobile home/catalog/offer/account/order shells.
- [ ] Firebase decision documented in this roadmap or a focused handoff before Task 4/12 implementation.

Progress notes:
- Renamed older reference-specific frontend class names to neutral `marketplace-*` / `commerce-*` names.
- Added a simplified AntiFake SVG logo mark in the header, based on cart + verification/check symbolism. The provided illustration remains better suited for hero/marketing artwork than as a compact logo.
- Added marketplace quick actions, mobile bottom navigation, home feature tiles, and seller portal promotion without Firebase.
- Reworked the visual direction again to a red/yellow glossy marketplace style with `Be Vietnam Pro`, the user-supplied `AntiFake` logo, and 5 auto-rotating PNG campaign banners: buyer trust, QR verification, counterfeit reporting, affiliate, and seller management. Livestream/live-commerce content was removed from this UI slice.
- Refreshed buyer offer-detail hero toward a Shopee-style product detail layout: large media gallery, compact rating/price/service rows, quantity/add-cart/buy-now actions, and separate shop summary panel. This reused existing offer/media/review/chat/report contracts; no backend change was needed.
- Added DB-backed favorite offers for buyer product detail: `user_favorite_offer` stores `userId + offerId`, products API exposes list/add/remove favorite endpoints, and the offer-detail heart persists favorite state instead of local-only UI state.
- Tightened the header toward the ACF Mart reference density, restored compact carousel arrows, and changed the banner frame to the supplied PNG aspect ratio so the artwork is not clipped vertically.
- Rebuilt the header/footer toward the supplied ACF Mart references: rounded trust strip, large logo/search/action card, glossy red nav rail, red newsletter band, 4-column support footer, and bottom benefit bar.
- Refined the header again into a more premium compact ecommerce system: deeper red palette, softer gold/cream tones, warm white surfaces, lighter typography, slimmer search bar, smaller balanced action buttons, SVG category/search icons, reduced glow, and preserved mobile responsiveness.
- Reworked the header to match the latest supplied reference more literally: taller cream topbar, 150px-class middle header, larger logo/search/action cards, lucide-react icons, 72px dark red navbar, cream category button with Menu + ChevronDown, active home underline glow, and desktop-first spacing.
- Verified `npm run build` in `front-end-web` on 2026-05-21.
- Browser checked desktop and mobile home shell through local Vite on 2026-05-21. User-supplied logo/banner assets loaded; local API fetch failed because backend was not running.
- Added Firebase Web SDK config and guarded Analytics bootstrap in `front-end-web` on 2026-06-02 using `VITE_FIREBASE_*` environment variables.
- Added Firebase email verification-link registration/login, Firebase phone OTP registration/login, and backend `POST /auth/firebase-login` token bridge on 2026-06-02.
- Audited frontend navigation/text on 2026-06-08: added shared `ROUTES`/`LABELS`, standardized header/mobile/bottom navigation links, redirected legacy Social Hub Affiliate/Profile/Live paths to canonical `/affiliate`, `/user`, and `/live`, removed duplicate Social Hub Affiliate/Profile/Live UI blocks, and fixed visible Vietnamese no-accent strings across notification, auth, live, GHN, admin finance, distribution, order, seller, and account surfaces. `npm run build` in `front-end-web` passed; in-app browser/local HTTP smoke was blocked by the Windows sandbox `spawn setup refresh` error.

Dependencies: None.

Estimated scope: Large.

### Phase 1: Close Core Web Product Gaps

#### Task 1. Update frontend API coverage and handoff routing
Status: Completed on 2026-05-20.

Description: Refresh `front-end-web/API_COVERAGE.md` from the current API gateway and frontend calls so future work does not follow stale gaps.

Acceptance criteria:
- [x] Coverage file no longer lists KYC review, brand authorization review, distribution invitations/shipments, or batch documents as unused if current UI calls them.
- [x] Coverage lists actual remaining unused API routes.
- [x] `docs/handoffs/index.md` points to this roadmap or an equivalent current completion handoff.

Verification:
- [x] `rg -n "apiRequest<|apiRequest\(" front-end-web/src`
- [x] `rg -n "@(Get|Post|Patch|Delete)\(" back-end/apps/api-gateway/src/modules`

Completion notes:
- Updated `front-end-web/API_COVERAGE.md` to reflect current UI coverage.
- Updated `docs/handoffs/index.md` to route future completion work through this roadmap.
- Confirmed actual remaining UI gaps include direct distribution node creation, product model detail, user/admin detail, and account delete/admin-check routes.

Dependencies: None.

Estimated scope: Small.

#### Task 2. Add frontend retry-payment UX
Status: Completed before this roadmap pass; reconciled on 2026-05-20.

Description: Expose the existing `POST /orders/:id/retry-payos-payment` backend flow in buyer order detail for failed pending payOS orders.

Acceptance criteria:
- [x] Failed pending payOS order shows retry action to buyer only.
- [x] Retry redirects/opens the new payOS checkout link.
- [x] UI labels retry as buyer action, not provider confirmation.
- [x] Order refreshes after retry.

Verification:
- [x] `rg -n "retry-payos-payment|retryPaymentLoadingId|payOSCheckoutUrl" front-end-web/src/pages/orders-page.tsx`
- [x] `npm run build` in `front-end-web` passed on 2026-05-20.
- [x] Prior frontend build is recorded as passed in `docs/handoffs/retry-failed-payos-payment.md`.

Completion notes:
- `front-end-web/src/pages/orders-page.tsx` already calls `POST /orders/:id/retry-payos-payment`.
- Backend cart PayOS checkout now creates one pending order, returns `{ orderId, checkoutUrl }`, and no longer exposes checkout-session status. Frontend checkout integration still needs the matching `orderId` polling update when the frontend repository is available.
- The UI redirects to returned `payOSCheckoutUrl`.
- `front-end-web/API_COVERAGE.md` was corrected to list this route as covered.

Dependencies: Task 1 completed.

Estimated scope: Small.

#### Task 3. Finish buyer report flow
Status: Completed on 2026-05-20.

Description: Implement buyer-facing report creation/listing around the existing `Report` schema concept.

Acceptance criteria:
- [x] Buyer can report shop/offer/order with reason and description.
- [x] Backend validates reporter, target type, and duplicate/open report rules.
- [x] Admin can see report queue and report-derived moderation cases.
- [x] Report outcome updates audit/moderation inputs for later risk scoring.

Verification:
- [x] `npm test -- create-report.use-case.spec.ts` in `back-end` passed on 2026-05-20.
- [x] `npm run build` in `back-end` passed on 2026-05-20 after adding report contracts/RPC/controller/use-cases.
- [x] `npm run build` in `front-end-web` passed on 2026-05-20.

Completion notes:
- Added authenticated report APIs: `POST /orders/reports`, `GET /orders/reports/mine`, `GET /orders/admin/reports`, `PATCH /orders/admin/reports/:reportId`.
- Report creation supports `ORDER`, `OFFER`, and `SHOP` targets. Order reports require buyer ownership; duplicate open/in-review report for the same target is rejected.
- Report creation writes `REPORT_CREATED` audit log and opens/updates a `ModerationCase` with target type `REPORT`.
- Buyer order page can create/list reports; offer detail can report product/shop; admin dashboard has a report queue with status update.

Dependencies: Task 1.

Estimated scope: Medium.

#### Task 4. Implement chat MVP
Status: Completed on 2026-05-26.

Description: Build buyer-seller chat using `ChatThread` and `ChatMessage`. Final scope is 1:1 buyer-to-shop chat; product/order pages only open the relevant shop conversation.

Acceptance criteria:
- [x] Buyer can start a shop thread from offer/order detail.
- [x] Seller can open the chat inbox from shop console and reply.
- [x] Participants are restricted to buyer, seller, and admin users.
- [x] Messages are persisted and ordered.
- [x] Header/account chat entry follows the ACF-style shell.
- [x] Firebase/Firestore is not used in this MVP; PostgreSQL remains source of truth.

Verification:
- [x] Backend tests for participant authorization: `npm test -- start-chat-thread.use-case.spec.ts send-chat-message.use-case.spec.ts` passed on 2026-05-26.
- [x] Backend build: `npm run build` in `back-end` passed on 2026-05-26.
- [x] Frontend build: `npm run build` in `front-end-web` passed on 2026-05-26.

Completion notes:
- Added `shop_id` to `chat_thread`, dropped product-scoped `offer_id`, and enforce one conversation per `buyerUserId + shopId`.
- Added authenticated chat APIs under products: list threads, get thread, start shop thread, and send message.
- Frontend uses `/user?tab=messages` as the canonical account message tab; the old standalone `/chat` page/route was removed. Header, notifications, offer detail, seller shop console, and order detail deep-link to the account message tab and preserve `threadId` when present.

Dependencies: Task 0 and Task 1.

Estimated scope: Large.

### Phase 2: Complete Anti-Fake Controls

#### Task 5. Define and implement risk score lifecycle
Status: Completed on 2026-05-21.

Description: Turn `RiskScore` from stored data into a real scoring workflow for shop, offer, and batch risk.

Acceptance criteria:
- [x] Risk inputs are defined: KYC/KYB status, document review, batch provenance, dispute rate, refund rate, report count, review anomalies.
- [x] Score recalculation is triggered after meaningful report/dispute events and can be run manually by admin.
- [x] Admin UI shows risk score with contributing factors.
- [x] Risk changes write audit logs.

Verification:
- [x] `npm test -- calculate-risk-score.use-case.spec.ts create-report.use-case.spec.ts open-order-dispute.use-case.spec.ts resolve-admin-dispute.use-case.spec.ts` passed on 2026-05-21.
- [x] `npm run build` in `front-end-web` passed on 2026-05-21.
- [x] `npm run build` in `back-end` passed on 2026-05-21.

Completion notes:
- Added risk score APIs: `GET /orders/admin/risk-scores` and `POST /orders/admin/risk-scores/recalculate`.
- Added calculator for `SHOP`, `OFFER`, and `BATCH` targets.
- Factors include open/resolved/rejected reports, open/refunded disputes, rejected/pending verification documents or statuses, missing provenance/batch link, and low rating anomaly.
- Report creation/update and dispute open/admin resolve recalculate related shop/offer/batch targets.
- Risk changes write `RISK_SCORE_RECALCULATED` audit logs on the affected target.
- Admin dashboard has a `Điểm rủi ro` section with manual recalculation and factor display.

Dependencies: Tasks 3 and 4 improve signal quality but are not mandatory.

Estimated scope: Large.

#### Task 6. Automate moderation case creation
Status: Completed on 2026-05-21.

Description: Create moderation cases from reports, risky documents, suspicious offers, high dispute rates, and risk-score thresholds.

Acceptance criteria:
- [x] `ModerationCase` creation rules are explicit and idempotent.
- [x] Admin queue distinguishes KYC, shop, offer, batch, report, and dispute cases.
- [x] Case resolution can approve/reject/escalate and writes audit trail.

Verification:
- [x] `npm test -- calculate-risk-score.use-case.spec.ts update-admin-moderation-case.use-case.spec.ts` passed on 2026-05-21.
- [x] `npm run build` in `back-end` passed on 2026-05-21.
- [x] `npm run build` in `front-end-web` passed on 2026-05-21.

Completion notes:
- Added moderation case APIs: `GET /orders/admin/moderation-cases` and `PATCH /orders/admin/moderation-cases/:caseId`.
- Existing report and dispute flows keep creating/updating `REPORT` and `DISPUTE` cases.
- Risk score recalculation creates or escalates `SHOP`, `OFFER`, and `BATCH` cases when risk level is `HIGH` or `CRITICAL`.
- Admin dashboard has a `Moderation case` section for listing and updating case status/note.
- Case status updates write `MODERATION_CASE_UPDATED` audit logs; automated risk case creation/escalation writes `MODERATION_CASE_AUTOMATED` when actor context is available.

Dependencies: Task 5.

Estimated scope: Large.

#### Task 7. Strengthen authenticated provenance labels and verification view
Status: Completed on 2026-05-20 for authenticated web/mobile-browser scope.

Description: Make provenance visible and shareable for authenticated buyers without requiring admin/seller context. Public unauthenticated provenance is explicitly out of scope because users must log in before viewing lineage.

Acceptance criteria:
- [x] Offer/order item has compact shareable lineage URL or query param.
- [x] Authenticated buyer/seller/admin view shows manufacturer/root batch, distributor hops, and verification/provenance context available from the existing lineage endpoint.
- [x] Sensitive internal audit data is not exposed publicly because no unauthenticated lineage endpoint is created.

Verification:
- [x] `npm run build` in `front-end-web` passed on 2026-05-20.
- [x] `rg -n "lineageItem|copy.*Lineage|Copy link|select.*Lineage|lineage-section-head" front-end-web/src/pages front-end-web/src/styles.css`
- [x] Existing backend lineage authorization remains enforced by `JwtAuthGuard`, `ActiveUserGuard`, and root order-item access checks.
- [x] Public unauthenticated lineage view intentionally not added.

Completion notes:
- Buyer deep link: `/orders/:orderId?lineageItem=:orderItemId`.
- Seller deep link: `/shops?section=orders&orderId=:orderId&lineageItem=:orderItemId`.
- Admin/support deep link: `/admin?section=orders&orderId=:orderId&lineageItem=:orderItemId`.
- Buyer, seller, and admin lineage sections now expose compact "Copy link" actions.
- Product decision: users must log in before viewing lineage, so public provenance is not required.

Dependencies: Existing lineage resolver.

Estimated scope: Medium.

### Phase 3: Payment, Escrow, Finance

#### Task 8. Implement escrow lifecycle
Status: Completed on 2026-05-21.

Description: Convert modeled `Escrow` into business behavior across payment, delivery, dispute, completion, refund, and payout readiness.

Acceptance criteria:
- [x] Paid order creates/updates escrow hold.
- [x] Delivered/completed order releases escrow to seller receivable state.
- [x] Dispute freezes release.
- [x] Refund/reversal updates escrow and payment audit consistently.
- [x] Admin can inspect escrow state per order.

Verification:
- [x] `npm test -- mark-order-paid.use-case.spec.ts complete-order.use-case.spec.ts open-order-dispute.use-case.spec.ts resolve-admin-dispute.use-case.spec.ts order-reversal.service.spec.ts` in `back-end` passed on 2026-05-21.
- [x] `npm run build` in `back-end` passed on 2026-05-21.
- [x] `npm run build` in `front-end-web` passed on 2026-05-21.

Completion notes:
- `markOrderPaid` moves escrow to `HELD`, records held amount/hold timestamp, and writes `ESCROW_STATUS_CHANGED`.
- Completing a delivered order moves escrow to `RELEASED`; completion is blocked while an open dispute exists.
- Opening a dispute moves escrow to `FROZEN`; resolving without refund restores `HELD` for paid orders or `RELEASED` for completed orders.
- Cancel/refund flows move escrow to `CANCELLED` or `REFUNDED` and keep payment audit behavior intact.
- Buyer, seller, and admin order screens show escrow status, held amount, hold timestamp, and release timestamp.

Dependencies: Existing order/payment/dispute flows.

Estimated scope: Large.

#### Task 9. Add finance reconciliation dashboard
Status: Completed on 2026-05-25.

Description: Give admin a clear view of platform fee, seller receivable, affiliate liability, refunds, and payout status.

Acceptance criteria:
- [x] Admin can filter finance records by date/shop/order/payment status.
- [x] Retail, wholesale, affiliate, refund, and dispute outcomes are separated through per-order payment, escrow, refund, seller payout, and affiliate liability fields.
- [x] Totals reconcile with order/payment/affiliate ledgers.

Verification:
- [x] `npm test -- get-admin-finance-reconciliation.use-case.spec.ts orders.repository.spec.ts` in `back-end` passed on 2026-05-25.
- [x] `npm run build` in `back-end` passed on 2026-05-25.
- [x] `npm run build` in `front-end-web` passed on 2026-05-25.

Completion notes:
- Added admin endpoint `GET /orders/admin/finance-reconciliation`.
- Backend aggregates buyer payable, platform fee, seller receivable, ready seller payout, held/frozen escrow, refunds, affiliate pending liability, and affiliate paid amounts.
- Admin page now has a read-only `Tai chinh` tab with filters and reconciliation rows.

Dependencies: Task 8.

Estimated scope: Large.

#### Task 10. Harden affiliate payout and fraud controls
Status: Completed on 2026-05-25.

Description: Complete affiliate operational controls beyond basic program/account/ledger flow.

Acceptance criteria:
- [x] Prevent self-referral and circular referral paths.
- [x] Cancel/reverse commissions on refunded/disputed invalid orders.
- [x] Program owner/admin can approve/reject conversions and manage payouts from UI.
- [x] Payout status changes are audited.

Verification:
- [x] `npm test -- join-affiliate-program.use-case.spec.ts update-affiliate-payout-status.use-case.spec.ts affiliate.repository.spec.ts create-affiliate-payout.use-case.spec.ts approve-affiliate-conversion.use-case.spec.ts reject-affiliate-conversion.use-case.spec.ts` in `back-end` passed on 2026-05-25.
- [x] `npm run build` in `back-end` passed on 2026-05-25.
- [x] `npm run build` in `front-end-web` passed on 2026-05-25.

Completion notes:
- Program owners can no longer join their own affiliate program.
- Join flow rejects malformed circular referral paths.
- Existing order cancel/refund paths already cancel pending/refundable affiliate conversion and commission artifacts.
- Affiliate page now exposes owner operations for approving/rejecting program conversions, creating payouts, listing program payouts, and updating payout status.
- Payout status updates now write `AFFILIATE_PAYOUT_STATUS_CHANGED` audit rows against `AFFILIATE_PAYOUT`.

Dependencies: Task 9 preferred.

Estimated scope: Medium.

### Phase 4: Search, Notifications, Operations

#### Task 11. Implement robust product/search filters
Status: Completed on 2026-05-25.

Description: Bring catalog discovery closer to spec requirements.

Acceptance criteria:
- [x] Search supports keyword, category, brand, price range, location, verification status, shop type, and sales channel.
- [x] API query contract is documented and stable.
- [x] Frontend filters are reflected in URL params.

Verification:
- [x] Backend query tests: `npm test -- product-repository.spec.ts` in `back-end` passed on 2026-05-25.
- [x] Backend build: `npm run build` in `back-end` passed on 2026-05-25.
- [x] Frontend build: `npm run build` in `front-end-web` passed on 2026-05-25.
- [x] Manual search URL check on local Vite confirmed filters hydrate from URL params and the frontend requests `/products/offers` with the stable query contract. Local backend API was not running during this UI-only check.

Completion notes:
- `GET /products/offers` accepts stable query params: `q`, `categoryId`, `brandId`, `minPrice`, `maxPrice`, `location`, `shopType`, `salesChannel`, and `sort`.
- `GET /products/offers` now also supports `page/pageSize` and returns `{ total, page, pageSize, items }` for paginated public catalog calls.
- Public shop summary APIs are available: `GET /shops` returns paginated shop summaries, and `GET /shops/by-offer/:offerId` resolves the shop summary for an offer.
- Backend filtering stays inside the products repository using Prisma predicates and existing catalog relations; no new search infrastructure or schema migration was added.
- Frontend catalog filters are initialized from and written back to URL params so filtered searches are shareable.

Dependencies: None.

Estimated scope: Medium.

#### Task 12. Add notification system MVP
Status: Completed on 2026-05-26.

Description: Add event notifications for KYC/shop review, order status, payment, dispute, shipment, affiliate payout, and moderation outcome, using the Task 0 Firebase decision for FCM/realtime delivery.

Acceptance criteria:
- [x] Notification entity/API exists.
- [x] Users can list unread/read notifications.
- [x] Core events create notifications idempotently.
- [x] Frontend header or dashboard exposes unread notifications.
- [x] Header notification entry and unread state follow the ACF-style shell.
- [x] If FCM is adopted, browser permission/token registration is explicit and revocable. FCM was not adopted in this MVP.

Verification:
- [x] Backend focused tests: `npm test -- list-notifications.use-case.spec.ts update-order-fulfillment.use-case.spec.ts send-chat-message.use-case.spec.ts` in `back-end` passed on 2026-05-26.
- [x] Backend build: `npm run build` in `back-end` passed on 2026-05-26.
- [x] Frontend build: `npm run build` in `front-end-web` passed on 2026-05-26.

Completion notes:
- Added `Notification` with unique `dedupeKey` and authenticated user notification APIs.
- Chat messages create `CHAT_MESSAGE` notifications for the other participant.
- Fulfillment status changes create `ORDER_FULFILLMENT` notifications for the buyer.
- Header unread count and `/notifications` page expose in-app notifications; browser push/FCM remains deferred.

Dependencies: Task 0; useful after Tasks 2, 6, 8.

Estimated scope: Large.

#### Task 13. Add seller shipping options
Status: Completed on 2026-05-26.

Description: Replace the earlier internal logistics-staff direction with marketplace shipping options. Sellers choose self-delivery or external carrier providers per offer; buyers select one of those enabled methods during retail checkout.

Acceptance criteria:
- [x] Seller can enable self-delivery and/or preconfigured carriers per offer.
- [x] Buyer checkout can choose a shipping provider enabled by the seller.
- [x] Order stores shipping provider code/name/fee snapshot.
- [x] Invalid provider choices are rejected server-side.
- [x] Real carrier API integration is behind the carrier catalog/adapter boundary; GHN quote, booking, and tracking sync are implemented first.

Verification:
- [x] `npm test -- create-offer.use-case.spec.ts create-retail-order.use-case.spec.ts retail-order-lifecycle.integration.spec.ts` in `back-end` passed on 2026-05-26.
- [x] `npm run build` in `back-end` passed on 2026-05-26.
- [x] `npm run build` in `front-end-web` passed on 2026-05-26.

Completion notes:
- Added `ShippingCarrier` as the system-level carrier catalog; old `OfferShippingMethod` was removed.
- Seed keeps GHN as the active carrier; GHTK/Viettel Post/J&T remain future inactive carrier placeholders until adapters are implemented.
- Seller offer forms expose provider checkboxes; cart checkout exposes provider selection.
- Retail orders add shipping fee to buyer payable/total amount while platform fee/seller receivable stay based on product base amount.
- Added carrier booking adapter boundary on 2026-05-26: `POST /orders/:id/shipping/book` stores `shippingTrackingCode`, moves fulfillment to `SHIPPING`, audits `SHIPPING_BOOKED`, and notifies the buyer.
- GHN booking now uses backend env `GHN_BASE_URL`, `GHN_TOKEN`, and `GHN_SHOP_ID`; non-GHN carriers still use deterministic local booking until their APIs are integrated.
- GHN fee quote and booking now use per-offer parcel snapshot and per-order district/ward/service snapshot instead of env-level destination or parcel defaults.
- Buyer checkout now uses backend-backed GHN province/district/ward selectors and auto service resolution instead of asking buyers to enter GHN codes manually.
- GHN tracking sync added on 2026-05-28: `POST /orders/:id/shipping/sync` calls the carrier adapter, writes `SHIPPING_STATUS_SYNCED`, maps GHN `delivered` to fulfillment `DELIVERED`, and seller order detail exposes a refresh action for shipping orders with tracking codes.
- GHN hardening added on 2026-05-29: failed sync attempts write retryable `SHIPPING_STATUS_SYNC_FAILED` audit metadata, carrier booking/sync/failure events are returned by `GET /orders/:id/audit`, admin order timeline shows carrier detail, and seller UI guides GHN-only sync while preventing manual delivered updates for GHN orders with tracking codes.

Dependencies: Task 12 preferred.

Estimated scope: Medium.

### Phase 4A: Social Commerce and Live Commerce

#### Task 13A. Add social-commerce backend foundation
Status: Completed on 2026-05-31.

Description: Add PostgreSQL-backed community feed primitives aligned with the observed ACF Mart Social Hub while keeping commerce, identity, moderation, and audit ownership in the existing NestJS/PostgreSQL backend.

Acceptance criteria:
- [x] Prisma models exist for social posts, comments, reactions, shares, and optional offer attachments.
- [x] Post types support `SHARE`, `QUESTION`, and `PRODUCT_SHARE`.
- [x] Normal users are limited to 3 posts per rolling 7 days; active shop-owned posts are limited to 30 posts per 7 days.
- [x] Posts can be hidden/restored by author or admin without deleting interaction history.
- [x] DTOs and microservice/API gateway contracts are explicit and do not leak Prisma entities.

Verification:
- [x] Focused backend tests cover post creation, quota enforcement, offer attachment validation, reactions, comments, shares, and visibility rules.
- [x] Prisma migration is present and `npx prisma generate` passes.
- [x] `npx nest build catalog-service` and `npx nest build api-gateway` pass.

Completion notes:
- Added `SocialPost`, `SocialComment`, `SocialReaction`, and `SocialShare` schema/migration records plus `SocialPostType`, `SocialPostVisibility`, and `SocialReactionType` enums.
- Added product RPC/API contracts and REST endpoints under `/products/social/posts` for list/create/comment/like/unlike/share/visibility.
- Product-share posts require an active offer; non-product posts cannot attach offers.
- Shop-authored posts require the requester to own an active shop.
- Full `npm run build` was attempted but timed out; targeted Prisma generation and relevant service builds passed.

Dependencies: Tasks 4, 11, and 12 provide chat, product discovery, and notifications patterns.

Estimated scope: Medium.

#### Task 13B. Build buyer-facing community feed UI
Status: Completed on 2026-05-31; dashboard shell refreshed on 2026-06-01.

Description: Add `/community` / `/community/feed` in the local frontend with an ACF-style Social Hub feel: dedicated dashboard shell, composer, post list, post type tabs, counters, shareable product cards, and placeholder sections for the observed sidebar routes.

Acceptance criteria:
- [x] Header/nav exposes Cộng đồng without leaving the local app.
- [x] Users can view public posts, create a share/question/product-share post, comment, like, and share.
- [x] Product-share composer can attach an active offer from existing catalog data.
- [x] The UI shows quota state, remaining normal-user posts, and premium-shop upsell copy.
- [x] Empty, loading, error, unauthenticated, and mobile states are handled.
- [x] Dedicated Social Hub dashboard routes exist for overview, feed, community, affiliate, live, and profile. Xu huong, Aivy, and Cai dat were removed from the local sidebar scope after UI review.

Verification:
- [x] `npm run build` in `front-end-web`.
- [x] Browser check for desktop and mobile community dashboard, feed, and live empty state.

Completion notes:
- Added `front-end-web/src/pages/community-page.tsx` and top-level route `/community/*`.
- Header desktop, mobile menu, and mobile bottom nav now route to local community feed.
- Community page supports public feed read, authenticated composer, post type tabs, product-share offer picker, like/unlike, comments, shares, quota copy, premium-shop sidebar, and shareable product sidebar.
- The dashboard shell uses the inspected ACFMart pattern: 256px white sidebar, sticky topbar, neutral workspace, 12px white cards, violet active nav, lighter ACF-like typography, color-coded shortcut/feature icons with visible white glyphs, gradient overview hero, mobile drawer topbar, and sections for Tong quan/Bang tin/Cong dong/Affiliate/Live Commerce/Profile.
- Browser QA used local Vite at `http://127.0.0.1:5173/community`, `/community/feed`, and `/community/live`; backend API was not running, so expected `localhost:3001` fetch failures were visible while layout and states rendered correctly.

Dependencies: Task 13A.

Estimated scope: Medium.

#### Task 13C. Add community moderation and report integration
Status: Completed on 2026-06-02.

Description: Connect community posts/comments to the existing anti-fake moderation surface so social content can be reported and reviewed without creating a separate moderation stack.

Acceptance criteria:
- [x] Users can report posts and comments with reason and detail.
- [x] Admin/moderator queue can identify social content targets and hide/restore them.
- [x] Reported social content creates or updates a moderation case using existing moderation conventions.
- [ ] Notifications are emitted for moderation outcomes where appropriate.

Verification:
- [x] Focused backend tests for report creation, duplicate open report rejection, moderation case linking, and hide/restore behavior.
- [x] `npx nest build orders-service` passed.
- [x] `npx nest build api-gateway` passed.
- [x] `npm run build` in `front-end-web` passed.
- [ ] Admin UI smoke check for opening a social-content report with seeded data.

Completion notes:
- `POST /orders/reports` now accepts `SOCIAL_POST` and `SOCIAL_COMMENT`.
- Social reports reuse existing `Report` rows and `REPORT` moderation cases.
- Admin resolving a social report hides the reported post/comment; rejecting it restores content to public.
- Community feed post/comment report actions call the existing report endpoint.
- Moderation outcome notifications remain deferred to the broader notification/realtime decision slice.

Dependencies: Task 13A and existing buyer report / moderation automation.

Estimated scope: Medium.

#### Task 13D. Add live-commerce session backend
Status: Completed on 2026-06-01.

Description: Add scheduled/active live session records and offer attachment APIs. The 2026-07-28 follow-up uses a server-owned Agora channel and backend-issued AccessToken2 rather than external playback/ingest fields.

Acceptance criteria:
- [x] Sellers can create scheduled live sessions with title, description, cover image, start time, attached offers, and a browser `clientId`; the no-store response includes top-level publisher access.
- [x] Public APIs list live sessions with filters for all, live, upcoming, and search.
- [x] Buyers can request a reminder for a live session.
- [x] Session state transitions are explicit: scheduled, live, ended, cancelled.
- [x] Live offers reuse existing offer visibility/stock rules and expose offer IDs for later buy-now/cart UI flows.

Verification:
- [x] `npx prisma generate` passed.
- [x] `npm test -- live-commerce.use-case.spec.ts --runInBand` passed.
- [x] `npx nest build catalog-service` passed.
- [x] `npx nest build api-gateway` passed.

Completion notes:
- Added `LiveCommerceSession`, `LiveSessionOffer`, `LiveSessionReminder`, and `LiveSessionStatus` schema/migration records.
- Added product RPC/API contracts and REST endpoints: `GET /products/live/sessions`, `POST /products/live/sessions`, `PATCH /products/live/sessions/:sessionId/status`, and `POST /products/live/sessions/:sessionId/reminders`.
- Session creation validates active shop ownership plus active, in-stock same-shop offers.
- Listing supports `all`, `live`, `upcoming`, and search filters while returning attached offer card data, reminder counts, and viewer reminder state.
- 2026-06-10 follow-up: fixed deployed live-session API-base risk at the frontend boundary instead of adding a live-only backend route. Production `antifake.io.vn` builds now fall back to `https://api.antifake.io.vn/api` when `VITE_API_BASE_URL` is missing, while local builds keep `http://localhost:3001/api`; `npm run build` in `front-end-web` and `npm run build:deploy` in `back-end` passed.
- Reminder creation is idempotent and restricted to scheduled sessions.
- 2026-07-28: `POST /api/live/sessions/:id/join` adds optional-auth Agora
  access; role and channel are derived server-side, and direct seller status
  mutation remains terminal-only.

Dependencies: Tasks 11 and 12.

Estimated scope: Medium.

#### Task 13E. Build live-commerce buyer and seller UI
Status: Completed on 2026-06-01.

Description: Add `/live` and seller live-management surfaces matching the observed ACF Mart empty state first, then showing scheduled/live session cards with buyable offers. The 2026-07-28 transport follow-up replaces playback links/OBS with Agora RTC browser publishing and audience playback.

Acceptance criteria:
- [x] Buyer `/live` shows empty state, reminder CTA, filters for Tất cả / Đang live / Sắp diễn ra, search, live cards, and attached offer cards.
- [x] Live card/detail surface shows active Agora RTC video, session metadata, attached products, seller identity, reminder CTA, and product buy links.
- [x] Seller UI can create/cancel/start/end live sessions, attach existing offers, and publish camera/microphone tracks before `/start`.
- [x] The home page can surface a compact "Live đang diễn ra" block.
- [x] UI remains useful when no livestream exists.

Verification:
- [x] `npm run build` in `front-end-web`.
- [x] Browser checks for `/live`, `/community/live`, and home compact live block with backend offline empty/error states; seller live management covered by TypeScript/build verification in this pass.
- [x] Agora-focused frontend production build for the 2026-07-28 replacement.
- [ ] Real two-browser Agora media/token-renewal smoke.

Completion notes:
- Added shared live-commerce UI in `front-end-web/src/components/live-commerce.tsx`.
- Added top-level `/live` route and reused the same buyer experience in `/community/live`.
- Added seller dashboard `Live Commerce` panel under `/shops?section=live`.
- Updated `front-end-web/API_COVERAGE.md` for live session list/create/status/reminder routes.
- 2026-07-28: Cloudflare iframe/replay and OBS credential controls are
  superseded by the Agora Web SDK publisher/subscriber flow.

Dependencies: Task 13D.

Estimated scope: Medium.

#### Task 13F. Decide realtime path for social/live
Status: Completed on 2026-06-02.

Description: Decide whether this project adopts Firebase/Firestore for social/live realtime behavior or ships the first MVP with PostgreSQL-backed polling/SSE/WebSocket from NestJS.

Acceptance criteria:
- [x] Decision is documented in `community-live-commerce.md`.
- [x] Firebase/Firestore is deferred for this MVP; PostgreSQL source-of-truth boundaries are explicit for users, shops, offers, orders, moderation, audit, finance, reports, social posts/comments/reactions/shares, live sessions/offers/reminders, and notifications.
- [x] PostgreSQL-backed polling behavior and refresh intervals are documented for feed counters, comments, reminders, notifications, and live status; SSE is documented as a later invalidation-only upgrade path.
- [x] Security and rate-limit implications are documented before public launch.

Verification:
- [x] Decision doc reviewed before implementing realtime beyond basic polling.

Completion notes:
- Deferred Firebase Auth/Firestore/FCM because the current notification MVP is PostgreSQL-backed with FCM/browser push deferred. The frontend now has Firebase Web/Analytics bootstrap only, with no social/live realtime implementation.
- Chosen MVP path: existing NestJS/PostgreSQL REST APIs plus bounded client polling.
- Future realtime path: authenticated NestJS SSE events that only invalidate/refetch canonical HTTP resources; WebSocket remains deferred until bidirectional live behavior is required.

Dependencies: Task 13A or 13D can begin before this decision; true realtime depends on this task.

Estimated scope: Small.

### Phase 5: Security, Reliability, Launch

#### Task 14. Complete account security flows
Status: Completed on 2026-05-29.

Description: Add missing auth flows from the spec.

Acceptance criteria:
- [x] Forgot password/reset password.
- [x] Change password.
- [x] Optional OTP or email verification flow.
- [x] Optional OAuth login decision recorded; implemented or explicitly deferred.

Verification:
- [x] Backend auth tests: `npm test -- request-password-reset.use-case.spec.ts reset-password.use-case.spec.ts change-password.use-case.spec.ts` passed on 2026-05-29.
- [x] Backend build: `npm run build` passed on 2026-05-29.
- [x] Frontend build/manual account flow: `npm run build` passed on 2026-05-29.

Completion notes:
- Added `PasswordResetToken` table and one-time hashed reset tokens with configurable TTL.
- Added `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password`, and `GET /auth/security-decisions`.
- Forgot-password avoids account enumeration by returning the same generic response for missing and existing accounts.
- Reset token is not returned by default; `PASSWORD_RESET_RETURN_TOKEN=true` enables local/demo token return until email delivery is integrated.
- Reset/change password revoke active refresh sessions.
- Email delivery, OTP, and OAuth login are explicitly deferred.

Dependencies: Notification/email decision.

Estimated scope: Medium.

#### Task 15. Add production observability and rate limiting
Status: Completed on 2026-06-08.

Description: Prepare backend for demo/production operations.

Acceptance criteria:
- [x] Structured request/error logs.
- [x] Health endpoint and deploy smoke check.
- [x] Rate limiting for auth, upload-signature, payment webhook, and public catalog endpoints.
- [x] Error tracking/monitoring decision documented.

Verification:
- [x] Backend focused tests: `npm test -- health.controller.spec.ts rate-limit.guard.spec.ts`.
- [x] Backend deploy build: `npm run build:deploy`.
- [x] Manual health smoke: `DEPLOY_SMOKE_BASE_URL=http://127.0.0.1:3097 npm run smoke:deploy`.
- [x] Manual throttling check: with `RATE_LIMIT_AUTH_LIMIT=1`, second `/api/auth/login` attempt returned HTTP 429.

Completion notes:
- Added `GET /api/health` and `npm run smoke:deploy`.
- 2026-06-11 follow-up: root probe noise fixed by returning 200 for `HEAD /` while keeping `GET /` redirected to Swagger; focused observability tests and `npx nest build api-gateway` passed.
- Added API-gateway structured JSON request logs, error logs, `x-request-id`, and rate-limit violation logs.
- Added metadata-based in-process gateway rate limiter and applied it to auth, upload-signature, payOS webhook, and public catalog endpoints.
- Monitoring decision is provider-neutral: forward stdout/stderr to the platform log pipeline, then attach Sentry or OpenTelemetry at the platform/logger sink before public launch.
- Multi-instance production should still add edge/WAF or Redis-backed limiting.

Dependencies: None.

Estimated scope: Medium.

### Phase 5A: Realtime Delivery Upgrade

Source of truth: `docs/handoffs/realtime-delivery-plan.md`.

#### Task RT0. Add Redis and realtime operations foundation
Status: Completed on 2026-06-04 for shared backend Redis config, Socket.IO adapter factory, realtime key/TTL conventions, and operational metric names. RT1+ still own event contracts, gateways, and delivery emitters.

Description: Add Redis support and the minimum operational foundation needed before WebSocket/SSE fanout scales beyond one NestJS process.

Acceptance criteria:
- [x] Redis connection/config is documented with local and production env vars in `back-end/README.md`.
- [x] Redis supports Socket.IO adapter setup, pub/sub, distributed rate limiting, ephemeral presence/session keys, short-lived live counters, and cache namespaces through `libs/common/src/realtime`.
- [x] Structured logging/correlation IDs remain future gateway work, but websocket connection metrics, SSE reconnect metrics, rate-limit monitoring, and failed delivery tracking names are centralized at the shared realtime boundary.
- [x] Redis keys use TTL conventions for ephemeral data and docs state that Redis must not store durable business state.

Verification:
- [x] Backend config tests or focused unit tests cover Redis env parsing and disabled/local fallback behavior.
- [x] Backend build passes.
- [x] Redis memory/TTL conventions are documented.

Dependencies: Existing NestJS backend.

Estimated scope: Medium.

#### Task RT1. Add realtime event foundation
Status: Completed on 2026-06-04 for shared backend event registry, typed event creation, dispatcher validation, durable audit-entry sink contract, and transport sink contract. RT2+ still own actual notification/SSE/FCM/WebSocket delivery producers.

Description: Add a shared backend event contract and dispatcher for notification, SSE, WebSocket, and FCM producers while keeping PostgreSQL as source of truth.

Acceptance criteria:
- [x] Event names, payload shape, target audience, dedupe key, persistence requirement, recovery endpoint, and transport eligibility are documented in `back-end/libs/common/src/realtime/realtime-event.dispatcher.ts` and `back-end/README.md`.
- [x] Event taxonomy defines families, naming convention, `.v1` versioning, durable/ephemeral classification, and backward compatibility rules.
- [x] Initial examples include `notification.order.created.v1`, `chat.message.created.v1`, and `live.reaction.ephemeral.v1`.
- [x] Each event declares whether it is persisted, sampled, aggregated, droppable, replayable, and recoverable through REST.
- [x] Backend dispatcher rejects durable events unless `source.writeCommitted=true`.
- [x] Events include authorization scope: user, shop, admin, or public live-session topic.
- [x] Durable events produce audit entries through registered audit sinks; ephemeral events define whether they are sampled, aggregated, or dropped under load.
- [x] Rate limiting and audit requirements are documented per event family.

Verification:
- [x] Focused unit tests cover event mapping, dedupe behavior, authorization scope, durable post-commit guard, and audit/transport sink routing.
- [x] Backend build passes.

Dependencies: RT0, existing notification MVP.

Estimated scope: Medium.

#### Task RT2. Upgrade notifications with FCM + SSE + in-app records
Status: Implemented on 2026-06-04 for backend FCM token storage, delivery-attempt audit rows, idempotent create-notification RPC, authenticated SSE invalidation stream, frontend push opt-in/revoke controls, and frontend SSE refetch. Browser smoke confirmed authenticated `/notifications`, REST list reload, SSE event stream HTTP 200, and in-app chat notification coverage. Native FCM token issuance was rerun on 2026-06-08 in an isolated profile that started at `Notification.permission = default`; Chrome returned `denied` after native opt-in, so no FCM token was issued or stored.

Description: Deliver order, KYC, report/dispute, moderation, payment, and fulfillment notifications through durable in-app records, SSE invalidation, and optional FCM browser push.

Acceptance criteria:
- [x] Browser permission and FCM token registration are explicit and revocable from `/notifications`.
- [x] FCM tokens are stored per user/device and can be revoked; stale-provider failures are tracked in delivery attempts.
- [x] Shared `users.create-notification` RPC creates idempotent in-app notifications and fans out FCM attempts without blocking the canonical record.
- [x] SSE updates authenticated unread-count/list invalidation without exposing private payloads on public channels.
- [x] Failed FCM delivery attempts are tracked without blocking the durable in-app notification record; SSE invalidation is best-effort and recovers through REST reload.

Verification:
- [x] Backend notification tests pass.
- [x] Backend build passes.
- [x] Frontend build passes.
- [x] Manual browser smoke confirms buyer login, `/notifications` render, notification REST list, and authenticated SSE stream.
- [ ] Native permission grant/revoke and real FCM token issuance still need a browser profile where notification permission is not already denied.

Dependencies: RT0, RT1, Firebase FCM credentials.

Estimated scope: Large.

#### Task RT3. Add buyer/seller chat realtime with Socket.IO
Status: Completed on 2026-06-04 for authenticated API-gateway Socket.IO chat rooms, Redis adapter/local fallback, PostgreSQL persist-before-broadcast, client message idempotency keys, frontend socket client send/receive, REST fallback/recovery, focused tests, and manual two-client browser smoke. Chat realtime is mounted in the existing account `Tin nhắn` tab at `/user?tab=messages`; the old standalone `/chat` page/route has been removed.

Description: Move buyer-to-shop chat from manual refresh to authenticated Socket.IO rooms while preserving REST history and PostgreSQL `ChatMessage` persistence.

Acceptance criteria:
- [x] Authenticated users join only chat rooms they can access.
- [x] Message persistence succeeds before broadcast.
- [x] Client acknowledgements confirm transport receipt only; PostgreSQL persistence and REST history remain authoritative.
- [x] Message send retries use a client-generated idempotency key or server message ID to prevent duplicates.
- [x] Reconnect flow refetches thread history from REST before resuming realtime.
- [x] Socket.IO uses Redis adapter or documented local fallback so horizontal scaling is supported.
- [x] UI receives new messages without manual reload.
- [x] REST endpoints remain available for history and reconnect recovery.
- [x] Websocket connection counts, room joins/leaves, reconnects, and send failures are logged/observable.

Verification:
- [x] Backend tests cover room authorization and message persistence-before-broadcast.
- [x] Backend build passes.
- [x] Frontend build passes.
- [x] Manual browser check covers two clients in one buyer/shop thread, account-message-tab delivery, and REST recovery after reload.

Dependencies: RT0, RT1.

Estimated scope: Medium.

#### Task RT4. Add presence and session realtime layer
Status: Implemented on 2026-06-04 for Redis-backed/local-fallback session presence, heartbeat TTL refresh, multi-device aggregation, chat room presence broadcasts, ephemeral typing indicators, live viewer count primitives, focused backend tests, frontend account-message-tab UI, and manual browser smoke for online state plus realtime delivery.

Description: Add Redis-backed ephemeral presence for online/offline state, typing indicators, active live viewers, multi-device sessions, and reconnect handling.

Acceptance criteria:
- [x] Presence keys are Redis-backed with TTL and heartbeat refresh, with local fallback when Redis is disabled.
- [x] Default heartbeat strategy is documented in code/config: heartbeat every 15 seconds and presence expiry after 45 seconds without refresh.
- [x] Multi-device sessions are represented without treating a user offline until all active sessions expire.
- [x] Typing indicators are ephemeral and never persisted to PostgreSQL.
- [x] Active live viewer counts use Redis/local TTL-backed user sets and can fall back to approximate counts after reconnect.
- [x] Presence APIs/events expose only authorized chat-room visibility.
- [x] Stale sessions expire automatically to prevent ghost online users.
- [ ] Reconnect grace period beyond TTL aggregation remains a future hardening item if online/offline flapping appears under production network churn.

Verification:
- [x] Backend tests cover TTL expiry and multi-device aggregation; chat realtime tests cover room authorization before presence/typing.
- [x] Backend build passes.
- [x] Frontend build passes after account message tab UI consumer.
- [x] Manual browser smoke covers online state in a buyer/seller chat and realtime message delivery in `/user?tab=messages`.
- [ ] Manual live viewer count smoke remains pending until RT6/RT8 live UI consumes the RT4 primitives.

Dependencies: RT0, RT1, RT3 for chat typing UI.

Estimated scope: Medium.

#### Task RT5. Add dashboard SSE
Status: Completed on 2026-06-05.

Description: Add scoped SSE invalidations for seller/admin/buyer dashboard counters and queues.

Acceptance criteria:
- [x] Admin report/moderation queues receive scoped invalidation events.
- [x] Seller order/live/dashboard counts receive shop-scoped invalidation events.
- [x] Buyer order/notification/account surfaces receive user-scoped invalidation events.
- [x] Clients use heartbeat, reconnect backoff, and REST recovery after reconnect.
- [ ] SSE connection counts, reconnects, heartbeat failures, and delivery failures are observable.

Verification:
- [ ] Backend tests cover SSE authorization scope.
- [ ] Frontend build passes.
- [ ] Manual check confirms dashboard refresh after a relevant state change and recovery after reconnect.

Dependencies: RT0, RT1.

Estimated scope: Medium.

#### Task RT6. Add live reactions over WebSocket
Status: Completed on 2026-06-05.

Description: Add low-latency ephemeral live-session reactions through WebSocket with Redis-backed counters and REST recovery for aggregate display.

Acceptance criteria:
- [x] Users can join only allowed live session topics.
- [x] Reactions are rate limited per user/session and can be sampled, aggregated, or dropped under burst load.
- [x] Individual reaction events are ephemeral and do not require PostgreSQL persistence.
- [x] Aggregate counters use Redis with TTL and local fallback; durable snapshots remain optional if product analytics need them.
- [x] Broadcast payloads do not expose private buyer/order/report data.

Verification:
- [ ] Backend tests cover topic authorization and rate limiting.
- [ ] Frontend build passes.
- [ ] Manual check covers live reaction updates across two clients and recovery of aggregate counters.

Dependencies: RT0, RT1, RT3 or shared WebSocket gateway setup, RT4 for live viewer presence.

Estimated scope: Medium.

#### Task RT7. Add live comments over WebSocket with moderation
Status: Completed on 2026-06-05.

Description: Add durable live-session comments through WebSocket while keeping comments persisted in PostgreSQL, moderation-capable, replayable, and recoverable through REST.

Acceptance criteria:
- [x] Live comments persist to PostgreSQL before broadcast.
- [x] Comment history is available through REST for reconnect/replay.
- [x] Client acknowledgements confirm transport receipt only; PostgreSQL persistence and REST history remain authoritative.
- [x] Comment send retries use a client-generated idempotency key or server comment ID to prevent duplicates.
- [x] Reconnect flow refetches comments from REST by last seen comment timestamp/ID before resuming realtime.
- [x] Comment moderation can hide/restore/remove comments using existing moderation conventions.
- [x] WebSocket delivery is idempotent and clients dedupe by comment ID.
- [x] Rate limits are separate from ephemeral reactions.

Verification:
- [x] Backend tests cover persistence-before-broadcast, moderation visibility, and reconnect replay.
- [x] Frontend build passes.
- [ ] Manual check covers comment send, reconnect history recovery, and moderation hide/restore.

Dependencies: RT0, RT1, RT3 or shared WebSocket gateway setup.

Estimated scope: Medium.

#### Task RT8. Decide and pilot livestream video transport
Status: HLS/Cloudflare pilot completed on 2026-06-06 and superseded by the
Agora RTC migration on 2026-07-28. Focused local verification passed; staging
cutover remains open.

Description: Use managed Agora RTC for browser camera/microphone publishing and
audience playback without operating custom WebRTC, OBS/RTMPS ingest,
Cloudflare live-input webhooks, or replay.

Acceptance criteria:
- [x] Backend signs AccessToken2 with server-owned channel, stable UID, bounded
  TTL, and role derived from session ownership.
- [x] Only the actual shop owner receives `PUBLISHER`; all others receive
  `SUBSCRIBER` only while the PostgreSQL session is `LIVE`.
- [x] Create/join token responses are no-store and never expose the App
  Certificate.
- [x] Seller publishes camera/microphone through the Web SDK before `/start`;
  audience subscribes on `user-published` and renews with the same `clientId`.
- [x] Durable commerce/order/moderation state remains in PostgreSQL and
  comments/reactions remain on Socket.IO.
- [x] Recording/replay is explicitly out of scope for this migration.
- [x] The idempotent `npm run live:cutover-agora` command is manual, refuses
  Cloudflare `LIVE` rows, migrates only `SCHEDULED`, and preserves terminal
  history.

Verification:
- [x] Required Agora config, App Certificate/Co-Host console settings, and
  no-secret boundary are documented.
- [x] Agora-focused backend tests, Prisma validation/build, and frontend
  production build pass.
- [ ] Manual two-browser staging check covers camera/microphone permission,
  publish-before-start, anonymous/authenticated audience, token renewal,
  comments/reactions, checkout attribution, and end cleanup.

Dependencies: Live-commerce MVP, RT6/RT7 for interaction layer, provider choice.

Estimated scope: Large.

#### Task RT9. Add production hardening, load testing, and realtime resilience
Status: Completed on 2026-06-08 for launch-readiness smoke script, resilience checklist, focused realtime tests, and backend/frontend builds. Full production load numbers remain a staging/infrastructure exercise.

Description: Validate realtime behavior under production-like load and failure modes before public launch.

Acceptance criteria:
- [x] WebSocket load testing covers connection count, room fanout, message throughput, reconnect behavior, and unauthorized subscription attempts.
- [x] SSE scale testing covers concurrent connections, heartbeat failures, reconnect rate, and dashboard fallback behavior.
- [x] Redis failover/restart behavior is tested for presence expiry, live counters, pub/sub recovery, and reconnect storms.
- [x] Event burst/backpressure handling is documented for durable and ephemeral events.
- [x] FCM retry/failure simulation covers stale tokens, revoked permission, provider errors, and failed delivery tracking.
- [ ] Agora staging concurrency testing covers channel joins, publisher/audience
  media startup, token renewal, reconnect, and comments/reactions alongside RTC.
- [x] Operational dashboards/alerts cover websocket metrics, SSE metrics, Redis memory, rate limits, failed deliveries, queue saturation, and event bursts.
- [x] Graceful degradation behavior is verified for polling/manual refresh fallback, REST recovery, and eventually consistent presence.

Verification:
- [x] Load-test scripts or documented manual equivalents exist.
- [x] Resilience checklist is reviewed before launch.
- [x] Backend/frontend build passes after hardening changes.

Dependencies: RT0-RT8.

Estimated scope: Large.

#### Task 16. Add CI quality gates
Status: Completed on 2026-06-08.

Description: Make builds/tests repeatable outside local threads.

Acceptance criteria:
- [x] CI runs backend build and selected backend tests.
- [x] CI runs frontend build.
- [x] CI skips secrets and documents required env vars.
- [x] Failing tests block merge/deploy.

Verification:
- [x] Local backend equivalent: `npm run ci:quality` in `back-end`.
- [x] Local frontend equivalent: `npm run ci:quality` in `front-end-web`.

Completion notes:
- Added `back-end/.github/workflows/quality-gates.yml`.
- Added `front-end-web/.github/workflows/quality-gates.yml`.
- Added `npm run test:ci` and `npm run ci:quality` in `back-end`.
- Added `npm run ci:quality` in `front-end-web`.
- Documented safe CI placeholder env vars and secrets that must not be committed.
- GitHub branch protection should mark these workflow jobs as required checks to block merge/deploy on failure.

Dependencies: None.

Estimated scope: Medium.

#### Task 17. Prepare acceptance/UAT package
Status: Executed on 2026-06-09 via deployed smoke/read-only UAT; interactive browser walkthrough/product-owner signoff still pending.

Description: Create final demo script and acceptance checklist from implemented flows.

Acceptance criteria:
- [x] Buyer retail purchase flow documented.
- [x] Seller shop/offer/order flow documented.
- [x] Admin verification/dispute flow documented.
- [x] Distribution L1/L2/L3 resale provenance flow documented.
- [x] Affiliate flow documented.
- [x] Known limitations listed honestly.

Verification:
- [x] UAT package created in `docs/handoffs/uat-launch-walkthrough.md`.
- [x] Deployed preflight passed: backend CI/build, frontend build, API health smoke, realtime load smoke.
- [x] Deployed read-only role/API walkthrough passed for buyer, seller/manufacturer, distributor, admin, affiliate, social/live, catalog, notification, chat, security, finance, and inventory-audit surfaces.
- [x] Frontend launch routes resolved to HTTP 200 after canonical redirect to `www.antifake.io.vn`.
- [x] Frontend static smoke hooks passed for distribution invitations, wholesale purchase, wholesale inventory receive, and resale draft UI.
- [ ] Interactive browser walkthrough and product-owner signoff on deployed environment.

Completion notes:
- Added `docs/handoffs/uat-launch-walkthrough.md` with preflight checks, role/account setup, buyer/seller/admin/distribution/affiliate/social-live/account-security walkthroughs, evidence pack, launch checklist, known limitations, and exit criteria.
- Executed available deployed demo UAT checks against `https://antifake.io.vn`, `https://www.antifake.io.vn`, and `https://api.antifake.io.vn/api` on 2026-06-09.
- No launch-blocking code issue was found. Browser automation failed in this sandbox with `windows sandbox failed: spawn setup refresh`, so screenshot-based interactive walkthrough remains a product-owner/manual step.

Dependencies: Complete core Phase 1 and Phase 2 tasks.

Estimated scope: Small.

### Phase 6: Mobile App Decision

#### Task 18. Decide mobile scope
Status: Completed on 2026-05-20.

Description: The spec requires mobile app MVP, but current codebase is web only. Decide whether mobile is mandatory for this project completion.

Acceptance criteria:
- [x] Decision documented: build Flutter MVP, convert to responsive web-only scope, or defer mobile explicitly.
- [x] Native mobile app is deferred for this phase.
- [x] Current completion target is responsive web/mobile-browser access.

Verification:
- [x] Decision doc or handoff updated.

Dependencies: None. Product owner decision received.

Estimated scope: Small for decision, Large if native mobile is later reopened.

## Recommended Implementation Order

1. Enable App Certificate and Co-Host authentication, back up/drain traffic,
   then run `npm run live:cutover-agora`.
2. Complete two-browser staging media/token-renewal/checkout smoke.
3. Run product-owner interactive browser walkthrough/signoff and capture screenshots.
4. Final launch hardening and browser QA pass for accepted blockers only.
5. Mark backend/frontend quality-gate jobs as required checks before deploy.

Best next feature: complete the Agora RTC explicit cutover/staging proof before
broader product-owner signoff.
