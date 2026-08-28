# AntiFake UAT report — production evidence (partial sign-off)

## Phạm vi

Đợt này bắt đầu từ source inventory của hai repository, seed audit, frontend
route audit và production browser smoke. Đây chưa phải sign-off toàn hệ thống:
buyer, seller, affiliate, checkout/payment, provider, realtime và mutating flows
vẫn còn ngoài phạm vi chạy an toàn.

## Môi trường và commit

- Frontend repository: `https://github.com/Ecommerce-Anti-Fake/Front-End`
- Backend repository: `https://github.com/Ecommerce-Anti-Fake/Back-End`
- Website: `https://antifake.io.vn`
- Current Front-End deployed revision: `13c18f4`; deployment run `33149975815`
  completed successfully.
- Current Back-End local revision: `3b59ab9`; repository remained clean after
  the non-mutating audit.
- Current reconciled production UAT evidence remains recorded against Front-End
  `8157ffa`: 246 discovered, 237 applicable passed,
  0 failed, 3 not applicable audit/source records and 6 unsafe hosted
  local-only executions across Desktop/Laptop/Mobile. Historical revisions and
  earlier baseline counts remain below as audit history.
- Fresh post-deploy health check 2026-08-28 returned HTTP 200 for both
  `https://antifake.io.vn/` and `https://api.antifake.io.vn/api/health`; the
  Journey Center page served `/assets/index-XCtZYzZQ.js` and
  `/assets/index-ClA14ylN.css`.
- Deployment status: Completed; website health check trả HTTP 200.

## Kết quả định lượng

### Historical production browser regression — 2026-08-27 (superseded)

- Playwright scheduled 246 tests across Desktop, Laptop and Mobile.
- Passed: 198.
- Declared credential/local/runtime skips: 48.
- Failed: 0.
- Scope: public, guest/permission, catalog, QR, quote-only Buy Now,
  backend-authorization, PWA, Help/Journey, profile, header and flash-sale
  regressions. No authenticated mutation or provider action was performed.

### Historical baseline retained

The following baseline and local-verification sections are retained as audit
history. They are not the current production sign-off.

### Production browser baseline

- Tổng số test case chạy: 7 desktop Playwright cases.
- Passed: 6 public routes (`/`, `/auth`, `/register`, `/community`, `/live`, `/qr`).
- Failed: 1 (`/admin` guest exposure).
- Blocked: 0 trong baseline không credential.
- Not applicable: 0.
- Console/network: public route smoke không thấy response 5xx; lỗi permission là
  route exposure, không phải backend API bypass evidence.

### Local verification after fix

- `npm.cmd run build`: passed; Vite còn cảnh báo chunk lớn.
- `npm.cmd run test:auth`: 3 passed.
- `npm.cmd run test:live`: 12 passed.
- `npm.cmd run test:payos`: 6 passed.
- Targeted ESLint trên changed files: passed.
- Full local Playwright matrix: 21 passed, 3 skipped vì credential env không có.
- Full `npm.cmd run lint`: failed baseline with 71 errors/8 warnings ở các file
  không thuộc slice này.
- Historical baseline audit: `npm.cmd audit --omit=dev --audit-level=high`
  reported 2 high React Router findings before remediation; the current audit
  result is recorded in the latest security follow-up below.

## Lỗi đã sửa

- Frontend: bọc toàn bộ `/admin` bằng role-aware `ProtectedRoute`.
- Backend: không sửa; inspected admin APIs đã có JWT, active-user và role guards.
- Permission: guest admin và checkout boundaries đã verified production trên ba viewport.
- UI: shop banner fallback đã cải thiện và verified production trước/sau.

## Các chức năng chưa hoàn thành hoặc bị block

- Admin seed login; seed source có trạng thái suspended cần xác minh dữ liệu thật.
- Buyer/seller/affiliate/admin authenticated walkthrough.
- Checkout/payment: chỉ được dùng sandbox/test mode; chưa có xác nhận runtime an toàn.
- Agora livestream: deployed variables/migration/authenticated media smoke chưa xác minh.
- Two-session chat, FCM permission, upload/PII/KYC, wallet withdrawal và admin
  mutating actions chưa chạy.
- Public/catalog/mobile regression đã chạy; authenticated role regression còn thiếu.

## Backend chưa có UI / frontend mock / API chưa nối

Chưa thể kết luận đầy đủ trước authenticated walkthrough. Source inventory cho
thấy backend có các nhóm distribution/provenance, moderation, withdrawal,
finance reconciliation, live Agora và payout controls; từng nhóm phải được đối
chiếu với UI thực tế trước khi đánh dấu `backend-only`. Không ghi nhận mock là API
thật nếu chưa xác minh qua network.

## Rủi ro còn lại

- Production frontend đã được xác minh qua remote SHA và browser behavior; cần tiếp tục
  xác minh mỗi commit mới theo chu trình deploy.
- Historical frontend full-lint/audit findings are retained below for
  traceability; the current Front-End lint/build and production audit gates are
  green. Backend test/build/Prisma validation is green, but its separate
  check-only lint remains open under `AF-TECH-002`; deployment and authenticated
  UAT remain separate sign-off gates.
- Seed admin suspended có thể chặn toàn bộ admin UAT.
- Payment/provider/Agora behavior chưa được chứng minh trong sandbox/staging.

## Next evidence required

1. Owner explicitly authorizes the specific production test identities needed for
   buyer/seller/affiliate/admin flows.
2. Cấp admin test account `active` hoặc xác nhận seed admin suspended là dữ liệu
   expected, không dùng workaround.
3. Xác nhận sandbox/test mode cho payment, upload/KYC, wallet mutation và Agora
   trước khi chạy các flow có side effect/provider.

## Cập nhật sau deployment — 2026-08-03

- Owner đã cho phép push và dùng test credentials trong browser automation.
- Frontend `origin/main` hiện trỏ tới `08bd6c841de9243fd634496181ca944d09e18581`.
  Commit `684ad2c` chứa route guard; `08bd6c8` sửa locator của test password.
- `https://antifake.io.vn/` trả HTTP 200 sau deployment.
- Production desktop: 9 cases, **8 passed, 1 failed**. Public routes 6/6,
  guest `/admin` redirect 1/1, non-admin `/admin` redirect 1/1; admin seed
  login không vào được console và vẫn ở `/auth`.
- Production mobile Chromium 390×844: 9 cases, **8 passed, 1 failed**, cùng
  kết quả admin seed login.
- Admin seed login là blocker dữ liệu/auth: seed source tạo admin với
  `accountStatus: suspended`; không bypass trạng thái này trong UAT.
- Evidence đã lưu tại `docs/images/`:
  `uat-guest-admin-redirect-desktop.png`, `uat-guest-admin-redirect-mobile.png`,
  `uat-admin-seed-login-blocked-desktop.png`.
- AF-UAT-001 đã được xác minh fixed trên production. Buyer/seller/affiliate
  walkthrough, checkout/payment sandbox, provider/Agora, chat hai session,
  wallet/withdrawal, upload/KYC và mutating admin flows vẫn chưa sign-off.

Các mục deployment pending trong phần interim phía trên được thay thế bởi cập
nhật này; báo cáo vẫn chưa phải sign-off toàn hệ thống vì các flow còn lại chưa
được chạy an toàn.

## Bổ sung sau AF-UAT-002 — 2026-08-04

- Post-deploy regression cho public/permission scope chạy 162 cases trên ba
  viewport: 74 passed, 87 skipped vì thiếu credential, 1 failure do laptop
  `/checkout` teardown timeout trước khi sửa.
- AF-UAT-002 đã được sửa bằng `bb276e1`; local build/ESLint/permission test đạt.
- Production retest sau deploy `bb276e1`: 6/6 permission cases passed:
  guest `/admin` và guest `/checkout` trên desktop, laptop và mobile.
- `/checkout` hiện không còn hiển thị địa chỉ, payment hoặc nút đặt hàng cho guest.
- Authenticated buyer/seller/affiliate/admin và các mutation/provider flows vẫn
  cần credential scope phù hợp hoặc sandbox an toàn; không được tính là passed.

## Bổ sung UI — AF-UAT-003

- Shop detail trước fix có vùng banner trống lớn khi asset chưa có/chưa tải.
- Đã thêm fallback branded responsive trong `551f194`; production retest sau
  `56e8831` đạt 3/3 viewport.
- Ảnh trước/sau được lưu dưới `docs/images/buyer/`; banner thật vẫn được giữ
  nguyên khi API trả asset hợp lệ.

## Cập nhật kiểm thử cuối phiên — 2026-08-04

- Frontend production remote cuối cùng đã xác minh: `8b68e5f` (auth negative path);
  UI/catalog behavior deployed từ `56e8831`.
- Production no-credential regression: public routes, catalog navigation,
  responsive overflow, guest admin/checkout boundaries và QR smoke đã chạy trên
  desktop 1440×900, laptop 1280×720, mobile 390×844.
- Catalog production: 12/12 product, shop, category và search navigation passed.
- Auth negative path: 3/3 synthetic invalid-login cases passed.
- Backend local gates: `npm.cmd run test:ci` 25/25 passed; `npm.cmd run build:deploy`
  passed. Repository-wide backend ESLint còn lỗi baseline Prettier/unsafe-type ở
  nhiều file; không dùng `--fix` để che unrelated debt.
- Playwright grouped files hiện có: auth, guest, buyer, seller, affiliate, admin,
  cart-checkout, orders, chat, live, QR, permissions, responsive và catalog.
- Không đưa password/token/cookie vào UAT deliverables; test credentials chỉ tồn
  tại trong process được owner cho phép, không ghi vào source hay docs.
- Backend authorization regression: `security.spec.ts` chạy 15 cases trên ba
  viewport, 15/15 trả 401/403 không token cho admin/cart/orders/affiliate.
- Frontend production latest test commit: `1ada271`; production health và
  protected API regression đã xác minh sau deployment.
- `006c541` tiếp tục sửa hai private-route exposure: `/wishlist` và
  `/messages/:roomId`; production permission regression 12/12 passed trên ba
  viewport.
- `a4ebcb8` bảo vệ payment callback routes và chặn false success state; production
  permission regression 21/21 passed trên desktop/laptop/mobile.

## PayOS callback follow-up — 2026-08-04

- Confirmed source defects: an order cancel fallback pointed to an undefined
  frontend route; the order return controller discarded PayOS query state; and
  wallet top-up crediting did not require nested provider `data.code === '00'`.
