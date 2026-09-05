# AntiFake current UAT/demo fixture environment

Status: `DOCS_UAT_FIXTURE_SYSTEM_VERIFIED_B03_B08_B09_SHELL_CAPTURED`
Reconciled: 2026-09-04

This handoff is the additive fixture runbook for the owner's current UAT/demo
deployment. The existing deployment is not treated as a customer-production
target for this visual/fixture work. It does not close or reset
`ANTIFAKE VISUAL COVERAGE COMPLETION.md`.
The general functional baseline remains `237/237 applicable passed`; that UAT
was not rerun for this change.

## Current architecture discovery

| Area | Finding |
|---|---|
| Front-End | Vite SPA. Existing Playwright config supports an injected `UAT_BASE_URL`, fresh browser contexts, and `1440x900` / `390x844` projects. |
| Back-End | Nest API gateway with embedded deployment entrypoint. Prisma is PostgreSQL-only. Existing schema covers users, KYC, shops, offers/variants, inventory, orders, QR provenance, chat, community, affiliate, wallet, vouchers and moderation. |
| WorkSpace | Canonical documentation is pushed on `main`; verify the current revision with `git rev-parse HEAD`. The supplied audit/spec inputs remain untracked and are not treated as canonical changes. |
| CI/CD | The existing AntiFake deployment pipeline is the approved runtime path. The earlier separate-UAT workflows were removed after the owner clarification; fixture writes remain manual-only, while browser capture is available through `workflow_dispatch` or the dedicated `uat-capture` branch. |
| Infrastructure | The current approved runtime is `https://antifake.io.vn` with API `https://api.antifake.io.vn`; local PostgreSQL, Redis and Docker are unavailable in this workspace. |
| Providers | PayOS, GHN, Agora, Cloudinary, Firebase, Redis/Socket.IO and VietQR/payout are environment-driven. An ignored local `.env` has configured provider key names, but no UAT classification or sandbox safety was proven; no values were recorded or used. |

## Selected target architecture

Use the existing approved UAT/demo deployment:

1. Front-End runtime: `https://antifake.io.vn`.
2. API runtime: `https://api.antifake.io.vn`.
3. Existing deployment pipeline, reverse proxy and application processes remain
   the deployment mechanism; do not create `uat.antifake.io.vn` or
   `api-uat.antifake.io.vn`.
4. Additive fixture writes require explicit `UAT_DEMO` classification and
   target/database/host assertions. They must not invoke the destructive reset.

Historical records may call this deployment “production” because that was the
previous operational classification. New fixture documentation classifies it
as `UAT_DEMO` per the owner's clarification; historical evidence is retained.

## Environment boundary

The current demo mutation path is identified by these injected values:

| Variable | Meaning |
|---|---|
| `ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO` | Owner-approved current environment classification. |
| `UAT_DEMO_MUTATION_APPROVED=true` | Explicit opt-in required by additive fixture tooling. |
| `UAT_DEMO_LEGACY_DATA_ACKNOWLEDGED=true` | Owner confirmation that all pre-existing rows are legacy demo/development data; these rows remain read-only to fixture tooling. |
| `UAT_DEMO_LEGACY_DATA_CUTOFF` | ISO timestamp separating owner-classified legacy rows from unexpected new unclassified identity/business rows. |
| `UAT_DEMO_FIXTURE_NAMESPACE=DOCS_UAT` | Exact namespace required for all new documentation fixtures. |
| `UAT_DEMO_FIXTURE_MODE=ADDITIVE_IDEMPOTENT` | Explicitly prohibits reset/truncate/reseed behavior. |
| `UAT_DEMO_DESTRUCTIVE_RESET_ALLOWED=false` | Destructive reset is disabled for the shared current demo database. |
| `UAT_DEMO_LEGACY_MUTATION_ALLOWED=false` | Historical legacy rows cannot be updated or deleted by fixture tooling. |
| `UAT_DEMO_REAL_PAYMENT_ALLOWED=false` | PayOS payment calls are denied by the fixture preflight. |
| `UAT_DEMO_REAL_PAYOUT_ALLOWED=false` | Real payout calls are denied by the fixture preflight. |
| `UAT_DEMO_REAL_SHIPMENT_ALLOWED=false` | GHN shipment booking is denied by the fixture preflight. |
| `UAT_DEMO_REAL_EXTERNAL_KYC_ALLOWED=false` | External KYC submission/approval is denied by the fixture preflight. |
| `UAT_DEMO_REAL_LIVESTREAM_ALLOWED=false` | Public/external livestream side effects are denied by the fixture preflight. |
| `DATABASE_URL` | Current demo database connection string; never document its value. |
| `UAT_DEMO_DATABASE_TARGET` | Non-secret current-demo target label containing `demo`, `uat`, `staging`, `test` or `local`. |
| `UAT_DEMO_DATABASE_NAME` | Expected database name; it must match the URL database path. |
| `UAT_DEMO_DATABASE_HOST_ALLOWLIST` | Exact remote database hosts allowed for additive fixture writes. |
| `UAT_DEMO_PRODUCTION_DATABASE_TARGET` | Non-secret comparison label; it must differ from the demo target. |
| `UAT_APPROVED_PUBLIC_HOSTS` | Exact public hosts allowed under the `UAT_DEMO` classification. |
| `UAT_FRONTEND_PUBLIC_URL` | `https://antifake.io.vn`, used in seeded visible metadata. |
| `UAT_QR_CODE` | Securely injected known test code; only its hash is stored and verified. |
| `PAYOUT_ACCOUNT_ENCRYPTION_KEY` | Securely injected only if wallet fixture code needs encrypted synthetic payout data. |

