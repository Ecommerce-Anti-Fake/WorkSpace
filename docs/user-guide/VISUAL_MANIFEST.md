# Visual Manifest

Original screenshots are evidence assets. Annotated screenshots are separate
documentation assets and must never overwrite originals.

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
| B09 discover | `/journey-visuals/b09-live-discovery-desktop.png` | `/journey-visuals/b09-live-discovery-mobile.png` | Public livestream discovery only; B09 remains `PARTIAL` |
| A01 open | `/journey-visuals/admin-dashboard-desktop.png` | `/journey-visuals/admin-dashboard-mobile.png` | Admin read-only dashboard shell only; A01 remains `PARTIAL` |
| A05 pending | `/journey-visuals/admin-product-review-desktop.png` | `/journey-visuals/admin-product-review-mobile.png` | Admin read-only product-registration queue only; A05 remains `PARTIAL` |
| A09 list | `/journey-visuals/admin-promotions-desktop.png` | `/journey-visuals/admin-promotions-mobile.png` | Admin read-only voucher workspace only; A09 remains `PARTIAL` |
| S07 program | `/journey-visuals/affiliate-program-desktop.png` | `/journey-visuals/affiliate-program-mobile.png` | Authenticated Affiliate program read-only view only; binding verified after deployment `622b1e9`; S07 remains `PARTIAL` |
| B04 cart | `/journey-visuals/b04-cart-desktop.png` | `/journey-visuals/b04-cart-mobile.png` | Local binding for the accepted seeded-cart Desktop/Mobile evidence at `8157ffa`; deployment and production retest pending; B04 remains `PARTIAL` |

