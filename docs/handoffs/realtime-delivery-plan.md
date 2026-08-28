# Realtime Delivery Plan

Last updated: 2026-06-04

## Status

Planned. This is the post-MVP realtime upgrade plan for notifications, chat, social/live, dashboards, KYC, and report/dispute flows.

Owner decision on 2026-06-04:
- Order notifications: FCM + SSE + in-app notification.
- Buyer/seller chat: WebSocket / Socket.IO.
- Live reactions: WebSocket.
- Dashboard realtime: SSE.
- Sales livestream: prefer HLS/CDN for scalable production video delivery; use WebRTC only when ultra-low latency is truly required.
- KYC verification: notification system.
- Report/dispute: notification system + SSE/WebSocket where interactive admin/user updates are needed.

## Architecture Boundaries

- PostgreSQL is the durable source of truth for users, shops, offers, orders, KYC, reports, disputes, moderation, finance, chat messages, persisted live comments, notifications, live sessions, and audit events.
- Redis is ephemeral realtime coordination: Socket.IO horizontal scaling, fanout/pubsub, distributed rate limiting, presence/session state, short-lived live counters, and cache. Redis data must be recoverable from PostgreSQL or client reconnect state.
- SSE, WebSocket, FCM, WebRTC, RTMP, and HLS are delivery transports only. They must not become canonical storage.
- FCM is a delivery channel for browser push. In-app notification records remain canonical.
- SSE events should be invalidation/status events. Clients refetch canonical REST endpoints after receiving them.
- WebSocket can carry low-latency chat, presence, comment, and reaction events. Durable events must be persisted before broadcast.
- Livestream video transport is separate from commerce state. Live session metadata, offers, reminders, orders, persisted comments, moderation, and audit stay in NestJS/PostgreSQL.
- Do not split this into new microservices early. Keep the first production implementation inside the existing NestJS backend with Redis as infrastructure support.

## Reconnect and Recovery Rules

All realtime surfaces must support:
- Reconnect with backoff.
- REST recovery for canonical state after reconnect.
- Dedupe protection through event IDs, message IDs, notification dedupe keys, or idempotency keys.
- Idempotent delivery where clients may receive the same event more than once.
- Eventual consistency after missed events, Redis restart, tab sleep, network loss, or FCM token churn.

Graceful degradation expectations:
- Dashboard SSE failure falls back to polling or manual refresh.
- Chat WebSocket failure falls back to reconnect and REST history recovery; messages are only authoritative after PostgreSQL persistence.
- Notifications remain durable in PostgreSQL even if FCM or SSE delivery fails.
- Live comments recover from REST history after reconnect.
- Presence becomes eventually consistent and may briefly show approximate state after reconnect or Redis expiry.

## Event Taxonomy and Versioning

Naming convention: `<family>.<resource>.<action>.<version>`.

Initial event families:
- `notification.*`: durable notification creation and unread-count invalidation, for example `notification.order.created.v1`.
- `chat.*`: durable chat message events and ephemeral typing/presence events, for example `chat.message.created.v1`.
- `live.*`: live session status, ephemeral reactions, durable comments, viewer presence, for example `live.reaction.ephemeral.v1`.
- `dashboard.*`: scoped invalidation events for buyer, seller, and admin dashboards.
- `moderation.*`: durable report/dispute/moderation state changes.
- `system.*`: operational events such as failed delivery and rate-limit threshold events.

Classification:
- Durable events are persisted or derived from PostgreSQL records, have stable IDs, support REST replay/recovery, and may be delivered through SSE, WebSocket, FCM, or in-app records.
- Ephemeral events are Redis-backed or transport-only, may be sampled, aggregated, or dropped under load, and must not be required for correctness.
- Version suffixes such as `.v1` are required. Additive payload fields are backward-compatible; renames/removals require a new version.
- Consumers must ignore unknown fields and unknown event names unless explicitly configured to handle them.
- Transport eligibility must be explicit per event: in-app, SSE, WebSocket, FCM, or internal-only.

## Security and Abuse Considerations

