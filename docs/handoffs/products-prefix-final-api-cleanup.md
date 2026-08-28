# Products Prefix Final API Cleanup

## Scope

Removed the remaining public REST `/products` prefix from api-gateway catalog-adjacent controllers after `ProductModel` removal and module extraction.

## Canonical routes

- Chat:
  - `GET /chat/threads`
  - `GET /chat/threads/:threadId`
  - `POST /chat/threads/:threadId/messages`
  - `POST /shops/:shopId/chat-thread`
- Social:
  - `GET /social/posts`
  - `POST /social/posts`
  - `POST /social/posts/:postId/comments`
  - `POST|DELETE /social/posts/:postId/reactions`
  - `POST /social/posts/:postId/shares`
  - `PATCH /social/posts/:postId/visibility`
- Live commerce:
  - `GET|POST /live/sessions`
  - `GET /live/sessions/:sessionId/comments`
  - `POST /live/sessions/:sessionId/comments`
  - `PATCH /live/sessions/:sessionId/comments/:commentId/visibility`
  - `DELETE /live/sessions/:sessionId/comments/:commentId`
  - `GET /live/sessions/:sessionId/reactions`
  - `PATCH /live/sessions/:sessionId/status`
  - `POST /live/sessions/:sessionId/reminders`

## Implementation notes

- `ChatController`, `SocialController`, and `LiveController` now use root controller prefix and method-level canonical paths.
- Frontend API callers were updated to the canonical routes.
- UI routes and links such as `/products` and `/products/:offerId` remain as frontend navigation, not backend API paths.
- Realtime chat recovery metadata now points to `GET /chat/threads/:threadId`.
- Jest `moduleNameMapper` now includes `@chat`, `@social`, and `@live-commerce`, matching `tsconfig` aliases.

## Verification

- `npm test -- apps/api-gateway/src/modules/chat/chat.controller.spec.ts apps/api-gateway/src/modules/social/social.controller.spec.ts apps/api-gateway/src/modules/live/live.controller.spec.ts`
- `npm run build` in `back-end`
- `npm run build` in `front-end-web`
- Scan confirms no backend TypeScript `@Controller('products')` or `/products` strings remain.
