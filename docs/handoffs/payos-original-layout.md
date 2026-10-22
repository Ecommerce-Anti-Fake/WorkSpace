# PayOS original layout restoration — 2026-10-22

Reference: Front-End commit 3fe1ce156d661bf6a45df0ebf8ecb2e8a999faae.
Scope: presentation only; no backend/API/database/financial changes.

Restored the original header typography, colors, CSS, white left QR card, red
three-step guide, decorative wallet watermark and method icons. Back and Support
use the original buttons below the guide. QR is centered with padding, 250px on
desktop and 390px mobile, shrinking within smaller containers. Countdown/status,
status check, explicit cancellation and retry remain compact inside the QR card.
Statuses are displayed in Vietnamese. Embedded PayOS/transfer form stays available.

The original reference CSS is preserved verbatim before the small appended QR/control
rules. The lifecycle implementation from type declarations through effects/handlers
is byte-equivalent after newline normalization to pre-restoration ec8c7b5.
No revert of lifecycle code was performed.

Validation: full ESLint, TypeScript/build and 11 unit tests pass; 12 mocked browser
scenarios cover all 3 flows. Widths 320/390/768/1024/1440 verify QR bounds, no horizontal
overflow, red guide, 3 steps and Support button; 1440 verifies side-by-side layout,
390/768 verify stacked layout. Existing refresh/reopen/resume/cancel/PAID/expiry/retry
scenarios remain enabled. Real financial transactions were not performed.

Screenshots (mocked payment payload):
- [Desktop 1440](../evidence/payos-original-layout/qr-1440.png)
- [Tablet 768](../evidence/payos-original-layout/qr-768.png)
- [Mobile 390](../evidence/payos-original-layout/qr-390.png)

Files: paymentModel.tsx, paymentModel.css and e2e/payos-lifecycle.spec.ts only.
PR: https://github.com/Ecommerce-Anti-Fake/Front-End/pull/2
Release SHA, CI and deployment verification will be appended after completion.

Previous lifecycle documentation/evidence was pending commit when an earlier tool
usage limit stopped the handoff. It is finalized in this WorkSpace change without
modifying the already deployed backend.
