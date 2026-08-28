# Community and Live Commerce

> 2026-07-28: the Cloudflare/OBS transport and replay path is superseded by
> Agora RTC browser publishing/playback. The current contract, cutover, and
> staging checklist live in `shop-livestream.md`; older MVP/RT8 notes below
> remain historical context.

## Current Livestream Transport

- Agora RTC carries live camera/microphone media through the browser Web SDK.
- Backend-issued AccessToken2, channel, UID, and role are authoritative; only
  the actual shop owner can publish.
- Seller publishes media before `/start`; audience joins only after PostgreSQL
  reports `LIVE`.
- Socket.IO comments/reactions and PostgreSQL commerce/moderation state are
  unchanged.
- Cloudflare live-input webhooks, OBS/RTMPS credentials, and replay are not
  active flows.
- Focused local verification passed on 2026-07-28. The explicit
  `npm run live:cutover-agora` production cutover and real media smoke remain
  pending; see `livestream-video-transport.md`.

### 2026-07-29 live-commerce hardening

- Session create is one backend-owned multipart command. The optional
  JPG/PNG/WebP cover is validated to 5 MB in the gateway/use case, uploaded to
  Cloudinary only after shop/offer/voucher validation, and only `secureUrl` is
  persisted. There is no cover signature/upload/delete API.
- Public discovery contains only live and future scheduled sessions. Seller
  `filter=all&shopId` is authenticated management scope and includes terminal
  states; terminal detail remains addressable without exposing replay URLs.
- Sellers can replace session offers and pin/switch/unpin an attached offer
  before or during live. Pin changes emit `live:offer-pinned`; REST detail is
  refetched after socket connect/reconnect. Sold-out pinned offers remain
  visible with buying disabled.
- Agora publisher access is single-tab through a Redis lease. Studio setup is
  explicit and singleton-safe, publish precedes `/start`, recovery is bounded,
  and ending cleans media/lease before the canonical terminal transition.
- The additive pinned-offer migration was generated and validated only. No
  database migration, deployment, commit, or push was performed.

## Overview

Feature target: add ACF Mart-style social/community commerce and live-commerce MVP to the local NestJS/PostgreSQL + React app.

Observed reference on 2026-05-31:
- `acfmart.vn` links Cộng đồng to `https://acfmart.online/social` and Livestream to `https://acfmart.vn/live`.
- `acfmart.online/social` has a dedicated Social Hub shell: Tổng quan, Bảng tin, Cộng đồng, Affiliate, Live Commerce, Xu hướng, Aivy AI, Hồ sơ cá nhân, Cài đặt.
- `/social/feed` is the active community surface: post composer, post types for sharing/questions/product sharing, like/comment/share actions, product-share sidebar, and quota copy.
- Normal users are limited to 3 posts per 7 days; Shop Premium is presented as 30 posts per 7 days with prioritized display.
- `/social/community` is currently a placeholder for groups, Q&A, and product reviews.
- `/live` and `/social/live` currently show an empty live-commerce state with filters for all/live/upcoming, search, and reminder CTA.
- Runtime uses Firebase Auth and Firestore listen/write channels, but this project should keep commerce source-of-truth in NestJS/PostgreSQL unless a narrow realtime bridge is explicitly chosen.

## Planned Roadmap Tasks

Source of truth: `docs/handoffs/project-completion-roadmap.md`, Phase 4A.

1. Task 13A: social-commerce backend foundation. Completed on 2026-05-31.
2. Task 13B: buyer-facing community feed UI and Social Hub shell. Completed on 2026-05-31; refreshed on 2026-06-01 after direct ACFMart UI inspection.
3. Task 13C: community moderation and report integration. Completed on 2026-06-02.
4. Task 13D: live-commerce session backend. Completed on 2026-06-01.
5. Task 13E: live-commerce buyer and seller UI. Completed on 2026-06-01.
6. Task 13F: realtime path decision for social/live. Completed on 2026-06-02.

## MVP Scope

Community MVP:
- Feed posts with types `SHARE`, `QUESTION`, and `PRODUCT_SHARE`.
- Comments, reactions, share counters, visibility/soft delete.
- Optional approved-offer attachment for product sharing.
- Quota enforcement: normal user 3 posts per rolling 7 days; premium/verified shop configurable to 30.
- Report/moderation integration with existing moderation case flow.

## Completed Work

### Task 13A: Social-Commerce Backend Foundation

Completed on 2026-05-31. Dashboard shell refreshed on 2026-06-01.

