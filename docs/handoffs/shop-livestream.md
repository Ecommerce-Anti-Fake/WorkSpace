# Shop Livestream

## Status

Full shop-livestream implementation completed locally on 2026-07-24.
The Cloudflare/OBS transport implemented on that date is superseded by the
approved Agora RTC browser transport migration on 2026-07-28. Agora-focused
local tests/builds passed on 2026-07-28. Live-commerce hardening completed
locally on 2026-07-29: backend-owned multipart cover upload, public discovery
ordering, pinned/replaceable offers, socket recovery, and a Redis publisher
lease are implemented. Migration `20260729100000_live_pinned_offer` was
created and validated but was not applied. Explicit data cutover, authenticated
two-browser staging smoke, FCM delivery, and checkout conversion smoke remain
required.

## Product Contract

- Buyer routes: `/live` and `/live/:sessionId`.
- Seller route: `/seller/live`.
- Anyone can list, search, filter, watch an active live session, and read
  comments/reactions.
- Authentication is required for reminders, comments, reactions, product
  purchase, and seller operations.
- Only the verified shop owner can create/control a shop session or moderate its
  comments; admin retains moderation and analytics access.
- The verified shop owner publishes camera/microphone tracks from the browser
  through Agora RTC. OBS, RTMPS ingest, Cloudflare webhooks, and replay are not
  active product paths.
- PostgreSQL remains canonical for session state, offers, vouchers, reminders,
  comments, moderation, cart/order attribution, and analytics.

## Backend

### Provider lifecycle

- The browser owns a UUID v4 `clientId`; it is opaque to the user.
- `POST /api/live/sessions` accepts `multipart/form-data` with the normal
  session fields, `clientId`, repeated `offerIds`/`voucherIds`, and optional
  `coverImage` (JPG/PNG/WebP, maximum 5 MB). The gateway keeps the file in
  memory; the use case validates MIME and magic bytes, uploads to Cloudinary,
  and persists only `secureUrl`. Persistence failure triggers best-effort
  Cloudinary cleanup while preserving the original error. The no-store response
  contains public `LiveSession` fields plus top-level
  `appId`, `channelName`, `uid`, `token`, `role`, and `expiresAt`.
- `POST /api/live/sessions/:id/join` accepts `{ clientId, role? }` with optional JWT
  and returns the same Agora access fields with `Cache-Control: no-store`.
- The backend derives authorization. Only the actual session shop owner gets
  `PUBLISHER`; every other principal is `SUBSCRIBER` and can join only while
  the canonical session is `LIVE`.
- Channel names are backend-owned. Agora UIDs are stable, non-zero, and derived
  from session/principal/client ID. AccessToken2 is signed only in the backend.
- The seller Web SDK client joins as host, creates camera/microphone tracks,
  publishes them successfully, and only then calls
  `POST /api/live/sessions/:id/start`.
- `/start` conditionally moves `SCHEDULED -> LIVE`, records the first
  `actualStartedAt`, and emits the existing reminder/dashboard effects.
- Audience clients join as audience, subscribe to `user-published`, and renew
  through `/join` with the same `clientId` before expiry.
- `POST /api/live/sessions/:id/broadcast-credentials` remains only as a
  deprecated owner-only compatibility alias; it returns Agora access, never
  RTMPS credentials.
- Seller status mutation remains restricted to terminal transitions. Ending a
  live session records `actualEndedAt`; cancelling a scheduled session does not
  fabricate start/end timestamps.
- SDK connection callbacks never make a session `LIVE` and tokens/certificates
  are never logged or persisted.
- Publisher access is protected by one lease per session: Redis TTL 45 seconds,
  heartbeat every 15 seconds, idempotent renewal for the same `clientId`, and
  `409` for a second studio. Local in-process fallback is refused in production.
  Terminal transitions force-release the lease.
- Studio preparation is explicit and promise-gated against StrictMode/double
  clicks. Token expiry/disconnect retries rejoin and republish at 1/2/4 seconds.
  Ending follows unpublish, track stop/close, leave, lease release, then
  canonical `ENDED`; a failed final status remains retryable.
- Recording/replay is outside this migration. Terminal sessions do not expose
  the old Cloudflare recording-refresh path.

### Commerce and engagement

- Session creation accepts validated `offerIds` and `voucherIds`.
- Public discovery without a filter or with `filter=all` exposes only `LIVE`
  and future `SCHEDULED` sessions, with live sessions first and upcoming
  sessions ordered by `startAt ASC`. Authenticated
  `filter=all&shopId=<ownedShop>` includes terminal management history.
