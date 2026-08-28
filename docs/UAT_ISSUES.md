# AntiFake UAT issues

## AF-UAT-001 — Guest can render admin console

- Mức độ: Critical
- Role: Khách chưa đăng nhập
- Môi trường: Production baseline `https://antifake.io.vn`, desktop 1440×900
- URL: `https://antifake.io.vn/admin`
- Tiền điều kiện: Context trình duyệt mới, không có token/user
- Các bước tái hiện:
  1. Mở website bằng context Playwright mới.
  2. Điều hướng trực tiếp đến `/admin`.
- Kết quả thực tế: URL giữ ở `/admin`; admin header/sidebar/dashboard được render.
- Kết quả mong đợi: Chuyển đến `/auth`, không render bất kỳ admin shell nào.
- Nguyên nhân: `App.tsx` mount `AdminLayout` mà không bọc `ProtectedRoute`; route
  guard cũ chỉ kiểm tra token và chưa có role constraint.
- Repository: `Front-End`
- File đã sửa: `src/App.tsx`, `src/routes/protectedRoute.tsx`
- Commit: `684ad2c`; test locator follow-up: `08bd6c8`.
- Deployment: Đã push `08bd6c8`; production đã retest sau deployment.
- Cách sửa: Thêm `roles` vào `ProtectedRoute`, yêu cầu role `admin` cho toàn bộ
  `/admin` route tree; guest về `/auth`, non-admin về `/`.
- Cách xác minh local: `npm.cmd run build`; targeted ESLint; Playwright
  permission smoke desktop/laptop/mobile đều passed. Full local E2E: 21 passed,
  3 skipped vì thiếu credential env.
- Cách xác minh production: guest và non-admin redirect đã passed trên desktop
  và mobile Chromium; admin seed login vẫn bị chặn ở `/auth` do account status.
- Regression test: `e2e/permissions.spec.ts`.
- Screenshot: `docs/images/uat-guest-admin-redirect-desktop.png` và
  `docs/images/uat-guest-admin-redirect-mobile.png`.
- Trạng thái: **Fixed và verified production**.

## AF-UAT-006 — Payment callback routes exposed a false success surface

- Mức độ: Critical
- Role: Khách chưa đăng nhập
- URL: `/payment`, `/payment-success`, `/payment-failed`
- Kết quả thực tế: Các callback route không có session; `/payment-success` còn
  hiển thị trạng thái thành công placeholder khi không có checkout state.
- Repository: `Front-End`
- File đã sửa: `src/App.tsx`, `src/components/payment/paymentSuccess.tsx`,
  `e2e/guest.spec.ts`, `e2e/permissions.spec.ts`
- Commit: `a4ebcb8`
- Cách sửa: Bọc cả ba payment routes bằng `ProtectedRoute`; payment success
  yêu cầu order reference hợp lệ trước khi hiển thị thành công.
- Cách xác minh local: build, targeted ESLint và permission E2E đạt.
- Production verification: 21/21 guest redirect cases passed trên desktop,
  laptop và mobile.
- Trạng thái: **Fixed và verified production**.

## AF-UAT-004 — Guest could render wishlist shell

- Mức độ: Major
- Role: Khách chưa đăng nhập
- URL: `https://antifake.io.vn/wishlist`
- Kết quả thực tế: Route user-specific render trực tiếp ngoài auth guard.
- Repository: `Front-End`
- File đã sửa: `src/App.tsx`, `e2e/guest.spec.ts`, `e2e/permissions.spec.ts`
- Commit: `006c541`
- Cách sửa: Bọc `/wishlist` bằng `ProtectedRoute`.
- Production verification: 3/3 viewport guest redirect passed.
- Trạng thái: **Fixed và verified production**.

## AF-UAT-005 — Direct message room route was unprotected

- Mức độ: Critical
- Role: Khách chưa đăng nhập
- URL: `https://antifake.io.vn/messages/:roomId`
- Kết quả thực tế: Route room trực tiếp mount `UserChatPage` không qua guard.
- Repository: `Front-End`
- File đã sửa: `src/App.tsx`, `e2e/permissions.spec.ts`
- Commit: `006c541`
- Cách sửa: Bọc `/messages/:roomId` bằng `ProtectedRoute`, ngăn truy cập room
  trước khi backend ownership check được áp dụng.
- Production verification: 3/3 viewport redirect passed với room ID synthetic.
- Trạng thái: **Fixed và verified production**.

## AF-UAT-003 — Empty shop banner space made shop page look broken

- Mức độ: Major
- Role: Khách/Buyer
- Môi trường: Production trước `551f194`, desktop/mobile
- URL: `https://antifake.io.vn/shop/7916412b-68c5-4d56-b592-25aa2b77a88f`
- Kết quả thực tế: Khi shop không có banner hoặc banner còn đang tải, vùng
  banner 320px trống làm header bị đẩy xa và trang trông như lỗi layout.
- Repository: `Front-End`
- File đã sửa: `src/pages/shop/index.tsx`, `src/css/components/shop/shop.css`
- Commit: `551f194`; test timing follow-up `56e8831`.
- Cách sửa: Thêm fallback banner AntiFake responsive, không để ảnh rỗng tạo vùng
  trắng; giữ nguyên banner thật khi API trả về asset.
- Cách xác minh local: build, ESLint TypeScript và catalog E2E.
- Cách xác minh production: shop detail/fallback assertion passed desktop,
  laptop và mobile sau deployment `56e8831`.
- Screenshot: `docs/images/buyer/shop-detail-desktop.png` (trước),
  `docs/images/buyer/shop-detail-fallback-desktop.png` và mobile (sau).
- Trạng thái: **Fixed và verified production**.

## Admin authenticated UAT — read-only partial, mutations remain open

- Seed source vẫn đặt admin ở user cuối với `accountStatus: suspended`, nhưng
  production state hiện đã cho phép đăng nhập với Admin identity được phê duyệt;
  source seed và runtime state không được coi là tương đương.
- Production read-only route inventory passed 3/3 trên Desktop/Laptop/Mobile cho
  `/admin`, users, shop registrations, product registrations, vouchers,
  categories, wallet, chat và withdrawal requests; không quan sát thấy 5xx.
- Evidence này nâng Admin documentation lên `PARTIAL` cho A01, A02, A04, A05,
  A08 và A09. A03, A06, A07 và A10 là `NOT_IMPLEMENTED` vì các route frontend
  tương ứng chưa tồn tại; không có journey production để chạy.
