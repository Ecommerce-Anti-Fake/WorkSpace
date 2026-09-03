# AntiFake UAT skip reconciliation

Revision scope: Front-End `8157ffa` (`33071400901`), production
`https://antifake.io.vn`. This artifact reconciles the retained 246-test
report without repeating valid public evidence. The only production mutation
recorded in this update is the reversible seeded-demo cart-badge check below;
no payment, wallet, order, provider or destructive Admin action was performed.

## Current seed/demo re-audit — 2026-08-28

This section is the current disposition and supersedes the pre-audit auth
classifications retained below for provenance. Source was checked in
`prisma/seed.ts`, `prisma/seeds/**`, `prisma/schema.prisma`, and the auth
status/verification guards. Production validation used normal UI email and
phone login only; no password or token is recorded here.

| Logical fixture | Login identifier | Source account/KYC state | Shop relationship/state | AffiliateAccount | Production result | Safe UAT unlocks |
|---|---|---|---|---|---|---|
| `ACTIVE_ADMIN_UAT` | `ADMIN_UAT` | `role=admin`; source seed `suspended`; email/phone verified; no KYC | none | `ACTIVE` under the seeded active program | Email and phone login succeeded; `/admin` and affiliate member read-only views loaded | Admin read-only routes and Affiliate dashboard |
| `ACTIVE_BUYER_UAT` | `BUYER_UAT` | active user; email/phone verified; KYC `verified`, level 2 | owns 1 pending-verification shop and 2 verified shops | none | Email and phone login succeeded; buyer routes and cart badge `7` observed | Buyer route/cart/checkout-read/order/chat/permission views; seller read-only where needed |
| `ACTIVE_SELLER_UAT` | `SELLER_UAT` | active user; email/phone verified; KYC `verified`, level 2 | owns 3 verified shops | none | Email and phone login succeeded; Seller Center selected a verified shop | Seller route/live-entry/product/order/wallet-read views |
| Demo user 03 | `DEMO_USER_03_UAT` | active user; email/phone unverified; KYC `verified`, level 2 | none | none | Email login returned HTTP 403; source guard is `EMAIL_NOT_VERIFIED` | none in current production |
| Demo user 04 | `DEMO_USER_04_UAT` | active user; email/phone unverified; KYC `verified`, level 2 | none | none | Email login returned HTTP 403; source verification guard blocks login | none in current production |
| Demo user 05 | `DEMO_USER_05_UAT` | active user; email/phone unverified; no KYC | none | `PENDING` | Email login returned HTTP 403; source verification guard blocks login | none in current production |
| Demo user 06 | `DEMO_USER_06_UAT` | active user; email/phone unverified; no KYC | none | `ACTIVE` | Email login returned HTTP 403; source verification guard blocks login | none in current production |
| Demo user 07 | `DEMO_USER_07_UAT` | active user; email/phone unverified; no KYC | none | `ACTIVE` | Email login returned HTTP 403; source verification guard blocks login | none in current production |

The source Admin `suspended` value does not match the current production
effective state: the existing production account authenticated successfully
with both identifiers and reached `/admin`. No role or account-state change
was made. The two verified shop owners are separate from the affiliate
relationship; use `ACTIVE_AFFILIATE_UAT=admin`, not a fictitious combined
seller/affiliate fixture.

### Current disposition of all 48 retained skipped records

`x3` means Desktop, Laptop and Mobile executions. `x2` means Desktop and
Laptop executions. `RUNNABLE_NOW` is the explicit post-audit execution state
requested for a formerly skipped record; the eight blocker classifications
below apply to records that remain unresolved.

