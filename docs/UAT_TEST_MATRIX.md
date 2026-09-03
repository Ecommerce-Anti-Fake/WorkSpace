# AntiFake UAT test matrix

> Trạng thái UAT hiện tại: `237/237` executions thuộc applicable scope đã
> passed, không có failure hoặc external blocker. Các dòng `Blocked` hoặc
> `Chưa chạy` bên dưới là lịch sử/fixture scope và không được hiểu là đã đạt;
> documentation status được theo dõi độc lập.

## Vai trò và dữ liệu kiểm thử

| Role/nhóm | Route chính | API/controller chính | Tiền điều kiện và dữ liệu | Trạng thái xác minh |
|---|---|---|---|---|
| Khách | `/`, `/auth`, `/register`, `/community`, `/live`, `/qr` | catalog, social, live, auth controllers | Không cần đăng nhập | Đã chạy production trên desktop/laptop/mobile: route công khai không trắng trang |
| Buyer | `/profile`, `/cart`, `/checkout`, `/notification`, `/chat` | `user`, `cart`, `orders`, `payment`, `notification`, `chat` | User có token, địa chỉ mặc định, sản phẩm còn hàng | Authenticated read-only routes passed; Buy Now quote passed on production Desktop/Laptop/Mobile; cart/order mutation remain open |
| Seller/shop owner | `/seller/*` | `shops`, `offers`, `orders`, `wallet`, `affiliate`, `live`, `voucher` | User `seed.user01`/`seed.user02`; shop phải được xác định theo dữ liệu thật | Authenticated Seller Center read-only routes passed; mutations and provider flows remain open |
| Affiliate | `/affiliate` | `affiliate/*` | Affiliate là quan hệ `AffiliateAccount` của user, không phải role User riêng | Authenticated program/member read-only view passed; join, attribution, conversion and payout remain open |
| Admin | `/admin/*` | `admin`, `kyc`, `moderation`, `wallet`, `voucher`, `order`, `report` | User có `role=admin` và `accountStatus=active` | Admin login and `/admin` shell passed production; four source-defined routes render an empty app root and mutations remain open |

## Seed audit

- `prisma/seeds/02-users-kyc.seed.ts` tạo user với role `user`, user cuối có
  role `admin`; mật khẩu không ghi vào tài liệu public.
- Chỉ hai user đầu có `emailVerifiedAt` và `phoneVerifiedAt` ngay trong seed,
  nên đây là hai candidate login chính cho buyer/seller.
- `ctx.shopOwners` chỉ nhận hai user đầu. Sáu shop được phân luân phiên giữa
  hai chủ shop; shop đầu có trạng thái `pending_verification`, các shop còn lại
  theo logic seed là `verified`.
- Affiliate account được tạo cho các user ở vị trí 5–8, trong đó có account
  `PENDING` và các account `ACTIVE`; đây là quan hệ nghiệp vụ, không phải role
  riêng.
- Seed hiện đặt `accountStatus: suspended` cho user index 7, đồng thời user
  index 7 là admin. Đây là rủi ro cần xác minh trên production; không được sửa
  production bằng cách bỏ qua guard.

### Seed/demo production re-audit — 2026-08-28

The existing seed/demo identities were validated through normal production UI
login without recording credentials. `BUYER_UAT` and `SELLER_UAT` are the
two source-verified users and own the seeded Shops; `ADMIN_UAT`
authenticated successfully in production despite the source seed's suspended
state. Source also creates an `ACTIVE` AffiliateAccount for that Admin, so the
correct logical fixtures are `ACTIVE_BUYER_UAT=user01`,
`ACTIVE_SELLER_UAT=user02`, `ACTIVE_AFFILIATE_UAT=admin`, and
`ACTIVE_ADMIN_UAT=admin`. No single seeded seller is also an affiliate.

The 36 role-gated authenticated read-only executions passed 36/36 across
Desktop `1440x900`, Laptop `1280x720`, and Mobile `390x844`, with no business
mutation or provider action. The 3 cart-badge executions then passed with the
seeded demo cart using reversible `2 -> 3 -> 2` quantity changes and badge
`7 -> 8 -> 7`, with cleanup verified. Full account states and the 48-record matrix are in
[`docs/UAT_SKIP_RECONCILIATION.md`](UAT_SKIP_RECONCILIATION.md).

## Matrix

