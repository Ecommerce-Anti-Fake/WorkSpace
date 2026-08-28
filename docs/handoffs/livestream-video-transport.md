# Livestream Video Transport

## Status

The original RT8 HLS/Cloudflare pilot was completed in June-July 2026 and is
now superseded. The approved production transport is Agora RTC through the
browser Web SDK. Focused local gates passed on 2026-07-28; explicit cutover and
authenticated staging smoke are still pending. On 2026-07-29 the browser
publisher lifecycle gained explicit preparation, a Redis-backed single
publisher lease, bounded rejoin/republish, and ordered media cleanup. See
`shop-livestream.md`.

## Decision

Use Agora RTC interactive live streaming. Do not operate custom WebRTC
infrastructure, RTMP/RTMPS ingest, Cloudflare live-input webhooks, OBS
credentials, or provider replay in the active flow.

Rationale:
- Browser publishing removes the Cloudflare subscription/OBS dependency that
  blocked the prior provider-backed staging proof.
- Agora supplies the managed RTC media plane while the application retains
  authorization, commerce state, and session lifecycle.
- The product interaction layer is already covered by Socket.IO comments/reactions.
- Commerce state, comments, moderation, orders, reminders, and audit remain in NestJS/PostgreSQL.

## Runtime Contract

- The browser generates and reuses a UUID v4 `clientId`.
- Authenticated session creation includes `clientId` and returns the public
  `LiveSession` fields plus top-level Agora access fields:
  `appId`, `channelName`, `uid`, `token`, `role`, and `expiresAt`.
- `POST /api/live/sessions/:id/join` accepts `{ clientId, role? }`, uses optional JWT,
  and always returns `Cache-Control: no-store`.
- Only the actual shop owner receives `PUBLISHER`. Everyone else can receive
  `SUBSCRIBER` only after the session is `LIVE`.
- The backend owns channel names, derives a stable non-zero Agora UID from the
  session/principal/client ID, and signs AccessToken2 server-side.
- `POST /api/live/sessions/:id/broadcast-credentials` is a deprecated,
  owner-only compatibility alias. It returns Agora access, never RTMPS data.
- The seller joins as publisher, creates camera/microphone tracks, publishes
  successfully, and only then calls `POST /api/live/sessions/:id/start`.
- Audience clients join only a `LIVE` session, subscribe on
  `user-published`, and renew with the same `clientId` before token expiry.
- PostgreSQL remains authoritative for `SCHEDULED`, `LIVE`, `ENDED`, and
  `CANCELLED`; frontend SDK callbacks do not mutate commerce state directly.
- A publisher claim uses Redis with a 45-second TTL and 15-second heartbeat.
  The same `clientId` renews idempotently; a second publisher receives `409`.
  Production refuses the development-only in-process fallback.
- The host client is created only after explicit user preparation. Successful
  publish precedes `/start`; disconnect/token-expiry recovery retries at
  1/2/4 seconds and republishes only when the studio was publishing.
- End cleanup is ordered: unpublish, stop/close local tracks, leave, release
  lease, then set `ENDED`. Failure of the final status update exposes a retry.

## Recording And Replay

- Replay/recording is not part of the Agora migration.
- The buyer experience shows live RTC video only while the session is `LIVE`;
  terminal sessions do not expose the old Cloudflare replay.
- Live comments remain the canonical moderation/dispute replay log because they are persisted in PostgreSQL before broadcast.
- A future recording feature requires a separate storage, retention, deletion,
  and access-control decision.

## Storage And Access Control

- Agora carries transient video/audio; the VPS and PostgreSQL do not store media bytes.
- PostgreSQL stores metadata only.
- `AGORA_APP_CERTIFICATE` stays backend-only. Tokens, certificates, and full
  access responses must not be logged or persisted in browser storage.
- Ended/cancelled/failure handling uses the existing live session status flow;
  RTC state never moves commerce truth out of PostgreSQL.

## Implemented Surfaces