| Test/Journey | Role | Current reason | Required fixture/config | Safe mutation? | Final classification |
|---|---|---|---|---|---|
| Admin seed route, route inventory, and admin login (9 total) | Admin | Existing production Admin authenticated; read-only route checks completed | `ACTIVE_ADMIN_UAT=ADMIN_UAT`; no new account | Yes — read-only | `RUNNABLE_NOW` — 9/9 passed |
| Affiliate dashboard (x3) | Affiliate | Existing production Admin has source `AffiliateAccount=ACTIVE`; dashboard loaded | `ACTIVE_AFFILIATE_UAT=ADMIN_UAT`; active program data already present | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Buyer authenticated route bundle (x3) | Buyer | BUYER_UAT is active and verified; routes completed | `ACTIVE_BUYER_UAT=BUYER_UAT` | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Buyer cart load (x3) | Buyer | user01 cart exists; route completed without changing data | Same buyer fixture; existing cart data sufficient | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Cart badge quantity update (x3) | Buyer | Existing seeded demo cart and valid item are available; quantity was incremented and restored | `ACTIVE_BUYER_UAT`; existing seeded cart; pre-state captured and restored | Yes — reversible `SAFE_UAT_MUTATION` on the seeded demo cart; no order/payment | `RUNNABLE_NOW` — 3/3 passed |
| Empty checkout route (x3) | Buyer | Authenticated route loaded without order/payment mutation | Same buyer fixture; no payment provider needed | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Buyer chat entry points (x3) | Buyer | Authenticated entry-point routes completed; full realtime behavior is separate | Same buyer fixture; existing thread optional for entry smoke | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Seller live entry point (x3) | Seller | SELLER_UAT owns verified Shops; entry route completed without starting a session | `ACTIVE_SELLER_UAT=SELLER_UAT`; no Agora action for entry smoke | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Buyer order list/detail (x3) | Buyer | user01 authenticated; owned order read-only route completed | Same buyer fixture; seeded order data available | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Non-admin permission boundary (x3) | Buyer/non-admin | user01 is active non-admin; `/admin` boundary completed | Same buyer fixture; must remain non-admin | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Seller authenticated route bundle (x3) | Seller | user02 authenticated; Seller Center read-only bundle completed | Same seller fixture; verified Shop data already present | Yes — read-only | `RUNNABLE_NOW` — 3/3 passed |
| Hosted executions of local mocked checkout quote tests (6 total) | Buyer | Source intentionally skips hosted targets; tests require local storage/history and mocked fetch | Local test target only; no production fixture | No real mutation | `UNSAFE_PRODUCTION_TEST` |
| Mobile-guide test in Desktop/Laptop projects (x2) | Guest/all | Source condition is mobile-only at width `390` | Mobile-only applicability; no account/config | N/A | `NOT_APPLICABLE` |
| Retained matrix delta (x1) | Maintainer | Recovered report is a stale all-skipped harness artifact with no test results; current source lists 246 tests | No fixture; compare embedded report with `playwright test --list` | N/A | `NOT_APPLICABLE` — audit-only record |

The 39 formerly auth-blocked executions were run across all three viewports and
passed 39/39: 36 read-only executions plus the 3 cart-badge executions.
`/profile/settings` resolving to `/install` is intentional and source-tested.
The cart check used only the seeded demo cart, restored its original state, and
performed no payment, provider action, order creation, or Admin destructive
action.

### Former-skip terminal classification

The eight requested blocker labels describe why a case is blocked before
execution. Once a formerly skipped case executes, its terminal state is
`PASSED`, rather than retaining a blocker label. The 48 retained records now
map exactly as follows:

| Former skipped records | Terminal result | Final blocker classification where applicable |
|---|---|---|
| 39 role-authenticated executions | `PASSED` (`39/39`) | Original `BLOCKED_AUTH_FIXTURE` cleared by validated seed/demo accounts |
| 6 hosted local-only checkout quote executions | Not executed in production | `UNSAFE_PRODUCTION_TEST` |
| 2 Desktop/Laptop mobile-only Help executions | Not applicable by source viewport guard | `NOT_APPLICABLE` |
| 1 retained report-only delta | No stable product test/result | `NOT_APPLICABLE` stale/duplicate audit artifact |

No retained record remains in `BLOCKED_AUTH_FIXTURE`,
`BLOCKED_MUTATION_APPROVAL`, `BLOCKED_PAYMENT_SANDBOX`,
`BLOCKED_PROVIDER_CONFIG`, `OTHER_EXTERNAL_BLOCKER` or `NOT_IMPLEMENTED`.

### Cart badge UAT evidence — 2026-08-28

Fixture: `ACTIVE_BUYER_UAT` (`BUYER_UAT`) on production
Front-End revision `8157ffa`. The initial cart had four seeded lines, total
quantity `7`, and the second line quantity `2`. The authorized reversible check
incremented that line to `3`, asserted the header badge changed `7 -> 8`, then
decremented it to `2` and asserted `8 -> 7`.

The same pre-state, mutation and restoration were verified at Desktop
`1440x900`, Laptop `1280x720` and Mobile `390x844`. Six cart PATCH/GET requests
returned HTTP `200`; no console errors or 5xx responses were observed. The
post-cleanup cart returned to four lines, second-line quantity `2`, and badge
`7`, matching the intended baseline. This is `SAFE_UAT_MUTATION` evidence only;
it is not order, payment or fulfillment evidence. Sanitized raw/annotated
Desktop/Mobile assets from the restored capture were accepted and registered
under `docs/images/buyer/` for the cart quantity/badge step.

### Retained report discrepancy resolution — 2026-08-28

The retained `Front-End/playwright-report/index.html` was recovered and its
embedded `report.json` inspected. It contains 246 entries all marked skipped,
zero test results, zero expected/unexpected/flaky outcomes, and a short
276.646 ms harness run. The associated `error-context.md` records a missing
Playwright Chromium executable. `npx.cmd playwright test --list` independently
lists 246 source tests in 23 files.

This record is not a second product execution and cannot support a pass/fail
claim. It is closed as `NOT_APPLICABLE` audit evidence (stale/duplicate
reporter artifact), reducing `OTHER_EXTERNAL_BLOCKER` to zero without changing
the executable denominator.

## 1. Retained skipped records — historical pre-audit snapshot

The table in this section preserves the original 2026-08-27 skip evidence.
Its auth classifications are superseded by the current seed/demo re-audit
above; it is retained only to show why the 48 records were originally skipped.

