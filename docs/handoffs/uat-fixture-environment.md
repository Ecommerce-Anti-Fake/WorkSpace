# AntiFake isolated UAT fixture environment

Status: `IMPLEMENTED_LOCALLY_WAITING_FOR_ISOLATED_TARGET`
Reconciled: 2026-09-03

This handoff is the rebuild/reset runbook for the separate synthetic-fixture
goal. It does not close or reset `ANTIFAKE VISUAL COVERAGE COMPLETION.md`.
The general functional baseline remains `237/237 applicable passed`; that UAT
was not rerun for this change.

## Current architecture discovery

| Area | Finding |
|---|---|
| Front-End | Vite SPA. Existing Playwright config supports an injected `UAT_BASE_URL`, fresh browser contexts, and `1440x900` / `390x844` projects. |
| Back-End | Nest API gateway with embedded deployment entrypoint. Prisma is PostgreSQL-only. Existing schema covers users, KYC, shops, offers/variants, inventory, orders, QR provenance, chat, community, affiliate, wallet, vouchers and moderation. |
| WorkSpace | Latest pushed `main` read through `FETCH_HEAD` at `1d9a004b78b36082ddd9208d0f92fbdcdf3c2b12`. Local documentation follow-ups are preserved and are not treated as the pushed baseline. |
| CI/CD | Discovery found production quality/deploy workflows only and no existing staging/UAT target. This implementation adds manual UAT fixture, browser-smoke and VPS deploy workflows; no production trigger was changed. |
| Infrastructure | No local PostgreSQL, Redis, Docker or existing UAT DNS target is available in this workspace. Runtime/browser proof therefore remains an external provisioning gate. |
| Providers | PayOS, GHN, Agora, Cloudinary, Firebase, Redis/Socket.IO and VietQR/payout are environment-driven. No provider secret is stored in this repository. |

## Selected target architecture

Use the smallest real-runtime target that is available:

1. A separate PostgreSQL database (preferred) and a separate API process.
2. A separate frontend deployment configured with `VITE_API_BASE_URL` and
   `VITE_SOCKET_URL` for that API.
3. Preferred hostnames are `uat.antifake.io.vn` and
   `api-uat.antifake.io.vn`; local `127.0.0.1` is an equivalent development
   target for the same compiled application when the UAT database is local.
4. The API may use the existing embedded Nest deployment entrypoint, but its
   process, environment, PM2 name and reverse-proxy route must be distinct
   from production.

The UAT API must receive only the UAT database URL. The fixture guard rejects
production mode, production hostnames, production-looking database targets,
missing isolation confirmation and remote database hosts outside an explicit
allowlist.

## Environment boundary

The UAT environment is identified by these injected values:

| Variable | Meaning |
|---|---|
| `UAT_ENVIRONMENT=true` | Enables destructive UAT commands. |
| `NODE_ENV=uat` | Prevents production process configuration. |
| `DATABASE_URL` | UAT-only PostgreSQL connection string. Never document its value. |
| `UAT_DATABASE_TARGET` | Non-secret target label, such as `antifake-uat-postgres`. |
| `UAT_DATABASE_NAME` | Expected database name; it must match the URL database path. |
| `UAT_DATABASE_HOST_ALLOWLIST` | Comma-separated exact remote DB hosts, if remote. |
| `UAT_ISOLATION_CONFIRMED=true` | Operator/deployment assertion checked by code. |
| `UAT_PRODUCTION_DATABASE_TARGET` | Non-secret production target label used for separation comparison. |
| `UAT_FRONTEND_PUBLIC_URL` | UAT frontend URL used in seeded affiliate links and visible metadata. |
| `UAT_TEST_PASSWORD` | Securely injected password for synthetic accounts. |
| `UAT_QR_CODE` | Securely injected known test code; only its hash is stored and verified. |
| `PAYOUT_ACCOUNT_ENCRYPTION_KEY` | UAT-only encryption key required by synthetic wallet seed data. |

The repository contains only `.env.uat.example` templates. Values belong in a
secret manager, CI environment secrets, or an ignored local `.env.uat.local`.
Never put credentials, connection strings, QR plaintext, provider keys, JWT
secrets, tokens or personal data in WorkSpace documentation.

## Isolation record

These are the values future operators must record for the provisioned target;
only labels and methods belong in this document:

| Record | Required value |
|---|---|
| `UAT_DATABASE_TARGET` | Injected non-production target label |
| `PRODUCTION_DATABASE_TARGET` | Injected production target label only; never its URL or credentials |
| `ISOLATION_METHOD` | Separate PostgreSQL database plus runtime target/name/host guards |
| `MIGRATION_METHOD` | `prisma:merge` followed by `prisma migrate deploy` |
| `SEED_METHOD` | Guarded `npm run uat:reset`, which invokes `db:seed` and then `uat:verify` |

The API, frontend and reverse-proxy process names must be distinct from their
production counterparts. A UAT deployment is not accepted if its database
user can connect to the production database or if its host is not explicitly
allowlisted.

## Reset and seed procedure

Run from `back-end` with the UAT environment injected or loaded from an ignored
file:

```text
npm run uat:reset
npm run uat:verify
npm run uat:start
```

`uat:reset` performs the following guarded sequence:

```text
assert UAT target and database separation
  -> prisma migrate deploy
  -> clear the disposable UAT database
  -> seed synthetic base identities and domain graph
  -> verify required fixture relationships and positive QR provenance
```

The reset is intentionally destructive only to the database that passes the
guard. It is not a production seed command and must not be run with
`SEED_ALLOW_HOSTED_DB` or an equivalent bypass. The ordinary `db:seed` path is
also guarded so a caller cannot bypass the wrapper accidentally.

