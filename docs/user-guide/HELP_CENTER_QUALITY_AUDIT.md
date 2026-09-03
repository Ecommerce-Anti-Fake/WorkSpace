# AntiFake Help Center Quality Audit

Audit date: `2026-09-03`

This is the canonical step-level quality report for the Help Center and
Journey Center. It records the local remediation separately from historical
production evidence. A `PASS` row means the content contract, role placement,
asset binding and marker guidance are complete for that step; it does not mean
the whole journey has reached `VERIFIED` UAT.

## Status

```text
HELP_CENTER_QUALITY_STATUS=PARTIAL
VISUAL_GUIDANCE_STATUS=PASS_FOR_PUBLISHED_BINDINGS
ADMIN_HELP_ACCESS_STATUS=PASS_PRODUCTION
DOCUMENTATION_STATUS=COMPLETE_WITH_PRODUCTION_VERIFICATION
JOURNEY_CENTER_STATUS=PASS_PRODUCTION_TARGETED
VISUAL_EVIDENCE_STATUS=PASS_FOR_PUBLISHED_BINDINGS
GOAL_STATUS=COMPLETE_TARGETED_HELP_CENTER
```

## Inventory

| Scope | Articles | Steps |
|---|---:|---:|
| Buyer role | 8 | 27 |
| QR public journey | 1 | 3 |
| Seller role | 9 | 32 |
| Affiliate feature (within Seller S07) | 1 | 3 |
| Admin-only role | 12 | 26 |
| General/non-journey | 0 | 0 |
| **Total** | **30** | **88** |

## Quality totals

| Metric | Result | Notes |
|---|---:|---|
| Articles with title, purpose and role metadata | 30/30 | Automated content test |
| Steps with user-facing title and description | 88/88 | Automated content test |
| Steps classified as requiring a screenshot | 80 | Conservative classification: runnable action/status steps without an accepted visual are `TEXT_PLUS_SCREENSHOT`; unavailable Admin routes are `TEXT_ONLY` |
| Published visual step bindings | 12 | Previous ten bindings plus B04/discover and B04/product-detail through verified B02 visual reuse |
| Served visual assets | 20 | Ten Desktop/Mobile pairs |
| Required steps missing a final visual | 68 | Pending safe fixture/provider evidence; two B04 steps are complete through accepted visual reuse |
| Annotated visual assets | 20/20 | Every published pair has marker metadata and a written legend |
| Marker mismatches | 0 found | Automated number/guidance validation plus visual inspection of the accepted pairs |
| Missing marker explanations | 0 | Published visuals only |
| Wrong-role articles | 0 | Public and Admin registries are filtered by audience |
| Broken bound assets | 0 | Local asset existence test passes |
| Stale bound assets | 0 found | Historical assets remain explicitly labelled in the manifest |
| Responsive defects | 0 observed | Tested the accepted Help/Admin bindings at `1440x900` and `390x844` in production; unaccepted journey evidence remains blocked below |

The `68` remaining visuals are intentionally not treated as complete. They are
classified as `BLOCKED_FIXTURE`, `BLOCKED_PROVIDER` or `NOT_IMPLEMENTED` below.
The two public B04 reuse steps are complete because their page, state, role,
controls, instructional meaning, raw/annotated evidence and production
rendering were verified against the accepted B02 pairs. No screenshot was
fabricated from a non-equivalent state, and no production mutation was
performed to manufacture evidence.

## Audience and authorization

| Check | Local result |
|---|---|
| Public `/help` article catalog | Contains Buyer, Seller, QR and other public content; no Admin role filter or Admin card |
| Public search/category/deep link | Admin entries are excluded from the visible registry and legacy public Admin deep links do not resolve an Admin article |
| Admin catalog | `/admin/help` renders Admin-only articles inside `AdminLayout` |
| Admin navigation | Sidebar contains `Hướng dẫn` with `BookOpen`; Admin header Help control links to `/admin/help` |
| Guest | Redirected from `/admin/help` to `/auth` |
| Buyer | Redirected from `/admin/help` to `/` |
| Seller | Redirected from `/admin/help` to `/` |
| Admin | Allowed through the existing parent `ProtectedRoute roles=["admin"]` |

The route boundary is enforced by the existing protected Admin parent, not by
sidebar visibility. The production check is still required after deployment.

## Step-level coverage matrix