- WebSocket and SSE connections must authenticate at connect time and must handle token refresh or reconnect when credentials expire.
- Every room/topic subscription must authorize user, shop, admin, or public live-session scope server-side.
- Unauthorized topic subscription attempts should be logged and rate limited.
- Live comments require spam protection, moderation hooks, and per-user/session rate limits.
- Live reactions require flood controls and burst handling because they are intentionally high volume.
- Reconnect abuse and rate-limit bypass attempts must be tracked by user ID, IP/device signal where available, and room/topic.
- Never trust client-provided room IDs, user IDs, shop IDs, counters, or timestamps as authorization or durable state.

## Scaling Considerations

Document and monitor before launch:
- Socket room fanout: room count, users per room, cross-node adapter health, and max broadcast rate.
- SSE connection counts: authenticated user connections, reconnect rate, heartbeat failures, and memory per connection.
- FCM token churn: stale token cleanup, multi-device registration, revoked permission, failed delivery rates.
- Livestream concurrent viewers: CDN bandwidth, origin load, expected latency, player startup time, and failover behavior.
- Redis memory growth: presence TTLs, live counter TTLs, pub/sub burst volume, eviction policy, and reconnect storms.
- Event burst handling: queue/backpressure behavior, dropped ephemeral events, delivery retry limits, and auditability for durable events.

## Planned Roadmap Slices

### Task RT0: Redis and Realtime Operations Foundation

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

### Task RT1: Realtime Event Foundation

Status: Completed on 2026-06-04 for shared backend event registry, typed event creation, dispatcher validation, durable audit-entry sink contract, and transport sink contract. RT2+ still own actual notification/SSE/FCM/WebSocket delivery producers.

Description: Add a shared backend event contract and dispatcher for notification, SSE, WebSocket, and FCM producers.

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

### Task RT2: Notification Upgrade with FCM and SSE

Status: Implemented on 2026-06-04 for backend FCM token storage, delivery-attempt audit rows, idempotent create-notification RPC, authenticated SSE invalidation stream, frontend push opt-in/revoke controls, and frontend SSE refetch. Browser smoke confirmed authenticated `/notifications`, REST list reload, SSE event stream HTTP 200, and in-app chat notification coverage. Native FCM token issuance was blocked because the smoke browser returned `Notification.permission === "denied"`.

Description: Upgrade in-app notifications so order/KYC/report/dispute/moderation/payment/fulfillment events can be delivered through in-app records, SSE invalidations, and optional FCM browser push.

Acceptance criteria:
- [x] Browser permission and FCM token registration are explicit and revocable from `/notifications`.
- [x] FCM tokens are stored per user/device and can be revoked; stale-provider failures are tracked in delivery attempts.
- [x] Shared `users.create-notification` RPC creates idempotent in-app notifications and fans out FCM attempts without blocking the canonical record.
- [x] SSE notifies authenticated clients about unread-count/list invalidation without exposing private notification payloads.
- [x] Failed FCM delivery attempts are tracked without blocking the durable in-app notification record; SSE invalidation is best-effort and recovers through REST reload.

Verification:
- [x] Backend focused notification tests pass.
- [x] Backend build passes.
- [x] Frontend build passes.
- [x] Manual browser smoke confirms buyer login, `/notifications` render, notification REST list, and authenticated SSE stream.
- [ ] Native permission grant/revoke and real FCM token issuance still need a browser profile where notification permission is not already denied.

Dependencies: RT0, RT1, Firebase project credentials for FCM.

Estimated scope: Large.

### Task RT3: Buyer/Seller Chat Realtime with Socket.IO

Status: Completed on 2026-06-04 for authenticated API-gateway Socket.IO chat rooms, Redis adapter/local fallback, PostgreSQL persist-before-broadcast, client message idempotency keys, frontend socket client send/receive, REST fallback/recovery, focused tests, and manual two-client browser smoke. Chat realtime is mounted in the existing account `Tin nhắn` tab at `/user?tab=messages`; the old standalone `/chat` page/route has been removed.

Description: Move buyer-to-shop chat from manual refresh to authenticated Socket.IO rooms while keeping `ChatMessage` persistence in PostgreSQL.

Acceptance criteria:
- [x] Authenticated users join only chat rooms they can access.
- [x] Sending a message persists to PostgreSQL before broadcasting.
- [x] Client acknowledgements confirm transport receipt only; PostgreSQL persistence and REST history remain authoritative.
- [x] Message send retries use a client-generated idempotency key or server message ID to prevent duplicates.
- [x] Reconnect flow refetches thread history from REST before resuming realtime.
- [x] Socket.IO uses Redis adapter or documented local fallback so horizontal scaling is supported.
- [x] UI receives new messages without manual reload and recovers missed messages from REST history after reconnect.
- [x] Websocket connection counts, room joins/leaves, reconnects, and send failures are logged/observable.