| ID | Role | Chức năng | Tiền điều kiện | Các bước kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|---|---|
| AF-G-001 | Khách | Trang chủ | Không đăng nhập | Mở `/` trên desktop/laptop/mobile | Trang AntiFake hiển thị, không trắng trang/5xx | **Passed production 3/3 viewport** |
| AF-G-002 | Khách | Auth | Không đăng nhập | Mở `/auth` trên desktop/laptop/mobile | Form đăng nhập hiển thị, không trắng trang | **Passed production 3/3 viewport** |
| AF-G-003 | Khách | Đăng ký | Không đăng nhập | Mở `/register` trên desktop/laptop/mobile | Màn hình đăng ký hiển thị | **Passed production 3/3 viewport** |
| AF-G-004 | Khách | Community | Không đăng nhập | Mở `/community` trên desktop/laptop/mobile | Feed/shell hiển thị, không trắng trang/5xx | **Passed production 3/3 viewport** |
| AF-G-005 | Khách | Livestream discovery | Không đăng nhập | Mở `/live` trên desktop/laptop/mobile | Trang discovery hiển thị | **Passed production 3/3 viewport** |
| AF-G-006 | Khách | QR | Không đăng nhập | Mở `/qr` trên desktop/laptop/mobile | Màn hình xác thực QR hiển thị | **Passed production 3/3 viewport** |
| AF-A-001 | Khách | Bảo vệ `/admin` | Không có token | Mở `/admin` | Chuyển `/auth`, không render admin shell | **Passed production 3/3 viewport after fix** |
| AF-A-002 | User/buyer | Bảo vệ `/admin` | Token user hợp lệ | Đăng nhập rồi mở `/admin` | Không vào admin, chuyển về route an toàn | Automated test added; production blocked |
| AF-A-003 | Admin | Đăng nhập admin seed | Account active và verified | Đăng nhập bằng UI, reload `/admin` | Vào admin, session giữ sau reload | **Passed production UI login and `/admin` shell; route-gap/mutation coverage remains open** |
| AF-U-001 | Buyer | Hồ sơ/địa chỉ | Buyer đăng nhập | Xem/sửa/thêm/đặt mặc định/xóa địa chỉ, reload | Dữ liệu đúng sau reload, ownership đúng | **Partial: authenticated profile/address read-only routes passed; profile/address mutations and ownership-after-reload verification remain pending** |
| AF-U-002 | Buyer | KYC | Buyer có trạng thái phù hợp | Upload hồ sơ, kiểm tra pending/rejected/verified | Validation và quyền xem đúng | Chưa chạy production |
| AF-B-001 | Buyer | Catalog/product detail | Có offer public | Tìm kiếm, lọc, mở detail, biến thể, yêu thích | Giá/stock/shop/review đúng | Public catalog navigation passed; authenticated wishlist pending |
| AF-B-002 | Buyer | Cart | Buyer đăng nhập | Thêm, sửa số lượng, xóa, reload | Cart riêng user, tổng tiền đúng | **Partial: authenticated read-only cart route passed; seeded-demo badge quantity `2 -> 3 -> 2` and header `7 -> 8 -> 7` passed with cleanup; add/delete, cart-total and reload mutation coverage remain pending** |
| AF-B-003 | Buyer | Checkout | Cart và địa chỉ hợp lệ | Quote, shipping option, voucher/affiliate, tạo order | Backend tự tính tiền, không tạo trùng | **Partial: Buy Now shipping and authoritative quote passed on production Desktop/Laptop/Mobile; cart quote and order mutation remain pending** |
| AF-B-004 | Buyer | Order/review/dispute | Có order an toàn | Mở detail, trạng thái, receive, review/report | Ownership/state transition đúng | **Partial: authenticated order-list read-only route passed; receive, review, dispute and state-transition coverage remain pending** |
| AF-S-001 | Seller | Seller access/shop | User sở hữu shop verified | Mở `/seller`, xem shop context | Chỉ đúng shop, shop pending bị chặn đúng flow | **Partial: authenticated Seller Center/read-only route passed; ownership/mutation pending** |
| AF-S-002 | Seller | Offer/product management | Seller có shop | Tạo/sửa media/variant/stock/gửi duyệt | Validation, ownership, moderation state đúng | **Partial: 5 product records and read-only list/detail passed; mutation pending** |
| AF-S-003 | Seller | Seller orders | Có order fixture | Xem và chuyển trạng thái hợp lệ | Không xem/cập nhật shop khác | **Partial: 13 historical orders and delivered detail passed; transition pending** |
| AF-S-004 | Seller | Wallet/withdrawal | Wallet/payout account phù hợp | Xem số dư, tạo withdrawal an toàn | Không rút quá số dư, chống submit trùng | **Partial: wallet/ledger and masked verified payout account read-only passed; mutation/provider pending** |
| AF-S-005 | Seller | Voucher/affiliate/live | Shop/program phù hợp | Tạo voucher, xem commission, tạo live session | UI/API state đồng bộ | **Partial: voucher/Affiliate read-only passed; live has no eligible product/voucher and Agora/mutations remain blocked** |
| AF-F-001 | Affiliate | Attribution | Có affiliate code | Mở link `?aff=...`, mở product, reload | Attribution hợp lệ, code sai không làm vỡ flow | **Partial: authenticated program/member read-only view passed; attribution fixture and reload coverage remain pending** |
| AF-F-002 | Affiliate | Conversion/commission/payout | Order test an toàn | Checkout sandbox, xem ledger/payout | Không ghi commission hai lần/self-referral | Chưa chạy; cần sandbox |
| AF-C-001 | User | Community post/comment | User đăng nhập | Tạo/sửa/xóa bài, comment/reply/like/report | Ownership, XSS, reload đúng | Chưa chạy production |
| AF-C-002 | Buyer/Seller | Chat realtime | Hai session, không dùng dữ liệu nhạy cảm | Tạo thread, gửi/nhận, refresh, reconnect | Authorization và realtime đúng | Chưa chạy production |
| AF-L-001 | Buyer/Seller | Livestream | Live fixture và Agora config | Join/host/comment/reaction/pin/leave | Host boundary, reconnect, camera/mic state đúng | Blocked: deployed Agora/migration gate chưa xác minh |
| AF-Q-001 | Khách/Buyer | QR chống hàng giả | Mã test an toàn | Nhập/tải ảnh QR hợp lệ, sai, đã scan/risk cao | Không lộ dữ liệu nội bộ, kết quả server-owned | **Partial: backend 8/8, frontend QR 15/15, and code/link/image negative paths production-verified; known positive fixture and final visuals pending** |
| AF-AD-001 | Admin | Dashboard/user/shop/product review | Admin active | Xem list/detail/filter/approve/reject | API admin trả đúng, audit/notification đúng | **Partial: read-only covered routes passed 3/3 viewports; review decisions remain open and A03/A06/A07/A10 are NOT_IMPLEMENTED in the current frontend route map** |
| AF-AD-002 | Admin | Voucher/category/wallet/moderation | Admin active | Thao tác trên fixture được phép | Idempotency, role/ownership, audit đúng | **Partial: voucher/category/wallet/chat read-only covered; mutations remain open and moderation/audit/order routes are NOT_IMPLEMENTED in the current frontend route map** |
| AF-API-001 | Không token | Backend authorization | Không có access token | Gọi admin/order/wallet routes qua UI/network | 401/403; không chỉ ẩn menu | **Passed production 15/15** |
| AF-RESP-001 | Khách/User | Responsive | Desktop/laptop/mobile viewport | Chạy public/permission smoke ở 1440×900, 1280×720, 390×844 | Không tràn/che, route vẫn đúng | **Passed production safe public/permission scope** |
| AF-TECH-001 | Maintainer | Quality gates | Working tree clean | Front-End lint/build/unit/E2E; Back-End test/build/Prisma | Gate kết quả rõ, không che lỗi | Front-End lint/build/tests/audit and Back-End test/build/Prisma passed; Back-End check-only lint is open under AF-TECH-002 |
| AF-TECH-002 | Maintainer | Backend check-only lint | Backend checkout at `3b59ab9` | `npx.cmd eslint apps libs test --ext .ts` | No lint diagnostics | **Open: 8,390 diagnostics; backend tests/build/Prisma validation pass** |