- Pin/unpin is atomic and idempotent and emits `live:offer-pinned`; clients
  refetch REST detail on connect/reconnect. A sold-out pinned offer stays
  pinned and is projected with `availableQuantity: 0`.
- Owners/admins can replace attached offers while `SCHEDULED` or `LIVE`.
  Removing the pinned offer returns `409` until it is switched or unpinned.
- Live vouchers must be active, shop-funded vouchers owned by the session shop
  and valid at `startAt`. Buyers see the existing checkout voucher code.
- Product links include `?live=<sessionId>`. Add-to-cart validates that the offer
  was featured, persists `CartItem.sourceLiveSessionId`, and propagates it to
  `OrderItem.sourceLiveSessionId`.
- Different live sources remain separate cart lines, preserving attribution.
- Seller analytics combines current Redis/local presence and reaction counters
  with durable reminder/comment/order/revenue metrics.
- Reminder registration is idempotent and serialized with `/start` on the
  session row, so a reminder either joins the start recipient snapshot or is
  rejected after the session becomes `LIVE`.
- `LIVE_STARTED` notification records use a dedupe key. A failed notification
  RPC returns a retryable error after the canonical session becomes `LIVE`;
  repeating `/start` retries pending recipients without reclaiming a persisted
  notification.
- Anonymous sockets can join/read. Only authenticated principals can comment or
  react.
- Shop owner/admin can include hidden comments and hide, restore, or delete
  comments.

## Main APIs

- `GET /api/live/sessions`
- `GET /api/live/sessions/:id`
- `POST /api/live/sessions`
- `POST /api/live/sessions/:id/join`
- `POST /api/live/sessions/:id/start`
- `PATCH /api/live/sessions/:id/pinned-offer`
- `PATCH /api/live/sessions/:id/offers`
- `POST /api/live/sessions/:id/publisher-lease/heartbeat`
- `DELETE /api/live/sessions/:id/publisher-lease`
- `POST /api/live/sessions/:id/broadcast-credentials` (deprecated owner-only alias)
- `PATCH /api/live/sessions/:id/status`
- `POST /api/live/sessions/:id/reminders`
- `GET /api/live/sessions/:id/comments`
- `PATCH /api/live/sessions/:id/comments/:commentId/visibility`
- `GET /api/live/sessions/:id/reactions`
- `GET /api/live/sessions/:id/analytics`

## Schema and migrations

- Provider lifecycle fields:
  `20260724120000_live_provider_lifecycle`.
- Live cart/order attribution:
  `20260724143000_live_commerce_attribution`.
- Session-voucher relation:
  `20260724150000_live_session_vouchers`.
- Provider event ordering/errors and unique provider input IDs:
  `20260724180000_live_provider_event_hardening`.
- The Agora migration adds server-owned `AGORA_RTC` channel metadata. Historical
  terminal Cloudflare rows and migrations remain intact.
- Pinned offer relation and index:
  `20260729100000_live_pinned_offer`. This additive migration is prepared only;
  it has not been applied to any database.

Run the normal split-schema flow before deployment:

```powershell
npm run prisma:merge
npm run prisma:generate
```

Apply schema migrations through the environment's standard migration command
before restarting catalog, orders, users, and API gateway services. The
provider data cutover is a separate explicit operation described below.

## Deployment configuration

VPS Nginx/PM2/DNS/SSL instructions are prepared in
`docs/VPS_DEPLOYMENT.md`. No VPS deploy or provider cutover has been executed.

Required:

- `AGORA_APP_ID`
- `AGORA_APP_CERTIFICATE`
- `AGORA_RTC_TOKEN_TTL_SECONDS=3600`; accepted range is `60..86400`.

Enable the App Certificate and Co-Host authentication in the Agora console.
The certificate is backend-only and must never appear in Vite/browser
configuration, source, logs, database rows, or screenshots.

### Explicit provider cutover

`npm run live:cutover-agora` is idempotent and must be run manually. It must
never run from application startup, seed, `prisma migrate deploy`, or the normal
deploy script.

1. Drain session create/start/join traffic.
2. Back up PostgreSQL and record the deployed revisions.
3. Deploy compatible backend and frontend artifacts with Agora configuration.
4. Run `npm run live:cutover-agora`.
5. The command refuses to proceed if any Cloudflare session is `LIVE`.
6. Only Cloudflare `SCHEDULED` sessions move to `AGORA_RTC`; `ENDED` and
   `CANCELLED` rows remain unchanged as history.
7. Restart services, re-enable traffic, and run the staging smoke below.

The 2026-07-24 Cloudflare subscription/Notifications/OBS incident remains
historical evidence for why that transport was replaced. It is not an active
deployment prerequisite.

## Verification

Historical baseline completed before the transport replacement:

