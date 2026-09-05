# Visual Manifest

Original screenshots are evidence assets. Annotated screenshots are separate
documentation assets and must never overwrite originals.

Current owner classification: `ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO`.
`https://antifake.io.vn` and `https://api.antifake.io.vn` are the approved
current UAT/demo runtime for new fixture evidence. Historical rows retain their
original production labels; new `DOCS_UAT` evidence is explicitly marked UAT.
The visual goal remains open after each accepted step-level capture.

## Current fixture capability checkpoint - 2026-09-04

Backend revision `70f9bb5028ae18d8e772c59dc2e06a093b92ce6d` was deployed and
the guarded `DOCS_UAT` fixture graph was reconciled and verified. A fresh
isolated public product probe selected the managed variant and showed 25
available units with enabled cart/buy controls; no cart mutation was submitted
and no new visual binding is claimed from this prerequisite check. The
authenticated Buyer capture remains pending injected UAT credentials.

## Journey Center runtime bindings

The Journey Center renders a platform-specific annotated visual only when the
corresponding `HelpStep.visual` metadata is backed by an accepted manifest
asset. The current served copies are kept in
`Front-End/public/journey-visuals/`:

| Journey step | Desktop served visual | Mobile served visual | Evidence scope |
|---|---|---|---|
| B01 register | `/journey-visuals/b01-registration-desktop.png` | `/journey-visuals/b01-registration-mobile.png` | Public Buyer registration entry only; B01 remains `PARTIAL` |
| B02 search | `/journey-visuals/b02-discovery-desktop.png` | `/journey-visuals/b02-discovery-mobile.png` | Public catalog discovery only; B02 remains `PARTIAL` |
| B02 detail / choose | `/journey-visuals/b02-product-detail-desktop.png` | `/journey-visuals/b02-product-detail-mobile.png` | Public product-detail step only; B02 remains `PARTIAL` |
| B03 open | `/journey-visuals/b03-open-desktop.png` | `/journey-visuals/b03-open-mobile.png` | Public QR verifier entry state; historical raw/annotated pair captured at `78646d7`; binding deployed and verified on `303d816` / run `92`; B03 remains `PARTIAL` for broader feature coverage |
| B03 enter-code | `/journey-visuals/b03-enter-code-desktop.png` | `/journey-visuals/b03-enter-code-mobile.png` | Public QR code-entry state; historical empty-input pair captured at `303d816`; binding deployed and verified on `91f545e` / run `93`; B03 remains `PARTIAL` for broader feature coverage |
| B03 result | `/journey-visuals/b03-positive-result-desktop.png` | `/journey-visuals/b03-positive-result-mobile.png` | Genuine `VERIFIED` result from `QR_POSITIVE_LABEL_UAT`; raw and marker-annotated UAT captures at `1440x900` and `390x844`; final visual step completed, B03 journey remains `PARTIAL` for broader feature coverage |
| B08 feed | `/journey-visuals/b08-community-feed-desktop.png` | `/journey-visuals/b08-community-feed-mobile.png` | Public `DOCS_UAT` Community feed capture at both target viewports; interaction remains `PARTIAL`, while the current report surface is `NOT_IMPLEMENTED` |
| B09 discover | `/journey-visuals/b09-live-discovery-desktop.png` | `/journey-visuals/b09-live-discovery-mobile.png` | Public livestream discovery only; B09 remains `PARTIAL` |
| B09 shop (production-verified reuse) | `/journey-visuals/b02-product-detail-desktop.png` | `/journey-visuals/b02-product-detail-mobile.png` | Reuses the accepted public B02 product-detail state opened from live; route, asset load, dimensions and marker order verified on run `94`; live media/chat/purchase remain `PARTIAL` |
| A01 open | `/journey-visuals/admin-dashboard-desktop.png` | `/journey-visuals/admin-dashboard-mobile.png` | Real Admin-session UAT read-only dashboard shell; A01 remains `PARTIAL` |
| A05 pending | `/journey-visuals/admin-product-review-desktop.png` | `/journey-visuals/admin-product-review-mobile.png` | Real Admin-session UAT product-registration queue; A05 remains `PARTIAL` |
| A09 list | `/journey-visuals/admin-promotions-desktop.png` | `/journey-visuals/admin-promotions-mobile.png` | Admin read-only voucher workspace only; A09 remains `PARTIAL` |
| S07 program | `/journey-visuals/affiliate-program-desktop.png` | `/journey-visuals/affiliate-program-mobile.png` | Authenticated Affiliate program read-only view only; binding verified after deployment `622b1e9`; S07 remains `PARTIAL` |
| B04 cart | `/journey-visuals/b04-cart-desktop.png` | `/journey-visuals/b04-cart-mobile.png` | Production binding retested after deployed revision `13c18f4`; accepted seeded-cart Desktop/Mobile evidence remains at `8157ffa`; B04 remains `PARTIAL` |
| B04 discover (production-verified reuse) | `/journey-visuals/b02-discovery-desktop.png` | `/journey-visuals/b02-discovery-mobile.png` | Reuses the accepted public B02 discovery state; route, asset load and marker order verified at `78646d7` on Desktop/Mobile; B04 remains `PARTIAL` for later steps |
| B04 product-detail (production-verified reuse) | `/journey-visuals/b02-product-detail-desktop.png` | `/journey-visuals/b02-product-detail-mobile.png` | Reuses the accepted public B02 product-detail state; route, asset load and marker order verified at `78646d7` on Desktop/Mobile; B04 remains `PARTIAL` for later steps |
| B04 order (UAT reuse) | `/journey-visuals/b05-order-detail-desktop.png` | `/journey-visuals/b05-order-detail-mobile.png` | Reuses the accepted synthetic B05/detail evidence for the identical completed-order state; B04 later step accepted while checkout remains `PARTIAL` |
| B05 list | `/journey-visuals/b05-orders-desktop.png` | `/journey-visuals/b05-orders-mobile.png` | Authenticated Buyer `DOCS_UAT` order-list capture at both target viewports; list step accepted while order transitions remain `PARTIAL` |
| B05 detail | `/journey-visuals/b05-order-detail-desktop.png` | `/journey-visuals/b05-order-detail-mobile.png` | Authenticated Buyer `DOCS_UAT` order-detail capture at both target viewports; read-only detail accepted while next actions remain `PARTIAL` |
| B07 open/history | `/journey-visuals/b07-chat-open-desktop.png` | `/journey-visuals/b07-chat-open-mobile.png` | Authenticated Buyer `DOCS_UAT` chat history capture at both target viewports; send/realtime/reconnect remain unverified |
| A02 search | `/journey-visuals/admin-users-desktop.png` | `/journey-visuals/admin-users-mobile.png` | Authenticated Admin list filtered to the synthetic `DOCS_UAT` review user; queue search accepted while mutations remain `PARTIAL` |
| A02 detail | `/journey-visuals/admin-user-detail-desktop.png` | `/journey-visuals/admin-user-detail-mobile.png` | Authenticated Admin detail of a synthetic `DOCS_UAT` review user; read-only detail accepted while mutations remain `PARTIAL` |
| ADMIN-REVIEW dashboard (authenticated UAT reuse) | `/journey-visuals/admin-dashboard-desktop.png` | `/journey-visuals/admin-dashboard-mobile.png` | Reuses the real Admin-session UAT dashboard evidence; route and marker state verified |
| ADMIN-REVIEW product-review (authenticated UAT reuse) | `/journey-visuals/admin-product-review-desktop.png` | `/journey-visuals/admin-product-review-mobile.png` | Reuses the real Admin-session UAT product-review evidence; route and marker state verified |
| ADMIN-OPERATIONS dashboard (authenticated UAT reuse) | `/journey-visuals/admin-dashboard-desktop.png` | `/journey-visuals/admin-dashboard-mobile.png` | Reuses the real Admin-session UAT dashboard evidence; route and marker state verified |

## Served asset integrity

Each served Journey Center image is an immutable copy of the separately
annotated evidence asset below. The raw capture remains available for visual
review and is never used as the runtime binding.

