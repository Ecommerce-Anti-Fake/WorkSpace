# Cache and Redis key map

## Current source-backed namespaces

All keys are built as `<keyPrefix>:<namespace>:<encoded parts>`; the default
prefix is `acf`.

| Purpose | Namespace / key shape | TTL | Implementation |
| --- | --- | ---: | --- |
| Socket.IO cross-instance adapter | `rt:socket-io` | connection-managed | Redis adapter, optional |
| Realtime pub/sub | `rt:pubsub` | connection-managed | Redis transport |
| Presence session | `rt:presence:user:<userId>:session:<sessionId>` | 45 s | heartbeat service |
| Typing indicator | `rt:presence:typing:<scope>:<userId>` | 8 s | presence service |
| Reaction rate limit | `rt:rate-limit:reaction:<liveSessionId>:user:<userId>` | 10 s | reaction service |
| Live viewer presence | `rt:live-counter:live:<liveSessionId>:viewer:<userId>:<sessionId>` | 300 s | presence service |
| Live reaction counters | `rt:live-counter:reaction:<liveSessionId>:<type>` | 300 s | reaction service |
| Generic cache namespace | `rt:cache` | 300 s default | reserved; no general HTTP cache found |

The source also reserves `rt:session`; no current general API cache consumer was
identified in the static scan. Redis can be disabled or unavailable; presence
and reaction services then use local in-process state, which is not a shared
multi-instance cache.

## Invalidation and safety

Realtime keys expire naturally. Product/shop/order/catalog API cache invalidation
is not currently defined because those endpoints do not use a general cache
layer. Do not add a cache as a substitute for query/index analysis. Any future
API cache must document owner, read/write scope, TTL, invalidation event, stale
behavior, and multi-instance failure behavior before rollout.

