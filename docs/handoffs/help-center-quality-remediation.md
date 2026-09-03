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
and the remaining fixture/provider or unavailable-route blockers. Historical
production evidence is not reused as verification for this un-deployed
change.

## Verification

Local `test:help`, lint, build and Help E2E pass. Browser checks cover
`1440x900` and `390x844`, public Admin-content exclusion, and Guest/Buyer/
Seller/Affiliate/Admin access. Production push, deployment, deployed-SHA
verification and post-deploy regression remain outstanding.

## Next step

Deploy the Front-End change through the approved pipeline, verify the deployed
SHA, then rerun public and Admin Help at both target viewports with an approved
Admin session and no production mutations.
