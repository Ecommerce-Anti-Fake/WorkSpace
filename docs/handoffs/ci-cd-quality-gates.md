# CI/CD Quality Gates

## Status

Task 16 completed on 2026-06-08 for repeatable backend/frontend quality gates and deployment script documentation.

## Scope

The workspace is split into two git repositories, so CI workflows live in each repo:
- `back-end/.github/workflows/quality-gates.yml`
- `front-end-web/.github/workflows/quality-gates.yml`

Backend gate:
- `npm ci`
- `npm run test:ci`
- `npm run build:deploy`

Frontend gate:
- `npm ci`
- `npm run ci:quality`

Failing tests or builds fail the GitHub Actions job, which blocks merge when the repository enables the workflow as a required status check.

## Backend CI Tests

`npm run test:ci` intentionally runs selected high-signal tests instead of the full local suite:
- API gateway health and rate limit tests.
- Realtime event foundation tests.
- Notification realtime delivery tests.
- Buyer report flow test.
- payOS webhook and retry-payment tests.

This keeps CI deterministic without requiring production secrets, Redis, Firebase Admin, GHN, payOS, or a live database.

## Required Environment

Backend CI uses safe placeholders:
- `CI=true`
- `REDIS_ENABLED=false`
- `DATABASE_URL=<runner-provided local CI PostgreSQL URL>`
- `DEPLOY_SMOKE_BASE_URL=http://127.0.0.1:3001`

Frontend CI uses safe placeholders:
- `VITE_API_BASE_URL=http://127.0.0.1:3001`
- `VITE_FIREBASE_*` placeholder values only for compile-time config.

Do not store these production secrets in CI logs or repo files:
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `PAYOS_*`
- `GHN_*`
- `REDIS_URL`
- production `DATABASE_URL`
- provider livestream credentials or stream keys

## Deployment Scripts

Backend deploy entry points remain:
- `npm run deploy:start`: merge Prisma schema, run Prisma migrations through `scripts/prisma-migrate-deploy-with-retry.js`, then start local microservices plus API gateway through `scripts/start-deploy.js`.
- `npm run smoke:deploy`: call `GET /api/health` after deployment.

`scripts/prisma-migrate-deploy-with-retry.js` preserves Prisma advisory locking and retries only transient `P1002` / busy advisory-lock failures. Defaults are 5 attempts with a 15 second delay; override with `PRISMA_MIGRATE_DEPLOY_ATTEMPTS` and `PRISMA_MIGRATE_DEPLOY_RETRY_DELAY_MS`.

The deployment smoke requires the API gateway to be running and should be configured with:

```bash
DEPLOY_SMOKE_BASE_URL=https://api.example.com npm run smoke:deploy
```

Passenger adds independent entry points without changing the existing deploy
scripts:

- `npm run build:passenger`: merge Prisma schema, generate Prisma Client, then
  build the API Gateway/Passenger artifacts.
- `npm run start:passenger`: load `passenger.js`; it never runs migrations.
- cPanel deployment and manual migration instructions:
  `docs/DEPLOY_CPANEL_PASSENGER.md`.

## Verification

- `npm run ci:quality` in `back-end` passed.
- `npm run ci:quality` in `front-end-web` passed.
- 2026-07-28 Passenger preparation: focused runtime tests passed (2 suites,
  12 tests), `npm run build:deploy`, `npm run build:passenger`, and
  `npm run test:ci` passed (7 suites, 25 tests). Targeted ESLint,
  `node --check passenger.js`, and `git diff --check` also passed.

## Recommended Next Step

Move to Task 17: UAT package and final launch walkthrough.
