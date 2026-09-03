# ADR-001: Isolated UAT synthetic fixtures

- Status: `Accepted for repository implementation; runtime provisioning pending`
- Date: 2026-09-03
- Scope: AntiFake visual-evidence fixture environment

## Context

The existing application has a broad destructive Prisma seed, but production
deploy workflows are the only represented deployment target. The remaining
visual evidence is blocked by the absence of safe role/business fixtures. The
workspace has no local PostgreSQL, Redis, Docker or already-provisioned UAT
frontend/backend target.

## Decision

Use a separate UAT frontend/backend deployment backed by a separate PostgreSQL
database. Prefer `uat.antifake.io.vn` and `api-uat.antifake.io.vn`; use local
loopback only when it runs the same application against an isolated database.
Reuse the existing Nest/Prisma/Vite runtime and seed phases. Add a guarded
`uat:reset` sequence, a read-only `uat:verify` contract, a dedicated Playwright
config, and manual UAT workflows.

Every destructive path must prove `UAT_ENVIRONMENT=true`, non-production mode,
database-name/target separation, explicit isolation confirmation and an exact
remote database host allowlist. The UAT seed accepts injected account
password/QR/key values only; no secret or QR plaintext is stored in source or
WorkSpace.

## Alternatives rejected

- Production synthetic rows: unsafe for mutation-driven visual capture and
  rejected by the seed guard.
- A shared production schema: application/database permissions would not give
  the required failure boundary.
- A second fixture framework: the existing Prisma seed graph is reusable and
  already covers the required domain models.
- A mocked-only browser target: it cannot prove real route, auth, database or
  provenance behavior.

## Consequences

The repository can be reset and verified repeatably once an isolated target and
secure environment secrets are supplied. Provider completion, realtime
two-session delivery and browser visual approval remain separate runtime
evidence decisions. Production deployment workflows are unchanged and do not
trigger UAT reset.

See [`../handoffs/uat-fixture-environment.md`](../handoffs/uat-fixture-environment.md)
for the operational runbook and [`../user-guide/VISUAL_FIXTURE_MANIFEST.md`](../user-guide/VISUAL_FIXTURE_MANIFEST.md)
for the fixture inventory.