- Chưa sign-off approve/reject, moderation, order/payment, voucher mutation,
  wallet/withdrawal, KYC upload hoặc bất kỳ Admin mutation nào.

## Push/deployment — resolved

- Frontend local commit: `684ad2c`.
- Frontend `origin/main` trước push: `15c0f6f`.
- Owner đã cho phép push trực tiếp `main`; `08bd6c8` đã được push và production
  đã retest thành công cho guest/non-admin permission boundary.

## AF-UAT-002 — Guest could render checkout controls

- Mức độ: Critical
- Role: Khách chưa đăng nhập
- Môi trường: Production trước `bb276e1`, desktop/laptop/mobile
- URL: `https://antifake.io.vn/checkout`
- Kết quả thực tế: Checkout render địa chỉ, phương thức vận chuyển, phương thức
  thanh toán và nút đặt hàng dù không có session.
- Nguyên nhân: `App.tsx` mount `CheckoutPage` trực tiếp, không có
  `ProtectedRoute`.
- Repository: `Front-End`
- File đã sửa: `src/App.tsx`, `e2e/guest.spec.ts`, `e2e/permissions.spec.ts`
- Commit: `bb276e1`
- Deployment: `bb276e1` đã được push; production health 200.
- Cách sửa: Bọc toàn bộ `/checkout` bằng `ProtectedRoute`.
- Cách xác minh local: build, targeted ESLint và permission E2E đạt.
- Cách xác minh production: desktop/laptop/mobile guest checkout redirect 6/6 đạt.
- Regression test: `e2e/permissions.spec.ts`.
- Trạng thái: **Fixed và verified production**.

## Cập nhật trạng thái sau deployment — 2026-08-03

- AF-UAT-001: **Fixed và verified production** trên desktop 1440×900 và mobile
  Chromium 390×844. Guest `/admin` chuyển về `/auth`; non-admin chuyển về `/`.
- Deployment blocker: **Resolved**. `Front-End:main` đã push tới `08bd6c8` và
  website trả HTTP 200 sau workflow deploy.
- Authenticated admin blocker: **Open**. Admin seed login đã được chạy qua
  browser nhưng vẫn ở `/auth`; source seed đặt account admin ở trạng thái
  `suspended`. Không sửa database production và không bypass guard.
- Authenticated non-admin: **Passed**; login thành công và bị chặn khỏi `/admin`.
- Ảnh evidence final nằm trong `docs/images/`; không chứa password, token hoặc
  cookie.

## AF-PAY-002 — PayOS order cancel fallback had no frontend route

- Severity: Major
- Role: Buyer returning from PayOS
- URL: `/checkout/cancel/:orderId`
- Evidence: production no-credential browser check on 2026-08-04 kept the URL,
  rendered an empty shell, and logged `No routes matched location`.
- Root cause: the backend default cancel URL was `/checkout/cancel/:orderId`,
  but the frontend only defines `/payment-failed`.
- Fix: `Back-End:d031c51` changes the default to `/payment-failed` while
  preserving an explicit `PAYOS_CANCEL_URL` override.
- Local verification: focused backend tests and both production builds pass.
- Production status: **Fixed and safe callback verified after deploy run
  `30842099222`**. The first deploy failed on Prisma advisory-lock timeout;
  workflow retry was added in `Back-End:655381e`.

## AF-PAY-003 — PayOS return state was discarded and wallet webhook code was under-validated

- Severity: Major
- Role: Buyer or wallet owner returning from PayOS
- Evidence: the backend success callback discarded PayOS query fields, while
  the frontend success page required React navigation state. Wallet crediting
  checked only the top-level provider code and could accept a failed nested
  `data.code`.
- Fix: `Back-End:d031c51` allowlists/forwards provider return fields, routes
  failed returns to `/payment-failed`, and requires nested `data.code === '00'`.
  `Front-End:31a2569` parses callback query state and reports pending webhook
  confirmation honestly.
- Local verification: frontend 6/6 PayOS tests, backend 17/17 focused tests,
  frontend build, and backend `build:deploy` pass.
- Production status: **Fixed and safe callback verified after deploy run
  `30842099222`**. Sandbox transaction and real webhook smoke remain required.

## AF-PAY-004 — Wallet top-up return dropped cancellation state

- Severity: Major
- Role: User or seller returning from a PayOS wallet top-up
- Evidence: the user-wallet return controller always redirected to
  `/profile/wallet?topUp=returned` without forwarding PayOS fields; default
  wallet cancel URLs also returned to the wallet without `topUp=cancelled`.
- Production baseline probe before `ab2ea9f`: synthetic cancelled callback
  requested `/api/wallet/top-ups/payos/return?...cancel=true&status=CANCELLED`
  but the browser received `/profile/wallet?topUp=returned` (HTTP 200), proving
  the cancellation state was discarded in the deployed version.
- Fix: the wallet return controller now allowlists and forwards
  `code/id/cancel/status/orderCode`, maps failed/cancelled returns to
  `topUp=cancelled`, and wallet service fallbacks use explicit cancellation
  markers for both user and shop wallets.
- Local verification: wallet return controller 2/2, wallet PayOS service 3/3,
  and combined PayOS/wallet focused tests 21/21 pass.
- Production status: **Fixed and verified after deploy run `30845646717`**.
  Post-deploy synthetic success/cancel probes preserved wallet state and caused
  no console errors.

## AF-PAY-005 - PayOS embedded form rejected the backend return URL

- Severity: Major
- Role: Buyer or wallet owner using embedded PayOS checkout
- Evidence: production iframe returned `Thông tin truyền lên không hợp lệ`
  while its `redirect_uri` pointed to the backend API callback route. The same
  link rendered correctly in PayOS Hosted Page, isolating the failure to the
  embedded configuration contract.
- Fix: `Front-End:873cd1d` always passes the containing AntiFake route
  `/payment` as `RETURN_URL`; `Back-End:d546daa` uses compact numeric PayOS
  order codes compatible with the embedded sample.
- Local verification: frontend PayOS tests 7/7, frontend build and ESLint;
  backend PayOS tests 7/7 and build pass.
- Production verification: after backend deploy #25 and frontend deploy #33,
  a 10,000 VND test link rendered QR/transfer tabs inside the AntiFake iframe.
  The test link was canceled afterward; no payment or wallet mutation occurred.
- Status: **Fixed and verified production for embedded rendering**. Paid
  webhook reconciliation remains pending because no payment was made.

## AF-PAY-006 - Paid wallet top-up was not synchronized to the ledger

