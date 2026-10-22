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
Released frontend SHA: 3f7e31c7e0e7c6cab6629a125dc6e68b584cf5bf.
PR CI 39713566601 and post-merge CI 39714452186 passed.
Deployment 39714452220 succeeded. Public deployed entry: /assets/index-BAmKuWrf.js.
The merged frontend temporary branch was deleted remotely and locally.

Deployed-asset smoke used synthetic API fixtures for all three flows at 1440/768/390.
QR measured 250px in all 9 combinations, red guide rgb(165,0,23), three steps, correct
side-by-side/stacked layout, zero horizontal overflow and zero page errors.
See [deployed-smoke.json](../evidence/payos-original-layout/deployed-smoke.json)
and deployed-mocked screenshots in the same evidence directory.

DNS limitation: normal system/Chrome resolution returned ERR_NAME_NOT_RESOLVED;
Google DNS-over-HTTPS returned SERVFAIL while Cloudflare returned 103.173.226.189.
Smoke therefore used a browser-scoped hostname mapping to that Cloudflare answer,
retaining HTTPS validation. No system/server DNS was changed. Deployment is verified;
unqualified normal-DNS reachability cannot be claimed from this environment.

Previous lifecycle documentation/evidence was pending commit when an earlier tool
usage limit stopped the handoff. It is finalized in this WorkSpace change without
modifying the already deployed backend.

## Native PayOS follow-up (2026-10-22)

The custom SVG QR and the added form/status buttons did not match the requested
PayOS appearance. Pending payments now open the official embedded checkout by
default, preserving its QR/transfer tabs, central VietQR mark and provider icons.
The red guide, outer method icons, Back/Support, countdown and compact cancellation
remain. Automatic server reconciliation remains every 5 seconds and on focus.

The official SDK concatenates RETURN_URL into redirect_uri without escaping. Our
durable payment URL includes multiple query parameters; encode it before passing
it into the SDK so flow/reference/shopId remain inside redirect_uri. Clear the SDK
container on entry and cleanup, and clean up before DOM removal. There is no
custom QR/form toggle to reuse an imperatively modified div as a React SVG host.
SDK callbacks request reconciliation only; they do not set PAID or cancel locally.

The provider controls QR size and artwork inside its cross-origin iframe. The
outer iframe is at most 360px wide and 360px high, responsive and unscaled. The
earlier 250px custom-SVG measurement above does not apply to this revision.

Regression tests verify native checkout default, nested callback query, exactly
one iframe after automatic polling, absence of added buttons, refresh/reopen,
cancellation and terminal/expiry/retry handling for all 3 flows. Browser tests use
SDK/API fixtures applied to the entire isolated context, including reopened tabs.
They verify the outer layout at 320/390/768/1024/1440, not the live provider artwork.
No real payment link, transfer or production financial mutation is performed.
Live-provider acceptance and internal rendering require a suitable authorized
payment session; mocked browser tests alone cannot establish them.

Local validation: ESLint and TypeScript/build passed; 11 unit tests and 12 browser
scenarios passed (57.8s). Build retains the existing large-chunk warning.
Frontend commit d10c670d89d26830254ecbc90327db3c2c0aaf3f, PR #3:
https://github.com/Ecommerce-Anti-Fake/Front-End/pull/3
Follow-up test commit e698c0d9d9884c07271b1ffbe40738768957c975 allows 8s
for the 5s automatic poll. Initial CI 39752059636 exposed this timing boundary
(11 passed, ORDER poll assertion timed out); it was corrected without changing
application behavior. Targeted three-flow expiry/poll tests passed locally.
PR CI 39752535950 passed. PR #3 merged as
d216d35d7f820d98168823012d504b2fb634a6d9.
Deployment 39752910213 passed. Public entry is /assets/index-PQK7Awul.js.
Deployed-asset smoke passed all 9 flow/viewport combinations (1440/768/390),
with one iframe, complete flow/reference/shop callback values, red guide, three
steps, no added buttons, no overflow and zero page errors. API and SDK are mocked
and PayOS network/service workers are blocked in this smoke; it does not verify
live-provider acceptance/artwork. See native-deployed-smoke.json in the evidence
directory. Post-merge CI 39752910564 passed on d216d35.
The merged frontend temporary branch was deleted remotely and locally.

## Provider INVALID_PARAM correction and clearer Cancel (2026-10-22)

This section supersedes the earlier assumption that percent encoding a durable
query URL was sufficient. The previous mocked SDK checks did not establish real
provider acceptance. A read-only browser A/B check reused the existing payment
reported in the screenshot: both encoded and unencoded query-bearing redirect_uri
values rendered the provider INVALID_PARAM message; a plain origin + /payment
rendered the QR and transfer tabs. No new link, cancellation or transfer was used.
The precise existing wallet row was read inside BEGIN READ ONLY / ROLLBACK.
Identifiers, bank details and QR payload are not stored in this evidence.

The SDK now receives a canonical path-only return URL. The parent URL retains
flow/reference/shopId for refresh/reopen; callbacks continue to request server
reconciliation only. Financial logic, API and DB are unchanged. Cancel is now a
42px outlined red button with 14px semibold text and a pale red background.
Confirmation and server-confirmed cancellation remain required.

Regression: ESLint, TypeScript/build, 11 unit tests and 12 browser scenarios passed
(51.1s). Unit/browser checks assert the path-only provider URL and independent
parent identity for all three flows. Pre-release live-provider checks used the
existing link and actual SDK with a request-scoped path override, internal API
fixtures, at 1440/768/390 for all three FE presentations: all 9 passed; switching
to transfer details succeeded for each flow, with zero page errors. This reuses
one real provider link; it does not establish three distinct financial payments.
See provider-before-path-override.json. Post-deploy checks must repeat without
any URL override before reporting this issue fixed.

Dependency audit (unchanged lockfile): npm audit --omit=dev reports six existing
high findings; no dependency changes or automatic audit fixes are in this UI fix.
PR: https://github.com/Ecommerce-Anti-Fake/Front-End/pull/4
Source commit: 8505c46bce87f8192216392c72d7726a3349d863.
PR CI 39757582927 passed. Merged SHA 098779e7a63d6700e0512b34ff73c230f809dfa1;
post-merge CI 39758258288 and deployment 39758257975 passed. Deployed entry:
/assets/index-D5MD2h-q.js. The merged frontend temporary branch was removed
remotely and locally after checking ancestry and successful CI/deploy.

Post-deploy outer-layout/URI smoke: all 9 flow/viewport combinations passed with
no URL override, correct path-only redirect_uri, retained parent identity, one
iframe, no overflow and zero page errors. Cancel measures 42px minimum with
1px red border; confirmation opens and dismisses without a cancel request.
See redirect-deployed-smoke.json and cancel-clear-{1440,768,390}.png. This smoke
uses API/SDK fixtures and is not evidence of live QR rendering.

Live-provider post-deploy attempt did NOT pass the QR acceptance check: the
existing link had expired by the time deployment finished. Actual SDK/provider
message was type error, message "Link thanh toán đã hết hạn."; the SDK removed
its iframe. The test uses a mocked PENDING API response, so that blank mock frame
is not evidence of the real backend returning PENDING or an expiry business bug.
A separate READ ONLY count found zero PENDING wallet links with expires_at > now().
No new production link was created to work around this limitation. End-to-end
post-deploy live QR acceptance remains pending an authorized unexpired payment
session. Do not present mocked checks as live-provider acceptance.