- Prisma merge/client generation passed.
- Prisma validation passed after provider-event hardening.
- 15 focused Jest suites passed: 69 tests.
- Cloudflare hardening gate passed: 7 focused Jest suites, 48 tests.
- `nest build` passed for `api-gateway`, `catalog-service`, and
  `orders-service`.
- Frontend TypeScript project build and Vite production bundle passed.
- Browser QA passed for `/live` at 1366px and 390px; navigation, error state,
  accessibility tree, and responsive layout rendered correctly.
- Buyer live product cards now use a live-specific info class so the checkout
  `.product-info` width rule cannot collapse product text/actions on mobile.
  The focused CSS fixture passed at 320px and 390px without horizontal overflow.
- The buyer live room now spans the available desktop width instead of stopping
  at 1600px and leaving the remaining space empty on the right; the chat column
  stays fixed while the video/content column absorbs the extra width.
- Browser network inspection confirmed the request shape
  `/api/live/sessions?filter=all`.

Agora migration verification completed locally on 2026-07-28:

- 10 focused Agora/live/notification backend Jest suites passed (43 tests).
- Backend targeted ESLint, the full six-service build, `build:deploy`, catalog
  build, Prisma validation, and standalone cutover-command type-check passed.
- 6 frontend RTC contract tests, targeted ESLint, and the Vite production
  build passed. Vite reports a non-failing large-chunk warning for the lazy
  Agora SDK.

Live-commerce hardening verification completed locally on 2026-07-29:

- Prisma merge, format, validation, and client generation passed. No migration
  command was run.
- 7 focused backend suites passed (47 tests), covering multipart cover
  validation/upload cleanup, discovery scope/order, pin/replace behavior,
  socket emission, role selection, and publisher lease behavior.
- Targeted backend and frontend ESLint passed for all changed TypeScript files.
- The full six-service backend build and frontend production build passed.
- 12 frontend live tests passed for file validation, multipart shape, preview
  cleanup, singleton preparation, error mapping, pin recovery selection, and
  sold-out behavior.
- A local desktop `/live` browser smoke rendered the two public filters and
  expected API error state. The backend stack was not running, so authenticated
  cover upload, seller operations, mobile media, and two-tab Agora behavior
  were not claimed as browser-verified.

No real HTTPS camera/microphone or two-browser Agora media smoke was run; local
gates do not prove Agora console settings or provider delivery.

Release-readiness audit completed on 2026-07-28:

- Backend production audit: 0 critical/high; 8 moderate findings remain in the
  `firebase-admin` Google Cloud dependency chain because the automatic upgrade
  is breaking.
- Frontend lockfile uses React Router `7.18.1`. The remaining high
  `GHSA-qwww-vcr4-c8h2` advisory is limited to RSC actions, which are unreachable
  in this client-only Vite `BrowserRouter` SPA. Review this exception by
  2026-08-15 and do not introduce Framework/RSC actions before a separate v8
  migration.
- Repository-wide frontend lint has 82 pre-existing findings outside this
  slice; targeted lint for the changed livestream files passes.
- Full backend Jest currently passes 224/236 suites and 722/766 tests. The 12
  failing suites are stale order/offer/review/affiliate fixtures outside the
  livestream slice; the 10 focused Agora suites pass.
- No release was pushed: this environment has no Render, Vercel, or Agora
  Console credentials, and the deployed backend Agora variables are unverified.

## Required staging smoke

1. Confirm App Certificate and Co-Host authentication are enabled for the
   configured Agora project.
2. Complete the backup/drain/deploy/explicit-cutover sequence above.
3. Create a seller session with an offer and live voucher; confirm the create
   response is no-store and contains top-level `PUBLISHER` access without the
   certificate.
4. Grant camera/microphone permission, publish both tracks, then call `/start`;
   confirm PostgreSQL changes to `LIVE` only after that sequence.
5. Join from a second anonymous browser and an authenticated non-owner; both
   must receive `SUBSCRIBER`, play media, and be unable to publish.
6. Confirm a non-owner cannot join before `LIVE`, and the deprecated credential
   alias remains owner-only.
7. Force/observe token renewal using the same `clientId`; confirm stable UID,
   uninterrupted media, and no token/certificate logging.
8. Exercise comments, reactions, reconnect, and reminder notification/FCM.
9. Complete a live-sourced checkout and confirm seller analytics attribution.
10. End/cancel and confirm SDK tracks/clients clean up with no replay surface.

## Next step

Provide deployment-console access or configure the backend Agora variables,
enable App Certificate plus Co-Host auth, deploy the compatible revisions, then
run the explicit cutover and two-browser staging smoke above.