Backend added:
- Prisma schema and migration for `SocialPost`, `SocialComment`, `SocialReaction`, and `SocialShare`.
- On 2026-06-22, community backend ownership moved from `libs/products` to the dedicated `libs/social` bounded-context module; public routes, RPC values, persistence models, quotas, and moderation behavior remained unchanged.
- Enums for post type, visibility, and reaction type.
- Explicit contracts and DTOs for social feed APIs.
- Product RPC/API gateway routes under `/products/social/posts`.
- Use cases for listing posts, creating posts, comments, reactions, shares, and visibility updates.
- Focused tests for quota, active offer validation, shop ownership, comments, reactions, shares, and author/admin visibility rules.

Business rules now implemented:
- Post types: `SHARE`, `QUESTION`, `PRODUCT_SHARE`.
- `PRODUCT_SHARE` requires an active offer.
- Non-product-share posts cannot attach offers.
- Normal users can create 3 posts per rolling 7 days.
- Active shop-owned posts can create 30 posts per rolling 7 days.
- Posting as a shop requires shop ownership and `shopStatus = verified`.
- Hidden posts are excluded from the public feed and cannot be commented/reacted/shared through public interaction use cases.
- On 2026-06-25, `GET /api/social/posts` was trimmed to the public feed card contract. On 2026-06-28, the media contract changed from single `image` to `media[]` with `{ id, assetType, url, mimeType, sortOrder }`.
- On 2026-06-25, `GET /api/social/posts/:postId` was added with the same compact response shape; hidden posts remain unavailable to public viewers unless requester is author/admin.
- On 2026-06-28, `POST /api/social/posts` switched to `multipart/form-data`: required fields are `postType` and `body`, optional `media[]` accepts up to 5 image/video files. The create request no longer accepts `authorShopId` or `offerId`; new posts are created as user posts. Successful creates return only `{ message: 'Post created successfully.' }`, and RPC/use-case errors bubble to the client.
- On 2026-06-26, feed list/detail reads became optionally authenticated: no `Authorization` header keeps the public feed behavior, while a valid access token populates viewer-specific fields such as `viewer.liked`; a supplied invalid token remains a `401`.
- On 2026-07-07, social post list/detail responses include top-level `shopId`: a non-null value means the post belongs to that shop, while `null` means the post is user-authored.
- On 2026-06-25, `GET /api/social/posts/:postId/comments` was added with paginated response `{ page, pageSize, totalItems, totalPages, items }`; comment items expose nested `author`, `body`, `createdAt`, `likeCount`, `viewerLiked`, and `replyCount`.
- On 2026-06-28, `POST /api/social/posts/:postId/comments` keeps the authenticated root-comment write path but returns only `{ message: 'Comment created successfully.' }` after a successful create; RPC/use-case errors bubble to the client.
- On 2026-06-26, comment replies were consolidated into `SocialComment` via `parentCommentId`; `SocialCommentLike` now covers both roots and replies. The migration transfers legacy reply/like data before removing the old tables.
- Seed data creates realistic social comment likes and replies around QR verification, delivery, invoice, and anti-fake trust questions.
- `GET /api/social/comments/:commentId/replies` returns every public descendant using a PostgreSQL recursive CTE, excluding every subtree behind a hidden node. Pagination is applied to the flat result ordered by `depth ASC, createdAt ASC`; items include `parentCommentId`, `depth`, direct-parent `replyToUser { userId, userName }`, `replyCount`, and existing author/like fields.
- `POST /api/social/posts/:postId/comments` now creates root comments only and always persists `parentCommentId = null`. `POST /api/social/comments/:commentId/replies` is the authenticated reply write path; it derives the parent, post, and direct-parent reply target server-side, bubbles RPC/use-case errors, and returns only `{ message: 'Reply created successfully.' }` after a successful create.
- Seed data now attaches real `MediaAsset` records to `User.avatarMediaId`, `Shop.avatarMediaId`, and `Shop.bannerMediaId` using `USER_AVATAR`, `SHOP_AVATAR`, and `SHOP_BANNER` resource types.

