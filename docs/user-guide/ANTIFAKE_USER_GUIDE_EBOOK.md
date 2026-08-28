# AntiFake User Guide Ebook

> Evidence-scoped draft. This ebook is generated from the canonical Help and
> Journey documentation, but it is not a full production sign-off. A journey
> is publishable only at the status recorded below.

**Documentation status:** `IN_PROGRESS`
**Current deployed Help/Journey revision:** Front-End `8157ffa`
**Backend evidence revision:** `3b59ab9`
**Last public verification:** 2026-08-27

The annotated feature captures remain pinned to their own capture revisions
in the Visual Manifest. The deployed `8157ffa` revision retains the accepted
Journey Center bindings, the public footer verification deep link and the
regression guard for absent Admin journeys and their unavailable deep-link
state; it does not retroactively change
the capture revision of those screenshots.

## How to read this ebook

Use the role, journey and step sequence. Open the linked Help article for the
interactive Journey Center version. `VERIFIED` means the stated runtime scope
has matching evidence; `SOURCE_VERIFIED` means source and permissions were
reviewed but runtime is incomplete; `PARTIAL` means only a meaningful subset
passed; `UNVERIFIED` means evidence is insufficient; `BLOCKED_EXTERNAL` means
the required fixture or credential is unavailable.

The ebook never replaces authentication, authorization, payment, KYC, wallet,
upload or provider controls. Do not infer a successful order, payout or review
from a guide article.

## Buyer journeys

| ID | Journey | Step sequence | Status | Help article |
|---|---|---|---|---|
| B01 | Account and first use | Register → sign in → profile/address | `PARTIAL` | [`account-start`](/help/buyer/account-start) |
| B02 | Search and discovery | Search → product detail → shop/offer context | `PARTIAL` | [`discover`](/help/buyer/discover) |
| B03 | QR verification | Enter code/link → submit → result → provenance/risk action | `PARTIAL` | [`verify-product`](/help/qr/verify-product) |
| B04 | Complete purchase | Product → variant → cart → address → voucher → quote → payment | `PARTIAL` | [`first-purchase`](/help/buyer/first-purchase) |
| B05 | Order management | Order list → detail → status → receive/review/dispute | `PARTIAL` | [`orders`](/help/buyer/orders) |
| B06 | Voucher | Inspect eligibility → apply → confirm server total | `SOURCE_VERIFIED` | [`voucher`](/help/buyer/voucher) |
| B07 | Chat with Shop | Open thread → send message → refresh/reconnect | `PARTIAL` | [`chat-shop`](/help/buyer/chat-shop) |
| B08 | Community | Browse → post/comment/reply → report/moderate | `PARTIAL` | [`community`](/help/buyer/community) |
| B09 | Livestream | Discover → open stream → interact → leave | `PARTIAL` | [`livestream`](/help/buyer/livestream) |

### Buyer evidence notes

- B03 code/link and unknown-image negative-path verification is production-tested
  across Desktop, Laptop and Mobile. The isolated code and deterministic image
  fixture return server-owned `NOT_FOUND`. Local and deployed image decoding
  support PNG, JPEG and WebP files up to 5 MB. A known positive production
  fixture remains open, so the journey stays `PARTIAL`.
- B04 had a historical cart quote `400` after shipping loaded. The local
  fail-closed fix is deployed, and the authenticated production Buy Now path
  now passes on Desktop, Laptop and Mobile: GHN shipping loaded and the
  server-owned quote returned `158,001 VND`. A reversible seeded-demo cart
  check also passed at Desktop/Laptop/Mobile: one line changed `2 -> 3 -> 2`
  and the header badge changed `7 -> 8 -> 7`, with cleanup restoring the
  baseline. Cart quote coverage, order mutation and payment remain open. No
  order is claimed by this ebook.
- The cart quantity step has matching sanitized Desktop and Mobile annotated
  visuals at [`Desktop`](../images/buyer/cart-desktop-production-8157ffa-annotated.png)
  and [`Mobile`](../images/buyer/cart-mobile-production-8157ffa-annotated.png).
  They document badge/quantity feedback only; B04 remains `PARTIAL`.

#### B04 cart badge visuals

| Platform | Annotated visual |
|---|---|
| Desktop 1440x900 | ![Cart quantity badge on Desktop](../images/buyer/cart-desktop-production-8157ffa-annotated.png) |
| Mobile 390x844 | ![Cart quantity badge on Mobile](../images/buyer/cart-mobile-production-8157ffa-annotated.png) |