- Fixed and pushed: `Front-End:31a2569`, `Back-End:d031c51`.
- Local evidence: frontend PayOS tests 6/6; backend focused PayOS tests 17/17;
  frontend build pass; backend `build:deploy` pass; `git diff --check` pass.
- Production post-push check is currently blocked by deployment: the site still
  serves the previous `index-1Ohj73sp.js` bundle, and the direct cancel probe
  still has an empty route with `No routes matched location`.
- No real payment, wallet mutation, webhook replay, credential, token, or
  production seed/reset was performed. Final provider sign-off still needs an
  approved sandbox transaction and webhook confirmation after deployment.

## PayOS deployment evidence — 2026-08-04

- Frontend workflow for `31a2569` completed successfully; browser network
  loaded the new `index-DiPgH97j.js` bundle and protected `/payment-failed`
  returned the expected guest `/auth` boundary.
- Backend quality gates for `d031c51` completed successfully.
- Backend deploy workflow run `30841034306` failed in `Deploy over SSH` after
  8m37s. The production API probe still redirects both synthetic PAID and
  CANCELLED returns to `/payment-success` without provider query fields, which
  is the pre-fix behavior.
- This is a deployment blocker, not evidence that the local patch is wrong:
  local tests/builds pass, but production PayOS callback/webhook sign-off is
  not claimed until the VPS workflow is repaired and rerun.

## PayOS deployment rerun — 2026-08-04

- Root cause of the failed run: Prisma `P1002`, timeout acquiring the
  PostgreSQL advisory lock during `prisma migrate deploy`.
- `Back-End:655381e` changed the VPS workflow to use the existing retry helper;
  quality gates passed and deploy run `30842099222` completed successfully.
- Production safe probes now show the intended redirect chain:
  - PAID: API callback → `/payment-success?code=00&id=...&status=PAID&orderCode=...`
    → guest `/auth`.
  - CANCELLED: API callback → `/payment-failed?code=00&id=...&cancel=true&status=CANCELLED&orderCode=...`
    → guest `/auth`.
- Both probes returned no console errors. No real payment or webhook mutation
  was performed; sandbox provider confirmation remains open.
- Current re-check in isolated Chrome context repeated both synthetic callbacks:
  success document `200` at `/payment-success?...status=PAID`, cancelled document
  `200` at `/payment-failed?...cancel=true&status=CANCELLED`, with no console
  errors.

## Safe production matrix update — 2026-08-04

- The no-credential Playwright matrix ran against `https://antifake.io.vn` with
  desktop `1440×900`, laptop `1280×720`, and mobile `390×844`.
- The complete `Front-End/e2e` suite reported `198 tests: 111 passed,
  87 skipped, 0 failed`. This includes the public, permission, catalog, QR,
  responsive, live, affiliate-attribution, auth-negative and security scopes.
  Skips are credential-dependent buyer/seller/affiliate/admin flows, not
  failures.
- The separate `live.spec.ts` + `auth.spec.ts` run reported `6 passed,
  6 skipped`; the separate affiliate run reported `3 passed, 3 skipped`.
- The production API authorization smoke remains `15/15` for unauthenticated
  protected endpoints. No password, token, cookie, payment, wallet mutation,
  webhook replay, seed, or reset was used.
- Full authenticated buyer/seller/affiliate/admin, upload/KYC, realtime,
  provider sandbox transaction, and mutating checkout rows remain open until
  an approved test identity/sandbox scope is available.

## PayOS embedded production smoke - 2026-08-04

- Backend commit `d546daa` and deploy run #25 completed successfully; frontend
  commit `873cd1d` and deploy run #33 completed successfully.
- The embedded configuration now uses `https://antifake.io.vn/payment` as the
  return URL shown inside the same page. A previous API callback URL caused
  PayOS to show `Thông tin truyền lên không hợp lệ` in the iframe.
- An authorized 10,000 VND production test created a real PayOS link. The
  AntiFake page remained the top-level document and the iframe displayed QR
  and bank-transfer tabs. The test link was canceled through PayOS Hosted Page
  afterward; Hosted Page was not used as the application checkout experience.
- No payment, wallet credit, webhook replay, or production database mutation
  was performed. Embedded rendering is verified; paid webhook reconciliation
  remains pending.
- The repository `back-end/.env` points to a remote Neon database and no local
  AntiFake API/frontend listener is running. Therefore no local seed, migration,
  reset, or authenticated test was started against that non-sandbox database.
- Production baseline wallet probe before `ab2ea9f` reproduced the defect:
  a synthetic cancelled callback reached `/profile/wallet?topUp=returned`
  (`200`) instead of preserving cancellation state. This was the pre-deploy
  baseline; the follow-up deployment and retest are recorded below.

## Wallet callback deployment — 2026-08-04

- `Back-End:ab2ea9f` was pushed to `main`.
- Backend Quality Gates run `30845646705`: **success**.
- Deploy backend run `30845646717`: **success**.
- Post-deploy Chrome probes returned HTTP `200` with
  `/profile/wallet?topUp=returned&...` for synthetic PAID and
  `/profile/wallet?topUp=cancelled&...` for synthetic CANCELLED; no console
  errors were recorded.
- Post-deploy Playwright permission/security/affiliate smoke: `45 tests`,
  `39 passed`, `6 skipped`, `0 failed`. Skips require authenticated identities.
- Full no-credential Playwright suite rerun after the same deploy: `198 tests`,
  `111 passed`, `87 skipped`, `0 failed` across desktop/laptop/mobile. Skips are
  the intentionally uncredentialed authenticated role cases.

## Authenticated production follow-up - 2026-08-04

- The previously authorized real 10,000 VND PayOS wallet payment was reconciled
  on production after backend deploy `556b354`. The API returned `PAID`, the
  wallet balance became 1,510,000 VND, and the transaction history contained one
  completed `TOP_UP` credit of 10,000 VND.
- Reopening the same returned payment URL exercised the reconciliation endpoint
  a second time. It returned HTTP 201, kept the balance at 1,510,000 VND, and
  did not create a second ledger entry.
- Production browser probes for synthetic PayOS failure, success-pending-webhook,
  order cancellation, and wallet cancellation rendered the expected pages with
  no console errors. Wallet reload showed the credited balance and single top-up.
- Authenticated read-only buyer smoke passed for profile, address, orders, cart,
  checkout, notifications, messages/chat and affiliate. Seller dashboard and
  wallet read-only smoke also passed; observed API requests returned 200/304.
- Local regression remains green: backend `npm.cmd run test:ci` reported 7 suites
  and 25 tests passed; frontend `npm.cmd run test:payos` reported 7 tests passed.
- Remaining sign-off is limited to mutating/provider-dependent flows: checkout
  order creation, seller product/voucher changes, affiliate conversion/payout,
  upload/KYC, realtime chat, Agora livestream, QR edge cases and authenticated
  admin. The seeded admin account is suspended, so admin walkthrough remains
  blocked without an active test identity.

## Header badges and seller statistics follow-up - 2026-08-04

- Frontend `a956145` adds the seller `/seller/statistics` route and replaces
  hard-coded header badges with live notification/chat counts plus total cart
  quantity. Backend `751e7d5` exposes `unreadChatCount` from the notification
  query. Frontend `ca11acd` additionally refreshes the header cart count after
  a cart quantity PATCH; regression coverage was added in `92fa594`.
- Frontend deploy runs #39, #40 and the test-only follow-up #41 completed
  successfully. The production
  route rendered the seller analytics dashboard with revenue/order/product
  metrics, the weekly chart, best-selling products and no console errors.
  `/api/shops/mine` returned `200/304`; the earlier transient loading failure
  did not reproduce on the final verification.
- Production cart verification returned PATCH `200` and follow-up cart GET
  `200`. The authenticated header badge changed from `7` to `8` after increasing
  an item quantity, then returned to `7` after decreasing it. The mobile viewport
  also rendered the real `7` badge.
- Production notification polling returned `200/304`. The unread tab returned
  zero items, and the header correctly hid chat/notification badges. The fixed
  values `3` and `1` are no longer rendered.
- A new local mocked regression `Front-End/e2e/header-badges.spec.ts` passed on
  desktop, laptop and mobile with cart quantity `3`, notification unread count
  `4`, and chat unread count `2`; all three badges rendered those API-backed
  values. The same regression also confirms all three badges are hidden when
  the API counts are zero. The production account still needs a positive-unread
  fixture.
- Automated regression coverage now includes the quantity and positive unread
  badge flows, but credential-dependent production tests remain skipped.
- The latest full no-credential E2E rerun reported `216 tests: 96 passed,
  120 skipped, 0 failed` across desktop, laptop and mobile. The additional
  passes cover positive/zero unread badges and both checkout quote branches. Skips are the
  intentionally credential-dependent buyer, seller, affiliate and admin
  flows; the run found no public/permission failures.

## Checkout and QR follow-up - 2026-08-04

- Production checkout was opened with the existing authenticated buyer session
  and one selected cart item. The default address loaded, then
  `/api/cart/shipping-options` returned `201` and rendered a GHN option at
  `21.001 VND`.
- The subsequent `/api/cart/checkout/quote` returned `400` on the initial run
  and again after a fresh reload. The old bundle stayed usable by falling back
  to subtotal plus the displayed shipping fee, but this did not prove the
  backend-calculated total. No order was created.
- A local fail-closed follow-up now surfaces the quote error, removes the
  fallback payable total, and disables order submission until a quote succeeds.
  Build passed; deployment and authenticated production retest remain open.
- The new mocked regression `Front-End/e2e/cart-checkout.spec.ts` passed on
  desktop, laptop and mobile: a `400 Variant is not available` quote renders
  the error, shows `—` for the payable total, and leaves `Đặt hàng` disabled;
  a successful server quote renders `31.000 VND` and enables the button. The
  test suite does not click the button or create an order.
- A follow-up attempt with the same browser context selected the currently
  available `1L` + `Hộp lẻ` variant (stock shown as `10`), but adding it to the
  cart redirected to `/auth`; the existing session had expired. No cart
  mutation, order or payment was created.
- Production `/qr` rendered the QR Code, product-link and verification-code
  tabs. Entering an invalid product link and pressing `Kiểm tra ngay` made no
  API request and produced no result/error state. Source inspection confirms
  the button currently has no handler or verification service call, so QR
  verification is an implementation gap rather than a passing test.
- Remaining gates are unchanged: authenticated mutation flows, positive
  unread-badge data, seller/admin mutation, affiliate conversion, upload/KYC,
  realtime chat, Agora and provider-specific tests. Current environment did
  not contain buyer/seller/password or PayOS credential variables; no secrets
  were requested or written.

