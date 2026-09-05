# Visual Fixture Manifest

Reconciled: 2026-09-04

This is the canonical logical-fixture inventory for the owner-approved current
UAT/demo deployment. It records implementation and safety boundaries; it does not
approve Help screenshots or close/reset `ANTIFAKE VISUAL COVERAGE COMPLETION.md`.
Credentials, tokens, QR plaintext, connection strings and personal identity
data intentionally do not appear.

Current classification is owner-confirmed: `LEGACY_DEMO_DATA` is preserved and
reported but is not owned by fixture tooling; only deterministic
`DOCS_UAT_MANAGED` rows may be changed or cleaned up. The current runtime is
`UAT_DEMO` at `https://antifake.io.vn` with API
`https://api.antifake.io.vn`; separate UAT provisioning is not required.
Destructive reset remains disabled.

| FIXTURE_ID | ROLE | JOURNEYS_UNLOCKED | ENTITY_GRAPH | SOURCE | CREATION_METHOD | RESET_METHOD | MUTATION_SCOPE | PROVIDER_DEPENDENCY | PII_STATUS | RETENTION_POLICY | STATUS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `B02_EXISTING_PUBLIC_VISUALS` | buyer/public | B04 discover, B04 product detail | Accepted public catalog/product visual pairs | Existing accepted `Front-End/public/journey-visuals` assets | Existing accepted assets | None | Read-only | None | Existing evidence classification; no new PII | Immutable accepted assets | REUSE_VERIFIED_PRODUCTION |
| `ACTIVE_BUYER_UAT` | buyer | B01, B04, B05, B06, B07, B09 applicable states | `BUYER_UAT` -> profile/address -> cart -> voucher -> orders -> chat/community | `back-end/scripts/uat/ensure-demo-fixtures.ts`, approved seed accounts | Guarded additive `npm run uat:ensure` | Rerun additive ensure; reviewed `npm run uat:cleanup` removes only reserved rows | Read-only capture by default; address/cart/message mutations only in approved UAT/demo | Firebase bridge only if configured; no payment/shipment completion | Synthetic fixture rows; approved account fields are not overwritten | Stable `DOCS_UAT` retention; cleanup by reviewed namespace operation | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |
| `ACTIVE_SELLER_UAT` | seller | S01-S09 applicable states, B07 | `SELLER_UAT` -> approved Shop -> product/variant/inventory -> voucher/order/wallet | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Guarded additive `npm run uat:ensure` | Rerun additive ensure; no uncontrolled reset | Read-only capture plus controlled business-object transitions | Cloudinary/GHN/Agora only for separately approved provider checks | Synthetic business graph and placeholder media | Stable `DOCS_UAT` retention; provider uploads require separate cleanup | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |
| `QR_POSITIVE_LABEL_UAT` | public/qr | B03 | active label -> batch -> approved offer link -> VERIFIED provenance event | `back-end/scripts/uat/ensure-demo-fixtures.ts`, `libs/catalog-metadata`, verification controller | Injected UAT code hashed during additive ensure | Rerun ensure; plaintext code is never stored | Verification GET is read-only | None for database-backed verification | No plaintext QR or real identity | Stable namespaced row; rotate only with reviewed UAT code change | VERIFIED_UAT_DESKTOP_MOBILE |
| `ORDER_DETAIL_PII_SAFE_UAT` | buyer/seller | B04, B05, read-only S05/A01 | synthetic buyer -> order -> shop group/item -> payment/escrow/tracking projection | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert with fixed fixture IDs | Rerun additive ensure | Read-only list/detail; no receive/review/dispute by default | None for read-only state | Synthetic recipient/address/phone only | Stable namespaced rows | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |
| `ORDER_FULFILLMENT_CONTROLLED_UAT` | buyer/seller | S05 and seller processing views | same order graph with valid `pending`, `paid`, `shipping`, `completed` states | `back-end/scripts/uat/ensure-demo-fixtures.ts`, order state machine | Additive upsert with explicit lifecycle fixtures | Rerun ensure or complete only a reviewed disposable transition | Controlled mutation in UAT/demo only | GHN only for sandbox quote/booking boundary | Synthetic order data only | Stable namespaced rows; no real shipment | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |
| `SELLER_DISPOSABLE_BUSINESS_UAT` | seller | S01-S06, S09, B04/B06 | `SELLER_UAT` -> Shop -> product/variant/inventory/media/voucher/order | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Guarded additive ensure with shared graph | Rerun ensure; no manual row editing | Read-only capture plus explicit seller controls | Cloudinary only with UAT folder/prefix; no provider claim from seeded URLs | Synthetic names, tax/stock/media values | Stable `DOCS_UAT` retention; clean provider uploads if enabled | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |
| `KYC_SYNTHETIC_DOCUMENT_UAT` | seller/admin | S01, Admin KYC read view | synthetic review user -> KYC -> submission -> FRONT/BACK placeholder media | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert with placeholder documents | Rerun ensure; no real KYC submission | Read-only review; no external KYC submission | Firebase/Cloudinary/provider sandbox only if separately approved | No government ID or real person data | Stable namespaced rows; no public exposure | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |
| `CHAT_SYNTHETIC_TWO_SESSION_UAT` | buyer/seller | B07 | buyer + seller + Shop -> ChatThread -> text-safe history | `back-end/scripts/uat/ensure-demo-fixtures.ts`, chat realtime service | Additive upsert; runtime send is optional controlled UAT mutation | Rerun ensure; delete only namespaced messages if reviewed | History is seeded; send/receive/reconnect require browser/runtime proof | Socket.IO in-process or isolated Redis; no personal cookies | Synthetic participants and messages only | Stable namespaced rows | HISTORY_READY_REALTIME_UNVERIFIED |
| `COMMUNITY_PUBLIC_SAFE_UAT` | public/buyer | B08 | synthetic DOCS_UAT author -> public SocialPost feed -> safe media/comments/reactions | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert | Rerun ensure; remove only namespaced rows after capture | Read-only; reaction/comment controls require auth; no current report surface | Storage only for placeholder media | Synthetic author/content aliases | Stable namespaced rows; provider media cleanup documented separately | VERIFIED_UAT_PUBLIC_FEED_DESKTOP_MOBILE; REPORT_NOT_IMPLEMENTED |
| `LIVE_SCHEDULED_SHELL_UAT` | buyer/public | B09 watch shell | `DOCS_UAT` Shop -> scheduled LiveSession -> pinned Offer/Voucher -> synthetic public comment | `back-end/scripts/uat/ensure-demo-fixtures.ts`, current LiveSession schema | Guarded additive upsert with explicit future `SCHEDULED` state | Rerun ensure; reviewed cleanup removes only reserved live rows | Read-only shell capture; reminder, purchase and chat-send actions not run | Agora/media join is not configured or called; no payment/shipment | Synthetic title, description, cover URL and comment only | Stable namespaced rows; retain as demo shell or remove through reviewed cleanup | VERIFIED_UAT_DESKTOP_MOBILE_SHELL; AGORA_MEDIA_PENDING |
| `AFFILIATE_CONVERSION_UAT` | affiliate/seller | S07 program/link/conversion/commission history | affiliate account on approved Buyer alias -> program -> code/link -> conversion -> commission ledger | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert; manual non-payable ledger | Rerun ensure; no payout reset/execution | Non-payable read-only ledger; no payout execution | Payout provider only for boundary/status | Synthetic attribution and ledger values | Stable namespaced rows; no financial liability | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |
| `ADMIN_PIISAFE_READ_SET` | admin | A01, A02, A04, A05, A08, A09 implemented queues/overview | `ADMIN_UAT` -> synthetic users/KYC/Shop/product/voucher/wallet/moderation queues | `back-end/scripts/uat/ensure-demo-fixtures.ts`, implemented Admin services | Guarded additive ensure | Rerun ensure; no current-demo reset | Read-only review by default | Payout/provider status only; no financial action | Alias-only synthetic data and placeholder KYC docs | Stable namespaced rows | GRAPH_VERIFIED_UAT; AUTH_CAPTURE_PENDING |