Steps without a registered visual continue to show the evidence-pending
placeholder. These bindings do not upgrade a journey's UAT status.

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
| QR page unknown-result evidence | Desktop | `docs/images/qr/verification-desktop-production-a0b74c4.png` | `docs/images/qr/verification-desktop-production-a0b74c4-annotated.png` | 1440×900 | Production raw + deterministic annotation after `a0b74c4`; unknown fixture returns server-owned `NOT_FOUND`; UAT evidence only |
| QR page unknown-result evidence | Mobile | `docs/images/qr/verification-mobile-production-a0b74c4.png` | `docs/images/qr/verification-mobile-production-a0b74c4-annotated.png` | 390×844 | Production raw + deterministic annotation after `a0b74c4`; unknown fixture returns server-owned `NOT_FOUND`; UAT evidence only |
| Seller getting started checklist | Desktop/Mobile | Pending authenticated capture | Pending | 1440×900 / 390×844 | Capture only with an approved seller fixture; checklist state must match backend evidence |
| Guest Admin redirect | Desktop/Mobile | `docs/images/uat-guest-admin-redirect-*` | Do not publish as guide | 1440×900 / 390×844 | Security/UAT evidence only |

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
| B03 | `/help/qr/verify-product` | Desktop 1440×900 + Mobile 390×844 | `docs/images/qr/verification-desktop-production-a0b74c4.png`, `docs/images/qr/verification-mobile-production-a0b74c4.png` (UAT evidence only) | `docs/images/qr/verification-desktop-production-a0b74c4-annotated.png`, `docs/images/qr/verification-mobile-production-a0b74c4-annotated.png` (UAT evidence only) | Do not publish as final; production code/link/image negative paths are verified; raw and annotated unknown-result evidence is captured at both viewports; known positive fixture and final feature capture remain pending |
| B04 | `/help/buyer/first-purchase` | Desktop 1440×900 + Mobile 390×844 | `docs/images/buyer/cart-desktop-production-8157ffa.png`, `docs/images/buyer/cart-mobile-production-8157ffa.png` | `docs/images/buyer/cart-desktop-production-8157ffa-annotated.png`, `docs/images/buyer/cart-mobile-production-8157ffa-annotated.png` | Cart quantity/badge step is persistently captured and registered; `Pending`: cart quote/order/payment and full first-purchase evidence remain open, so B04 stays `PARTIAL` |
| B05 | `/help/buyer/orders` | Desktop 1440×900 + Mobile 390×844 | Pending matching buyer capture | Pending | Capture after buyer order evidence |
| B06 | `/help/buyer/voucher` | Desktop 1440×900 + Mobile 390×844 | Pending matching buyer capture | Pending | Capture after voucher runtime evidence |
| B07 | `/help/buyer/chat-shop` | Desktop 1440×900 + Mobile 390×844 | Pending matching buyer capture | Pending | Capture after buyer/shop chat evidence |
| B08 | `/help/buyer/community` | Desktop 1440×900 + Mobile 390×844 | Pending PII-safe public fixture | Pending | Public route passes, but current seeded feed renders author data; do not publish a screenshot until a PII-safe fixture exists |
| B09 | `/help/buyer/livestream` | Desktop 1440×900 + Mobile 390×844 | `docs/images/buyer/live-discovery-desktop-production-6b24be3.png`, `docs/images/buyer/live-discovery-mobile-production-6b24be3.png` | `docs/images/buyer/live-discovery-desktop-production-6b24be3-annotated.png`, `docs/images/buyer/live-discovery-mobile-production-6b24be3-annotated.png` | Public discovery shell captured cleanly; Pending provider, join, interaction and leave steps remain `PARTIAL` |
| S01 | `/help/seller/register-shop` | Desktop 1440×900 + Mobile 390×844 | Pending approved seller capture | Pending | Capture with approved seller registration fixture |
| S02 | `/help/seller/shop-setup` | Desktop 1440×900 + Mobile 390×844 | Pending approved seller capture | Pending | Capture after authenticated shop-setup evidence |
| S03 | `/help/seller/create-product` | Desktop 1440×900 + Mobile 390×844 | Pending approved seller capture | Pending | Capture after authenticated product-create evidence |
| S04 | `/help/seller/manage-products` | Desktop 1440×900 + Mobile 390×844 | Pending approved seller capture | Pending | Capture after authenticated product-management evidence |
| S05 | `/help/seller/process-order` | Desktop 1440×900 + Mobile 390×844 | Pending approved seller capture | Pending | Capture after seller order transition evidence |
| S06 | `/help/seller/voucher` | Desktop 1440×900 + Mobile 390×844 | Pending approved seller capture | Pending | Capture after seller voucher evidence |
| S07 | `/help/seller/affiliate` | Desktop 1440×900 + Mobile 390×844 | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a.png`, `affiliate-program-mobile-production-7e7a12a.png` | `docs/images/affiliate/affiliate-program-desktop-production-7e7a12a-annotated.png`, `affiliate-program-mobile-production-7e7a12a-annotated.png` | Authenticated program read-only evidence; binding post-deploy verified on `622b1e9`; join, conversion/payout and final journey sign-off remain `Pending` |
| S08 | `/help/seller/wallet` | Desktop 1440×900 + Mobile 390×844 | Read-only wallet/ledger and masked payout-account runtime exists; no approved PII-safe final capture target | Pending / `BLOCKED_EXTERNAL` for final asset | Capture after an approved PII-safe seller capture target is available; no wallet mutation |
| S09 | `/help/seller/livestream` | Desktop 1440×900 + Mobile 390×844 | Pending approved seller capture | Pending | Capture after seller livestream evidence |
| A01 | `/help/admin/admin-dashboard` | Desktop 1440×900 + Mobile 390×844 | `docs/images/admin/admin-dashboard-desktop-production-bb0eee1.png`, `admin-dashboard-mobile-production-bb0eee1.png` | `docs/images/admin/admin-dashboard-desktop-production-bb0eee1-annotated.png`, `admin-dashboard-mobile-production-bb0eee1-annotated.png` | Raw and annotated captures inspected and PII-safe; read-only A01 step only |
| A02 | `/help/admin/admin-users` | Desktop 1440×900 + Mobile 390×844 | Pending targeted Admin visual evidence | No final visual yet | Capture only after PII review |
| A03 | `/help/admin/admin-kyc` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |
| A04 | `/help/admin/admin-shop-review` | Desktop 1440×900 + Mobile 390×844 | Pending targeted Admin visual evidence | No final visual yet | Capture only after PII review |
| A05 | `/help/admin/admin-product-review` | Desktop 1440×900 + Mobile 390×844 | `docs/images/admin/admin-product-registrations-desktop-production-9637e9f.png`, `admin-product-registrations-mobile-production-9637e9f.png` | `docs/images/admin/admin-product-registrations-desktop-production-9637e9f-annotated.png`, `admin-product-registrations-mobile-production-9637e9f-annotated.png` | Raw and annotated captures inspected and PII-safe; read-only moderation queue only |
| A06 | `/help/admin/admin-moderation` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |
| A07 | `/help/admin/admin-orders` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |
| A08 | `/help/admin/admin-wallet` | Desktop 1440×900 + Mobile 390×844 | Pending targeted Admin visual evidence | No final visual yet | Capture only after PII review |
| A09 | `/help/admin/admin-promotions` | Desktop 1440×900 + Mobile 390×844 | `docs/images/admin/admin-vouchers-desktop-production-9637e9f.png`, `admin-vouchers-mobile-production-9637e9f.png` | `docs/images/admin/admin-vouchers-desktop-production-9637e9f-annotated.png`, `admin-vouchers-mobile-production-9637e9f-annotated.png` | Raw and annotated captures inspected and PII-safe; read-only voucher workspace only |
| A10 | `/help/admin/admin-audit` | Desktop 1440×900 + Mobile 390×844 | NOT_IMPLEMENTED: frontend route absent | No final annotated visual yet | Implement route or replace Help link before capture |

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
- QR B03 annotation legend: `1` QR method, `2` image upload control, `3`
  server-owned unknown-result state. These images use deterministic
  `UAT-QR-IMAGE-20260825` fixture and are not positive-verification evidence.
- B02 product-detail annotation legend: `1` product media, `2` product metadata
  and variant controls, `3` AntiFake information panel. These captures cover
  the public product-detail step only; they do not sign off the full discovery
  journey or authenticated actions.
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
