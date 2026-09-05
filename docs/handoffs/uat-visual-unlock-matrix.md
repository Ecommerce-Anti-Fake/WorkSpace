# UAT visual unlock matrix

Reconciled: 2026-09-04

This is the handoff from the additive fixture goal to the existing visual
coverage goal. The owner-approved target is the current `UAT_DEMO` deployment;
separate UAT provisioning is not required. It does not publish screenshots,
change the visual baseline or close `ANTIFAKE VISUAL COVERAGE COMPLETION.md`.

The exact fixture table is one row per original blocker; provider rows are
listed separately. Desktop `1440x900` and Mobile `390x844` bindings are both
required where the step is applicable; the baseline counts those bindings
separately. `PENDING_RUNTIME_PROOF` is not a capture pass.
The older `isolated target` wording in some row notes means the approved
`UAT_DEMO` runtime plus a fresh isolated browser context; it does not mean a
second VPS, DNS name or external-UAT provisioning blocker.

Current data classification: the owner confirmed the existing runtime/database
as UAT/demo and classified all pre-existing rows as immutable
`LEGACY_DEMO_DATA`. The audit continues to report legacy external/unmarked
signals, but they do not block additive `DOCS_UAT_MANAGED` fixtures. Only
managed rows are changed or cleaned up; destructive reset and provider side
effects remain denied.

## Exact 60-row fixture-blocker reconciliation

The original fixture classification contained 60 rows. The detailed inventory
below preserves that one-row-per-step accounting, including the two rows now
captured, the one row reclassified as `NOT_IMPLEMENTED`, and the three Admin
reuse rows that still need an approved isolated Admin session. `RUNTIME_STATE`
means the database/route state was checked; it is not a screenshot pass unless
the value says `DESKTOP_MOBILE_CAPTURED`.

