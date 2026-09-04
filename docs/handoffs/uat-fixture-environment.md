# AntiFake current UAT/demo fixture environment

Status: `SAFETY_HOLD_POSSIBLE_NON_SYNTHETIC_DATA`
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
| WorkSpace | Latest pushed `main` read through `FETCH_HEAD` at `1d9a004b78b36082ddd9208d0f92fbdcdf3c2b12`. Local documentation follow-ups are preserved and are not treated as the pushed baseline. |
| CI/CD | The existing AntiFake deployment pipeline is the approved runtime path. The earlier separate-UAT workflows were removed after the owner clarification; the fixture and browser workflows remain manual-only. |
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
| `UAT_DEMO_SYNTHETIC_DATA_CONFIRMED=true` | Separate owner/data-review confirmation required after a mixed-data audit; setting mutation approval alone is insufficient. |
| `DATABASE_URL` | Current demo database connection string; never document its value. |
| `UAT_DEMO_DATABASE_TARGET` | Non-secret current-demo target label containing `demo`, `uat`, `staging`, `test` or `local`. |
| `UAT_DEMO_DATABASE_NAME` | Expected database name; it must match the URL database path. |
| `UAT_DEMO_DATABASE_HOST_ALLOWLIST` | Exact remote database hosts allowed for additive fixture writes. |
| `UAT_DEMO_PRODUCTION_DATABASE_TARGET` | Non-secret comparison label; it must differ from the demo target. |
| `UAT_APPROVED_PUBLIC_HOSTS` | Exact public hosts allowed under the `UAT_DEMO` classification. |
| `UAT_FRONTEND_PUBLIC_URL` | `https://antifake.io.vn`, used in seeded visible metadata. |
| `UAT_QR_CODE` | Securely injected known test code; only its hash is stored and verified. |
| `PAYOUT_ACCOUNT_ENCRYPTION_KEY` | Securely injected only if wallet fixture code needs encrypted synthetic payout data. |

The repository contains only `.env.uat.example` templates. Values belong in a
secret manager, CI environment secrets, or an ignored local `.env.uat.local`.
Never put credentials, connection strings, QR plaintext, provider keys, JWT
secrets, tokens or personal data in WorkSpace documentation.

Sanitized local configuration audit on 2026-09-04: the ignored Back-End `.env`
contained configured database/provider fields, but no `UAT_DEMO` boundary
labels. It was not used for fixture writes.

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

These signals do not prove each row is a real customer or business, but they
are sufficient to trigger the owner's safety boundary. Treat this database as
potentially mixed demo/non-synthetic data until the owner confirms the rows are
synthetic or supplies a reviewed disposable database target. No `uat:ensure`,
`uat:cleanup`, reset, migration or provider call was executed after the audit.
The fixture system remains fail-closed for mutation; the visual unlock count
therefore remains unchanged.

The same check is now repeatable without ad-hoc SQL or PII output:

```text
npm run uat:audit-demo
```

It requires the read-only UAT_DEMO runtime boundary, reports aggregate table
and synthetic-marker signals, emits no credentials or personal fields, and
returns a non-zero safety result when possible mixed data is detected. It never
writes, resets, cleans up or calls a provider.

## Isolation record

These are the sanitized values future operators must record for the approved
demo target; only labels and methods belong in this document:

| Record | Required value |
|---|---|
| `UAT_DATABASE_TARGET` | `UAT_DEMO_DATABASE_TARGET` injected label |
| `PRODUCTION_DATABASE_TARGET` | Injected comparison label only; never its URL or credentials |
| `ISOLATION_METHOD` | Owner-approved `UAT_DEMO` classification plus exact target/name/host guards |
| `MIGRATION_METHOD` | Existing approved deployment pipeline; additive fixture run does not migrate/reset |
| `SEED_METHOD` | Guarded `npm run uat:ensure`, followed by read-only `npm run uat:verify-demo` |