## Documentation workstream progress — 2026-08-24

`docs/user-guide/` is now the canonical documentation foundation. It contains
the master guide, journey maps, Documentation Registry contract, Feature Guide
Matrix, UX Documentation Gaps and Visual Manifest. The frontend also has a
public `/help` Help Center/Journey Center slice with role filtering, deep-linked
steps, progress, Desktop/Mobile viewport selection and local responsive tests.

Local evidence for this slice: TypeScript/Vite build passed; targeted ESLint
passed for the new/modified files except the seller-order file's four
pre-existing lint errors; the focused Help/Journey suite passed 6/6 executed (two intentional
mobile-only skips); the earlier combined Help + guest + permission + responsive
regression passed 75 with 6 intentional credential skips across
Desktop/Laptop/Mobile. The new `/help` responsive checks passed on all three
viewports, and the isolated prior `/categories` failure did not reproduce. No
production deployment or production documentation verification is claimed yet.
`UAT_STATUS` remains separate from `DOCUMENTATION_STATUS`; checkout quote, QR
execution, authenticated seller and Admin blockers remain unchanged.

The seller documentation slice now includes a state-derived Getting Started
checklist on `/seller/dashboard`. Its pure state tests passed 3/3 and the
build passed. Authenticated seller runtime, production deployment and final
Desktop/Mobile screenshots remain pending; no checklist completion is claimed
from local evidence alone.

The Help registry now exposes stable deep links for source-backed voucher,
chat, livestream, seller wallet, affiliate and Admin operations journeys. The
public Help Center was captured locally at 1440×900 and 390×844 and registered
in `docs/user-guide/VISUAL_MANIFEST.md`; these are raw local evidence only, not
production or annotated final assets.

The latest no-credential regression run covered Help, guest, permission and
responsive suites: 80 passed with 6 intentional credential skips and one
transient Desktop `/register` blank-body failure under the concurrent run.

The source-side route/API/schema/permission traceability audit is recorded in
`docs/user-guide/SOURCE_AUDIT.md`. It confirms documented route and state
boundaries while preserving runtime UAT statuses; it does not upgrade any
article to production `VERIFIED`.

After expanding the registry to canonical B01-B09, S01-S09 and A01-A10
journeys, the focused Help/Journey E2E suite passed 9 tests with 3 intentional
mobile-only skips across Desktop/Laptop/Mobile. The documentation integrity
tests passed 9/9, including source references, canonical journey IDs,
cross-document Help links, concrete visual assets and the Feature/Journey/UAT/
Desktop/Mobile traceability bridge;
the current frontend build also passed. Refreshed local raw Help screenshots
at 1440x900 and 390x844 were inspected. These remain local
evidence; production deployment, authenticated role captures and annotated
final assets are still pending.

A read-only probe of `https://antifake.io.vn/help` could not connect from the
current environment, and no production Help status is inferred from that
failure. Re-run the public route check from an environment with network access
before claiming deployment or production documentation verification.

The attempted combined Help + guest + permission + responsive rerun timed out
at 124 seconds without an assertion result. Isolated follow-up coverage was
usable: Desktop guest/permission/responsive passed 24/25 with one intentional
credential skip; Laptop/Mobile permission passed 14/16 with two intentional
skips; Laptop/Mobile responsive passed 14/14. Treat the combined timeout as a
harness limitation, not as a pass or a product failure.
The failing `/register` case passed when isolated on Desktop, so no product
fix is claimed; monitor it for recurrence rather than weakening the assertion.

Checkout quote source follow-up 2026-08-24: backend inspection confirms that
`CheckoutCartUseCase.revalidateSelectedItems` rejects a missing, inactive or
hidden current variant before shipping resolution and refreshes the price from
the current variant. The focused backend regression suite passed 5/5 after
adding a stale-variant quote assertion (`back-end` commit `014fa3f`). This
supports, but does not prove, the stale-cart-variant explanation for AF-B-003;
the production request body and authenticated retest remain pending.

QR source audit follow-up 2026-08-24: the schema and seed confirm
`VerificationLabel` and `ProvenanceEvent` records exist, but inspection found
no verification use case, RPC pattern, gateway route, frontend request or
result mapper. The Help article now links these source boundaries while
remaining explicitly `NOT_IMPLEMENTED`; frontend commit `ab1b240` passed the
9/9 documentation test, targeted ESLint and build.

Post-commit browser verification for `ab1b240`: the existing Help/Journey
Playwright suite passed 9 tests with 3 intentional mobile-only skips across
Desktop, Laptop and Mobile. No production status is inferred from this local
run.

Canonical-guide consistency follow-up 2026-08-24: the retained legacy UAT
draft now points to `docs/user-guide/ANTIFAKE_USER_GUIDE.md` and is explicitly
non-canonical. The documentation integrity suite passed 10/10, including this
pointer guard; frontend commit `7a6c2da` contains the test.

Journey bridge follow-up 2026-08-24: the integrity suite now also checks that
all 28 canonical B01-B09/S01-S09/A01-A10 rows have eight bridge columns and
reference existing UAT case IDs. The suite passed 11/11; frontend commit
`560eb52` contains this guard.

Documentation registry follow-up 2026-08-24: the registry now lists all 28
canonical B01-B09/S01-S09/A01-A10 rows with evidence status, route and visual
status. The integrity suite passed 12/12, including the registry coverage
guard; frontend commit `c2bc14c` contains the test.

Registry synchronization follow-up 2026-08-24: the integrity suite also
checks every canonical registry route and evidence status against the frontend
Help metadata. It passed 13/13; frontend commit `9082b3e` contains the guard.

Visual manifest follow-up 2026-08-24: `docs/user-guide/VISUAL_MANIFEST.md` now
has one explicit visual-coverage row for every canonical B01-B09, S01-S09 and
A01-A10 journey. Buyer and seller captures remain `Pending`, B03 remains
UAT-only because AF-Q-001 is open, and Admin captures remain blocked by the
suspended identity. The documentation integrity suite passed 14/14,
including the manifest coverage guard; frontend commit `115c4f0` contains the
test. No annotated final or production visual claim is made.

Visual route traceability follow-up 2026-08-24: each canonical manifest row now
records its stable Help/Journey route, and the documentation integrity suite
checks those routes against frontend Help metadata. The suite passed 15/15;
frontend commit `5fdebd9` contains the guard. This improves traceability only;
visual captures, deployment verification and production UAT statuses remain
unchanged.

Current-revision local regression follow-up 2026-08-24: after `5fdebd9`, the
frontend production build passed, the focused Help/Journey Playwright suite
passed 9 tests with 3 intentional mobile-only skips across Desktop, Laptop and
Mobile, and the documentation integrity suite passed 15/15. The build retained
the existing large-chunk warning. These are local evidence only; no deployment
or production status is inferred.

Checkout local regression follow-up 2026-08-24: the focused frontend checkout
quote suite passed 6/6 across Desktop, Laptop and Mobile, covering both the
server-quote `400` fail-closed path and the successful authoritative-total path.
The focused backend checkout use-case suite passed 5/5, including the stale
variant rejection before shipping resolution. AF-B-003 remains open because
the fix has not been deployed and the authenticated production retest is still
pending.

Frontend quality-gate follow-up 2026-08-24: `npm.cmd run lint` on the current
frontend revision reports 58 errors and 5 warnings in pre-existing unrelated
address/chat/community/checkout/seller/order/product-management/service files.
The changed documentation test lint remains green, as do the current build and
focused browser regressions. Full lint is recorded as open `AF-TECH-001`; no
full quality-gate or release sign-off is claimed.

Lint remediation follow-up 2026-08-24: `Front-End:a143f64` replaced seven
unsafe `any` usages in `src/services/order.api.ts` with unknown-safe record
normalization. Targeted ESLint, TypeScript and the production build passed.
Full lint now reports 56 diagnostics (24 `no-explicit-any`, 20
`react-hooks/set-state-in-effect`, 5 dependency warnings and 7 other findings),
so `AF-TECH-001` remains open and no full lint sign-off is claimed.

Product-detail lint follow-up 2026-08-24: `Front-End:7f3b4c5` removed the
remaining product-detail `any`, empty-finally and uncaught-cause findings with
explicit response types, safe defaults and derived related-product visibility.
Targeted ESLint/TypeScript and the production build passed; catalog regression
had 3 public-search passes and 12 documented fixture-dependent skips. Full lint
is down to 49 diagnostics, so `AF-TECH-001` remains open.

Checkout-address lint follow-up 2026-08-24: `Front-End:1df240c` made the
default-address fetch callback-stable and deferred it through a cancellable
microtask, removing the effect dependency/state warnings without changing the
checkout quote contract. Targeted checks, build and checkout regression passed
6/6 across Desktop, Laptop and Mobile. Full lint is down to 47 diagnostics;
`AF-TECH-001` remains open.

Address-form lint follow-up 2026-08-24: `Front-End:0316a22` deferred address
form synchronization and derived the empty ward list when no province is
selected. Targeted ESLint/TypeScript, build and Buy Now checkout regression
passed 6/6 across all viewports. Full lint is down to 45 diagnostics;
`AF-TECH-001` remains open.

Address-selector lint follow-up 2026-08-24: `Front-End:8c7545d` deferred the
modal's address fetch through a cancellable microtask. Targeted checks, build
and Buy Now checkout regression passed 6/6 across Desktop, Laptop and Mobile.
Full lint is down to 44 diagnostics; `AF-TECH-001` remains open.

Create-address lint follow-up 2026-08-25: `Front-End:fdc3628` derived the
empty ward list when no province is selected. Targeted ESLint/TypeScript and
the production build passed; Buy Now checkout regression passed 6/6 after a
serial preview-server run. Full lint is down to 43 diagnostics;
`AF-TECH-001` remains open.

Seller-revenue lint follow-up 2026-08-25: `Front-End:901f068` replaced the
seller chart's callback-form memo with an explicit factory and derived its
no-shop empty/error view without setting state from an effect. Targeted
ESLint, TypeScript and the production build passed. Seller browser regression
was skipped because `UAT_SELLER_EMAIL` and `UAT_TEST_PASSWORD` are not
available. Full lint is down to 41 diagnostics (37 errors, 4 warnings): 21
`no-explicit-any`, 13 `set-state-in-effect`, 4 `exhaustive-deps`, and three
isolated rule findings; `AF-TECH-001` remains open.