The repository contains safe `.env.uat.example` and `.env.uat-demo.example`
templates. Values belong in a
secret manager, CI environment secrets, or an ignored local `.env.uat.local`.
Never put credentials, connection strings, QR plaintext, provider keys, JWT
secrets, tokens or personal data in WorkSpace documentation.

Sanitized local configuration audit on 2026-09-04: the ignored Back-End `.env`
contained configured database/provider fields, but no `UAT_DEMO` boundary
labels. The owner-approved labels and all deny-by-default fixture flags were
injected separately; no secret values were recorded.

Read-only database audit on 2026-09-04, performed only after applying the
owner-approved `UAT_DEMO` labels in process, verified the configured database
identity as `neondb` on a remote allowlisted host (hostname and connection
string withheld), and found the three approved account aliases active and
verified. The aggregate safety signals were:

- 13 users, including 5 accounts using an external `gmail.com` domain;
- all 13 current user display names lacked a synthetic marker, while the
  repository's compact seed defines marker-bearing UAT display names;
- 6 shops whose names did not contain a `UAT`, `DOCS`, `DEMO`, `SEED` or `TEST`
  marker;
- existing catalog/order/QR/chat/community/affiliate/wallet/moderation rows
  are present.

A read-only PostgreSQL schema audit found only the shared `public` application
schema (98 public tables); no isolated application schema or second database
target was available through the configured connection. The owner-approved
`UAT_DEMO` classification identifies the current runtime, but it is not being
treated as structural database isolation while these data signals remain
unresolved.

The owner subsequently confirmed that the current environment and its
pre-existing rows are UAT/demo/development data. Those rows are now explicitly
classified as `LEGACY_DEMO_DATA`, preserved without rename/delete/update, and
remain visible in the audit. This resolves the prior mixed-data classification
hold without weakening the new-data or provider guards; no second database is
required for the current documentation-fixture goal.

The same check is now repeatable without ad-hoc SQL or PII output:

```text
npm run uat:audit-demo
```

It requires the read-only UAT_DEMO runtime boundary and owner classification,
reports `LEGACY_DEMO_DATA_PRESENT`, validates the managed graph as
`DOCS_UAT_FIXTURES_VALID`, surfaces `UNCLASSIFIED_NEW_DATA`, and reports
`PRODUCTION_PROVIDER_RISK` from the deny-by-default policy. It emits no
credentials or personal fields and never writes, resets, cleans up or calls a
provider.

The guarded additive `npm run uat:ensure` was then run twice with the same
policy. It created and reconciled only the deterministic `DOCS_UAT` graph;
existing account aliases were read-only and no legacy rows were modified or
deleted. The read-only `npm run uat:verify-demo` check now passes all approved
aliases, the active Shop/catalog/cart/voucher graph, genuine positive
QR/provenance result, four valid order states, chat history, Community post,
affiliate conversion/commission, non-payable wallet ledger and Admin review
rows. The subsequent audit reports `DOCS_UAT_FIXTURES_VALID` and zero
`UNCLASSIFIED_NEW_DATA`.

## Isolation record