## DOCS_UAT deterministic fixture identifiers

The identifiers below are reserved by
`back-end/scripts/uat/demo-fixture-contract.ts` and are safe to record in
documentation. Approved Buyer/Seller/Admin account IDs are resolved from the
owner-approved aliases at runtime and are never overwritten. QR plaintext is
injected privately; only the managed label ID is recorded here.

| Logical fixture | Deterministic identifier |
|---|---|
| `SHOP_UAT` | `d0000000-0000-4000-8000-000000000010` |
| `PRODUCT_UAT` | `d0000000-0000-4000-8000-000000000020` |
| `VARIANT_UAT` | `d0000000-0000-4000-8000-000000000026` |
| `VOUCHER_UAT` | `d0000000-0000-4000-8000-000000000042` |
| `QR_POSITIVE_LABEL_UAT` batch | `d0000000-0000-4000-8000-000000000030` |
| `QR_POSITIVE_LABEL_UAT` label | `d0000000-0000-4000-8000-000000000032` |
| `CHAT_UAT` thread | `d0000000-0000-4000-8000-000000000050` |
| `COMMUNITY_UAT` primary post | `d0000000-0000-4000-8000-000000000060` |
| `COMMUNITY_UAT` secondary post | `d0c50000-0000-4000-8000-000000000002` |
| `AFFILIATE_UAT` program | `d0000000-0000-4000-8000-000000000070` |
| `WALLET_LEDGER_UAT` shop wallet | `d0000000-0000-4000-8000-000000000080` |
| `ADMIN_REVIEW_UAT` synthetic review user | `d0000000-0000-4000-8000-000000000001` |
| `ADMIN_REVIEW_UAT` pending Shop | `d0000000-0000-4000-8000-000000000090` |
| `ADMIN_REVIEW_UAT` pending Offer | `d0000000-0000-4000-8000-000000000093` |
| `ORDER_UAT_PENDING` | `d0000000-0000-4000-8000-000000000100` |
| `ORDER_UAT_CONFIRMED` | `d0000000-0000-4000-8000-000000000101` |
| `ORDER_UAT_SHIPPING` | `d0000000-0000-4000-8000-000000000102` |
| `ORDER_UAT_COMPLETED` | `d0000000-0000-4000-8000-000000000103` |
| `LIVE_SCHEDULED_SHELL_UAT` | `d0000000-0000-4000-8000-000000000055` |