## API/controller coverage map

Các controller đã được đối chiếu trong `back-end/apps/api-gateway/src/modules`:

- Auth/user/address/KYC/notification: `/auth/*`, `/user/*`.
- Catalog: offers, brands, categories, shops, favorites, reviews, search data.
- Commerce: `/cart/*`, `/orders/*`, PayOS, shipping, vouchers, wallet.
- Seller/admin: shops, admin dashboard/users/verification, moderation, reports.
- Distribution/provenance: networks, nodes, batches, shipments, lineage.
- Social/realtime/live: social posts/comments, chat threads/messages, live
  sessions/comments/reactions and Agora credentials.
- Affiliate: attribution, programs, accounts, codes, conversions, payouts.

Backend admin endpoints use `JwtAuthGuard`, `ActiveUserGuard`, and
`RolesGuard('admin')` in the inspected controllers. The fixed defect was the
frontend route shell, not a replacement for backend authorization.

## Post-deploy evidence — 2026-08-03

- Production desktop Playwright: 8/9 passed; only admin seed login remained
  blocked at `/auth` because the seeded admin account is `suspended`.
- Production mobile Chromium 390×844: 8/9 passed with the same admin result.
- Guest `/admin` and authenticated non-admin `/admin` passed on both viewports.
- AF-RESP-001 is now production-smoke verified for the public/permission scope;
  this does not sign off every authenticated page layout.
- AF-AD-001 remains blocked for authenticated admin walkthrough. Checkout,
  payment, wallet mutation, provider, Agora, chat, upload/KYC and other
  destructive or provider-dependent rows remain unexecuted.

## Requirement coverage additions — 2026-08-04

| ID | Role | Chức năng | Tiền điều kiện | Các bước kiểm thử | Kết quả mong đợi | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| AF-AUTH-002 | Khách | Direct checkout access | Không có token/session | Mở `/checkout` trực tiếp trên 3 viewport | Redirect `/auth`, không render address/payment/order controls | **Passed production after `bb276e1`** |

AF-UAT-002 was found by the laptop production regression and fixed through the
required local-test → commit → push → deployment → production-retest cycle.

| AF-UI-001 | Khách/Buyer | Shop detail banner fallback | Shop không có banner hoặc asset đang tải | Mở shop từ catalog trên desktop/mobile | Không có vùng trắng; banner thật hoặc fallback branded hiển thị | **Passed production after `56e8831`** |

| AF-SEC-001 | Không token | Backend authorization | Không có access token | Gọi admin, cart, order và affiliate endpoints qua Playwright request | Mỗi endpoint trả 401/403, không lộ dữ liệu | **Passed production 15/15** |

| AF-AUTH-003 | Khách | Wishlist access | Không có session | Mở `/wishlist` trực tiếp | Redirect `/auth` | **Passed production 3/3 viewport** |
| AF-AUTH-004 | Khách | Direct message room access | Không có session, room ID synthetic | Mở `/messages/:roomId` trực tiếp | Redirect `/auth`, không render room | **Passed production 3/3 viewport** |

| AF-PAY-001 | Khách | Payment callback route boundary | Không có session/checkout state | Mở `/payment`, `/payment-success`, `/payment-failed` trực tiếp | Redirect `/auth`; không hiển thị false success | **Passed production 21/21** |

| AF-PAY-002 | Buyer | PayOS cancel callback | PayOS cancel return không cần giao dịch thật | Kiểm tra cancel URL và mở route fallback | Route tồn tại, không blank/no-match | **Passed production safe probe after `30842099222`** |
| AF-PAY-003 | Buyer/wallet owner | PayOS return and webhook contract | Sandbox callback payload | Kiểm tra query forwarding, failed return routing, nested webhook code guard | Giữ provider reference; chỉ credit khi nested code `00` | **Callback passed production; webhook sandbox pending** |
| AF-PAY-004 | User/Seller wallet owner | Wallet top-up return/cancel state | PayOS wallet callback | Kiểm tra user-wallet return query và user/shop cancel URL | Không báo thành công khi hủy; giữ provider reference | **Passed production after `30845646717`** |

### Safe production execution addendum — 2026-08-04

- Complete no-credential Playwright suite, rerun after deploy
  `30845646717`: `198 tests: 111 passed, 87 skipped, 0 failed` across desktop,
  laptop, and mobile projects.
- The separate `live.spec.ts` + `auth.spec.ts` run reported `6 passed, 6
  skipped`; the separate affiliate run reported `3 passed, 3 skipped`.
  Skipped cases require authenticated buyer/seller/affiliate/admin credentials.
- A current isolated-Chrome re-check returned document `200` for both synthetic
  PayOS success and cancelled callbacks, preserving the provider query fields;
  the page had no console errors.
- Wallet post-deploy probes returned `200` with `topUp=returned` for PAID and
  `topUp=cancelled` for CANCELLED, preserving all allowlisted provider fields.
- Post-deploy Playwright permission/security/affiliate smoke: `45 tests`,
  `39 passed`, `6 skipped`, `0 failed` across the three viewports.