| VISUAL_STEP | PREVIOUS_BLOCKER | UAT_FIXTURE | UAT_ROUTE | RUNTIME_STATE_VERIFIED | NOW_CAPTURABLE | PROVIDER_STILL_REQUIRED | REMAINING_BLOCKER |
|---|---|---|---|---|---|---|---|
| B04-add-to-cart | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/product/:id` -> `/cart` | `DOCS_UAT_GRAPH_PASS; PUBLIC_VARIANT_SELECTION_READY` | No | None | Injected Buyer session and isolated browser capture; controlled cart mutation remains optional |
| B04-order | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders/:id` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Buyer session and PII review of the order-detail capture |
| B05-list | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Buyer session and Desktop/Mobile capture |
| B05-detail | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders/:id` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Buyer session and PII-safe detail capture |
| B05-next-action | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/profile/orders/:id` | `DOCS_UAT_GRAPH_PASS` | No | None unless a provider action is exercised | Injected Buyer session and valid action-state browser proof |
| B01-profile | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` | `/profile` | `DOCS_UAT_GRAPH_PASS` | No | None for read-only view | Injected Buyer session and Desktop/Mobile capture |
| B01-address | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` | `/profile/address` | `DOCS_UAT_GRAPH_PASS` | No | None for read-only view | Injected Buyer session; address mutation remains controlled |
| B06-find | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/cart` -> `/checkout` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Buyer session and eligible-cart browser proof |
| B06-check-conditions | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/checkout` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Buyer session and eligibility evidence |
| B06-apply | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/checkout` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Buyer session; controlled apply/restore capture |
| B03-result | `BLOCKED_FIXTURE` | `QR_POSITIVE_LABEL_UAT` | `/qr` | `DESKTOP_MOBILE_CAPTURED` (`VERIFIED`) | Yes | None | None; raw/annotated pair accepted |
| B07-open | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat` | `DOCS_UAT_GRAPH_PASS` | No | None for REST history | Injected Buyer/Seller sessions and PII review |
| B07-send | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat/:roomId` | `DOCS_UAT_GRAPH_PASS` | No | Socket.IO/Redis for realtime delivery | Injected two-session browser proof; send is controlled UAT mutation |
| B07-reconnect | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat/:roomId` | `DOCS_UAT_GRAPH_PASS` | No | Socket.IO/Redis runtime | Two isolated authenticated browser sessions |
| B08-feed | `BLOCKED_FIXTURE` | `COMMUNITY_PUBLIC_SAFE_UAT` | `/community` | `DESKTOP_MOBILE_CAPTURED` | Yes | None for seeded public content | None; raw/annotated pair accepted |
| B08-interact | `BLOCKED_FIXTURE` | `COMMUNITY_PUBLIC_SAFE_UAT` | `/community` | `DOCS_UAT_GRAPH_PASS` | No | None | Authenticated DOCS_UAT interaction and controlled cleanup |
| B08-report | `BLOCKED_FIXTURE` | `COMMUNITY_PUBLIC_SAFE_UAT` | `/community` | `SOURCE_PROBE_NO_REPORT_CONTROL` | No — `NOT_IMPLEMENTED` | None | Implement a current report surface before capture |
| S01-prepare | `BLOCKED_FIXTURE` | `KYC_SYNTHETIC_DOCUMENT_UAT` | `/register` | `DOCS_UAT_GRAPH_PASS`; guest redirect known | No | Firebase/Cloudinary/KYC only for submission | Injected Seller session and safe form capture |
| S01-submit | `BLOCKED_FIXTURE` | `KYC_SYNTHETIC_DOCUMENT_UAT` | `/register` | `DOCS_UAT_GRAPH_PASS` | No | Firebase/Cloudinary/KYC | No external KYC call; controlled synthetic submit proof |
| S01-approval | `BLOCKED_FIXTURE` | `KYC_SYNTHETIC_DOCUMENT_UAT` | `/register` -> `/seller/shop-info` | `DOCS_UAT_GRAPH_PASS` | No | Firebase/KYC if approval is exercised | Injected Seller session and synthetic status proof |
| S01-setup | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/shop-info` | `DOCS_UAT_GRAPH_PASS` | No | None for seeded approved state | Injected Seller session and Desktop/Mobile capture |
| S02-profile | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/shop-info` | `DOCS_UAT_GRAPH_PASS` | No | None for read-only view | Injected Seller session and capture |
| S02-business | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/business-info` | `DOCS_UAT_GRAPH_PASS` | No | None for seeded fields | Injected Seller session and form-state capture |
| S02-save | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/business-info` | `DOCS_UAT_GRAPH_PASS` | No | None | Controlled UAT update/reload proof and cleanup |
| S03-basic-info | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | `DOCS_UAT_GRAPH_PASS` | No | None for seeded form | Injected Seller session and capture |
| S03-media | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | `DOCS_UAT_GRAPH_PASS` | No | Cloudinary for upload evidence | Seeded media is render-only; upload sandbox remains absent |
| S03-variant | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | `DOCS_UAT_GRAPH_PASS` | No | None for seeded variant/stock | Injected Seller session and capture |
| S03-submit | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | `DOCS_UAT_GRAPH_PASS` | No | Cloudinary if upload is exercised | Controlled disposable product submit proof |
| S04-open | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Seller session and capture |
| S04-edit | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products/:offerId` | `DOCS_UAT_GRAPH_PASS` | No | Cloudinary only for media edit | Controlled edit/reload proof |
| S04-moderation | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products/:offerId` | `DOCS_UAT_GRAPH_PASS` | No | None for seeded status | Injected Seller session and status capture |
| S05-orders | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders` | `DOCS_UAT_GRAPH_PASS` | No | None for read-only list | Injected Seller session and PII-safe capture |
| S05-confirm-order | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | `DOCS_UAT_GRAPH_PASS` | No | None for local transition | Valid Seller transition and browser proof |
| S05-prepare-order | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | `DOCS_UAT_GRAPH_PASS` | No | None for local transition | Valid Seller transition and browser proof |
| S05-ship-order | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | `DOCS_UAT_GRAPH_PASS` | No | GHN for booking/tracking | Transition-only proof or approved GHN sandbox |
| S05-complete-order | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | `DOCS_UAT_GRAPH_PASS` | No | GHN if tracking is exercised | Valid local lifecycle proof without real shipment |
| S05-revenue | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/dashboard` or `/seller/wallet` | `DOCS_UAT_GRAPH_PASS` | No | None for seeded ledger view | Injected Seller session and PII-safe capture |
| S06-open | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/vouchers` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Seller session and capture |
| S06-configure | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/vouchers` | `DOCS_UAT_GRAPH_PASS` | No | None | Controlled synthetic voucher mutation proof |
| S06-review | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/vouchers` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Seller session and status capture |
| S08-balance | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/wallet` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Seller session and PII-safe capture |
| S08-transactions | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/wallet` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Seller session and capture |
| S08-withdrawal | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/wallet` | `DOCS_UAT_GRAPH_PASS` | No | VietQR/payout for execution | Read-only masked form only until a sandbox exists |
| S07-conversion | `BLOCKED_FIXTURE` | `AFFILIATE_CONVERSION_UAT` | `/seller/affiliate` or `/affiliate?tab=member` | `DOCS_UAT_GRAPH_PASS` | No | None for non-payable ledger | Injected Seller/Buyer session and capture |
| S07-payout | `BLOCKED_FIXTURE` | `AFFILIATE_CONVERSION_UAT` | `/seller/affiliate` | `DOCS_UAT_GRAPH_PASS` | No | VietQR/payout for execution | Read-only synthetic payout status; no execution |
| A01-read | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin` | `DOCS_UAT_GRAPH_PASS` | No | None for read-only view | Injected isolated Admin session |
| A02-search | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Admin session and privacy review |
| A02-detail | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users/:userId` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Admin session and privacy review |
| A04-inspect | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/shop-registrations/:shopId` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Admin session and synthetic Shop review |
| A04-decision | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/shop-registrations/:shopId` | `DOCS_UAT_GRAPH_PASS` | No | None for reversible UAT transition | Controlled Admin decision proof |
| A05-decision | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/product-registrations/:offerId` | `DOCS_UAT_GRAPH_PASS` | No | None for reversible UAT transition | Controlled Admin decision proof |
| A08-reconciliation | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/wallet` | `DOCS_UAT_GRAPH_PASS` | No | None for read-only view | Injected Admin session and privacy review |
| A08-payout | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/withdraw-requests` | `DOCS_UAT_GRAPH_PASS` | No | VietQR/payout for execution | Read-only masked withdrawal evidence |
| A09-change | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/vouchers` | `DOCS_UAT_GRAPH_PASS` | No | None for reversible UAT state | Controlled Admin promotion proof |
| ADMIN-REVIEW-dashboard | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin` | `ROUTE_IMAGE_SMOKE_TEST_ROLE_ONLY` | No | None | Approved isolated Admin session |
| ADMIN-REVIEW-shop-review | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/shop-registrations` | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Admin session and queue/detail capture |
| ADMIN-REVIEW-product-review | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/product-registrations` | `ROUTE_IMAGE_SMOKE_TEST_ROLE_ONLY` | No | None | Approved isolated Admin session |
| ADMIN-OPERATIONS-dashboard | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin` | `ROUTE_IMAGE_SMOKE_TEST_ROLE_ONLY` | No | None | Approved isolated Admin session |
| ADMIN-OPERATIONS-review | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users`, `/admin/shop-registrations`, `/admin/product-registrations`, `/admin/vouchers`, `/admin/wallet` | `DOCS_UAT_GRAPH_PASS` | No | None for read-only views | Injected Admin session and route-specific captures |
| ADMIN-OPERATIONS-audit | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | Implemented Admin route(s) only | `DOCS_UAT_GRAPH_PASS` | No | None | Injected Admin session; source-confirmed route only |

The current fixture remainder is 54 `DOCS_UAT` graph rows plus the three
approved-session Admin reuse rows. Therefore the two captured rows reduce the
60-row fixture classification by two, while `B08/report` leaves the required
visual denominator as `NOT_IMPLEMENTED` rather than a fixture row:

```text
FIXTURE_BLOCKED_AFTER=57
```

### Provider rows tracked separately

These five rows were provider-blocked, not part of the original 60 fixture
rows. They remain independently classified and do not become safe merely from
the DOCS_UAT graph:

| VISUAL_STEP | PREVIOUS_BLOCKER | UAT_FIXTURE | UAT_ROUTE | RUNTIME_STATE_VERIFIED | NOW_CAPTURABLE | PROVIDER_STILL_REQUIRED | REMAINING_BLOCKER |
|---|---|---|---|---|---|---|---|
| B04-checkout | `BLOCKED_PROVIDER` | `ACTIVE_BUYER_UAT` + `ORDER_DETAIL_PII_SAFE_UAT` | `/checkout` | `DOCS_UAT_GRAPH_PASS` | No — pre-provider shell only | PayOS/GHN | Sandbox configuration and safe provider proof |
| B09-watch | `BLOCKED_PROVIDER` | `LIVE_SCHEDULED_SHELL_UAT` | `/live/d0000000-0000-4000-8000-000000000055` | `SHELL_DESKTOP_MOBILE_CAPTURED` | No — shell only | Agora | Authenticated media/join/realtime lifecycle |
| S09-prepare | `BLOCKED_PROVIDER` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/live` | `DOCS_UAT_GRAPH_PASS` | No — form shell only | Agora | Injected Seller session plus isolated provider config |
| S09-start | `BLOCKED_PROVIDER` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/live` | `DOCS_UAT_GRAPH_PASS` | No | Agora | No safe UAT channel/token configuration |
| S09-review | `BLOCKED_PROVIDER` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/live` | `DOCS_UAT_GRAPH_PASS` | No | Agora | Provider lifecycle evidence |