The retained report says 48 skips. Current Playwright source, evaluated against
the retained run's documented conditions (API env present, catalog flag true,
role credentials absent), maps 47 actual skipped executions. The current shell
does not contain those UAT variables. The remaining record has no stable test
title in the retained output and is tracked as an audit discrepancy, not
invented as a new test.

`x3` means one execution in each Desktop, Laptop and Mobile project. `x2`
means the Desktop and Laptop executions; the Mobile execution is applicable.

| Test/Journey | Role | Current reason | Required fixture/config | Safe mutation? | Final classification |
|---|---|---|---|---|---|
| `admin.spec.ts`: admin seed reaches the admin route when the account is active (x3) | Admin | `UAT_ADMIN_EMAIL` or `UAT_TEST_PASSWORD` absent; source seed admin is also `accountStatus=suspended` | `ACTIVE_ADMIN_UAT`: active admin, verified email/phone, credential delivered only through secure env | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `admin.spec.ts`: admin read-only route inventory renders without server errors (x3) | Admin | Same auth gate; inventory cannot start without an active admin session | `ACTIVE_ADMIN_UAT` plus sanitized admin queue/read data | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `auth.spec.ts`: seed admin can sign in and reach the admin console (x3) | Admin | Same missing env gate; the seeded admin is suspended in source | Active admin fixture; do not bypass the account-status guard | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `affiliate.spec.ts`: affiliate dashboard loads for the configured seed user (x3) | Affiliate | `UAT_AFFILIATE_EMAIL` and password absent; helper falls back to `UAT_USER_EMAIL`, which is also absent; Affiliate is a relationship, not a role | Active user with `AffiliateAccount.status=ACTIVE` under an active program | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `buyer.spec.ts`: buyer authenticated read-only routes load (x3) | Buyer | `UAT_USER_EMAIL` and password absent | `ACTIVE_BUYER_UAT`: active user, verified email/phone, read-only-owned data | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `cart-checkout.spec.ts`: buyer cart loads without creating data (x3) | Buyer | Buyer auth gate fires before the route check | `ACTIVE_BUYER_UAT`; empty cart is sufficient for this case | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `cart-checkout.spec.ts`: header cart badge follows quantity updates (x3) | Buyer | Buyer auth gate currently fires. After auth, the source can skip for no cart item, no badge, or a `99+` badge | `BUYER_CHECKOUT_SET` with one active in-stock cart item and exact badge quantity below 99 | No in current production; controlled/reversible in UAT | `BLOCKED_AUTH_FIXTURE` |
| `cart-checkout.spec.ts`: empty checkout route does not expose a server error (x3) | Buyer | Buyer auth gate fires before checkout route check | `ACTIVE_BUYER_UAT`; no order or payment fixture required | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `chat.spec.ts`: buyer chat entry points load without mutating a thread (x3) | Buyer | `UAT_USER_EMAIL` and password absent | `ACTIVE_BUYER_UAT`; existing PII-safe thread is optional for entry-point smoke | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `checkout-quote.spec.ts`: checkout fails closed when the server quote is rejected (x3) | Buyer | Hosted HTTP target is deliberately skipped; test injects local storage, history state and mocked fetch | Local test target only; no production fixture | No real mutation | `UNSAFE_PRODUCTION_TEST` |
| `checkout-quote.spec.ts`: checkout enables order submission only after a successful quote (x3) | Buyer | Same explicit hosted-target skip; this is a local mocked checkout regression | Local test target only; no production fixture | No real mutation | `UNSAFE_PRODUCTION_TEST` |
| `help-journey.spec.ts`: uses the mobile guide when viewport is mobile; Desktop/Laptop executions (x2) | Guest/all | Source gate is `viewportSize.width !== 390` | Mobile-only applicability; no fixture | N/A | `NOT_APPLICABLE` |
| `live.spec.ts`: seller live entry point loads without starting a session (x3) | Seller | `UAT_SELLER_EMAIL` and password absent | `ACTIVE_SELLER_AFFILIATE_UAT` with verified Shop | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `orders.spec.ts`: buyer order list and any visible order detail use owned routes (x3) | Buyer | `UAT_USER_EMAIL` and password absent | `ACTIVE_BUYER_UAT`; buyer-owned order detail is optional but useful | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `permissions.spec.ts`: authenticated non-admin is redirected away from admin (x3) | Buyer/non-admin | `UAT_USER_EMAIL` and password absent | Active non-admin buyer account; must not be an Admin or suspended user | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| `seller.spec.ts`: seller authenticated read-only routes load (x3) | Seller | `UAT_SELLER_EMAIL` and password absent | Active seller owning a verified Shop and read-only seller data | Yes; read-only | `BLOCKED_AUTH_FIXTURE` |
| Retained matrix delta (x1; no stable title/source gate) | Maintainer | Retained total is 48 while current source maps 47; raw Playwright JSON was not retained | Recover raw reporter output or generate a skip-only report when the browser runtime is available; no account fixture | N/A | `OTHER_EXTERNAL_BLOCKER` |

### Count reconciliation

