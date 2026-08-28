# Social Module Extraction

## Objective

Move the community social bounded context out of `back-end/libs/products` into `back-end/libs/social` without changing REST routes, RPC message patterns, Prisma models, authorization, quotas, moderation visibility, or payloads.

## Boundaries

- Keep `/products/social/posts` routes and existing `PRODUCTS_MESSAGE_PATTERNS` values.
- Keep PostgreSQL as canonical storage and make no Prisma schema changes.
- Do not change frontend behavior.
- Preserve existing chat extraction and unrelated seed changes.

## Plan

1. Add social DTO, mapper, repository, use cases, RPC controller, and Nest module.
2. Move existing focused tests to the new bounded context.
3. Wire catalog-service and API Gateway imports.
4. Remove social ownership from `libs/products`.
5. Run focused tests and full backend build.

## Success Criteria

- `libs/products` contains no social application, mapping, persistence, or RPC implementation.
- Existing social contracts remain compatible.
- Focused social tests and backend build pass.

## Completion

Completed on 2026-06-22.

- `libs/social` owns community DTOs, mapping, persistence, use cases, tests, Nest module, and RPC handlers.
- `catalog-service` loads `SocialModule`; API Gateway imports social DTOs from `@social`.
- Existing `/products/social/posts` routes and `products.*social*` RPC values remain unchanged.
- Focused social tests passed: 12/12.
- Full backend build passed.