## Exclusions and status calculation

`B02` discovery/detail, public `B03/open` and `B03/enter-code`, public
`B09/shop`, and the already accepted/read-only `S07` program and Admin visual
bindings retain their existing evidence classifications. They are not counted
as newly unlocked by this fixture implementation.

`A03`, `A06`, `A07` and `A10` remain excluded when their frontend routes are
absent; they remain `NOT_IMPLEMENTED`, not fixture failures. PayOS, GHN,
Agora, realtime, Cloudinary, Firebase and VietQR/payout remain provider rows
until an isolated configuration and safe runtime call are proven.

Current calculation after UAT_DEMO additive fixture verification and browser
evidence for the positive QR and public Community feed:

```text
FIXTURE_BLOCKED_BEFORE=60
FIXTURE_BLOCKED_AFTER=57
PROVIDER_BLOCKED_BEFORE=5
PROVIDER_BLOCKED_AFTER=5
VISUAL_STEPS_NOW_UNLOCKED=3
NEWLY_COMPLETED_VISUALS=B03/positive-result,B08/feed
NEWLY_CAPTURABLE_NON_PROVIDER_SHELL=B09/watch-shell
NOT_IMPLEMENTED_OR_NA_AFTER=9
```

The current UAT/demo binding commit `c7dfc58e89950ce799a6c575988d0a5e78aeb96b`
was deployed through GitHub Actions run `100`. The isolated deployed Help probe
passed all four B03/B08 Desktop/Mobile checks; raw and annotated pairs were
privacy-reviewed before promotion. The scheduled live shell capture then passed
the focused UAT capture workflow at both target viewports; it is a shell-only
visual and does not claim Agora media/provider completion.