Backend:
- Server-owned `AGORA_RTC` channel/provider metadata.
- AccessToken2 issuance with backend-derived role and stable UID.
- Create/join/start contracts with no-store token responses.
- Cloudflare provisioning, webhook, recording refresh, and RTMPS credential
  runtime paths removed.

Frontend:
- Seller camera/microphone studio publishes with `agora-rtc-sdk-ng`, then marks
  the canonical session live.
- Buyer player joins as audience and subscribes to remote tracks.
- Scheduled-room polling transitions the buyer into RTC playback when the
  backend reports `LIVE`.
- Comments/reactions remain on the existing Socket.IO path.
- StrictMode/double-click preparation shares one promise and one Agora client.
  Closing a publishing tab keeps the browser confirmation; unmount cleanup
  releases media and the publisher lease.

## Configuration And Cutover

Required backend environment:

- `AGORA_APP_ID`
- `AGORA_APP_CERTIFICATE`
- `AGORA_RTC_TOKEN_TTL_SECONDS=3600` (`60..86400`)

Enable the Agora App Certificate and Co-Host authentication in the Agora
console. Never expose the certificate to Vite/browser configuration.

Cutover is an explicit, idempotent operation:

1. Drain live-session write/publish traffic and back up PostgreSQL.
2. Deploy compatible backend and frontend artifacts with Agora configuration.
3. Run `npm run live:cutover-agora` manually.
4. The command must refuse to continue while any Cloudflare session is `LIVE`.
5. It migrates only Cloudflare `SCHEDULED` sessions to `AGORA_RTC` and preserves
   `ENDED`/`CANCELLED` history.

Never call this command from application startup, seed, Prisma migration
deployment, or the normal deploy script.

## Verification

- Backend: 10 Agora/live/notification Jest suites passed (43 tests); targeted
  ESLint, the full six-service build, `build:deploy`, catalog build, Prisma
  validation, and standalone cutover-command type-check passed.
- Frontend: 6 RTC contract tests, targeted ESLint, and the Vite production
  build passed. The Agora SDK remains in a lazy chunk; Vite reports an expected
  non-failing large-chunk warning.
- Local builds do not prove Agora project configuration, camera/microphone
  permissions, token renewal, or two-browser media delivery.
- 2026-07-29 hardening gate: 7 focused backend suites/47 tests, 12 frontend
  live tests, targeted lint, Prisma validation/generation, full six-service
  backend build, and frontend production build passed. Real HTTPS media and
  two-tab publisher smoke remain staging-only.

### Release-readiness audit (2026-07-28)

- Backend production dependencies have no critical/high audit findings. Eight
  moderate findings remain in the `firebase-admin` Google Cloud dependency
  chain; the available automatic remediation is breaking and is deferred.
- Frontend is pinned by the lockfile to React Router `7.18.1`. The remaining
  high advisory, `GHSA-qwww-vcr4-c8h2`, applies to RSC action handling; this
  application is a client-only Vite `BrowserRouter` SPA and has no RSC/server
  action surface. This reachability exception expires on 2026-08-15. Do not add
  React Router Framework/RSC actions before a separately tested v8 migration.
- Repository-wide frontend lint still has 82 pre-existing findings outside the
  livestream slice. Targeted lint for every changed livestream TypeScript file
  passes.
- The repository-wide backend Jest baseline is 224/236 suites and 722/766 tests
  passing. The 12 failing suites are stale order/offer/review/affiliate fixtures
  outside this transport slice; all 10 focused Agora suites remain green.
- Deployment is intentionally paused: the available environment has no
  Render/Vercel/Agora Console credentials, and the deployed backend has not
  been confirmed to contain the required Agora variables. Pushing a fail-fast
  backend before configuration could cause an outage.

## Recommended Next Step

Provide deployment-console access or configure the required backend variables,
enable the Agora console settings, then deploy the compatible revisions and run
the explicit cutover plus authenticated staging smoke with one owner publisher
and one anonymous/authenticated subscriber,
including camera/microphone permission, publish-before-start, token renewal,
end cleanup, comments/reactions, reminder, and checkout attribution.