- Skips are intentionally not counted as authenticated sign-off. Buyer,
  seller, affiliate, admin, checkout mutation, provider sandbox, upload/KYC,
  chat realtime, and Agora rows remain blocked or pending.

### Embedded PayOS execution addendum - 2026-08-04

| ID | Role | Chức năng | Tiền điều kiện | Các bước kiểm thử | Kết quả mong đợi | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| AF-PAY-005 | Buyer/wallet owner | PayOS embedded checkout rendering | Authenticated UAT user; provider test-link creation allowed; no payment | Create a 10,000 VND wallet link, open `/payment`, inspect the nested iframe, then cancel the link | AntiFake stays top-level; iframe shows QR/transfer tabs; no wallet credit on cancel | **Passed production after `873cd1d` + `d546daa`; 1/1; no payment made** |

The embedded return URL is the same frontend `/payment` route displayed by the
iframe. Provider-paid webhook reconciliation is still pending because the
authorized smoke deliberately stopped at link creation and cancellation.

### Authenticated production follow-up - 2026-08-04

| ID | Role | Chuc nang | Tien de | Ket qua | Trang thai |
| --- | --- | --- | --- | --- | --- |
| AF-PAY-006 | Buyer/wallet owner | Real PayOS wallet reconciliation | One previously authorized 10,000 VND payment | Production reconciliation returned `PAID`; wallet increased to 1,510,000 VND and the history showed one completed `TOP_UP` credit of 10,000 VND | **Passed production** |
| AF-PAY-007 | Buyer/wallet owner | Repeated reconciliation idempotency | Reopen the same returned payment URL after it is already paid | The second reconciliation returned HTTP 201; balance stayed 1,510,000 VND and no duplicate `TOP_UP` appeared | **Passed production** |
| AF-U-003 | Buyer | Authenticated read-only shell smoke | Existing buyer session and seeded data | Profile, address, orders, cart, checkout, notifications, messages/chat and affiliate pages loaded; observed API requests were 200/304 and no console errors appeared | **Passed read-only scope; mutations pending** |
| AF-S-006 | Seller | Seller dashboard and wallet read-only smoke | Existing seller/shop session | Seller dashboard and wallet loaded; wallet, transactions, payout accounts and COD settlement requests returned 200 with no console errors | **Passed read-only scope; mutations/provider flows pending** |

The following rows remain open: checkout/order mutation, seller product/voucher
mutation, affiliate conversion/payout, upload/KYC, realtime chat, Agora
livestream, QR scan edge cases, and authenticated admin walkthrough. The seed
admin account remains suspended, so admin sign-off is still blocked without an
active test identity.

### Header badges and seller statistics follow-up - 2026-08-04

| ID | Role | Function | Expected result | Status |
| --- | --- | --- | --- | --- |
| AF-UI-002 | Buyer/Seller | Header unread and cart badges | Chat and notification badges use unread API counts; cart badge uses total item quantity; zero counts stay hidden | **Passed production after `ca11acd` + `751e7d5`; cart badge verified `7 -> 8 -> 7` on desktop and `7` on mobile; local positive-count mock verified cart `3`, notification `4`, chat `2` across 3 viewports** |
| AF-S-007 | Seller | `/seller/statistics` route | Route resolves to the seller analytics dashboard instead of a blank/no-match page | **Passed production after frontend deploy #40; metrics, chart and best-selling products rendered** |

An earlier production attempt saw transient `/api/shops/mine` and offer/cart
failures. The final verification returned `/api/shops/mine` `200/304`, all seller
analytics requests `200/304`, and no console errors. The cart quantity PATCH and
follow-up cart GET both returned `200`; the header badge changed with the real
total and was restored to its original value. The unread notification query
returned `200/304`; the current account had zero unread notifications, so the
notification and chat badges correctly stayed hidden.

The latest full no-credential E2E rerun reported `216 tests: 96 passed, 120
skipped, 0 failed` across desktop, laptop and mobile. The additional passes
cover positive/zero unread badges and both checkout quote branches. Skips remain
limited to credential-dependent role flows.

### Checkout and QR follow-up - 2026-08-04

| ID | Role | Function | Expected result | Status |
| --- | --- | --- | --- | --- |
| AF-B-003 | Buyer | Checkout shipping and quote | Selected cart item receives a shipping option and checkout quote returns the server-calculated payable total | **Partial: historical cart quote returned `400`; the production Buy Now path returned an authoritative `201` quote across Desktop/Laptop/Mobile (`GHN_1`, payable `158,001 VND`); cart quote and order mutation remain pending** |
| AF-Q-001 | Guest/Buyer | QR verification | QR/image/link/code input invokes server verification and renders success or failure | **Partial: 8 backend + 15 local browser tests; deployed production code/link/image negative paths returned `200 GET` + server-owned `NOT_FOUND` across Desktop/Laptop/Mobile; known positive fixture and final visuals pending** |

Historical production read-only checkout evidence used the existing
authenticated buyer session and one selected cart item. The default address
and GHN option loaded, but the cart quote failure was reproducible after a
fresh reload. The current UI fails closed when the quote is unavailable; this
is not sufficient for checkout sign-off. A 2026-08-27 Buy Now retest passed on
Desktop, Laptop and Mobile with an authoritative `158,001 VND` total. Do not
click `Đặt hàng` until the cart quote, provider path and approved order fixture
are retested.

## Documentation workstream — 2026-08-24