- Severity: Critical
- Role: Buyer/wallet owner
- Evidence: an authorized 10,000 VND production payment reached PayOS success,
  but the wallet initially stayed at 1,500,000 VND and had no `TOP_UP` entry.
- Root cause: the PayOS channel webhook reached the order handler, which treated
  the wallet payment as an unknown order and returned success without settling
  the wallet transaction.
- Fix: `Back-End:556b354` routes unknown order webhook payloads to the wallet
  handler, adds authenticated provider-status reconciliation, validates owner and
  amount, and settles through an idempotent ledger transaction. `Front-End:3fe1ce1`
  passes the returned payment link id and refreshes wallet data after reconcile.
- Production verification: deploy backend run #26 and frontend deploy run #35
  succeeded. Reconciliation returned `PAID`; the wallet became 1,510,000 VND and
  showed one completed 10,000 VND `TOP_UP`. Repeating reconciliation kept the
  same balance and did not create a duplicate entry.
- Status: **Fixed and verified production**.

## AF-UI-002 - Header badges were hard-coded or hidden

- Severity: Major
- Role: Buyer and seller
- Evidence: seller header displayed fixed chat/notification values; the main
  header did not render the cart and notification count badges. Production
  after the fix requested unread notifications and showed no badge when the
  real count was zero.
- Fix: `Front-End:a956145` adds a shared unread-count store/polling hook,
  renders seller chat and notification counts, restores buyer cart and
  notification badges, and calculates the cart badge from total quantities.
  `Back-End:751e7d5` adds the exact unread chat count to the notification
  response.
- Local verification: targeted ESLint, frontend build, frontend PayOS tests
  7/7, backend focused notification tests 2/2, backend CI 25/25, and backend
  deploy build passed.
- Production verification: frontend deploy runs #39, #40 and the test-only
  follow-up #41 succeeded. Cart
  PATCH and follow-up GET returned `200`; the badge changed `7 -> 8 -> 7` on
  desktop and rendered `7` on mobile. Notification polling returned `200/304`
  and the unread tab returned zero, so zero badges stayed hidden.
- Status: **Fixed and verified production**.

## AF-S-007 - Seller statistics route had no matching frontend route

- Severity: Major
- Role: Seller
- Evidence: `/seller/statistics` previously rendered the shell without a
  matching route.
- Fix: `Front-End:a956145` maps the route to the existing seller analytics
  dashboard and adds it to the seller route smoke list.
- Production verification: deploy retry #38 succeeded; the route document
  returned `200` with the new bundle and no `No routes matched location` error.
- Production verification: the page rendered revenue/order/product metrics,
  weekly chart, best-selling products and new orders state. `/api/shops/mine`
  returned `200/304`, all analytics requests returned `200/304`, and no console
  errors were recorded.
- Status: **Fixed and verified production**.

## AF-B-003 — Checkout quote returned 400 after shipping options loaded

- Severity: Critical
- Role: Buyer
- Evidence: On production 2026-08-04, authenticated checkout loaded the default
  address and `/api/cart/shipping-options` returned `201` with a GHN option, but
  `/api/cart/checkout/quote` returned `400`. The same result reproduced after a
  fresh page reload; no order was submitted.
- Previous behavior: `Front-End/src/pages/checkout/index.tsx` cleared `quote`
  on failure and the summary fell back to subtotal plus the selected shipping
  fee. This kept the screen rendered but did not establish a server-owned
  payable total.
- Stronger hypothesis from the same production fixture: the cart line showed
  the variant text `Đỏ-S`, while the current public offer page exposes
  `1L/180ml` and `Hộp lẻ/Thùng 12`. The backend quote revalidates the cart offer
  and variant before resolving shipping, so a stale or unavailable cart
  variant can legitimately produce `400` even though the shipping-options
  endpoint can quote the raw cart item. The exact response message still needs
  one authenticated request-body-safe reproduction.
- Source follow-up 2026-08-24: `CheckoutCartUseCase.revalidateSelectedItems`
  fetches the current offer and exact variant, rejects a missing/inactive/hidden
  variant before shipping resolution, and replaces the cart snapshot price with
  the current variant price. A focused regression test now locks this contract
  (`back-end/libs/orders/src/application/use-cases/checkout-cart.use-case.spec.ts`,
  5/5 passed; commit `014fa3f`). This supports the stale-variant hypothesis but
  does not identify the exact production request body or prove the fixture was
  stale; no backend weakening or production fix is claimed.
- Required fix: surface the quote error and fail closed instead of displaying a
  fallback payable total; then repair or remove stale cart variants and retest
  the server quote before enabling order creation.
- Local follow-up: the frontend now shows the quote error, displays no payable
  total while the quote is unavailable, and disables order submission until a
  server quote succeeds. The mocked regression passed on desktop, laptop and
  mobile for both the `400` fail-closed path and the successful authoritative
  total path; frontend build passed. The current commits are deployed.
- Authenticated Buy Now retest 2026-08-27: production offer
  `c831f5d5-4b75-46db-95fc-c687f0fe6b2b` was opened through the UI as the
  approved seed buyer. After selecting the available `500ml` / `Chai lẻ`
  variant, the default address loaded, GHN `GHN_1` loaded with a `21,001 VND`
  fee and `3-4 ngày` estimate, and `POST /api/offers/buy-now/quote` returned
  `201` with `buyerPayableAmount: 158001`, `shippingFeeAmount: 21001` and
  `discountAmount: 0`. The checkout UI rendered `158,001 VND` and kept the
  order button available; no order, cart, payment or provider mutation was
  performed.
- This clears the production Buy Now quote path for all three tested viewport
  scopes, but it does not reproduce or close the historical cart quote `400`. A
  cart fixture with a valid current item and an approved order sandbox are still
  required before checkout/order sign-off.
- Status: **Open; cart checkout/order sign-off blocked; Buy Now
  Desktop/Laptop/Mobile quote path passed**.

## Authenticated Buyer account read-only follow-up - 2026-08-27

- Evidence: `/profile`, `/profile/address`, `/profile/orders`,
  `/profile/wallet` and `/affiliate?tab=member` rendered after UI login with
  the approved seed buyer. The Affiliate page reached its empty state without
  console errors.
- Route gap: `/profile/verify-history` rendered only the empty app root; the
  current `Front-End/src/App.tsx` route map has no matching route.
- Scope: no profile, address, wallet, Affiliate, order, payment or provider
  mutation was performed. Profile/address mutations, order transitions,
  review/dispute coverage and QR history remain open.