The additive fixture command is not accepted without the owner classification,
explicit mutation approval, separate synthetic-data confirmation, matching
database name and exact remote host allowlist. It never calls the destructive
reset path. The current target has a safety hold because the read-only audit
found possible non-synthetic records; do not set either approval flag to bypass
that hold.

## Reset and seed procedure

Once the safety hold is resolved by owner confirmation or a reviewed disposable
database target, run from `back-end` with the approved demo environment
injected or loaded from an ignored file:

```text
npm run uat:ensure
npm run uat:verify-demo
```

`uat:ensure` performs the following additive sequence:

```text
assert UAT_DEMO target and owner-approved classification
  -> reconcile existing approved demo accounts
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
may be reconciled through the additive command only after the current safety
hold is resolved. No second VPS, DNS target, reverse-proxy route or deployment
workflow is required.

## Fixture packs

The seed creates one coherent disposable graph where the current schema allows
it. Logical IDs are stable aliases; database UUIDs are implementation details.

| Pack | Reusable state | Provider boundary |
|---|---|---|
| Buyer | profile, synthetic address, active cart, voucher eligibility, orders, chat thread, public community post | Read-only capture by default; no real payment or shipment. |
| QR | active label, batch, approved offer link and `VERIFIED` provenance event | Verification is local database lookup; the known code is injected and never logged. |
| Orders | explicit valid lifecycle examples for buyer list/detail and seller processing | State transitions must use the real order state machine. |
| Seller | shop, product, variant, inventory, media placeholders, voucher and linked order | Seeded media is a UI placeholder; it is not Cloudinary upload evidence. |
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
| Agora | Seeded live metadata and live UI route | Template only | Not verified | No | LOCAL_IGNORED_ENV_ONLY; UAT NOT CONFIGURED | Real room/token is production-only until isolated | UAT room, token config and browser proof |
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

The command uses injected account variables (`UAT_USER_EMAIL`,
`UAT_SELLER_EMAIL`, `UAT_ADMIN_EMAIL`, `UAT_TEST_PASSWORD`) and the injected
`UAT_QR_CODE`. It runs representative buyer, QR, order, seller, chat,
community and Admin routes at both required viewports when the target is
available. `test:e2e:uat:visual` writes raw and temporary annotated pairs only
to `.uat-runtime/test-results`; review privacy and marker placement before
promoting any pair into WorkSpace. Skipped tests mean the target/credentials
were not supplied; they are not a pass.

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

Until the approved UAT/demo target passes additive verification and browser
smoke, `FIXTURE_BLOCKED_AFTER`, `PROVIDER_BLOCKED_AFTER` and
`VISUAL_STEPS_NOW_UNLOCKED` remain unclaimed. After runtime proof, update the
canonical `docs/user-guide/VISUAL_FIXTURE_MANIFEST.md` and add a row per visual
step with:

```text
VISUAL_STEP | PREVIOUS_BLOCKER | UAT_FIXTURE | UAT_ROUTE |
NOW_CAPTURABLE | PROVIDER_STILL_REQUIRED
```

The current step-by-step matrix is maintained at
[`uat-visual-unlock-matrix.md`](uat-visual-unlock-matrix.md). Its current
calculation remains `FIXTURE_BLOCKED_AFTER=60`, `PROVIDER_BLOCKED_AFTER=5` and
`VISUAL_STEPS_NOW_UNLOCKED=0` until runtime proof exists.

The current implementation unlocks the mechanism and the reusable graph; it
does not itself approve Help screenshots or close the visual coverage goal.

## Current environment classification

```text
ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO
UAT_RUNTIME=https://antifake.io.vn
UAT_API=https://api.antifake.io.vn
SEPARATE_UAT_PROVISIONING_REQUIRED=NO
RESOLVED_BY_OWNER_ENVIRONMENT_CLARIFICATION=YES
```

The classification is an owner-provided environment boundary. The fixture
write guard additionally requires the injected mutation-approval flag, the
sanitized database identity and the exact database-host allowlist before any
additive write. Browser evidence remains pending until the approved target is
reachable from the automation session.