Verification:
- [x] Backend tests cover room authorization and message persistence-before-broadcast.
- [x] Backend build passes.
- [x] Frontend build passes.
- [x] Manual browser check covers two clients in one buyer/shop thread, account-message-tab delivery, and REST recovery after reload.

Dependencies: RT0, RT1.

Estimated scope: Medium.

### Task RT4: Presence and Session Realtime Layer

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

### Task RT5: Dashboard SSE

Status: Completed on 2026-06-05.

Description: Add SSE invalidations for seller/admin/buyer dashboards so operational counts and queues refresh without heavy polling.

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

### Task RT6: Live Reactions over WebSocket

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

### Task RT7: Live Comments over WebSocket with Moderation
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

### Task RT8: Livestream Transport Decision and Pilot
Status: Completed on 2026-06-06.

Description: Choose and pilot production video delivery without building full custom WebRTC infrastructure initially.

Acceptance criteria:
- [x] Preferred first production strategy is HLS/CDN for scalable video delivery plus WebSocket comments/reactions.
- [x] WebRTC is selected only if ultra-low latency is a hard requirement.
- [x] Target latency, expected concurrent viewers, recording needs, budget, provider, and CDN/origin responsibilities are documented.
- [x] Recording strategy is documented as optional or required for the first pilot.
- [x] Moderation/dispute replay requirements define whether recordings, comment logs, or audit snapshots must be retained.
- [x] Storage provider, retention period, access control, deletion policy, and playback URL lifecycle are documented.
- [x] Live session records store provider session IDs/URLs without moving commerce state out of PostgreSQL.
- [x] Recording metadata can reference external storage, but durable commerce/order/moderation state remains in PostgreSQL.
- [x] Failure/ended/cancelled states are reflected in existing live session status flow.

Verification:
- [x] Provider config documented without committing secrets.
- [x] Backend/frontend build passes after pilot integration.
- [ ] Manual check covers creating a session, opening playback, comments/reactions alongside playback, and ending the session.

Dependencies: Live-commerce MVP, RT6/RT7 for interaction layer, provider choice.

Estimated scope: Large.

### Task RT9: Production Hardening, Load Testing, and Realtime Resilience
Status: Completed on 2026-06-08 for launch-readiness smoke script, resilience checklist, focused realtime tests, and backend/frontend builds. Full production load numbers remain a staging/infrastructure exercise.

Description: Validate realtime behavior under production-like load and failure modes before public launch.

Acceptance criteria:
- [x] WebSocket load testing covers connection count, room fanout, message throughput, reconnect behavior, and unauthorized subscription attempts.
- [x] SSE scale testing covers concurrent connections, heartbeat failures, reconnect rate, and dashboard fallback behavior.
- [x] Redis failover/restart behavior is tested for presence expiry, live counters, pub/sub recovery, and reconnect storms.
- [x] Event burst/backpressure handling is documented for durable and ephemeral events.
- [x] FCM retry/failure simulation covers stale tokens, revoked permission, provider errors, and failed delivery tracking.
- [x] Livestream concurrency testing covers CDN bandwidth, player startup, playback URL lifecycle, and comments/reactions alongside playback.
- [x] Operational dashboards/alerts cover websocket metrics, SSE metrics, Redis memory, rate limits, failed deliveries, queue saturation, and event bursts.
- [x] Graceful degradation behavior is verified for polling/manual refresh fallback, REST recovery, and eventually consistent presence.

Verification:
- [x] Load-test scripts or documented manual equivalents exist.
- [x] Resilience checklist is reviewed before launch.
- [x] Backend/frontend build passes after hardening changes.

Dependencies: RT0-RT8.

Estimated scope: Large.

## Recommended Implementation Order

1. Production observability and alerting.
2. CI quality gates.
3. UAT package and final launch hardening.

## Open Inputs Needed

- Redis deployment target for local/staging/production.
- Firebase FCM service account and frontend web push config.
- Public VAPID key or Firebase messaging configuration strategy.
- Livestream target: low-latency interaction, large broadcast scale, or hybrid.
- Preferred livestream provider/CDN if not self-hosting.