Wallet API lint follow-up 2026-08-25: `Front-End:3c099e5` replaced six
explicit `any` response-list types with unknown-safe record guards and typed
list payloads without changing endpoint contracts. Targeted ESLint,
TypeScript and the production build passed; no wallet-specific automated test
surface exists in the frontend. Full lint is down to 35 diagnostics (31
errors, 4 warnings): 15 `no-explicit-any`, 13 `set-state-in-effect`, 4
`exhaustive-deps`, and three isolated rule findings; `AF-TECH-001` remains
open.

Seller product-detail lint follow-up 2026-08-25: `Front-End:261e2e8` deferred
variant loading through cancellable microtasks, stabilized loader callbacks,
removed a dead constant branch, and derived edit mode from the URL query.
Targeted ESLint, TypeScript and the production build passed; seller browser
regression remains skipped because seller credentials are unavailable. Full
lint is down to 29 diagnostics (27 errors, 2 warnings): 15 `no-explicit-any`,
10 `set-state-in-effect`, 2 `exhaustive-deps`, and two isolated rule findings;
`AF-TECH-001` remains open.

Seller order-management lint follow-up 2026-08-25: `Front-End:7ed0a3e`
replaced the seller shop response and error `any` values with the typed
`MyShop` contract and unknown-safe errors, and deferred filter pagination
reset. Targeted ESLint, TypeScript and the production build passed; seller
browser regression remains skipped because seller credentials are unavailable.
Full lint is down to 25 diagnostics (23 errors, 2 warnings): 12
`no-explicit-any`, 9 `set-state-in-effect`, 2 `exhaustive-deps`, and two
isolated rule findings; `AF-TECH-001` remains open.

Comment-sheet lint follow-up 2026-08-25: `Front-End:24b4ecd` deferred closed
sheet state reset through a cancellable microtask and narrowed auth/request
errors to `unknown` without changing optimistic comment behavior. Targeted
ESLint, TypeScript and the production build passed. Full lint is down to 19
diagnostics (17 errors, 2 warnings): 8 `set-state-in-effect`, 7
`no-explicit-any`, 2 `exhaustive-deps`, and two isolated rule findings;
`AF-TECH-001` remains open.

Payout-modal lint follow-up 2026-08-25: `Front-End:8dc34ed` froze payout
eligibility time in lazy state, deferred modal-open resets through a cancellable
microtask, and completed the effect dependency list. Targeted ESLint,
TypeScript and the production build passed. Full lint is down to 16
diagnostics (15 errors, 1 warning): 7 `no-explicit-any`, 7
`set-state-in-effect`, 1 `exhaustive-deps`, and 1 immutability finding;
`AF-TECH-001` remains open.

Profile-response lint follow-up 2026-08-25: `Front-End:9cd4fda` replaced three
profile/avatar response `any` values with unknown-safe JSON-record helpers and
typed string extraction. Targeted ESLint, TypeScript and the production build
passed. Full lint is down to 22 diagnostics (20 errors, 2 warnings): 9
`no-explicit-any`, 9 `set-state-in-effect`, 2 `exhaustive-deps`, and two
isolated rule findings; `AF-TECH-001` remains open.

Community-post lint follow-up 2026-08-25: `Front-End:99a53f7` narrowed the
community post auth and like-request errors to `unknown` while preserving
optimistic like rollback and auth redirect behavior. Targeted ESLint,
TypeScript and the production build passed. Full lint is down to 14
diagnostics (13 errors, 1 warning): 7 `set-state-in-effect`, 5
`no-explicit-any`, 1 `exhaustive-deps`, and 1 immutability finding;
`AF-TECH-001` remains open.

Final response-typing follow-up 2026-08-25: `Front-End:0ef3426` typed product
specification props, `Front-End:21d509d` typed seller dashboard shop data, and
`Front-End:c13400f` typed order-management shop/error data. Targeted ESLint,
TypeScript and the production build passed. Full lint is down to 10
diagnostics (9 errors, 1 warning): 7 `set-state-in-effect`, 1
`no-explicit-any`, 1 `exhaustive-deps`, and 1 immutability finding;
`AF-TECH-001` remains open.

Final lint closeout 2026-08-25: `Front-End:05dcdd3` and `e236fad` deferred
chat realtime/message-list effect updates, and `Front-End:7952749` cleared the
remaining ChatLayout, community, search, product, discussion-feed and address
findings. Targeted ESLint, TypeScript, production build/PWA generation and diff
checks passed. Full `npm.cmd run lint` now reports 0 errors, 0 warnings, and 0
findings; `AF-TECH-001` is resolved locally. Production deployment and UAT
status remain governed by the separate blockers above.

Current-revision Help/Journey regression follow-up 2026-08-25: documentation
integrity passed 15/15. The focused Help + guest Playwright run passed 39 of 42
tests, with 3 intentional mobile-only skips; the responsive suite passed 21/21.
The frontend preview process was stopped after verification. Full lint remains
0 errors, 0 warnings and 0 findings, and the production build/PWA generation
passed. These are local evidence only; no deployment, production visual
verification or authenticated seller/Admin sign-off is inferred.

QR execution follow-up 2026-08-25: the local catalog-service contract now
hashes normalized code/link input server-side and returns public
`VERIFIED`, `SUSPICIOUS`, `INACTIVE` or `NOT_FOUND` states without exposing
label hashes, scope IDs or actor data. Backend focused tests passed 8/8;
frontend mocked QR verification passed 9/9 across Desktop, Laptop and Mobile;
frontend full lint and build passed; backend deploy build passed. Source
commits are `back-end:3b59ab9` and `Front-End:717357c`. The QR image picker
remains explicitly unsupported without a compatible decoder.
At this local-follow-up timestamp, AF-Q-001 was `PARTIAL` locally and not yet
production-verified; the later post-deploy evidence below supersedes the
deployment wording, while positive fixture, image decoding and final QR visuals
remain pending.

Pre-deploy production public verification follow-up 2026-08-25: read-only probes returned
`200` for `https://www.antifake.io.vn/help` and
`https://api.antifake.io.vn/api/health`; the health payload reported
`service: api-gateway` and `status: ok`. Elevated-network Playwright checks for
Help/Journey and QR page loading passed 12/12 across Desktop, Laptop and Mobile,
with 3 intentional mobile-only skips. The documented production
`GET /api/verifications?code=UAT-UNKNOWN-20260825` returned `404`, while the
production QR DOM exposed the older generic tabs/file input and no local
`verification-*` result controls. This establishes public deployment reachability
but not deployment of `back-end:3b59ab9` or `Front-End:717357c`; no QR result
interaction or production verification state is claimed because the deployed
flow's side effects are not authorized for an unknown test code.
Read-only production console checks for `/help`, the seller process-order step,
and `/qr` recorded zero console warnings/errors, page errors, or 5xx responses.

Post-deploy production verification follow-up 2026-08-25: Front-End deploy run
`32803576920`, Back-End quality run `32803581629` and Back-End deploy run
`32803581635` completed successfully for `Front-End:717357c` and
`back-end:3b59ab9`. Health returned `200` with `status: ok`. The isolated
`UAT-UNKNOWN-20260825` code returned `200` with `NOT_FOUND`; the production UI
also completed code and product-link checks with `200 GET` responses and
`NOT_FOUND` results on Desktop, Laptop and Mobile. The final public
Help/Journey + QR suite passed 12/12 executed checks with 3 intentional
mobile-only skips, and no console/page errors or 5xx responses were observed.
This verifies the deployed public negative path, not a known positive fixture,
image decoding, authenticated buyer/seller/Admin flows or final visual assets.

Public documentation visual follow-up 2026-08-25: read-only screenshots were
captured from the deployed Front-End revision `717357c` at `1440×900` and
`390×844` for the Help Center overview and the Buyer first-purchase Journey
Center shell. The Help Center captures are valid raw production evidence and
are registered in `docs/user-guide/VISUAL_MANIFEST.md`; deterministic numbered
annotations are separate files and the raw captures were not overwritten. The
Journey Center shell captures intentionally show the current "visual awaiting
evidence" state and are not final Buyer feature screenshots.

Documentation structure follow-up 2026-08-25: the evidence-scoped ebook draft
`docs/user-guide/ANTIFAKE_USER_GUIDE_EBOOK.md` now covers B01-B09, S01-S09 and
A01-A10 with explicit runtime statuses and links to the canonical Help articles.
It remains `DOCUMENTATION_STATUS = IN_PROGRESS`; creating the draft does not
upgrade any UAT or production status.

Latest public visual refresh 2026-08-25: after Front-End deploy run
`32805233259` completed successfully for `3b504ba`, the Help Center raw and
annotated screenshots were recaptured at `1440×900` and `390×844`. The Visual
Manifest and ebook now point to these current-revision assets.

Current-revision public regression 2026-08-25: the Help/Journey suite passed
9/9 executed checks with 3 intentional mobile-only skips, and the QR page suite
passed 3/3 across Desktop, Laptop and Mobile against Front-End `3b504ba`.
These are public read-only checks; authenticated buyer, seller and Admin flows
remain separately blocked or pending.

Latest QR decoder and deployment follow-up 2026-08-25: Front-End commit
`84a6a15` added client-side PNG/JPEG/WebP QR image decoding with a 5 MB limit,
unreadable-image fallback and regression fixture. Local QR browser coverage
passed 15/15 across Desktop, Laptop and Mobile; full lint, TypeScript and the
production build passed. Deployment run `32806940404` completed successfully.
Production root returned `200`, API health returned `status: ok`, and the
unknown image fixture decoded and reached
`https://api.antifake.io.vn/api/verifications?code=UAT-QR-IMAGE-20260825`,
which returned `200` with server-owned `NOT_FOUND` on all three viewports. No
page or console errors were observed. The current public Help/Journey plus QR
page regression passed 12/12 executed checks with 3 intentional mobile-only
skips. A known positive production fixture,
authenticated buyer/seller/Admin UAT, checkout quote/order retest and final QR
feature visuals remain open. The earlier `npm audit --omit=dev
--audit-level=high` result reported 3 high vulnerabilities in existing
`react-router` and `socket.io-parser` dependency ranges; that historical result
was remediated by the security follow-up below.

QR visual evidence follow-up 2026-08-25: after Front-End commit `a0b74c4` and
deploy run `32807912265`, the production QR page was captured with deterministic
unknown fixture `UAT-QR-IMAGE-20260825` at Desktop `1440×900` and Mobile
`390×844`. Raw and separate deterministic annotated assets are registered in
`docs/user-guide/VISUAL_MANIFEST.md`; the result is server-owned `NOT_FOUND`,
with no page or console errors. These are UAT negative-result assets only and
do not satisfy the pending known-positive fixture or final B03 feature visual.

