# Affiliate Dashboard Redesign

Status: implemented and locally verified on 2026-07-23.

## Objective

Redesign `/seller/affiliate` and `/affiliate` from marketing-style pages into
compact operational dashboards consistent with Seller Dashboard, Products,
Orders, Wallet, and the current AntiFake visual language.

Success requires:

- preserving `/affiliate`, `/affiliate?tab=member`, and `/seller/affiliate`;
- compact headers, consistent cards/forms/tables, and no large gradient hero;
- desktop, 1366px laptop, tablet, and mobile layouts without page overflow;
- section-level loading, empty, error, and retry states;
- authoritative backend aggregates for seller financial KPIs;
- read-only automatic commission settlement history;
- accessible create/edit modal behavior.

## Locked Product Decisions

- New programs remain shop-funded, two-tier, `AUTOMATIC`, and limited to
  `SHOP` or `OFFER`. Legacy `BRAND` programs remain readable.
- Tier 1 is the code owner; the direct parent is Tier 2. Deeper network levels
  are visible but unpaid.
- `/affiliate` remains public program discovery and `?tab=member` remains the
  authenticated user dashboard.
- Before a program has any member or conversion, every seller-editable field
  may change. Afterwards, scope, offer, rates, and attribution window are
  locked; only name, schedule, and `ACTIVE`/`PAUSED`/`CLOSED` status may change.
- `CLOSED` is terminal. Programs are not deleted.
- Seller KPIs are all-time in v1. No client-side commission recomputation.

## Public Interface Changes

Additive backend contracts:

- `GET /api/affiliate/seller/summary?programId=`
- `GET /api/affiliate/seller/programs?page=&pageSize=&status=&search=`
- `GET /api/affiliate/seller/programs/:programId/commissions`
- `PATCH /api/affiliate/programs/:programId`

Seller program rows expose member/conversion counts and
`configurationLocked`. User affiliate accounts receive an additive nested
program summary needed by the joined-program view. Existing endpoints and
routes remain compatible.

Money aggregation stays on `Prisma.Decimal`; new money response fields are
serialized as decimal strings and formatted only for display in the frontend.

## Project Structure and Style

- Backend: NestJS/Prisma in `back-end/libs/affiliate` and API Gateway affiliate
  module.
- Frontend: React/Vite in `anti-fake-front-end`.
- Shared Affiliate presentation components live under
  `src/components/affiliate`; request orchestration remains page-local because
  seller and member resources have different ownership and refresh rules.
- Plain CSS remains the styling mechanism. No dependency is added.
- Use semantic HTML, native buttons/inputs, accessible dialogs, and project
  spacing/radius conventions.

## Testing Strategy and Commands

Backend:

```text
npm test -- affiliate --runInBand
npm run build:api-gateway
npm run build:affiliate-service
```

Frontend:

```text
npm run build
npx eslint <touched affiliate files>
```

Browser verification covers 1440, 1366, 1024, 768, 390, and 320px; logged-out
discovery, logged-in member dashboard, verified seller, modal keyboard flow,
console, and network requests are checked.

## Boundaries

Always:

- derive requester identity from auth and validate shop/program ownership;
- keep financial history and old conversions immutable;
- paginate seller lists and reconciliation;
- show truthful partial UI when an optional section fails.

Do not:

- change database schema, commission base, wallet ledger, refund/dispute logic,
  worker scheduling, or automatic payout semantics;
- expose manual payout actions for automatic programs;
- add packages or silently fabricate missing KPI data;
- broaden work into the missing Seller Statistics route.

## Implemented Result

Backend additions:

- seller program search/status pagination with member and conversion counts;
- all-time seller KPI aggregation with `Prisma.Decimal` values serialized as
  strings and restricted to Tier 1/Tier 2 beneficiary ledger rows;
- seller-owned commission reconciliation pagination;
- safe program edits with owner authorization, terminal `CLOSED` handling,
  status-transition validation, offer ownership validation, and commercial
  field locking after the first member or conversion;
- additive joined-program metadata on `GET /affiliate/accounts/mine`.

Frontend additions:

- compact Affiliate Center and Shop Affiliate headers, KPI cards, filters,
  responsive tables, and section-level loading/error/empty/retry states;
- shared page header, KPI, status, pagination, state, and accessible modal
  primitives without a new dependency;
- public discovery and `/affiliate?tab=member` preserved;
- joined-program overview, product/shop link destination, code creation, and
  commission history;
- seller program list, create/edit modal, member network, and read-only
  reconciliation. A `CLOSED` program is view-only.

The former shared landing-page stylesheet was removed and replaced by scoped
dashboard styles. No database schema, wallet, settlement, refund, dispute, or
route change was made.

## Verification on 2026-07-23

- Backend: 6 focused suites / 11 tests passed.
- Backend type-check: API Gateway and Affiliate Service passed independently.
- Frontend: production build passed.
- Frontend: focused ESLint passed for both pages, shared Affiliate components,
  and the Affiliate API service.
- `git diff --check` passed in both nested repositories.
- Browser QA passed at 1366x768 and 390x844 for public error/login states,
  seller populated dashboard, responsive tables, and the create modal. Seller
  data was mocked at the browser network boundary because the local backend
  stack was not running. No console warning or error was present.

## Remaining Runtime Proof

- Restart/deploy API Gateway and Affiliate Service with this revision.
- Smoke seller list/summary/edit/reconciliation and joined-program metadata
  against a real database.
- Verify create/edit locking with a real concurrent join/conversion.
- Smoke code creation and copy a real product/shop attribution link through
  checkout. Static build and mocked browser data do not prove live RPC,
  persistence, wallet, or settlement behavior.