| Source-derived group | Executions |
|---|---:|
| Role-authenticated source skips | 39 |
| Hosted skips for local mocked checkout | 6 |
| Desktop/Laptop skips for mobile-only guide | 2 |
| Current source-confirmed skips | **47** |
| Retained report-only unmapped record | 1 |
| Retained report total | **48** |

The historical table predates production seed-account validation. The current
classification is the re-audit matrix above: all 39 role-authenticated
records are `RUNNABLE_NOW` and passed, while the remaining records are
`UNSAFE_PRODUCTION_TEST` or `NOT_APPLICABLE`.

## 2. Minimum UAT fixture request

Credentials must be supplied through the approved secure mechanism or runtime
environment. No passwords, tokens, private keys, personal documents, or
production identifiers belong in this repository.

### Authentication fixtures

No new account or credential request is required for the 36 read-only
executions. Use the existing identities through the approved secure runtime
mechanism; passwords and tokens remain outside documentation.

`ACTIVE_BUYER_UAT`

- account: `BUYER_UAT`, active user, email/phone verified;
- KYC: source seed `verified`, level 2;
- Shop: owns two verified shops and one pending-verification shop;
- AffiliateAccount: none;
- existing data: buyer cart, address, orders, notifications and chat entry data;
- unlocks: buyer route/cart/checkout-read/order/chat/permission views.

`ACTIVE_SELLER_UAT`

- account: `SELLER_UAT`, active user, email/phone verified;
- KYC: source seed `verified`, level 2;
- Shop: owns three verified shops;
- AffiliateAccount: none;
- existing data: approved catalog, seller orders, wallet read data and live-entry
  data;
- unlocks: seller route bundle and seller live entry.

`ACTIVE_AFFILIATE_UAT`

- account: `ADMIN_UAT`, production login succeeds;
- KYC: source seed has none;
- Shop: none;
- AffiliateAccount: source seed `ACTIVE` under the active Vinamilk program;
- existing data: member/program, conversion and commission read data;
- unlocks: Affiliate dashboard read-only. This is a relationship fixture, not a
  separate user role or the seller fixture.

`ACTIVE_ADMIN_UAT`

- account: `ADMIN_UAT`, production effective state active, role admin;
- KYC: source seed has none;
- Shop: none;
- AffiliateAccount: `ACTIVE` as listed above;
- existing data: sanitized Admin dashboard and queue/read data;
- unlocks: Admin login, route inventory and read-only Admin routes.

Users 03–07 are source-present but cannot unlock current production UAT:
03/04 are active with verified KYC but unverified identifiers and no Shop or
AffiliateAccount; 05 is active with unverified identifiers, no KYC/Shop and a
pending AffiliateAccount; 06/07 are active with unverified identifiers, no
KYC/Shop and active AffiliateAccounts. Their production email login returned
HTTP 403 under the source-defined verification guard.

### Business data fixtures

| Logical fixture | Required state | Journeys/tests unlocked |
|---|---|---|
| `PURCHASE_CATALOG_SET` | Verified active Shop; public active Offer; approved moderation state; active Variant; stock greater than zero; valid dimensions and warehouse | B02, B04, S02-S04, S09 |
| `BUYER_CHECKOUT_SET` | Default address with valid province/district/ward; one active cart item; optional matching voucher | Cart badge, B04, checkout/order flows |
| `ORDER_STATE_SET` | Buyer- and seller-owned isolated orders in required pending, processing, shipping, delivered and cancelled states | B05, S05, A01/A02/A04/A05/A08 read-only queues |
| `VOUCHER_SET` | Active shop/platform vouchers with matching offer/order, usable limits and non-expired dates | B06, S06, A09, S09 |
| `AFFILIATE_SET` | Active program, active member/code, separate eligible buyer, pending/approved conversion and read-only payout ledger | S07, affiliate attribution/conversion |
| `CHAT_THREAD_SET` | PII-safe buyer/seller history, two sessions, distinct client message IDs | B07, chat realtime |
| `LIVE_AGORA_SET` | Seller-owned scheduled and active/live sessions linked to eligible approved offer/voucher; provider channel persisted | B09, S09, live UAT |
| `NOTIFICATION_READ_SET` | Existing in-app unread/read notification | Buyer/Admin notification read-only |
| `KYC_DOC_SET` | Synthetic non-identity documents and pending/verified/rejected state | KYC upload/review if applicable; not needed for absent A03 UI |
| `ADMIN_QUEUE_SET` | Pending/approved shop/product/withdrawal records with sanitized display data | A02, A04, A05, A08, A09 read-only and controlled UAT decisions |
| `COMMUNITY_SAFE_SET` | PII-safe public author/content or synthetic author fixture | B08 |
| `QR_POSITIVE_LABEL_UAT` | Active `VerificationLabel`, active batch, approved Offer link, server-owned positive result; code/image delivered privately | B03 positive QR evidence |

## 3. Provider and external configuration

These are independent of account fixtures and must not be summarized as
“credentials”. Secrets stay in the approved secret manager or environment.