Help content correction follow-up 2026-08-25: stale QR article text was
corrected in Front-End commit `a0b74c4` and deployed by run `32807912265`.
Production `/help/qr/verify-product/enter-code` now describes PNG, JPEG and
WebP uploads under 5 MB, while the result step describes the clearer-image/
link fallback. The read-only content smoke passed 3/3 across Desktop, Laptop
and Mobile with no page or console errors. The QR article remains `PARTIAL`
because positive production fixture and feature visuals are still unverified.

Dependency security closeout 2026-08-25: Front-End commit `6b24be3` upgraded
`react-router-dom`/`react-router` to `7.18.2` for the RSC CSRF advisory and
refreshed the compatible `socket.io-parser` transitive dependency to `4.2.7`.
Local `npm.cmd audit --omit=dev --audit-level=high` reports 0 vulnerabilities;
lint, TypeScript, build, focused unit suites and documentation integrity passed.
Deploy run `32819481662` completed successfully. Production root and API health
returned `200`; the post-deploy public/permission/responsive matrix passed
84/84 executed tests with 21 intentional credential/API skips. The complete
no-credential Playwright suite then passed 154 tests with 119 intentional
credential-dependent skips and 0 failures; direct API authorization passed
15/15. No authenticated buyer, seller or Admin sign-off is inferred from this
dependency-only deployment.

Documentation completeness follow-up 2026-08-25: the canonical master guide now
exposes an evidence-scoped Quick Guide, and the ebook now includes the
specification's Level A/B/C visual rules, Quick Guide, troubleshooting, FAQ and
glossary. `DOCUMENTATION_STATUS` remains `IN_PROGRESS`; this closes static
structure coverage only and does not upgrade any pending runtime or visual
journey.

QR positive-fixture discovery follow-up 2026-08-25: read-only production
catalog inspection found 16 public offers. Public offer/detail responses did
not expose verification codes; public batch links exposed only batch IDs and
batch metadata. All 24 candidates derived from the checked-in compact seed
formula and those public batch IDs returned `200` with server-owned
`NOT_FOUND`. The positive fixture remains `BLOCKED_EXTERNAL`; no code was
fabricated and no production mutation was performed.

B02 public product-detail visual follow-up 2026-08-25: the public seeded offer
`c831f5d5-4b75-46db-95fc-c687f0fe6b2b` was opened against Front-End `6b24be3`
at Desktop `1440×900` and Mobile `390×844`. Both browser runs rendered the
product image, title/price, variant controls, stock and AntiFake information;
both reported zero page/console errors and no 4xx/5xx responses. Raw and
separate deterministic annotated captures are registered in the Visual
Manifest. This verifies the public product-detail step only; B02 remains
`PARTIAL` for the complete discovery journey and authenticated actions.

Visual traceability follow-up 2026-08-25: `VISUAL_MANIFEST.md` now records
source page, capture date, deployment revision, test-data scope, viewport and
raw/annotated paths for each accepted Help Center, Journey shell and B03 UAT
asset set. Pending journey rows remain explicitly uncaptured and non-final;
documentation integrity remains 16/16.

B02 public discovery visual follow-up 2026-08-25: a read-only production browser
capture after Front-End `6b24be3` covered `/`, `/categories`, the selected
public category result (`categoryId=2b4ded4b-624d-417b-acda-c3766c385ef9`),
`/search?q=seed` and Shop `7916412b-68c5-4d56-b592-25aa2b77a88f`. Desktop
`1440×900` and Mobile `390×844` raw/annotated pairs were produced and visually
inspected. DOM/route checks passed with zero page errors, zero console
errors/warnings and no 4xx/5xx responses. The public B02 subset is now
documented; sorting, reviews, provenance actions and authenticated purchase
steps remain open, so B02 stays `PARTIAL`.

B09 public livestream visual follow-up 2026-08-25: read-only production browser
capture after Front-End `6b24be3` opened `/live` at Desktop `1440×900` and
Mobile `390×844`. Both raw/annotated shell pairs were visually inspected; the
browser diagnostic reported zero page errors, zero console errors/warnings and
no 4xx/5xx responses. This verifies public discovery only; provider setup,
joining, interaction and leaving remain `PARTIAL`.

B08 screenshot safety note 2026-08-25: the public `/community` route passed the
runtime shell check, but the viewport rendered seeded author names and post
content. The attempted raw captures were discarded and are not registered;
documentation remains pending a PII-safe public fixture.

B01 authentication-entry visual follow-up 2026-08-25: production `/auth` was
captured at Desktop `1440×900` and Mobile `390×844` after Front-End `6b24be3`.
The login mode and the buyer-registration mode reached through the login
switch control both rendered cleanly after the CSS entrance transition. Raw and
separate deterministic annotated pairs are registered in the Visual Manifest;
page errors, console errors/warnings and 4xx/5xx responses were all zero. The
public `/register` route is the seller Shop-registration boundary and redirected
the guest to `/auth`, so it was not treated as buyer registration. B01 remains
`PARTIAL` pending credentialed registration, profile, address and authenticated
completion evidence.

B01 regression/deployment follow-up 2026-08-26: Front-End test commit
`f70696b` added a persistent auth regression that waits for the registration
card entrance transition and asserts that no global loading overlay remains.
The pre-wait assertion reproduced the capture race in production at opacity
`0.393305`; the stabilized test passed Desktop/Mobile 2/2 before and after
deployment. Workflow run `32928248842` completed successfully; production root
and `/api/health` returned `200`. This is a test-only commit, so the accepted
visual assets remain correctly tied to UI revision `6b24be3`.

Fresh production regression follow-up 2026-08-26: the complete no-credential
Playwright matrix ran against `https://antifake.io.vn` across Desktop, Laptop
and Mobile: 276 total, 159 passed, 117 intentional credential/API skips and
0 failures. Public catalog, Help/Journey, auth, QR, permissions, responsive,
live, PWA and other safe scopes remained green. The dedicated unauthenticated
API authorization matrix also passed 15/15 across all three projects. Skips
remain the known buyer/seller/Admin/provider-dependent scope, not failures.

Backend quality follow-up 2026-08-26: current backend revision `3b59ab9`
passed `npm.cmd run test:ci` with 7 suites and 25/25 tests, and
`npm.cmd run build:deploy` completed successfully. Prisma schema generation and
the API gateway build completed without leaving repository changes. These are
quality gates only; they do not replace the pending authenticated/provider UAT.

Visual asset audit follow-up 2026-08-26: all 63 PNG assets under `docs/images`
use accepted guide dimensions: 32 Desktop images at `1440×900`, 30 Mobile
images at `390×844`, and 1 Laptop image at `1280×720`. No nonstandard dimensions
were found, and all 48 concrete image paths referenced by the Visual Manifest
exist. This validates asset shape and traceability, not runtime journey
completion.

Journey Center visual-binding follow-up 2026-08-26: Front-End `b9efeed` now
serves accepted annotated Desktop/Mobile copies for B01 registration, B02
discovery/product-detail and B09 livestream discovery. Local documentation
integrity, frontend lint/build and browser checks passed; pending steps still
render the evidence placeholder. Deployment run `32931301098` succeeded and
root/API health returned `200`.

Post-deploy Help regression found a production edge inconsistency: the first
fresh context on Desktop, Laptop and Mobile received stale bundle
`index-BFkaJWzL.js`, logged `No routes matched location "/help"` and rendered a
blank overview. The same production origin later served `index-CIHZ0t3I.js`
and rendered the overview plus the new visuals; 12/15 executed Help checks
passed and the three overview checks failed. This is recorded as
`AF-DEP-001` with status `BLOCKED_EXTERNAL`; CDN/Nginx cache/origin
consistency must be checked before Help overview sign-off.

Help route-collision fix follow-up 2026-08-26: Front-End `305edb2` moved the
served Journey Center visuals from `public/help/visuals` to
`public/journey-visuals` and added idempotent deployment cleanup for the old
directory. This removes the physical `dist/help/` directory that caused the
SPA `/help` route to receive an Nginx `403`; the PWA network denylist from
`38ef806` remains in place. Local build confirmed `dist/help` absent and eight
Journey Center visual assets present. Deployment run `32951825727` succeeded.
A fresh production context rendered `/help` with no console errors, the direct
B02 detail visual returned HTTP 200, and the full Help suite passed 15/15
executed checks across Desktop, Laptop and Mobile with three intentional
mobile-only skips. `AF-DEP-001` is resolved for the observed route collision;
the historical stale-edge observation remains a manual follow-up only if it
recurs.

Final no-credential production regression follow-up 2026-08-26: the complete
`Front-End/e2e` matrix ran against `https://antifake.io.vn` across Desktop,
Laptop and Mobile: 282 total, 165 passed, 117 intentional credential/API
skips, and 0 failures. The new Help visual assertions passed in all three
projects; public catalog, Help/Journey, auth, QR, permission, responsive,
live, PWA and unauthenticated authorization coverage remained green. The
canonical API health endpoint `https://api.antifake.io.vn/api/health` returned
`200` with `status: ok`.

Documentation visual-consumption follow-up 2026-08-26: the canonical master
guide and evidence-scoped ebook now place the accepted annotated Desktop/Mobile
pairs beside the B01 public account-entry, B02 public discovery/product-detail
and B09 livestream-discovery evidence. Both documents reuse the Visual Manifest
assets and retain explicit partial or blocked status for all unsupported steps.

Documentation integrity guard follow-up 2026-08-26: Front-End `833446a` added
a deterministic test requiring both canonical documents to reference every
accepted annotated B01, B02 and B09 Desktop/Mobile asset and verifying those
files exist. Local documentation tests passed 18/18; frontend lint and build
passed. Deployment run `32953905914` completed successfully, and the post-
deploy production Help suite passed 15/15 executed checks with three
intentional mobile-only skips. This guard protects traceability; it does not
upgrade any journey status.

Authenticated route harness follow-up 2026-08-26: the first elevated
production Buyer/Seller read-only run reached production but exceeded the
backend `auth` rate-limit profile after 10 UI logins (limit 10 per client per
60 seconds). The next Seller login stayed on `/auth`; this is recorded as
`AF-TEST-001`, not as a product authorization result. Front-End `1fbfeca`
made login settling role-agnostic and awaited the `/seller` index redirect;
`717550e` then retained all route assertions while reusing one authenticated
session per role and viewport. Local lint/build passed. Deployment
verification and the post-deploy authenticated retest for `717550e` remain
pending, so no authenticated Buyer/Seller sign-off is claimed.

