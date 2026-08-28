# Moderation Case Automation Handoff

Last updated: 2026-05-21

## Feature Overview
Moderation case automation is implemented on top of the existing `ModerationCase` table. Admins now have a single authenticated queue for report, dispute, shop, offer, and batch cases.

## Completed Work
- Added admin APIs:
  - `GET /orders/admin/moderation-cases`
  - `PATCH /orders/admin/moderation-cases/:caseId`
- Existing report/dispute case creation remains in place:
  - report creation opens/updates `REPORT` cases
  - dispute assignment/update/resolve keeps `DISPUTE` cases in sync
- Risk-score automation:
  - `HIGH` risk opens or updates an `IN_REVIEW` case
  - `CRITICAL` risk opens or escalates an `ESCALATED` case
  - target types are `SHOP`, `OFFER`, and `BATCH`
  - creation is idempotent by latest `(targetType, targetId)` case; resolved/closed cases allow a new case on fresh high risk
- Case resolution:
  - admin can set `ASSIGNED`, `IN_REVIEW`, `ESCALATED`, `RESOLVED`, or `CLOSED`
  - `RESOLVED` and `CLOSED` set `resolvedAt`
  - updates write `MODERATION_CASE_UPDATED` audit logs on the underlying target
  - automated creation/escalation writes `MODERATION_CASE_AUTOMATED` when actor context exists
- Admin UI:
  - new `Moderation case` section in `front-end-web/src/pages/admin-page.tsx`
  - lists target type, target id, reason, status, assignee, creation time
  - supports case status/note update
- `front-end-web/API_COVERAGE.md` includes the moderation case routes.

## Verification
- `npm test -- calculate-risk-score.use-case.spec.ts update-admin-moderation-case.use-case.spec.ts` passed in `back-end`.
- `npm run build` passed in `back-end`.
- `npm run build` passed in `front-end-web`.

## Constraints
- No Prisma migration was added. The automation reuses `ModerationCase.targetType` and `targetId`.
- KYC/shop document review already has its own admin review workflow. This task exposes the generic case queue and risk-driven shop/offer/batch automation; deeper document-to-case automation can be added if the project needs every rejected document to create a separate case.
- Browser smoke was not rerun with live backend + frontend in this slice; compile/build verification passed.

## Recommended Next Feature
Task 9 finance reconciliation dashboard.