| Provider/config | Minimum requirement | Unlocks |
|---|---|---|
| PayOS sandbox | Sandbox client/API/checksum values, sandbox base URL, callback/return URL, and provider test account/link | Payment create, return, webhook/reconcile and retry evidence; no real payment/refund |
| GHN test/sandbox | Test token, shop ID, base URL and compatible shipping/address fixture | Checkout quote, booking and tracking-sync paths |
| Agora | Backend App ID/certificate, token TTL, console co-host configuration, and `LIVE_AGORA_SET`; certificate never goes to browser/docs | Host/start/join/publish/leave and buyer live interaction |
| WebSocket/realtime | API origin/CORS allowlist, Socket.IO `/api/socket.io`, JWT access; Redis URL/config when multi-instance fan-out is required | Two-session chat, reconnect, presence/typing and REST recovery |
| Notification/FCM | Firebase Admin backend values, frontend VAPID value, browser permission and registered FCM token | Push opt-in/delivery evidence; in-app notification read does not need FCM |
| Upload/storage | Cloudinary backend cloud name/key/secret and synthetic media fixtures; HTTPS delivery | KYC, shop/product/chat media upload |
| Firebase Auth bridge | Backend Admin values and frontend Firebase settings | Registration, phone OTP, Google bridge and step-up flows |
| VietQR | Only if bank-account lookup is in scope: lookup enabled plus provider values | Payout-account verification |
| Payout encryption | `PAYOUT_ACCOUNT_ENCRYPTION_KEY` in UAT secret storage | Withdrawal/payout-account UAT |

The QR positive fixture is business data, not a provider configuration.

### Provider-dependent journey boundaries

The following rows prevent a provider dependency from obscuring a separately
verified read-only or public portion. `Screenshot currently possible` refers to
an accepted persistent raw/annotated documentation asset, not an inline browser
preview.

| Journey | Verified portion | Missing portion | Provider | Required sandbox/config | Mutation required | Production-safe | Screenshot currently possible |
|---|---|---|---|---|---|---|---|
| B01 Account and first use | Public login/registration entry and protected-route boundary | Positive registration completion, phone OTP/Google bridge and profile/address mutations | Firebase Auth bridge | Backend Admin values, frontend Firebase settings and disposable UAT account | `CONTROLLED_UAT_MUTATION` plus provider auth mutation | No on current production; use disposable UAT only | Auth entry Desktop/Mobile assets exist; no final positive-registration asset |
| B04 Complete purchase | Cart read-only route, restored cart badge, and Buy Now GHN quote/read-only path | Cart quote, order creation, PayOS payment/return/webhook reconciliation and final feature flow | GHN + PayOS | GHN test token/shop/base URL; PayOS sandbox client/checksum/base URL and callback/return URLs | Controlled order/cart mutation; PayOS actions are `PROVIDER_MUTATION` | No real order/payment/refund in current production | Cart badge raw/annotated Desktop/Mobile assets are accepted and locally bound; cart quote/order/payment and full-purchase visual remain pending |
| B07 Chat with Shop | Authenticated chat entry points | Two-session send/receive, history persistence, reconnect, presence and typing | Socket.IO/WebSocket + Redis when multi-instance fan-out is required | API origin/CORS allowlist, `/api/socket.io`, JWT access and Redis URL/config | `CONTROLLED_UAT_MUTATION` for isolated messages/threads | No current-production two-session mutation | Entry shell only; no final realtime screenshot |
| B09 Livestream | Public livestream discovery shell | Authenticated viewer join, media, comments/reactions/reminder and leave | Agora | App ID/certificate, token TTL, console channel configuration and live fixture | `PROVIDER_MUTATION` | No live provider mutation on current production | Public discovery Desktop/Mobile assets exist; no authenticated live asset |
| S01 Shop registration | Source-backed registration route and seller onboarding structure | Authenticated submit, KYC state transition and media upload | Firebase Auth bridge + Cloudinary storage | Firebase settings/Admin values; Cloudinary UAT keys and synthetic media | Controlled shop mutation; upload/KYC are `PROVIDER_MUTATION` | No on current production; synthetic UAT target only | No final seller-registration asset |
| S03 Create product | Authenticated seller product list/detail read-only scope | Create, media upload, variant/stock submission, moderation and publish | Cloudinary storage | Cloudinary UAT storage/delivery plus synthetic media and approved seller fixture | Controlled DB mutation; media is `PROVIDER_MUTATION` | No on current production without isolated seller fixture/cleanup | No final product-create asset |
| S08 Wallet and revenue | Read-only wallet/ledger and masked payout-account view | Withdrawal request, payout-account verification and payout completion | VietQR/selected payout provider + payout encryption | VietQR sandbox if lookup is in scope and `PAYOUT_ACCOUNT_ENCRYPTION_KEY` in UAT secret storage | `PROVIDER_MUTATION`; production withdrawal is prohibited | No; `PROHIBITED_PRODUCTION_MUTATION` | Read-only runtime exists, but no approved final seller capture asset |
| S09 Livestream selling | Authenticated seller live-entry route | Create/start/pin/end session and viewer/provider interaction | Agora | App ID/certificate, token TTL, channel configuration and seller live fixture | `PROVIDER_MUTATION` | No current-production live mutation | Seller entry only; no final live-session asset |
| A08 Wallet/financial operations | Admin wallet and withdrawal-request read-only routes | Approve/complete withdrawal and payout audit evidence | Payout provider/VietQR where account verification is used | UAT payout provider, encryption key and sanitized withdrawal fixture | `PROVIDER_MUTATION`; Admin financial mutation is prohibited in production | No | No final financial-operation asset without approved PII-safe target |
| Non-journey push utility | In-app notification read/read-only surfaces | FCM registration, permission and delivery | Firebase Cloud Messaging | Firebase Admin, frontend VAPID value, browser permission and registered UAT token | `PROVIDER_MUTATION` | No production push registration/delivery test | In-app read-only view only; no push-delivery asset |

