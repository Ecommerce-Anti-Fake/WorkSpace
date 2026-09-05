# AntiFake Documentation Evidence Matrix

Snapshot: 2026-09-04
Historical Front-End reference: `65842923f7c3b33a3176653d651ff4c6a53b89e2`
Accepted UAT evidence baseline: `8157ffa`

This document is the final documentation/evidence boundary. It does not rerun
or downgrade the accepted UAT result (`237/237` applicable passed). `PARTIAL`
means that a documented subset is evidenced while another step remains open;
the terminal disposition column names the exact remaining dependency.

## Current environment and fixture evidence

```text
ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO
UAT_RUNTIME=https://antifake.io.vn
UAT_API=https://api.antifake.io.vn
DATA_CLASSIFICATION=LEGACY_DEMO_PLUS_DOCS_UAT_MANAGED
OWNER_MIXED_DATA_CLASSIFICATION=CONFIRMED
SEPARATE_UAT_PROVISIONING_REQUIRED=NO
DESTRUCTIVE_RESET_ALLOWED=NO
```

The owner-approved current runtime is UAT/demo. Existing rows are preserved as
`LEGACY_DEMO_DATA`; only new deterministic `DOCS_UAT_MANAGED` rows are owned by
the fixture scripts. The guarded additive ensure ran and was rerun after the
backend fixture repair; the read-only verifier and audit passed, and no
payment, payout, shipment, external KYC or livestream side effect occurred.
The B03 positive-result and B08 Community feed captures
passed at both required viewports and are registered in the visual manifest. A
public scheduled-live room-shell pair also passed at both target viewports;
that temporary evidence proves only the non-provider shell because Agora media
and join behavior remain blocked. The functional `237/237` baseline was not
rerun.

The current Community source and fresh public UAT probes expose reaction,
comment and share controls but no report control or report form. `B08/report`
is therefore `NOT_IMPLEMENTED`, not a fixture or provider blocker.

## Current UAT/demo binding verification — 2026-09-04

Front-End revision `c7dfc58e89950ce799a6c575988d0a5e78aeb96b` deployed through
the existing workflow in GitHub Actions run `100`. An isolated Playwright
probe against the deployed UAT/demo runtime passed the B03 positive-result and
B08 Community Help bindings at Desktop `1440x900` and Mobile `390x844` (4/4).
The final raw/annotated captures were then promoted after privacy review. The
focused capture workflow run `33862241536` also passed 4/4 public pairs for the
Community feed and scheduled-live shell; its overall conclusion is failure
only because approved authenticated capture secrets are absent. This is
current UAT/demo evidence; it does not close the broader visual goal or rerun
the functional baseline.

Backend revision `70f9bb5028ae18d8e772c59dc2e06a093b92ce6d` deployed and
health-checked in Actions run `44`. The guarded additive fixture run then
reconciled the managed graph and the read-only verifier/audit passed. A fresh
isolated public product probe selected the managed `DOCS_UAT` variant and
observed 25 available units with enabled cart/buy controls; it deliberately did
not submit the cart mutation. This proves the fixture prerequisite, not an
authenticated B04 capture.

## Targeted Help Center production verification

GitHub Actions run `94` (`Deploy frontend to VPS`) completed successfully and
reported the exact deployed Front-End SHA:
`https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33734823773`.
The deployment pulled, built and health-checked revision
`65842923f7c3b33a3176653d651ff4c6a53b89e2`. The general `237/237` UAT was not
rerun.

The accepted Admin Help/content rows below carry forward the approved run `90`
baseline. Run `91` evidence covers the public smoke and the two public B04
reuse aliases; run `92` evidence covers the B03/open public entry binding;
run `93` covers its recheck plus the B03/enter-code public input binding; and
current run `94` covers the B09/shop reuse binding. No approved Admin session
was available for a new current-revision Admin visual sign-off.

| Axis | Targeted result |
|---|---|
| Public Help content | `/help` loaded at Desktop `1440x900` and Mobile `390x844`; Buyer, Shop, Affiliate and QR entries were accessible; Admin entries were absent from categories, search, related/journey links and the legacy public Admin URL. |
| Admin Help content | Approved run `90` baseline: `/admin/help` loaded inside the Admin shell with the `Hướng dẫn` sidebar item, active state, 12 Admin article cards and working `Admin Dashboard` search. |
| Authorization | Approved run `90` baseline: Guest -> `/auth`; Buyer -> `/`; Seller -> `/`; Admin -> `/admin/help`. Direct A01 article navigation was allowed only for Admin. |
| Visual/marker evidence | Seventeen published step bindings use thirteen unique raw/annotated Desktop/Mobile pairs; all 26 served assets are complete, readable and PII-safe. A separate temporary UAT scheduled-live shell pair is marker-reviewed but not served as a final Help binding. |
| Responsive evidence | Public Help, Admin Help and accepted article renders fit the target viewports; no horizontal overflow or visual overlap was observed. |
| Browser diagnostics | No console messages were found on the inspected public and Admin Help pages. No production mutation, payment, payout or general UAT rerun was performed. |