Safe authenticated UAT follow-up 2026-08-26: deployment run `32955596021`
completed successfully for Front-End `717550e`. The corrected Buyer/Seller
read-only route suites passed 6/6 across Desktop, Laptop and Mobile. The
affiliate, orders, chat, live-entry and permission suites passed 42/42 in
total across the three viewport projects (48/48 combined safe authenticated
checks) after rate-limit-safe batching; the
two intermediate rate-limit failures were isolated and rerun successfully.
These checks assert route rendering, ownership-safe read access, no observed
5xx response and non-admin redirects only. No purchase, payment, order,
wallet, admin or provider mutation was performed. Authenticated mutation and
provider-dependent UAT remains open.

Help-status deployment follow-up 2026-08-26: Front-End `dffe8ed` is present on
`origin/main`, but the exact-SHA GitHub Actions query returned zero runs after
the push trigger delay, even though `deploy-vps.yml` is active. The prior
`717550e` deployment remains the last verified production revision. The local
S02–S06 `PARTIAL` metadata refinement is therefore not claimed in production;
manual workflow inspection or dispatch and a post-deploy Help regression are
required. Tracked as `AF-DEP-002` with `BLOCKED_EXTERNAL` status.

Help-status deployment retry follow-up 2026-08-26: Front-End retry commit
`d3bd7fd` triggered run `32985079060`, but it also ended `startup_failure` with
zero jobs, matching run `32984881891` for `dffe8ed`. No deploy script or build
ran in either attempt. `717550e` remains the last verified production
revision; the local Help metadata refinement remains unverified in production.

Current availability check 2026-08-26: the last verified production release
still returned `200` at `https://antifake.io.vn/`, and the canonical API health
endpoint returned `200` with `status: ok`. This does not verify the pending
`dffe8ed` Help metadata deployment.

Public production browser regression follow-up 2026-08-26: with network access
enabled for the runner, `Front-End/e2e/help-journey.spec.ts` and
`Front-End/e2e/guest.spec.ts` passed 45/45 executed checks across Desktop
`1440x900`, Laptop `1280x720` and Mobile `390x844`; 3 mobile-only cases were
intentionally skipped. The restricted-network attempt is a runner observation
(`ERR_NETWORK_ACCESS_DENIED`), not an application failure. This reconfirms the
last verified release's public Help/Journey, guest route and responsive
behavior; it does not verify the un-deployed `dffe8ed` metadata.

Help-status deployment resolution follow-up 2026-08-26: retry deployment run
`32987804285` completed successfully for Front-End `d3bd7fd`, whose head matches
`origin/main`; the deployed source includes the `dffe8ed` S02–S06 metadata
refinement. Post-deploy Help/Journey regression passed 15/15 executed checks
across Desktop/Laptop/Mobile with 3 intentional mobile-only skips. A direct
production browser inspection confirmed all five refined seller cards render
the `PARTIAL` label `Đang hoàn thiện thêm bước`. Frontend/API health returned
`200`/`ok`. `AF-DEP-002` is resolved for deployment verification; remaining
authenticated mutation/provider/Admin UAT remains open.

Post-deploy full production regression follow-up 2026-08-26: the complete
no-credential `Front-End/e2e` matrix passed 165/165 executed tests across
Desktop `1440x900`, Laptop `1280x720` and Mobile `390x844`, with 60 intentional
credential/API skips and 0 failures. Public catalog, auth-negative,
authorization, responsive, QR, live, PWA and Help/Journey coverage remained
green after `d3bd7fd`; authenticated, mutation and provider-dependent scopes
remain separately gated.

Post-deploy safe authenticated UAT follow-up 2026-08-26: Buyer/Seller
read-only route coverage passed 6/6 across Desktop/Laptop/Mobile. Affiliate,
chat, orders and seller-live read-only coverage passed 9/9, and permission
coverage passed 24/24 after one Laptop auth-limiter timeout was rerun in
isolation successfully. Combined safe authenticated coverage is 48/48 with no
observed 5xx responses or mutations. Checkout/payment/order transitions,
wallet, provider and Admin flows remain open.

Cart/checkout read-only follow-up 2026-08-27: Buyer cart loading and empty
checkout route checks passed 6/6 across Desktop/Laptop/Mobile with no observed
5xx responses. The reversible cart quantity assertion was intentionally skipped
3/3 because the seeded cart exposed no usable item/quantity badge fixture; no
cart mutation, order creation or payment was performed.

Admin read-only follow-up 2026-08-27: the focused Admin route inventory ran
against production revision `d3bd7fd` and passed 3/3 across Desktop/Laptop/Mobile
for `/admin`, users, shop registrations, product registrations, vouchers,
categories, wallet, chat and withdrawal requests. No observed 5xx response or
Admin mutation occurred. This establishes PARTIAL evidence for A01, A02, A04,
A05, A08 and A09 only; A03, A06, A07 and A10 plus all Admin mutations remain
open.

Admin status deployment follow-up 2026-08-27: deployment run `33029197905`
completed successfully for Front-End `bb0eee1`. Post-deploy Help/Journey
regression passed 15/15 executed checks with 3 intentional mobile-only skips;
the live Help registry shows PARTIAL for A01, A02, A04, A05, A08 and A09 and
UNVERIFIED for A03, A06, A07 and A10. The post-deploy Admin route inventory
passed 3/3 across Desktop/Laptop/Mobile. Raw Admin dashboard captures at
1440×900 and 390×844 were inspected as PII-safe UAT evidence; annotated final
visuals remain pending.

Final deployment verification 2026-08-27: follow-up run `33029734247` completed
successfully for Front-End `e1c3aff`. The final combined read-only production
regression passed 18/18 executed checks across Desktop/Laptop/Mobile with 3
intentional mobile-only skips: Admin route inventory passed 3/3 and
Help/Journey passed 15/15. Frontend returned HTTP 200 and canonical API health
returned `ok` from `api-gateway`. No mutation, payment, order transition,
withdrawal or provider action was performed.

A01 visual deployment follow-up 2026-08-27: deployment run `33030375327`
completed successfully for Front-End `9637e9f`. The A01 Dashboard Journey
Center step renders the Desktop and Mobile annotated assets at their real
platform-specific paths, both returning HTTP 200. A01 visual evidence is now
accepted for the read-only dashboard step; remaining Admin journey visuals and
all Admin mutation evidence remain pending.

Final served-visual regression 2026-08-27: against the deployed Front-End
`9637e9f`, the combined read-only Help/Journey and Admin suite passed 18/18
executed checks across Desktop/Laptop/Mobile with 3 intentional mobile-only
skips. This included the A01 Dashboard visual binding and the full nine-route
Admin read-only inventory; no mutation or provider action was performed.

Admin visual evidence follow-up 2026-08-27: against production Front-End
`9637e9f`, a read-only Admin capture passed 2/2 viewport projects (Desktop and
Mobile). PII-bearing users and Shop-registration captures were discarded;
product-registration (A05) and platform-voucher (A09) raw captures passed
visual inspection and received separate annotated documentation copies. No
Admin mutation or provider action was performed.

Final A05/A09 visual deployment verification 2026-08-27: deployment run
`33032228853` completed successfully for Front-End `7e7a12a`. The post-deploy
Help/Journey suite passed 18/18 executed checks across Desktop/Laptop/Mobile
with 3 intentional mobile-only skips, including both accepted Admin visual
bindings. Frontend and API health returned 200; all four new visual URLs
returned HTTP 200. No mutation or provider action was performed.

Final combined read-only regression 2026-08-27: against production Front-End
`7e7a12a`, Admin route inventory plus Help/Journey passed 21/21 executed checks
across Desktop/Laptop/Mobile with 3 intentional mobile-only skips. This
reconfirms the nine Admin routes and A01/A05/A09 platform-specific visual
bindings on the final deployed revision.

Authenticated Buyer Buy Now quote retest 2026-08-27: using the approved seed
buyer identity in the production UI, the public offer
`c831f5d5-4b75-46db-95fc-c687f0fe6b2b` was opened and the available `500ml` /
`Chai lẻ` variant selected. The default address loaded; GHN `GHN_1` returned
with a `21,001 VND` fee and `3-4 ngày` estimate. The authoritative
`POST /api/offers/buy-now/quote` response returned HTTP `201` with base amount
`137,000`, shipping `21,001`, discount `0` and buyer payable `158,001 VND`;
the UI rendered the same total. No order, cart, payment or provider mutation
was performed. This is a production read-only quote pass across Desktop
1440x900, Laptop 1280x720 and Mobile 390x844; historical cart quote `400` and
order mutation remain open.

Authenticated Seller read-only fixture follow-up 2026-08-27: the approved
Seller Center session loaded the dashboard, product list, order list/detail,
wallet, voucher and Affiliate workspaces without a mutation. The session
showed 5 active product records, 13 historical delivered orders, a 46,000,000
VND available wallet balance with a masked verified payout account, one active
Affiliate program with 5 members and 12 conversions, and one active shop
voucher. The live workspace explicitly reported no eligible active/approved
product and no active voucher for pinning. Product edits, order transitions,
wallet withdrawal/top-up, voucher/Affiliate mutations and Agora provider work
remain pending and were not clicked.

Admin route-gap follow-up 2026-08-27: production Admin UI login succeeded with
the approved Admin identity. Direct read-only navigation to `/admin/kyc`,
`/admin/moderation`, `/admin/orders` and `/admin/audit` rendered only the empty
app root. Source inspection confirms those four paths are absent from
`Front-End/src/App.tsx`; no route-specific API request or mutation occurred.
The corresponding A03/A06/A07/A10 Help entries remain `UNVERIFIED` and are
explicitly classified as not implemented in the current frontend route map.

Authenticated Buyer account read-only follow-up 2026-08-27: production UI
navigation with the approved seed buyer rendered `/profile`,
`/profile/address`, `/profile/orders`, `/profile/wallet` and
`/affiliate?tab=member` after authentication. Profile/address content, the
order-list surface, the wallet surface and the Affiliate empty state loaded;
the QR verification-history path `/profile/verify-history` rendered only an
empty app root because it is absent from the current `Front-End/src/App.tsx`
route map. No profile, address, wallet, Affiliate, order, payment or provider
mutation was performed. AF-U-001 and AF-B-004 are therefore read-only Partial;
mutations, ownership-after-reload and verification-history implementation
remain open.

Authenticated Affiliate program read-only follow-up 2026-08-27: the production
`/affiliate` view loaded one open program with its brand, tier rates, hold
period and referral-code field; the authenticated `?tab=member` view loaded
the empty member state. The program and member API reads returned `200` and no
console errors were observed. The `Tham gia` action was not clicked, so join,
attribution, conversion and payout remain unverified.