These are the sanitized values future operators must record for the approved
demo target; only labels and methods belong in this document:

| Record | Required value |
|---|---|
| `UAT_DATABASE_TARGET` | `UAT_DEMO_DATABASE_TARGET` injected label |
| `PRODUCTION_DATABASE_TARGET` | Injected comparison label only; never its URL or credentials |
| `ISOLATION_METHOD` | Owner-approved `UAT_DEMO` classification plus exact target/name/host guards; structural isolation is not claimed for the shared `public` schema |
| `MIGRATION_METHOD` | Existing approved deployment pipeline; additive fixture run does not migrate/reset |
| `SEED_METHOD` | Guarded `npm run uat:ensure`, followed by read-only `npm run uat:verify-demo` |

The additive fixture command is not accepted without the owner classification,
explicit mutation approval, valid legacy cutoff, matching database name, exact
remote host allowlist and the complete additive/deny-by-default policy. It
never calls the destructive reset path. Only `DOCS_UAT` rows are owned by the
fixture tooling; `LEGACY_DEMO_DATA` is audit-visible but immutable to it.

## Reset and seed procedure

After the explicit preflight passes, run from `back-end` with the approved demo
environment injected or loaded from the safe template/secret manager:

```text
npm run uat:ensure
npm run uat:verify-demo
```

`uat:ensure` performs the following additive sequence:

```text
assert UAT_DEMO target, owner classification and additive deny-by-default policy
  -> read approved demo account aliases without updating them
  -> upsert only namespaced synthetic shops/catalog/cart/voucher/order/QR/chat/community/affiliate/admin records
  -> verify required fixture relationships and positive QR provenance
```

`uat:reset` remains available only for a separately provisioned isolated UAT
database and is not the command for this current `UAT_DEMO` target. The
ordinary destructive `db:seed` path remains guarded and must not be used here.

Build the backend before starting the API (`npm run build:deploy`). The UAT
start wrapper loads an ignored `UAT_ENV_FILE` when supplied, proves the same
database boundary and UAT frontend URL, then starts the compiled gateway. A
production deployment continues to use its existing start path.

Logical account aliases are `BUYER_UAT`, `SELLER_UAT`, `AFFILIATE_UAT` when
the affiliate state is required, and `ADMIN_UAT`. The approved identifiers are
`seed.user01@antifake.local`, `seed.user02@antifake.local` and
`admin@antifake.io.vn`; passwords and tokens are injected, never documented.
All seeded names, addresses, shops, products, posts and messages use the
synthetic UAT namespace.

## Existing approved deployment

Use the existing AntiFake deployment pipeline for code changes. Fixture data
is reconciled through the additive command only after the explicit preflight
passes. No second VPS, DNS target, reverse-proxy route or deployment workflow
is required.

The current deployed revisions are Back-End `70f9bb5` (GitHub Actions run `44`)
and Front-End `4e24bef` (GitHub Actions deployment run `118`; the current
capture workflow run is recorded with the capture evidence below). The
Front-End changes are capture-harness-only:
they add environment-aware capture preflight, independent role-scoped capture
behavior and viewport-safe scheduled-live markers. Accepted visual evidence
remains anchored to the published binding commit `c7dfc58` (run `100`); the
new scheduled-live shell pair is temporary UAT evidence pending the manifest
promotion recorded below. The deployment health check passed; the backend
health endpoint and read-only synthetic live-shell browser checks passed after
the latest verified deploys.

The post-deploy additive reconciliation corrected the managed product's
variant mapping: the reserved variant now has one value for its single option
group, matching the current product-detail selection contract. The guarded
`uat:ensure` command passed against the owner-approved `UAT_DEMO` target, and
the read-only `uat:verify-demo` and `uat:audit-demo` checks passed afterward.
The audit still reported legacy rows, while reporting
`DOCS_UAT_FIXTURES_VALID`, `UNCLASSIFIED_NEW_DATA=false` and
`productionProviderRisk=DENIED_BY_FIXTURE_POLICY`. No cart button was clicked
in the public browser probe; after selecting the managed variant, the product
route showed 25 available units and enabled the cart/buy controls in an
unauthenticated isolated context. Authenticated Buyer capture remains pending.

## Fixture packs

The seed creates one coherent disposable graph where the current schema allows
it. Logical IDs are stable aliases; database UUIDs are implementation details.