A separate read-only Playwright smoke against deployed revision
`78646d724e93e18a15a5b729aa29c15530f1c494` passed 12/12 public Help/Journey
checks at Desktop `1440x900`. A targeted browser probe also verified the two
public B04 reuse aliases and the B09/shop reuse binding at Desktop `1440x900`
and Mobile `390x844`: expected assets rendered at the required dimensions and
exposed marker numbers `1,2,3`. This confirms those aliases as complete reuse evidence;
the B03/open public QR entry state was captured separately at both target
viewports without submitting a code or mutating a fixture. The three Admin
aliases still need an approved real Admin-session visual verification, and
fixture-backed journeys or provider-dependent flows remain open.

### Final targeted status

```text
UAT_STATUS=COMPLETE
HELP_CONTENT_STATUS=PASS
HELP_VISUAL_STATUS=PASS
HELP_MARKER_STATUS=PASS
ADMIN_HELP_STATUS=PASS
HELP_RESPONSIVE_STATUS=PASS
DOCUMENTATION_STATUS=PASS
JOURNEY_CENTER_STATUS=PASS
GOAL_STATUS=COMPLETE
```

These statuses close the approved Help Center production goal only. The
evidence-axis table below continues to describe the broader journey scope and
retains `PARTIAL`, `BLOCKED_*` and `NOT_IMPLEMENTED` classifications where
those remain accurate.

## Local branch visual-reuse checkpoint — 2026-09-03

The historical 2026-09-03 Front-End branch bound six additional Help steps to
existing accepted visual pairs and added the B03/open and B03/enter-code public
entry/input visuals. The two public
B04 aliases are now production-verified; the three Admin aliases remain
pending an approved Admin session. B09/shop reuses the accepted B02/detail
pair after a read-only live-origin product-detail check:

| Local binding | Accepted source binding | Safe basis | Production boundary |
|---|---|---|---|
| B04/discover | B02/search | Same public catalog/discovery state and marker meaning | Production verified at both target viewports |
| B04/product-detail | B02/detail | Same public product-detail state and marker meaning | Production verified at both target viewports |
| B09/shop | B02/detail | Same public product-detail state opened from a live session | Production verified at both target viewports; live media/chat/purchase remain outside scope |
| ADMIN-REVIEW/dashboard | A01/open | Same Admin role and Dashboard shell | Route/image smoke only with test role; approved Admin session pending |
| ADMIN-REVIEW/product-review | A05/pending | Same Admin product-review queue state | Route/image smoke only with test role; approved Admin session pending |
| ADMIN-OPERATIONS/dashboard | A01/open | Same Admin role and Dashboard shell | Route/image smoke only with test role; approved Admin session pending |

`npm run test:help` verifies the added path/marker bindings and existing
served asset pairs locally. This historical checkpoint records the two B04
aliases, both B03 entry/input states and B09/shop as already accepted; the
current UAT/demo B03 result, B08 feed and scheduled-live shell evidence are
recorded above. B03/B08 reduce the required visual remainder to 62 and the
fixture-blocked remainder to 57; the scheduled shell is an additional
capturable non-provider sub-state and does not complete the Agora-dependent
B09 watch step. The B08/report step is `NOT_IMPLEMENTED` after current
source/runtime inspection. The three Admin aliases do not count until approved
session evidence exists.

## Evidence-axis status