- Status: **Partial read-only evidence; route implementation and mutation
  coverage remain open.**

## QR history navigation follow-up - 2026-08-27

- Root cause: the Buyer profile sidebar exposed `/profile/verify-history`, but
  the frontend router had no corresponding route or server-backed history
  contract, so the target rendered only the app shell.
- Fix: Front-End commit `3c512a8` replaces that dead target with the supported
  public QR verification route `/qr` and labels it `Xác thực sản phẩm bằng QR`.
- Regression: `e2e/profile-navigation.spec.ts` passed 3/3 production browser
  projects (Desktop, Laptop and Mobile) after the push; the test uses only a
  synthetic local session and mocked API responses, and performs no mutation.
- Boundary: this resolves the exposed dead navigation target, not the absent
  QR verification-history feature. No history list or history API is claimed.
- Status: **Navigation resolved and production-retested; QR history feature
  remains NOT_IMPLEMENTED / out of the verified guide scope.**

## AF-Q-001 — QR verification control has an incomplete execution path

- Severity: Major
- Role: Guest/Buyer
- Historical production evidence: `/qr` rendered all three tabs and accepted
  an invalid product-link value, but pressing `Kiểm tra ngay` made no API
  request and did not render a result or error. This remains the pre-fix
  production observation; no production retest has been claimed.
- Local fix: `Front-End:717357c` now sends code/link input through
  `GET /api/verifications`, hashes the code server-side, and returns
  server-owned `VERIFIED`, `SUSPICIOUS`, `INACTIVE` or `NOT_FOUND` states.
  Backend focused tests passed 8/8 and the mocked frontend browser test passed
  9/9 across Desktop, Laptop and Mobile. Backend source commit:
  `back-end:3b59ab9`.
- Local image-decoder fix: `Front-End:84a6a15` adds client-side PNG/JPEG/WebP
  decoding with a 5 MB limit, a useful unreadable-image fallback and the
  existing server-owned verification call. The focused QR matrix passed 15/15
  across Desktop, Laptop and Mobile; full lint, TypeScript and production build
  passed.
- Pre-deploy production verification follow-up 2026-08-25: the public
  Help/Journey and QR page-load suite passed 12/12 across Desktop, Laptop and
  Mobile, with 3 intentional mobile-only skips. The documented API returned
  `404` before the new commits were deployed; this historical observation is
  retained to explain the deployment gate.
- Post-deploy production verification follow-up 2026-08-25: Front-End deploy
  run `32803576920`, Back-End quality run `32803581629` and Back-End deploy run
  `32803581635` completed successfully for `Front-End:717357c` and
  `back-end:3b59ab9`. Health returned `200` with `status: ok`; the isolated
  unknown code `UAT-UNKNOWN-20260825` returned `200` with server-owned
  `NOT_FOUND`. Code and product-link flows returned `NOT_FOUND` with `200 GET`
  responses on Desktop, Laptop and Mobile, with no console/page errors or 5xx
  responses. A valid positive fixture, image decoding and final QR visuals
  remain pending.
- Latest post-deploy production verification follow-up 2026-08-25: Front-End
  deploy run `32806940404` completed successfully for `Front-End:84a6a15`.
  Production root returned `200`, API health returned `status: ok`, and the
  deterministic unknown QR image fixture decoded and reached
  `GET /api/verifications?code=UAT-QR-IMAGE-20260825` with `200` plus
  server-owned `NOT_FOUND` on Desktop, Laptop and Mobile. No page or console
  errors were observed. The current public Help/Journey plus QR page regression
  passed 12/12 executed checks with 3 intentional mobile-only skips. A known
  positive production fixture and deployment-matched final QR feature visuals
  remain pending.
- Latest visual evidence follow-up 2026-08-25: after Front-End deploy run
  `32807912265` for `a0b74c4`, raw and separate deterministic annotated QR
  unknown-result captures were recorded at Desktop `1440×900` and Mobile
  `390×844`. They are registered in `docs/user-guide/VISUAL_MANIFEST.md` and
  remain UAT negative-result evidence only; they do not replace the pending
   known-positive fixture or final feature visuals.
 - Public fixture discovery follow-up 2026-08-25: the production catalog
   returned 16 public offers. Public offer details omit verification codes;
   public batch links exposed batch IDs and batch numbers for several offers.
   The checked-in seed formula produced 24 safe candidate codes for those
   public batches, but every candidate returned `200` with server-owned
   `NOT_FOUND`. No positive fixture was inferred or created, and no database
   or label mutation was used.
 - Status: **Partially fixed; code/link and image negative paths are production-verified; known positive fixture is BLOCKED_EXTERNAL; authenticated role UAT and final visuals remain open**.

## AF-TECH-001 — Frontend full lint gate was not green

- Severity: Major
- Role: Maintainer / release gate
- Environment: Current local `Front-End` revision
- Command: `npm.cmd run lint`
- Initial result: ESLint reported 58 errors and 5 warnings across existing
  address, chat, community, checkout, seller, order, product-management and
  service files. The dominant errors were `react-hooks/set-state-in-effect`
  and `@typescript-eslint/no-explicit-any`.
- Current result: `Front-End:7952749` and the preceding remediation commits
  leave `npm.cmd run lint` with 0 errors, 0 warnings, and 0 findings.
- Expected result: Full frontend lint passes before a release-quality sign-off.
- Local scope that does pass: targeted lint for the changed documentation test,
  TypeScript/Vite production build, focused Help/Journey E2E and checkout
  regression tests.
- Status: **Resolved locally**. Production release sign-off remains separate
  from this local lint resolution and still requires deployment verification.

Remediation follow-up 2026-08-24: `Front-End:a143f64` removed seven unsafe
`any` usages from `src/services/order.api.ts`. Targeted lint, TypeScript and
build passed; full lint now reports 56 diagnostics. The quality gate remains
open until the remaining findings are remediated and the complete suite passes.

Product-detail follow-up 2026-08-24: `Front-End:7f3b4c5` removed seven
product-detail diagnostics without an ESLint suppression. Targeted checks and
catalog regression passed; full lint now reports 49 diagnostics. The issue
remains open.

Checkout-address follow-up 2026-08-24: `Front-End:1df240c` removed the two
address effect lint diagnostics; targeted checks, build and checkout regression
passed 6/6 across Desktop, Laptop and Mobile. Full lint now reports 47
diagnostics; the issue remains open.