S07 Affiliate conversion/payout uses the internal affiliate ledger rather than a
separate external provider: its program/member read-only view is accepted, while
join, attribution, conversion and payout remain individually controlled UAT
mutations. `QR_POSITIVE_LABEL_UAT` is likewise a business fixture, not provider
configuration.

## 4. Read-only scope and mutation tiers

### Read-only tests to run first

The existing Admin, user01 and user02 production identities unlocked the 12
source role-gated read-only tests across three viewports: Admin
route/inventory/auth, affiliate dashboard, buyer route bundle, cart load, empty
checkout, chat entry, seller live entry, buyer orders, non-admin boundary, and
seller route bundle. All 36 executions passed. The cart badge was then run as a
separate authorized reversible `SAFE_UAT_MUTATION` and passed 3/3 after state
restoration.

No provider configuration is needed for these route/read checks, except that
the chat route's full realtime behavior needs the WebSocket configuration.
Run this read-only set before requesting any mutation approval.

### Mutation tier map

| Remaining mutation | Tier | Minimum scope |
|---|---|---|
| Profile/address add, edit, default and delete | `SAFE_UAT_MUTATION` | Disposable buyer account; cleanup after run |
| Cart add/update/delete and quantity badge | `SAFE_UAT_MUTATION` | **Completed:** seeded demo cart quantity `2 -> 3 -> 2`; restore verified |
| Cart quote and COD order creation | `CONTROLLED_UAT_MUTATION` | Dedicated buyer/cart/order fixture and cleanup |
| Receive, complete, review, dispute and report | `CONTROLLED_UAT_MUTATION` | Owned isolated orders only |
| KYC document upload/submit | `PROVIDER_MUTATION` | Synthetic docs; Cloudinary/Firebase UAT only |
| Shop registration/state change | `CONTROLLED_UAT_MUTATION` | Disposable shop/owner; media upload is `PROVIDER_MUTATION` |
| Product create/edit/media/variant/stock/moderation submit | `CONTROLLED_UAT_MUTATION` for DB-only; `PROVIDER_MUTATION` for media | Approved seller fixture and cleanup |
| Seller fulfillment transitions | `CONTROLLED_UAT_MUTATION` | Isolated seller-owned orders |
| Withdrawal, payout account and payout completion | `PROVIDER_MUTATION` in sandbox; `PROHIBITED_PRODUCTION_MUTATION` on current production | UAT payout provider and encryption key only |
| Voucher create/activate/deactivate | `CONTROLLED_UAT_MUTATION` | UAT shop/platform fixture |
| Live create/start/end/pin and Agora host actions | `PROVIDER_MUTATION` | Agora UAT channel and eligible offer |
| Attribution resolve/reload | `SAFE_UAT_MUTATION` if client-only; conversion recording is controlled | Separate buyer and affiliate accounts |
| Conversion approve/reject/payout | `CONTROLLED_UAT_MUTATION` for ledger; provider action is `PROVIDER_MUTATION` | UAT conversion/payout fixtures |
| Community post/comment/reaction/report | `CONTROLLED_UAT_MUTATION` | Synthetic/PII-safe account and cleanup |
| Chat thread/message/realtime | `CONTROLLED_UAT_MUTATION` | Two UAT sessions and message cleanup; transport config separate |
| Admin user status/delete, wallet adjustment, withdrawal completion | `PROHIBITED_PRODUCTION_MUTATION` | UAT-only synthetic records |
| Admin shop/product review and voucher mutation | `CONTROLLED_UAT_MUTATION` | Pending UAT queue fixtures |
| PayOS create/return/webhook/reconcile/refund and GHN booking/sync | `PROVIDER_MUTATION` | Sandbox only; real production money/carrier actions prohibited |
| FCM registration/push delivery | `PROVIDER_MUTATION` | UAT browser permission/token/provider |

No blanket mutation authorization is requested. Current production remains
off-limits for real payments, refunds, withdrawals, settlement, wallet
adjustments, destructive seed/reset, and destructive Admin operations.

## 5. Admin gap reconciliation

The source/runtime audit confirms that the frontend has no `/admin/kyc`,
`/admin/moderation`, `/admin/orders`, or `/admin/audit` route. Backend
controllers do not create a user-facing capability. Therefore product status
remains `NOT_IMPLEMENTED`, while the corresponding current UAT cases are
`NOT_APPLICABLE`; they are not credential-blocked and do not need fixtures.