## Runtime verification gate

The owner has classified `https://antifake.io.vn` and
`https://api.antifake.io.vn` as the approved current `UAT_DEMO` runtime.
Separate UAT provisioning is not required. The guarded additive
`uat:ensure` ran and was rerun with stable IDs, including the post-deploy
variant-mapping repair; `uat:verify-demo` passed the complete logical graph,
and `uat:audit-demo` reported `LEGACY_DEMO_DATA_PRESENT`,
`DOCS_UAT_FIXTURES_VALID`, `UNCLASSIFIED_NEW_DATA=NO` and provider actions
denied by policy. The isolated QR browser smoke passed at both required
viewports, so `QR_POSITIVE_LABEL_UAT` is now capturable and its B03 result
visual is complete. The public scheduled-live shell also passed at both target
viewports with raw/annotated capture pairs; it proves the non-provider room
shell only, while Agora media lifecycle remains blocked. Provider-dependent
rows remain independently blocked.

The audit still reports the pre-existing unmarked/external-domain rows, but the
owner decision classifies them as immutable `LEGACY_DEMO_DATA`; they do not
block additive `DOCS_UAT_MANAGED` creation. No legacy row was renamed, updated
or deleted, and no reset or provider call was run. Backend revision
`70f9bb5028ae18d8e772c59dc2e06a093b92ce6d` is deployed and health-checked.
A public read-only product probe selected the managed variant and showed 25
available units with enabled action buttons; no cart mutation was submitted.
Re-run the sanitized
`npm run uat:audit-demo` check after any environment change.