These images document the reversible quantity/badge check only. They do not
claim quote, order creation or payment evidence.

- Most buyer feature screenshots remain pending until the corresponding runtime
  journey is verified. The public B02 discovery subset below is an explicit
  partial exception; the Help Center shell captures are not product-flow
  evidence.
- B08 public route smoke passed, but the current seeded Community feed renders
  author data. No Community screenshot is published until a PII-safe fixture is
  available.
- B09 public `/live` discovery has matching Desktop/Mobile raw and annotated
  shell captures below. Provider setup, joining, interaction and leaving remain
  unverified.

## Seller journeys

| ID | Journey | Step sequence | Status | Help article |
|---|---|---|---|---|
| S01 | Shop registration | Account → shop application → documents/KYC → submit | `SOURCE_VERIFIED` | [`register-shop`](/help/seller/register-shop) |
| S02 | Shop setup | Approval → shop profile → business information → save | `PARTIAL` | [`shop-setup`](/help/seller/shop-setup) |
| S03 | Create product | Product → media → variant → price → inventory → submit | `PARTIAL` | [`create-product`](/help/seller/create-product) |
| S04 | Product management | Open offer → edit → moderate → publish state | `PARTIAL` | [`manage-products`](/help/seller/manage-products) |
| S05 | Process order | Seller orders → detail → confirm → prepare → ship → complete | `PARTIAL` | [`process-order`](/help/seller/process-order) |
| S06 | Shop voucher | Create → rules → schedule → enable/disable | `PARTIAL` | [`voucher`](/help/seller/voucher) |
| S07 | Affiliate | Program → code → attribution → conversion → commission | `PARTIAL` | [`affiliate`](/help/seller/affiliate) |
| S08 | Wallet and revenue | Balance → payout account → withdrawal/COD settlement | `PARTIAL` | [`wallet`](/help/seller/wallet) |
| S09 | Livestream selling | Session → provider setup → host → comments/vouchers → leave | `PARTIAL` | [`livestream`](/help/seller/livestream) |

Seller source and permission boundaries are documented, but authenticated
runtime captures and state-transition evidence require an approved seller
fixture. No seller mutation is represented as production-verified here.

## Admin journeys

| ID | Journey | Step sequence | Status | Help article |
|---|---|---|---|---|
| A01 | Dashboard | Sign in → metrics → filters → detail | `PARTIAL` | [`admin-dashboard`](/help/admin/admin-dashboard) |
| A02 | User management | Search → inspect → permitted status action | `PARTIAL` | [`admin-users`](/help/admin/admin-users) |
| A03 | KYC | Queue → inspect documents → approve/reject | `NOT_IMPLEMENTED` | [`admin-kyc`](/help/admin/admin-kyc) |
| A04 | Shop review | Review application → decision → audit | `PARTIAL` | [`admin-shop-review`](/help/admin/admin-shop-review) |
| A05 | Product review | Inspect offer → approve/reject → publication state | `PARTIAL` | [`admin-product-review`](/help/admin/admin-product-review) |
| A06 | Moderation | Report queue → inspect → action → audit | `NOT_IMPLEMENTED` | [`admin-moderation`](/help/admin/admin-moderation) |
| A07 | Order/payment oversight | Search order → inspect payment/state → permitted action | `NOT_IMPLEMENTED` | [`admin-orders`](/help/admin/admin-orders) |
| A08 | Wallet operations | Inspect balance/ledger → permitted adjustment/withdrawal review | `PARTIAL` | [`admin-wallet`](/help/admin/admin-wallet) |
| A09 | Platform promotions | Voucher/category → rules → publish state | `PARTIAL` | [`admin-promotions`](/help/admin/admin-promotions) |
| A10 | Audit and monitoring | Filter audit trail → inspect event → export/review | `NOT_IMPLEMENTED` | [`admin-audit`](/help/admin/admin-audit) |

Admin production evidence is `PARTIAL`: the dashboard, users, Shop-registration,
product-registration, wallet and voucher read-only route inventory passed across
Desktop/Laptop/Mobile. A03, A06, A07 and A10 are NOT_IMPLEMENTED in the current
frontend route map; all decisions, mutations, withdrawals and provider actions
remain unverified. The current frontend router
does not define `/admin/kyc`, `/admin/moderation`, `/admin/orders` or
`/admin/audit`; the corresponding Help entries remain source-only until a route
and approved runtime target exist. The guide does not bypass the guard or invent
Admin evidence.

