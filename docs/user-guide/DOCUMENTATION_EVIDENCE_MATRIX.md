# AntiFake Documentation Evidence Matrix

Snapshot: 2026-09-03
Production Front-End: `303d8168abfbce84919bd7ccf71a69b91aa1639e`
Accepted UAT evidence baseline: `8157ffa`

This document is the final documentation/evidence boundary. It does not rerun
or downgrade the accepted UAT result (`237/237` applicable passed). `PARTIAL`
means that a documented subset is evidenced while another step remains open;
the terminal disposition column names the exact remaining dependency.

## Targeted Help Center production verification

GitHub Actions run `92` (`Deploy frontend to VPS`) completed successfully and
reported the exact deployed Front-End SHA:
`https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33728839680`.
The deployment pulled, built and health-checked revision
`303d8168abfbce84919bd7ccf71a69b91aa1639e`. The general `237/237` UAT was not
rerun.

The accepted Admin Help/content rows below carry forward the approved run `90`
baseline. Run `91` evidence covers the public smoke and the two public B04
reuse aliases; current run `92` evidence covers the B03/open public entry
binding. No approved Admin session was available for a new current-revision
Admin visual sign-off.

| Axis | Targeted result |
|---|---|
| Public Help content | `/help` loaded at Desktop `1440x900` and Mobile `390x844`; Buyer, Shop, Affiliate and QR entries were accessible; Admin entries were absent from categories, search, related/journey links and the legacy public Admin URL. |
| Admin Help content | Approved run `90` baseline: `/admin/help` loaded inside the Admin shell with the `Hướng dẫn` sidebar item, active state, 12 Admin article cards and working `Admin Dashboard` search. |
| Authorization | Approved run `90` baseline: Guest -> `/auth`; Buyer -> `/`; Seller -> `/`; Admin -> `/admin/help`. Direct A01 article navigation was allowed only for Admin. |
| Visual/marker evidence | The eleven raw/annotated Desktop/Mobile pairs were inspected or captured for the published bindings across both target viewports. All 22 selected assets are HTTP `200`, complete, readable and PII-safe; marker order and explanations match, including the B03/open entry-state mapping. |
| Responsive evidence | Public Help, Admin Help and accepted article renders fit the target viewports; no horizontal overflow or visual overlap was observed. |
| Browser diagnostics | No console messages were found on the inspected public and Admin Help pages. No production mutation, payment, payout or general UAT rerun was performed. |

A separate read-only Playwright smoke against deployed revision
`78646d724e93e18a15a5b729aa29c15530f1c494` passed 12/12 public Help/Journey
checks at Desktop `1440x900`. A targeted browser probe also verified the two
public B04 reuse aliases at Desktop `1440x900` and Mobile `390x844`: expected
assets returned `200`, rendered at the required dimensions, and exposed marker
numbers `1,2,3`. This confirms those two aliases as complete reuse evidence;
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

The current Front-End branch binds five additional Help steps to existing
accepted visual pairs and adds the B03/open public entry visual. The two public
B04 aliases are now production-verified; the three Admin aliases remain
pending an approved Admin session:

| Local binding | Accepted source binding | Safe basis | Production boundary |
|---|---|---|---|
| B04/discover | B02/search | Same public catalog/discovery state and marker meaning | Production verified at both target viewports |
| B04/product-detail | B02/detail | Same public product-detail state and marker meaning | Production verified at both target viewports |
| ADMIN-REVIEW/dashboard | A01/open | Same Admin role and Dashboard shell | Route/image smoke only with test role; approved Admin session pending |
| ADMIN-REVIEW/product-review | A05/pending | Same Admin product-review queue state | Route/image smoke only with test role; approved Admin session pending |
| ADMIN-OPERATIONS/dashboard | A01/open | Same Admin role and Dashboard shell | Route/image smoke only with test role; approved Admin session pending |

`npm run test:help` verifies the six added path/marker bindings and existing
served asset pairs locally. The two B04 aliases and B03/open reduce the broader
missing runnable visual count from 70 to 67; the Admin aliases do not count
until approved session evidence exists. The B03 positive code/result state
remains fixture-gated.