The remaining 57 fixture rows still require their own browser/runtime evidence;
fixture creation alone is not a capture pass. The B09 row is an explicit
exception at the sub-state level: its public scheduled shell is now captured,
but the required full watch journey remains in the provider bucket until Agora
media lifecycle and authenticated interaction are proven. This document
intentionally does not claim that source code or a seed manifest alone makes a
visual capturable.

The B08/report row was reclassified from fixture-blocked to `NOT_IMPLEMENTED`
after a current source inspection and fresh public UAT probes at both target
viewports found no report control or form. No report mutation was attempted.

## Authenticated capture re-evaluation — 2026-09-05

The Front-End capture harness now reads only the six role-scoped
`ANTIFAKE_UAT_*` runtime variables, performs the real login, checks the server
role and expected role route, and uses a fresh Playwright storage state for the
capture context. Storage states live under ignored `.uat-runtime/auth/`, are
excluded from uploaded capture artifacts and are deleted when the context
closes. Missing one role does not suppress public or other role captures.

The current shell preflight returned `BUYER_CREDENTIAL_AVAILABLE=false`,
`SELLER_CREDENTIAL_AVAILABLE=false` and `ADMIN_CREDENTIAL_AVAILABLE=false`.
No authenticated visual was therefore counted in this checkpoint. The
fixture graph remains `DOCS_UAT_FIXTURES_VALID`; no legacy entity or provider
was mutated. Shell Playwright's public attempt was blocked by
`ERR_NETWORK_ACCESS_DENIED`, while the isolated DevTools browser independently
rendered the synthetic Community feed at `1440x900` and `390x844` with no
console messages.