Verification:
- `npx tsc --noEmit --pretty false --skipLibCheck prisma/seeds/00-utils.ts prisma/seeds/02-users-kyc.seed.ts prisma/seeds/03-shops.seed.ts prisma/seeds/10-social-chat-live.seed.ts` passed.
- `npm test -- list-social-comment-replies.use-case.spec.ts social.controller.spec.ts --runInBand` passed.
- `npx prisma validate` passed.
- `npx tsc --noEmit --pretty false --skipLibCheck prisma/seeds/10-social-chat-live.seed.ts prisma/seeds/00-utils.ts` passed.
- `npm test -- list-social-comments.use-case.spec.ts social.controller.spec.ts --runInBand` passed.
- `npm test -- create-social-post.use-case.spec.ts social-post-interactions.use-case.spec.ts get-social-post.use-case.spec.ts social.controller.spec.ts --runInBand` passed.
- `npm test -- create-social-post.use-case.spec.ts social-post-interactions.use-case.spec.ts --runInBand` passed.
- `npx prisma generate` passed.
- `npx nest build catalog-service` passed.
- `npx nest build api-gateway` passed.
- Full `npm run build` was attempted but timed out before returning a concrete error.

### Task 13B: Buyer-Facing Community Feed UI

Completed on 2026-05-31.

Frontend added:
- Top-level route `/community/*` with a dedicated Social Hub dashboard shell, separate from the marketplace header/footer.
- Sidebar routes after product decision: Tong quan, Bang tin, Cong dong, Affiliate, Live Commerce, and Ho so ca nhan. Xu huong, Aivy AI, and Cai dat were removed from the local Social Hub sidebar.
- Route `/community/feed` with public feed read and authenticated write actions.
- Header desktop nav, mobile menu, and bottom mobile nav entry for Cộng đồng.
- Composer with post type tabs: `SHARE`, `QUESTION`, and `PRODUCT_SHARE`.
- Product-share selector backed by active offers from `GET /products/offers`.
- Feed cards with author/shop display, post type, body, optional product link, like/comment/share counters, comments, and action buttons.
- Feed right rail for Shop Premium quota copy, backend-backed behavior notes, and shareable products.
- Dashboard placeholder sections for community groups/Q&A/reviews, affiliate metrics/tabs, live-commerce empty state with filters/search/reminder CTA, profile, and settings.

UI behavior:
- Unauthenticated users can view feed state and are sent to `/auth` when trying to post/interact.
- Normal-user quota copy shows 3 posts per 7 days and local remaining count based on loaded posts.
- Empty, loading, API error, desktop, and mobile states are represented.
- The shell uses the observed ACFMart proportions and behavior: 256px white sidebar, neutral workspace, white bordered 12px cards, violet active nav state, sticky topbar, color-coded shortcut/feature icons with visible white glyphs, gradient overview hero, and a mobile drawer with hamburger topbar.

Verification:
- `npm run build` in `front-end-web` passed on 2026-05-31 and again after the 2026-06-01 dashboard refresh.
- Browser QA opened `http://127.0.0.1:5173/community`, `/community/feed`, and `/community/live` on desktop and mobile widths.
- Backend was not running during browser QA, so `localhost:3001` fetch failures were expected; layout and error states rendered.

### Task 13C: Community Moderation and Report Integration

Completed on 2026-06-02.

Backend added:
- Existing `POST /orders/reports` now accepts `SOCIAL_POST` and `SOCIAL_COMMENT` targets.
- Existing admin report list/filter accepts social targets.
- Social target validation uses the PostgreSQL social post/comment records and only allows reporting public content.
- Users cannot report their own social post/comment.
- Duplicate open/in-review report rejection now applies to social targets through the existing report duplicate rule.
- Existing report moderation case flow is reused: social reports open a `REPORT` moderation case.
- Admin report resolution hides social post/comment content; report rejection restores social content to public.

Frontend added:
- Community feed post cards expose a report action.
- Loaded comments expose a report action.
- Social report submission uses the existing `/orders/reports` endpoint and sends unauthenticated users to `/auth`.

Verification:
- `npm test -- create-report.use-case.spec.ts update-admin-report.use-case.spec.ts --runInBand` passed.
- `npx nest build orders-service` passed.
- `npx nest build api-gateway` passed.
- `npm run build` in `front-end-web` passed.

### Task 13D: Live-Commerce Session Backend

Completed on 2026-06-01.

On 2026-06-22, live session, reminder, and durable live-comment backend ownership moved from `libs/products` to the dedicated `libs/live-commerce` bounded-context module. Public routes, RPC values, realtime transport, persistence, moderation, and response contracts remained unchanged.

Backend added:
- Prisma schema and migration for `LiveCommerceSession`, `LiveSessionOffer`, and `LiveSessionReminder`.
- Explicit session status enum: `SCHEDULED`, `LIVE`, `ENDED`, `CANCELLED`.
- Product contracts, DTOs, RPC handlers, API gateway service methods, and REST endpoints under `/products/live/sessions`.
- Use cases for listing sessions, creating seller sessions, updating status, and idempotent buyer reminders.