| Journey | Role | SOURCE | RUNTIME | DESKTOP_VISUAL | MOBILE_VISUAL | ANNOTATED_VISUAL | GUIDE_CONTENT | JOURNEY_CENTER | Missing / terminal disposition |
|---|---|---|---|---|---|---|---|---|---|
| B01 Account and first use | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Positive registration, OTP/Google bridge and profile/address mutation: `BLOCKED_PROVIDER_SANDBOX` plus disposable account fixture |
| B02 Search and discovery | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Review/sort/provenance and authenticated action target: `BLOCKED_FIXTURE` |
| B03 QR verification | Buyer/QR | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | B03/open, B03/enter-code and the positive-result UAT fixture visual are captured at both viewports; broader QR feature behavior remains `PARTIAL` |
| B04 Complete purchase | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Discover and product-detail visuals complete via verified B02 reuse; cart/order fixture: `BLOCKED_FIXTURE`; GHN/PayOS checkout completion: `BLOCKED_PROVIDER_SANDBOX` |
| B05 Order management | Buyer | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | PII-safe owned order and receive/review/dispute state: `BLOCKED_FIXTURE` |
| B06 Voucher | Buyer | SOURCE_VERIFIED | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Active eligible voucher and matching offer/order: `BLOCKED_FIXTURE` |
| B07 Chat with Shop | Buyer/Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Synthetic two-session thread: `BLOCKED_FIXTURE`; realtime delivery/reconnect: `BLOCKED_PROVIDER_SANDBOX` |
| B08 Community | Buyer/Guest | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Public DOCS_UAT feed visual is accepted; interaction remains `BLOCKED_FIXTURE`; report surface is `NOT_IMPLEMENTED` |
| B09 Livestream | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Public discovery and live-origin product-detail visual complete via accepted B02 reuse; scheduled non-provider room shell is captured in UAT evidence, while authenticated join/media/interactions remain `BLOCKED_PROVIDER_SANDBOX` (Agora) |
| S01 Shop registration | Seller | SOURCE_VERIFIED | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Disposable seller onboarding with synthetic KYC/media: `BLOCKED_FIXTURE` plus upload/auth provider |
| S02 Shop setup | Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Isolated owned Shop for edit/reload evidence: `BLOCKED_FIXTURE` |
| S03 Create product | Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Disposable product, media, variant, stock and moderation state: `BLOCKED_FIXTURE` |
| S04 Product management | Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Disposable owned product for edit/reload/ownership evidence: `BLOCKED_FIXTURE` |
| S05 Process order | Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Seller-owned processing order and approved transitions: `BLOCKED_FIXTURE` |
| S06 Shop voucher | Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Disposable Shop voucher and matching catalog/order: `BLOCKED_FIXTURE` |
| S07 Affiliate | Seller/Affiliate | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Separate eligible buyer, code, conversion and payout ledger: `BLOCKED_FIXTURE`; ledger mutations controlled |
| S08 Wallet and revenue | Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | PII-safe seller capture fixture; withdrawal/payout on production: `UNSAFE_PRODUCTION`; sandbox payout: `BLOCKED_PROVIDER_SANDBOX` |
| S09 Livestream selling | Seller | SOURCE_VERIFIED | BLOCKED_PROVIDER_SANDBOX | BLOCKED_PROVIDER_SANDBOX | BLOCKED_PROVIDER_SANDBOX | BLOCKED_PROVIDER_SANDBOX | PARTIAL | PARTIAL | Eligible seller live fixture and Agora UAT channel: `BLOCKED_PROVIDER_SANDBOX` |
| A01 Admin dashboard | Admin | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Read-only dashboard is evidenced; targeted PII-safe operational detail remains `BLOCKED_FIXTURE` |
| A02 User management | Admin | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | PII-reviewed user list/detail set: `BLOCKED_FIXTURE` |
| A03 KYC | Admin | NOT_IMPLEMENTED | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_IMPLEMENTED | NOT_APPLICABLE | Frontend `/admin/kyc` capability absent; no fixture request |
| A04 Shop review | Admin | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Sanitized pending Shop application and review queue: `BLOCKED_FIXTURE` |
| A05 Product review | Admin | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Existing read-only queue visual is accepted; targeted detail/decision remains `BLOCKED_FIXTURE` |
| A06 Moderation | Admin | NOT_IMPLEMENTED | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_IMPLEMENTED | NOT_APPLICABLE | Frontend `/admin/moderation` capability absent; no fixture request |
| A07 Order/payment oversight | Admin | NOT_IMPLEMENTED | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_IMPLEMENTED | NOT_APPLICABLE | Frontend `/admin/orders` capability absent; no fixture request |
| A08 Wallet/financial operations | Admin | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Sanitized withdrawal/audit read set; approve/settle/financial mutation: `UNSAFE_PRODUCTION`, provider sandbox otherwise |
| A09 Platform promotions | Admin | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Existing read-only voucher workspace is accepted; targeted state mutation: `BLOCKED_FIXTURE` |
| A10 Audit/monitoring | Admin | NOT_IMPLEMENTED | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_IMPLEMENTED | NOT_APPLICABLE | Frontend `/admin/audit` capability absent; no fixture request |

### Status interpretation

- `SOURCE_VERIFIED`: source, schema/state and permission boundary are known;
  matching production runtime is incomplete.
- `PARTIAL`: the named subset has matching evidence, but the journey is not
  fully verified.
- `BLOCKED_FIXTURE`: the exact business/test record is missing or is not safe
  for a final PII-reviewed capture.
- `BLOCKED_PROVIDER_SANDBOX`: the missing step touches an external provider and
  needs its UAT configuration.
- `UNSAFE_PRODUCTION`: the real external/financial action remains prohibited
  in the current UAT_DEMO runtime unless an independently approved sandbox is
  configured; historical production evidence keeps its original label.
- `NOT_IMPLEMENTED` and `NOT_APPLICABLE` are product/current-UAT boundaries,
  not credential blockers.

## Help Center quality remediation - 2026-09-04

The canonical step-level report is
`docs/user-guide/HELP_CENTER_QUALITY_AUDIT.md`. The implementation was
validated against the current Front-End source, local rendered routes and the
deployed B03/open/B03/enter-code evidence plus B09/shop binding in run `94`;
historical production evidence remains labelled separately.

| Evidence axis | Local result | Remaining boundary |
|---|---|---|
| Runtime/text completeness | 30 articles and 88 steps are registered; every article and step has user-facing title/description text | Full feature-flow UAT remains `PARTIAL` where the product fixture or provider is unavailable |
| Visual completeness | 17 accepted step bindings with 26 unique served assets, including the UAT B03 result and B08 feed pairs; a separate temporary UAT scheduled-live shell pair is captured; the current required remainder is 62 | 57 fixture-backed steps, 5 provider-dependent steps, 8 `NOT_IMPLEMENTED` Admin routes and the `NOT_IMPLEMENTED` B08/report step remain; Admin aliases still need approved-session verification |
| Marker correctness | All 18 local visual bindings declare marker metadata and written guidance; automated sequence checks pass | Automated checks do not replace the pending approved-session visual review of the 3 Admin aliases |
| Role visibility | Public registry/search excludes `admin`; Admin registry is rendered only in Admin Help; B09/shop is visible on the public route after run `94` | New approved Admin-session visual verification remains unavailable |
| Authorization | `/admin/help/*` is under the existing Admin parent `ProtectedRoute roles=["admin"]`; approved guest/buyer/seller/admin checks remain the run `90` baseline | No new approved Admin-session regression was available on run `94` |
| Desktop | Local Help and Admin shell/visual route checks pass at `1440x900` | Full article-by-article production audit pending |
| Mobile | Local Help and Admin shell/visual route checks pass at `390x844`; Admin navigation remains visible in the responsive shell | Full article-by-article production audit pending |