## Evidence-axis status

| Journey | Role | SOURCE | RUNTIME | DESKTOP_VISUAL | MOBILE_VISUAL | ANNOTATED_VISUAL | GUIDE_CONTENT | JOURNEY_CENTER | Missing / terminal disposition |
|---|---|---|---|---|---|---|---|---|---|
| B01 Account and first use | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Positive registration, OTP/Google bridge and profile/address mutation: `BLOCKED_PROVIDER_SANDBOX` plus disposable account fixture |
| B02 Search and discovery | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Review/sort/provenance and authenticated action target: `BLOCKED_FIXTURE` |
| B03 QR verification | Buyer/QR | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | B03/open public entry visual complete; known positive label/result and final feature capture: `BLOCKED_FIXTURE` |
| B04 Complete purchase | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Discover and product-detail visuals complete via verified B02 reuse; cart/order fixture: `BLOCKED_FIXTURE`; GHN/PayOS checkout completion: `BLOCKED_PROVIDER_SANDBOX` |
| B05 Order management | Buyer | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | PII-safe owned order and receive/review/dispute state: `BLOCKED_FIXTURE` |
| B06 Voucher | Buyer | SOURCE_VERIFIED | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Active eligible voucher and matching offer/order: `BLOCKED_FIXTURE` |
| B07 Chat with Shop | Buyer/Seller | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | Synthetic two-session thread: `BLOCKED_FIXTURE`; realtime delivery/reconnect: `BLOCKED_PROVIDER_SANDBOX` |
| B08 Community | Buyer/Guest | SOURCE_VERIFIED | PARTIAL | BLOCKED_FIXTURE | BLOCKED_FIXTURE | BLOCKED_FIXTURE | PARTIAL | PARTIAL | PII-safe public author/post fixture: `BLOCKED_FIXTURE` |
| B09 Livestream | Buyer | SOURCE_VERIFIED | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Authenticated join/media/interactions: `BLOCKED_PROVIDER_SANDBOX` (Agora) plus live fixture |
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
- `UNSAFE_PRODUCTION`: the action must not be performed on current production.
- `NOT_IMPLEMENTED` and `NOT_APPLICABLE` are product/current-UAT boundaries,
  not credential blockers.

## Help Center quality remediation - 2026-09-03

The canonical step-level report is
`docs/user-guide/HELP_CENTER_QUALITY_AUDIT.md`. The implementation was
validated against the current Front-End source, local rendered routes and the
deployed B03/open binding in run `92`; historical production evidence remains
labelled separately.

| Evidence axis | Local result | Remaining boundary |
|---|---|---|
| Runtime/text completeness | 30 articles and 88 steps are registered; every article and step has user-facing title/description text | Full feature-flow UAT remains `PARTIAL` where the product fixture or provider is unavailable |
| Visual completeness | 13 production-accepted step bindings with 22 served assets, including 2 B04 steps verified through accepted B02 reuse and the B03/open public entry state; 3 additional Admin aliases remain local | 67 runnable steps still need a safe screenshot; 8 Admin steps are `NOT_IMPLEMENTED` because their frontend route is absent; the 3 Admin aliases need approved-session verification |
| Marker correctness | All 16 local visual bindings declare marker metadata and written guidance; automated sequence checks pass | Automated checks do not replace the pending approved-session visual review of the 3 Admin aliases |
| Role visibility | Public registry/search excludes `admin`; Admin registry is rendered only in Admin Help | Production public bundle and deployed route require post-deploy verification |
| Authorization | `/admin/help/*` is under the existing Admin parent `ProtectedRoute roles=["admin"]`; local browser checks pass for guest, buyer, seller and admin | Live authorization regression is pending deployment |
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
  current-production positive label is not validated. Only an explicitly
  provisioned matching active record can satisfy it.
- Can Codex create it safely: not on current production; only in an approved
  isolated UAT database with fixture approval.
- Cleanup required: remove the disposable label, batch link and provenance, or
  discard the isolated UAT database.
