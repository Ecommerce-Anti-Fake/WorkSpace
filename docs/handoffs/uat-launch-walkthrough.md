# UAT Launch Walkthrough

## Status

Current reconciled production UAT is recorded against Front-End `8157ffa`:
246 discovered, 237/237 applicable passed, 0 failed, 3 not applicable audit/
source records and 6 unsafe hosted local-only executions across
Desktop/Laptop/Mobile. The first sandbox attempt was denied network access; the
approved browser run passed. Provider-dependent mutation walkthroughs and
product-owner signoff remain pending.
Backend test/build/Prisma validation passed, while the separate check-only
backend lint audit remains open under `AF-TECH-002`.
Fresh read-only health verification returned HTTP 200 for the production site
and API health endpoint; the origin served `index-CxegpUGG.js` and
`index-DxaeItKP.css`.

## Scope

Use this as the final acceptance package for the current responsive-web launch scope. Native mobile, non-GHN carrier integrations, VNPay/MoMo, OpenSearch, external payout settlement, and production load numbers remain outside this acceptance pass unless the product owner explicitly reopens them.

## Preflight

- Backend test/build and frontend quality gates are green; backend check-only
  lint remains open under `AF-TECH-002`:
  - `cd back-end && npm run ci:quality`
  - `cd front-end-web && npm run ci:quality`
- API health responds:
  - `cd back-end && DEPLOY_SMOKE_BASE_URL=<api-base-url> npm run smoke:deploy`
- Realtime smoke is run when chat/notification/live behavior is in launch scope:
  - `cd front-end-web && RT_API_BASE_URL=<api-base-url>/api RT_SOCKET_BASE_URL=<socket-base-url> npm run smoke:realtime-load`
- Production-like environment variables are configured without exposing secrets in logs:
  - `DATABASE_URL`
  - `JWT_*`
  - `PAYOS_*`
  - `GHN_*`
  - `REDIS_URL` when Redis is enabled
  - Firebase Web/Admin values when auth or push is enabled
  - `CORS_ALLOWED_ORIGINS`, `FRONTEND_URL`, and rate-limit overrides as needed

## Test Accounts

Prepare or seed these roles before walkthrough:

| Role | Required state |
| --- | --- |
| Buyer | Can log in, browse, cart, checkout, pay/retry, report, review, chat, and view notifications. |
| Seller/shop owner | Has a verified or reviewable shop, offers, media, inventory/batches, shipping options, and seller orders. |
| Admin | Can review verification, reports, disputes, moderation cases, risk, inventory audit, and finance reconciliation. |
| L1 distributor | Can sell wholesale and expose provenance/batch lineage. |
| L2/L3 distributor | Can receive wholesale stock, draft resale offers, and sell downstream inventory. |
| Affiliate owner/member | Can create/join program, create codes, view conversions, and run payout controls. |

## Acceptance Walkthrough

### Buyer Retail

- Browse home, catalog filters, product search, offer detail, media, documents, reviews, provenance, and favorite state.
- Add retail offer to cart, edit quantity, proceed to checkout, select shipping option/GHN address, and create order.
- Complete payOS happy path or validate COD path if configured.
- For failed payOS order, trigger retry payment and confirm a new checkout URL is produced.
- Open order detail and verify payment audit, fulfillment timeline, lineage/provenance, dispute/report/review entry points, chat entry, and notification updates.

### Seller

- Create or open shop profile and verify shop/legal/category/brand document flows.
- Create/update/hide/show offer, upload offer media/documents, set primary media, and link inventory batch.
- Configure offer-level shipping options and validate GHN quote/booking/tracking sync where credentials are available.
- Process seller order fulfillment states and confirm buyer/admin timelines update.
- Open fulfillment audit and inventory audit deep links from seller surfaces.

### Admin / Moderation

- Review KYC/KYB/shop/category/brand documents.
- Open buyer reports and disputes; update status and confirm audit/moderation case linkage.
- Recalculate risk for shop, offer, and batch targets; confirm high/critical cases are created or updated.
- Inspect inventory audit, lineage context, finance reconciliation, escrow lifecycle, affiliate payout controls, and moderation queue.

### Distribution / Provenance

- Create or use L1 wholesale offer with supply batch and provenance documents.
- Complete L1 to L2 wholesale order, receive inventory, and create downstream resale offer.
- Complete L2 to L3 resale path and verify stock validation blocks oversell.
- Confirm buyer, seller, and admin can open compact lineage views showing multi-hop order-item provenance.

### Affiliate

- Create affiliate program, join as eligible member, create affiliate code, and simulate conversion attribution.
- Approve/reject conversion, create payout, update payout status, and verify ledger/audit visibility.
- Confirm fraud controls block self-owner joins and circular referral paths.

### Social / Live / Realtime

- Open Social Hub/feed, create post/comment, report/moderate content, and confirm limits/labels behave as expected.
- Create scheduled/active live session, attach offers, render buyer live view, send live comments/reactions, and end/cancel session without deleting durable commerce state.
- Validate chat realtime in `/user?tab=messages`: send/receive with two sessions, presence, typing, REST recovery after refresh.
- Validate notifications via REST/SSE; test FCM opt-in only in a browser/profile where native permission can be granted.

### Account Security

- Register/login with existing JWT flow and Firebase bridge where configured.
- Run forgot/reset/change-password flows and confirm reset/change revokes refresh sessions.
- Confirm auth rate limiting returns 429 under configured test threshold.

## Evidence Pack

Capture this evidence for launch signoff:

- Environment URLs, commit SHAs, migration version, and seed/test account source.
- Quality gate output summaries for backend and frontend.
- API health smoke result and realtime smoke JSON summary.
- Screenshots or short recordings for each acceptance area above.
- List of blockers, severity, owner, and decision: fix before launch, accept for launch, or defer.
- Product owner signoff and launch date/time.

## Execution Evidence: 2026-06-09

Environment:
- Frontend: `https://antifake.io.vn`, canonical redirect target `https://www.antifake.io.vn`.
- API: `https://api.antifake.io.vn/api`.
- Seeded accounts validated: `buyer@example.com`, `manufacturer@example.com`, `distributor@example.com`, `admin@example.com`; password `12345678`.

Preflight passed:
- `cd back-end && npm run ci:quality`: passed; 7 Jest suites / 27 tests passed, then `npm run build:deploy` passed.
- `cd front-end-web && npm run ci:quality`: passed; Vite build completed with the existing chunk-size warning.
- `cd back-end && DEPLOY_SMOKE_BASE_URL=https://api.antifake.io.vn npm run smoke:deploy`: passed; `GET /api/health` returned status `ok` and service `api-gateway`.
- `cd front-end-web && RT_API_BASE_URL=https://api.antifake.io.vn/api RT_SOCKET_BASE_URL=https://api.antifake.io.vn RT_SMOKE_USERNAME=buyer@example.com RT_SMOKE_PASSWORD=12345678 npm run smoke:realtime-load`: passed; login OK, notification SSE HTTP 200 with one chunk, live WebSocket skipped because no live session was active.

Frontend route reachability passed:
- `/`, `/products`, `/wholesale`, `/live`, `/community/feed`, `/auth`, `/verify-qr`, `/cart`, `/orders`, `/user`, `/shops`, `/admin`, `/distribution`, `/affiliate`, and `/notifications` all resolved to HTTP 200 after canonical redirect to `www.antifake.io.vn`.

