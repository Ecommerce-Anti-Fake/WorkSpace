# Documentation Registry

The frontend registry at
`Front-End/src/data/helpCenter.ts` is the current content index for the Help
Center and Journey Center. It intentionally keeps metadata close to the
rendering contract while this workstream is static.

The companion source/evidence traceability audit is
[`SOURCE_AUDIT.md`](SOURCE_AUDIT.md). It is the required source-side review
before adding or upgrading guide claims.

The final per-journey evidence axes, minimum fixture definitions, provider
sandbox matrix and mutation boundary are maintained in
[`DOCUMENTATION_EVIDENCE_MATRIX.md`](DOCUMENTATION_EVIDENCE_MATRIX.md). It is
the authoritative closeout boundary for documentation work and does not
replace the UAT artifacts.

Current status: `DOCUMENTATION_STATUS = COMPLETE_WITH_TERMINAL_CLASSIFICATIONS`.
The 28 feature rows retain their truthful `PARTIAL`, `SOURCE_VERIFIED` and
`NOT_IMPLEMENTED` scopes; every unverified step has an exact terminal
fixture/provider/unsafe disposition in the final evidence matrix. Production
UAT status is tracked independently in the canonical UAT artifacts; neither
status is upgraded by source-only checks.

`docs/HUONG_DAN_SU_DUNG_ANTIFAKE.md` is retained as a historical UAT draft.
It is not a second canonical guide and must not be used to infer production
verification; the master guide below is the canonical user-facing source.

The evidence-scoped ebook draft is
[`ANTIFAKE_USER_GUIDE_EBOOK.md`](ANTIFAKE_USER_GUIDE_EBOOK.md). It consumes the
same registry and UAT evidence and remains `IN_PROGRESS` until the listed
runtime, visual and credential blockers are cleared or explicitly classified.

For accepted public evidence, `HelpStep.visual` maps each supported step to a
Desktop and Mobile annotated copy served from
`Front-End/public/journey-visuals/`. The Journey Center keeps the visual-pending
placeholder for every step without that mapping; this runtime behavior does not
upgrade the article status.

Each article URL is a journey overview with an ordered step list and an
explicit start link. Step URLs remain deep-linkable and retain the selected
Desktop/Mobile presentation; overview navigation does not imply that any
pending step has been runtime-verified. The B04 overview/start-step behavior
was retested on production revision `13c18f4` at Desktop `1440×900` and Mobile
`390×844`; the remaining step-level evidence is still tracked separately.

The canonical master guide and evidence-scoped ebook reuse the corresponding
annotated pairs from `docs/images/` beside accepted B01, B02, B04, B09, S07,
A01, A05 and A09 evidence. Pending or UAT-only assets remain excluded from
final feature claims.

Each entry contains:

| Field | Purpose |
|---|---|
| `slug` | Stable journey identifier used by deep links. |
| `role` | Buyer, seller, admin or QR audience. |
| `journey` | Internal journey ID used by the UAT bridge. |
| `feature` | Product area covered by the article. |
| `keywords` | Search terms for Help Center discovery. |
| `status` | Evidence status: `VERIFIED`, `SOURCE_VERIFIED`, `PARTIAL`, `UNVERIFIED` or `NOT_IMPLEMENTED`. |
| `sourceRefs` | Inspected source and UAT references supporting the article. |
| `steps` | Ordered step slugs and user-facing descriptions. |

Rules:

1. Add an entry only after inspecting frontend, backend, schema/state and
   permission boundaries relevant to the flow.
2. Do not set `VERIFIED` from a component or route alone.
3. Do not put credentials, tokens, secrets, PII or payment data in metadata.
4. Keep guide prose user-facing; keep technical evidence in the matrix, UAT
   artifacts and source references.
5. When a route or API changes, update its article and visual manifest status in
   the same change or record an explicit documentation gap.

## Current article inventory

The frontend article registry is `Front-End/src/data/helpCenter.ts`. The table
below is the traceability snapshot for the current local source revision; it is
not a production sign-off.