Affiliate visual deployment follow-up 2026-08-27: production deployment run
`33044485519` completed successfully for Front-End `622b1e9`. The accepted S07
program-discovery visual binding returned the Desktop asset at 1440x900 and
1280x720, and the Mobile asset at 390x844; each image loaded at its expected
native width. The Journey Center label matched the selected platform, all
observed requests were successful and no console errors/warnings were present.
No Affiliate join, attribution, conversion, payout or other mutation occurred.

Affiliate visual regression follow-up 2026-08-27: the existing production
Help/Journey Playwright suite passed 22/22 executed checks across Desktop,
Laptop and Mobile, with 2 intentional mobile-only skips. This includes the
new S07 Affiliate visual binding plus the searchable Help surface, platform
override, Buyer/Admin visual bindings, pending-step placeholder, deep links
and contextual QR help link. No mutation, payment, order transition or
provider action was performed.

Mutation/provider gate audit 2026-08-27: the repository contains a destructive
disposable UAT seed and a withdrawal-only seed, both requiring an explicitly
approved hosted-UAT target/override. The current execution scope exposed only
production, so no seed, reset, mutating checkout, withdrawal, webhook replay,
Affiliate state transition or live-provider action was attempted. AF-UAT-007
is classified `BLOCKED_EXTERNAL` until a separate UAT/staging target,
credentials and provider sandbox scope are supplied.

Contextual-help deployment follow-up 2026-08-27: production deployment run
`33045487946` completed successfully for Front-End `04c62ab`. The global
footer `Hướng dẫn xác thực` link now resolves to the QR verification journey;
the focused production check passed on Desktop, Laptop and Mobile. The full
Help/Journey suite passed 24/24 executed checks with 3 intentional mobile-only
skips, including the new footer regression. No mutation, payment, order
transition or provider action was performed.

Public Help surface audit follow-up 2026-08-27: `https://antifake.io.vn/help`
returned the document and six observed static/runtime assets successfully,
with no console errors or warnings. The live accessibility snapshot exposed
the Help heading, search field, role filters, journey links and evidence-state
labels, including QR, Seller Wallet and Affiliate journeys. Lighthouse
snapshot scores were Accessibility 100 and Best Practices 100; SEO 83 and
Agentic Browsing 50 remain informational observations. No authenticated data,
mutation or provider action was used.

Seller Wallet visual target check 2026-08-27: a safe read-only navigation to
production `/seller/wallet` from the existing browser context redirected to
`/auth`, so no authorized seller session was available for capture. No
credential was supplied or extracted, and no login, wallet mutation or
provider action was attempted. S08 final visual status is
`BLOCKED_EXTERNAL`; existing read-only wallet evidence remains `PARTIAL`.

Admin Help status normalization follow-up 2026-08-27: deployment run
`33046952049` completed successfully for Front-End `b9d5f48`. The new
no-credential production assertion confirmed A03, A06, A07 and A10 display
the `NOT_IMPLEMENTED` state on Desktop, Laptop and Mobile; the full
Help/Journey regression passed 27/27 executed checks with 3 intentional
mobile-only skips. The four frontend routes remain absent, and no Admin
mutation or provider action was performed.

Final Admin Help status regression follow-up 2026-08-27: deployment run
`33050185145` completed successfully for Front-End `4a93130`. The complete
no-credential Help/Journey production regression passed 27/27 executed checks
across Desktop, Laptop and Mobile with 3 intentional mobile-only skips. This
includes the A03/A06/A07/A10 `NOT_IMPLEMENTED` assertion, accepted Admin and
Affiliate visuals, platform override, deep links, contextual help and footer
verification link. No authenticated data, mutation or provider action was
used.

Full no-credential production regression follow-up 2026-08-27: against the
deployed Front-End `4a93130`, the existing Playwright matrix scheduled 240
tests and completed with 192 passed, 48 intentional credential/local-gate
skips and 0 failures. Coverage included public guest routes, responsive
overflow, negative authentication and permissions, QR, quote-only Buy Now,
backend unauthenticated authorization, PWA, Help/Journey and the new Admin
`NOT_IMPLEMENTED` guard. No authenticated mutation, payment, order transition,
withdrawal or provider action was performed.

Unavailable-journey safety follow-up 2026-08-27: deployment run `33051349776`
completed successfully for Front-End `ed20fa5`. The production Help/Journey
suite passed 30/30 executed checks across Desktop, Laptop and Mobile with 3
intentional mobile-only skips. Direct deep-link coverage confirms that an
Admin journey marked `NOT_IMPLEMENTED` renders an explicit unavailable state
without actionable step instructions or next-step navigation. No
authenticated data, mutation or provider action was performed.

Unavailable-journey CTA follow-up 2026-08-27: deployment run `33052403625`
completed successfully for Front-End `fd937ab`. The production Help/Journey
suite passed 30/30 executed checks across Desktop, Laptop and Mobile with 3
intentional mobile-only skips. `NOT_IMPLEMENTED` Admin cards now say `Xem
trạng thái`, and direct deep links render the unavailable state without
actionable step instructions or next-step navigation. No authenticated data,
mutation or provider action was performed.

Post-change full no-credential production regression 2026-08-27: against the
deployed Front-End `ed20fa5`, the Playwright matrix scheduled 243 tests and
completed with 195 passed, 48 intentional credential/local-gate skips and 0
failures. Public, responsive, negative-auth, QR, quote-only checkout,
authorization, PWA and Help/Journey coverage remained green; no authenticated
mutation, payment, order transition, withdrawal or provider action was
performed.

Current deployed revision regression 2026-08-27: against Front-End `fd937ab`
(deployment run `33052403625`), the complete no-credential production matrix
scheduled 243 tests and completed with 193 passed, 50 intentional skips and 0
failures. The skips matched declared credential, local-only quote-mock,
mobile-project and runtime fixture gates; no mutation, payment, order
transition, withdrawal or provider action ran.

Documentation link regression 2026-08-27: every local Markdown and image link
in `docs/user-guide/*.md` resolved successfully; runtime Help routes remain
covered by the existing Help/Journey checks.

QR history navigation follow-up 2026-08-27: Front-End commit `3c512a8`
replaced the dead Buyer profile sidebar target `/profile/verify-history` with
the supported public `/qr` verification route. The production browser
regression `e2e/profile-navigation.spec.ts` passed 3/3 projects across
Desktop/Laptop/Mobile after the push; it used a synthetic local session and
mocked API responses and performed no mutation. The exposed dead link is
resolved, while the separate QR history feature remains unimplemented and
outside verified guide claims.

Help accessibility follow-up 2026-08-27: Lighthouse initially found Help
step/placeholder and Mobile bottom-navigation text just below the 4.5:1
contrast threshold. Front-End commit `8157ffa` corrected those shared colors.
Deployment run `33071400901` completed successfully; a fresh isolated
production context served the new bundle, Lighthouse accessibility passed
100/100 on Desktop and Mobile, Mobile had no horizontal overflow, and no
console errors were observed. No authenticated data or mutation was used.

Journey Center viewport follow-up 2026-08-27: a fresh isolated production
context at `390x844` selected the Mobile guide for B04 step 03, then the
Desktop selector switched the same step to the Desktop guide without a
navigation or console error. The served JS/CSS assets were the `8157ffa`
bundle; no authenticated data or mutation was used.

Current-revision profile regression 2026-08-27: `e2e/profile-navigation.spec.ts`
passed 3/3 against production Front-End `8157ffa` across Desktop, Laptop and
Mobile. The test used a synthetic local session and mocked API responses only;
it confirmed the Buyer profile entry targets supported public `/qr` navigation
and performed no mutation.

Help Center visual refresh 2026-08-27: the public `/help` shell was recaptured
from the deployed Front-End `8157ffa` at Desktop `1440×900` and Mobile
`390×844` after the shared contrast fix. Each raw screenshot has a separate
deterministic annotated copy, both pairs are registered in the Visual Manifest,
and the original files remain untouched. The captures contain public content
only, with no credentials or PII; they document the Help shell and do not
upgrade any Buyer, Seller or Admin feature journey.

Current-revision Help/Journey regression 2026-08-27: `e2e/help-journey.spec.ts`
passed 30/30 executed checks against production Front-End `8157ffa` across
Desktop, Laptop and Mobile, with 3 intentional mobile-only skips. The suite
covered search, role filtering, platform-specific visuals, unavailable Admin
journeys, deep links and public contextual-help links. No authenticated data,
mutation or provider action was used.

Current-revision responsive regression 2026-08-27: `e2e/responsive.spec.ts`
passed 21/21 against production Front-End `8157ffa` across Desktop, Laptop and
Mobile for `/`, `/community`, `/live`, `/categories`, `/qr`, `/auth` and
`/help`. No route had horizontal overflow; no authenticated data, mutation or
provider action was used.

Current-revision guest/permission regression 2026-08-27: `e2e/guest.spec.ts`
and `e2e/permissions.spec.ts` passed 51/51 executed checks across Desktop,
Laptop and Mobile, with 3 intentional credential-gated skips. Public routes
loaded without blank pages or server errors, while protected Admin, checkout,
wishlist, message and payment routes redirected guests to authentication. No
mutation or provider action was used.

Current-revision QR smoke 2026-08-27: `e2e/qr.spec.ts` passed 3/3 across
Desktop, Laptop and Mobile. The QR page returned no server errors and no
access/refresh token text was rendered. No verification mutation or provider
action was used.

Current-revision Buyer catalog regression 2026-08-27: `e2e/catalog.spec.ts`
passed 15/15 against Front-End `8157ffa` across Desktop, Laptop and Mobile.
Public product and Shop navigation, branded Shop banner fallback,
category-to-search filtering, and search results/empty-state behavior remained
green. No authenticated data, mutation or provider action was used; B02 stays
`PARTIAL` for sorting, reviews, provenance and authenticated purchase steps.

Current-revision local quality gate 2026-08-27: Front-End `8157ffa` passed
`npm run lint`, `npm run build` (`tsc -b` plus Vite production build), and the
local test suite across 16 files passed 75/75, including the documentation
verifier (`test/help-content.test.mjs`) at 19/19. The build emitted only the
existing large-chunk advisory; no new acceptance failure was observed.
The required named gates also passed: `test:auth` 3/3, `test:live` 12/12,
`test:payos` 7/7 and `test:pwa` 12/12.