No production payment, order, payout, role, moderation or provider mutation was
performed for this remediation.

## Minimum fixture requests

Passwords, tokens, API keys and personal identity data are deliberately absent.
Supply any secret only through the approved secure environment mechanism.

### `QR_POSITIVE_LABEL_UAT`

- Purpose: B03 known-positive QR verification and Desktop/Mobile final visual.
- Required role: none for public verification; Buyer only if a separate
  authenticated history flow is later added (that history route is absent).
- Required object/data: one `VerificationLabel` with `labelType=QR_PRODUCT` or
  `QR_BATCH`, `scopeType=SUPPLY_BATCH`, an existing `Brand`, the referenced
  `SupplyBatch`, one `OfferBatchLink`, and at least one `ProvenanceEvent`.
- Required state: `labelStatus=active`; the batch exists; linked Offer has
  `offerStatus=active`, `moderationStatus=approved`; include a `VERIFIED`
  provenance event for the expected result.
- Payload/identifier: the verifier trims and uppercases a direct code, or
  extracts and uppercases the `code` or `verificationCode` query parameter from
  an HTTP(S) link, then hashes it with SHA-256. The seed pattern is
  `ANTIFAKE-QR-{n}-{batch.id}`; the database stores only the hash, so the
  plaintext must be delivered privately for the test.
- PII requirements: no person, address, phone, account, secret or internal ID
  in the screenshot; the QR code/link is a disposable test value.
- Read-only or mutation: verification is read-only; creating the label/batch/
  link/provenance is a controlled UAT database mutation.
- Can existing seed/demo data satisfy it: source creates 24 labels, but the
  random batch IDs and plaintext codes are not exposed by the seed output and a
  prior current-runtime positive label was not validated. The new
  `DOCS_UAT` graph now supplies the matching active record.
- Can Codex create it safely: yes, in the owner-approved current `UAT_DEMO`
  runtime through the guarded additive `DOCS_UAT` fixture command.
- Cleanup required: remove the disposable label, batch link and provenance, or
  discard the isolated UAT database.
- Journeys unlocked: B03 positive verification.
- Screenshots unlocked: B03 Desktop and Mobile raw plus annotated feature pair.

### `ORDER_DETAIL_PII_SAFE_UAT`

- Purpose: B05 Buyer order list/detail, tracking and historical-result guide
  evidence without exposing a real recipient.
- Required role: Buyer `ACTIVE_BUYER_UAT` (`BUYER_UAT`) and Seller
  `ACTIVE_SELLER_UAT` (`SELLER_UAT`).
- Required object/data: Seller-owned verified Shop, active approved Offer,
  active Variant with stock, one `Order`, `OrderShopGroup`, `OrderItem`,
  `PaymentIntent` and `Escrow`.
- Required state: `orderStatus=completed`, `fulfillmentStatus=DELIVERED`,
  `paymentStatus=PAID`, `escrowStatus=RELEASED`; use synthetic shipping name,
  phone and address values that are not tied to a person.
- PII requirements: no real shipping fields, identifiers, customer names or
  bank data; mask or omit tracking data unless needed by the step.
- Read-only or mutation: read-only is sufficient for B05 detail and tracking;
  receive/review/dispute transitions require a separate controlled order.
- Can existing seed/demo data satisfy it: seed creates completed orders for the
  buyer/seller relationships, but the legacy current-runtime detail exposes
  recipient fields, so it is not an approved final visual target.
- Can Codex create it safely: yes, in the current `UAT_DEMO` runtime with the
  guarded `DOCS_UAT` order graph and synthetic recipient fields.
- Cleanup required: none for an approved historical read-only record; delete a
  disposable UAT order and its dependent records after a controlled run.
- Journeys unlocked: B05 Buyer orders and the read-only portion of S05/A01.
- Screenshots unlocked: B05 Desktop/Mobile order list/detail.

### `ORDER_FULFILLMENT_CONTROLLED_UAT`

- Purpose: S05 seller state-transition and matching Admin queue evidence.
- Required role: the same Buyer/Seller pair and the same isolated Shop.
- Required object/data: one additional isolated Order with OrderShopGroup,
  item, payment intent and escrow.
- Required state: start at `orderStatus=paid`, `fulfillmentStatus=PROCESSING`,
  `paymentStatus=PAID`, `escrowStatus=HELD`; advance only through the approved
  transition sequence to `shipping`/`SHIPPING` and then `completed`/`DELIVERED`.
- PII requirements: synthetic shipping values only.
- Read-only or mutation: `CONTROLLED_UAT_MUTATION`; do not use a real order.
- Can existing seed/demo data satisfy it: seeded `paid`, `shipping`, completed
  and cancelled records prove source shape; the new `DOCS_UAT` graph now
  provides valid lifecycle states without changing legacy orders.
- Can Codex create it safely: yes, after the explicit additive UAT preflight;
  only the reserved `DOCS_UAT` order graph may be changed.
- Cleanup required: delete only the managed order and dependent
  payment/escrow/allocation records when separately approved; never reset the
  shared demo database.
- Journeys unlocked: S05 transitions and Admin read-only status presentation.
- Screenshots unlocked: S05 Desktop/Mobile transition states.