| Pack | Reusable state | Provider boundary |
|---|---|---|
| Buyer | profile, synthetic address, active cart, voucher eligibility, orders, chat thread, public community post | Read-only capture by default; no real payment or shipment. |
| QR | active label, batch, approved offer link and `VERIFIED` provenance event | Verification is local database lookup; the known code is injected and never logged. |
| Orders | explicit valid lifecycle examples for buyer list/detail and seller processing | State transitions must use the real order state machine. |
| Seller | shop, product, variant, inventory, media placeholders, voucher and linked order | Seeded media is a UI placeholder; it is not Cloudinary upload evidence. |
| Live shell | future scheduled LiveSession, pinned Offer/Voucher and synthetic public comment | Public shell is safe to capture; Agora media/join and live mutations remain denied. |
| Affiliate | program, account/link, synthetic conversion and ledger state when supported | Non-payable UAT ledger only; no payout execution. |
| Admin | synthetic user/KYC, shop-review, product-moderation, promotion and implemented wallet/read queues | Read-only review capture; A03/A06/A07/A10 remain `NOT_IMPLEMENTED` unless source changes. |

## Provider matrix

The matrix records the current repository/workspace state. `NOT_EXPOSED` means
that no secret value was inspected; it is not a claim about production secret
configuration.

| PROVIDER | FEATURES_UNLOCKED | UAT_CONFIG_AVAILABLE | SANDBOX_AVAILABLE | SAFE_TO_CALL | SECRET_CONFIGURED | PRODUCTION_ONLY | CURRENT_BLOCKER |
|---|---|---|---|---|---|---|---|
| PayOS | Checkout screens; payment completion | No UAT values | Not verified | No | LOCAL_IGNORED_ENV_ONLY; UAT NOT CONFIGURED | Completion is production-only until sandbox is approved | Isolated PayOS sandbox and UAT secrets |
| GHN | Shipping option/quote UI; booking/tracking boundary | Template only | Not verified | No | LOCAL_IGNORED_ENV_ONLY; UAT NOT CONFIGURED | Booking must stay outside production | Approved UAT/sandbox account and cleanup |
| Agora | Seeded live metadata and public scheduled room shell | Template only | Not verified | No | LOCAL_IGNORED_ENV_ONLY; UAT NOT CONFIGURED | Real room/token is production-only until isolated | UAT room, token config and authenticated media browser proof |
| Socket.IO/Redis | Chat history; realtime when isolated | Yes: in-process without Redis; isolated `REDIS_*` optional | N/A infrastructure | Local in-process only | Not required for local mode | No | Reachable UAT API and two isolated browser sessions |
| Cloudinary | Seeded media rendering | Template only | Not verified | No | LOCAL_IGNORED_ENV_ONLY; UAT NOT CONFIGURED | Upload is production-only until UAT folder/prefix exists | UAT folder/prefix and cleanup |
| Firebase | Local-account auth bridge where configured | Template only | Not verified | No | LOCAL_IGNORED_ENV_ONLY; UAT NOT CONFIGURED | Production project must not be reused | UAT Firebase project/bridge and injected credentials |
| VietQR/payout | Synthetic balance, ledger and withdrawal read views | Template only; encryption key required for seed | Not verified | No payout calls | LOCAL_IGNORED_ENV_ONLY; UAT NOT CONFIGURED | Payout execution is production-only | UAT bank lookup/payout sandbox; no financial liability |

Provider status is runtime evidence, not inferred from seed rows. Each future
provider test must record configuration availability, sandbox availability,
secret presence (boolean only), safe-to-call decision and the current blocker.

## Browser capture procedure

Use the dedicated Playwright UAT config and a newly created isolated browser
profile. Do not supply a personal Chrome `user-data-dir` or production storage
state.

```text
ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO
UAT_APPROVED_PUBLIC_HOSTS=antifake.io.vn,www.antifake.io.vn
UAT_BASE_URL=https://antifake.io.vn
UAT_FIXTURE_SMOKE=true
npm run test:e2e:uat
npm run test:e2e:uat:visual
```