Business rules now implemented:
- Only the owner of a verified shop can create live sessions for that shop.
- Attached offers must exist, belong to the same shop, be active, and have positive available quantity.
- Public listing supports `all`, `live`, `upcoming`, and search filters.
- Status transitions are explicit: `SCHEDULED -> LIVE/CANCELLED`, `LIVE -> ENDED/CANCELLED`; terminal states cannot restart.
- Reminder creation is idempotent per `sessionId + userId` and only allowed for scheduled sessions.
- Admins can update session status; otherwise only the shop owner can update it.

Verification:
- `npx prisma generate` passed.
- `npm test -- live-commerce.use-case.spec.ts --runInBand` passed.
- `npx nest build catalog-service` passed.
- `npx nest build api-gateway` passed.
- 2026-06-10 production API-base follow-up: removed the live-only backend rewrite workaround and fixed frontend API base fallback so production `antifake.io.vn` builds use `https://api.antifake.io.vn/api` when `VITE_API_BASE_URL` is missing. `npm run build` in `front-end-web` and `npm run build:deploy` in `back-end` passed.

Live-commerce MVP:
- Seller creates scheduled/active sessions.
- Session has title, description, cover image, start time, status, playback/embed URL or placeholder, and attached offers.
- Buyer `/live` supports empty state, all/live/upcoming filters, search, reminder CTA, live cards, and offer cards.
- Live detail supports playback/embed area, attached offers, buy-now/cart links, seller identity, and reminder/follow CTA.
- Self-hosted video streaming/WebRTC is out of scope for the first slice.

### Task 13E: Live-Commerce Buyer and Seller UI

Completed on 2026-06-01.

Frontend added:
- Top-level buyer route `/live` backed by `GET /products/live/sessions`.
- Social Hub `/community/live` now reuses the same backend-backed buyer live surface.
- Buyer filters for all/live/upcoming, search, live/empty/error states, attached offer cards, playback URL link, reminder CTA, and product deep links.
- Seller dashboard `Live Commerce` panel under `/shops?section=live`.
- Seller form for title, description, cover URL, start time, playback/embed URL, and attached active in-stock offers.
- Seller status actions for start, end, and cancel using `PATCH /products/live/sessions/:sessionId/status`.
- Home page compact "Live dang dien ra" block that links to `/live`.

UI behavior:
- Buyer can only view sessions, request reminders, and open attached products.
- Seller management is restricted to the authenticated seller dashboard and uses the verified shop ID.
- Reminder action sends unauthenticated users to `/auth`.
- Backend-offline states render as empty/error panels instead of blank screens.

Verification:
- `npm run build` in `front-end-web` passed.
- Browser QA opened `http://127.0.0.1:5173/live`, `/community/live`, and `/`; backend API was not running, so expected `localhost:3001` fetch failures were visible while UI and empty/error states rendered. Seller live management was covered by TypeScript/build verification in this pass.

### Task 13F: Realtime Path Decision

Completed on 2026-06-02.

Update on 2026-06-02:
- Frontend Firebase Web SDK config and guarded Analytics bootstrap were added under `front-end-web/src/lib/firebase.ts`.
- This does not change the realtime decision: Firebase Auth, Firestore, and FCM are still not used by social/live MVP flows.

Update on 2026-06-04:
- Product owner accepted a post-MVP realtime roadmap in `realtime-delivery-plan.md`.
- Social/live MVP still starts from PostgreSQL-backed REST state, but the upgrade path is now explicit: Redis supports ephemeral realtime coordination, chat uses Socket.IO/WebSocket, live reactions are ephemeral WebSocket events, live comments are durable/moderated WebSocket events, dashboards use SSE, notification delivery uses FCM + SSE + in-app records, and livestream video should start with HLS/CDN unless ultra-low latency requires WebRTC.

Update on 2026-06-05:
- RT6 live reactions over WebSocket is complete. API gateway now exposes live-session reaction rooms on the existing Socket.IO server, validates joins against visible live sessions, rate-limits per user/session, stores aggregate counters in Redis-backed realtime counters with local fallback, exposes REST recovery at `/products/live/sessions/:sessionId/reactions`, and adds buyer live-card reaction controls.
- RT7 live comments over WebSocket with moderation is complete. Live comments now persist in PostgreSQL before Socket.IO broadcast, use client message idempotency keys, expose REST history at `/products/live/sessions/:sessionId/comments`, refetch history on frontend reconnect, dedupe by server comment ID, and support admin hide/restore/delete moderation endpoints.