### `CHAT_SYNTHETIC_TWO_SESSION_UAT`

- Purpose: B07 PII-safe history, send/receive and reconnect evidence.
- Required role: Buyer `BUYER_UAT` paired with Seller `SELLER_UAT`; Seller owns
  the selected verified Shop.
- Required object/data: one `ChatThread` with `buyerUserId`, `sellerUserId` and
  `shopId`; two or more `ChatMessage` records with unique `clientMessageId`
  values and synthetic text such as “UAT message one”. No attachment is
  required for the text journey.
- Required state: both accounts active and authenticated; thread accessible to
  both participants; REST history returns the messages; Socket.IO session is
  connected for the delivery/reconnect portion.
- PII requirements: synthetic text only; no customer conversation, phone,
  address, image or file from a real user.
- Read-only or mutation: existing history is read-only; creating a thread and
  sending messages is `CONTROLLED_UAT_MUTATION`.
- Can existing seed/demo data satisfy it: six seeded threads and messages can
  satisfy basic history, but their participant display names and seeded media
  are not an approved final documentation target and do not prove two-session
  delivery.
- Can Codex create it safely: yes, in the current `UAT_DEMO` runtime with
  explicit additive mutation approval; the API supports POST thread and
  message paths.
- Cleanup required: delete only the disposable thread/messages and any media.
- Journeys unlocked: B07 Buyer/Seller chat and realtime recovery.
- Screenshots unlocked: B07 Desktop/Mobile two-session history/send states.

### `COMMUNITY_PUBLIC_SAFE_UAT`

- Purpose: B08 public feed/post/comment guide evidence.
- Required role: public reader; the author may be the existing demo Seller only
  when its display label is approved as a non-person demo identity.
- Required object/data: one `SocialPost` with `visibility=PUBLIC`, synthetic
  title/body, optional approved Offer reference, and optional synthetic media;
  comments/replies are not needed for feed-only evidence.
- Required state: public and visible; no report, moderation-sensitive or hidden
  content.
- PII requirements: demo alias only; no real personal name, contact,
  location, order or customer content.
- Read-only or mutation: public reading is read-only; creating post/comment/
  reaction is `CONTROLLED_UAT_MUTATION`.
- Can existing seed/demo data satisfy it: eight public seed posts exist, but
  their author/Shop relationships and media are not approved as a PII-safe
  final capture without an explicit alias review.
- Can Codex create it safely: yes, in the current `UAT_DEMO` runtime as a
  namespaced synthetic post owned by `DOCS_UAT`.
- Cleanup required: delete the synthetic post, comments, reactions and media.
- Journeys unlocked: B08 public Community.
- Screenshots unlocked: B08 Desktop/Mobile feed and optional post detail.

### `SELLER_DISPOSABLE_BUSINESS_UAT`

- Purpose: S02-S06 seller documentation while reusing the verified Seller
  identity and avoiding business-critical records.
- Required role: existing `ACTIVE_SELLER_UAT`; no new Seller account.
- Required object/data: one designated non-business-critical Shop or explicit
  disposable data namespace; one active approved Offer with active Variant and
  stock; sanitized media; one active Shop voucher with non-expired dates; and,
  only for S05, one isolated seller-owned order.
- Required state: Shop `verified`; Offer `offerStatus=active`,
  `moderationStatus=approved`; Variant `isActive=true` and stock greater than
  zero; Voucher `status=ACTIVE`; warehouse/dimensions valid.
- PII requirements: synthetic Shop profile, warehouse and media; no tax,
  bank, phone or personal identity data in captures.
- Read-only or mutation: existing user02 Shops/products unlock read-only list
  views; creating/editing the disposable objects is
  `CONTROLLED_UAT_MUTATION`, with upload portions as `PROVIDER_MUTATION`.
- Can existing seed/demo data satisfy it: user02 already owns three verified
  Shops and seeded active product records, so no new account is needed. Those
  records are not disposable mutation targets; the missing part is isolated
  business data for create/edit/voucher/order evidence.
- Can Codex create it safely: yes, in the current `UAT_DEMO` runtime through
  the reserved `DOCS_UAT` Shop/data graph; legacy business records remain
  immutable.
- Cleanup required: delete disposable Offer, media, Variant, Voucher, Shop and
  test Order records as applicable.
- Journeys unlocked: S02, S03, S04, S05 and S06; seller dashboard read-only
  remains already runnable.
- Screenshots unlocked: S02-S06 Desktop/Mobile raw and annotated pairs.

### `AFFILIATE_CONVERSION_UAT`

- Purpose: S07 attribution, conversion and payout-ledger evidence.
- Required role: existing active AffiliateAccount/program (the verified Admin
  fixture already has this relationship) plus a separate eligible Buyer.
- Required object/data: active program, active AffiliateAccount, active default
  AffiliateCode, distinct buyer, one isolated matching order/conversion and a
  read-only commission/payout ledger entry.
- Required state: code active; conversion initially `PENDING` then approved only
  under controlled UAT; no self-referral; payout ledger synthetic.
- PII requirements: no bank or personal payout data in screenshots.
- Read-only or mutation: program/member view is read-only and already
  evidenced; attribution/conversion/approval is `CONTROLLED_UAT_MUTATION`.
