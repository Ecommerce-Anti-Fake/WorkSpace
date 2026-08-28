# Live Commerce Module Extraction

## Objective

Move live sessions, reminders, and durable live comments from `back-end/libs/products` into `back-end/libs/live-commerce` without changing HTTP routes, RPC values, realtime behavior, Prisma models, moderation, or payloads.

## Boundaries

- Keep `/products/live/*` and existing `PRODUCTS_MESSAGE_PATTERNS` values.
- Keep PostgreSQL as durable truth and preserve Socket.IO/Redis realtime behavior.
- Make no frontend or Prisma schema changes.
- Preserve unrelated seed changes.

## Plan

1. Add live-commerce DTO, mapper, repository, use cases, RPC controller, and module.
2. Move focused session/comment tests.
3. Wire catalog-service and API Gateway DTO imports.
4. Remove live-commerce ownership from `libs/products`.
5. Verify focused tests and backend build.

## Completion

Completed on 2026-06-22.

- `libs/live-commerce` owns live session/comment DTOs, mapping, persistence, use cases, tests, Nest module, and RPC handlers.
- `catalog-service` loads `LiveCommerceModule`; API Gateway imports live DTOs from `@live-commerce`.
- Existing `/products/live/*` routes, RPC values, Socket.IO/Redis behavior, and Prisma models remain unchanged.
- Focused live tests passed: 12/12.
- Full backend build passed.