The dedicated capture command is
`npm run test:e2e:uat:visual`. It emits raw and temporary annotated Desktop /
Mobile pairs under `.uat-runtime/test-results`; those files require an
explicit privacy and marker review before being copied into `docs/images/` or
bound in the Journey Center. The capture workflow is available through manual
`workflow_dispatch` or the dedicated `uat-capture` branch; it does not deploy
or mutate application code/data. All fixture writes are additive and guarded
by the `DOCS_UAT` policy.

Approved account aliases for the current demo are `BUYER_UAT`, `SELLER_UAT` and
`ADMIN_UAT`. Authentication inputs, passwords, tokens and QR plaintext are
injected only at runtime and are never recorded in this manifest.

The step-level handoff and current honest before/after calculation are in
[`../handoffs/uat-visual-unlock-matrix.md`](../handoffs/uat-visual-unlock-matrix.md).

## Authenticated capture contract — 2026-09-05

Authenticated capture is now wired to the role-scoped runtime contract
`ANTIFAKE_UAT_BUYER_*`, `ANTIFAKE_UAT_SELLER_*` and `ANTIFAKE_UAT_ADMIN_*`.
The harness performs a real login, verifies the server role and expected route,
then creates a fresh temporary Playwright storage state. State files are
ignored, excluded from capture uploads and deleted after the role context
closes; no credential value belongs in this manifest.

```text
FIXTURE_GRAPH_STATUS=DOCS_UAT_FIXTURES_VALID
BUYER_CREDENTIAL_AVAILABLE=false
SELLER_CREDENTIAL_AVAILABLE=false
ADMIN_CREDENTIAL_AVAILABLE=false
AUTHENTICATED_CAPTURE_STATUS=RUNTIME_INPUTS_UNAVAILABLE_TO_CURRENT_SHELL
NEW_VISUALS_ACCEPTED=0
```

The availability booleans are the sanitized result from the current capture
process. No legacy data was changed and no provider side effect was attempted.
The existing B03 result, B08 feed and scheduled-live shell evidence remain the
accepted/reviewed UAT evidence recorded above; authenticated fixture rows stay
pending until a capture process inherits the approved role inputs.

The post-push capture run `33941303277` completed successfully at Front-End
SHA `79313d79ab8edbfc1cdc9fc7118e7bce5d0dd7df`. It passed four public fixture
pairs and skipped eight authenticated/QR cases because all three role-input
availability checks were false. No new authenticated visual was accepted.

The helper correction `8c5d027ba4e82ad0e4947e787c2b7672f9c3c884` now passes
the configured UAT base URL into each real-login and storage-state context. It
was deployed and exercised by capture run `33941840279`; the sanitized role
inputs were still unavailable, so four public pairs passed, eight
authenticated/QR cases were skipped and the fixture manifest has no new
accepted visual rows.

## Authenticated capture checkpoint - 2026-09-05 (current)

The owner-provided local `.env` is bridged only into the Front-End capture
process through `scripts/run-uat-visual-capture.mjs`. The runner allowlists the
six role-scoped authentication variables, never prints their values, and does
not merge database or provider variables into the child process. CI continues
to use repository secret injection.

