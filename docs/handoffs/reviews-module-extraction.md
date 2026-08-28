# Reviews Module Extraction

## Objective

Move verified-purchase reviews and review media from `back-end/libs/products` into `back-end/libs/reviews` without changing HTTP/RPC contracts, eligibility rules, MediaModule behavior, or Prisma models.

## Boundaries

- Preserve latest eligible OrderItem and delivered/completed purchase checks.
- Preserve signed Cloudinary upload ownership and five-image limits.
- Keep existing `/products/.../reviews` routes and RPC pattern values.
- Preserve unrelated seed changes.

## Plan

1. Add characterization tests for review eligibility and duplicate updates.
2. Add reviews DTO, mapper, repository, use cases, RPC controller, and Nest module.
3. Wire catalog-service and API Gateway imports.
4. Remove review ownership from `libs/products`.
5. Run focused tests and backend build.

## Completion

Completed on 2026-06-22.

- `libs/reviews` owns review DTOs, mapping, persistence, use cases, focused tests, Nest module, and RPC handlers.
- `catalog-service` loads `ReviewsModule`; API Gateway imports review DTOs from `@reviews` while retaining the shared offer-media signature response from `@products`.
- Existing routes, RPC values, eligible-purchase rules, Cloudinary ownership validation, and Prisma models remain unchanged.
- Focused review tests passed: 4/4.
- Full backend build passed.