| ID | Role | Function | Expected result | Status |
|---|---|---|---|---|
| AF-DOC-001 | Guest/all roles | Help Center `/help` | Searchable role journeys render without authentication and expose stable article links | **Passed local and production public Playwright Desktop/Laptop/Mobile; 3 intentional mobile skips** |
| AF-DOC-002 | Guest/all roles | Journey step deep links | `/help/seller/process-order/confirm-order` opens the requested step with progress and overview navigation | **Passed local and production public Playwright Desktop/Laptop/Mobile** |
| AF-DOC-003 | Guest/all roles | Platform selector | Journey Center defaults to the real viewport and permits Desktop/Mobile override | **Passed local and production public controls at Desktop/Mobile; mobile-specific override was retested in production** |
| AF-DOC-004 | Buyer/Seller/Guest | Contextual help | QR, checkout, seller registration, product and order surfaces link to the relevant journey step | **Passed local and production public QR/footer contextual-help checks; authenticated surfaces remain pending** |
| AF-DOC-005 | Seller | Getting-started checklist | Seller Dashboard derives completion from Shop, offer, voucher and order state; request failure does not claim completion | **Passed local state tests/build; authenticated Seller dashboard read-only route loaded with the existing fixture; checklist state-transition assertions and production visual evidence remain pending** |
| AF-DOC-006 | Buyer/Seller/Admin | Expanded Help registry | Source-backed Voucher, Chat, Livestream, Wallet, Affiliate and Admin operations journeys have evidence statuses and stable deep links | **Passed local registry tests/build and production public Help/Journey E2E; authenticated role evidence remains partial and explicitly scoped** |
| AF-DOC-007 | Guest/all roles | Help Center visuals | Help Center raw and annotated captures exist at 1440×900 and 390×844 with deployed revision recorded; feature journey visuals remain separate | **Current production raw + annotated public Help Center evidence refreshed for `8157ffa`; accepted feature visuals remain limited to evidence-backed journey steps** |
| AF-DOC-008 | Buyer/Seller/Admin | Ebook completeness | Ebook contains Quick Guide, Level A/B/C visual rules, troubleshooting, FAQ and glossary without upgrading runtime statuses | **Passed static documentation review; runtime visuals and authenticated evidence remain separately gated** |
| AF-DOC-009 | All roles | Visual traceability | Captured assets record source page, capture date, deployment revision, test-data scope, viewport and raw/annotated paths | **Passed static manifest review; pending journeys remain explicitly uncaptured** |
| AF-DOC-010 | Buyer/Guest | B02 product-detail visual evidence | Public product-detail step has matching Desktop/Mobile raw and annotated captures tied to the deployed revision | **Passed production read-only browser capture at `1440×900` and `390×844`; zero page/console errors and no 4xx/5xx responses; full B02 journey remains `PARTIAL`** |
| AF-DOC-011 | Buyer/Guest | B02 public discovery visual evidence | Public home, category, filtered-results, search, Shop-detail and product-detail surfaces have matching raw/annotated Desktop and Mobile captures tied to the deployed revision | **Passed production read-only browser capture after `6b24be3`; catalog regression passed desktop/laptop `10/10` and mobile `5/5`; zero page/console errors and no 4xx/5xx responses; B02 remains `PARTIAL` for sorting, reviews, provenance and authenticated purchase steps** |
| AF-DOC-012 | Buyer/Guest | B09 public livestream visual evidence | Public `/live` discovery shell has matching Desktop/Mobile raw and annotated captures without credentials or PII | **Passed production read-only browser capture after `6b24be3`; zero page/console errors and no 4xx/5xx responses; provider, join, interaction and leave steps remain `PARTIAL`** |
| AF-DOC-013 | Buyer/Guest | B01 authentication-entry visual evidence | Public `/auth` login and buyer-registration entry modes have matching Desktop/Mobile raw and annotated captures tied to the deployed revision | **Passed production read-only browser capture after `6b24be3`; zero page/console errors and no 4xx/5xx responses; credentialed registration, profile, address and authenticated completion remain `PARTIAL`** |
| AF-DOC-014 | Seller/Affiliate | S07 Affiliate program visual evidence | Authenticated program-discovery view has matching Desktop/Mobile raw and annotated captures and platform-specific Journey Center binding | **Passed production capture on `7e7a12a` with zero console errors; deployment run `33044485519` served Desktop/Laptop and Mobile bindings from `622b1e9`; follow-up deployment `33045487946` retained the binding; join, attribution, conversion and payout remain `PARTIAL`** |

Production public documentation follow-up 2026-08-25: elevated-network
Playwright passed 12/12 executed public Help/Journey and QR page checks across
Desktop, Laptop and Mobile, with 3 intentional mobile-only skips. This verifies
public route behavior only; final deployment-matched visuals and authenticated
seller/Admin evidence remain separate gates.

Current-revision follow-up 2026-08-25: after Front-End deploy run
`32805233259` for `3b504ba`, the Help/Journey suite passed 9/9 executed checks
with 3 intentional mobile-only skips, and the QR page suite passed 3/3 across
Desktop, Laptop and Mobile. The test-only revision does not upgrade
authenticated or feature-flow status.

Latest QR image follow-up 2026-08-25: Front-End deploy run `32806940404`
completed successfully for `84a6a15`. The local QR matrix passed 15/15 across
Desktop, Laptop and Mobile; production upload of the deterministic unknown
fixture returned `200` plus server-owned `NOT_FOUND` on all three viewports,
with no page or console errors. The current public Help/Journey plus QR page
regression passed 12/12 executed checks with 3 intentional mobile-only skips.
A known positive production fixture remains pending, so AF-Q-001 stays
`PARTIAL`.

Latest documentation runtime follow-up 2026-08-25: Front-End deploy run
`32807912265` for `a0b74c4` passed the QR Help content smoke 3/3 across
Desktop, Laptop and Mobile. The `enter-code` step documents PNG/JPEG/WebP
uploads under 5 MB and the `result` step documents the unreadable-image
fallback; no page or console errors were observed.