Address-form follow-up 2026-08-24: `Front-End:0316a22` removed two address
form/ward state-effect diagnostics; targeted checks, build and Buy Now checkout
regression passed 6/6 across all viewports. Full lint now reports 45
diagnostics; the issue remains open.

Address-selector follow-up 2026-08-24: `Front-End:8c7545d` removed the modal
address-fetch state-effect diagnostic; targeted checks, build and Buy Now
checkout regression passed 6/6 across all viewports. Full lint now reports 44
diagnostics; the issue remains open.

Create-address follow-up 2026-08-25: `Front-End:fdc3628` removed the
create-address ward state-effect diagnostic; targeted checks, build and Buy Now
checkout regression passed 6/6 with the local preview server running. Full
lint now reports 43 diagnostics; the issue remains open.

Seller-revenue follow-up 2026-08-25: `Front-End:901f068` removed the seller
revenue chart memo/state-effect findings; targeted ESLint, TypeScript and build
passed. Seller browser regression remains skipped because
`UAT_SELLER_EMAIL` and `UAT_TEST_PASSWORD` are unavailable. Full lint now
reports 41 diagnostics (37 errors, 4 warnings); the issue remains open.

Wallet API follow-up 2026-08-25: `Front-End:3c099e5` removed six wallet
response-list `any` findings with typed payloads and unknown-safe guards.
Targeted ESLint, TypeScript and build passed; no wallet-specific automated test
surface exists in the frontend. Full lint now reports 35 diagnostics (31
errors, 4 warnings); the issue remains open.

Seller product-detail follow-up 2026-08-25: `Front-End:261e2e8` removed four
state-effect errors, two dependency warnings, and one constant-condition
finding. Targeted ESLint, TypeScript and build passed; seller browser
regression remains skipped because seller credentials are unavailable. Full
lint now reports 29 diagnostics (27 errors, 2 warnings); the issue remains
open.

Seller order-management follow-up 2026-08-25: `Front-End:7ed0a3e` removed
three seller order `any` findings and one pagination state-effect finding.
Targeted ESLint, TypeScript and build passed; seller browser regression
remains skipped because seller credentials are unavailable. Full lint now
reports 25 diagnostics (23 errors, 2 warnings); the issue remains open.

Profile-response follow-up 2026-08-25: `Front-End:9cd4fda` removed three
profile/avatar response `any` findings with unknown-safe record helpers and
typed string extraction. Targeted ESLint, TypeScript and build passed. Full
lint now reports 22 diagnostics (20 errors, 2 warnings); the issue remains
open.

Comment-sheet follow-up 2026-08-25: `Front-End:24b4ecd` removed the comment
sheet reset state-effect finding and two untyped error findings. Targeted
ESLint, TypeScript and build passed. Full lint now reports 19 diagnostics (17
errors, 2 warnings); the issue remains open.

Payout-modal follow-up 2026-08-25: `Front-End:8dc34ed` removed the payout
eligibility purity finding, modal reset state-effect finding, and dependency
warning. Targeted ESLint, TypeScript and build passed. Full lint now reports
16 diagnostics (15 errors, 1 warning); the issue remains open.

Community-post follow-up 2026-08-25: `Front-End:99a53f7` removed two
community post auth/like-request `any` findings with unknown-safe errors.
Targeted ESLint, TypeScript and build passed. Full lint now reports 14
diagnostics (13 errors, 1 warning); the issue remains open.

Final response-typing follow-up 2026-08-25: commits `0ef3426`, `21d509d`, and
`c13400f` removed four product/seller/order response `any` findings. Targeted
ESLint, TypeScript and build passed. Full lint now reports 10 diagnostics (9
errors, 1 warning); the issue remains open.

Final lint closeout 2026-08-25: `Front-End:05dcdd3` and `e236fad` deferred
chat realtime/message-list effect updates, and `Front-End:7952749` cleared the
remaining ChatLayout, community, search, product, discussion-feed and address
findings. Full `npm.cmd run lint` now reports 0 errors, 0 warnings, and 0
findings; `AF-TECH-001` is resolved locally.

## AF-SEC-001 — Production dependency audit reported high findings

- Severity: High
- Role: Maintainer / release gate
- Baseline: `react-router`/`react-router-dom` `7.18.1` and transitive
  `socket.io-parser` `4.2.6` were reported by the production-only npm audit.
- Fix: `Front-End:6b24be3` upgraded React Router to `7.18.2` and the compatible
  Socket.IO parser to `4.2.7`.
- Local verification: `npm.cmd audit --omit=dev --audit-level=high` reports
  0 vulnerabilities; lint, TypeScript, build, focused tests and documentation
  integrity passed.
- Production verification: deploy run `32819481662` succeeded; root/API
  health returned `200`; public regression passed 84/84 executed tests. The
  complete no-credential Playwright suite passed 154 tests with 119
  intentional credential-dependent skips and 0 failures; direct authorization
  passed 15/15.
- Status: **Resolved for the current dependency audit; authenticated UAT and
  other release gates remain separate.**

## AF-DEP-001 — Production edge served a stale frontend bundle after deploy

- Severity: Major
- Role: Release / UAT
- Environment: Production, post-Front-End `b9efeed`
- Discovery: the production Help/Journey suite failed the overview assertion
  on Desktop, Laptop and Mobile (3/18 failures), while 12 direct Journey,
  visual and contextual-help checks passed.
- Reproduction: a fresh browser navigation initially loaded
  `index-BFkaJWzL.js`; the console reported `No routes matched location
  "/help"` and the body was blank. A later navigation loaded
  `index-CIHZ0t3I.js`, rendered `/help`, and served the registered visual with
  HTTP 200. Production root and API health both returned `200`.
- Expected: all production edges serve the deployed bundle consistently after
  a successful workflow.
- Root cause: the accepted visuals were initially served under
  `public/help/visuals`, which caused the deployed `dist/help/` directory to
  collide with the SPA `/help` route. Nginx treated `/help` as a directory
  without an index and returned `403`; the stale-bundle observation was the
  first browser symptom of that edge state.
- Fix: Front-End `305edb2` moved served visuals to
  `public/journey-visuals` and added idempotent deployment cleanup for the old
  `public/help` directory. The PWA navigation denylist from `38ef806` also
  keeps `/help` routes on the network path.