Read-only deployed API coverage passed:
- Buyer login plus `/user/userprofile`, `/user/notifications`, `/cart`, `/orders/mine`, `/products/favorites`, `/products/chat/threads`, `/orders/reports/mine`.
- Seller/manufacturer login plus `/shops/mine`, `/affiliate/programs/mine`, `/affiliate/accounts/mine`.
- Distributor login plus `/distribution/networks`, `/distribution/my-memberships`, `/distribution/inventory-summary`, `/distribution/batches`, `/affiliate/accounts/mine`.
- Admin login plus `/admin/dashboard`, `/admin/moderation-summary`, `/user/admin/kyc/pending`, `/shops/admin/list-shop`, `/orders/admin/orders`, `/orders/admin/reports`, `/orders/admin/risk-scores`, `/orders/admin/moderation-cases`, `/orders/admin/finance-reconciliation`, `/distribution/admin/inventory-audit`.
- Public/catalog/security surfaces: `/products/offers`, `/products/brands`, `/products/categories`, `/products/social/posts`, `/products/live/sessions`, `/auth/security-decisions`.

Static/frontend smoke hooks passed:
- `npm run smoke:distribution-invitation-ui`
- `npm run smoke:wholesale-purchase-ui`
- `npm run smoke:wholesale-inventory-receive-ui`
- `npm run smoke:resale-draft-ui`

Notes:
- The deployed auth contract uses `username` + `password` for `POST /auth/login`; an initial probe with `email` correctly returned validation error and was not an application blocker.
- A first PowerShell HTTP matrix produced client-side null-reference errors on several GET probes. Re-running with Node `fetch`, the same runtime used by existing smoke scripts, passed.
- No mutating checkout/payment/order/admin actions were executed against deployed demo data from this environment.

## Launch Checklist

- Domain, TLS, CORS, and frontend API base URL point at the intended environment.
- Database migration strategy is confirmed; backup/restore drill is documented before public launch.
- Logs are collected from stdout/stderr into the deployment platform or chosen observability sink.
- Alert routing is configured for API health, elevated 5xx, auth/payment webhook failures, queue/realtime failures, and database capacity.
- Edge/WAF or Redis-backed rate limiting is planned before multi-instance public production.
- Branch protection marks backend and frontend quality gates as required checks.
- Rollback owner, rollback command/runbook, and data rollback constraints are known before launch.

## Known Limitations

- Current launch target is responsive web/mobile browser, not native mobile app.
- GHN is the only real carrier integration currently documented for quote/booking/tracking refresh.
- payOS/COD are the payment paths; VNPay/MoMo and bank transfer reconciliation are deferred.
- FCM native browser token issuance depends on browser permission state; backend token register/revoke and failed-attempt handling are covered by tests.
- Full production load numbers require staging/production infrastructure and are not proven by local smoke scripts.
- External seller payout settlement remains pending; admin finance reconciliation exposes liabilities and audit context but does not settle funds externally.

## Exit Criteria

- All critical and high UAT blockers are fixed or explicitly accepted by the product owner.
- Backend/frontend CI gates pass on the launch branches.
- Health and realtime smoke pass on the target environment.
- Product owner signs the evidence pack.
- Launch/rollback owners confirm the launch window and communication path.

## Recommended Next Step

Run the interactive product-owner browser walkthrough on the deployed demo, capture screenshots/signoff, and fix only newly found critical/high launch blockers.

## Documentation workstream handoff — 2026-08-24

- Canonical documentation foundation: `docs/user-guide/`.
- Source/evidence traceability audit: `docs/user-guide/SOURCE_AUDIT.md`.
- Frontend Help Center/Journey Center route: `/help`.
- Help registry now covers canonical B01-B09, S01-S09 and A01-A10 IDs;
  focused Help/Journey E2E passed 9 with 3 intentional skips, and source
  reference/journey-ID tests passed 5/5.
- Seller Dashboard now has a backend-state-derived Getting Started checklist;
  local state tests/build pass, but seller runtime evidence and visuals remain
  pending.
- Local evidence: build, targeted lint, Help/Journey tests and combined public/
  permission/responsive regression passed; credential-dependent skips remain
  intentional.
- Production deployment and production visual evidence are pending. Do not
  mark the new articles `VERIFIED` in production from local evidence alone.
- Open product blockers remain canonical in `docs/UAT_ISSUES.md`, especially
  checkout quote (`AF-B-003`), QR execution (`AF-Q-001`) and suspended Admin
  identity.
- Latest concurrent no-credential regression had one non-reproducible Desktop
  `/register` blank-body failure; the isolated case passed. Keep the existing
  assertion and monitor for recurrence.
- A later combined rerun timed out at 124 seconds; isolated Desktop
  guest/permission/responsive, Laptop/Mobile permission and Laptop/Mobile
  responsive checks passed with only the documented credential skips.
- Documentation integrity tests now pass 9/9, including concrete Visual
  Manifest assets and the Feature/Journey/UAT/Desktop/Mobile bridge. A
  read-only production `/help` probe could not connect from
this environment; do not infer deployment status from local evidence.

Checkout quote source follow-up 2026-08-24: backend `revalidateSelectedItems`
re-fetches the current offer and exact variant, rejecting missing/inactive/
hidden variants before shipping resolution. The focused checkout use-case
suite passed 5/5 with a stale-variant quote regression assertion; backend
commit `014fa3f`. This is source/test evidence for AF-B-003, not production
reproduction or a claim that the cart fixture was stale.

QR source audit follow-up 2026-08-24: `VerificationLabel` and
`ProvenanceEvent` are present in schema/seed data, but no verification
use-case/RPC/gateway/frontend execution path was found. Help source references
now record those boundaries; the B03 article remains `NOT_IMPLEMENTED`.
Frontend commit `ab1b240` passed documentation integrity, targeted ESLint and
build.

Post-commit Help/Journey browser verification for `ab1b240` passed 9 tests with
3 intentional mobile-only skips across Desktop, Laptop and Mobile. This is
local regression evidence only; production deployment and retest remain
pending.

Canonical-guide consistency follow-up 2026-08-24: the retained legacy UAT
draft now points to the canonical master guide and is explicitly non-canonical.
Documentation integrity passed 10/10 with the pointer guard; frontend test
commit `7a6c2da`.

Journey bridge follow-up 2026-08-24: the documentation test now verifies all
28 canonical journey rows and their UAT IDs against `docs/UAT_TEST_MATRIX.md`;
11/11 passed. Frontend test commit `560eb52`.

Documentation registry follow-up 2026-08-24: the registry now lists all 28
canonical B01-B09/S01-S09/A01-A10 rows with evidence and visual statuses.
Integrity passed 12/12 with the registry coverage guard; frontend test commit
`c2bc14c`.

Registry synchronization follow-up 2026-08-24: every canonical registry route
and evidence status now matches the frontend Help metadata; integrity passed
13/13. Frontend test commit `9082b3e`.

Visual manifest follow-up 2026-08-24: `docs/user-guide/VISUAL_MANIFEST.md` now
lists one explicit row for all 28 canonical journeys. Buyer and seller rows
remain pending approved captures, B03 is UAT-only while AF-Q-001 is open, and
all Admin rows remain blocked by the suspended identity. Documentation
integrity passed 14/14 with the manifest coverage guard; frontend test commit
`115c4f0`. Annotated final assets and production visual verification remain
pending.

Visual route traceability follow-up 2026-08-24: every canonical manifest row
now includes its stable Help/Journey route, with a test comparing the routes to
frontend Help metadata. Documentation integrity passed 15/15; frontend test
commit `5fdebd9`. This does not upgrade any visual, UAT or production status.

Current-revision local regression follow-up 2026-08-24: frontend build passed;
the focused Help/Journey Playwright suite passed 9 with 3 intentional
mobile-only skips across Desktop, Laptop and Mobile; documentation integrity
passed 15/15. The existing large-chunk build warning remains. Production deploy,
visual capture and retest are still pending.

Checkout local regression follow-up 2026-08-24: frontend quote regression passed
6/6 across Desktop, Laptop and Mobile for rejected and successful quote paths;
backend checkout use-case tests passed 5/5, including stale-variant rejection.
AF-B-003 remains open pending deployment and authenticated production retest.

