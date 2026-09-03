# Realtime Production Hardening

## Status

RT9 implemented on 2026-06-08 as launch-readiness scripts and checklist. Full production load numbers still require staging infrastructure.

## Scope

This slice does not add a new realtime platform. It adds repeatable checks for the realtime surfaces already shipped:
- Notification SSE and FCM token/delivery attempts.
- Socket.IO chat/live rooms.
- Redis ephemeral coordination and fallback behavior.
- Livestream HLS/CDN metadata pilot.
- REST recovery after missed realtime events.

## Load Smoke Script

Script:

```bash
cd front-end-web
npm run smoke:realtime-load
```

Optional environment:

```bash
RT_API_BASE_URL=http://localhost:3001/api
RT_SOCKET_BASE_URL=http://localhost:3001
RT_SMOKE_USERNAME=<BUYER_UAT_SECRET>
RT_SMOKE_PASSWORD=<UAT_TEST_PASSWORD>
RT_SMOKE_DURATION_MS=8000
RT_SMOKE_SOCKET_CLIENTS=2
RT_SMOKE_LIVE_SESSION_ID=<live-session-id>
```

Dry run:

```bash
npm run smoke:realtime-load -- --dry-run
```

Coverage:
- Logs in through the existing API.
- Opens authenticated notification SSE and counts response/chunks.
- Opens multiple Socket.IO clients and joins a live session when one is available.
- Reports connected clients, join ACKs, SSE status, and errors as JSON.

## Resilience Checklist

Before launch, run this checklist on staging:

- WebSocket load:
  - 500 concurrent socket clients.
  - Room fanout for chat and live session rooms.
  - Unauthorized room join attempts.
  - Reconnect storm after API gateway restart.
- SSE load:
  - 500 authenticated SSE connections.
  - Heartbeat and reconnect behavior after gateway restart.
  - REST list recovery after reconnect.
- Redis:
  - Presence TTL expiry after disconnect.
  - Live reaction counter TTL expiry and REST aggregate recovery.
  - Redis restart with local fallback verified.
  - Redis memory/eviction monitored during socket fanout.
- FCM:
  - Permission default/granted/denied browser states.
  - Token register and revoke.
  - Stale token delivery failure recorded as `NotificationDeliveryAttempt`.
  - Provider unavailable path records failed attempts without blocking in-app notification.
- Livestream:
  - HLS playback startup time.
  - CDN bandwidth and concurrent viewer target.
  - Comments/reactions alongside playback.
  - End/cancel session status closes commerce flow without deleting comment/order state.
- Backpressure:
  - Durable events are persisted before delivery.
  - Ephemeral reactions can be dropped/rate-limited.
  - REST recovery endpoint exists for every durable surface.

## RT2 Native FCM Smoke Result

Rerun on 2026-06-08:
- Isolated browser context started at `Notification.permission = default`.
- Buyer login and `/notifications` render worked.
- Notification REST list and unread count rendered.
- Push opt-in clicked native `Notification.requestPermission()`.
- Browser returned `Notification.permission = denied`.
- No FCM token was issued or stored.

Interpretation: the app flow is reachable with a reset profile, but the current browser environment still blocks native notification permission. Backend token registration/revoke and FCM failed-attempt handling remain covered by focused tests.

## Verification

- `npm run smoke:realtime-load -- --dry-run` in `front-end-web` passed.
- `npm run smoke:realtime-load` in `front-end-web` passed against local services: login OK, notification SSE HTTP 200 with one chunk, live WebSocket skipped because no live session was active.
- `npm run build` in `front-end-web` passed.
- `npm test -- notification-realtime-delivery.use-case.spec.ts realtime-event.dispatcher.spec.ts realtime-presence.service.spec.ts realtime-live-reaction.service.spec.ts` in `back-end` passed.
- `npm run build:deploy` in `back-end` passed.

## Recommended Next Step

Move to Task 16-17: CI quality gates, UAT package, and final launch hardening.