Update on 2026-06-06:
- RT8 livestream video transport decision and pilot is complete. First production strategy is HLS/CDN metadata, WebRTC is deferred unless ultra-low latency becomes mandatory, live sessions now store provider/session/ingest/playback/recording metadata in PostgreSQL, and seller live management can enter the pilot stream fields without moving commerce state out of NestJS/PostgreSQL.

Decision:
- Defer Firebase/Firestore for social/live in this MVP.
- Ship the current social/live surfaces with PostgreSQL-backed polling through the existing NestJS HTTP APIs.
- Add NestJS SSE later only as an invalidation channel if polling becomes too slow or too expensive.
- Do not add WebSocket until the product needs true bidirectional live behavior such as live chat, co-host controls, or high-frequency reactions.

Source-of-truth boundaries:
- PostgreSQL remains canonical for users, shops, offers, orders, moderation, audit, finance, reports, social posts, comments, reactions, shares, live sessions, live offers, live reminders, and notifications.
- Future Firebase/Firestore usage, if reopened, must be non-canonical and must not store commerce, moderation, report, audit, finance, or order state as the durable source of truth.
- Realtime events should carry IDs and invalidation hints only; clients must refetch canonical data from the existing REST APIs.

Polling behavior for the first MVP:
- Social feed list and counters: poll `GET /products/social/posts?pageSize=30` every 20-30 seconds while `/community/feed` is visible.
- Active post comments/counters: refresh every 10-15 seconds while the post is visible or after create/comment/react/share/report actions.
- Buyer live listing: poll `GET /products/live/sessions?filter=live|upcoming|all` every 15 seconds while `/live` or `/community/live` is visible.
- Seller live management: refresh every 5 seconds only while a session is `LIVE` or while a status transition is in progress; otherwise use manual reload after create/start/end/cancel.
- Reminder and notification state: refresh after reminder actions; authenticated notification badge can poll `GET /user/notifications?unreadOnly=true&pageSize=5` every 30-60 seconds.
- Hidden browser tabs should pause or back off polling; 429/5xx responses should trigger exponential backoff.

SSE upgrade path:
- Optional endpoint shape: `GET /realtime/events` after authenticated API access.
- Events should be invalidation-only, for example `SOCIAL_POST_UPDATED`, `SOCIAL_COMMENT_ADDED`, `LIVE_SESSION_STATUS_CHANGED`, and `NOTIFICATION_CREATED`.
- Clients should refetch existing HTTP endpoints after receiving an event instead of trusting event payloads as canonical state.

Security and rate-limit notes:
- Reuse existing JWT/RBAC checks and never expose hidden posts, private reports, moderation cases, orders, or finance data through public realtime topics.
- Keep page/pageSize caps on list endpoints.
- Rate-limit create/comment/react/share/report/reminder/status endpoints separately from passive polling.
- Keep report/reminder idempotency and duplicate detection server-side.
- Audit moderation and live status transitions in PostgreSQL before any realtime event is emitted.

Verification:
- Decision documented here and in `project-completion-roadmap.md`.
- Local app now has Firebase Web/Analytics bootstrap only; repo search still found no Firebase Auth, Firestore, FCM, or social/live realtime implementation.
- `notification-mvp.md` confirms the existing notification MVP is PostgreSQL-backed and FCM/browser push is deferred.

## Affected Modules

Backend likely touched:
- `back-end/prisma/schema.prisma`
- new or existing backend lib for social/community under `back-end/libs`
- API gateway module under `back-end/apps/api-gateway/src/modules`
- contracts in `back-end/libs/contracts/src/microservice/patterns.ts`
- moderation/report integration in orders/admin modules if social reports reuse existing queues

Frontend likely touched:
- `front-end-web/src/App.tsx`
- `front-end-web/src/components/site-header.tsx`
- new pages for community feed, live listing, live detail, seller live management
- `front-end-web/src/pages/home-page.tsx` for compact live block
- `front-end-web/API_COVERAGE.md`

## Constraints

- Keep PostgreSQL/NestJS as source of truth for users, shops, offers, orders, moderation, audit, and finance.
- Do not copy ACF Mart branding/assets verbatim; match the UX structure and business behavior using this project's anti-fake domain.
- Do not build custom video infrastructure in the MVP.
- Prefer backend-first vertical slices with focused tests before UI polish.

## Recommended Next Step

Run the explicit Agora provider cutover and authenticated
publisher/subscriber staging smoke in `shop-livestream.md`.