Legend: `Y` yes, `N` no, `-` not applicable, `PENDING` evidence not yet
accepted, `PASS` verified, `BLOCKED` fixture/provider boundary, `N/A` route is
not implemented. `SCREENSHOT_REQUIRED` uses the classifications requested by
the audit: published pairs are `DESKTOP_AND_MOBILE_SCREENSHOTS`, runnable
steps without a safe accepted pair are `TEXT_PLUS_SCREENSHOT`, and steps for a
missing feature route are `TEXT_ONLY`.

| ARTICLE_ID | ROLE | JOURNEY_ID | STEP_ID | TEXT_PRESENT | TEXT_COMPLETE | SCREENSHOT_REQUIRED | SCREENSHOT_PRESENT | ANNOTATION_REQUIRED | ANNOTATION_PRESENT | MARKERS | TEXT_MARKER_REFERENCES | DESKTOP_STATUS | MOBILE_STATUS | ROLE_LOCATION_CORRECT | AUTHORIZATION_CORRECT | BROKEN_ASSET | STALE_ASSET | PII_SAFE | FINAL_STATUS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B04 | buyer | B04 | discover | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B04 | buyer | B04 | product-detail | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B04 | buyer | B04 | add-to-cart | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B04 | buyer | B04 | cart | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2` | `1,2` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B04 | buyer | B04 | checkout | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_PROVIDER |
| B04 | buyer | B04 | order | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B05 | buyer | B05 | list | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B05 | buyer | B05 | detail | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B05 | buyer | B05 | next-action | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B01 | buyer | B01 | register | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B01 | buyer | B01 | profile | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B01 | buyer | B01 | address | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B02 | buyer | B02 | search | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B02 | buyer | B02 | detail | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B02 | buyer | B02 | choose | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B08 | buyer | B08 | feed | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B08 | buyer | B08 | interact | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B08 | buyer | B08 | report | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B06 | buyer | B06 | find | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B06 | buyer | B06 | check-conditions | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B06 | buyer | B06 | apply | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B07 | buyer | B07 | open | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B07 | buyer | B07 | send | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B07 | buyer | B07 | reconnect | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B09 | buyer | B09 | discover | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B09 | buyer | B09 | watch | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_PROVIDER |
| B09 | buyer | B09 | shop | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_PROVIDER |
| B03 | qr | B03 | open | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B03 | qr | B03 | enter-code | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B03 | qr | B03 | result | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S01 | seller | S01 | prepare | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S01 | seller | S01 | submit | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S01 | seller | S01 | approval | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S01 | seller | S01 | setup | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S03 | seller | S03 | basic-info | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S03 | seller | S03 | media | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S03 | seller | S03 | variant | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S03 | seller | S03 | submit | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S05 | seller | S05 | orders | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S05 | seller | S05 | confirm-order | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S05 | seller | S05 | prepare-order | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S05 | seller | S05 | ship-order | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S05 | seller | S05 | complete-order | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S05 | seller | S05 | revenue | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S02 | seller | S02 | profile | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S02 | seller | S02 | business | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S02 | seller | S02 | save | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S04 | seller | S04 | open | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S04 | seller | S04 | edit | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S04 | seller | S04 | moderation | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S08 | seller | S08 | balance | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S08 | seller | S08 | transactions | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S08 | seller | S08 | withdrawal | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S06 | seller | S06 | open | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S06 | seller | S06 | configure | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S06 | seller | S06 | review | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S07 | seller | S07 | program | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| S07 | seller | S07 | conversion | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S07 | seller | S07 | payout | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| S09 | seller | S09 | prepare | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_PROVIDER |
| S09 | seller | S09 | start | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_PROVIDER |
| S09 | seller | S09 | review | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_PROVIDER |
| A01 | admin | A01 | open | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| A01 | admin | A01 | read | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A02 | admin | A02 | search | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A02 | admin | A02 | detail | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A03 | admin | A03 | pending | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| A03 | admin | A03 | decision | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| A04 | admin | A04 | inspect | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A04 | admin | A04 | decision | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A05 | admin | A05 | pending | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| A05 | admin | A05 | decision | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A06 | admin | A06 | queue | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| A06 | admin | A06 | review | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| A07 | admin | A07 | find | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| A07 | admin | A07 | audit | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| A08 | admin | A08 | reconciliation | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A08 | admin | A08 | payout | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A09 | admin | A09 | list | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| A09 | admin | A09 | change | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| A10 | admin | A10 | observe | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| A10 | admin | A10 | record | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| ADMIN-REVIEW | admin | ADMIN-REVIEW | dashboard | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| ADMIN-REVIEW | admin | ADMIN-REVIEW | shop-review | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| ADMIN-REVIEW | admin | ADMIN-REVIEW | product-review | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| ADMIN-OPERATIONS | admin | ADMIN-OPERATIONS | dashboard | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| ADMIN-OPERATIONS | admin | ADMIN-OPERATIONS | review | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| ADMIN-OPERATIONS | admin | ADMIN-OPERATIONS | audit | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |

## Published visual bindings

| Step | Desktop asset | Mobile asset | Marker guidance |
|---|---|---|---|
| B01/register | `b01-registration-desktop.png` | `b01-registration-mobile.png` | `1` form heading; `2` identity fields; `3` consent/submit |
| B02/search | `b02-discovery-desktop.png` | `b02-discovery-mobile.png` | `1` category context; `2` discovery surface; `3` Flash Sale |
| B02/detail | `b02-product-detail-desktop.png` | `b02-product-detail-mobile.png` | Desktop: `1` product media; `2` variant/quantity; `3` AntiFake verification. Mobile: `1` product image; `2` name/price; `3` variant selector |
| B02/choose | `b02-product-detail-desktop.png` | `b02-product-detail-mobile.png` | Desktop: product media, variant controls, AntiFake verification. Mobile: product image, name/price before choosing, variant selector |
| B04/discover (reuse) | `b02-discovery-desktop.png` | `b02-discovery-mobile.png` | Reuses B02/search; production route, asset load and marker order verified at both target viewports |
| B04/product-detail (reuse) | `b02-product-detail-desktop.png` | `b02-product-detail-mobile.png` | Reuses B02/detail; production route, asset load and marker order verified at both target viewports |
| B04/cart | `b04-cart-desktop.png` | `b04-cart-mobile.png` | `1` cart quantity/badge; `2` quantity controls |
| B09/discover | `b09-live-discovery-desktop.png` | `b09-live-discovery-mobile.png` | `1` live section; `2` search/state controls; `3` live card |
| S07/program | `affiliate-program-desktop.png` | `affiliate-program-mobile.png` | `1` discovery tab; `2` program summary; `3` referral/join area |
| A01/open | `admin-dashboard-desktop.png` | `admin-dashboard-mobile.png` | `1` active Dashboard nav; `2` coordination area; `3` header identity/controls |
| A05/pending | `admin-product-review-desktop.png` | `admin-product-review-mobile.png` | `1` product-registration nav; `2` queue/filter; `3` list or empty state |
| A09/list | `admin-promotions-desktop.png` | `admin-promotions-mobile.png` | `1` voucher nav; `2` voucher status; `3` create/preview form |

All assets above are served from `Front-End/public/journey-visuals/` and are
checked by the content test. The Admin pairs are rendered only under
`/admin/help/...`; they are not part of the public article catalog.

## Production verification - 2026-09-03

The approved deployment and targeted production verification are complete. The
general `237/237` UAT was not rerun.

The Admin Help/authorization bullets and the ten baseline binding audit below
carry forward approved run `90` session evidence. Current run `91` evidence
covers the public smoke and the two public B04 reuse aliases; no approved Admin
session was available for a new current-revision visual sign-off.

| Evidence | Result |
|---|---|
| Front-End deployment | `78646d724e93e18a15a5b729aa29c15530f1c494` via GitHub Actions run `91` (`Deploy frontend to VPS`), conclusion `success` |
| Deployment URL | `https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33723971778` |
| WorkSpace audit commit | `834aefb` pushed before production verification; this report is reconciled in the follow-up documentation commit |
| Production revision evidence | Workflow pulled and reported the exact Front-End SHA; the live B02 Mobile guide served the platform-specific marker text from that revision |
| Viewports | Desktop `1440x900`; Mobile `390x844` with mobile emulation and touch |

### Public Help

- `/help` rendered successfully at both viewports with Buyer, Shop and QR
  categories. The Admin role, Admin links and Admin article text were absent.
- Public search for `Admin` returned `Chưa có bài phù hợp`; the legacy
  `/help/admin/admin-dashboard` URL remained on the public Help surface without
  exposing an Admin article.
- Buyer, Seller/Affiliate, QR and Journey Center deep links loaded; related
  and journey links contained no `/admin/help` target.

### Admin Help and authorization

- `/admin/help` rendered in the Admin shell with the `Hướng dẫn` sidebar item,
  active state and 12 Admin article cards. Admin search returned `Admin
  Dashboard` only for the matching query.
- Guest was redirected to `/auth`; Buyer and Seller were redirected to `/`;
  the approved Admin session was allowed through `/admin/help`.
- Direct `/admin/help/admin/admin-dashboard/open` navigation rendered A01.
  Desktop and Mobile Admin shell layouts stayed within the target viewport;
  Mobile `scrollWidth` was `390`.

### Rendered visual audit

The ten baseline published bindings were inspected as rendered production pages at both
viewports: B01/register, B02/search/detail/choose, B04/cart, B09/discover,
S07/program, A01/open, A05/pending and A09/list. All 20 selected images were
complete, readable, PII-safe and returned HTTP `200`; no evidence-pending
placeholder was present. Written marker guidance matched the visible markers in
order, with no missing or unexplained marker.

B02 product detail and choose now use platform-specific marker guidance:

- Desktop detail: product media, variant/quantity, AntiFake verification.
- Mobile detail: product image, name/price, variant selector.
- Mobile choose: product image, name/price before choosing, variant selector.

The public B04/discover and B04/product-detail reuse bindings were verified on
the deployed revision at Desktop `1440x900` and Mobile `390x844`. Each route
returned HTTP `200`, selected the expected reused Desktop/Mobile asset, loaded
at the target dimensions and rendered marker numbers `1,2,3` in order.

### Targeted final status

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

These statuses apply to the approved Help Center/Admin Help production goal
and its affected published bindings. The 68 unaccepted visual steps and
unimplemented Admin feature routes retain their terminal classifications below.

## Local visual-reuse checkpoint — 2026-09-03

The current Front-End branch adds five local metadata bindings that reuse
accepted, immutable Desktop/Mobile pairs already listed above:

| Local step | Reused accepted step | Production status |
|---|---|---|
| B04/discover | B02/search | Production-verified reuse at Desktop/Mobile; counts as complete |
| B04/product-detail | B02/detail | Production-verified reuse at Desktop/Mobile; counts as complete |
| ADMIN-REVIEW/dashboard | A01/open | Route/image smoke only with test role; approved Admin-session visual retest pending |
| ADMIN-REVIEW/product-review | A05/pending | Route/image smoke only with test role; approved Admin-session visual retest pending |
| ADMIN-OPERATIONS/dashboard | A01/open | Route/image smoke only with test role; approved Admin-session visual retest pending |

The local content test confirms platform paths, marker metadata, asset
existence and exact state-matched reuse. The public B04 aliases now have
production route/image/marker evidence and reduce the remaining work count to
68. No raw or annotated image was copied or regenerated. The Admin aliases do
not count until an approved Admin session verifies their production render.

## Remaining work

The following are explicit evidence blockers, not accepted quality defects:

- `BLOCKED_FIXTURE`: B03 positive QR, B04 cart/order completion, B05 order
  detail, B06 voucher eligibility, B07 synthetic two-session chat, B08
  PII-safe Community, S01-S06 seller fixtures, S07 conversion/payout, and
  A02/A04/A08 PII-safe Admin read sets.
- `BLOCKED_PROVIDER`: B04 PayOS/GHN completion, B09/S09 Agora lifecycle,
  Firebase-authenticated onboarding, upload/storage and payout-provider
  portions where applicable.
- `NOT_IMPLEMENTED`: A03 KYC, A06 moderation, A07 Order/Payment oversight and
  A10 audit/monitoring have no corresponding frontend route in the current
  product. Their Admin Help entries remain status-only and do not present
  executable instructions.

Do not create these visuals by mutating production data, using real payment or
payout flows, exposing identity documents, or copying unapproved customer
records. The fixture and provider requirements are recorded in
`DOCUMENTATION_EVIDENCE_MATRIX.md`.

## Local verification

The final local verification set for this remediation is:

```text
npm run test:help
npm run lint
npm run build
npx playwright test e2e/help-journey.spec.ts --project=desktop --project=mobile
```

Browser coverage includes public catalog/search/deep links, platform switching,
the ten accepted visual bindings, public Admin-content exclusion, and the
Guest/Buyer/Seller/Admin `/admin/help` access matrix at the configured Desktop
and Mobile viewports. The isolated Help-only DevTools pass reported no console
warnings or errors. A frontend-only Vite run can still log `Failed to fetch`
from existing API-backed shell widgets when the backend is not running; those
environment errors were not used as a Help feature verdict. Production run
`90` and `91` and their browser evidence are recorded above; no general
`237/237` rerun was performed.

A separate read-only Playwright smoke against deployed revision
`78646d724e93e18a15a5b729aa29c15530f1c494` passed 12/12 public Help/Journey
checks at Desktop `1440x900`. The targeted B04 reuse probe then passed at both
Desktop and Mobile; it did not exercise fixture-backed journeys or provider
flows, and the Admin aliases still lack approved-session evidence.