## Visual edition

The following assets are production evidence for the public documentation shell,
not proof of the underlying buyer, seller or Admin feature journeys:

- Desktop Help Center raw: `docs/images/guide/help/help-center-desktop-production-8157ffa.png`
- Desktop Help Center annotated: `docs/images/guide/help/help-center-desktop-production-8157ffa-annotated.png`
- Mobile Help Center raw: `docs/images/guide/help/help-center-mobile-production-8157ffa.png`
- Mobile Help Center annotated: `docs/images/guide/help/help-center-mobile-production-8157ffa-annotated.png`

The Visual edition also includes sanitized read-only Admin captures from
Front-End `9637e9f`: A05 product review and A09 platform promotions, each at
Desktop 1440x900 and Mobile 390x844. The raw files remain UAT evidence and the
annotated copies are the documentation assets:

- A05: `docs/images/admin/admin-product-registrations-desktop-production-9637e9f-annotated.png`, `admin-product-registrations-mobile-production-9637e9f-annotated.png`
- A09: `docs/images/admin/admin-vouchers-desktop-production-9637e9f-annotated.png`, `admin-vouchers-mobile-production-9637e9f-annotated.png`

They document route-load/read-only states only; moderation decisions and voucher
mutations remain unverified.

The existing Buyer first-purchase Journey Center shell captures remain non-final
for steps whose feature visual is still awaiting matching runtime evidence. The
B04 cart step now has accepted production raw/annotated Desktop/Mobile assets
and a production Journey Center binding retested on revision `13c18f4`. The
overview/start-step and Desktop/Mobile selector work at the required
`1440×900` and `390×844` viewports. These cart assets remain traceability
evidence, not full-purchase sign-off; checkout, order and payment evidence is
still pending.

#### A05 and A09 read-only Admin visuals

These annotated pairs show the inspected Admin product-review and
platform-promotion workspaces only. They do not document moderation decisions,
voucher mutations or other Admin writes.

| Journey | Desktop | Mobile |
|---|---|---|
| A05 Product review | ![Admin product review on Desktop](../images/admin/admin-product-registrations-desktop-production-9637e9f-annotated.png) | ![Admin product review on Mobile](../images/admin/admin-product-registrations-mobile-production-9637e9f-annotated.png) |
| A09 Platform promotions | ![Admin promotions on Desktop](../images/admin/admin-vouchers-desktop-production-9637e9f-annotated.png) | ![Admin promotions on Mobile](../images/admin/admin-vouchers-mobile-production-9637e9f-annotated.png) |

The Help Center shell assets listed above were refreshed from the current
deployed revision `8157ffa` after the shared Help/mobile contrast fix. The
earlier `3b504ba` pair remains historical evidence; neither pair is a
feature-flow sign-off. The later `a0b74c4` deployment corrected QR Help copy
but did not make the shell captures feature-flow screenshots.

B01 public authentication-entry evidence captured after Front-End revision
`6b24be3`:

- Desktop login raw/annotated: `docs/images/auth/login-desktop-production-6b24be3.png` and its `-annotated.png` copy.
- Mobile login raw/annotated: `docs/images/auth/login-mobile-production-6b24be3.png` and its `-annotated.png` copy.
- Desktop buyer-registration raw/annotated: `docs/images/auth/registration-desktop-production-6b24be3.png` and its `-annotated.png` copy.
- Mobile buyer-registration raw/annotated: `docs/images/auth/registration-mobile-production-6b24be3.png` and its `-annotated.png` copy.

These captures document the public authentication entry surfaces only. A
credentialed production read-only pass now covers `/profile` and
`/profile/address`; profile/address mutations, credentialed registration and
authenticated completion remain pending, so the ebook keeps B01 `PARTIAL`. The public `/register` route is the
seller Shop-registration boundary, not the buyer registration mode shown here.

B02 public product-detail step evidence captured after Front-End revision
`6b24be3`:

- Desktop raw: `docs/images/buyer/product-detail-desktop-production-6b24be3.png`
- Desktop annotated: `docs/images/buyer/product-detail-desktop-production-6b24be3-annotated.png`
- Mobile raw: `docs/images/buyer/product-detail-mobile-production-6b24be3.png`
- Mobile annotated: `docs/images/buyer/product-detail-mobile-production-6b24be3-annotated.png`