- Latest verification: deployment run `32951825727` succeeded. A fresh
  production context served `/help` with the Help heading, no console errors,
  and current bundles; the full Help suite passed 15/15 executed checks across
  Desktop, Laptop and Mobile with 3 intentional mobile-only skips. The direct
  B02 detail visual loaded from `/journey-visuals/` with HTTP 200. The complete
  no-credential production matrix then passed 165/165 executed tests with 117
  intentional credential/API skips and 0 failures out of 282 tests.
- Status: **Resolved for the observed route collision and verified in the
  current production deployment.** Historical CDN/Nginx cache or origin
  consistency remains a manual release follow-up if the stale bundle recurs.

## AF-TEST-001 — Read-only authenticated route suite exceeded the auth limiter

- Severity: Minor (UAT harness)
- Role: Buyer/Seller authenticated UAT
- Environment: Production, Front-End `1fbfeca`
- Discovery: The first elevated production run reached the active Buyer seed
  routes and the first Seller route, then the next fresh Seller login remained
  on `/auth` until the helper timed out. This was not treated as a permission
  pass or a credential failure.
- Root cause: the backend `RateLimitGuard` defines the `auth` profile as 10
  requests per client per 60 seconds. The route specs performed 21 separate
  UI logins in one run, exceeding the production-safe limit.
- Fix: Front-End `1fbfeca` made `loginAs` role-agnostic and awaited the Seller
  index redirect. Front-End `717550e` retains every Buyer/Seller route
  assertion while reusing one authenticated session per role and viewport.
- Local verification: frontend lint and build pass; no purchase, payment,
  order, wallet, or admin mutation was performed.
- Production verification: deployment run `32955596021` completed successfully
  for `717550e`. The corrected Buyer/Seller route suites passed 6/6 across
  Desktop/Laptop/Mobile. The separate safe affiliate, orders, chat, live
  entry and permission checks passed 42/42 after rate-limit-safe batching
  (48/48 combined safe authenticated checks); no purchase, payment, order,
  wallet or admin mutation was run.
- Status: **Resolved and production-verified for the safe read-only UAT scope.**
  Business mutations and provider-dependent flows remain separate gates.

## AF-DEP-002 — Help-status refinement deployment fails at Actions startup

- Severity: Major (release verification)
- Role: Release / Documentation
- Environment: GitHub Actions workflow `deploy-vps.yml`
- Discovery: Front-End commits `dffe8ed` and the focused retry `d3bd7fd` are
  present on `origin/main`. Run `32984881891` for `dffe8ed` and retry run
  `32985079060` for `d3bd7fd` both ended `startup_failure` with zero jobs.
  The workflow itself is reported as active.
- Expected: a successful production deployment run must exist before the
  changed Help metadata can be verified in production.
- Resolution: retry run `32987804285` for `d3bd7fd` completed successfully;
  `origin/main` and the run head match. The deployed source includes the
  `dffe8ed` S02–S06 Help metadata refinement.
- Production verification: the post-deploy Help/Journey suite passed 15/15
  executed checks across Desktop/Laptop/Mobile with 3 intentional mobile-only
  skips. A direct production browser inspection confirmed all five S02–S06
  cards render `Đang hoàn thiện thêm bước` (`PARTIAL`). Frontend and API health
  returned `200`, with API status `ok`.
- Status: **Resolved for deployment verification; authenticated mutation,
  provider and Admin UAT remain separate open gates.**

## Admin read-only evidence follow-up — 2026-08-27

- Deployment run `33029197905` completed successfully for Front-End `bb0eee1`.
- The durable read-only Admin route inventory passed 3/3 across Desktop,
  Laptop and Mobile with no observed 5xx response or mutation.
- Help/Journey regression passed 15/15 executed checks with 3 intentional
  mobile-only skips, and the live Help labels match the documented Admin
  status boundary.
- Raw dashboard captures at Desktop 1440×900 and Mobile 390×844 were inspected
  and are safe as UAT evidence; annotated final assets are still pending.
- Status: **Admin read-only coverage is PARTIAL; Admin mutations and the
  untested A03/A06/A07/A10 journeys remain open.**

## Final Admin/Help deployment verification — 2026-08-27

- Follow-up deployment run `33029734247` completed successfully for Front-End
  `e1c3aff`.
- Combined read-only production regression passed 18/18 executed checks across
  Desktop, Laptop and Mobile with 3 intentional mobile-only skips: Admin route
  inventory 3/3 and Help/Journey 15/15.
- Frontend/API health returned `200`/`ok`; no production mutation or provider
  action was performed.
- Final status remains **UAT_STATUS = IN_PROGRESS**: read-only Admin evidence is
  PARTIAL, while Admin mutations and A03/A06/A07/A10 remain open.

## Admin visual evidence follow-up - 2026-08-27

- Production Front-End `9637e9f` read-only capture passed 2/2 viewport projects:
  Desktop 1440x900 and Mobile 390x844.
- Users and Shop-registration captures were discarded after visual PII review.
  Product-registration (A05) and platform-voucher (A09) captures were clean,
  annotated as separate copies and registered in `VISUAL_MANIFEST.md`.
- Status remains **PARTIAL** for the read-only evidence boundary. No Admin
  decision, mutation, payment, withdrawal or provider action was performed.

## AF-TEST-002 - Admin visual regression inferred the wrong platform

- Severity: Minor (UAT harness)
- Discovery: the first post-deploy run for `9880f82` passed Desktop and Laptop
  but the new Admin visual test expected the Desktop asset in the Mobile project.
- Root cause: the test inferred the platform from `page.viewportSize`, which was
  unavailable in that project configuration.
- Fix: Front-End `7e7a12a` uses the configured Playwright project name instead.
- Verification: local Help content tests, lint and build passed; deployment run
  `33032228853` succeeded and the final Help/Journey regression passed 18/18
  executed checks with 3 intentional mobile-only skips.
- Status: **Resolved and production-verified.**

## Final combined read-only regression - 2026-08-27

- Production Front-End `7e7a12a` deployment run `33032228853` completed
  successfully.
- Combined Admin route inventory and Help/Journey regression passed 21/21
  executed checks across Desktop, Laptop and Mobile with 3 intentional
  mobile-only skips.
- A01, A05 and A09 visual bindings returned the platform-specific assets; all
  four new image URLs returned HTTP 200. No mutation or provider action ran.

## Authenticated Seller fixture follow-up - 2026-08-27

- The Seller Center loaded read-only dashboard, products, orders/detail, wallet,
  vouchers and Affiliate data.
- Production exposed 5 active product records, 13 delivered historical orders,
  a 46,000,000 VND available balance with a masked verified payout account,
  one active Affiliate program and one active shop voucher.