```text
ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO
FIXTURE_GRAPH_STATUS=DOCS_UAT_FIXTURES_VALID
BUYER_CREDENTIAL_AVAILABLE=true
SELLER_CREDENTIAL_AVAILABLE=true
ADMIN_CREDENTIAL_AVAILABLE=true
BUYER_LOGIN=PASS
SELLER_LOGIN=HTTP_401_ROLE_INPUT_BLOCKED
ADMIN_LOGIN=PASS
AUTHENTICATED_CAPTURE_STATUS=PARTIAL
NEW_VISUALS_ACCEPTED=5
LEGACY_ENTITIES_MODIFIED=0
LEGACY_ENTITIES_DELETED=0
DESTRUCTIVE_RESET=DISABLED
PROVIDER_SIDE_EFFECTS=NONE
```

The local read-only audit reconfirmed the owner-approved UAT/demo boundary and
the legacy-data policy. It verified ownership signals for the additive graph;
the positive QR value was not locally rechecked because no `UAT_QR_CODE` input
was supplied to that process. The previously deployed fixture verification
remains the QR source of truth. The Seller credential pair is available as
input but its login returns HTTP 401, so no Seller entity was mutated.

The current accepted authenticated evidence is:

| Fixture ID | Role | Journeys unlocked | Runtime state | Evidence |
|---|---|---|---|---|
| `ORDER_DETAIL_PII_SAFE_UAT` | Buyer | B05/list, B05/detail | Real Buyer login; `/profile/orders` and detail render synthetic order graph | Desktop/Mobile raw and annotated pairs accepted |
| `CHAT_SYNTHETIC_TWO_SESSION_UAT` | Buyer | B07/open | Real Buyer login; `/chat` renders seeded synthetic history | Desktop/Mobile raw and annotated pairs accepted; realtime send/reconnect not claimed |
| `ADMIN_PIISAFE_READ_SET` | Admin | A02/search, A02/detail | Real Admin login; filtered `DOCS_UAT` queue and synthetic user detail render | Desktop/Mobile raw and annotated pairs accepted |

All accepted files contain only namespaced synthetic data. No legacy record was
changed, deleted or renamed, and no payment, payout, shipment, KYC or other
irreversible provider action was attempted. The five accepted visual bindings
are recorded in `VISUAL_MANIFEST.md`; the wider visual goal remains open.

## Authenticated reuse expansion - 2026-09-05 (current)

The existing managed fixtures now unlock four additional step-level bindings:

| FIXTURE_ID | ROLE | JOURNEYS_UNLOCKED | ENTITY_GRAPH | SOURCE | CREATION_METHOD | RESET_METHOD | MUTATION_SCOPE | PROVIDER_DEPENDENCY | PII_STATUS | RETENTION_POLICY | STATUS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `ORDER_DETAIL_PII_SAFE_UAT` | Buyer | B04/order | Synthetic completed order reused from B05/detail | Existing guarded `DOCS_UAT` graph | Additive/idempotent seed (no new write this capture) | Existing managed fixture reseed | No legacy mutation | None for read-only view | Synthetic only | Retain namespaced demo state | VERIFIED_REUSE |
| `ADMIN_PIISAFE_READ_SET` | Admin | ADMIN-REVIEW/dashboard, ADMIN-REVIEW/product-review, ADMIN-OPERATIONS/dashboard | Synthetic Admin dashboard and review queue | Existing guarded `DOCS_UAT` graph plus real Admin capture | Additive/idempotent seed (no new write this capture) | Existing managed fixture reseed | No legacy mutation | None for read-only view | Synthetic only | Retain namespaced demo state | VERIFIED_REUSE |

The four bindings have raw and annotated Desktop/Mobile evidence. No fixture,
legacy record or provider state was modified by the capture expansion.

```text
CURRENT_COMPLETE_VISUAL_STEPS=26
CURRENT_REQUIRED_VISUAL_STEPS=79
CURRENT_REMAINING_VISUAL_STEPS=53
FIXTURE_BLOCKED_AFTER=48
PROVIDER_BLOCKED_AFTER=5
VISUAL_GOAL_REMAINS_OPEN=YES
```