The command reads only the role-scoped runtime variables
`ANTIFAKE_UAT_BUYER_EMAIL`, `ANTIFAKE_UAT_BUYER_PASSWORD`,
`ANTIFAKE_UAT_SELLER_EMAIL`, `ANTIFAKE_UAT_SELLER_PASSWORD`,
`ANTIFAKE_UAT_ADMIN_EMAIL` and `ANTIFAKE_UAT_ADMIN_PASSWORD`, plus the
optional injected `UAT_QR_CODE`. It runs representative buyer, QR, order,
seller, chat, community and Admin routes at both required viewports when the
target is available. `test:e2e:uat:visual` writes raw and temporary annotated
pairs only to `.uat-runtime/test-results`; review privacy and marker placement
before promoting any pair into WorkSpace. Skipped role tests mean that role's
inputs were not supplied or verified; they are not a pass.

The same workflow is available through manual `workflow_dispatch` or the
dedicated `uat-capture` branch. A push to that branch runs the full capture
job without invoking the `main`-only deployment workflow. Its preflight
checks only role-input availability, approved namespaces and non-placeholder
passwords, never values. Missing inputs do not prevent public or independently
configured Buyer, Seller or Admin captures from running; the job reports a
partial input status without failing the available role work.
The first branch run (Front-End `d47ab80`, run `1`) failed closed because all
five required secret names were unset; it produced no capture artifacts.
The follow-up branch run (Front-End `e139e5a`, run `2`) exercised the revised
partial path: its preflight reported those five names as missing, the public
Community capture passed at both target viewports (`2 passed`, `8 skipped`),
the post-capture completeness gate failed closed, and the seven-day capture
artifact uploaded successfully. This proves the workflow preserves available
public evidence while refusing to call an authenticated capture complete; no
new asset was promoted from that artifact without a separate privacy review.

Current browser evidence: the positive QR and public `DOCS_UAT` Community feed
capture tests passed 4/4 (both fixtures at Desktop and Mobile) in fresh
contexts after Front-End revision `c7dfc58` deployed in GitHub Actions run
`100`. The narrow Help binding probe also passed 4/4 at both viewports. Both
pairs were privacy-reviewed and promoted to the visual manifest. Authenticated
Buyer/Seller/Admin capture tests remain pending until the six secure role
variables are available to the capture process; no personal browser profile
or cookie was used.

The manual `UAT demo visual capture` workflow uploads those temporary files as
a seven-day artifact. It does not deploy code or modify canonical visual
assets.

## Cleanup and troubleshooting

- Reconcile by rerunning `npm run uat:ensure`; it only upserts the namespaced
  fixture graph and leaves existing canonical demo rows untouched.
- Do not run `npm run uat:reset` against this current `UAT_DEMO` database. That
  command remains reserved for a separately provisioned disposable database.
- If the fixture pack must be removed, set the separate non-secret
  `UAT_DEMO_CLEANUP_APPROVED=true` flag and run `npm run uat:cleanup`. The
  command validates reserved names, runs one transaction, removes only the
  `DOCS_UAT` graph and preserves approved accounts, reference data and the
  buyer's existing active cart. It is never part of deployment or CI.
- If the guard rejects the target, inspect only non-secret labels and hostname
  configuration. Do not print `DATABASE_URL`.
- If verification reports a missing relationship, fix the seed/schema contract
  rather than inserting rows manually.
- If browser login fails, verify the injected UAT auth bridge and account
  aliases, then use a fresh browser context. Do not use a personal session.
- If a provider call is required, classify it as blocked until the UAT sandbox,
  secret configuration and cleanup plan are independently approved.
- Seeded placeholder media, synthetic ledger entries and fake payment URLs are
  documentation fixtures only and do not represent provider completion,
  financial liability or a production transaction.

## Unlock handoff

The visual goal's accepted baseline is preserved:

```text
FIXTURE_BLOCKED_BEFORE=60
PROVIDER_BLOCKED_BEFORE=5
```

The approved target now passes additive verification, read-only fixture audit
and isolated browser capture for the positive QR, public Community feed and
public scheduled-live room shell at both target viewports. The current evidence
calculation is:

```text
FIXTURE_BLOCKED_AFTER=57
PROVIDER_BLOCKED_AFTER=5
VISUAL_STEPS_NOW_UNLOCKED=3
NEWLY_COMPLETED_VISUAL=B03/result,B08/feed
NEWLY_CAPTURABLE_NON_PROVIDER_SHELL=B09/watch-shell
CURRENT_COMPLETE_VISUAL_STEPS=17
CURRENT_REQUIRED_VISUAL_STEPS=79
CURRENT_MISSING_VISUALS=62
```