- The live workspace had no eligible active/approved product or active voucher
  to pin. No product/order/wallet/voucher/Affiliate mutation or Agora action was
  performed.
- Status: **Seller evidence PARTIAL; mutation, provider and PII-safe final
  visual gates remain open.**

## AF-AD-003 - Admin Help journeys have no corresponding frontend routes

- Severity: Major
- Evidence: After a successful production Admin UI login on 2026-08-27,
  `/admin/kyc`, `/admin/moderation`, `/admin/orders` and `/admin/audit` were
  opened directly. Each URL rendered only the empty app root; no Admin shell,
  page content or route-specific API request appeared.
- Source confirmation: the current `Front-End/src/App.tsx` defines Admin
  routes for dashboard, users, Shop registrations, product registrations,
  vouchers, categories, wallet, chat and withdrawals, but not those four paths.
- Impact: Help entries A03, A06, A07 and A10 cannot be treated as production
  workflows; they are explicitly classified `NOT_IMPLEMENTED` in the current
  frontend route map. No mutation was attempted.
- Required action: either implement and wire the four routes with approved
  backend contracts/fixtures, or explicitly remove/replace the Help links.
- Status: **Open / NOT_IMPLEMENTED in the current frontend route map.**

## AF-DOC-014 - Affiliate visual binding deployed and verified

- Scope: S07 authenticated Affiliate program-discovery view only.
- Evidence: raw and separately annotated Desktop `1440x900` and Mobile
  `390x844` captures were reviewed as PII-safe after production Front-End
  `7e7a12a`; the deployment run `33044485519` for `622b1e9` succeeded.
- Regression: Journey Center selected the Desktop asset at Desktop/Laptop and
  the Mobile asset at Mobile; image requests returned `200` and console
  errors/warnings were absent.
- Broader regression: the production Help/Journey Playwright suite passed
  24/24 executed checks across Desktop/Laptop/Mobile with 3 intentional
  mobile-only skips, including the S07 Affiliate visual and footer-link tests.
- Status: **Resolved for read-only visual binding; Affiliate join,
  attribution, conversion and payout remain open.**

## AF-DOC-015 - Footer verification help link was a placeholder

- Scope: Public footer contextual help.
- Evidence: Before Front-End `04c62ab`, production rendered
  `Hướng dẫn xác thực` with `href="#"`; the focused regression reproduced the
  received value. After deployment run `33045487946`, Desktop/Laptop/Mobile
  checks passed with `/help/qr/verify-product`.
- Status: **Resolved and production-verified.**

## AF-UAT-007 - Mutation and provider UAT lacks a scoped runtime target

- Scope: Checkout/order, wallet withdrawal, PayOS confirmation, Affiliate
  conversion/payout, and Agora/live-provider mutations.
- Evidence: `docs/handoffs/uat-seed.md` and `back-end/prisma/seeds/README.md`
  describe a destructive disposable UAT seed that refuses hosted databases
  unless `SEED_ALLOW_HOSTED_DB=true` is explicitly set. Payment and live
  handoffs separately keep real sandbox/provider confirmation pending.
- Current boundary: this run had only the production URL available. No seed,
  reset, order/payment mutation, withdrawal, webhook replay or provider action
  was attempted against production.
- Fresh environment check 2026-08-27 found no approved `UAT_BASE_URL`,
  `UAT_API_BASE_URL`, role email, password, mutation or provider-sandbox
  variables in the current shell; values were not inspected or logged.
- Required action: provide an approved non-production UAT/staging URL,
  credentials and provider sandbox scope; then run the destructive seed only
  against that target and re-run the mutation matrix.
- Status: **BLOCKED_EXTERNAL.**

## AF-DOC-016 - Seller Wallet visual capture has no authorized runtime target (historical attempt)

- Scope: S08 Seller Wallet Desktop/Mobile documentation visual only.
- Historical evidence: a read-only navigation to production `/seller/wallet`
  from an unauthenticated browser context redirected to `/auth`; no seller
  session was available in that attempt. The later authenticated Seller fixture
  follow-up loaded the wallet read-only; this issue now tracks only the missing
  approved PII-safe final visual target. No wallet mutation or provider action
  was attempted.
- Required action: provide an approved non-production seller fixture or an
  already-authorized capture session, then capture raw and separately
  annotated PII-safe Desktop `1440x900` and Mobile `390x844` assets.
- Status: **BLOCKED_EXTERNAL for the final visual; S08 read-only runtime
  evidence remains PARTIAL.**

## AF-DOC-017 - Help Center text contrast was below the accessibility threshold

- Severity: Minor
- Role: All roles using Help/Journey Center
- Environment: Production Help/Journey surface, Front-End `fd937ab`
- Discovery: Lighthouse found the current-step number at `2.97:1` on Desktop;
  the placeholder copy measured `4.49:1`, and Mobile bottom-navigation labels
  measured `4.47:1` against white.
- Fix: Front-End `8157ffa` darkened the Help step/placeholder text and shared
  Mobile bottom-navigation label colors while preserving the existing layout.
- Local verification: lint, build, documentation tests (19/19), Help/Profile
  browser checks (33/36 with 3 intentional mobile-only skips), and Lighthouse
  accessibility (100 Desktop, 100 Mobile) passed; Mobile had no horizontal
  overflow.
- Production verification: deployment run `33071400901` completed successfully.
  A fresh isolated production context served the new bundle and Lighthouse
  accessibility passed 100 Desktop and 100 Mobile with no console errors.
- Status: **Resolved and production-verified.**

## AF-DOC-018 - Help Center visual assets refreshed for the current deployment

- Severity: Minor
- Role: Guest/all roles using the public Help Center
- Environment: Production `/help`, Front-End `8157ffa`
- Discovery: The accepted Help shell pair was pinned to the earlier `3b504ba`
  capture even though the current deployment included a shared contrast fix.
- Fix: Recaptured raw Desktop `1440×900` and Mobile `390×844` screenshots from
  the deployed `8157ffa` build and created deterministic numbered annotations
  as separate copies.
- Evidence: `docs/user-guide/VISUAL_MANIFEST.md` records the source page,
  date, revision, viewport, test-data scope and both paths; the raw captures
  contain public content only and no credentials or PII.
- Boundary: These assets document the Help Center shell only. They do not
  upgrade any feature journey or replace the pending authenticated captures.
- Status: **Resolved and registered.**

