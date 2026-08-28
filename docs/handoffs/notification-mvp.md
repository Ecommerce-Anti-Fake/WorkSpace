# Notification MVP Handoff

Last updated: 2026-07-06

## Status

Task 12 is complete as a PostgreSQL-backed in-app notification MVP. RT2 delivery code/build is implemented: browser FCM token registration/revoke, authenticated notification SSE invalidation, idempotent create-notification RPC, and FCM delivery-attempt tracking. Browser smoke confirmed authenticated `/notifications`, notification REST list, SSE stream, in-app chat notification coverage, and full Firebase Web config in local env. Native FCM token issuance remains blocked by browser permission policy: on 2026-06-08 an isolated browser profile started at `Notification.permission = default`, but native opt-in returned `denied`, so no FCM token was issued or stored.

## Design

- `Notification` belongs to `User` and stores `notificationType`, `title`, `body`, optional `targetType/targetId`, `dedupeKey`, `readAt`, and `createdAt`.
- `dedupeKey` is unique and event creators use upsert for idempotency.
- Current event producers:
  - New buyer/seller chat message creates `CHAT_MESSAGE` notification for the other participant.
  - A newly placed order creates `ORDER_CREATED` notifications for the buyer and each affected shop owner.
  - Cancelling an order creates `ORDER_CANCELLED` notifications for the buyer and affected shop owners, excluding the actor.
  - Seller fulfillment status changes create `ORDER_FULFILLMENT` notification for the buyer.
  - Community post comments/reactions notify the post author; comment replies/likes notify the parent comment author.
- Targets deep-link to `/user?tab=messages&threadId=...` or `/orders/:orderId`.

Future delivery plan:
- In-app notification records remain canonical and idempotent.
- FCM is delivery-only for browser push.
- SSE invalidates unread counts and notification lists for authenticated users.
- Browser permission and FCM token registration must be explicit and revocable.

## 2026-07-06 Order Notification Spec

Objective: users must see durable, idempotent in-app notifications for the order lifecycle events that currently leave a fresh account with an empty notification list.

Acceptance criteria:

- Creating a single-shop or aggregate checkout order creates one `ORDER_CREATED` notification for the buyer and one for every distinct seller owner.
- Cancelling an order creates `ORDER_CANCELLED` notifications for the other affected participants; the actor is not notified about their own action.
- Existing `ORDER_FULFILLMENT` and `CHAT_MESSAGE` notifications remain compatible with `GET /user/notifications`.
- Community notifications use `SOCIAL_POST_COMMENT`, `SOCIAL_POST_REACTION`, `SOCIAL_COMMENT_REPLY`, and `SOCIAL_COMMENT_LIKE`, target the affected post/comment, and never notify the actor about their own action.
- Comment likes are exposed as idempotent `POST /social/comments/:commentId/likes` and `DELETE /social/comments/:commentId/likes` commands.
- Replaying an event cannot create duplicates; dedupe keys include event, order, and recipient.
- Focused notification/order tests and the backend build pass.

Boundaries:

- The REST notification list/read contract is unchanged; no schema migration or dependency is required.
- Promotion notifications are not emitted yet because the repository has no customer promotion/campaign lifecycle to act as a trustworthy event source. Add `PROMOTION` only with that domain feature, rather than exposing an unbounded broadcast command.
- SSE remains an invalidation channel; PostgreSQL notification records remain canonical.

## API

- `GET /user/notifications?filter=unread|readed&page=&pageSize=`; omit `filter` to return all notifications. The response keeps `unreadCount` and the existing pagination shape.
- `POST /user/notifications/:notificationId/read`
- `POST /user/notifications/read-all`
- `POST /user/notifications/fcm-token`
- `POST /user/notifications/fcm-token/revoke`
- `GET /user/notifications/events?accessToken=...`

## Frontend

- Header exposes a notification bell with unread count and refetches on notification SSE invalidations.
- `/notifications` lists notifications, supports mark-one/mark-all read, exposes push enable/revoke controls, and refetches on SSE invalidation.
- Chat notifications open the existing account message tab instead of a separate chat page.

## Verification

- `npm test -- list-notifications.use-case.spec.ts update-order-fulfillment.use-case.spec.ts send-chat-message.use-case.spec.ts` in `back-end`.
- `npm test -- --runTestsByPath libs/users/src/application/use-cases/notification-realtime-delivery.use-case.spec.ts libs/users/src/application/use-cases/list-notifications.use-case.spec.ts libs/common/src/realtime/realtime-event.dispatcher.spec.ts` in `back-end`.
- `npm run build` in `back-end`.
- `npm run build` in `front-end-web`.
- Browser smoke on 2026-06-04: buyer login, `/notifications` render, notification REST list, authenticated SSE stream, unread chat notification, and header/list refresh passed.
- Native FCM smoke on 2026-06-04: service worker and PushManager were available, Firebase Web config and VAPID key were present, but the browser permission state was `denied`, so no FCM token was issued or stored.
- Native FCM smoke rerun on 2026-06-08: isolated browser context reset permission to `default`; buyer login, `/notifications`, REST list, and unread count rendered; clicking `Bat push` called native permission flow but Chrome returned `denied`, so no FCM token was issued or stored.
- 2026-07-06: order create/cancel, fulfillment compatibility, social comment/reply/reaction/comment-like, notification list, and social route tests passed (`10` suites, `33` tests); the added hidden-comment guard passed in its focused suite (`3` tests).
- 2026-07-06: full backend build passed after Prisma merge/generate and all Nest application builds; focused `catalog-service` rebuild also passed after the final comment-like guard.

## Next Recommendation

Best next feature: production observability, CI quality gates, UAT package, and final launch hardening.