The prior 80-step calculation included B08/report as a screenshot-required
fixture row. A current source and Desktop/Mobile UAT probe found no report
control or form, so that row is now `NOT_IMPLEMENTED`; the current
screenshot-required denominator is 79 and the remaining required visuals are
62 (57 fixture-backed and 5 provider-dependent). The remaining 57 fixture rows
still require their own browser/runtime evidence;
fixture creation is not counted as a screenshot pass. The canonical
`docs/user-guide/VISUAL_FIXTURE_MANIFEST.md` and the step-level matrix record
the QR, Community and scheduled-live shell captures and retain the other rows
as pending. Each row uses:

```text
VISUAL_STEP | PREVIOUS_BLOCKER | UAT_FIXTURE | UAT_ROUTE |
NOW_CAPTURABLE | PROVIDER_STILL_REQUIRED
```

The current step-by-step matrix is maintained at
[`uat-visual-unlock-matrix.md`](uat-visual-unlock-matrix.md). Its current
calculation is `FIXTURE_BLOCKED_AFTER=57`, `PROVIDER_BLOCKED_AFTER=5` and
`VISUAL_STEPS_NOW_UNLOCKED=3`; the third unlocked item is the non-provider
scheduled room shell, while the full B09 watch row remains Agora-blocked.

The current implementation unlocks the reusable graph. The QR result and
Community feed each have separate raw/annotated Desktop/Mobile evidence. The
scheduled live shell also has separate raw/annotated Desktop/Mobile evidence
from capture workflow run `33862241536`; its mobile marker contract uses the
in-frame summary/title/chat targets because the responsive layout stacks the
player above chat. The capture test passed 4/4 public pairs and skipped the
credentialed tests because the current shell did not inherit the role inputs.
The workflow now reports partial role availability without failing public or
available-role work. The visual coverage goal remains open for the other
fixture/provider rows.

## Current environment classification

```text
ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO
UAT_RUNTIME=https://antifake.io.vn
UAT_API=https://api.antifake.io.vn
DATA_CLASSIFICATION=LEGACY_DEMO_PLUS_DOCS_UAT_MANAGED
OWNER_MIXED_DATA_CLASSIFICATION=CONFIRMED
SEPARATE_UAT_PROVISIONING_REQUIRED=NO
SEPARATE_UAT_DATABASE_REQUIRED=NO_FOR_CURRENT_DOCS_FIXTURE_GOAL
DESTRUCTIVE_RESET_ALLOWED=NO
RESOLVED_BY_OWNER_ENVIRONMENT_CLARIFICATION=YES
```

The classification is an owner-provided environment boundary. The fixture
write guard additionally requires the injected mutation-approval flag, valid
legacy cutoff, additive namespace/mode, deny-by-default side-effect flags, the
sanitized database identity and the exact database-host allowlist before any
additive write. Only `DOCS_UAT_MANAGED` rows may be modified or cleaned up.

## Authenticated capture contract — 2026-09-05

The capture harness now uses separate role credentials, verifies the server
role returned by the real login response, verifies the role route, and then
uses a fresh Playwright context loaded from a temporary storage state. The
current domain model exposes Buyer and Seller as the generic `user` role, so
Seller verification additionally requires the returned owned-shop claim and
the protected Seller route; Admin must return the exact `admin` role. The
state is written only under ignored `.uat-runtime/auth/`, is never uploaded
with capture artifacts, and is removed when the role context closes.

```text
AUTH_CAPTURE_CONTRACT=ANTIFAKE_UAT_ROLE_SCOPED
BUYER_CREDENTIAL_AVAILABLE=false
SELLER_CREDENTIAL_AVAILABLE=false
ADMIN_CREDENTIAL_AVAILABLE=false
AUTHENTICATED_CAPTURE_STATUS=RUNTIME_INPUTS_UNAVAILABLE_TO_CURRENT_SHELL
STORAGE_STATE_UPLOAD=DENIED
STORAGE_STATE_CLEANUP=CONTEXT_CLOSE
```

The booleans above are the sanitized availability result from the current
capture process; no `.env` file was read and no credential value was printed.
This does not reopen UAT provisioning or mixed-data classification. The
approved runtime remains `UAT_DEMO`; the current limitation is only that this
shell did not inherit the six role variables. The isolated DevTools browser
verified the public synthetic Community feed at Desktop `1440x900` and Mobile
`390x844` with no console messages. Shell Playwright navigation was separately
blocked by `ERR_NETWORK_ACCESS_DENIED`, so no authenticated visual was counted
from that attempt.