Latest QR visual evidence follow-up 2026-08-25: production unknown-result
captures for deterministic fixture `UAT-QR-IMAGE-20260825` passed at Desktop
`1440×900` and Mobile `390×844` after deploy run `32807912265`. Raw and
separate deterministic annotated assets are registered in the Visual Manifest;
they show the server-owned `NOT_FOUND` state and are UAT evidence only. A
known-positive fixture and final B03 feature visuals remain pending.

These rows cover the documentation UI slice only. They do not change the
status of buyer checkout, QR execution, authenticated seller flows, or Admin
walkthrough rows.

Latest dependency security follow-up 2026-08-25: Front-End `6b24be3` upgraded
React Router to `7.18.2` and Socket.IO parser to `4.2.7`. The local
production-dependency audit now reports 0 vulnerabilities; deploy run
`32819481662` succeeded. Post-deploy
public/permission/responsive regression passed 84/84 executed tests with 21
intentional credential/API skips. The complete no-credential Playwright suite
passed 154 tests with 119 intentional credential-dependent skips and 0
failures; direct authorization passed 15/15.

Final production regression follow-up 2026-08-26: the complete no-credential
`Front-End/e2e` matrix passed 165/165 executed tests with 117 intentional
credential/API skips and 0 failures out of 282 tests across Desktop, Laptop
and Mobile. The expanded count includes the Journey Center visual assertions;
the authenticated, provider-dependent and positive-fixture scopes remain
explicitly skipped or partial as recorded above.

Documentation integrity guard follow-up 2026-08-26: Front-End `833446a` adds
the canonical guide/ebook visual-reference regression. Local documentation
tests passed 18/18, frontend lint/build passed, deployment run `32953905914`
succeeded, and the post-deploy Help regression passed 15/15 executed checks
with three intentional mobile-only skips.

Authenticated route harness follow-up 2026-08-26: the initial elevated
Buyer/Seller read-only run exceeded the backend `auth` rate limit of 10
requests per client per 60 seconds because the route specs logged in once per
route. `AF-TEST-001` records the resulting Seller `/auth` timeout. Front-End
`1fbfeca` fixed role-specific redirect settling and `717550e` reuses one
authenticated session per role and viewport while preserving all route
assertions. Local lint/build passed; deployment verification and production
retest for `717550e` remain pending.

Safe authenticated UAT follow-up 2026-08-26: deployment run `32955596021`
completed successfully for `717550e`. Buyer/Seller read-only route coverage
 passed 6/6 across Desktop/Laptop/Mobile. Affiliate, orders, chat, live-entry
 and permission coverage passed 42/42 across the three viewport projects
 (48/48 combined safe authenticated checks) after rate-limit-safe batching.
 The checks are read-only route/redirect smoke only;
checkout, payment, order transitions, wallet, admin mutations and provider
flows remain pending.

Help-status deployment follow-up 2026-08-26: Front-End `dffe8ed` is present on
`origin/main`, but the exact-SHA Actions query returned zero deployment runs
after the push trigger delay. The prior `717550e` deployment remains the last
verified production revision. `AF-DEP-002` is `BLOCKED_EXTERNAL`; do not claim
the local S02–S06 Help status refinement live until a successful deployment and
post-deploy Help regression are recorded.

Help-status deployment retry follow-up 2026-08-26: retry commit `d3bd7fd`
produced run `32985079060`, which ended `startup_failure` with zero jobs; the
original `dffe8ed` run `32984881891` failed the same way. No deployment script
or build executed, and `717550e` remains the last verified production release.

Public production browser regression follow-up 2026-08-26: with network access
enabled for the runner, the bounded Help/Journey plus guest route suite passed
45/45 executed checks across Desktop, Laptop and Mobile, with 3 intentional
mobile-only skips and 0 test failures. The earlier restricted-network attempt
failed at navigation with `ERR_NETWORK_ACCESS_DENIED`; it is recorded as an
environment observation and does not change application status. The run
reconfirms public behavior for the last verified production release only.

Help-status deployment resolution follow-up 2026-08-26: run `32987804285` for
Front-End `d3bd7fd` completed successfully and the run head matches
`origin/main`. The deployed source includes the `dffe8ed` S02–S06 refinement;
post-deploy Help/Journey regression passed 15/15 executed checks with 3
intentional mobile-only skips, and direct production inspection confirmed all
five refined seller cards render `Đang hoàn thiện thêm bước`. This verifies the
metadata deployment only; S02–S06 journey status remains `PARTIAL`.

Post-deploy full production regression follow-up 2026-08-26: the complete
no-credential Playwright matrix passed 165/165 executed tests across Desktop,
Laptop and Mobile, with 60 intentional credential/API skips and 0 failures.
Public catalog, auth-negative, authorization, responsive, QR, live, PWA and
Help/Journey checks remained green after `d3bd7fd`; authenticated, mutation and
provider-dependent rows remain open.

Post-deploy safe authenticated UAT follow-up 2026-08-26: Buyer/Seller
read-only routes passed 6/6 across Desktop/Laptop/Mobile; affiliate, chat,
orders and seller-live checks passed 9/9; and permission checks passed 24/24
after the isolated Laptop auth-limiter retry passed. Combined safe
authenticated coverage is 48/48 with no mutation or observed 5xx response.
Checkout/payment/order transitions, wallet, provider and Admin rows remain
open.

Cart/checkout read-only follow-up 2026-08-27: Buyer cart loading and empty
checkout checks passed 6/6 across Desktop/Laptop/Mobile with no observed 5xx
responses. The reversible quantity-update assertion was skipped 3/3 because
the seeded cart had no usable item/quantity badge fixture; no cart mutation,
order creation or payment was performed.

Admin read-only follow-up 2026-08-27: the focused Admin route inventory passed
3/3 across Desktop/Laptop/Mobile for `/admin`, users, shop registrations,
product registrations, vouchers, categories, wallet, chat and withdrawal
requests against production revision `d3bd7fd`, with no observed 5xx response
or mutation. This supports PARTIAL status for A01, A02, A04, A05, A08 and A09;
A03, A06, A07 and A10 and all Admin mutations remain open.