- Can existing seed/demo data satisfy it: active program/member and seeded
  codes/conversions exist, and the read-only program view is accepted; the
  full payable attribution lifecycle is not approved in the current UAT/demo
  runtime; the managed conversion is non-payable.
- Can Codex create it safely: yes, in the current `UAT_DEMO` runtime with
  explicit additive approval and a non-payable ledger.
- Cleanup required: remove the isolated conversion/order/ledger records.
- Journeys unlocked: S07 conversion and payout-ledger portions.
- Screenshots unlocked: S07 conversion/ledger Desktop/Mobile states.

### `KYC_SYNTHETIC_DOCUMENT_UAT`

- Purpose: S01 seller KYC upload/submit and status presentation.
- Required role: disposable Seller onboarding identity; do not alter user02's
  verified KYC record.
- Required object/data: `UserKyc`, one `UserKycSubmission` with `submissionNumber`
  1 and two synthetic `UserKycSubmissionDocument` records (`FRONT` and `BACK`)
  linked to synthetic `MediaAsset` objects.
- Required state: initial submission `verificationStatus=pending`; optionally a
  second read-only record in `verified` or `rejected` state for status labels.
- PII requirements: generated document images with no real identity number,
  face, address or signature; store only hashes for identity fields.
- Read-only or mutation: upload/submit is `PROVIDER_MUTATION` through the UAT
  upload/auth bridge; status viewing is read-only.
- Can existing seed/demo data satisfy it: user01/user02 have verified KYC and
  the seed contains document rows, but that does not provide a safe pending
  onboarding target or permission to alter a production identity.
- Can Codex create it safely: yes, in the current `UAT_DEMO` runtime with
  synthetic placeholder media and no external KYC submission.
- Cleanup required: delete submission, document and media records.
- Journeys unlocked: S01 KYC portion; not A03, whose Admin UI is absent.
- Screenshots unlocked: S01 Desktop/Mobile upload/status states.

### `ADMIN_PIISAFE_READ_SET`

- Purpose: A02/A04/A08 read-only list/detail/status evidence.
- Required role: existing `ACTIVE_ADMIN_UAT` (`ADMIN_UAT`); no new
  Admin account.
- Required object/data: one alias-only active user and one alias-only Seller
  user for A02; one `Shop` with `shopStatus=pending_verification` and sanitized
  documents for A04; one masked withdrawal/payout record for A08. A05/A09
  already have accepted read-only visual subsets.
- Required state: list/detail records load without real contact or bank values;
  Shop application pending; withdrawal may be `PENDING` or `PROCESSING` for
  display only; no approval/settlement click is needed.
- PII requirements: display aliases, synthetic dates, masked identifiers and no
  account number, email, phone or identity document contents.
- Read-only or mutation: read-only; queue creation is a controlled UAT fixture
  mutation. Admin status changes, user deletion and wallet adjustment are
  prohibited in the current UAT/demo runtime for legacy or financial records.
- Can existing seed/demo data satisfy it: seeded moderation/shop/withdrawal
  records exist and Admin read-only routes pass, but current records are not an
  approved final PII-safe list/detail target.
- Can Codex create it safely: yes, in the current `UAT_DEMO` runtime for
  reserved synthetic review rows; never alter legacy roles or financial state.
- Cleanup required: remove synthetic queue/user/withdrawal records in UAT.
- Journeys unlocked: A02 and A04 read-only detail; A08 financial status display.
- Screenshots unlocked: A02, A04 and A08 Desktop/Mobile read-only visuals.

## Provider sandbox matrix

Provider secrets belong in the approved environment/secret manager. The
non-provider column records work that can remain documented independently.

| Provider | Journey/step | Exact capability needed | Sandbox env/config needed | Mutation involved | Can non-provider portion already be verified? |
|---|---|---|---|---|---|
| PayOS | B04 checkout payment/return/webhook | Create a test payment, return, callback and reconciliation | PayOS sandbox client/API/checksum values, sandbox base URL, approved return/cancel/webhook URLs and test payment account/link | `PROVIDER_MUTATION`; no real payment/refund | Yes. Cart UI, badge, Buy Now quote shell and fail-closed behavior are already evidenced |
| GHN | B04 shipping quote/booking/tracking | Quote with valid address/service and, only in sandbox, booking/tracking sync | GHN test token, sandbox/base URL, shop ID, province/district/ward and service/type IDs, synthetic parcel | Quote is provider read; booking/sync is `PROVIDER_MUTATION` | Yes. Checkout navigation and Buy Now authoritative quote are evidenced |
| Agora | B09/S09 live join/host/publish/leave | Authenticated viewer and seller media lifecycle | UAT App ID, server token/certificate, token TTL, isolated channel/role and console configuration | `PROVIDER_MUTATION` | Yes. Public live listing/detail/discovery is evidenced |
| Socket.IO/WebSocket + Redis | B07 chat delivery/reconnect/presence/typing | Two authenticated sessions, event delivery, reconnect and REST recovery | UAT API origin/CORS allowlist, `/api/socket.io` path, JWT access, Redis URL/pub-sub config for multi-instance fan-out | Synthetic thread/messages are `CONTROLLED_UAT_MUTATION`; transport is external runtime | Yes. Authenticated chat entry/history read-only is evidenced |
| Cloudinary/upload storage | S01, S03, S04, B07 media steps | Upload and serve synthetic PNG/JPG/PDF media over HTTPS | UAT cloud name, API key/secret in secret storage, signed/upload policy and disposable media set | `PROVIDER_MUTATION` | Yes. Text/read-only product and chat portions can be documented without upload |
| Firebase Auth bridge | B01 registration/OTP/Google; S01 onboarding | Disposable account creation and verification/bridge callback | Frontend Firebase settings and backend Admin values in UAT secret storage; approved disposable identity | `PROVIDER_MUTATION` | Yes. Public auth shell, protected routes and negative boundaries are verified |
| Firebase FCM | Notification utility | Register UAT browser token and deliver one test push | Firebase Admin values, frontend VAPID key, browser permission and UAT device/token | `PROVIDER_MUTATION` | Yes. In-app notification read-only surface does not require FCM |
| VietQR / payout provider | S08/A08 payout account verification | Resolve a synthetic bank account and complete sandbox payout path | Provider sandbox URL/client values, synthetic account, and `PAYOUT_ACCOUNT_ENCRYPTION_KEY` in UAT secret storage | `PROVIDER_MUTATION`; real withdrawal remains `PROHIBITED_PRODUCTION_MUTATION` in UAT_DEMO | Yes. Wallet/ledger and masked payout read-only views are already evidenced |