Frontend quality-gate follow-up 2026-08-24: full `npm.cmd run lint` reports 58
errors and 5 warnings in unrelated existing frontend files. Changed-test lint,
build, Help/Journey E2E and checkout regressions pass. Track this as open
`AF-TECH-001`; full lint and release sign-off remain blocked.

Lint remediation follow-up 2026-08-24: frontend commit `a143f64` replaced seven
unsafe `any` usages in `src/services/order.api.ts`; targeted ESLint, TypeScript
and build passed. Full lint is down to 56 diagnostics but remains open under
`AF-TECH-001`.

Product-detail lint follow-up 2026-08-24: frontend commit `7f3b4c5` removed the
product-detail type/empty-catch findings; targeted ESLint, TypeScript, build and
catalog regression passed. Full lint is down to 49 diagnostics; `AF-TECH-001`
remains open.

Checkout-address lint follow-up 2026-08-24: frontend commit `1df240c` removed
the address effect dependency/state warnings; targeted checks, build and
checkout regression passed 6/6 across all viewports. Full lint is down to 47
diagnostics; `AF-TECH-001` remains open.

Address-form lint follow-up 2026-08-24: frontend commit `0316a22` removed the
address form/ward state-effect findings; targeted checks, build and Buy Now
checkout regression passed 6/6 across all viewports. Full lint is down to 45
diagnostics; `AF-TECH-001` remains open.

Address-selector lint follow-up 2026-08-24: frontend commit `8c7545d` removed
the modal address-fetch state-effect finding; targeted checks, build and Buy Now
checkout regression passed 6/6 across all viewports. Full lint is down to 44
diagnostics; `AF-TECH-001` remains open.

Create-address lint follow-up 2026-08-25: frontend commit `fdc3628` removed the
create-address ward state-effect finding; targeted checks, build and Buy Now
checkout regression passed 6/6 after starting the configured local preview
server. Full lint is down to 43 diagnostics; `AF-TECH-001` remains open.

Seller-revenue lint follow-up 2026-08-25: frontend commit `901f068` removed the
seller chart memo/state-effect findings; targeted ESLint, TypeScript and build
passed. Seller browser regression was skipped because
`UAT_SELLER_EMAIL` and `UAT_TEST_PASSWORD` are unavailable. Full lint is down
to 41 diagnostics (37 errors, 4 warnings); `AF-TECH-001` remains open.

Wallet API lint follow-up 2026-08-25: frontend commit `3c099e5` removed six
wallet response-list `any` findings with typed payloads and unknown-safe
guards. Targeted ESLint, TypeScript and build passed; no wallet-specific
automated test surface exists in the frontend. Full lint is down to 35
diagnostics (31 errors, 4 warnings); `AF-TECH-001` remains open.

Seller product-detail lint follow-up 2026-08-25: frontend commit `261e2e8`
removed four state-effect errors, two dependency warnings, and one constant
condition finding. Targeted ESLint, TypeScript and build passed; seller browser
regression remains skipped because seller credentials are unavailable. Full
lint is down to 29 diagnostics (27 errors, 2 warnings); `AF-TECH-001` remains
open.

Final A05/A09 visual deployment verification 2026-08-27: run `33032228853`
completed successfully for Front-End `7e7a12a`. Help/Journey regression passed
18/18 executed checks with 3 intentional mobile-only skips; both new Admin
visual bindings loaded and all four image URLs returned HTTP 200. No mutation
or provider action was performed.

Seller order-management lint follow-up 2026-08-25: frontend commit `7ed0a3e`
removed three seller order `any` findings and one pagination state-effect
finding. Targeted ESLint, TypeScript and build passed; seller browser
regression remains skipped because seller credentials are unavailable. Full
lint is down to 25 diagnostics (23 errors, 2 warnings); `AF-TECH-001` remains
open.

Profile-response lint follow-up 2026-08-25: frontend commit `9cd4fda` removed
three profile/avatar response `any` findings with unknown-safe record helpers
and typed string extraction. Targeted ESLint, TypeScript and build passed. Full
lint is down to 22 diagnostics (20 errors, 2 warnings); `AF-TECH-001` remains
open.

Comment-sheet lint follow-up 2026-08-25: frontend commit `24b4ecd` removed the
comment sheet reset state-effect finding and two untyped error findings.
Targeted ESLint, TypeScript and build passed. Full lint is down to 19
diagnostics (17 errors, 2 warnings); `AF-TECH-001` remains open.

Payout-modal lint follow-up 2026-08-25: frontend commit `8dc34ed` removed the
payout eligibility purity finding, modal reset state-effect finding, and
dependency warning. Targeted ESLint, TypeScript and build passed. Full lint is
down to 16 diagnostics (15 errors, 1 warning); `AF-TECH-001` remains open.

Community-post lint follow-up 2026-08-25: frontend commit `99a53f7` removed
two community post auth/like-request `any` findings with unknown-safe errors.
Targeted ESLint, TypeScript and build passed. Full lint is down to 14
diagnostics (13 errors, 1 warning); `AF-TECH-001` remains open.

Final response-typing follow-up 2026-08-25: frontend commits `0ef3426`,
`21d509d`, and `c13400f` removed four product/seller/order response `any`
findings. Targeted ESLint, TypeScript and build passed. Full lint is down to
10 diagnostics (9 errors, 1 warning); `AF-TECH-001` remains open.

Final lint closeout 2026-08-25: frontend commits `05dcdd3` and `e236fad`
deferred chat realtime/message-list effect updates, and `7952749` cleared the
remaining ChatLayout, community, search, product, discussion-feed and address
findings. Targeted ESLint, TypeScript, production build/PWA generation and
diff checks passed. Full `npm.cmd run lint` reports 0 errors, 0 warnings, and
0 findings; `AF-TECH-001` is resolved locally. Deployment verification and
production UAT remain separate manual actions.

Current-revision Help/Journey regression follow-up 2026-08-25: documentation
integrity passed 15/15. The focused Help + guest Playwright run passed 39 of 42
tests, with 3 intentional mobile-only skips; the responsive suite passed 21/21.
The frontend preview process was stopped after verification. Full lint remains
0 errors, 0 warnings and 0 findings, and the production build/PWA generation
passed. These are local evidence only; deployment, production visual
verification and authenticated seller/Admin sign-off remain pending.

QR execution follow-up 2026-08-25: the local catalog-service contract now
hashes normalized code/link input server-side and returns public
`VERIFIED`, `SUSPICIOUS`, `INACTIVE` or `NOT_FOUND` states without exposing
label hashes, scope IDs or actor data. Backend focused tests passed 8/8;
frontend mocked QR verification passed 9/9 across Desktop, Laptop and Mobile;
frontend full lint and build passed; backend deploy build passed. Source
commits are `back-end:3b59ab9` and `Front-End:717357c`. The QR image picker
remains explicitly unsupported without a compatible decoder.
At this local-follow-up timestamp, AF-Q-001 was `PARTIAL` locally and not yet
production-verified; the later post-deploy evidence below supersedes the
deployment wording, while positive fixture, image decoding and final QR visuals
remain pending.

Pre-deploy production public verification follow-up 2026-08-25: read-only probes returned
`200` for the documented Help and API health URLs. Elevated-network Playwright
checks for Help/Journey and QR page loading passed 12/12 across Desktop, Laptop
and Mobile, with 3 intentional mobile-only skips. The documented production
`GET /api/verifications?code=UAT-UNKNOWN-20260825` returned `404`, and the
production QR DOM exposed the older generic controls rather than the local
`verification-*` result controls. Treat this as deployment evidence that the
local QR commits are not available through the documented production route; no
production result interaction was attempted because its side effects are not
authorized for an unknown test code.
Read-only console checks for `/help`, the seller process-order step, and `/qr`
recorded zero console warnings/errors, page errors, or 5xx responses.

