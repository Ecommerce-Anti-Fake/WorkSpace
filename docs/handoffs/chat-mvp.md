# Chat MVP Handoff

Last updated: 2026-07-08

## Status

Task 4 is complete as a PostgreSQL-backed buyer/shop/admin chat MVP.

On 2026-06-22, chat backend ownership was extracted from `libs/products` into the dedicated `libs/chat` bounded-context module. Public REST routes, RPC message pattern values, Prisma models, realtime behavior, and payload contracts remain unchanged.

RT3 buyer/seller chat realtime is implemented: API Gateway attaches Socket.IO, authenticates access tokens, authorizes `chat:join` through the existing products RPC, persists `ChatMessage` before `chat:message.created` broadcast, and uses Redis adapter when configured with local in-process fallback. Manual two-client browser smoke passed on 2026-06-04.

On 2026-07-06, `chat:message.created` was tightened to include the created message at top-level as `message` in addition to the existing `thread`, `threadId`, `eventName`, and `clientMessageId` fields. This keeps existing `thread` consumers working while letting realtime clients append the new message without waiting for a REST refetch.

Also on 2026-07-06, chat messages gained optional attachments for image/file messages. The model stays lean: `ChatMessage.body` is nullable and `ChatMessageAttachment` stores only `messageId`, `type`, `url`, `fileName`, `mimeType`, and `sizeBytes`. REST and Socket.IO accept up to 10 `attachments` metadata entries together with optional `body`; each entry is capped at 50 MB, and binary upload still happens outside Socket.IO.

Chat thread list/detail responses now include nullable `chatUserAvatar`: buyers receive the shop avatar, while sellers receive the buyer user avatar.

On 2026-07-08, shop owners gained a dedicated `POST /users/:userId/chat-thread` entry point. It resolves the requester's shop from JWT ownership, reuses the existing `shopId + buyerUserId` thread, and rejects self-chat or requesters without a shop. The existing buyer `POST /shops/:shopId/chat-thread` flow is unchanged.

Also on 2026-07-08, admins gained participant-scoped chat. `POST /shops/:shopId/chat-thread` creates/reuses an admin-to-shop thread, while `POST /users/:userId/chat-thread` creates/reuses a direct admin-to-user thread with nullable `shopId` and an internal unique participant key. `GET /chat/threads`, thread detail, message sending, and realtime join now authorize admins exactly like other users: the admin must be a participant; there is no global admin chat override.

## Design

- Chat is 1:1 between a buyer user and a seller shop.
- Direct admin-to-user chat is 1:1 and has no shop association.
- `ChatThread` is keyed by `buyerUserId + shopId`.
- `ChatThread.offerId` was removed to avoid product-scoped conversations.
- Product detail and order detail only open the relevant shop thread.
- `ChatMessage` persists ordered messages with optional text body, optional attachment metadata, and optional `clientMessageId`; `threadId + clientMessageId` is unique for retry dedupe.
- The frontend creates one `clientMessageId` per message attempt and reuses it across WebSocket, REST fallback, and user retry until the send succeeds.
- Every role can list/read/send only in threads where its user ID is a participant.

## API

- `GET /products/chat/threads`
- `GET /products/chat/threads/:threadId`
- `POST /shops/:shopId/chat-thread`
- `POST /users/:userId/chat-thread`
- `POST /products/chat/threads/:threadId/messages`
- Socket.IO events:
  - `chat:join` with `{ threadId }`
  - `chat:send` with `{ threadId, body?, clientMessageId, attachments? }`
  - `chat:message.created` broadcast after PostgreSQL persistence with `{ eventName, threadId, thread, message, clientMessageId }`; `message.attachments` is always an array
  - `presence:heartbeat`
  - `presence:update`
  - `chat:typing`

## Frontend

- `/user?tab=messages` is the canonical buyer/seller chat surface inside the existing account message tab; the old standalone `/chat` page/route has been removed.
- The account message tab lists threads, selected thread messages, online state, and ephemeral typing indicators.
- The account message tab connects to Socket.IO when authenticated, sends through realtime when connected, falls back to REST when disconnected, and refetches REST history after reconnect or incoming events.
- Header chat action points to `/user?tab=messages`.
- Offer detail and buyer order detail expose `Chat voi shop`.
- Seller shop order detail exposes `Mo inbox chat`.

## Verification

- `npm test -- --runTestsByPath apps/api-gateway/src/modules/products/chat-realtime.service.spec.ts libs/products/src/application/use-cases/send-chat-message.use-case.spec.ts libs/products/src/application/use-cases/start-chat-thread.use-case.spec.ts` in `back-end`.
- `npm test -- --runTestsByPath libs/common/src/realtime/realtime-presence.service.spec.ts apps/api-gateway/src/modules/products/chat-realtime.service.spec.ts` in `back-end`.
- `npm run build` in `back-end`.
- `npm run build` in `front-end-web`.
- Manual browser smoke on 2026-06-04: buyer and seller opened the same thread under `/user?tab=messages&threadId=...`; both showed `Realtime` and `Dang online`; seller sent `typing layout smoke`; buyer received it without reload in the account message tab.

## Next Recommendation

Best next feature: Task RT5 dashboard SSE.