Admin status deployment follow-up 2026-08-27: deployment run `33029197905`
completed successfully for Front-End `bb0eee1`. Post-deploy Help/Journey
regression passed 15/15 executed checks with 3 intentional mobile-only skips;
the live Help registry shows PARTIAL for A01, A02, A04, A05, A08 and A09 and
UNVERIFIED for A03, A06, A07 and A10. The post-deploy Admin route inventory
passed 3/3 across Desktop/Laptop/Mobile. Raw Admin dashboard captures at
1440×900 and 390×844 are PII-safe UAT evidence; annotated final visuals remain
pending.

Final deployment verification 2026-08-27: follow-up run `33029734247` completed
successfully for Front-End `e1c3aff`. The final combined read-only production
regression passed 18/18 executed checks across Desktop/Laptop/Mobile with 3
intentional mobile-only skips: Admin route inventory passed 3/3 and
Help/Journey passed 15/15. Frontend returned HTTP 200 and canonical API health
returned `ok` from `api-gateway`; no mutation or provider action was performed.

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

Admin visual evidence follow-up 2026-08-27: the production `9637e9f` capture
passed 2/2 viewport projects (Desktop and Mobile) for the read-only
product-registration and platform-voucher screens. Users and Shop-registration
captures were discarded after PII inspection. Raw and annotated A05/A09 assets
are now registered; Admin decisions and mutations remain untested.

Final A05/A09 visual deployment verification 2026-08-27: run `33032228853`
completed successfully for Front-End `7e7a12a`. Post-deploy Help/Journey
checks passed 18/18 executed across Desktop/Laptop/Mobile with 3 intentional
mobile-only skips, and all four new visual URLs returned HTTP 200. No Admin
mutation or provider action was performed.

Final Admin Help status regression follow-up 2026-08-27: deployment run
`33050185145` completed successfully for Front-End `4a93130`. The complete
no-credential Help/Journey production regression passed 27/27 executed checks
across Desktop/Laptop/Mobile with 3 intentional mobile-only skips. The
A03/A06/A07/A10 cards now display `NOT_IMPLEMENTED`, matching the absent
frontend routes confirmed by AF-AD-003; no Admin mutation or provider action
was performed.

Full no-credential production regression follow-up 2026-08-27: against the
deployed Front-End `4a93130`, the existing Playwright matrix scheduled 240
tests and completed with 192 passed, 48 intentional credential/local-gate
skips and 0 failures. Public, responsive, negative-auth, QR, quote-only
checkout, permission, authorization, PWA and Help/Journey coverage remained
green; no authenticated mutation or provider action was performed.

Final combined read-only regression 2026-08-27: production Front-End `7e7a12a`
passed 21/21 executed Admin and Help/Journey checks across Desktop/Laptop/Mobile
with 3 intentional mobile-only skips. The nine Admin routes and A01/A05/A09
visual bindings remained green; no mutation or provider action was performed.

Contextual-help deployment follow-up 2026-08-27: deployment run
`33045487946` completed successfully for Front-End `04c62ab`. The global
footer verification link now deep-links to `/help/qr/verify-product`; the
focused production check passed on Desktop, Laptop and Mobile. The broader
Help/Journey suite passed 24/24 executed checks with 3 intentional mobile-only
skips. No mutation or provider action was performed.

Unavailable-journey safety follow-up 2026-08-27: deployment run `33051349776`
completed successfully for Front-End `ed20fa5`. The Help/Journey production
regression passed 30/30 executed checks across Desktop, Laptop and Mobile with
3 intentional mobile-only skips, including a direct A03 deep-link assertion
that the `NOT_IMPLEMENTED` state does not expose actionable step instructions.
No authenticated data, mutation or provider action was performed.

Unavailable-journey CTA follow-up 2026-08-27: deployment run `33052403625`
completed successfully for Front-End `fd937ab`. The Help/Journey production
regression passed 30/30 executed checks across Desktop, Laptop and Mobile with
3 intentional mobile-only skips. `NOT_IMPLEMENTED` Admin cards now use a
status-oriented CTA, and their deep links continue to withhold actionable
instructions. No authenticated data, mutation or provider action was performed.

Post-change full no-credential production regression 2026-08-27: against the
deployed Front-End `ed20fa5`, the existing Playwright matrix scheduled 243
tests and completed with 195 passed, 48 intentional credential/local-gate
skips and 0 failures. Public, responsive, negative-auth, QR, quote-only
checkout, authorization, PWA and Help/Journey coverage remained green; no
authenticated mutation, payment, order transition, withdrawal or provider
action was performed.

Current-revision backend non-mutating quality audit 2026-08-27: Back-End
`3b59ab9` passed `npm run test:ci` (7 suites / 25 tests),
`npm run build:deploy`, and `npx.cmd prisma validate --schema
prisma/schema.prisma`. A separate check-only ESLint run
(`npx.cmd eslint apps libs test --ext .ts`) reported 8,390 problems (8,328
errors, 62 warnings); no auto-fix was run. Record this as open `AF-TECH-002`,
and do not claim the backend lint gate is green.

Current deployed revision regression 2026-08-27: against Front-End `fd937ab`
(deployment run `33052403625`), the complete no-credential Playwright matrix
scheduled 243 tests and completed with 193 passed, 50 intentional skips and 0
failures. Skip records matched the declared credential, local-only quote-mock,
mobile-project and runtime fixture gates. Public, responsive, negative-auth,
QR, quote-only Buy Now, authorization, PWA and Help/Journey coverage remained
green. No authenticated mutation, payment, order transition, withdrawal or
provider action was performed.

Documentation link regression 2026-08-27: every local Markdown and image link
in `docs/user-guide/*.md` resolved successfully; external links and runtime
Help routes remain covered by the existing Help/Journey checks.