Build the backend before starting the API (`npm run build:deploy`). The UAT
start wrapper loads an ignored `UAT_ENV_FILE` when supplied, proves the same
database boundary and UAT frontend URL, then starts the compiled gateway. A
production deployment continues to use its existing start path.

Logical account aliases are `BUYER_UAT`, `SELLER_UAT`, `AFFILIATE_UAT` when
the affiliate state is required, and `ADMIN_UAT`. Their email values and the
password are injected, not documented. All seeded names, addresses, shops,
products, posts and messages use the synthetic UAT namespace.

## UAT deployment contract

The repositories now provide manual-only deployment workflows matching the
existing VPS/PM2/Nginx model:

```text
back-end/.github/workflows/uat-deploy.yml
Front-End/.github/workflows/uat-deploy.yml
```

Both workflows require the GitHub `uat` environment and the same dedicated UAT
VPS credentials. They do not run on a production push. Before deployment they
require the remote marker file (default `/etc/antifake/uat-target`) to contain
exactly `antifake-uat`, and reject production-looking application paths,
process names, environment-file paths and health URLs.

Configure only non-secret labels/paths as UAT environment variables:

| Variable | Purpose |
|---|---|
| `UAT_BACKEND_APP_DIR` / `UAT_FRONTEND_APP_DIR` | Separate checked-out application paths containing `uat`, `staging` or `test` |
| `UAT_BACKEND_APP_NAME` | Dedicated PM2 process name containing `uat`, `staging` or `test` |
| `UAT_BACKEND_ENV_FILE` / `UAT_FRONTEND_ENV_FILE` | Host-side UAT environment files; production paths are rejected |
| `UAT_BACKEND_HEALTH_URL` / `UAT_FRONTEND_HEALTH_URL` | Non-production health URLs only |
| `UAT_HOST_MARKER_PATH` | Optional path to the exact UAT host marker |

Configure these as GitHub `uat` environment secrets, without recording values:
`UAT_VPS_HOST`, `UAT_VPS_USER`, `UAT_VPS_SSH_KEY` and `UAT_VPS_PORT`. The
backend environment file must contain the guarded database/provider settings;
the frontend environment file contains only the public Vite UAT settings.
The backend workflow builds, migrates, resets/seeds/verifies and starts the
UAT API. The frontend workflow builds with Vite `uat` mode, atomically swaps
the static bundle, reloads Nginx and checks the UAT URL.

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
| PayOS | Checkout screens; payment completion | No UAT values | Not verified | No | NOT_EXPOSED / no UAT injection | Completion is production-only until sandbox is approved | Isolated PayOS sandbox and UAT secrets |
| GHN | Shipping option/quote UI; booking/tracking boundary | Template only | Not verified | No | NOT_EXPOSED / no UAT injection | Booking must stay outside production | Approved UAT/sandbox account and cleanup |
| Agora | Seeded live metadata and live UI route | Template only | Not verified | No | NOT_EXPOSED / no UAT injection | Real room/token is production-only until isolated | UAT room, token config and browser proof |
| Socket.IO/Redis | Chat history; realtime when isolated | Yes: in-process without Redis; isolated `REDIS_*` optional | N/A infrastructure | Local in-process only | Not required for local mode | No | Reachable UAT API and two isolated browser sessions |
| Cloudinary | Seeded media rendering | Template only | Not verified | No | NOT_EXPOSED / no UAT injection | Upload is production-only until UAT folder/prefix exists | UAT folder/prefix and cleanup |
| Firebase | Local-account auth bridge where configured | Template only | Not verified | No | NOT_EXPOSED / no UAT injection | Production project must not be reused | UAT Firebase project/bridge and injected credentials |
| VietQR/payout | Synthetic balance, ledger and withdrawal read views | Template only; encryption key required for seed | Not verified | No payout calls | NOT_EXPOSED / no UAT injection | Payout execution is production-only | UAT bank lookup/payout sandbox; no financial liability |

Provider status is runtime evidence, not inferred from seed rows. Each future
provider test must record configuration availability, sandbox availability,
secret presence (boolean only), safe-to-call decision and the current blocker.

## Browser capture procedure

Use the dedicated Playwright UAT config and a newly created isolated browser
profile. Do not supply a personal Chrome `user-data-dir` or production storage
state.

```text
UAT_BASE_URL=https://uat.antifake.io.vn
UAT_FIXTURE_SMOKE=true
npm run test:e2e:uat
```

The command uses injected account variables (`UAT_USER_EMAIL`,
`UAT_SELLER_EMAIL`, `UAT_ADMIN_EMAIL`, `UAT_TEST_PASSWORD`) and the injected
`UAT_QR_CODE`. It runs representative buyer, QR, order, seller, chat,
community and Admin routes at both required viewports when the target is
available. Skipped tests mean the target/credentials were not supplied; they
are not a pass.

## Cleanup and troubleshooting

- Reset by rerunning `npm run uat:reset`; this discards all disposable UAT
  state and recreates the graph.
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

Until a real isolated target passes the reset, verification and browser smoke,
`FIXTURE_BLOCKED_AFTER`, `PROVIDER_BLOCKED_AFTER` and
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

## External provisioning gate

The remaining non-repository decision is an isolated PostgreSQL target plus its
securely injected UAT secrets. For the VPS path, provision the separate host,
the `/etc/antifake/uat-target` marker (or an explicitly configured equivalent),
the UAT environment variables, and the GitHub `uat` environment secrets/vars
listed above. DNS/reverse-proxy and CI environment secrets are optional when
using a local UAT API, but a real browser/runtime verification still needs a
reachable UAT frontend/backend pair. No production deployment or production
data change is part of this gate.