| Case | Product status | Current UAT classification | Required action |
|---|---|---|---|
| A03 KYC | `NOT_IMPLEMENTED` | `NOT_APPLICABLE` | Record gap; implement or replace Help link only if product scope is reopened |
| A06 Moderation | `NOT_IMPLEMENTED` | `NOT_APPLICABLE` | Record gap; do not create a UAT expectation for absent UI |
| A07 Order/payment oversight | `NOT_IMPLEMENTED` | `NOT_APPLICABLE` | Record gap; do not treat as an auth blocker |
| A10 Audit/monitoring | `NOT_IMPLEMENTED` | `NOT_APPLICABLE` | Record gap; do not create a UAT expectation for absent UI |

## 6. AF-TECH-002

Classification: **`BASELINE_TECH_DEBT`**.

- Check-only command at backend revision `3b59ab9`: 8,390 diagnostics
  (8,328 errors, 62 warnings; 7,452 potentially fixable).
- Categories include repository-wide Prettier drift and TypeScript
  unsafe-assignment, unsafe-call and unsafe-member diagnostics.
- No backend file was changed during this goal. The 14 files changed by the
  current backend revision were checked directly and produced no diagnostics;
  this establishes no regression from the current goal slice.
- Backend `test:ci`, deploy build and Prisma schema validation pass. Lint alone
  did not establish a runtime or security defect; the unsafe-type findings
  remain technical review risk until cleaned up.
- The CI workflow runs backend tests and deploy build, not lint. The repository
  `npm run lint` script includes `--fix`, so it was not used for this audit.

Required action: schedule a scoped lint cleanup, review its diff, then rerun
check-only lint, tests, build and Prisma validation. Do not rewrite the whole
repository as part of functional UAT.

## 7. Documentation repository boundary

```text
Documentation path: D:\Work\TMDT_CHG\ecommerce-anti-fake\WorkSpace\docs
Git worktree: YES (WorkSpace; branch main)
Canonical repository: Ecommerce-Anti-Fake/WorkSpace
Commit possible: YES (local commit created)
Required action: owner review/push the current local WorkSpace `main`, then verify `origin/main`; the loose source mirror remains retained locally
```

The source mirror remains at `D:\Work\TMDT_CHG\ecommerce-anti-fake\docs`; the canonical
Git-backed copy is `WorkSpace\docs`. Relative links and visual paths were preserved
while integrating so existing evidence references remain valid.

## 8. UAT denominator

The retained aggregate includes one audit-only record that is not an executable
test. The source-confirmed denominator is therefore the primary sign-off view.
All 39 authenticated records previously held by the missing-credential gate are
now passed; the cart-badge mutation was isolated, restored and verified.

```text
TOTAL_DISCOVERED=246 retained records
TOTAL_APPLICABLE=237 source-confirmed applicable executions
PASSED=237
FAILED=0
BLOCKED_EXTERNAL=0
BLOCKED_MUTATION_APPROVAL=0
NOT_APPLICABLE=3 (2 desktop/laptop mobile-only executions + 1 stale report-only audit record)
NOT_IMPLEMENTED=0 in the 246 automated records
UNSAFE=6 (hosted executions of local-only mocked checkout tests)
OTHER_EXTERNAL_BLOCKER=0
```

The transparent retained-record equation is `237 + 3 + 6 = 246`.
The current executable applicable result is `237/237`, with no failed,
auth-fixture-blocked or mutation-held execution. A03/A06/A07/A10 add four
out-of-band product/UAT cases classified `NOT_IMPLEMENTED`/`NOT_APPLICABLE`;
they are intentionally not inserted into the 246 automated denominator.

## 9. Journey Center status reconciliation

These are the existing 28 canonical rows. No valid public evidence is
promoted. Status values remain aligned with
`docs/user-guide/DOCUMENTATION_REGISTRY.md` and
`docs/user-guide/VISUAL_MANIFEST.md`.