Post-deploy production verification follow-up 2026-08-25: Front-End deploy run
`32803576920`, Back-End quality run `32803581629` and Back-End deploy run
`32803581635` completed successfully for `Front-End:717357c` and
`back-end:3b59ab9`. Health returned `200` with `status: ok`. The isolated
`UAT-UNKNOWN-20260825` code returned `200` with `NOT_FOUND`; production code and
product-link flows also returned `200 GET` plus `NOT_FOUND` on Desktop, Laptop
and Mobile. The final public Help/Journey + QR suite passed 12/12 executed
checks with 3 intentional mobile-only skips, with no console/page errors or
5xx responses. This verifies the deployed public negative path only; positive
fixture, image decoding, authenticated role UAT and final visual evidence
remain open.

Public documentation visual follow-up 2026-08-25: read-only screenshots were
captured from deployed Front-End revision `717357c` at `1440×900` and
`390×844` for the Help Center overview and Buyer first-purchase Journey Center
shell. Help Center raw production captures are registered in the Visual
Manifest with separate deterministic annotations. Journey shell captures remain evidence of
the current documentation UI only because the selected feature visual still
awaits matching runtime evidence; they are not final Buyer feature assets. The
raw Help Center captures were not overwritten.

Documentation structure follow-up 2026-08-25: the evidence-scoped ebook draft
`docs/user-guide/ANTIFAKE_USER_GUIDE_EBOOK.md` covers B01-B09, S01-S09 and
A01-A10 with explicit statuses and canonical Help links. It remains
`DOCUMENTATION_STATUS = IN_PROGRESS`; the draft does not upgrade UAT or
production claims.

Latest public visual refresh 2026-08-25: after Front-End deploy run
`32805233259` completed successfully for `3b504ba`, the Help Center raw and
annotated screenshots were recaptured at `1440×900` and `390×844`; the Visual
Manifest and ebook point to these current-revision assets.

Current-revision public regression 2026-08-25: the Help/Journey suite passed
9/9 executed checks with 3 intentional mobile-only skips, and the QR page suite
passed 3/3 across Desktop, Laptop and Mobile against Front-End `3b504ba`.
These are public read-only checks; authenticated buyer, seller and Admin flows
remain separately blocked or pending.

Latest QR decoder and deployment follow-up 2026-08-25: Front-End commit
`84a6a15` added client-side PNG/JPEG/WebP QR image decoding with a 5 MB limit,
unreadable-image fallback and a deterministic QR fixture. Local QR coverage
passed 15/15 across Desktop, Laptop and Mobile; full lint, TypeScript and the
production build passed. Deploy run `32806940404` completed successfully.
Production root returned `200`, API health returned `status: ok`, and the
unknown image fixture decoded and returned `200` plus server-owned `NOT_FOUND`
from `/api/verifications?code=UAT-QR-IMAGE-20260825` on all three viewports,
with no page or console errors. The current public Help/Journey plus QR page
regression passed 12/12 executed checks with 3 intentional mobile-only skips.
A known positive production fixture, final QR feature visuals, checkout
quote/order retest and authenticated buyer/seller/
Admin evidence remain open. The production dependency audit still reports 3
high findings in existing `react-router` and `socket.io-parser` ranges.

QR visual evidence follow-up 2026-08-25: after Front-End commit `a0b74c4` and
deploy run `32807912265`, production QR unknown-result captures were taken at
Desktop `1440×900` and Mobile `390×844` with deterministic fixture
`UAT-QR-IMAGE-20260825`. Raw and separate deterministic annotated assets are
registered in `docs/user-guide/VISUAL_MANIFEST.md`; both viewports show the
server-owned `NOT_FOUND` state with no page or console errors. These remain UAT
negative-result evidence only; the known-positive fixture and final feature
visual are still pending.

Help content correction follow-up 2026-08-25: stale QR guidance was corrected
in Front-End commit `a0b74c4` and deployed by run `32807912265`. Production
step deep links `/help/qr/verify-product/enter-code` and
`/help/qr/verify-product/result` now expose the supported image types and the
unreadable-image fallback. The read-only content smoke passed 3/3 across
Desktop, Laptop and Mobile with no page or console errors. B03 remains
`PARTIAL` because positive production fixture and feature visuals remain open.

Dependency security closeout 2026-08-25: Front-End `6b24be3` upgraded React
Router to `7.18.2` and Socket.IO parser to `4.2.7`; the local
production-dependency audit reports 0 vulnerabilities. Deploy run
`32819481662` succeeded. The complete
no-credential production Playwright suite passed 154 tests with 119
intentional credential-dependent skips and 0 failures; direct authorization
passed 15/15. Authenticated buyer, seller and Admin UAT remain open.

Documentation completeness follow-up 2026-08-25: the canonical master guide
now exposes evidence-scoped Quick Guide shortcuts. The ebook now includes
Level A/B/C visual rules, Quick Guide, troubleshooting, FAQ and glossary. This
closes static structure coverage only; `DOCUMENTATION_STATUS` remains
`IN_PROGRESS` and no pending runtime or visual status was upgraded.

QR positive-fixture discovery follow-up 2026-08-25: production public catalog
read-only checks found 16 offers, but offer/detail payloads omit verification
codes. Public batch links exposed batch IDs and metadata; all 24 candidates
derived from the checked-in compact seed formula returned `200` plus
server-owned `NOT_FOUND`. Do not infer a positive code from a product or batch
ID. Positive QR evidence remains `BLOCKED_EXTERNAL` pending an approved
fixture or credentialed UAT identity.

B02 public product-detail visual follow-up 2026-08-25: public offer
`c831f5d5-4b75-46db-95fc-c687f0fe6b2b` rendered at Desktop `1440×900` and
Mobile `390×844` on Front-End `6b24be3`, with zero page/console errors and no
4xx/5xx responses. Raw and deterministic annotated captures are registered in
the Visual Manifest. This verifies the product-detail step only; the complete
B02 discovery journey remains `PARTIAL`.

Visual traceability follow-up 2026-08-25: `docs/user-guide/VISUAL_MANIFEST.md`
now records source page, capture date, deployment revision, test-data scope,
viewport and raw/annotated paths for each accepted Help Center, Journey shell
and B03 UAT asset set. Pending journey rows remain explicitly uncaptured and
non-final; documentation integrity remains 16/16.

B02 public discovery visual follow-up 2026-08-25: after Front-End `6b24be3`,
read-only production browser capture covered the public home, categories,
category-filtered results, `/search?q=seed` and Shop
`7916412b-68c5-4d56-b592-25aa2b77a88f` at Desktop `1440×900` and Mobile
`390×844`. All raw/annotated pairs are registered under `docs/images/buyer/`.
The browser diagnostic reported zero page errors, zero console
errors/warnings and no 4xx/5xx responses. This advances the public B02 subset;
sorting, reviews, provenance and authenticated purchase steps remain `PARTIAL`.

B09 public livestream visual follow-up 2026-08-25: after Front-End `6b24be3`,
read-only `/live` capture passed at Desktop `1440×900` and Mobile `390×844`
with clean page/console/network diagnostics. Raw and deterministic annotated
shell assets are registered in the Visual Manifest. Provider setup, joining,
interaction and leaving remain unverified.

B08 screenshot safety note 2026-08-25: `/community` runtime passed, but the
seeded feed exposed author names and post content. Those attempted captures were
discarded and no B08 visual claim was added; retain the PII-safe-fixture gap.

B01 authentication-entry visual follow-up 2026-08-25: production `/auth` was
captured at Desktop `1440×900` and Mobile `390×844` after Front-End `6b24be3`.
Login and buyer-registration entry modes rendered cleanly after the CSS
entrance transition, with zero page/console errors and no 4xx/5xx responses.
Raw and separate deterministic annotated pairs are registered in the Visual
Manifest. `/register` is the seller Shop-registration boundary and redirected
the guest to `/auth`; it was not treated as buyer registration. B01 remains
`PARTIAL` pending credentialed registration, profile, address and authenticated
completion evidence.

