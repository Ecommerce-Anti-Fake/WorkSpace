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
  audience filtering, marker consistency and served-to-annotated visual
  integrity.

## Evidence state

`docs/user-guide/HELP_CENTER_QUALITY_AUDIT.md` is the step-level report. It
records 30 articles and 88 steps, 15 published visual bindings backed by 11
accepted Desktop/Mobile visual pairs, and the remaining fixture/provider or
unavailable-route blockers. The WorkSpace documentation follow-up remains
local; no remote publication was requested.

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

## Current local integrity follow-up

The current Front-End branch adds six local visual-reuse bindings, two public
B03 bindings and now records every served image's raw and annotated evidence paths in
`docs/user-guide/VISUAL_MANIFEST.md`. A focused SHA-256 test proves each of
the 22 served files is byte-identical to its annotated evidence copy; it does
not upgrade the broader B03 positive-result or journey UAT status.

Current local verification is `test:help` 28/28, lint pass, build pass and the
full Help/Journey E2E matrix 40 passed with 2 expected skips. The current
Front-End deployment is revision
`65842923f7c3b33a3176653d651ff4c6a53b89e2` from GitHub Actions run `94`:
`https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33734823773`.
A separate read-only Playwright smoke passed 12/12 public Desktop checks. A
targeted browser probe verified the two public B04 reuse aliases and the
B09/shop reuse binding at Desktop `1440x900` and Mobile `390x844`: expected
assets rendered at the required dimensions and exposed marker numbers `1,2,3`.
These aliases are complete through accepted B02 reuse. The deployed B03/open,
B03/enter-code and B09/shop Help bindings also returned their expected
Desktop/Mobile assets at successful image responses, exact target dimensions
and marker numbers `1,2,3`; no QR code or verification code was entered or
submitted, and B09/shop did not perform a purchase, chat or live-session
mutation. The three
Admin aliases only passed a route/image smoke with a test-role harness;
approved real Admin-session visual verification remains pending.

The current environment points at hosted Neon data, so no fixture/reset was
run. Chrome DevTools provided a guest/public production session for the
B03/open and B03/enter-code read-only checks; no credentials, cookies or storage entries were
present. Fixture-backed journeys and provider flows remain unverified, and no
production mutation was performed.

## Goal reconciliation — 2026-09-03

```text
ORIGINAL_MISSING_REQUIRED_VISUALS=70
FINAL_REQUIRED_VISUAL_STEPS=80
FINAL_COMPLETE_VISUAL_STEPS=15
FINAL_REMAINING_VISUAL_STEPS=65
FINAL_BLOCKED_FIXTURE=60
FINAL_BLOCKED_PROVIDER=5
FINAL_NOT_APPLICABLE=8
OVERALL_VISUAL_COVERAGE_STATUS=COMPLETE_WITH_EXTERNAL_VISUAL_DEPENDENCIES
```

The 15 accepted bindings are B01/register, B02/search/detail/choose,
B03/open and enter-code, B04/discover/product-detail/cart, B09/discover/shop,
S07/program and A01/A05/A09 read-only states. B09/shop reuses the accepted B02
product-detail pair; B09/watch remains blocked because the public Desktop room
exposes participant data and approved provider/UAT evidence is unavailable.

## Next step

Provide an isolated UAT target for fixture-backed captures. Until then, the
remaining 65 unaccepted visual steps retain their terminal classifications in
the evidence matrix, and the three Admin reuse aliases remain pending an
approved real Admin session.