```text
FIXTURE_BLOCKED_BEFORE=57
CAPTURABLE_AFTER_AUTH=ROLE_INPUTS_UNAVAILABLE_TO_CURRENT_SHELL
FIXTURE_BLOCKED_AFTER=57
PROVIDER_BLOCKED_AFTER=5
NEWLY_COMPLETED_VISUALS=0
AUTHENTICATED_CAPTURE_STATUS=RUNTIME_INPUTS_UNAVAILABLE_TO_CURRENT_SHELL
VISUAL_GOAL_REMAINS_OPEN=YES
```

## Authenticated reuse expansion - 2026-09-05 (current)

The real Admin-session capture and the accepted Buyer order-detail capture
unlock four additional step-level visuals without a new database write:

| VISUAL_STEP | PREVIOUS_BLOCKER | UAT_FIXTURE | UAT_ROUTE | RUNTIME_STATE_VERIFIED | NOW_CAPTURABLE | PROVIDER_STILL_REQUIRED | REMAINING_BLOCKER |
|---|---|---|---|---|---|---|---|
| B04-order | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` (reuse B05/detail) | `/profile/orders/:id` | Buyer PASS; identical synthetic completed-order state | Yes | None | Checkout remains partial |
| ADMIN-REVIEW-dashboard | `LOCAL_REUSE_PENDING_ADMIN_SESSION` | `ADMIN_PIISAFE_READ_SET` | `/admin` | Admin PASS; dashboard markers visible at Desktop/Mobile | Yes | None | Wider review journey remains partial |
| ADMIN-REVIEW-product-review | `LOCAL_REUSE_PENDING_ADMIN_SESSION` | `ADMIN_PIISAFE_READ_SET` | `/admin/product-registrations` | Admin PASS; DOCS_UAT-filtered product queue visible at Desktop/Mobile | Yes | None | Decision mutation remains unverified |
| ADMIN-OPERATIONS-dashboard | `LOCAL_REUSE_PENDING_ADMIN_SESSION` | `ADMIN_PIISAFE_READ_SET` | `/admin` | Admin PASS; dashboard markers visible at Desktop/Mobile | Yes | None | Wider operations journey remains partial |

The Admin dashboard and product-review raw/annotated pairs were privacy-reviewed
and the served copies now point to those UAT annotations. No legacy record was
modified, no record was deleted, and no payment, shipment, payout, KYC or other
provider side effect occurred.

Post-deploy verification completed on Front-End SHA
`b6f076f48214712d6a59d1f3368b7f1167985bd2` in Actions run `33949213451`.
The isolated Admin pack passed at Desktop `1440x900` and Mobile `390x844`;
the real-login Help binding probe passed B04/order and all three Admin reuse
routes at both viewports.

```text
PREVIOUS_COMPLETE_VISUAL_STEPS=22
NEWLY_COMPLETED_THIS_EXPANSION=4
CURRENT_COMPLETE_VISUAL_STEPS=26
CURRENT_REQUIRED_VISUAL_STEPS=79
CURRENT_REMAINING_VISUAL_STEPS=53
FIXTURE_BLOCKED_BEFORE=57
FIXTURE_BLOCKED_AFTER=48
PROVIDER_BLOCKED_BEFORE=5
PROVIDER_BLOCKED_AFTER=5
COVERAGE_PERCENT=32.91
VISUAL_GOAL_REMAINS_OPEN=YES
```

The post-push `uat-capture` run `33941303277` used Front-End SHA
`79313d79ab8edbfc1cdc9fc7118e7bce5d0dd7df` and completed successfully. Its
role preflight reported Buyer, Seller and Admin unavailable; four public pairs
passed and eight authenticated/QR cases were skipped. No new visual was
accepted, so the matrix remains at 57 fixture-blocked and 5 provider-blocked.

The auth-context correction commit `8c5d027ba4e82ad0e4947e787c2b7672f9c3c884`
was deployed in run `33941828311`. It explicitly propagates the configured UAT
base URL into login and storage-state contexts; focused auth-contract,
TypeScript, lint, build and guarded test-discovery checks passed. Follow-up
capture run `33941840279` completed successfully, but its sanitized preflight
again found Buyer, Seller and Admin inputs unavailable. Four public pairs passed
and eight authenticated/QR cases were skipped, so no unlock-matrix row changed.

## Authenticated local capture checkpoint - 2026-09-05 (current)

The owner-approved local credential bridge now feeds isolated real-login
Playwright contexts without exposing values. Buyer and Admin role verification
passed; Seller input was available but the observed login response was HTTP 401.
The fixture graph remained `DOCS_UAT_FIXTURES_VALID`, and no legacy record or
provider state was changed.

| VISUAL_STEP | PREVIOUS_BLOCKER | UAT_FIXTURE | UAT_ROUTE | RUNTIME_STATE_VERIFIED | NOW_CAPTURABLE | PROVIDER_STILL_REQUIRED | REMAINING_BLOCKER |
|---|---|---|---|---|---|---|---|
| B05-list | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders` | Buyer PASS; synthetic DOCS_UAT order list visible | Yes | None | None for read-only list |
| B05-detail | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders/:id` | Buyer PASS; synthetic order detail visible | Yes | None | Next-action transition not verified |
| B07-open | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat` | Buyer PASS; DOCS_UAT room with two seeded messages visible | Yes | None for history | Send/realtime/reconnect not verified |
| A02-search | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users` | Admin PASS; DOCS_UAT filter and synthetic review row visible | Yes | None | Mutations not verified |
| A02-detail | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users/:userId` | Admin PASS; synthetic review-user detail visible | Yes | None | Mutations not verified |