Current deployed revision no-credential regression 2026-08-27: the complete
Playwright matrix scheduled 246 tests across Desktop, Laptop and Mobile and
completed with 198 passed, 48 declared credential/local/runtime skips and 0
failures. Public guest routes, catalog, auth-negative, permissions, QR,
quote-only Buy Now, backend authorization, PWA, Help/Journey, profile
navigation, header badges and flash-sale navigation remained green. No
authenticated mutation, payment, order transition, withdrawal or provider
action was performed.

Retained UAT draft consistency follow-up 2026-08-27: the legacy
`docs/HUONG_DAN_SU_DUNG_ANTIFAKE.md` no longer repeats the unscoped historical
`102 passed, 3 skipped` aggregate. It now points readers to the revision-scoped
canonical UAT matrix/report and labels its images as UAT evidence rather than
final feature sign-off.

Current-revision backend non-mutating quality audit 2026-08-27: Back-End
`3b59ab9` passed `npm run test:ci` (7 suites / 25 tests),
`npm run build:deploy`, and `npx.cmd prisma validate --schema
prisma/schema.prisma`. The separate check-only command
`npx.cmd eslint apps libs test --ext .ts` failed with 8,390 problems (8,328
errors and 62 warnings; 7,452 potentially fixable). The repository lint script
was not run because it includes `--fix`; no broad auto-fix was attempted.
Backend behavior/build validation therefore remains green, but backend lint
sign-off is open under `AF-TECH-002`.

Authenticated-scope recheck 2026-08-27: no approved UAT URL, role credential,
mutation flag or provider-sandbox variable was present in the current shell.
No credential value was inspected or logged; authenticated, payment, wallet,
affiliate conversion/payout and live-provider UAT remain pending on approved
external scope.

Repository boundary audit 2026-08-27: `Front-End` at `8157ffa` and `back-end`
at `3b59ab9` are clean independent Git worktrees. The workspace root containing
the canonical `docs/` artifacts is not a functional Git worktree, so the
documentation changes are prepared locally but cannot be committed or pushed
from this checkout without owner-provided repository integration.

Source-audit follow-up 2026-08-27: `docs/user-guide/SOURCE_AUDIT.md` now
explicitly inventories backend/API/UI boundaries for absent Admin routes, QR
history, provider and mutation evidence, affiliate/live evidence, chat
metadata and local mocks/fixtures. No journey status was upgraded; the
documentation verifier remains green at 19/19.

Documentation clarity follow-up 2026-08-27: the feature matrix and registry
now describe B06 and S01 as source/permission reviewed with authenticated
runtime and final visuals still pending. `UX_DOCUMENTATION_GAPS.md` records
DOC-012 for chat avatar, verification and presence metadata not returned by
the backend. No runtime or journey status changed; the verifier remains 19/19.
## Skip reconciliation snapshot - 2026-08-27 (superseded)

The retained 246-test report records 198 passed, 0 failed and 48 skipped.
The exact source audit maps 47 current skipped executions: 39 role-auth fixture
blocks, 6 hosted executions of local-only mocked checkout tests, and 2
desktop/laptop executions of a mobile-only guide test. The 48th retained record
has no stable title or source gate and is tracked as one audit-only
`OTHER_EXTERNAL_BLOCKER`; it is not treated as a product test.

The actionable matrix, minimum fixture request, read-only scope, mutation tiers,
provider separation, Admin gap reconciliation, AF-TECH-002 baseline analysis,
documentation boundary, denominator and 28-journey status are maintained in
[`docs/UAT_SKIP_RECONCILIATION.md`](UAT_SKIP_RECONCILIATION.md).

Historical pre-reconciliation denominator (superseded): `TOTAL_DISCOVERED=246`,
`TOTAL_APPLICABLE=237`, `PASSED=198`, `FAILED=0`,
`BLOCKED_EXTERNAL=39`, `NOT_APPLICABLE=2`, `NOT_IMPLEMENTED=0`, `UNSAFE=6`,
`OTHER_EXTERNAL_BLOCKER=1`. The historical executable applicable result was
`198/237`; this snapshot is superseded by the seed/demo and cart closeout
below, and does not promote partial documentation journeys or repeat
already-valid public evidence.

## Seed/demo account re-audit and authenticated UAT — 2026-08-28 (read-only checkpoint; superseded by closeout)

The prior 39 auth-fixture skips were re-audited against `prisma/seed.ts`, all
`prisma/seeds/**`, the Prisma schema, and the login/account-state guards before
requesting any new credentials. Eight seed/demo accounts were discovered:
`admin@antifake.io.vn` and `seed.user01@antifake.local` through
`seed.user07@antifake.local`.

Existing production accounts are usable as follows:

- Buyer: `seed.user01@antifake.local` (`ACTIVE_BUYER_UAT`); active and verified,
  seeded KYC verified level 2, seeded cart/order/notification/chat data.
- Seller: `seed.user02@antifake.local` (`ACTIVE_SELLER_UAT`); active and
  verified, seeded KYC verified level 2, owns three verified Shops.
- Affiliate: `admin@antifake.io.vn` (`ACTIVE_AFFILIATE_UAT`); production login
  succeeded and source has an active AffiliateAccount and active program.
- Admin: `admin@antifake.io.vn` (`ACTIVE_ADMIN_UAT`); email and phone login
  reached `/admin`. The source seed marks this account suspended, but the
  current production effective state authenticated successfully; no account
  state or role was changed.

Users 03–07 exist in source but have unverified email/phone identifiers and
production email login returned HTTP 403. User03/04 have source verified KYC;
user05 has a pending AffiliateAccount; user06/07 have active AffiliateAccounts;
none owns a Shop. No new credentials are required for the authenticated scope.

The 36 read-only executions formerly blocked by auth fixtures were run across
Desktop `1440x900`, Laptop `1280x720`, and Mobile `390x844`: **36/36 passed**,
with no business mutation, payment, provider action, or destructive Admin
action. The intended `/profile/settings` to `/install` redirect was validated
against source and production. The remaining three cart-badge executions have
valid auth and cart data but are held as `BLOCKED_MUTATION_APPROVAL` because
they increment and decrement production cart quantity; run only with an
isolated UAT fixture and cleanup.

### Current denominator

```text
TOTAL_DISCOVERED=246
TOTAL_APPLICABLE=237
PASSED=234
FAILED=0
BLOCKED_EXTERNAL=0
BLOCKED_MUTATION_APPROVAL=3
NOT_APPLICABLE=2
NOT_IMPLEMENTED=0 in the automated denominator
UNSAFE=6
OTHER_EXTERNAL_BLOCKER=1
```

The retained-record equation is `234 + 3 + 2 + 6 + 1 = 246`; applicable
execution status is `234/237`. A03/A06/A07/A10 remain product
`NOT_IMPLEMENTED` and current UAT `NOT_APPLICABLE`, not credential blockers.
The 28 journey statuses remain unchanged and are reconciled with exact missing
evidence in [`docs/UAT_SKIP_RECONCILIATION.md`](UAT_SKIP_RECONCILIATION.md).

## Cart badge and report discrepancy closeout — 2026-08-28

The three formerly held cart-badge executions were run with the existing
`ACTIVE_BUYER_UAT` seeded demo cart on production Front-End `8157ffa`. The
second cart line changed `2 -> 3 -> 2`; the header badge changed `7 -> 8 -> 7`
at Desktop `1440x900`, Laptop `1280x720` and Mobile `390x844`. The final cart
matched the pre-test baseline. Six cart PATCH/GET requests returned HTTP 200;
no payment, wallet, order, provider or destructive Admin action occurred.
Result: **3/3 passed** and `BLOCKED_MUTATION_APPROVAL=0`.

The retained report discrepancy was resolved by inspecting the embedded
`report.json`: all 246 entries were skipped with no test results in a short
harness run, and the associated error context reports a missing Playwright
Chromium executable. `npx.cmd playwright test --list` independently confirms
246 source tests in 23 files. The extra report-only record is an audit artifact,
not a product test, and is classified `NOT_APPLICABLE`.

### Reconciled denominator

```text
TOTAL_DISCOVERED=246
TOTAL_APPLICABLE=237
PASSED=237
FAILED=0
BLOCKED_EXTERNAL=0
NOT_APPLICABLE=3
NOT_IMPLEMENTED=0 in automated denominator
UNSAFE=6
OTHER_EXTERNAL_BLOCKER=0
```

The retained-record equation is `237 + 3 + 6 = 246`. A03/A06/A07/A10 remain
product `NOT_IMPLEMENTED` and current UAT `NOT_APPLICABLE`, outside the
automated denominator. No new credential request was needed.

### Independent workstream status

```text
UAT_STATUS=COMPLETE — 237/237 applicable executions; 0 failures
DOCUMENTATION_STATUS=IN_PROGRESS — 22 PARTIAL, 2 SOURCE_VERIFIED, 4 NOT_IMPLEMENTED
JOURNEY_CENTER_STATUS=IN_PROGRESS — production overview/start-step, deep-link and Desktop/Mobile regression passed on `13c18f4`; remaining journey content coverage remains partial
VISUAL_EVIDENCE_STATUS=IN_PROGRESS — existing accepted assets retained; two PII-safe post-deploy B04 overview captures are now persisted raw and annotated in WorkSpace after the permitted OS-temp copy; full-flow feature visuals remain pending
WORKSPACE_STATUS=PUSHED — WorkSpace documentation chain is pushed to canonical `main`
GOAL_STATUS=BLOCKED — remaining feature evidence requires exact external fixtures/provider sandbox and prohibited production mutations; B04 overview visual persistence is closed via the permitted OS-temp copy
```

Local Journey Center increment: Front-End commit `02fcbfb` adds session-scoped
persistence for the manual Desktop/Mobile choice. Focused content tests,
build, changed-file lint and Desktop/Laptop/Mobile browser verification pass
locally. The change is included in deployed Front-End revision `13c18f4`,
whose production Journey Center regression covered the manual selector at
Desktop `1440×900` and Mobile `390×844`.

Local Journey Center overview increment: Front-End commit `13c18f4` gives an
article URL a real journey overview with an explicit start-step link and keeps
step deep links intact. It was pushed and deployed by the normal `main` workflow
(`33149975815`), then retested in production at Desktop `1440×900` and Mobile
`390×844`; the bundle contained the overview markers, page/static requests were
successful, and no console messages were reported. This verifies the Journey
Center shell behavior only and does not change the 28-journey status
distribution.

These statuses are intentionally independent: the completed applicable UAT
scope does not sign off the incomplete documentation workstream, and the
documented external limitations do not create a product failure.