## Mutation boundary

| Tier | Remaining examples | Boundary |
|---|---|---|
| `SAFE_UAT_MUTATION` | No remaining production action; the B04 cart badge mutation is already complete and restored | Disposable isolated UAT data only; record baseline and verify cleanup |
| `CONTROLLED_UAT_MUTATION` | Synthetic QR/business fixture creation, isolated order transitions, chat messages, community post, vouchers and affiliate ledger | Requires a named fixture, explicit approval and cleanup; never a real user/order |
| `PROVIDER_MUTATION` | PayOS/GHN sandbox, Agora, upload/storage, Firebase/FCM, payout/VietQR | Provider sandbox only; secrets stay outside docs and source |
| `PROHIBITED_PRODUCTION_MUTATION` | Real payment/refund/settlement, withdrawal, wallet adjustment, destructive Admin action, role change | Must not execute in the current `UAT_DEMO` runtime; historical production revisions `13c18f4`/`8157ffa` retain their original evidence labels |

## Visual persistence closeout

The final persistence pass used the browser tool's permitted OS temporary
directory, because direct writes to WorkSpace, Front-End, Playwright output,
test-results and repository artifact paths returned:

`Error: Access denied: path ... is not within any of the configured workspace roots.`

The browser successfully wrote these two PII-safe raw captures to `%TEMP%`,
then they were copied into the preferred WorkSpace path:

- Raw Desktop: `WorkSpace/assets/user-guide/raw/desktop/B04-overview-production-13c18f4-desktop.png`
- Raw Mobile: `WorkSpace/assets/user-guide/raw/mobile/B04-overview-production-13c18f4-mobile.png`
- Annotated Desktop: `WorkSpace/assets/user-guide/annotated/desktop/B04-overview-production-13c18f4-desktop-annotated.png`
- Annotated Mobile: `WorkSpace/assets/user-guide/annotated/mobile/B04-overview-production-13c18f4-mobile-annotated.png`

The same four files are copied under `WorkSpace/docs/images/guide/help/` for
the Markdown manifest and documentation verifier. The raw images are
unchanged; annotations identify the Desktop/Mobile selector and do not cover
content. No credentials, account data or PII is visible. The captures show the
production B04 overview shell only; they do not upgrade the B04 feature journey
above `PARTIAL`.

## Documentation boundary

| Field | Value |
|---|---|
| Documentation path | `D:\Work\TMDT_CHG\ecommerce-anti-fake\WorkSpace\docs` plus the mirrored root `docs` Markdown set |
| Git worktree | `WorkSpace` |
| Canonical repository | `Ecommerce-Anti-Fake/WorkSpace` (`main`) |
| Commit possible | YES |
| Required action | Commit/push documentation and evidence assets in WorkSpace; repository integration of the root mirror remains separate owner workflow |

## Authenticated capture re-evaluation — 2026-09-05

The capture path now uses only the role-scoped runtime variables
`ANTIFAKE_UAT_BUYER_*`, `ANTIFAKE_UAT_SELLER_*` and `ANTIFAKE_UAT_ADMIN_*`.
It performs real login and server-role verification before loading a fresh
Playwright storage state. The state is confined to ignored `.uat-runtime/auth/`,
excluded from uploaded capture artifacts and deleted at context close.

The current shell preflight reported `BUYER_CREDENTIAL_AVAILABLE=false`,
`SELLER_CREDENTIAL_AVAILABLE=false` and `ADMIN_CREDENTIAL_AVAILABLE=false`.
No authenticated visual was accepted in this checkpoint. The fixture graph and
the accepted B03/B08/scheduled-shell evidence remain unchanged; no legacy row,
provider or functional UAT baseline was modified.

```text
AUTHENTICATED_CAPTURE_STATUS=RUNTIME_INPUTS_UNAVAILABLE_TO_CURRENT_SHELL
FIXTURE_BLOCKED_AFTER=57
PROVIDER_BLOCKED_AFTER=5
VISUAL_COMPLETE=17
VISUAL_REMAINING=62
```

Capture run `33941303277` completed against Front-End SHA
`79313d79ab8edbfc1cdc9fc7118e7bce5d0dd7df`: four public fixture pairs passed,
eight authenticated/QR cases were skipped, and no new visual evidence was
promoted. The role availability result was false for Buyer, Seller and Admin;
no credential or storage-state value was recorded.