These assets document the verified public product-detail step only.

B02 public discovery subset captured after Front-End revision `6b24be3`:

- Desktop raw/annotated: `catalog-home`, `catalog-categories`,
  `catalog-category-results`, `catalog-search-results` and `shop-detail` pairs
  under `docs/images/buyer/`.
- Mobile raw/annotated: matching `catalog-home`, `catalog-categories`,
  `catalog-category-results`, `catalog-search-results` and `shop-detail` pairs
  under `docs/images/buyer/`.
- Source routes: `/`, `/categories`, the public category-filtered search,
  `/search?q=seed` and the public Shop detail route.
- Browser evidence: both viewports rendered with zero page errors, zero
  console errors/warnings and no 4xx/5xx responses.

This expands evidence for the public read-only discovery subset; B02 remains
`PARTIAL` because sorting, reviews, provenance actions and authenticated
purchase steps are not signed off.

B09 public livestream discovery shell captured after Front-End revision
`6b24be3`:

- Desktop raw/annotated: `docs/images/buyer/live-discovery-desktop-production-6b24be3.png` and its `-annotated.png` copy.
- Mobile raw/annotated: `docs/images/buyer/live-discovery-mobile-production-6b24be3.png` and its `-annotated.png` copy.

Both read-only browser captures were clean. They document discovery only and do
not claim provider, join, interaction or leave behavior.

### Accepted public journey visuals

The following annotated images are consumed from the same Visual Manifest by
the guide and ebook. They are placed next to the relevant journey evidence;
pending Seller, remaining Admin, checkout, QR-positive and provider steps
intentionally have no final feature screenshot.

#### A01 Admin dashboard

The read-only dashboard shell has matching Desktop and Mobile annotated captures
from the verified production revision `bb0eee1`. These images show navigation,
the coordination area and header controls; they do not prove Admin mutations.

**Desktop 1440×900**

![Admin dashboard on Desktop](../images/admin/admin-dashboard-desktop-production-bb0eee1-annotated.png)

**Mobile 390×844**

![Admin dashboard on Mobile](../images/admin/admin-dashboard-mobile-production-bb0eee1-annotated.png)

#### B01 account entry

| Platform | Annotated visual |
|---|---|
| Desktop | ![Buyer registration entry on Desktop](../images/auth/registration-desktop-production-6b24be3-annotated.png) |
| Mobile | ![Buyer registration entry on Mobile](../images/auth/registration-mobile-production-6b24be3-annotated.png) |

#### B02 public discovery and product detail

| Platform | Catalog discovery | Product detail |
|---|---|---|
| Desktop | ![Catalog discovery on Desktop](../images/buyer/catalog-home-desktop-production-6b24be3-annotated.png) | ![Product detail on Desktop](../images/buyer/product-detail-desktop-production-6b24be3-annotated.png) |
| Mobile | ![Catalog discovery on Mobile](../images/buyer/catalog-home-mobile-production-6b24be3-annotated.png) | ![Product detail on Mobile](../images/buyer/product-detail-mobile-production-6b24be3-annotated.png) |

#### B09 livestream discovery

| Platform | Annotated visual |
|---|---|
| Desktop | ![Livestream discovery on Desktop](../images/buyer/live-discovery-desktop-production-6b24be3-annotated.png) |
| Mobile | ![Livestream discovery on Mobile](../images/buyer/live-discovery-mobile-production-6b24be3-annotated.png) |

#### S07 Affiliate program

These annotated captures document the authenticated program-discovery step only;
joining, attribution, conversion and payout remain pending.

| Platform | Annotated visual |
|---|---|
| Desktop | ![Affiliate program on Desktop](../images/affiliate/affiliate-program-desktop-production-7e7a12a-annotated.png) |
| Mobile | ![Affiliate program on Mobile](../images/affiliate/affiliate-program-mobile-production-7e7a12a-annotated.png) |

B03 unknown-result UAT evidence, not final positive-flow visuals:

- Desktop raw: `docs/images/qr/verification-desktop-production-a0b74c4.png`
- Desktop annotated: `docs/images/qr/verification-desktop-production-a0b74c4-annotated.png`
- Mobile raw: `docs/images/qr/verification-mobile-production-a0b74c4.png`
- Mobile annotated: `docs/images/qr/verification-mobile-production-a0b74c4-annotated.png`