## Post-push authenticated capture checkpoint - 2026-09-05

The Front-End deploy run `33941283194` completed successfully for runtime SHA
`79313d79ab8edbfc1cdc9fc7118e7bce5d0dd7df`. The dedicated capture run
`33941303277` also completed successfully against that SHA. Its sanitized
preflight reported all three role credential pairs unavailable, then passed
four public fixture pairs and skipped eight authenticated or QR cases. No
credential values, storage states or authenticated visual assets were
published. The public Community runtime remained clean at both target
viewports; the accepted visual totals are unchanged.

```text
FRONTEND_DEPLOY_RUN=33941283194
UAT_CAPTURE_RUN=33941303277
VERIFIED_RUNTIME_SHA=79313d79ab8edbfc1cdc9fc7118e7bce5d0dd7df
CI_ROLE_INPUT_STATUS=PARTIAL
CI_PUBLIC_CAPTURE_RESULT=4_PASSED
CI_AUTHENTICATED_CAPTURE_RESULT=8_SKIPPED
NEW_AUTHENTICATED_VISUALS=0
```

## Current-shell safety recheck - 2026-09-05

The existing read-only `uat:audit-demo` command was invoked from the current
shell and failed closed before database inspection because the required UAT
environment identity/database inputs were not present. No rows were read or
changed by that invocation, and no raw command output was retained. The prior
passing `DOCS_UAT` graph verification remains the latest database-backed
fixture evidence.

The managed fixture contract and the owner-supplied Seller runtime selection
currently reference different Seller account aliases. No account, shop or
fixture was renamed or mutated; reconcile the approved Seller alias before
running authenticated Seller capture so the session is tied to the managed
`DOCS_UAT` business graph.

## Auth context correction and follow-up - 2026-09-05

The authenticated helper was corrected to carry the configured UAT `baseURL`
into both fresh Playwright contexts. This closes the relative-navigation defect
that would have prevented real login even when approved role inputs are
available. Focused auth-contract tests, targeted TypeScript, lint, build and
guarded desktop/mobile discovery passed. The correction was deployed, and the
follow-up capture run again reported all three role inputs unavailable; it
passed four public pairs and skipped eight authenticated/QR cases. No legacy
record, provider or accepted visual was changed.

```text
FRONTEND_AUTH_FIX_COMMIT=8c5d027ba4e82ad0e4947e787c2b7672f9c3c884
FRONTEND_DEPLOY_RUN=33941828311
UAT_CAPTURE_RUN=33941840279
VERIFIED_RUNTIME_SHA=8c5d027ba4e82ad0e4947e787c2b7672f9c3c884
CI_ROLE_INPUT_STATUS=PARTIAL
CI_PUBLIC_CAPTURE_RESULT=4_PASSED
CI_AUTHENTICATED_CAPTURE_RESULT=8_SKIPPED
FIXTURE_BLOCKED_AFTER=57
PROVIDER_BLOCKED_AFTER=5
NEW_AUTHENTICATED_VISUALS=0
```

## Independent fixture-smoke gates - 2026-09-05

The browser fixture-smoke suite now gates Buyer, Seller, Admin and QR checks
independently. A missing role or QR input can no longer skip unrelated fixture
checks. Front-End commit `f73f27214452f6fa212fc6d9412ecfdd31911e4d` passed
focused TypeScript, auth-contract tests, lint, build and guarded discovery,
then deployed successfully in run `33942425336`. Capture run `33942432429`
also completed successfully; its sanitized preflight still found all three
role inputs unavailable, so four public pairs passed and eight authenticated/QR
cases were skipped. No fixture, legacy record, provider state or visual count
changed.

```text
FRONTEND_FIXTURE_SMOKE_COMMIT=f73f27214452f6fa212fc6d9412ecfdd31911e4d
FRONTEND_DEPLOY_RUN=33942425336
UAT_CAPTURE_RUN=33942432429
CI_ROLE_INPUT_STATUS=PARTIAL
CI_PUBLIC_CAPTURE_RESULT=4_PASSED
CI_AUTHENTICATED_CAPTURE_RESULT=8_SKIPPED
FIXTURE_BLOCKED_AFTER=57
PROVIDER_BLOCKED_AFTER=5
NEW_AUTHENTICATED_VISUALS=0
```
