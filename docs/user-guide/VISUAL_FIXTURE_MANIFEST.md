# Visual Fixture Manifest

Reconciled: 2026-09-04

This is the canonical logical-fixture inventory for the owner-approved current
UAT/demo deployment. It records implementation and safety boundaries; it does not
approve Help screenshots or close/reset `ANTIFAKE VISUAL COVERAGE COMPLETION.md`.
Credentials, tokens, QR plaintext, connection strings and personal identity
data intentionally do not appear.

| FIXTURE_ID | ROLE | JOURNEYS_UNLOCKED | ENTITY_GRAPH | SOURCE | CREATION_METHOD | RESET_METHOD | MUTATION_SCOPE | PROVIDER_DEPENDENCY | PII_STATUS | RETENTION_POLICY | STATUS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `B02_EXISTING_PUBLIC_VISUALS` | buyer/public | B04 discover, B04 product detail | Accepted public catalog/product visual pairs | Existing accepted `Front-End/public/journey-visuals` assets | Existing accepted assets | None | Read-only | None | Existing evidence classification; no new PII | Immutable accepted assets | REUSE_VERIFIED_PRODUCTION |
| `ACTIVE_BUYER_UAT` | buyer | B01, B04, B05, B06, B07, B09 applicable states | `BUYER_UAT` -> profile/address -> cart -> voucher -> orders -> chat/community | `back-end/scripts/uat/ensure-demo-fixtures.ts`, approved seed accounts | Guarded additive `npm run uat:ensure` | Rerun additive ensure; reviewed `npm run uat:cleanup` removes only reserved rows | Read-only capture by default; address/cart/message mutations only in approved UAT/demo | Firebase bridge only if configured; no payment/shipment completion | Synthetic fixture rows; approved account fields are not overwritten | Stable `DOCS_UAT` retention; cleanup by reviewed namespace operation | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `ACTIVE_SELLER_UAT` | seller | S01-S09 applicable states, B07 | `SELLER_UAT` -> approved Shop -> product/variant/inventory -> voucher/order/wallet | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Guarded additive `npm run uat:ensure` | Rerun additive ensure; no uncontrolled reset | Read-only capture plus controlled business-object transitions | Cloudinary/GHN/Agora only for separately approved provider checks | Synthetic business graph and placeholder media | Stable `DOCS_UAT` retention; provider uploads require separate cleanup | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `QR_POSITIVE_LABEL_UAT` | public/qr | B03 | active label -> batch -> approved offer link -> VERIFIED provenance event | `back-end/scripts/uat/ensure-demo-fixtures.ts`, `libs/catalog-metadata`, verification controller | Injected UAT code hashed during additive ensure | Rerun ensure; plaintext code is never stored | Verification GET is read-only | None for database-backed verification | No plaintext QR or real identity | Stable namespaced row; rotate only with reviewed UAT code change | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `ORDER_DETAIL_PII_SAFE_UAT` | buyer/seller | B04, B05, read-only S05/A01 | synthetic buyer -> order -> shop group/item -> payment/escrow/tracking projection | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert with fixed fixture IDs | Rerun additive ensure | Read-only list/detail; no receive/review/dispute by default | None for read-only state | Synthetic recipient/address/phone only | Stable namespaced rows | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `ORDER_FULFILLMENT_CONTROLLED_UAT` | buyer/seller | S05 and seller processing views | same order graph with valid `pending`, `paid`, `shipping`, `completed` states | `back-end/scripts/uat/ensure-demo-fixtures.ts`, order state machine | Additive upsert with explicit lifecycle fixtures | Rerun ensure or complete only a reviewed disposable transition | Controlled mutation in UAT/demo only | GHN only for sandbox quote/booking boundary | Synthetic order data only | Stable namespaced rows; no real shipment | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `SELLER_DISPOSABLE_BUSINESS_UAT` | seller | S01-S06, S09, B04/B06 | `SELLER_UAT` -> Shop -> product/variant/inventory/media/voucher/order | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Guarded additive ensure with shared graph | Rerun ensure; no manual row editing | Read-only capture plus explicit seller controls | Cloudinary only with UAT folder/prefix; no provider claim from seeded URLs | Synthetic names, tax/stock/media values | Stable `DOCS_UAT` retention; clean provider uploads if enabled | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `KYC_SYNTHETIC_DOCUMENT_UAT` | seller/admin | S01, Admin KYC read view | synthetic review user -> KYC -> submission -> FRONT/BACK placeholder media | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert with placeholder documents | Rerun ensure; no real KYC submission | Read-only review; no external KYC submission | Firebase/Cloudinary/provider sandbox only if separately approved | No government ID or real person data | Stable namespaced rows; no public exposure | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `CHAT_SYNTHETIC_TWO_SESSION_UAT` | buyer/seller | B07 | buyer + seller + Shop -> ChatThread -> text-safe history | `back-end/scripts/uat/ensure-demo-fixtures.ts`, chat realtime service | Additive upsert; runtime send is optional controlled UAT mutation | Rerun ensure; delete only namespaced messages if reviewed | History is seeded; send/receive/reconnect require browser/runtime proof | Socket.IO in-process or isolated Redis; no personal cookies | Synthetic participants and messages only | Stable namespaced rows | HISTORY_READY_REALTIME_UNVERIFIED |
| `COMMUNITY_PUBLIC_SAFE_UAT` | public/buyer | B08 | synthetic Shop author -> public SocialPost -> safe media/comments/reactions | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert | Rerun ensure; remove only namespaced rows after capture | Read-only; reaction/comment/report form only in UAT/demo | Storage only for placeholder media | Synthetic author/content aliases | Stable namespaced rows; provider media cleanup documented separately | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `AFFILIATE_CONVERSION_UAT` | affiliate/seller | S07 program/link/conversion/commission history | affiliate account on approved Buyer alias -> program -> code/link -> conversion -> commission ledger | `back-end/scripts/uat/ensure-demo-fixtures.ts` | Additive upsert; manual non-payable ledger | Rerun ensure; no payout reset/execution | Non-payable read-only ledger; no payout execution | Payout provider only for boundary/status | Synthetic attribution and ledger values | Stable namespaced rows; no financial liability | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |
| `ADMIN_PIISAFE_READ_SET` | admin | A01, A02, A04, A05, A08, A09 implemented queues/overview | `ADMIN_UAT` -> synthetic users/KYC/Shop/product/voucher/wallet/moderation queues | `back-end/scripts/uat/ensure-demo-fixtures.ts`, implemented Admin services | Guarded additive ensure | Rerun ensure; no current-demo reset | Read-only review by default | Payout/provider status only; no financial action | Alias-only synthetic data and placeholder KYC docs | Stable namespaced rows | IMPLEMENTED_WAITING_FOR_RUNTIME_VERIFICATION |