- Journeys unlocked: B03 positive verification.
- Screenshots unlocked: B03 Desktop and Mobile raw plus annotated feature pair.

### `ORDER_DETAIL_PII_SAFE_UAT`

- Purpose: B05 Buyer order list/detail, tracking and historical-result guide
  evidence without exposing a real recipient.
- Required role: Buyer `ACTIVE_BUYER_UAT` (`seed.user01@antifake.local`) and
  Seller `ACTIVE_SELLER_UAT` (`seed.user02@antifake.local`).
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
  buyer/seller relationships, but the current production detail exposes
  recipient fields, so it is not an approved final visual target.
- Can Codex create it safely: not in current production; use a sanctioned
  sanitized UAT database or owner-provided read-only record.
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
  and cancelled records prove source shape, but no current-production
  transition is approved for documentation.
- Can Codex create it safely: only after explicit isolated-fixture approval.
- Cleanup required: delete the isolated order and dependent payment/escrow/
  allocation records or reset the UAT database.
- Journeys unlocked: S05 transitions and Admin read-only status presentation.
- Screenshots unlocked: S05 Desktop/Mobile transition states.

### `CHAT_SYNTHETIC_TWO_SESSION_UAT`

- Purpose: B07 PII-safe history, send/receive and reconnect evidence.
- Required role: Buyer `seed.user01@antifake.local` paired with Seller
  `seed.user02@antifake.local`; Seller owns the selected verified Shop.
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
- Can Codex create it safely: not in current production without explicit
  isolated mutation approval; the API supports POST thread and message paths.
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
- Can Codex create it safely: not on current production; create only in an
  isolated approved UAT fixture.
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
- Can Codex create it safely: only with an approved isolated Shop/data target;
  never mutate the existing business-critical seeded records on production.
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
  full isolated attribution lifecycle is not approved on current production.
- Can Codex create it safely: only in isolated UAT with explicit approval.
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
- Can Codex create it safely: only in approved UAT with synthetic media.
- Cleanup required: delete submission, document and media records.
- Journeys unlocked: S01 KYC portion; not A03, whose Admin UI is absent.
- Screenshots unlocked: S01 Desktop/Mobile upload/status states.

### `ADMIN_PIISAFE_READ_SET`

- Purpose: A02/A04/A08 read-only list/detail/status evidence.
- Required role: existing `ACTIVE_ADMIN_UAT` (`admin@antifake.io.vn`); no new
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
  prohibited on current production.
- Can existing seed/demo data satisfy it: seeded moderation/shop/withdrawal
  records exist and Admin read-only routes pass, but current records are not an
  approved final PII-safe list/detail target.
- Can Codex create it safely: only in an isolated UAT dataset; never alter
  production roles or financial state.
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
| VietQR / payout provider | S08/A08 payout account verification | Resolve a synthetic bank account and complete sandbox payout path | Provider sandbox URL/client values, synthetic account, and `PAYOUT_ACCOUNT_ENCRYPTION_KEY` in UAT secret storage | `PROVIDER_MUTATION`; current-production withdrawal is `PROHIBITED_PRODUCTION_MUTATION` | Yes. Wallet/ledger and masked payout read-only views are already evidenced |

## Mutation boundary

| Tier | Remaining examples | Boundary |
|---|---|---|
| `SAFE_UAT_MUTATION` | No remaining production action; the B04 cart badge mutation is already complete and restored | Disposable isolated UAT data only; record baseline and verify cleanup |
| `CONTROLLED_UAT_MUTATION` | Synthetic QR/business fixture creation, isolated order transitions, chat messages, community post, vouchers and affiliate ledger | Requires a named fixture, explicit approval and cleanup; never a real user/order |
| `PROVIDER_MUTATION` | PayOS/GHN sandbox, Agora, upload/storage, Firebase/FCM, payout/VietQR | Provider sandbox only; secrets stay outside docs and source |
| `PROHIBITED_PRODUCTION_MUTATION` | Real payment/refund/settlement, withdrawal, wallet adjustment, destructive Admin action, production role change | Must not execute on current production `13c18f4`/`8157ffa` |

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