| Role | Journey slug | Article route | Status | Visual status |
|---|---|---|---|---|
| Buyer | `first-purchase` | `/help/buyer/first-purchase` | PARTIAL | Production Desktop/Laptop/Mobile Buy Now/quote read-only evidence accepted; seeded-demo cart badge `7 -> 8 -> 7` passed with restoration; article overview/start-step and Desktop/Mobile selector retested on production `13c18f4`; accepted cart Desktop/Mobile visuals remain bound at `8157ffa`; order/payment and final feature visuals remain pending |
| Buyer | `orders` | `/help/buyer/orders` | PARTIAL | Authenticated order-list/detail read-only pass; existing detail exposes recipient fields, so receive/review/dispute state-transition evidence and a PII-safe final Desktop/Mobile visual remain pending |
| Buyer | `voucher` | `/help/buyer/voucher` | SOURCE_VERIFIED | Source and permission review complete; authenticated eligibility/application runtime and final Desktop/Mobile visual remain pending |
| Buyer | `chat-shop` | `/help/buyer/chat-shop` | PARTIAL | Authenticated entry/history read-only pass; existing history exposes participant names, while two-session send/receive, reconnect, supported metadata and a PII-safe final Desktop/Mobile visual remain pending |
| Buyer | `livestream` | `/help/buyer/livestream` | PARTIAL | Public discovery evidence is accepted; authenticated viewer join/media/comment/reaction/reminder/leave, provider evidence and final visual remain pending |
| QR | `verify-product` | `/help/qr/verify-product` | PARTIAL | Public article and code/link/image negative paths pass production; known positive fixture and final capture pending |
| Seller | `register-shop` | `/help/seller/register-shop` | SOURCE_VERIFIED | Source and permission review complete; authenticated shop submit, KYC/media walkthrough and final Desktop/Mobile visual remain pending |
| Seller | `create-product` | `/help/seller/create-product` | PARTIAL | Authenticated read-only route smoke passed Desktop/Laptop/Mobile; mutation and final visual pending |
| Seller | `process-order` | `/help/seller/process-order` | PARTIAL | Authenticated read-only route smoke passed Desktop/Laptop/Mobile; transition and final visual pending |
| Seller | `wallet` | `/help/seller/wallet` | PARTIAL | Read-only wallet evidence exists; final raw/annotated visual is BLOCKED_EXTERNAL without an approved seller capture target |
| Seller | `voucher` | `/help/seller/voucher` | PARTIAL | Authenticated read-only route smoke passed Desktop/Laptop/Mobile; mutation and final visual pending |
| Seller | `affiliate` | `/help/seller/affiliate` | PARTIAL | Authenticated program/member read-only evidence and visuals are accepted; join, attribution, conversion/payout and full journey sign-off remain pending |
| Seller | `livestream` | `/help/seller/livestream` | PARTIAL | Seller live-entry read-only pass exists; eligible offer, Agora host/viewer lifecycle and final Desktop/Mobile visual remain pending |
| Admin | `admin-review` | `/admin/help/admin/admin-review` | PARTIAL | Production Admin dashboard, Shop-registration and product-registration route smoke passed Desktop/Laptop/Mobile; review decisions and final visual pending |
| Admin | `operations` | `/admin/help/admin/operations` | PARTIAL | Production Admin read-only route inventory passed Desktop/Laptop/Mobile for the covered screens; targeted KYC/moderation/order/audit evidence and final visual pending |

### Canonical journey additions

The following entries complete the B01-B09, S01-S09 and A01-A10 journey ID
coverage required by the documentation specification:

| Role | Journey ID | Article route | Status | Visual status |
|---|---|---|---|---|
| Buyer | `B01` | `/help/buyer/account-start` | PARTIAL | Public login and registration entry captures at Desktop/Mobile; authenticated profile/address read-only pass; registration and mutations remain pending |
| Buyer | `B02` | `/help/buyer/discover` | PARTIAL | Public home, category, filtered-results, search, Shop-detail and product-detail steps captured and annotated at Desktop/Mobile; sort/review/provenance/authenticated actions remain partial |
| Buyer | `B03` | `/help/qr/verify-product` | PARTIAL | Public article and code/link/image negative paths pass production; known positive fixture and final capture pending |
| Buyer | `B04` | `/help/buyer/first-purchase` | PARTIAL | Production Desktop/Laptop/Mobile Buy Now/quote read-only pass (`GHN_1`, `158,001 VND`); seeded-demo cart badge `7 -> 8 -> 7` passed with restoration; article overview/start-step and Desktop/Mobile selector retested on production `13c18f4`; Desktop/Mobile cart badge raw/annotated visuals remain registered at `8157ffa`; cart quote/order/payment remain pending |
| Buyer | `B05` | `/help/buyer/orders` | PARTIAL | Authenticated order-list/detail read-only pass; existing detail exposes recipient fields, so receive/review/dispute state-transition evidence and a PII-safe final Desktop/Mobile visual remain pending |
| Buyer | `B06` | `/help/buyer/voucher` | SOURCE_VERIFIED | Source and permission review complete; authenticated voucher eligibility/application runtime and final visual pending |
| Buyer | `B07` | `/help/buyer/chat-shop` | PARTIAL | Authenticated entry/history read-only pass; existing history exposes participant names, while two-session send/receive, reconnect, supported metadata and a PII-safe final Desktop/Mobile visual remain pending |
| Buyer | `B08` | `/help/buyer/community` | PARTIAL | Pending PII-safe public fixture; seeded author data excluded |
| Buyer | `B09` | `/help/buyer/livestream` | PARTIAL | Public `/live` discovery shell captured and annotated at Desktop/Mobile; provider and authenticated interaction evidence pending |
| Seller | `S01` | `/help/seller/register-shop` | SOURCE_VERIFIED | Source and permission review complete; authenticated registration walkthrough and final visual pending |
| Seller | `S02` | `/help/seller/shop-setup` | PARTIAL | Authenticated `/seller/shop-info` and `/seller/business-info` smoke passed Desktop/Laptop/Mobile; mutation and final visual pending |
| Seller | `S03` | `/help/seller/create-product` | PARTIAL | Authenticated `/seller/products` smoke passed Desktop/Laptop/Mobile; create/mutation and final visual pending |
| Seller | `S04` | `/help/seller/manage-products` | PARTIAL | Authenticated `/seller/products` smoke passed Desktop/Laptop/Mobile; edit/mutation and final visual pending |
| Seller | `S05` | `/help/seller/process-order` | PARTIAL | Authenticated `/seller/orders` smoke passed Desktop/Laptop/Mobile; transition and final visual pending |
| Seller | `S06` | `/help/seller/voucher` | PARTIAL | Authenticated `/seller/vouchers` smoke passed Desktop/Laptop/Mobile; mutation and final visual pending |
| Seller | `S07` | `/help/seller/affiliate` | PARTIAL | Authenticated Affiliate program read-only pass with Desktop/Mobile raw and annotated visuals; join, conversion/payout and full journey sign-off pending |
| Seller | `S08` | `/help/seller/wallet` | PARTIAL | Read-only wallet evidence exists; final raw/annotated visual is BLOCKED_EXTERNAL without an approved seller capture target |
| Seller | `S09` | `/help/seller/livestream` | PARTIAL | Seller live-entry read-only pass exists; eligible offer, Agora host/viewer lifecycle and final Desktop/Mobile visual remain pending |
| Admin | `A01` | `/admin/help/admin/admin-dashboard` | PARTIAL | Production `/admin` route smoke passed Desktop/Laptop/Mobile; annotated Desktop/Mobile dashboard visuals served in Journey Center |
| Admin | `A02` | `/admin/help/admin/admin-users` | PARTIAL | Production `/admin/users` route smoke passed Desktop/Laptop/Mobile; list/detail assertions and final visual pending |
| Admin | `A03` | `/admin/help/admin/admin-kyc` | NOT_IMPLEMENTED | No current `/admin/kyc` frontend route; implementation or link replacement is required |
| Admin | `A04` | `/admin/help/admin/admin-shop-review` | PARTIAL | Production `/admin/shop-registrations` route smoke passed Desktop/Laptop/Mobile; review decision and final visual pending |
| Admin | `A05` | `/admin/help/admin/admin-product-review` | PARTIAL | Production `/admin/product-registrations` route smoke passed Desktop/Laptop/Mobile; annotated Desktop/Mobile visual accepted; moderation decision pending |
| Admin | `A06` | `/admin/help/admin/admin-moderation` | NOT_IMPLEMENTED | No current `/admin/moderation` frontend route; implementation or link replacement is required |
| Admin | `A07` | `/admin/help/admin/admin-orders` | NOT_IMPLEMENTED | No current `/admin/orders` frontend route; implementation or link replacement is required |
| Admin | `A08` | `/admin/help/admin/admin-wallet` | PARTIAL | Production `/admin/wallet` and `/admin/withdraw-requests` route smoke passed Desktop/Laptop/Mobile; financial actions and final visual pending |
| Admin | `A09` | `/admin/help/admin/admin-promotions` | PARTIAL | Production `/admin/vouchers` route smoke passed Desktop/Laptop/Mobile; annotated Desktop/Mobile visual accepted; voucher mutation pending |
| Admin | `A10` | `/admin/help/admin/admin-audit` | NOT_IMPLEMENTED | No current `/admin/audit` frontend route; implementation or link replacement is required |

Statuses must be downgraded when runtime evidence becomes stale. A source-only
article may explain prerequisites and safe next actions, but must not promise a
working production mutation.

## 2026-09-03 targeted production verification

The Help Center/Admin Help slice is serving Front-End revision
`723e550e95a570b5cf4ea2e14fb23eef16a3413d`. GitHub Actions run `90` completed
successfully after pulling, building and reloading the VPS deployment:
`https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33711930697`.
The WorkSpace audit baseline was pushed as `834aefb`; this follow-up records the
post-deployment reconciliation.

| Registry surface | Production result |
|---|---|
| Public `/help` | Buyer, Seller/Affiliate and QR content remained reachable; Admin role, Admin links and Admin article text were absent from the catalog and `Admin` search. |
| Public deep links | Existing Buyer, Seller/Affiliate and QR Help links loaded. The legacy public Admin dashboard deep link did not expose an Admin article. |
| Admin `/admin/help` | Admin-only catalog rendered inside the protected Admin shell with 12 cards, working Admin search and active `Hướng dẫn` navigation. |
| Authorization | Guest denied to `/auth`; Buyer and Seller denied to `/`; Admin allowed to `/admin/help`, including direct A01 deep-link navigation. |
| Published visual bindings | B01, B02, B04, B09, S07, A01, A05 and A09 rendered at Desktop `1440x900` and Mobile `390x844`; all 20 selected assets loaded and were visually inspected. |

The affected article rows remain `PARTIAL` where their wider journey still has
unverified mutation, provider or fixture steps. The targeted published
bindings are production-verified and do not upgrade those wider journey
statuses.
