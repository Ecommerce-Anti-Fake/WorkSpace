# Chat Module Extraction

## Objective

Move the buyer-to-shop chat bounded context out of `back-end/libs/products` into `back-end/libs/chat` without changing HTTP routes, RPC message patterns, persistence schema, authorization, idempotency, notifications, or realtime behavior.

## Boundaries

- Keep `PRODUCTS_MESSAGE_PATTERNS` values unchanged for backward compatibility.
- Keep Prisma `ChatThread` and `ChatMessage` models unchanged.
- Keep API Gateway REST routes under `/products` unchanged.
- Do not change frontend code or chat payload shapes.
- Preserve unrelated dirty worktree changes.

## Plan

1. Add the chat DTO, mapper, repository, use cases, module, and RPC controller under `libs/chat`.
2. Move focused chat tests and prove existing behavior against the new module.
3. Wire `ChatModule` into `catalog-service` and point gateway DTO imports at `@chat`.
4. Remove chat ownership from `libs/products` and verify focused tests plus backend build.

## Success Criteria

- `libs/products` contains no chat use cases, DTOs, mapper code, repository methods, or RPC handlers.
- Chat REST routes and RPC patterns remain compatible.
- Focused chat tests pass.
- Backend build succeeds.

## Completion

Completed on 2026-06-22.

- `libs/chat` now owns chat DTOs, mapping, persistence, use cases, tests, Nest module, and RPC handlers.
- `catalog-service` loads `ChatModule`; API Gateway imports chat DTOs from `@chat`.
- Existing `/products/...` REST routes and `products.*chat*` RPC pattern values remain unchanged.
- The missing full-thread response mapper was restored in the new chat mapper.
- Focused chat tests passed: 8/8.
- Full backend build passed.

## Verification

```bash
npm test -- --runTestsByPath libs/chat/src/application/use-cases/send-chat-message.use-case.spec.ts libs/chat/src/application/use-cases/start-chat-thread.use-case.spec.ts --runInBand
npm run build
```
