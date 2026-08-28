# Handoff Index

VPS deployment runbook (prepared, not executed): `../VPS_DEPLOYMENT.md`.
cPanel Phusion Passenger deployment runbook (prepared, not executed):
`../DEPLOY_CPANEL_PASSENGER.md`.

Use the focused handoff for the feature being changed:

- `project-completion-roadmap.md`
- `payment-payos.md`
- `order-first-cart-checkout.md`
- `review-media.md`
- `seller-orders.md`
- `unified-order-api.md`
- `offer-management.md`
- `offer-media.md`
- `frontend-image-optimization.md`
- `pwa-installation.md`
- `offer-sales-options.md`
- `offer-variants.md`
- `inventory-allocation.md`
- `fulfillment-timeline.md`
- `inventory-audit.md`
- `seller-fulfillment-inventory-audit-link.md`
- `payment-audit-timeline.md`
- `failed-payment-ux.md`
- `retry-failed-payos-payment.md`
- `tiered-distributor-pricing.md`
- `order-item-lineage.md`
- `buyer-report-flow.md`
- `risk-score-lifecycle.md`
- `moderation-case-automation.md`
- `escrow-lifecycle.md`
- `finance-reconciliation-dashboard.md`
- `wallet.md`
- `secure-wallet-withdrawals.md`
- `cod-shop-settlement.md`
- `voucher.md`
- `affiliate-payout-fraud-controls.md`
- `product-search-filters.md`
- `shop-public-api.md`
- `shop-verification-simplification.md`
- `chat-mvp.md`
- `chat-module-extraction.md`
- `social-module-extraction.md`
- `live-commerce-module-extraction.md`
- `reviews-module-extraction.md`
- `offer-assets-module-extraction.md`
- `favorites-module-extraction.md`
- `catalog-metadata-module-extraction.md`
- `offers-module-extraction.md`
- `offer-subresources-route-cleanup.md`
- `products-prefix-final-api-cleanup.md`
- `notification-mvp.md`
- `realtime-delivery-plan.md`
- `shipping-options-mvp.md`
- `account-security-flows.md`
- `user-profile-api.md`
- `admin-users.md`
- `user-kyc.md`
- `community-live-commerce.md`
- `livestream-video-transport.md`
- `shop-livestream.md`
- `realtime-production-hardening.md`
- `production-observability.md`
- `ci-cd-quality-gates.md`
- `uat-seed.md`
- `uat-launch-walkthrough.md`

Overall state: backend and frontend are deployed; payOS, failed payment UX, retry for failed payOS payments, frontend retry-payment UX, review media, seller orders, seller offer management, offer media, inventory allocation, fulfillment timeline across seller/buyer/admin order details, payment audit timeline events in order detail, admin inventory audit, seller fulfillment audit deep links, inventory allocation regression tests, tiered distributor pricing, role-neutral wholesale purchase checkout, distributor order receiving into inventory, resale offer drafting from received distributor batches, downstream resale checkout validation, seller-facing resale draft publish controls, buyer-facing downstream resale catalog filters, multi-hop L1 -> L2 -> L3 resale order regression coverage, buyer-facing resale provenance display, backend wholesale receipt lineage metadata, backend order-item lineage resolver, order/offer detail lineage UI, seller/admin lineage entry points, compact authenticated lineage deep links, buyer report flow, risk score lifecycle, moderation case automation, escrow lifecycle, finance reconciliation dashboard, affiliate payout fraud controls, robust product/search filters, buyer-to-shop chat MVP, PostgreSQL-backed notification MVP, offer-level shipping options, buyer GHN province/district/ward selector, seller shipping tracking refresh, account security flows, pending registration verification, duplicate-safe Google/local identity linking, Firebase Email Link/phone OTP auth bridge, refreshed frontend API coverage, social-commerce backend foundation, buyer-facing community feed UI with dedicated Social Hub dashboard shell, community moderation/report integration for posts/comments, live-commerce session backend, live-commerce buyer/seller UI, canonical frontend navigation/text cleanup for Affiliate/Profile/Live/header/mobile/footer-adjacent entry points, social/live realtime path decision, frontend Firebase Web/Analytics bootstrap, RT0 Redis/realtime operations foundation, RT1 realtime event foundation, RT2 notification delivery code/build with SSE browser smoke and native permission rerun, RT3 Socket.IO buyer/seller chat realtime in the existing account messages tab, RT4 presence/session realtime primitives, RT5 dashboard SSE, RT6 live reactions over WebSocket, RT7 live comments over WebSocket with moderation, RT9 realtime production hardening smoke/checklist, Task 15 production observability/rate limiting, Task 16 CI/CD quality gates, Task 17 UAT launch package plus deployed smoke/read-only execution, and project completion roadmap routing are functional. The former RT8 HLS/Cloudflare pilot is superseded by the Agora RTC migration: browser publisher/subscriber code and backend AccessToken2 contracts are the active direction. Focused local gates and dependency hardening passed on 2026-07-28; explicit data cutover and authenticated staging media/token-renewal smoke remain. No Agora release was pushed because deployment-console access and deployed backend Agora variables are unavailable. PostgreSQL remains durable truth, Redis is ephemeral realtime coordination/cache, and Socket.IO still carries live comments/reactions.

Latest local auth update (2026-08-03): form registration now creates Firebase Email/Password plus a PostgreSQL `PendingRegistration`, promotes only after backend-verified email/phone proof, and supports same-UID retry/expiry recreation. Google login/registration is verified and auto-creates or links the account immediately. The additive Prisma migration is prepared but not applied; hosted email-action, Phone OTP, retry, and Google staging smoke remain required.

Latest local PWA update (2026-08-07): Front-End now builds an installable AntiFake PWA and provides a complete responsive install guide at `/profile/settings`. Static-only service-worker caching, session refresh restoration, platform/install-state tests, focused browser E2E, and production build pass locally. Deployment and real-device install/standalone smoke remain required.

Latest local update (2026-07-29): Live Commerce now uses backend-owned
multipart cover upload, active-only public discovery, pinned/replaceable
offers, socket REST recovery, and a Redis single-publisher lease with hardened
Agora browser cleanup/reconnect. Focused tests, targeted lint, Prisma
validation/generation, and both production builds pass. The additive
pinned-offer migration is prepared but not applied; authenticated HTTPS
cover/media/two-tab smoke remains a staging gate.

Best next feature: provide deployment-console access or configure the backend
Agora variables, enable App Certificate plus Co-Host auth, deploy the compatible
revisions, run `npm run live:cutover-agora`, and complete two-browser staging
smoke before broader product-owner signoff.