B01 regression/deployment follow-up 2026-08-26: Front-End test commit
`f70696b` added a persistent auth regression for the settled buyer-registration
mode. The pre-wait opacity race was reproduced; the stabilized test passed
Desktop/Mobile 2/2 before and after deployment. Workflow run `32928248842`
completed successfully, and production root plus `/api/health` returned `200`.
The commit is test-only, so the accepted visual assets remain tied to UI
revision `6b24be3`.

Fresh production regression follow-up 2026-08-26: the complete no-credential
Playwright matrix ran across Desktop, Laptop and Mobile with 159 passed, 117
intentional credential/API skips, and 0 failures out of 276 tests. The direct
unauthenticated API authorization matrix passed 15/15 across all three
projects. Public catalog, Help/Journey, auth, QR, permissions, responsive,
live and PWA scopes remained green; known authenticated/provider blockers are
unchanged.

Backend quality follow-up 2026-08-26: backend revision `3b59ab9` passed
`npm.cmd run test:ci` with 7 suites and 25/25 tests, plus
`npm.cmd run build:deploy`. Prisma generation and the API gateway build left
the backend repository clean; authenticated/provider UAT remains separate.

Visual asset audit follow-up 2026-08-26: all 63 PNG assets under `docs/images`
match accepted guide dimensions: 32 Desktop at `1440×900`, 30 Mobile at
`390×844`, and 1 Laptop at `1280×720`. No nonstandard dimensions or missing
concrete Visual Manifest paths were found (48 concrete paths checked).

Journey Center visual-binding follow-up 2026-08-26: Front-End `b9efeed`
renders accepted annotated Desktop/Mobile assets for B01 registration, B02
discovery/product detail and B09 livestream discovery, while steps without
matching evidence retain the placeholder. Local docs integrity, lint, build
and Desktop/Mobile browser checks passed. Deployment run `32931301098`
succeeded; production root/API health returned `200`.

Production Help regression follow-up: three overview checks failed across
Desktop, Laptop and Mobile because a fresh context received stale
`index-BFkaJWzL.js` and logged `No routes matched location "/help"`; 12 direct
Journey/visual/contextual checks passed. A later browser navigation received
`index-CIHZ0t3I.js` and rendered correctly. Track as `AF-DEP-001`,
`BLOCKED_EXTERNAL`, pending CDN/Nginx cache or origin-consistency verification.

Help route-collision fix follow-up 2026-08-26: Front-End `305edb2` moved
Journey Center visuals from `public/help/visuals` to `public/journey-visuals`
and added idempotent deployment cleanup for the old directory. This prevents
the deployed `dist/help/` directory from intercepting the SPA `/help` route
with Nginx `403`; `38ef806` also keeps `/help` on the network navigation path.
Local build confirmed the old directory is absent. Deployment run
`32951825727` succeeded. Fresh production `/help` rendered with no console
errors, the B02 detail visual returned HTTP 200, and the cross-viewport Help
suite passed 15/15 executed checks with three intentional mobile-only skips.
`AF-DEP-001` is resolved for the observed route collision; retain the stale
edge/cache check as a manual follow-up only if the symptom recurs.

Final no-credential production regression follow-up 2026-08-26: the complete
`Front-End/e2e` matrix passed 165/165 executed tests with 117 intentional
credential/API skips and 0 failures out of 282 tests across Desktop, Laptop
and Mobile. The added Journey Center visual assertions passed in every
viewport project. Canonical API health returned `200` with `status: ok`.

Documentation visual-consumption follow-up 2026-08-26: the canonical guide and
ebook now place the accepted annotated Desktop/Mobile pairs beside B01 public
account entry, B02 public discovery/product detail and B09 livestream discovery
evidence. The documents reuse the manifest assets and keep pending Seller,
Admin, checkout, QR-positive and provider steps explicitly non-final.

Documentation integrity guard follow-up 2026-08-26: Front-End `833446a` adds
a deterministic check that both canonical documents reference all accepted
annotated B01, B02 and B09 Desktop/Mobile assets and that the files exist.
Local documentation tests passed 18/18; deployment run `32953905914` succeeded;
post-deploy Help passed 15/15 executed checks with three intentional skips.

Authenticated route harness follow-up 2026-08-26: the initial elevated
Buyer/Seller read-only run exceeded the backend `auth` limit of 10 requests per
client per 60 seconds because each route logged in separately. The resulting
Seller `/auth` timeout is tracked as `AF-TEST-001`, not as a permission result.
Front-End `1fbfeca` made login settling role-agnostic and awaited `/seller`
index navigation; `717550e` reuses one authenticated session per role and
viewport while keeping every route assertion. Local lint/build passed.
Deployment verification and the post-deploy authenticated retest remain
pending; do not mark Buyer/Seller authenticated UAT passed yet.

Safe authenticated UAT follow-up 2026-08-26: deployment run `32955596021`
completed successfully for `717550e`. Buyer/Seller read-only route suites
 passed 6/6 across Desktop/Laptop/Mobile. Affiliate, orders, chat, live-entry
 and permission checks passed 42/42 (48/48 combined safe authenticated checks)
 after rate-limit-safe batching. This is
route/redirect smoke evidence only; keep checkout/payment/order/wallet/admin
mutations and provider-dependent flows pending.

Help-status deployment follow-up 2026-08-26: Front-End `dffe8ed` is on
`origin/main`, but the exact-SHA Actions query returned zero deployment runs
after the push trigger delay. The last verified production revision is
`717550e`; track this as `AF-DEP-002` (`BLOCKED_EXTERNAL`) and do not claim
the local S02–S06 Help metadata refinement live until the workflow is manually
inspected/dispatched and the Help regression passes.

Help-status deployment retry follow-up 2026-08-26: retry commit `d3bd7fd`
produced run `32985079060`, which also ended `startup_failure` with zero jobs;
the original `dffe8ed` run `32984881891` failed identically. No deploy script
or build ran. Keep `717550e` as the last verified production revision and
retain `AF-DEP-002` until Actions runner health is corrected.

Current availability check 2026-08-26: frontend root and canonical API health
both returned `200` with API `status: ok`. This confirms the prior verified
release remains available; it is not evidence that `dffe8ed` is deployed.

Bounded public production regression follow-up 2026-08-26: after granting the
Playwright runner network access, `help-journey.spec.ts` plus `guest.spec.ts`
passed 45/45 executed checks across Desktop/Laptop/Mobile with 3 intentional
mobile-only skips. The initial sandbox run failed only with
`ERR_NETWORK_ACCESS_DENIED` during navigation. This confirms public route and
Help/Journey behavior for the last verified release; it does not verify
`dffe8ed`, and no authenticated or mutating flow was run.

Help-status deployment resolution follow-up 2026-08-26: retry run
`32987804285` completed successfully for Front-End `d3bd7fd`, matching
`origin/main`; the deployed source includes the `dffe8ed` S02–S06 Help metadata
refinement. Post-deploy Help/Journey regression passed 15/15 executed checks
across Desktop/Laptop/Mobile with 3 intentional mobile-only skips. Direct
production inspection confirmed all five refined seller cards render
`Đang hoàn thiện thêm bước`. `AF-DEP-002` is resolved for deployment
verification; authenticated mutation/provider/Admin UAT remains pending.

Post-deploy full production regression follow-up 2026-08-26: the complete
no-credential `Front-End/e2e` matrix passed 165/165 executed tests across
Desktop/Laptop/Mobile with 60 intentional credential/API skips and 0 failures.
Public catalog, auth-negative, authorization, responsive, QR, live, PWA and
Help/Journey scopes remained green after `d3bd7fd`. Authenticated mutation,
provider and Admin flows remain pending and were not inferred from this run.