QR history navigation follow-up 2026-08-27: Front-End commit `3c512a8`
replaced the dead Buyer profile sidebar target `/profile/verify-history` with
the supported public `/qr` verification route. The production browser
regression `e2e/profile-navigation.spec.ts` passed 3/3 projects (Desktop,
Laptop and Mobile) after the push using a synthetic local session and mocked
API responses; no mutation was performed. This resolves navigation only; the
QR verification-history feature and any history API remain unimplemented and
are not claimed by B01 documentation.

Help accessibility and viewport follow-up 2026-08-27: Front-End commit
`8157ffa` corrected Help step/placeholder and Mobile bottom-navigation contrast.
Deployment run `33071400901` completed successfully; a fresh isolated
production context served the new bundle, Lighthouse accessibility passed
100/100 on Desktop and Mobile, Mobile `390x844` had no horizontal overflow,
and the Journey Center switched from its Mobile default to Desktop via the
manual selector without navigation or console errors. No authenticated data or
mutation was used.

Current-revision profile regression 2026-08-27: `e2e/profile-navigation.spec.ts`
passed 3/3 against production Front-End `8157ffa` across Desktop, Laptop and
Mobile using a synthetic local session and mocked API responses. The Buyer
profile entry targets supported public `/qr` navigation; no mutation ran.

Help Center visual refresh 2026-08-27: the public `/help` shell was captured
again from the deployed Front-End `8157ffa` at Desktop `1440×900` and Mobile
`390×844`. Raw files and separately annotated copies are registered in
`docs/user-guide/VISUAL_MANIFEST.md`; the raw files were not overwritten by
annotation. The captures contain public content only and no credentials or
PII. This refresh follows the contrast fix and does not sign off any feature
journey.

Current-revision Help/Journey regression 2026-08-27: `e2e/help-journey.spec.ts`
passed 30/30 executed checks against production Front-End `8157ffa` across
Desktop, Laptop and Mobile, with 3 intentional mobile-only skips. Search,
role filtering, platform-specific visuals, unavailable Admin journeys,
deep-linking and public contextual-help links remained green. No authenticated
data, mutation or provider action was performed.

Current-revision responsive regression 2026-08-27: `e2e/responsive.spec.ts`
passed 21/21 across Desktop, Laptop and Mobile for `/`, `/community`, `/live`,
`/categories`, `/qr`, `/auth` and `/help`. Every route stayed within the
viewport without horizontal overflow. No authenticated data, mutation or
provider action was performed.

Current-revision guest/permission regression 2026-08-27: `e2e/guest.spec.ts`
and `e2e/permissions.spec.ts` passed 51/51 executed checks across Desktop,
Laptop and Mobile, with 3 intentional credential-gated skips. Public routes
loaded without blank pages or server errors, and protected Admin, checkout,
wishlist, message and payment routes redirected guests to authentication. No
mutation or provider action was performed.

Current-revision QR smoke 2026-08-27: `e2e/qr.spec.ts` passed 3/3 across
Desktop, Laptop and Mobile. The QR page returned no server errors and the
rendered body did not expose access or refresh tokens. No verification mutation
or provider action was performed.

Current-revision Buyer catalog regression 2026-08-27: `e2e/catalog.spec.ts`
passed 15/15 across Desktop, Laptop and Mobile. Public product and Shop links,
the branded Shop banner fallback, category-to-search filtering, and search
results/empty-state behavior remained green. No authenticated data, mutation
or provider action was performed; B02 remains `PARTIAL` for sorting, reviews,
provenance and authenticated purchase steps.

Current-revision local quality gate 2026-08-27: Front-End `8157ffa` passed
`npm run lint`, `npm run build` (`tsc -b` plus Vite production build), and the
local test suite across 16 files passed 75/75, including the documentation
verifier (`test/help-content.test.mjs`) at 19/19. The build emitted only the
existing large-chunk advisory; no new failure or warning affecting acceptance
was observed.
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
## Skip reconciliation snapshot - 2026-08-27 (superseded)

Use [`docs/UAT_SKIP_RECONCILIATION.md`](UAT_SKIP_RECONCILIATION.md) as the
canonical current-scope addendum. It maps all 48 retained records to exact
source gates: 39 auth-fixture blocks, 6 unsafe hosted/local-only checkout
records, 2 mobile-only non-applicable executions and 1 unmapped report-only
audit record. It also separates read-only authenticated scope from named
mutation tiers and provider configuration.

Current denominator: `246 discovered`; `237 applicable source executions`;
`198 passed`; `0 failed`; `39 blocked external`; `2 not applicable`; `6 unsafe`;
`0 not implemented in automated records`; and `1 other external audit
discrepancy`. A03/A06/A07/A10 remain product `NOT_IMPLEMENTED` and current UAT
`NOT_APPLICABLE`, outside the automated denominator.

## Current skip reconciliation closeout — 2026-08-28

The 36 authenticated read-only executions and the 3 cart-badge executions are
now complete: **39/39 passed** across Desktop `1440x900`, Laptop `1280x720` and
Mobile `390x844`. The cart check used the existing seeded demo Buyer cart,
asserted `7 -> 8 -> 7`, and verified the post-cleanup state returned to the
baseline. It did not create an order or touch payment, wallet, provider or
Admin state.

The recovered retained Playwright artifact was an all-skipped, zero-result
harness report associated with a missing Chromium executable. Since the source
test list independently contains 246 tests in 23 files, the report-only delta
is classified `NOT_APPLICABLE` as stale/duplicate audit evidence.

```text
TOTAL_DISCOVERED=246
TOTAL_APPLICABLE=237
PASSED=237
FAILED=0
BLOCKED_EXTERNAL=0
BLOCKED_MUTATION_APPROVAL=0
NOT_APPLICABLE=3
NOT_IMPLEMENTED=0 in automated denominator
UNSAFE=6
OTHER_EXTERNAL_BLOCKER=0
```