| Served visual | Raw evidence | Annotated evidence | Integrity rule |
|---|---|---|---|
| `/journey-visuals/admin-dashboard-desktop.png` | `docs/images/admin/admin-dashboard-desktop-uat-20260905.png` | `docs/images/admin/admin-dashboard-desktop-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-dashboard-mobile.png` | `docs/images/admin/admin-dashboard-mobile-uat-20260905.png` | `docs/images/admin/admin-dashboard-mobile-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-users-desktop.png` | `docs/images/admin/a02-users-desktop-uat-20260905.png` | `docs/images/admin/a02-users-desktop-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-users-mobile.png` | `docs/images/admin/a02-users-mobile-uat-20260905.png` | `docs/images/admin/a02-users-mobile-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-user-detail-desktop.png` | `docs/images/admin/a02-user-detail-desktop-uat-20260905.png` | `docs/images/admin/a02-user-detail-desktop-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-user-detail-mobile.png` | `docs/images/admin/a02-user-detail-mobile-uat-20260905.png` | `docs/images/admin/a02-user-detail-mobile-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-product-review-desktop.png` | `docs/images/admin/admin-product-review-desktop-uat-20260905.png` | `docs/images/admin/admin-product-review-desktop-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-product-review-mobile.png` | `docs/images/admin/admin-product-review-mobile-uat-20260905.png` | `docs/images/admin/admin-product-review-mobile-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/admin-promotions-desktop.png` | `docs/images/admin/admin-vouchers-desktop-production-9637e9f.png` | `docs/images/admin/admin-vouchers-desktop-production-9637e9f-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/admin-promotions-mobile.png` | `docs/images/admin/admin-vouchers-mobile-production-9637e9f.png` | `docs/images/admin/admin-vouchers-mobile-production-9637e9f-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/affiliate-program-desktop.png` | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a.png` | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/affiliate-program-mobile.png` | `docs/images/affiliate/affiliate-program-mobile-production-7e7a12a.png` | `docs/images/affiliate/affiliate-program-mobile-production-7e7a12a-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b01-registration-desktop.png` | `docs/images/auth/registration-desktop-production-6b24be3.png` | `docs/images/auth/registration-desktop-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b01-registration-mobile.png` | `docs/images/auth/registration-mobile-production-6b24be3.png` | `docs/images/auth/registration-mobile-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b02-discovery-desktop.png` | `docs/images/buyer/catalog-home-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-home-desktop-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b02-discovery-mobile.png` | `docs/images/buyer/catalog-home-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-home-mobile-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b02-product-detail-desktop.png` | `docs/images/buyer/product-detail-desktop-production-6b24be3.png` | `docs/images/buyer/product-detail-desktop-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b02-product-detail-mobile.png` | `docs/images/buyer/product-detail-mobile-production-6b24be3.png` | `docs/images/buyer/product-detail-mobile-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b03-open-desktop.png` | `docs/images/qr/b03-open-desktop-production-78646d7.png` | `docs/images/qr/b03-open-desktop-production-78646d7-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b03-open-mobile.png` | `docs/images/qr/b03-open-mobile-production-78646d7.png` | `docs/images/qr/b03-open-mobile-production-78646d7-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b03-enter-code-desktop.png` | `docs/images/qr/b03-enter-code-desktop-production-303d816.png` | `docs/images/qr/b03-enter-code-desktop-production-303d816-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b03-enter-code-mobile.png` | `docs/images/qr/b03-enter-code-mobile-production-303d816.png` | `docs/images/qr/b03-enter-code-mobile-production-303d816-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b03-positive-result-desktop.png` | `docs/images/qr/b03-positive-desktop-uat-20260904.png` | `docs/images/qr/b03-positive-desktop-uat-20260904-annotated.png` | Served bytes equal annotated bytes; UAT result verified |
| `/journey-visuals/b03-positive-result-mobile.png` | `docs/images/qr/b03-positive-mobile-uat-20260904.png` | `docs/images/qr/b03-positive-mobile-uat-20260904-annotated.png` | Served bytes equal annotated bytes; UAT result verified |
| `/journey-visuals/b08-community-feed-desktop.png` | `docs/images/community/b08-community-feed-desktop-uat-20260904.png` | `docs/images/community/b08-community-feed-desktop-uat-20260904-annotated.png` | Served bytes equal annotated bytes; public UAT feed verified |
| `/journey-visuals/b08-community-feed-mobile.png` | `docs/images/community/b08-community-feed-mobile-uat-20260904.png` | `docs/images/community/b08-community-feed-mobile-uat-20260904-annotated.png` | Served bytes equal annotated bytes; public UAT feed verified |
| `/journey-visuals/b04-cart-desktop.png` | `docs/images/buyer/cart-desktop-production-8157ffa.png` | `docs/images/buyer/cart-desktop-production-8157ffa-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b04-cart-mobile.png` | `docs/images/buyer/cart-mobile-production-8157ffa.png` | `docs/images/buyer/cart-mobile-production-8157ffa-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b05-orders-desktop.png` | `docs/images/order/b05-orders-desktop-uat-20260905.png` | `docs/images/order/b05-orders-desktop-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/b05-orders-mobile.png` | `docs/images/order/b05-orders-mobile-uat-20260905.png` | `docs/images/order/b05-orders-mobile-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/b05-order-detail-desktop.png` | `docs/images/order/b05-order-detail-desktop-uat-20260905.png` | `docs/images/order/b05-order-detail-desktop-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/b05-order-detail-mobile.png` | `docs/images/order/b05-order-detail-mobile-uat-20260905.png` | `docs/images/order/b05-order-detail-mobile-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT capture |
| `/journey-visuals/b07-chat-open-desktop.png` | `docs/images/chat/b07-chat-open-desktop-uat-20260905.png` | `docs/images/chat/b07-chat-open-desktop-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT history capture |
| `/journey-visuals/b07-chat-open-mobile.png` | `docs/images/chat/b07-chat-open-mobile-uat-20260905.png` | `docs/images/chat/b07-chat-open-mobile-uat-20260905-annotated.png` | Served bytes equal annotated bytes; authenticated UAT history capture |
| `/journey-visuals/b09-live-discovery-desktop.png` | `docs/images/buyer/live-discovery-desktop-production-6b24be3.png` | `docs/images/buyer/live-discovery-desktop-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |
| `/journey-visuals/b09-live-discovery-mobile.png` | `docs/images/buyer/live-discovery-mobile-production-6b24be3.png` | `docs/images/buyer/live-discovery-mobile-production-6b24be3-annotated.png` | Served bytes equal annotated bytes |

Steps without a registered visual continue to show the evidence-pending
placeholder. These bindings do not upgrade a journey's UAT status.

## Marker guidance contract - 2026-09-03 local remediation

Each published `HelpStep.visual` now declares the marker numbers and the
Vietnamese guidance shown beside the image in Journey Center. The accepted
visual set has no unexplained markers or written marker references pointing to
an absent number.

| Published step | Marker mapping |
|---|---|
| B01 register | `1` account form, `2` identity fields, `3` consent and submit |
| B02 search | `1` category context, `2` discovery surface, `3` Flash Sale |
| B02 detail / choose | `1` product media, `2` variant and quantity, `3` AntiFake verification |
| B03 open | `1` QR verification method, `2` QR image upload, `3` verification action |
| B03 result | `1` QR verification header, `2` server-confirmed verification status, `3` provenance result details |
| B08 feed | `1` Community feed, `2` synthetic DOCS_UAT author, `3` post interaction controls |
| B03 enter-code | `1` selected Mã xác thực method, `2` verification-code field, `3` verification action |
| B04 cart | `1` cart quantity/badge, `2` quantity controls |
| B05 list | `1` Buyer order list, `2` synthetic recipient/order card, `3` detail action |
| B05 detail | `1` order identity/status, `2` synthetic product/recipient/shipping information, `3` payment summary |
| B07 open/history | Desktop: `1` Chat area, `2` DOCS_UAT room list, `3` message history; Mobile: `1` conversation content, `2` conversation header, `3` seeded synthetic messages |
| A02 search | Desktop: `1` users heading, `2` server summary statistics, `3` DOCS_UAT-filtered table; Mobile: `1` table toolbar, `2` DOCS_UAT search field, `3` synthetic result table |
| A02 detail | `1` DOCS_UAT profile card, `2` server-provided display name and role, `3` server information matrix |
| B09 discover | `1` live-shopping section, `2` search/state controls, `3` live card |
| B09 shop (reuse) | `1` product media, `2` variant/quantity, `3` AntiFake verification; Mobile: product image, name/price, variant selector |
| S07 program | `1` discovery tab, `2` program summary, `3` referral/join area |
| A01 open | `1` active Dashboard nav, `2` coordination area, `3` header identity/controls |
| A05 pending | `1` product-registration nav, `2` queue/filter context, `3` list or empty state |
| A09 list | `1` voucher nav, `2` voucher status, `3` create/preview form |
| B04 discover (local reuse) | `1` category context, `2` discovery surface, `3` Flash Sale |
| B04 product-detail (local reuse) | `1` product media, `2` variant and quantity, `3` AntiFake verification |
| B04 order (UAT reuse) | `1` order identity/status, `2` synthetic product/recipient/shipping information, `3` payment summary |
| ADMIN-REVIEW dashboard (authenticated UAT reuse) | `1` active Dashboard nav, `2` coordination area, `3` header identity/controls |
| ADMIN-REVIEW product-review (authenticated UAT reuse) | `1` product-registration nav, `2` queue/filter context, `3` list or empty state |
| ADMIN-OPERATIONS dashboard (authenticated UAT reuse) | `1` active Dashboard nav, `2` coordination area, `3` header identity/controls |

B02 `detail` and `choose` intentionally reuse the same product-detail state;
their written marker guidance differs only where the user action differs.
The historical 2026-09-03 local branch also binds B04 `discover` and
`product-detail`, B09 `shop`, plus the exact role-matched Admin overview states,
to these accepted assets without copying or regenerating images. The public
B04 aliases are production-verified at both target viewports on `78646d7`; the
B03/open binding was deployed on `303d816` / run `92` and rechecked on
`91f545e` / run `93`; the B03/enter-code binding is deployed and verified on
`91f545e` / run `93`; B09/shop is deployed and verified on `6584292` / run
`94`. The current UAT/demo capture adds B03 `result` from the genuine
`DOCS_UAT` positive QR state and B08 `feed` from the synthetic public
`DOCS_UAT` Community state at both target viewports. At the time of this
historical entry, the three Admin aliases remained pending approved-session
verification; the current authenticated UAT checkpoint below supersedes that
classification.
The route migration for
Admin Help is `/admin/help/admin/...`; historical production evidence below
remains historical unless explicitly updated.

## Post-deployment Journey Center regression — 2026-08-28

The B04 article overview and its explicit start-step link were retested on
production revision `13c18f4` at Desktop `1440×900` and Mobile `390×844`.
Manual Desktop/Mobile selection, overview progress (`6` steps), and the
overview-to-`discover` deep link rendered correctly. The page and static
bundle returned HTTP `200` (the overview document may be `304` on reload) and
the browser reported no console messages. Two PII-safe viewport captures were
written to the permitted OS temporary directory, privacy-reviewed, annotated
deterministically, and copied into the preferred WorkSpace asset tree. Direct
browser writes to repository paths still returned the configured-workspace
root error, so the temp-to-WorkSpace copy is the persistence record.

| Journey/step | Platform | Original | Annotated | Viewport | Status |
|---|---|---|---|---|---|
| Buyer product detail | Desktop | `docs/images/buyer/product-detail-desktop-production-6b24be3.png` | `docs/images/buyer/product-detail-desktop-production-6b24be3-annotated.png` | 1440×900 | Production raw + deterministic annotation after `6b24be3`; public B02 product-detail step evidence; full discovery journey remains `PARTIAL` |
| Buyer product detail | Mobile | `docs/images/buyer/product-detail-mobile-production-6b24be3.png` | `docs/images/buyer/product-detail-mobile-production-6b24be3-annotated.png` | 390×844 | Production raw + deterministic annotation after `6b24be3`; public B02 product-detail step evidence; full discovery journey remains `PARTIAL` |
| Buyer catalog home | Desktop | `docs/images/buyer/catalog-home-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-home-desktop-production-6b24be3-annotated.png` | 1440×900 | Public B02 discovery capture after `6b24be3`; no credentials or PII; full B02 remains `PARTIAL` |
| Buyer catalog home | Mobile | `docs/images/buyer/catalog-home-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-home-mobile-production-6b24be3-annotated.png` | 390×844 | Public B02 discovery capture after `6b24be3`; no credentials or PII; full B02 remains `PARTIAL` |
| Buyer category selection | Desktop | `docs/images/buyer/catalog-categories-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-categories-desktop-production-6b24be3-annotated.png` | 1440×900 | Public B02 category surface capture after `6b24be3`; no credentials or PII |
| Buyer category selection | Mobile | `docs/images/buyer/catalog-categories-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-categories-mobile-production-6b24be3-annotated.png` | 390×844 | Public B02 category surface capture after `6b24be3`; no credentials or PII |
| Buyer category results | Desktop | `docs/images/buyer/catalog-category-results-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-category-results-desktop-production-6b24be3-annotated.png` | 1440×900 | Public B02 filtered-results capture after `6b24be3`; no credentials or PII |
| Buyer category results | Mobile | `docs/images/buyer/catalog-category-results-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-category-results-mobile-production-6b24be3-annotated.png` | 390×844 | Public B02 filtered-results capture after `6b24be3`; no credentials or PII |
| Buyer search empty state | Desktop | `docs/images/buyer/catalog-search-results-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-search-results-desktop-production-6b24be3-annotated.png` | 1440×900 | Public B02 search/empty-state capture after `6b24be3`; no credentials or PII |
| Buyer search empty state | Mobile | `docs/images/buyer/catalog-search-results-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-search-results-mobile-production-6b24be3-annotated.png` | 390×844 | Public B02 search/empty-state capture after `6b24be3`; no credentials or PII |
| Buyer Shop detail | Desktop | `docs/images/buyer/shop-detail-desktop-production-6b24be3.png` | `docs/images/buyer/shop-detail-desktop-production-6b24be3-annotated.png` | 1440×900 | Public B02 Shop-detail capture after `6b24be3`; no credentials or PII |
| Buyer Shop detail | Mobile | `docs/images/buyer/shop-detail-mobile-production-6b24be3.png` | `docs/images/buyer/shop-detail-mobile-production-6b24be3-annotated.png` | 390×844 | Public B02 Shop-detail capture after `6b24be3`; no credentials or PII |
| Buyer livestream discovery | Desktop | `docs/images/buyer/live-discovery-desktop-production-6b24be3.png` | `docs/images/buyer/live-discovery-desktop-production-6b24be3-annotated.png` | 1440×900 | Public B09 discovery-shell capture after `6b24be3`; no credentials or PII; provider and interaction steps remain `PARTIAL` |
| Buyer livestream discovery | Mobile | `docs/images/buyer/live-discovery-mobile-production-6b24be3.png` | `docs/images/buyer/live-discovery-mobile-production-6b24be3-annotated.png` | 390×844 | Public B09 discovery-shell capture after `6b24be3`; no credentials or PII; provider and interaction steps remain `PARTIAL` |
| Buyer shop detail fallback | Desktop | `docs/images/buyer/shop-detail-fallback-desktop.png` | Pending | 1440×900 | Production fix evidence; not yet attached to a step |
| Buyer shop detail fallback | Mobile | `docs/images/buyer/shop-detail-fallback-mobile.png` | Pending | 390×844 | Production fix evidence; not yet attached to a step |
| Buyer login surface | Desktop | `docs/images/auth/login-desktop-production-6b24be3.png` | `docs/images/auth/login-desktop-production-6b24be3-annotated.png` | 1440×900 | Public `/auth` entry capture after `6b24be3`; no credentials or PII; B01 remains `PARTIAL` |
| Buyer login surface | Mobile | `docs/images/auth/login-mobile-production-6b24be3.png` | `docs/images/auth/login-mobile-production-6b24be3-annotated.png` | 390×844 | Public `/auth` entry capture after `6b24be3`; no credentials or PII; B01 remains `PARTIAL` |
| Buyer registration surface | Desktop | `docs/images/auth/registration-desktop-production-6b24be3.png` | `docs/images/auth/registration-desktop-production-6b24be3-annotated.png` | 1440×900 | Buyer registration mode reached from `/auth`; public entry capture after `6b24be3`; no credentials or PII; profile/address evidence remains pending |
| Buyer registration surface | Mobile | `docs/images/auth/registration-mobile-production-6b24be3.png` | `docs/images/auth/registration-mobile-production-6b24be3-annotated.png` | 390×844 | Buyer registration mode reached from `/auth`; public entry capture after `6b24be3`; no credentials or PII; profile/address evidence remains pending |
| Help Center overview | Desktop | `docs/images/guide/help/help-center-desktop-production-8157ffa.png` | `docs/images/guide/help/help-center-desktop-production-8157ffa-annotated.png` | 1440×900 | Current production capture and deterministic annotation after deployed revision `8157ffa`; public Help Center only |
| Help Center overview | Mobile | `docs/images/guide/help/help-center-mobile-production-8157ffa.png` | `docs/images/guide/help/help-center-mobile-production-8157ffa-annotated.png` | 390×844 | Current production capture and deterministic annotation after deployed revision `8157ffa`; public Help Center only |
| Journey Center buyer first-purchase step shell | Desktop | `docs/images/guide/help/journey-buyer-first-purchase-desktop-production-717357c.png` | Do not publish as final | 1440×900 | Raw production capture; the step intentionally shows that its feature visual is still awaiting matching runtime evidence |
| Journey Center buyer first-purchase step shell | Mobile | `docs/images/guide/help/journey-buyer-first-purchase-mobile-production-717357c.png` | Do not publish as final | 390×844 | Raw production capture; the step intentionally shows that its feature visual is still awaiting matching runtime evidence |
| B03 QR verifier open | Desktop | `docs/images/qr/b03-open-desktop-production-78646d7.png` | `docs/images/qr/b03-open-desktop-production-78646d7-annotated.png` | 1440×900 | Public read-only QR entry state captured on current production; no code submitted, no fixture or mutation |
| B03 QR verifier open | Mobile | `docs/images/qr/b03-open-mobile-production-78646d7.png` | `docs/images/qr/b03-open-mobile-production-78646d7-annotated.png` | 390×844 | Public read-only QR entry state captured on current production; no code submitted, no fixture or mutation |
| B03 QR verifier enter-code | Desktop | `docs/images/qr/b03-enter-code-desktop-production-303d816.png` | `docs/images/qr/b03-enter-code-desktop-production-303d816-annotated.png` | 1440×900 | Public read-only empty code-entry state captured from deployed `303d816`; binding verified on deployed `91f545e` / run `93`; no code entered, fixture or mutation |
| B03 QR verifier enter-code | Mobile | `docs/images/qr/b03-enter-code-mobile-production-303d816.png` | `docs/images/qr/b03-enter-code-mobile-production-303d816-annotated.png` | 390×844 | Public read-only empty code-entry state captured from deployed `303d816`; binding verified on deployed `91f545e` / run `93`; no code entered, fixture or mutation |
| QR page unknown-result evidence | Desktop | `docs/images/qr/verification-desktop-production-a0b74c4.png` | `docs/images/qr/verification-desktop-production-a0b74c4-annotated.png` | 1440×900 | Production raw + deterministic annotation after `a0b74c4`; unknown fixture returns server-owned `NOT_FOUND`; UAT evidence only |
| QR page unknown-result evidence | Mobile | `docs/images/qr/verification-mobile-production-a0b74c4.png` | `docs/images/qr/verification-mobile-production-a0b74c4-annotated.png` | 390×844 | Production raw + deterministic annotation after `a0b74c4`; unknown fixture returns server-owned `NOT_FOUND`; UAT evidence only |
| Seller getting started checklist | Desktop/Mobile | Pending `/seller/dashboard` capture with approved Seller fixture and backend-derived checklist state | Pending raw + annotated Desktop/Mobile pair | 1440×900 / 390×844 | Capture only after authenticated read-only checklist load; retain the actual completed count and do not mutate Shop, product, voucher or order data |
| Guest Admin redirect | Desktop/Mobile | `docs/images/uat-guest-admin-redirect-*` | Do not publish as guide | 1440×900 / 390×844 | Security/UAT evidence only |

| B04 Journey Center overview | Desktop | `docs/images/guide/help/b04-overview-production-13c18f4-desktop.png` | `docs/images/guide/help/b04-overview-production-13c18f4-desktop-annotated.png` | 1440x900 | PII-safe production overview capture after `13c18f4`; persisted via OS temp to WorkSpace; annotation identifies the platform selector; shell evidence only |
| B04 Journey Center overview | Mobile | `docs/images/guide/help/b04-overview-production-13c18f4-mobile.png` | `docs/images/guide/help/b04-overview-production-13c18f4-mobile-annotated.png` | 390x844 | PII-safe production overview capture after `13c18f4`; persisted via OS temp to WorkSpace; annotation identifies the platform selector; shell evidence only |

## Capture traceability

Captured assets have structured provenance below. Pending rows above have no
accepted capture and must not be treated as final documentation visuals.
The earlier `3b504ba` Help Center pair is retained as historical UAT evidence;
the `8157ffa` pair is the current documentation asset.

| Asset set | Journey/step | Source page | Capture date | Deployment revision | Test-data scope | Viewport | Original | Annotated | Status |
|---|---|---|---|---|---|---|---|---|---|
| Help Center overview | Public Help Center shell | `/help` | 2026-08-27 | `8157ffa` | Guest/public content only; no credentials or PII; current contrast-verified build | 1440×900 | `docs/images/guide/help/help-center-desktop-production-8157ffa.png` | `docs/images/guide/help/help-center-desktop-production-8157ffa-annotated.png` | Current production shell evidence; not feature-flow sign-off |
| Help Center overview | Public Help Center shell | `/help` | 2026-08-27 | `8157ffa` | Guest/public content only; no credentials or PII; current contrast-verified build | 390×844 | `docs/images/guide/help/help-center-mobile-production-8157ffa.png` | `docs/images/guide/help/help-center-mobile-production-8157ffa-annotated.png` | Current production shell evidence; not feature-flow sign-off |
| Help Center overview (historical) | Public Help Center shell | `/help` | 2026-08-25 | `3b504ba` | Guest/public content only; no credentials or PII | 1440×900 | `docs/images/guide/help/help-center-desktop-production-3b504ba.png` | `docs/images/guide/help/help-center-desktop-production-3b504ba-annotated.png` | Historical UAT shell evidence; superseded for current documentation |
| Help Center overview (historical) | Public Help Center shell | `/help` | 2026-08-25 | `3b504ba` | Guest/public content only; no credentials or PII | 390×844 | `docs/images/guide/help/help-center-mobile-production-3b504ba.png` | `docs/images/guide/help/help-center-mobile-production-3b504ba-annotated.png` | Historical UAT shell evidence; superseded for current documentation |
| B01 login surface | Buyer authentication entry | `/auth` | 2026-08-25 | `6b24be3` | Public form shell only; no credentials or PII; clean browser diagnostics | 1440×900 | `docs/images/auth/login-desktop-production-6b24be3.png` | `docs/images/auth/login-desktop-production-6b24be3-annotated.png` | Public login surface evidence; B01 remains `PARTIAL` |
| B01 login surface | Buyer authentication entry | `/auth` | 2026-08-25 | `6b24be3` | Public form shell only; no credentials or PII; clean browser diagnostics | 390×844 | `docs/images/auth/login-mobile-production-6b24be3.png` | `docs/images/auth/login-mobile-production-6b24be3-annotated.png` | Public login surface evidence; B01 remains `PARTIAL` |
| B01 registration surface | Buyer authentication entry | `/auth` registration mode | 2026-08-25 | `6b24be3` | Public form shell only; no credentials or PII; clean browser diagnostics | 1440×900 | `docs/images/auth/registration-desktop-production-6b24be3.png` | `docs/images/auth/registration-desktop-production-6b24be3-annotated.png` | Public registration surface evidence; profile/address and authenticated completion remain pending |
| B01 registration surface | Buyer authentication entry | `/auth` registration mode | 2026-08-25 | `6b24be3` | Public form shell only; no credentials or PII; clean browser diagnostics | 390×844 | `docs/images/auth/registration-mobile-production-6b24be3.png` | `docs/images/auth/registration-mobile-production-6b24be3-annotated.png` | Public registration surface evidence; profile/address and authenticated completion remain pending |
| B02 product-detail step | Buyer product detail | `/product/c831f5d5-4b75-46db-95fc-c687f0fe6b2b` | 2026-08-25 | `6b24be3` | Public seeded product; no credentials or PII | 1440×900 | `docs/images/buyer/product-detail-desktop-production-6b24be3.png` | `docs/images/buyer/product-detail-desktop-production-6b24be3-annotated.png` | Public product-detail step; browser diagnostic clean; B02 remains `PARTIAL` |
| B02 product-detail step | Buyer product detail | `/product/c831f5d5-4b75-46db-95fc-c687f0fe6b2b` | 2026-08-25 | `6b24be3` | Public seeded product; no credentials or PII | 390×844 | `docs/images/buyer/product-detail-mobile-production-6b24be3.png` | `docs/images/buyer/product-detail-mobile-production-6b24be3-annotated.png` | Public product-detail step; browser diagnostic clean; B02 remains `PARTIAL` |
| B02 catalog home | Buyer catalog home | `/` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 1440×900 | `docs/images/buyer/catalog-home-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-home-desktop-production-6b24be3-annotated.png` | Browser diagnostic clean; public discovery subset; B02 remains `PARTIAL` |
| B02 catalog home | Buyer catalog home | `/` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 390×844 | `docs/images/buyer/catalog-home-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-home-mobile-production-6b24be3-annotated.png` | Browser diagnostic clean; public discovery subset; B02 remains `PARTIAL` |
| B02 category selection | Buyer category selection | `/categories` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 1440×900 | `docs/images/buyer/catalog-categories-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-categories-desktop-production-6b24be3-annotated.png` | Browser diagnostic clean; public category subset; B02 remains `PARTIAL` |
| B02 category selection | Buyer category selection | `/categories` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 390×844 | `docs/images/buyer/catalog-categories-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-categories-mobile-production-6b24be3-annotated.png` | Browser diagnostic clean; public category subset; B02 remains `PARTIAL` |
| B02 category results | Buyer filtered results | `/search?categoryId=2b4ded4b-624d-417b-acda-c3766c385ef9&category=Chăm+sóc+cá+nhân` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 1440×900 | `docs/images/buyer/catalog-category-results-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-category-results-desktop-production-6b24be3-annotated.png` | Browser diagnostic clean; public filtered-results subset; B02 remains `PARTIAL` |
| B02 category results | Buyer filtered results | `/search?categoryId=2b4ded4b-624d-417b-acda-c3766c385ef9&category=Chăm+sóc+cá+nhân` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 390×844 | `docs/images/buyer/catalog-category-results-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-category-results-mobile-production-6b24be3-annotated.png` | Browser diagnostic clean; public filtered-results subset; B02 remains `PARTIAL` |
| B02 search results | Buyer search/empty state | `/search?q=seed` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 1440×900 | `docs/images/buyer/catalog-search-results-desktop-production-6b24be3.png` | `docs/images/buyer/catalog-search-results-desktop-production-6b24be3-annotated.png` | Browser diagnostic clean; public search subset; B02 remains `PARTIAL` |
| B02 search results | Buyer search/empty state | `/search?q=seed` | 2026-08-25 | `6b24be3` | Public seeded catalog; no credentials or PII | 390×844 | `docs/images/buyer/catalog-search-results-mobile-production-6b24be3.png` | `docs/images/buyer/catalog-search-results-mobile-production-6b24be3-annotated.png` | Browser diagnostic clean; public search subset; B02 remains `PARTIAL` |
| B02 Shop detail | Buyer Shop context | `/shop/7916412b-68c5-4d56-b592-25aa2b77a88f` | 2026-08-25 | `6b24be3` | Public seeded Shop; no credentials or PII | 1440×900 | `docs/images/buyer/shop-detail-desktop-production-6b24be3.png` | `docs/images/buyer/shop-detail-desktop-production-6b24be3-annotated.png` | Browser diagnostic clean; public Shop subset; B02 remains `PARTIAL` |
| B02 Shop detail | Buyer Shop context | `/shop/7916412b-68c5-4d56-b592-25aa2b77a88f` | 2026-08-25 | `6b24be3` | Public seeded Shop; no credentials or PII | 390×844 | `docs/images/buyer/shop-detail-mobile-production-6b24be3.png` | `docs/images/buyer/shop-detail-mobile-production-6b24be3-annotated.png` | Browser diagnostic clean; public Shop subset; B02 remains `PARTIAL` |
| B09 livestream discovery | Buyer livestream discovery | `/live` | 2026-08-25 | `6b24be3` | Public seeded livestream listing; no credentials or PII | 1440×900 | `docs/images/buyer/live-discovery-desktop-production-6b24be3.png` | `docs/images/buyer/live-discovery-desktop-production-6b24be3-annotated.png` | Browser diagnostic clean; public discovery shell only; B09 remains `PARTIAL` |
| B09 livestream discovery | Buyer livestream discovery | `/live` | 2026-08-25 | `6b24be3` | Public seeded livestream listing; no credentials or PII | 390×844 | `docs/images/buyer/live-discovery-mobile-production-6b24be3.png` | `docs/images/buyer/live-discovery-mobile-production-6b24be3-annotated.png` | Browser diagnostic clean; public discovery shell only; B09 remains `PARTIAL` |
| B09 scheduled live shell | Buyer/public scheduled room shell | `/live/d0000000-0000-4000-8000-000000000055` | 2026-09-04 | `4e24bef` / capture run `33862241536` | DOCS_UAT-only title, Shop, pinned product, voucher and synthetic comment; no credentials or PII | 1440×900 | `docs/images/buyer/b09-live-scheduled-shell-desktop-uat-20260904.png` | `docs/images/buyer/b09-live-scheduled-shell-desktop-uat-20260904-annotated.png` | Temporary UAT shell evidence; markers reviewed; no Agora join; full B09 watch remains provider-blocked |
| B09 scheduled live shell | Buyer/public scheduled room shell | `/live/d0000000-0000-4000-8000-000000000055` | 2026-09-04 | `4e24bef` / capture run `33862241536` | DOCS_UAT-only title, Shop, pinned product, voucher and synthetic comment; no credentials or PII | 390×844 | `docs/images/buyer/b09-live-scheduled-shell-mobile-uat-20260904.png` | `docs/images/buyer/b09-live-scheduled-shell-mobile-uat-20260904-annotated.png` | Temporary UAT shell evidence; markers reviewed; no Agora join; full B09 watch remains provider-blocked |
| S07 Affiliate program | Seller/Affiliate program view | `/affiliate` | 2026-08-27 | `7e7a12a` capture / `622b1e9` binding | Approved seed buyer session; no PII in captured view; join button not clicked | 1440×900 | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a.png` | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a-annotated.png` | Production read-only evidence; program/member reads HTTP 200; binding post-deploy verified; S07 remains `PARTIAL` |
| S07 Affiliate program | Seller/Affiliate program view | `/affiliate` | 2026-08-27 | `7e7a12a` capture / `622b1e9` binding | Approved seed buyer session; no PII in captured view; join button not clicked | 390×844 | `docs/images/affiliate/affiliate-program-mobile-production-7e7a12a.png` | `docs/images/affiliate/affiliate-program-mobile-production-7e7a12a-annotated.png` | Production read-only evidence; program/member reads HTTP 200; binding post-deploy verified; S07 remains `PARTIAL` |
| B04 cart badge | Buyer cart quantity feedback | `/cart` | 2026-08-28 | `8157ffa` | Existing seeded Buyer cart; restored baseline; no PII or credentials | 1440×900 | `docs/images/buyer/cart-desktop-production-8157ffa.png` | `docs/images/buyer/cart-desktop-production-8157ffa-annotated.png` | Read-only capture after reversible badge UAT; documents quantity control and header badge only; B04 remains `PARTIAL` |
| B04 cart badge | Buyer cart quantity feedback | `/cart` | 2026-08-28 | `8157ffa` | Existing seeded Buyer cart; restored baseline; no PII or credentials | 390×844 | `docs/images/buyer/cart-mobile-production-8157ffa.png` | `docs/images/buyer/cart-mobile-production-8157ffa-annotated.png` | Read-only capture after reversible badge UAT; documents quantity control and header badge only; B04 remains `PARTIAL` |
| Journey Center first-purchase shell | B04 step shell | `/help/buyer/first-purchase/add-to-cart` | 2026-08-25 | `717357c` | Guest/public shell; no credentials or PII | 1440×900 | `docs/images/guide/help/journey-buyer-first-purchase-desktop-production-717357c.png` | Do not publish as final | Shell evidence only; feature visual pending |
| Journey Center first-purchase shell | B04 step shell | `/help/buyer/first-purchase/add-to-cart` | 2026-08-25 | `717357c` | Guest/public shell; no credentials or PII | 390×844 | `docs/images/guide/help/journey-buyer-first-purchase-mobile-production-717357c.png` | Do not publish as final | Shell evidence only; feature visual pending |
| QR unknown-result UAT | B03 QR verification | `/qr` | 2026-08-25 | `a0b74c4` | Deterministic `UAT-QR-IMAGE-20260825`; no credentials or PII | 1440×900 | `docs/images/qr/verification-desktop-production-a0b74c4.png` | `docs/images/qr/verification-desktop-production-a0b74c4-annotated.png` | UAT negative-result evidence only; `NOT_FOUND` |
| QR unknown-result UAT | B03 QR verification | `/qr` | 2026-08-25 | `a0b74c4` | Deterministic `UAT-QR-IMAGE-20260825`; no credentials or PII | 390×844 | `docs/images/qr/verification-mobile-production-a0b74c4.png` | `docs/images/qr/verification-mobile-production-a0b74c4-annotated.png` | UAT negative-result evidence only; `NOT_FOUND` |

## Canonical journey visual coverage

Every canonical journey has an explicit visual record. `Pending` means the
journey remains eligible for a future approved capture; it is not a final guide
visual or a production verification claim.

| Journey ID | Guide / step route | Platform / viewport | Original | Annotated | Status |
|---|---|---|---|---|---|
| B01 | `/help/buyer/account-start` | Desktop 1440×900 + Mobile 390×844 | `docs/images/auth/login-desktop-production-6b24be3.png`, `login-mobile-production-6b24be3.png`, `registration-desktop-production-6b24be3.png`, `registration-mobile-production-6b24be3.png` | Matching Desktop/Mobile annotated auth pairs under `docs/images/auth/` | Public login and registration entry plus authenticated profile/address read-only surfaces are evidenced; registration and mutations remain `Pending`, so B01 is `PARTIAL` |
| B02 | `/help/buyer/discover` | Desktop 1440×900 + Mobile 390×844 | `catalog-home`, `catalog-categories`, `catalog-category-results`, `catalog-search-results`, `shop-detail` and `product-detail` raw pairs under `docs/images/buyer/` | Matching Desktop/Mobile annotated pairs under `docs/images/buyer/` | Public home, category, filtered-results, search, Shop-detail and product-detail surfaces captured with clean browser diagnostics; Pending sort/review/provenance/authenticated actions remain open, so B02 is `PARTIAL` |
| B03 | `/help/qr/verify-product` | Desktop 1440×900 + Mobile 390×844 | `docs/images/qr/b03-open-desktop-production-78646d7.png`, `docs/images/qr/b03-open-mobile-production-78646d7.png`, `docs/images/qr/b03-enter-code-desktop-production-303d816.png`, `docs/images/qr/b03-enter-code-mobile-production-303d816.png`, `docs/images/qr/b03-positive-desktop-uat-20260904.png`, `docs/images/qr/b03-positive-mobile-uat-20260904.png`; negative-result raw pair remains UAT evidence only | `docs/images/qr/b03-open-desktop-production-78646d7-annotated.png`, `docs/images/qr/b03-open-mobile-production-78646d7-annotated.png`, `docs/images/qr/b03-enter-code-desktop-production-303d816-annotated.png`, `docs/images/qr/b03-enter-code-mobile-production-303d816-annotated.png`, `docs/images/qr/b03-positive-desktop-uat-20260904-annotated.png`, `docs/images/qr/b03-positive-mobile-uat-20260904-annotated.png`; negative-result annotations remain UAT evidence only | B03/open, B03/enter-code and the positive-result UAT fixture visual are captured at both viewports; positive-result raw/annotated evidence is PII-safe and marker-verified; the broader B03 feature remains `PARTIAL` |
| B04 | `/help/buyer/first-purchase` | Desktop 1440×900 + Mobile 390×844 | `docs/images/buyer/cart-desktop-production-8157ffa.png`, `docs/images/buyer/cart-mobile-production-8157ffa.png` | `docs/images/buyer/cart-desktop-production-8157ffa-annotated.png`, `docs/images/buyer/cart-mobile-production-8157ffa-annotated.png` | Article overview/start-step and Desktop/Mobile selector retested on production `13c18f4`; accepted cart badge visuals remain registered at `8157ffa`; `Pending`: cart quote/order/payment and full first-purchase evidence remain open, so B04 stays `PARTIAL` |
| B05 | `/help/buyer/orders` | Desktop 1440×900 + Mobile 390×844 | Pending PII-safe owned order-detail capture | Pending | The existing seeded detail is readable but exposes recipient fields; receive/review/dispute state-transition evidence and a PII-safe final capture remain pending |
| B06 | `/help/buyer/voucher` | Desktop 1440×900 + Mobile 390×844 | Pending authenticated voucher capture | Pending | Eligibility/application runtime and a final Desktop/Mobile capture remain pending |
| B07 | `/help/buyer/chat-shop` | Desktop 1440×900 + Mobile 390×844 | Pending PII-safe two-session chat capture | Pending | The existing history is readable but exposes participant names; send/receive/reconnect, supported metadata and a PII-safe final capture remain pending |
| B08 | `/help/buyer/community` | Desktop 1440×900 + Mobile 390×844 | `docs/images/community/b08-community-feed-desktop-uat-20260904.png`, `b08-community-feed-mobile-uat-20260904.png` | `docs/images/community/b08-community-feed-desktop-uat-20260904-annotated.png`, `b08-community-feed-mobile-uat-20260904-annotated.png` | Public DOCS_UAT feed captured and privacy-reviewed at both target viewports; interaction remains Pending and report is `NOT_IMPLEMENTED` |
| B09 | `/help/buyer/livestream` | Desktop 1440×900 + Mobile 390×844 | `docs/images/buyer/live-discovery-desktop-production-6b24be3.png`, `docs/images/buyer/live-discovery-mobile-production-6b24be3.png`; B09/shop reuses B02 product-detail raw pair | `docs/images/buyer/live-discovery-desktop-production-6b24be3-annotated.png`, `docs/images/buyer/live-discovery-mobile-production-6b24be3-annotated.png`; B09/shop reuses B02 product-detail annotated pair | Public discovery and live-origin product-detail shell are accepted; Pending provider, safe room, interaction and purchase steps remain `PARTIAL` |
| S01 | `/help/seller/register-shop` | Desktop 1440×900 + Mobile 390×844 | Pending authenticated Seller submit capture with synthetic KYC/media fixture | Pending raw + annotated Desktop/Mobile pair | Submit/state transition, KYC/media fixture and final capture remain pending; no real identity documents |
| S02 | `/help/seller/shop-setup` | Desktop 1440×900 + Mobile 390×844 | Pending owned approved-Shop Seller capture | Pending raw + annotated Desktop/Mobile pair | Business/profile edit persistence after reload and final capture remain pending; use isolated non-business-critical data |
| S03 | `/help/seller/create-product` | Desktop 1440×900 + Mobile 390×844 | Pending disposable product fixture with sanitized media | Pending raw + annotated Desktop/Mobile pair | Product/media/variant/stock/moderation submission and final capture remain pending |
| S04 | `/help/seller/manage-products` | Desktop 1440×900 + Mobile 390×844 | Pending owned disposable product fixture | Pending raw + annotated Desktop/Mobile pair | Edit/variant/media ownership and reload evidence plus final capture remain pending |
| S05 | `/help/seller/process-order` | Desktop 1440×900 + Mobile 390×844 | Pending owned order fixture in an approved transition state | Pending raw + annotated Desktop/Mobile pair | Seller transition/audit/ownership evidence and PII-safe final capture remain pending |
| S06 | `/help/seller/voucher` | Desktop 1440×900 + Mobile 390×844 | Pending disposable Shop voucher with matching catalog/order fixture | Pending raw + annotated Desktop/Mobile pair | Create/edit/activate/deactivate/eligibility evidence and final capture remain pending |
| S07 | `/help/seller/affiliate` | Desktop 1440×900 + Mobile 390×844 | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a.png`, `affiliate-program-mobile-production-7e7a12a.png` | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a-annotated.png`, `affiliate-program-mobile-production-7e7a12a-annotated.png` | Authenticated program read-only evidence; binding post-deploy verified on `622b1e9`; join, conversion/payout and final journey sign-off remain `Pending` |
| S08 | `/help/seller/wallet` | Desktop 1440×900 + Mobile 390×844 | Read-only wallet/ledger and masked payout-account runtime exists; no approved PII-safe final capture target | Pending / `BLOCKED_EXTERNAL` for final asset | Capture after an approved PII-safe seller capture target is available; no wallet mutation |
| S09 | `/help/seller/livestream` | Desktop 1440×900 + Mobile 390×844 | Pending eligible Seller live fixture with approved offer/voucher and Agora sandbox | Pending raw + annotated Desktop/Mobile pair | Create/start/pin/Agora host, viewer interaction/end evidence and final capture remain pending |
| A01 | `/admin/help/admin/admin-dashboard` | Desktop 1440×900 + Mobile 390×844 | `docs/images/admin/admin-dashboard-desktop-production-bb0eee1.png`, `admin-dashboard-mobile-production-bb0eee1.png` | `docs/images/admin/admin-dashboard-desktop-production-bb0eee1-annotated.png`, `admin-dashboard-mobile-production-bb0eee1-annotated.png` | Raw and annotated captures inspected and PII-safe; read-only A01 step only |
| A02 | `/admin/help/admin/admin-users` | Desktop 1440×900 + Mobile 390×844 | Pending PII-reviewed Admin user list/detail fixture | Pending raw + annotated Desktop/Mobile pair | List/detail/filter assertions and final PII-safe capture remain pending; do not expose personal data |
| A03 | `/admin/help/admin/admin-kyc` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |
| A04 | `/admin/help/admin/admin-shop-review` | Desktop 1440×900 + Mobile 390×844 | Pending sanitized Shop application in review queue | Pending raw + annotated Desktop/Mobile pair | Approve/reject/activation audit evidence and final PII-safe capture remain pending |
| A05 | `/admin/help/admin/admin-product-review` | Desktop 1440×900 + Mobile 390×844 | `docs/images/admin/admin-product-registrations-desktop-production-9637e9f.png`, `admin-product-registrations-mobile-production-9637e9f.png` | `docs/images/admin/admin-product-registrations-desktop-production-9637e9f-annotated.png`, `admin-product-registrations-mobile-production-9637e9f-annotated.png` | Raw and annotated captures inspected and PII-safe; read-only moderation queue only |
| A06 | `/admin/help/admin/admin-moderation` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |
| A07 | `/admin/help/admin/admin-orders` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |
| A08 | `/admin/help/admin/admin-wallet` | Desktop 1440×900 + Mobile 390×844 | Pending approved withdrawal fixture with payout-provider sandbox | Pending raw + annotated Desktop/Mobile pair | Payout/withdrawal audit evidence and final PII-safe capture remain pending; production financial mutation is prohibited |
| A09 | `/admin/help/admin/admin-promotions` | Desktop 1440×900 + Mobile 390×844 | `docs/images/admin/admin-vouchers-desktop-production-9637e9f.png`, `admin-vouchers-mobile-production-9637e9f.png` | `docs/images/admin/admin-vouchers-desktop-production-9637e9f-annotated.png`, `admin-vouchers-mobile-production-9637e9f-annotated.png` | Raw and annotated captures inspected and PII-safe; read-only voucher workspace only |
| A10 | `/admin/help/admin/admin-audit` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |

## 2026-08-28 capture disposition

The cart-badge UAT was reviewed at Desktop `1440x900`, Laptop `1280x720` and
Mobile `390x844` while the seeded demo cart was in its restored baseline state.
The browser tool rejected direct writes to the canonical WorkSpace path, so the
Desktop/Mobile raw and annotated captures were exported to the approved
temporary directory, visually inspected, copied into `docs/images/buyer/`, and
registered above. The overlay was removed after capture; the cart remained at
badge `7`. These assets document the cart quantity/badge step only and do not
upgrade B04 beyond `PARTIAL`.

## Capture rules

- Capture Desktop at 1440×900, Laptop at 1280×720 when needed and Mobile at
  390×844 using the real responsive UI.
- Record source page, capture date, deployment revision and test-data scope
  before accepting an asset.
- Keep secrets, tokens, cookies, passwords, KYC/identity data and unnecessary
  PII out of every image.
- Add annotations only to a copy, using numbered markers or bounding boxes that
  do not cover controls, prices, validation or state.
- QR B03/open annotation legend: `1` QR method, `2` image upload control, `3`
  verification action. These public captures show the entry state only; no
  code was submitted and no fixture or mutation was used.
- QR B03/enter-code annotation legend: `1` selected Mã xác thực method, `2`
  empty verification-code field, `3` verification action. These public
  captures show the input state only; no code was entered or submitted.
- QR B03 negative-result annotation legend: `1` QR method, `2` image upload
  control, `3` server-owned unknown-result state. These images use deterministic
  `UAT-QR-IMAGE-20260825` fixture and are not positive-verification evidence.
- QR B03 positive-result annotation legend: `1` QR verification header, `2`
  server-confirmed verification status, `3` provenance result details. The
  2026-09-04 pair uses only `DOCS_UAT` data and a synthetic verification value;
  it is valid UAT evidence, not a payment/provider completion claim.
- B02 product-detail annotation legend: Desktop uses `1` product media, `2`
  product metadata and variant controls, `3` AntiFake information panel.
  Mobile uses `1` product image, `2` product name/price, `3` variant selector.
  B02 choose uses the same platform-specific targets with step-specific prose.
  These captures cover the public product-detail step only; they do not sign
  off the full discovery journey or authenticated actions.
- B02 public-discovery annotation legend: `1` entry/context surface, `2`
  primary catalog or Shop content, `3` result/filter/empty-state context. The
  ten captures are public read-only evidence after `6b24be3`; they do not sign
  off sorting, reviews, provenance actions or authenticated purchase steps.
- B09 livestream-discovery annotation legend: `1` journey heading, `2` search
  and state controls, `3` public live card. The captures cover discovery only;
  they do not sign off provider setup, joining, interaction or leaving a live.
- B01 authentication annotation legend: login `1` account entry, `2` password
  and recovery controls, `3` alternate sign-in/registration entry; registration
  `1` form heading, `2` identity fields, `3` consent and submit area. These
  public captures do not sign off credentialed registration, profile or address
  completion.
- S07 Affiliate annotation legend: `1` program-discovery tab, `2` open-program
  summary, `3` referral-code/join area. These captures document read-only
  program discovery only; joining, attribution, conversion and payout remain
  unverified.

## 2026-09-04 current UAT/demo fixture verification

The owner-confirmed current runtime is `UAT_DEMO`, not customer production.
The additive `DOCS_UAT` fixture graph passed twice through the guarded ensure,
the read-only verifier reported a genuine positive `VERIFIED` QR result, and
the isolated Playwright capture test passed at Desktop `1440×900` and Mobile
`390×844`. GitHub Actions run `100` deployed Front-End revision `c7dfc58` to
the approved UAT/demo runtime, and the deployed Help binding probe passed at
both viewports. The subsequent workflow-only Front-End revision `e139e5a`
deployed successfully in run `102`; accepted visual evidence remains anchored
to `c7dfc58`. The four raw/annotated files are privacy-reviewed and use only
synthetic fixture content; no general functional UAT was rerun.
The dedicated capture follow-up on `e139e5a` (run `2`) independently passed
the public Community pair at both target viewports and uploaded a temporary
artifact, but authenticated inputs were missing; that temporary output was not
promoted or counted as additional visual completion.

| Binding set | Current UAT evidence |
|---|---|
| B03/result | `/qr` accepted the namespaced positive code and returned `data-status=VERIFIED`; the capture test passed 2/2 viewports with marker selectors `.qr-header`, `[data-testid="verification-result"]` and `.qr-result-details` in order. |
| B08/feed | `/community` rendered the public synthetic feed; the capture test passed 2/2 viewports with marker selectors `.community-content`, the DOCS_UAT post header and its post-action controls in order. |
| Database/fixture safety | `DOCS_UAT_FIXTURES_VALID`; `LEGACY_DEMO_DATA_PRESENT` is acknowledged and preserved; `UNCLASSIFIED_NEW_DATA=false`; provider side effects were denied and none occurred. |

## 2026-09-03 targeted production verification

The public Help/Journey Center bindings and the two public B04 reuse aliases
were checked after Front-End revision
`78646d724e93e18a15a5b729aa29c15530f1c494` was deployed by GitHub Actions run
`91`; the B03/open binding was then deployed on revision
`303d8168abfbce84919bd7ccf71a69b91aa1639e` by run `92`, and the B03/enter-code
binding was deployed on revision
`91f545e25dc6812ed1c6cd4fb5fb41e234b3af34` by run `93`:
`https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33732087732`.
B09/shop was deployed on revision `65842923f7c3b33a3176653d651ff4c6a53b89e2`
by run `94`:
`https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33734823773`.

| Binding set | Rendered production evidence |
|---|---|
| B01, B02, B04, B09, S07 | Public Help/Journey Center routes inspected at Desktop `1440x900` and Mobile `390x844`; all selected Desktop/Mobile assets were complete, readable and HTTP `200`. |
| A01, A05, A09 | Approved run `90` baseline: protected Admin Help routes were inspected inside the Admin shell at Desktop `1440x900` and Mobile `390x844`; all selected Desktop/Mobile assets were complete, readable and HTTP `200`. |
| B04 public reuse | `/help/buyer/first-purchase/discover` and `/product-detail` returned `200` at both target viewports; the expected reused assets loaded at `1440x900` and `390x844` and marker numbers `1,2,3` rendered in order. |
| B03/open public binding | `/help/qr/verify-product/open` returned `200` at both target viewports; the expected Desktop/Mobile asset loaded at exact natural dimensions and marker numbers `1,2,3` rendered in order. The guest session had no cookies or storage entries and no code was submitted. |
| B03/enter-code public binding | `/help/qr/verify-product/enter-code` returned `200` at both target viewports; the expected Desktop/Mobile asset loaded at exact natural dimensions and marker numbers `1,2,3` rendered in order. The guest session had no cookies or storage entries and no code was entered or submitted. |
| B09/shop public reuse | `/help/buyer/livestream/shop` loaded successfully at both target viewports; the accepted B02 product-detail Desktop/Mobile asset completed at exact natural dimensions and marker numbers `1,2,3` rendered in order. The live-origin product-detail state was inspected read-only; no purchase, chat or live-session mutation was performed. |
| Admin reuse probe | The three Admin reuse routes selected the expected assets and marker numbers in both viewports with the test-role harness; approved Admin-session visual verification remains pending. |
| B02 detail/choose remediation | Mobile marker guidance now matches the visible image: product image, name/price, then variant selector. Desktop retains product media, variant/quantity, then AntiFake verification. |

No evidence-pending placeholder, broken image, stale image, PII exposure,
unexplained marker or marker-order mismatch was observed in the checked public
scope or accepted baseline. This verification does not claim the remaining
unaccepted journey steps are visually complete.

An additional read-only Playwright smoke against deployed revision
`78646d724e93e18a15a5b729aa29c15530f1c494` passed 12/12 public Help/Journey
checks at Desktop `1440x900`. The targeted B04 reuse probe passed at both
Desktop and Mobile; the smoke did not exercise fixture-backed or
provider-dependent flows, and the Admin aliases still lack approved-session
evidence.

## Authenticated capture re-evaluation — 2026-09-05

The UAT capture harness now reads only the six role-scoped
`ANTIFAKE_UAT_*` variables, authenticates through the real login surface,
checks the server role and expected route, and loads a fresh temporary
Playwright storage state for each role. State files are ignored, are not
uploaded with capture artifacts and are removed when the context closes.

The current capture process reported Buyer, Seller and Admin credential
availability as false. No new visual was promoted or counted. Existing
accepted bindings and the `DOCS_UAT` fixture graph remain unchanged; no legacy
data or provider operation was touched.

```text
AUTHENTICATED_CAPTURE_STATUS=RUNTIME_INPUTS_UNAVAILABLE_TO_CURRENT_SHELL
NEWLY_ACCEPTED_VISUALS=0
VISUAL_GOAL_REMAINS_OPEN=YES
```

Post-deploy UAT verification completed against Front-End SHA
`7e51de3272e4d19a5cf3d11f24366354a282bf06` (Actions run `33948126984`). Fresh
Desktop and Mobile browser contexts loaded the five new served bindings with
non-zero image dimensions; Admin bindings were checked after real Admin login.
Buyer/Admin capture packs passed in both viewports. Seller remains blocked by
the observed HTTP 401 and no provider or legacy-data mutation was performed.

The current UAT deployment SHA `79313d79ab8edbfc1cdc9fc7118e7bce5d0dd7df`
was exercised by capture run `33941303277`. Four public pairs passed and eight
authenticated/QR cases were skipped because the three role inputs were not
available to CI. Existing bindings remain unchanged; no new visual was
accepted.

The authenticated context helper was corrected in deployed Front-End commit
`8c5d027ba4e82ad0e4947e787c2b7672f9c3c884` to pass the configured UAT base URL
to both fresh browser contexts. Capture run `33941840279` completed with four
public pairs passed and eight authenticated/QR cases skipped because all three
role inputs were unavailable. No visual binding or accepted count changed.

## Authenticated UAT visual checkpoint - 2026-09-05 (current)

The local runner loaded the approved role-scoped inputs without logging their
values. Buyer and Admin real-login sessions passed; the Seller input was
available but login returned HTTP 401. Captures used isolated Playwright
contexts at Desktop `1440x900` and Mobile `390x844`.

The following six current bindings are accepted after raw/annotated review:

| Step | Served Desktop | Served Mobile | Raw + annotated evidence | Privacy / marker result |
|---|---|---|---|---|
| B04/order | `/journey-visuals/b05-order-detail-desktop.png` | `/journey-visuals/b05-order-detail-mobile.png` | Reuses `docs/images/order/b05-order-detail-desktop-uat-20260905.png`, `docs/images/order/b05-order-detail-mobile-uat-20260905.png` and their `-annotated` copies | Same synthetic completed-order state as B05/detail; markers 1-3 explained |
| B05/list | `/journey-visuals/b05-orders-desktop.png` | `/journey-visuals/b05-orders-mobile.png` | `docs/images/order/b05-orders-desktop-uat-20260905.png`, `docs/images/order/b05-orders-mobile-uat-20260905.png` and their `-annotated` copies | Synthetic order graph; markers 1-3 explained |
| B05/detail | `/journey-visuals/b05-order-detail-desktop.png` | `/journey-visuals/b05-order-detail-mobile.png` | `docs/images/order/b05-order-detail-desktop-uat-20260905.png`, `docs/images/order/b05-order-detail-mobile-uat-20260905.png` and their `-annotated` copies | Synthetic recipient/product/shipping data; markers 1-3 explained |
| B07/open | `/journey-visuals/b07-chat-open-desktop.png` | `/journey-visuals/b07-chat-open-mobile.png` | `docs/images/chat/b07-chat-open-desktop-uat-20260905.png`, `docs/images/chat/b07-chat-open-mobile-uat-20260905.png` and their `-annotated` copies | Synthetic seeded history only; markers 1-3 explained |
| A02/search | `/journey-visuals/admin-users-desktop.png` | `/journey-visuals/admin-users-mobile.png` | `docs/images/admin/a02-users-desktop-uat-20260905.png`, `docs/images/admin/a02-users-mobile-uat-20260905.png` and their `-annotated` copies | DOCS_UAT-filtered synthetic row; markers 1-3 explained |
| A02/detail | `/journey-visuals/admin-user-detail-desktop.png` | `/journey-visuals/admin-user-detail-mobile.png` | `docs/images/admin/a02-user-detail-desktop-uat-20260905.png`, `docs/images/admin/a02-user-detail-mobile-uat-20260905.png` and their `-annotated` copies | Synthetic review user; markers 1-3 explained |

The same deployed evidence also closes four exact state reuses:

| Step | Reused evidence | Runtime / privacy result |
|---|---|---|
| B04/order | B05/detail Desktop/Mobile pair | Same synthetic completed-order route/state; no new data or mutation |
| ADMIN-REVIEW/dashboard | A01 dashboard Desktop/Mobile pair | Real Admin-session UAT capture; markers 1-3 visible at both viewports |
| ADMIN-REVIEW/product-review | A05 product-review Desktop/Mobile pair | Real Admin-session UAT capture filtered to `DOCS_UAT`; markers 1-3 visible at both viewports |
| ADMIN-OPERATIONS/dashboard | A01 dashboard Desktop/Mobile pair | Real Admin-session UAT capture; markers 1-3 visible at both viewports |

Post-deploy UAT verification used Front-End SHA
`b6f076f48214712d6a59d1f3368b7f1167985bd2` from Actions run `33949213451`.
The isolated Admin capture pack passed at Desktop `1440x900` and Mobile
`390x844`; the real-login Help binding probe passed B04/order and all three
Admin reuse routes at both target viewports.

The authenticated Buyer profile/address and Admin wallet read-only routes also
rendered, but their captures were rejected by privacy review because they
exposed seed contact data or legacy financial/bank-account state. They are not
served bindings and do not change the accepted count.

The bracketed filename notation above means the same stem with and without
the `-annotated` suffix; the exact files and served-byte rule are listed in
the integrity table above. No credential, token, legacy record, financial
identifier or provider side effect is present in the accepted set. A04 detail
was not promoted because its synthetic KYC placeholder media is unavailable.

```text
NEWLY_ACCEPTED_VISUALS=9
FIXTURE_BLOCKED_BEFORE=57
FIXTURE_BLOCKED_AFTER=48
PROVIDER_BLOCKED_BEFORE=5
PROVIDER_BLOCKED_AFTER=5
CURRENT_COMPLETE_VISUAL_STEPS=26
CURRENT_REQUIRED_VISUAL_STEPS=79
CURRENT_REMAINING_VISUAL_STEPS=53
COVERAGE_PERCENT=32.91
VISUAL_GOAL_REMAINS_OPEN=YES
```