## Runtime verification gate

The owner has classified `https://antifake.io.vn` and
`https://api.antifake.io.vn` as the approved current `UAT_DEMO` runtime.
Separate UAT provisioning is not required. No fixture is `NOW_CAPTURABLE`
until the guarded additive `uat:ensure`, read-only `uat:verify-demo` and
dedicated isolated-browser smoke pass at both required viewports. Provider-
dependent rows remain independently blocked.

Current safety hold: a read-only audit of the configured demo database found
five user accounts under an external `gmail.com` domain and six shop names
without synthetic/seed/demo markers. This is a possible mixed-data signal under
the owner's safety boundary. No fixture write, reset, cleanup or provider call
was run, so the rows below remain implementation inventory rather than runtime
evidence. Resume only after owner confirmation that the current database is
synthetic or after a reviewed disposable database target is supplied.

The dedicated capture command is
`npm run test:e2e:uat:visual`. It emits raw and temporary annotated Desktop /
Mobile pairs under `.uat-runtime/test-results`; those files require an
explicit privacy and marker review before being copied into `docs/images/` or
bound in the Journey Center. The capture workflow is manual-only and does not
deploy or mutate production code/data.

Approved account aliases for the current demo are `BUYER_UAT` (`seed.user01@antifake.local`),
`SELLER_UAT` (`seed.user02@antifake.local`) and `ADMIN_UAT`
(`admin@antifake.io.vn`). Passwords, tokens and QR plaintext are injected only.

The step-level handoff and current honest before/after calculation are in
[`../handoffs/uat-visual-unlock-matrix.md`](../handoffs/uat-visual-unlock-matrix.md).