Post-deploy safe authenticated UAT follow-up 2026-08-26: Buyer/Seller
read-only routes passed 6/6 across Desktop/Laptop/Mobile; affiliate, chat,
orders and seller-live checks passed 9/9; permission checks passed 24/24 after
the isolated Laptop auth-limiter retry passed. Combined safe authenticated
coverage is 48/48 with no mutation or observed 5xx response. Checkout,
payment, order transitions, wallet, provider and Admin flows remain pending.

Cart/checkout read-only follow-up 2026-08-27: Buyer cart loading and empty
checkout checks passed 6/6 across Desktop/Laptop/Mobile with no observed 5xx
responses. The reversible quantity-update case skipped 3/3 because the seeded
cart had no usable item/quantity badge fixture; no cart mutation, order creation
or payment was performed.

Admin read-only follow-up 2026-08-27: the focused Admin route inventory passed
3/3 across Desktop/Laptop/Mobile against production revision `d3bd7fd` for
`/admin`, users, shop registrations, product registrations, vouchers, categories,
wallet, chat and withdrawal requests, with no observed 5xx response or mutation.
Keep A01, A02, A04, A05, A08 and A09 at PARTIAL; A03, A06, A07 and A10 plus all
Admin mutations remain open.

Admin status deployment follow-up 2026-08-27: deployment run `33029197905`
completed successfully for Front-End `bb0eee1`. Post-deploy Help/Journey
regression passed 15/15 executed checks with 3 intentional mobile-only skips;
live Help status labels match the six PARTIAL and four UNVERIFIED Admin
journeys recorded in the documentation registry. The post-deploy Admin route
inventory passed 3/3 across Desktop/Laptop/Mobile. Raw Admin dashboard captures
at 1440×900 and 390×844 are PII-safe UAT evidence; annotated final visuals and
Admin mutating journeys remain pending.

Final served-visual regression 2026-08-27: against the deployed Front-End
`9637e9f`, the combined read-only Help/Journey and Admin suite passed 18/18
executed checks across Desktop/Laptop/Mobile with 3 intentional mobile-only
skips. This included the A01 Dashboard visual binding and the full nine-route
Admin read-only inventory; no mutation or provider action was performed.

Final deployment verification 2026-08-27: follow-up run `33029734247` completed
successfully for Front-End `e1c3aff`. The final combined read-only production
regression passed 18/18 executed checks across Desktop/Laptop/Mobile with 3
intentional mobile-only skips: Admin route inventory passed 3/3 and
Help/Journey passed 15/15. Frontend/API health returned `200`/`ok`. No mutation,
payment, order transition, withdrawal or provider action was performed.

A01 visual deployment follow-up 2026-08-27: deployment run `33030375327`
completed successfully for Front-End `9637e9f`. The A01 Dashboard Journey
Center step renders the Desktop and Mobile annotated assets, each returning
HTTP 200. The A01 read-only dashboard visual is accepted; remaining Admin
visuals, mutations and untested A03/A06/A07/A10 journeys remain pending.

Admin visual evidence follow-up 2026-08-27: production Front-End `9637e9f`
read-only capture passed Desktop and Mobile. Users and Shop-registration images
were discarded after PII inspection; A05 product-registration and A09
platform-voucher raw/annotated pairs are now accepted and exposed through their
Journey Center steps. Admin decisions, mutations and A03/A06/A07/A10 remain
open.

Final combined read-only regression 2026-08-27: production Front-End `7e7a12a`
passed 21/21 executed Admin and Help/Journey checks across Desktop/Laptop/Mobile
with 3 intentional mobile-only skips. The nine Admin routes and A01/A05/A09
visual bindings are verified on the final deployed revision.

Authenticated Buyer Buy Now quote retest 2026-08-27: production UI walkthrough
with the approved seed buyer opened offer
`c831f5d5-4b75-46db-95fc-c687f0fe6b2b`, selected `500ml` / `Chai lẻ`, loaded the
default address and GHN `GHN_1` (`21,001 VND`, `3-4 ngày`). The server-owned
Buy Now quote returned HTTP `201` and buyer payable `158,001 VND`; the UI
matched it. No order/cart/payment/provider mutation ran. Keep B04/AF-B-003
PARTIAL: cart quote `400` history is not reproduced by this Buy Now request,
although the same read-only quote passed at Desktop 1440x900, Laptop 1280x720
and Mobile 390x844. Order/provider fixtures are still not approved.

Authenticated Seller fixture follow-up 2026-08-27: Seller Center read-only
dashboard, products, orders/detail, wallet, vouchers and Affiliate loaded.
Observed 5 active products, 13 delivered historical orders, a 46,000,000 VND
available balance with a masked verified payout account, one active Affiliate
program and one active shop voucher. Seller live explicitly had no eligible
active/approved product or active voucher. Keep Seller journeys PARTIAL: no
mutation, withdrawal, payout, order transition or Agora action was performed,
and final PII-safe Seller visuals are still pending.

Admin route-gap follow-up 2026-08-27: approved Admin UI login succeeded, but
direct `/admin/kyc`, `/admin/moderation`, `/admin/orders` and `/admin/audit`
navigation each rendered only the empty app root. `Front-End/src/App.tsx` has
no corresponding routes. Keep A03/A06/A07/A10 `UNVERIFIED` and classify them
as not implemented until routes, contracts and approved fixtures exist; no
mutation was attempted.

Authenticated Buyer account read-only follow-up 2026-08-27: `/profile`,
`/profile/address`, `/profile/orders`, `/profile/wallet` and
`/affiliate?tab=member` rendered after UI login with the approved seed buyer.
The Affiliate page reached its empty state; `/profile/verify-history` rendered
only the empty app root because the route is absent from `Front-End/src/App.tsx`.
No profile, address, wallet, Affiliate, order, payment or provider mutation was
performed. Keep AF-U-001 and AF-B-004 Partial; profile/address mutations,
order/review/dispute coverage, ownership-after-reload and QR history remain
open.

Authenticated Affiliate program read-only follow-up 2026-08-27: `/affiliate`
loaded one open program with brand, tier rates, hold period and referral-code
field; `?tab=member` loaded the empty member state. Program/member API reads
returned 200 with no console errors. Do not click `Tham gia`; join,
attribution, conversion and payout remain unverified.

Affiliate visual deployment follow-up 2026-08-27: deployment run
`33044485519` completed successfully for Front-End `622b1e9`. The S07
program-discovery binding selected the Desktop visual at 1440x900 and
1280x720, and the Mobile visual at 390x844; all images loaded with clean
console/network diagnostics. The captures are raw/annotated PII-safe pairs
from the authenticated read-only view. No join, attribution, conversion or
payout mutation ran.

Affiliate visual regression follow-up 2026-08-27: the production
Help/Journey Playwright suite passed 22/22 executed checks across
Desktop/Laptop/Mobile with 2 intentional mobile-only skips. This covered the
new S07 binding and the existing Help/Journey platform, deep-link, placeholder
and contextual-help checks. No mutation or provider action ran.

Mutation/provider gate audit 2026-08-27: the repository UAT seed is a
destructive disposable fixture and hosted execution requires an explicit
approved UAT target plus `SEED_ALLOW_HOSTED_DB=true`; payment/live handoffs
also keep provider confirmation pending. Only production was in scope for
this run, so seed/reset, checkout/order, withdrawal, webhook, Affiliate
transition and Agora actions were not attempted. Track this as
`AF-UAT-007 / BLOCKED_EXTERNAL` until a separate UAT/staging target and
provider sandbox scope are available.

Contextual-help deployment follow-up 2026-08-27: deployment run
`33045487946` completed successfully for Front-End `04c62ab`. The public
footer verification link now deep-links to `/help/qr/verify-product`; the
focused production check passed Desktop/Laptop/Mobile. The full Help/Journey
regression passed 24/24 executed checks with 3 intentional mobile-only skips.
No mutation or provider action ran.