### Ebook visual levels

The ebook follows the specification's platform rules without promoting
pending assets to final feature evidence:

- **Level A — significant UI difference:** requires both Desktop and Mobile
  captures after the matching journey is runtime-verified. Checkout, Seller
  Dashboard, product management and order management remain pending here.
- **Level B — minor UI difference:** use a meaningful Desktop and Mobile
  capture when the difference affects the instruction; otherwise keep the
  shared explanation and register only the useful visual.
- **Level C — nearly identical UI:** do not duplicate equivalent screenshots;
  use one primary visual when runtime evidence confirms the platforms are
  materially the same.

The Visual Manifest is authoritative for viewport, revision, raw/annotated
separation and whether an asset is publishable.

## Help Center and Journey Center

The public Help Center is available at `/help`. Search by role, feature or
journey, then open the article. Journey Center deep links preserve the selected
step, show progress, provide previous/next navigation and offer Desktop/Mobile
selection with viewport-aware defaults. The real article-overview/start-step
state is deployed in Front-End `13c18f4` and was retested in production at
Desktop `1440×900` and Mobile `390×844`.
Where the registry has an accepted platform binding, the Journey Center
displays that matching annotated visual; steps without runtime evidence remain
visibly pending.

Contextual Help must deep-link to the relevant article or step. The QR link,
checkout link, seller process-order link and other contextual links are tracked
in the UAT matrix; authenticated surfaces remain evidence-scoped.

## Quick Guide

Use these short paths for common goals; they link to the same evidence-scoped
articles rather than creating a second source of truth:

- Buyer: QR check (B03), first purchase (B04), order tracking (B05), voucher
  (B06).
- Seller: Shop registration (S01), Shop setup (S02), first product (S03),
  first order (S05), Shop voucher (S06).

The status of each shortcut remains the status in the journey tables above.

## Troubleshooting

- If a private route redirects to authentication, use an approved active test
  identity; never bypass the guard.
- If checkout has no authoritative payable total, stop before placing an order
  and record the quote error; the fallback display is not sign-off.
- If a QR image cannot be read, try a clearer PNG, JPEG or WebP image under
  5 MB, or use the code/link tabs.
- If a Shop or Admin action is unavailable, check account, ownership and
  approval state against the server response.

## FAQ

### Does a visible route prove that a journey is ready?

No. Source, schema/state, permissions and matching runtime evidence are all
required for a `VERIFIED` claim.

### Can a Desktop screenshot be reused as a Mobile screenshot?

No. Mobile documentation requires a real Mobile viewport capture; resizing a
Desktop image is not equivalent evidence.

### Does this ebook sign off UAT?

No. `UAT_STATUS` and `DOCUMENTATION_STATUS` remain separate, and open or
blocked UAT rows stay open until their own evidence is complete.

## Glossary

- **Journey:** an ordered set of steps for one user goal.
- **Evidence:** source, test, runtime observation or screenshot tied to a
  deployment revision and scope.
- **Source verified:** source and permission boundaries were reviewed, but
  matching runtime evidence is incomplete.
- **Partial:** a meaningful subset passed while one or more important steps
  remain open.
- **Raw screenshot:** an unmodified UAT evidence capture.
- **Annotated screenshot:** a separate instructional copy of a raw capture.
- **Blocked external:** required credentials, fixture or provider state is
  unavailable; it is not a production success claim.

## Release gate

This ebook can become a final publication only after the matching UAT evidence,
deployment revision, raw Desktop/Mobile screenshots and separate annotations
exist for each claimed feature. Current blockers are recorded in:

- [`UAT_TEST_MATRIX.md`](../UAT_TEST_MATRIX.md)
- [`UAT_ISSUES.md`](../UAT_ISSUES.md)
- [`UAT_REPORT.md`](../UAT_REPORT.md)
- [`FEATURE_GUIDE_MATRIX.md`](FEATURE_GUIDE_MATRIX.md)
- [`DOCUMENTATION_REGISTRY.md`](DOCUMENTATION_REGISTRY.md)
- [`VISUAL_MANIFEST.md`](VISUAL_MANIFEST.md)

This draft is intentionally useful before full sign-off while keeping
`UAT_STATUS` and `DOCUMENTATION_STATUS` separate.