- Regression follow-up: `e2e/help-journey.spec.ts` passed 30/30 executed
  production checks across Desktop, Laptop and Mobile against `8157ffa`, with
  3 intentional mobile-only skips and no authenticated or mutating action.
- Responsive follow-up: `e2e/responsive.spec.ts` passed 21/21 across Desktop,
  Laptop and Mobile for the seven public routes, with no horizontal overflow.
- Guest/permission follow-up: `e2e/guest.spec.ts` and
  `e2e/permissions.spec.ts` passed 51/51 executed production checks across all
  three viewport projects, with 3 intentional credential-gated skips.
- QR follow-up: `e2e/qr.spec.ts` passed 3/3 across all three viewport projects;
  no server errors or access/refresh token text were observed.
- Buyer catalog follow-up: `e2e/catalog.spec.ts` passed 15/15 across all three
  viewport projects for public product, Shop, fallback, category and search
  paths; B02 remains partial outside this read-only subset.

## AF-DOC-019 - Retained UAT draft quoted an unscoped historical test count

- Severity: Minor
- Role: Internal readers of the retained UAT draft
- Environment: `docs/HUONG_DAN_SU_DUNG_ANTIFAKE.md`
- Discovery: The draft quoted `102 passed, 3 skipped` without identifying the
  production revision or distinguishing it from the current canonical matrix.
- Fix: Replaced the stale aggregate with links to the revision-scoped UAT
  matrix/report and clarified that the draft's images are UAT evidence, not
  feature-flow sign-off.
- Status: **Resolved.**

## AF-TECH-002 - Backend check-only lint gate is not green

- Severity: Major
- Role: Maintainer / all backend flows
- Environment: local Back-End checkout at revision `3b59ab9`
- Command: `npx.cmd eslint apps libs test --ext .ts` (check-only; the repository
  `npm run lint` script includes `--fix` and was not run).
- Actual result: ESLint reported 8,390 problems (8,328 errors and 62 warnings),
  including repository-wide Prettier drift and TypeScript unsafe-assignment,
  unsafe-call and unsafe-member diagnostics. Of these, 7,452 were reported as
  potentially fixable with `--fix`.
- Expected result: the backend check-only lint gate passes without diagnostics.
- Verification that remains green: `npm run test:ci` passed 7 suites / 25 tests,
  `npm run build:deploy` passed, and `npx.cmd prisma validate --schema
  prisma/schema.prisma` passed.
- Boundary: No auto-fix or broad formatting rewrite was attempted; this is a
  repository-wide quality-debt finding, not a claim that a product behavior was
  changed or broken by this UAT pass.
- Required action: schedule a scoped backend lint cleanup, review the resulting
  diff, then rerun the check-only lint, tests, build and Prisma validation.
- Status: **Open.**
## AF-UAT-008 - Current skipped scope reconciled

- Severity: Major for acceptance tracking; no new product defect identified
- Role: UAT owner / release maintainer
- Environment: Front-End `8157ffa`; production no-credential matrix
- Finding: The retained report says 48 skips, while current source and the
  current environment map 47 actual skipped executions. The difference is one
  retained record without a stable title or raw reporter output.
- Classification: 39 `BLOCKED_AUTH_FIXTURE`, 6
  `UNSAFE_PRODUCTION_TEST`, 2 `NOT_APPLICABLE`, and 1
  `OTHER_EXTERNAL_BLOCKER` audit discrepancy. No current literal skip is a
  payment, provider or mutation-approval blocker.
- Fix/documentation: Added the exact matrix, minimum fixture request, provider
  separation, read-only scope, named mutation tiers, Admin route gap handling,
  denominator and 28-journey reconciliation to
  `docs/UAT_SKIP_RECONCILIATION.md`.
- Status: **Reconciled; manual enablement remains limited to the consolidated
  request in that artifact.**

## AF-UAT-009 — Seed/demo auth fixtures validated and read-only scope executed (read-only checkpoint; superseded by AF-UAT-010)

- Severity: Major for acceptance tracking; no new product defect identified
- Role: UAT owner / release maintainer
- Environment: Front-End `8157ffa`; production `https://antifake.io.vn`
- Discovery: The original 39 auth-fixture skips had not yet been checked
  against the project's existing seed/demo accounts.
- Source result: eight accounts exist in the seed (`admin@antifake.io.vn` and
  `seed.user01@antifake.local` through `seed.user07@antifake.local`). user01
  and user02 are active, identifier-verified, KYC-verified level 2 shop owners;
  the Admin is source-suspended but has an active AffiliateAccount.
- Production result: Admin, user01 and user02 authenticated successfully with
  the existing accounts. Users03–07 returned HTTP 403 because their seeded
  email/phone identifiers are unverified; no new credential request was made.
- Reclassification: 36 former `BLOCKED_AUTH_FIXTURE` executions became
  `RUNNABLE_NOW` and passed across Desktop/Laptop/Mobile. The remaining 3 have
  valid auth and cart data but are `BLOCKED_MUTATION_APPROVAL` because the
  assertion increments and decrements production cart quantity.
- Safety: No business mutation, payment, provider action, role/state change or
  destructive Admin action was performed. Cart badge is `SAFE_UAT_MUTATION`
  only on an isolated UAT target with cleanup.
- Status: **Read-only authenticated scope resolved: 36/36 passed; 3 cart
  mutations remain explicitly held.**

## AF-UAT-010 — Cart badge and retained report discrepancy closed

- Environment: Front-End `8157ffa`; production `https://antifake.io.vn`
- Cart fixture: existing seeded `ACTIVE_BUYER_UAT` demo cart; four lines,
  baseline badge `7`, second-line quantity `2`.
- Execution: authorized reversible quantity check `2 -> 3 -> 2` with badge
  `7 -> 8 -> 7` at Desktop `1440x900`, Laptop `1280x720` and Mobile `390x844`.
- Safety/result: six cart PATCH/GET requests returned HTTP 200; final state
  matched baseline; no order, payment, wallet, provider or Admin mutation.
  **3/3 passed.**
- Discrepancy: recovered `playwright-report/index.html` embedded a 246-entry,
  all-skipped, zero-result harness report tied to a missing Chromium executable;
  `playwright test --list` confirms 246 source tests in 23 files.
- Classification: the report-only delta is `NOT_APPLICABLE` stale/duplicate
  audit evidence, not a product test. `OTHER_EXTERNAL_BLOCKER=0`.
- Current denominator: `237/237` applicable passed, `0` failed,
  `NOT_APPLICABLE=3`, `UNSAFE=6`.
