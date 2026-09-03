# Help Center Quality Remediation

Date: 2026-09-03

## Scope

The canonical Help content remains in `Front-End/src/data/helpCenter.ts` and
the canonical documentation/evidence remains under `docs/user-guide/`. The
runtime now separates public and Admin audiences at the route, registry and
URL-helper boundaries.

## Implemented

- Public `/help` exposes Buyer, Seller and QR journeys only.
- Admin Help is rendered inside `AdminLayout` at `/admin/help/*`.
- The existing Admin parent `ProtectedRoute roles=["admin"]` protects direct
  navigation; the Admin sidebar and header both link to `/admin/help`.
- Published visuals carry marker metadata and the UI renders written guidance
  beside each image.
- Canonical Admin links in the user guide, registry, journey map, feature
  matrix and visual manifest use `/admin/help/...`.
- `npm run test:help` validates article text, route registry, asset existence,
  audience filtering and marker consistency.

## Evidence state

`docs/user-guide/HELP_CENTER_QUALITY_AUDIT.md` is the step-level report. It
records 30 articles and 88 steps, 10 accepted Desktop/Mobile visual pairs,
and the remaining fixture/provider or unavailable-route blockers. The
WorkSpace audit baseline was pushed as `834aefb`; the production reconciliation
is recorded in the follow-up documentation commit.

## Verification

Local `test:help` (24/24), lint, build and Help E2E (36 passed, 2 skipped)
pass. The remediation commit `723e550e95a570b5cf4ea2e14fb23eef16a3413d` was
pushed and deployed by GitHub Actions run `90`, which completed successfully
after pulling the exact SHA, building, reloading Nginx and passing the health
check:
`https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33711930697`.

Production DevTools verification passed at Desktop `1440x900` and Mobile
`390x844`: public categories/search/deep links exclude Admin content; all ten
published Help/Admin bindings were rendered and visually inspected; all 20
selected assets loaded with HTTP `200`; and no Help/Admin console errors were
found. Guest, Buyer and Seller were denied `/admin/help`; the approved Admin
session was allowed, including a direct A01 deep link. No general `237/237`
UAT was rerun and no production mutation was performed.

## Next step

Continue the broader documentation backlog only with approved fixtures and
provider sandboxes. The targeted Help Center production goal is complete; the
remaining 70 unaccepted visual steps and unavailable Admin routes retain their
terminal classifications in the evidence matrix.