Public Help surface audit follow-up 2026-08-27: `https://antifake.io.vn/help`
returned HTTP 200 for the document and all six observed static/runtime
requests, with no console errors or warnings. The accessibility snapshot
exposed the Help heading, search, role filters, journey links and evidence
labels for QR, Seller Wallet and Affiliate. Lighthouse snapshot scores:
Accessibility 100, Best Practices 100, SEO 83 and Agentic Browsing 50. This
was a public read-only audit; no authenticated data, mutation or provider
action ran.

Seller Wallet visual target check 2026-08-27: safe navigation to production
`/seller/wallet` from the existing browser context redirected to `/auth`; no
authorized seller session was available. No credential was supplied or
extracted, and no login, wallet mutation or provider action ran. Track the S08
final visual as `BLOCKED_EXTERNAL`; retain read-only wallet evidence as
`PARTIAL`.

Admin Help status normalization follow-up 2026-08-27: deployment run
`33046952049` succeeded for Front-End `b9d5f48`. The production no-credential
status assertion passed 3/3 viewport projects, and the complete Help/Journey
regression passed 27/27 executed checks with 3 intentional mobile-only skips.
A03, A06, A07 and A10 remain explicitly `NOT_IMPLEMENTED` because their
frontend routes are absent; no Admin mutation or provider action ran.

Final Admin Help status regression follow-up 2026-08-27: deployment run
`33050185145` completed successfully for Front-End `4a93130`. The complete
no-credential Help/Journey production regression passed 27/27 executed checks
across Desktop, Laptop and Mobile with 3 intentional mobile-only skips,
including the A03/A06/A07/A10 `NOT_IMPLEMENTED` assertion, accepted visuals,
platform override, deep links, contextual help and footer verification link.
No authenticated data, mutation or provider action ran.

Full no-credential production regression follow-up 2026-08-27: against the
deployed Front-End `4a93130`, the Playwright matrix scheduled 240 tests and
completed with 192 passed, 48 intentional credential/local-gate skips and 0
failures. Public, responsive, negative-auth, QR, quote-only checkout,
permission, authorization, PWA and Help/Journey coverage remained green; no
authenticated mutation or provider action ran.

Unavailable-journey safety follow-up 2026-08-27: deployment run `33051349776`
completed successfully for Front-End `ed20fa5`. The production Help/Journey
suite passed 30/30 executed checks across Desktop, Laptop and Mobile with 3
intentional mobile-only skips. A direct A03 deep link now shows the explicit
`NOT_IMPLEMENTED` state and withholds the absent route's step instructions;
no authenticated data or mutation ran.

Unavailable-journey CTA follow-up 2026-08-27: deployment run `33052403625`
completed successfully for Front-End `fd937ab`. The production Help/Journey
suite passed 30/30 executed checks across Desktop, Laptop and Mobile with 3
intentional mobile-only skips. `NOT_IMPLEMENTED` Admin cards now use a
status-oriented CTA, and their deep links continue to withhold actionable
instructions; no authenticated data or mutation ran.

Post-change full no-credential production regression 2026-08-27: against the
deployed Front-End `ed20fa5`, the Playwright matrix scheduled 243 tests and
completed with 195 passed, 48 intentional credential/local-gate skips and 0
failures. Public, responsive, negative-auth, QR, quote-only checkout,
authorization, PWA and Help/Journey coverage remained green; no authenticated
mutation, payment, order transition, withdrawal or provider action ran.

Current deployed revision regression 2026-08-27: against Front-End `fd937ab`
(deployment run `33052403625`), the complete no-credential production matrix
scheduled 243 tests and completed with 193 passed, 50 intentional skips and 0
failures. The skips matched declared credential, local-only quote-mock,
mobile-project and runtime fixture gates. No authenticated mutation, payment,
order transition, withdrawal or provider action ran.

Documentation link regression 2026-08-27: every local Markdown and image link
in `docs/user-guide/*.md` resolved successfully; runtime Help routes remain
covered by the existing Help/Journey checks.

QR history navigation follow-up 2026-08-27: Front-End commit `3c512a8`
replaced the dead Buyer profile sidebar target `/profile/verify-history` with
the supported public `/qr` verification route. The production browser
regression `e2e/profile-navigation.spec.ts` passed 3/3 projects across
Desktop/Laptop/Mobile after the push with a synthetic local session and
mocked API responses; no mutation was performed. Keep the separate QR history
feature unclaimed until a real route, API and fixture exist.

Help accessibility follow-up 2026-08-27: Lighthouse found Help
step/placeholder and Mobile bottom-navigation text below the 4.5:1 contrast
threshold. Front-End `8157ffa` corrected the shared colors. Deployment run
`33071400901` completed successfully; a fresh isolated production context
served the new bundle, Lighthouse accessibility passed 100/100 on Desktop and
Mobile, Mobile had no horizontal overflow, and no console errors were
observed. No authenticated data or mutation was used.

Journey Center viewport follow-up 2026-08-27: a fresh isolated production
context at `390x844` selected the Mobile guide for B04 step 03, then the
Desktop selector switched the same step to the Desktop guide without a
navigation or console error. The served JS/CSS assets were the `8157ffa`
bundle; no authenticated data or mutation was used.

Current-revision profile regression 2026-08-27: `e2e/profile-navigation.spec.ts`
passed 3/3 against production Front-End `8157ffa` across Desktop, Laptop and
Mobile. The test used a synthetic local session and mocked API responses only;
it confirmed the Buyer profile entry targets supported public `/qr` navigation
and performed no mutation.

Help Center visual refresh 2026-08-27: the public `/help` shell was recaptured
from deployed Front-End `8157ffa` at Desktop `1440×900` and Mobile `390×844`.
Raw and separately annotated pairs are registered in the Visual Manifest, with
public-only content and no credentials or PII. The raw files remain untouched;
the refresh documents the Help shell after the contrast fix and does not sign
off feature journeys.

Current-revision Help/Journey regression 2026-08-27: `e2e/help-journey.spec.ts`
passed 30/30 executed production checks against Front-End `8157ffa` across
Desktop, Laptop and Mobile, with 3 intentional mobile-only skips. Search,
role filtering, platform visuals, unavailable Admin journeys, deep links and
public contextual-help links remained green; no authentication, mutation or
provider action was used.

Current-revision responsive regression 2026-08-27: `e2e/responsive.spec.ts`
passed 21/21 against Front-End `8157ffa` across Desktop, Laptop and Mobile for
`/`, `/community`, `/live`, `/categories`, `/qr`, `/auth` and `/help`; no route
had horizontal overflow and no authenticated or mutating action was used.

Current-revision guest/permission regression 2026-08-27: `e2e/guest.spec.ts`
and `e2e/permissions.spec.ts` passed 51/51 executed checks across Desktop,
Laptop and Mobile, with 3 intentional credential-gated skips. Public routes
loaded without blank pages or server errors, protected routes redirected guests
to authentication, and no mutation or provider action was used.

Current-revision QR smoke 2026-08-27: `e2e/qr.spec.ts` passed 3/3 across
Desktop, Laptop and Mobile with no server errors or access/refresh token text
in the rendered page. No verification mutation or provider action was used.

Current-revision Buyer catalog regression 2026-08-27: `e2e/catalog.spec.ts`
passed 15/15 against Front-End `8157ffa` across Desktop, Laptop and Mobile.
Product and Shop navigation, branded fallback, category filtering and search
results/empty-state behavior remained green; B02 remains partial outside this
public read-only subset.

Current-revision local quality gate 2026-08-27: Front-End `8157ffa` passed
`npm run lint`, `npm run build` (`tsc -b` plus Vite production build), and the
local test suite across 16 files passed 75/75, including the documentation
verifier (`test/help-content.test.mjs`) at 19/19. The build emitted only the
existing large-chunk advisory.
The required named gates also passed: `test:auth` 3/3, `test:live` 12/12,
`test:payos` 7/7 and `test:pwa` 12/12.

