# Risk Score Lifecycle Handoff

Last updated: 2026-05-21

## Feature Overview
Risk score MVP is implemented for shop, offer, and batch targets. Scores are persisted in existing `RiskScore` rows and shown in admin UI with factor details.

## Completed Work
- Added admin APIs:
  - `GET /orders/admin/risk-scores`
  - `POST /orders/admin/risk-scores/recalculate`
- Added orders use cases:
  - `CalculateRiskScoreUseCase`
  - `ListAdminRiskScoresUseCase`
  - `RecalculateRiskTargetsUseCase`
- Risk target types:
  - `SHOP`
  - `OFFER`
  - `BATCH`
- Risk factors:
  - open/in-review report count
  - resolved/rejected report history
  - open dispute count
  - refunded dispute count
  - rejected/pending verification document or status count
  - missing offer/batch provenance
  - low average rating when at least 3 reviews exist
- Risk levels:
  - `LOW`: score < 30
  - `MEDIUM`: score >= 30
  - `HIGH`: score >= 60
  - `CRITICAL`: score >= 80
- Triggers:
  - report creation
  - report status update
  - dispute opening
  - admin dispute resolution
  - manual admin recalculation
- Risk changes write `RISK_SCORE_RECALCULATED` audit logs on the affected target.
- `HIGH` and `CRITICAL` scores now create or escalate idempotent `ModerationCase` records for the same `SHOP`, `OFFER`, or `BATCH` target.
- Admin dashboard now has a `Điểm rủi ro` section with manual recalculation and factor display.
- `front-end-web/API_COVERAGE.md` includes the new risk routes.

## Verification
- `npm test -- calculate-risk-score.use-case.spec.ts update-admin-moderation-case.use-case.spec.ts` passed.
- Prior trigger coverage: `npm test -- create-report.use-case.spec.ts open-order-dispute.use-case.spec.ts resolve-admin-dispute.use-case.spec.ts` passed.
- `npm run build` in `front-end-web` passed.
- `npm run build` in `back-end` passed.

## Constraints
- No schema migration was added. Existing `RiskScore` has no unique `(targetType, targetId)` constraint, so repository updates the latest row for a target or creates one if absent.
- Full moderation automation is covered in `moderation-case-automation.md`.
- Product review creation currently does not trigger recalculation directly; manual recalculation and report/dispute triggers cover the MVP.

## Recommended Next Feature
Task 9 finance reconciliation dashboard.