For each accepted row, Desktop and Mobile raw captures were created at
`1440x900` and `390x844`, privacy-reviewed, annotated on copies, marker-mapped
to Help prose and promoted only after integrity checks. The exact raw and
annotated asset paths are recorded in `VISUAL_MANIFEST.md`.

A04 inspect was exercised but not promoted: the synthetic KYC document URL
returns unavailable placeholder media in the current runtime. This remains a
visual-quality defect. Seller journeys remain role-blocked by HTTP 401; B05
next-action, B07 send/reconnect, B06/cart mutation, Affiliate, Seller, wallet
mutation and provider-dependent steps remain unaccepted.

```text
FIXTURE_BLOCKED_BEFORE=57
FIXTURE_BLOCKED_AFTER=52
PROVIDER_BLOCKED_BEFORE=5
PROVIDER_BLOCKED_AFTER=5
VISUAL_STEPS_NOW_UNLOCKED=5
NEWLY_COMPLETED_VISUALS=B05/list,B05/detail,B07/open,A02/search,A02/detail
CURRENT_COMPLETE_VISUAL_STEPS=22
CURRENT_REQUIRED_VISUAL_STEPS=79
CURRENT_REMAINING_VISUAL_STEPS=57
COVERAGE_PERCENT=27.85
GOAL_STATUS=IN_PROGRESS
VISUAL_GOAL_REMAINS_OPEN=YES
```