Current deployed revision no-credential regression 2026-08-27: the complete
Playwright matrix scheduled 246 tests across Desktop, Laptop and Mobile and
completed with 198 passed, 48 declared credential/local/runtime skips and 0
failures. Public guest routes, catalog, auth-negative, permissions, QR,
quote-only Buy Now, backend authorization, PWA, Help/Journey, profile
navigation, header badges and flash-sale navigation remained green. No
authenticated mutation, payment, order transition, withdrawal or provider
action was performed.

Retained UAT draft consistency follow-up 2026-08-27: removed the unscoped
historical `102 passed, 3 skipped` aggregate from
`docs/HUONG_DAN_SU_DUNG_ANTIFAKE.md`; the draft now links to revision-scoped
canonical UAT evidence and identifies its images as UAT-only.

Current-revision backend non-mutating quality audit 2026-08-27: Back-End
`3b59ab9` passed `npm run test:ci` (7 suites / 25 tests),
`npm run build:deploy`, and `npx.cmd prisma validate --schema
prisma/schema.prisma`. Check-only ESLint
(`npx.cmd eslint apps libs test --ext .ts`) reported 8,390 problems (8,328
errors and 62 warnings); the repository `npm run lint` auto-fix script was not
run. Backend lint sign-off remains open under `AF-TECH-002`; no broad rewrite
was attempted.

Authenticated-scope recheck 2026-08-27: no approved UAT URL, role credential,
mutation flag or provider-sandbox variable was present in the current shell.
No credential value was inspected or logged; authenticated and provider UAT
remains a manual prerequisite.

Repository boundary audit 2026-08-27: `Front-End` at `8157ffa` and `back-end`
at `3b59ab9` are clean independent Git worktrees. The workspace root containing
the canonical `docs/` artifacts is not a functional Git worktree; documentation
changes therefore remain locally prepared and require owner-provided repository
integration before they can be committed or pushed.

Source-audit follow-up 2026-08-27: `docs/user-guide/SOURCE_AUDIT.md` now
explicitly inventories backend/API/UI boundaries for absent Admin routes, QR
history, provider and mutation evidence, affiliate/live evidence, chat
metadata and local mocks/fixtures. No journey status was upgraded; the
documentation verifier remains green at 19/19.

Documentation clarity follow-up 2026-08-27: the feature matrix and registry
now describe B06 and S01 as source/permission reviewed with authenticated
runtime and final visuals still pending. `UX_DOCUMENTATION_GAPS.md` records
DOC-012 for chat avatar, verification and presence metadata not returned by
the backend. No runtime or journey status changed; the verifier remains 19/19.
## Skip reconciliation snapshot - 2026-08-27 (superseded)

The current no-credential report remains 246 scheduled, 198 passed, 0 failed
and 48 retained skips against `8157ffa`. The source audit confirms 47 actual
skip executions plus one unmapped retained-report audit record. The canonical
reconciliation, exact fixture/config request, read-only-first execution order,
named mutation tiers, provider requirements, Admin A03/A06/A07/A10 treatment,
AF-TECH-002 classification, root documentation boundary, denominator and
28-journey evidence gaps are in
[`docs/UAT_SKIP_RECONCILIATION.md`](../UAT_SKIP_RECONCILIATION.md).

Do not repeat the valid public evidence or request blanket mutation approval.
After secure role fixtures are supplied, run the 36 read-only role-gated
executions first; request only the listed isolated UAT/provider actions after
that result.

## Seed/demo account re-audit — 2026-08-28 (read-only checkpoint; superseded by closeout)

The existing seed/demo accounts were audited in `prisma/seed.ts`,
`prisma/seeds/**`, the Prisma schema, and login guards before any credential
request. Production UI validation confirmed:

- `ACTIVE_BUYER_UAT`: `seed.user01@antifake.local`, active/verified, source KYC
  verified level 2, owns two verified Shops and one pending Shop.
- `ACTIVE_SELLER_UAT`: `seed.user02@antifake.local`, active/verified, source KYC
  verified level 2, owns three verified Shops.
- `ACTIVE_AFFILIATE_UAT` and `ACTIVE_ADMIN_UAT`: `admin@antifake.io.vn`.
  Production email/phone login reached `/admin`; source has an active
  AffiliateAccount even though the source seed marks the Admin suspended.
- `seed.user03`–`seed.user07` exist but have unverified identifiers and
  production email login returned HTTP 403; their exact KYC/AffiliateAccount
  states are recorded in `docs/UAT_SKIP_RECONCILIATION.md`.

All 36 formerly auth-blocked read-only executions passed across Desktop
`1440x900`, Laptop `1280x720` and Mobile `390x844`. The 3 cart-badge
executions are no longer auth-blocked; they remain
`BLOCKED_MUTATION_APPROVAL` until an isolated UAT cart fixture and cleanup are
approved. No new credentials, role changes, payment, provider action or
business mutation was used.

The current denominator is `234/237` applicable executions, with 3
mutation-held, 0 failed and 0 auth-fixture-blocked. The 28 journey statuses and
exact missing evidence remain unchanged; see
`docs/UAT_SKIP_RECONCILIATION.md` for the current matrix, fixture separation,
provider requirements and consolidated manual request.

## Cart badge and report discrepancy closeout — 2026-08-28

The existing seeded `ACTIVE_BUYER_UAT` cart was a safe isolated target for the
authorized badge check. At Desktop `1440x900`, Laptop `1280x720` and Mobile
`390x844`, the second line changed `2 -> 3 -> 2` and the header badge changed
`7 -> 8 -> 7`; six cart PATCH/GET requests returned HTTP 200 and the final
state matched the baseline. All 3 cart-badge executions passed. No order,
payment, wallet, provider or destructive Admin action was performed.

The retained Playwright HTML report was recovered. Its embedded `report.json`
contains 246 skipped entries with zero results from a short harness run, and the
associated error context reports a missing Chromium executable. The source
list independently confirms 246 tests in 23 files. The extra report-only record
is therefore `NOT_APPLICABLE` stale/duplicate audit evidence, not a missing
product test.

Current UAT denominator: `237/237` applicable passed, `0` failed,
`BLOCKED_MUTATION_APPROVAL=0`, `NOT_APPLICABLE=3`, `UNSAFE=6`, and
`OTHER_EXTERNAL_BLOCKER=0`. Documentation remains separate and still has 22
`PARTIAL`, 2 `SOURCE_VERIFIED` and 4 `NOT_IMPLEMENTED` journey rows.

## Documentation WorkSpace integration and B04 visuals — 2026-08-28

The canonical documentation repository is `Ecommerce-Anti-Fake/WorkSpace` on
`main`. The existing root `docs/` tree was copied byte-for-byte into the
WorkSpace `docs/` tree so QA paths, handoffs, relative links and 83 existing
visual assets remain stable. A root README and documentation-repository
`.gitignore` were added; no credentials, cookies, auth state, traces or secret
artifacts are included.

The three cart-badge executions had already passed with the seeded Buyer cart
restored to badge `7`. A read-only screenshot capture then produced sanitized
raw and annotated pairs at Desktop `1440×900` and Mobile `390×844`, registered
under `docs/images/buyer/` for the B04 quantity/badge step. The browser could
not write directly to WorkSpace, so captures were exported to an approved
temporary directory, inspected, copied into WorkSpace, and the annotation DOM
was removed. B04 remains `PARTIAL` because quote/order/payment evidence is
still open.

The integrated WorkSpace package was committed locally as `af9a59f` with
`docs(uat): integrate AntiFake UAT and user documentation`. The push to the
shared `main` branch was not completed: external publication review rejected
the push as a sensitive egress to an unverified shared repository. No bypass or
retry was attempted. Owner action is to review and push the local WorkSpace
chain `af9a59f`, `f145bc1`, `7cadbfb`, then verify `origin/main`.
