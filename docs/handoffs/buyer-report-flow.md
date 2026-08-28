# Buyer Report Flow Handoff

Last updated: 2026-05-20

## Feature Overview
Buyer-facing report MVP is implemented for suspicious orders, offers, and shops. Reports feed the admin queue and create moderation/audit inputs for later risk scoring.

## Completed Work
- Added authenticated report APIs:
  - `POST /orders/reports`
  - `GET /orders/reports/mine`
  - `GET /orders/admin/reports`
  - `PATCH /orders/admin/reports/:reportId`
- Added report contracts/RPC messages in `@contracts`.
- Added orders use cases:
  - `CreateReportUseCase`
  - `ListMyReportsUseCase`
  - `ListAdminReportsUseCase`
  - `UpdateAdminReportUseCase`
- Report creation validates:
  - target type is `ORDER`, `OFFER`, or `SHOP`
  - order target belongs to the buyer or buyer shop owner
  - target exists
  - same reporter cannot create another open/in-review report for the same target
- Report creation writes:
  - `Report` row with `OPEN` status
  - `ModerationCase` row with target type `REPORT`
  - `REPORT_CREATED` audit log
- Admin update writes `REPORT_STATUS_CHANGED` audit log and keeps the report moderation case in sync.
- Frontend:
  - buyer order page can report an order and lists recent submitted reports
  - offer detail can report the offer or shop
  - admin dashboard has a `Báo cáo` section for report queue/status updates
- `front-end-web/API_COVERAGE.md` includes the new report routes.

## Verification
- `npm test -- create-report.use-case.spec.ts` in `back-end` passed.
- `npm run build` in `back-end` passed.
- `npm run build` in `front-end-web` passed.

## Constraints
- No schema migration was added. The existing `Report.reason` stores reason plus optional description text.
- Risk scoring is not recalculated yet; reports now provide data/audit inputs for Task 5.
- Report evidence uploads are not separate from dispute evidence in this MVP.

## Recommended Next Feature
Task 5 risk score lifecycle.
