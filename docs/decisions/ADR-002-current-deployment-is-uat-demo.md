# ADR-002: Classify the current AntiFake deployment as UAT demo

- Status: `Accepted; supersedes the provisioning assumption in ADR-001`
- Date: 2026-09-04
- Scope: AntiFake visual-evidence fixture environment

## Context

The owner clarified that `https://antifake.io.vn` and
`https://api.antifake.io.vn` are the project's current UAT/demo runtime, not a
live customer-production environment. Earlier fixture documentation assumed
that a separate UAT deployment still had to be provisioned.

## Decision

Use the existing deployment for additive visual fixtures. Do not create a
second VPS, `uat.antifake.io.vn`, `api-uat.antifake.io.vn`, DNS route or
duplicate deployment workflow.

The application and fixture tooling must still prove the database boundary:

- `ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO` is required for the classified runtime.
- `UAT_DEMO_DATABASE_TARGET`, `UAT_DEMO_DATABASE_NAME` and
  `UAT_DEMO_DATABASE_HOST_ALLOWLIST` identify the demo database without
  exposing a connection string.
- `UAT_DEMO_PRODUCTION_DATABASE_TARGET` must differ from the demo target.
- `UAT_DEMO_MUTATION_APPROVED=true` is required only for additive fixture writes.
- `uat:reset` remains reserved for a separately isolated disposable database.

The current fixture command is `npm run uat:ensure`, followed by the
read-only `npm run uat:verify-demo`. Both paths fail closed when the expected
classification or database identity is absent.

## Consequences

The previous external-provisioning blocker is resolved by owner clarification,
while payment, payout, GHN booking, external KYC, public livestream and
unverified provider upload actions remain independently blocked. Historical
evidence that used the word “production” is retained where it records a past
check; new canonical fixture documentation uses `UAT_DEMO`.