| Journey | Status | Exact missing evidence |
|---|---|---|
| B01 Account and first use | `PARTIAL` | Authenticated registration completion, profile/address mutation and final feature capture |
| B02 Search and discovery | `PARTIAL` | Sort/filter assertion if not separately captured; reviews, provenance and authenticated actions |
| B03 QR verification | `PARTIAL` | Server-owned known-positive label/code/link/image and final raw+annotated Desktop/Mobile capture |
| B04 Complete purchase | `PARTIAL` | Cart quote/order creation, payment/return where in scope, and final feature-flow capture |
| B05 Order management | `PARTIAL` | Owned order detail plus receive/review/dispute/state-transition evidence and final capture |
| B06 Voucher | `SOURCE_VERIFIED` | Authenticated eligibility/application runtime and final visual |
| B07 Chat with Shop | `PARTIAL` | Two-session create/send/receive/history/reconnect evidence, supported metadata, final visual |
| B08 Community | `PARTIAL` | PII-safe public fixture, public capture and in-journey post/comment/reaction evidence |
| B09 Livestream | `PARTIAL` | Authenticated viewer join, Agora interaction/comment/reaction/reminder/leave and final capture |
| S01 Shop registration | `SOURCE_VERIFIED` | Authenticated submit/state transition and final visual |
| S02 Shop setup | `PARTIAL` | Owned shop/business edit persistence and final visual |
| S03 Create product | `PARTIAL` | Product/media/variant/stock/moderation submission and final visual |
| S04 Product management | `PARTIAL` | Edit/variant/media ownership and reload evidence plus final visual |
| S05 Process order | `PARTIAL` | Seller transition/audit/ownership evidence and PII-safe final visual |
| S06 Shop voucher | `PARTIAL` | Create/edit/activate/deactivate/eligibility evidence and final visual |
| S07 Affiliate | `PARTIAL` | Join, attribution, conversion and payout evidence; program read-only capture is accepted |
| S08 Wallet and revenue | `PARTIAL` | Approved seller capture target, payout-provider evidence and PII-safe raw+annotated visuals |
| S09 Livestream selling | `PARTIAL` | Create/start/pin/Agora host, viewer interaction/end and final visual |
| A01 Admin dashboard | `PARTIAL` | Data-backed KPI/list/detail assertions and session/reload evidence beyond route/no-5xx |
| A02 User management | `PARTIAL` | List/detail/filter assertions and PII-safe final visual |
| A03 KYC | `NOT_IMPLEMENTED` | Frontend `/admin/kyc` route does not exist; current UAT case is `NOT_APPLICABLE` |
| A04 Shop review | `PARTIAL` | Pending shop fixture, approve/reject/activation, audit/notification and final visual |
| A05 Product review | `PARTIAL` | Product decision/audit evidence; read-only visual is accepted |
| A06 Moderation | `NOT_IMPLEMENTED` | Frontend `/admin/moderation` route does not exist; current UAT case is `NOT_APPLICABLE` |
| A07 Order/payment oversight | `NOT_IMPLEMENTED` | Frontend `/admin/orders` route does not exist; current UAT case is `NOT_APPLICABLE` |
| A08 Wallet/financial operations | `PARTIAL` | Approved UAT withdrawal/payout-provider flow and PII-safe final visual |
| A09 Platform promotions | `PARTIAL` | Platform voucher mutation/eligibility evidence; read-only visual is accepted |
| A10 Audit/monitoring | `NOT_IMPLEMENTED` | Frontend `/admin/audit` route does not exist; current UAT case is `NOT_APPLICABLE` |

## 10. Consolidated manual enablement request

### Accounts

- None. The existing production seed/demo accounts already unlock the
  authenticated read-only scope. If a runner needs values, provide only the
  existing identities through the approved secure runtime mechanism; never put
  passwords or tokens in documentation.

### Business fixtures

- No additional fixture is required for the cart-badge scope; the existing
  seeded demo cart passed with verified restoration.
- For broader partial journey evidence only: `PURCHASE_CATALOG_SET`,
  `BUYER_CHECKOUT_SET`, `ORDER_STATE_SET`, `VOUCHER_SET`, `AFFILIATE_SET`,
  `CHAT_THREAD_SET`, `LIVE_AGORA_SET`, `NOTIFICATION_READ_SET`,
  `QR_POSITIVE_LABEL_UAT`, `ADMIN_QUEUE_SET`, `KYC_DOC_SET`, and
  `COMMUNITY_SAFE_SET`, each only when its mapped journey is scheduled.

### Allowed mutations

- Cart badge `SAFE_UAT_MUTATION` is complete: seeded demo cart quantity was
  incremented/decremented with before/after assertions and cleanup verification.
- Other mutations remain individually gated by the tier map above; no blanket
  mutation approval is requested.
- Do not authorize current-production payment, refund, withdrawal, settlement,
  wallet adjustment, destructive Admin operation or seed/reset.

### Provider sandbox/config

- PayOS and GHN test configuration for checkout/fulfillment provider paths.
- Agora UAT App ID/certificate/token setup for live host/viewer paths.
- Socket.IO origin/config and Redis only if multi-instance realtime is tested.
- Firebase Admin/Web/FCM permission setup for push/auth journeys.
- Cloudinary UAT storage for synthetic media/KYC fixtures.
- VietQR and payout encryption only if payout-account verification is included.

### Repository integration

- WorkSpace is the canonical Git worktree: `D:\Work\TMDT_CHG\ecommerce-anti-fake\WorkSpace`,
  remote `https://github.com/Ecommerce-Anti-Fake/WorkSpace.git`, branch `main`.
- Validate privacy, links and evidence assets, then commit/push the integrated
  documentation. No repository initialization is requested.

### What this unlocks

- No additional authentication tests; all 39 formerly auth-blocked executions
  (36 read-only plus 3 cart-badge) were executed and passed.
- The mapped business/provider fixtures unlock their specific partial journey
  steps; up to 38 remaining Desktop/Mobile visual slots (76 raw/annotated image
  files) may then be captured only after the underlying journey passes.
- The unmapped retained-report record is closed as a `NOT_APPLICABLE`
  stale/duplicate audit artifact and does not represent a product test.