Follow-up capture run `33941840279` exercised deployed Front-End commit
`8c5d027ba4e82ad0e4947e787c2b7672f9c3c884`, which includes explicit UAT base-URL
propagation for fresh authenticated contexts. Four public pairs passed and
eight authenticated/QR cases were skipped because the sanitized role inputs
remained unavailable. Evidence classification and the 17 complete / 62
remaining totals are unchanged.

## Authenticated UAT evidence checkpoint - 2026-09-05 (current)

The local capture runner reads only the six role-scoped authentication inputs
from the approved runtime boundary. It performs real UI login, verifies the
server role and uses an isolated temporary Playwright context. Values and
storage states are never written to this matrix. The runner does not load the
Back-End database or provider secrets into the Front-End child process.

| Step | Previous blocker | Fixture | UAT route | Runtime state verified | Now capturable | Remaining blocker |
|---|---|---|---|---|---|---|
| B05/list | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders` | Buyer login PASS; synthetic order card visible | Yes - Desktop/Mobile raw + annotated accepted | None for read-only list |
| B05/detail | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders/:id` | Buyer login PASS; synthetic recipient, product and shipping state visible | Yes - Desktop/Mobile raw + annotated accepted | Next-action transition remains unverified |
| B07/open | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat` | Buyer login PASS; DOCS_UAT room and seeded message history visible | Yes - Desktop/Mobile raw + annotated accepted | Send/realtime/reconnect not verified |
| A02/search | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users` | Admin login PASS; DOCS_UAT filter returns synthetic review row | Yes - Desktop/Mobile raw + annotated accepted | Mutations remain unverified |
| A02/detail | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users/:userId` | Admin login PASS; synthetic review-user detail visible | Yes - Desktop/Mobile raw + annotated accepted | Mutations remain unverified |

The local input availability was Buyer `AVAILABLE`, Seller `AVAILABLE` and
Admin `AVAILABLE`. Seller authentication returned HTTP 401, so Seller capture
remains role-blocked and no Seller or legacy entity was mutated. The A04 Shop
detail runtime rendered, but its synthetic KYC document URL is unavailable;
the resulting broken media state is recorded as a visual-quality defect and is
not promoted as accepted evidence. B05 next-action, B07 send/reconnect, cart /
voucher mutation, Seller, Affiliate and provider-dependent states remain
unaccepted. A03, A06, A07 and A10 remain `NOT_IMPLEMENTED`.

```text
FIXTURE_BLOCKED_BEFORE=57
FIXTURE_BLOCKED_AFTER=52
PROVIDER_BLOCKED_BEFORE=5
PROVIDER_BLOCKED_AFTER=5
PREVIOUS_COMPLETE_VISUAL_STEPS=17
NEWLY_COMPLETED_VISUAL_STEPS=5
CURRENT_COMPLETE_VISUAL_STEPS=22
CURRENT_REQUIRED_VISUAL_STEPS=79
CURRENT_REMAINING_VISUAL_STEPS=57
COVERAGE_PERCENT=27.85
LEGACY_RECORDS_MODIFIED=0
LEGACY_RECORDS_DELETED=0
PROVIDER_SIDE_EFFECTS=NONE
```

## Current authenticated reuse expansion - 2026-09-05

| Visual step | Evidence source | Runtime verification | Accepted result |
|---|---|---|---|
| B04/order | B05/detail UAT raw/annotated pair | Buyer real login; same `/profile/orders/:id` synthetic completed-order state | Desktop/Mobile accepted reuse |
| ADMIN-REVIEW/dashboard | A01 Admin UAT raw/annotated pair | Admin real login; `/admin` dashboard | Desktop/Mobile accepted reuse |
| ADMIN-REVIEW/product-review | A05 Admin UAT raw/annotated pair | Admin real login; `/admin/product-registrations` filtered to DOCS_UAT | Desktop/Mobile accepted reuse |
| ADMIN-OPERATIONS/dashboard | A01 Admin UAT raw/annotated pair | Admin real login; `/admin` dashboard | Desktop/Mobile accepted reuse |

The expansion introduced no new database rows and no mutation of legacy records.
Seller remains role-blocked by HTTP 401; provider-dependent and mutation-driven
steps remain unaccepted.

The deployed runtime check used Front-End SHA
`b6f076f48214712d6a59d1f3368b7f1167985bd2` from Actions run `33949213451`.
Admin capture and the real-login Help binding probe passed at both target
viewports; no legacy or provider state changed.

Privacy recheck: B01/profile, B01/address and A08/reconciliation reached their
runtime routes and markers, but were classified `REJECTED_PRIVACY` because the
seed contact data or legacy financial/bank-account state was visible. They do
not count as accepted visual evidence.

```text
PREVIOUS_COMPLETE_VISUAL_STEPS=22
NEWLY_COMPLETED_THIS_EXPANSION=4
CURRENT_COMPLETE_VISUAL_STEPS=26
CURRENT_REQUIRED_VISUAL_STEPS=79
CURRENT_REMAINING_VISUAL_STEPS=53
FIXTURE_BLOCKED_AFTER=48
PROVIDER_BLOCKED_AFTER=5
COVERAGE_PERCENT=32.91
```
