# AntiFake Help Center Quality Audit

Audit date: `2026-09-04`

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
VISUAL_EVIDENCE_STATUS=PASS_FOR_PUBLISHED_BINDINGS_PLUS_UAT_B03_RESULT_B08_FEED_B09_SHELL
GOAL_STATUS=COMPLETE_TARGETED_HELP_CENTER
```

## Current UAT/demo fixture reconciliation — 2026-09-04

The owner confirmed `ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO` for the existing
AntiFake runtime and classified all pre-existing records as
`LEGACY_DEMO_DATA`. The guarded additive fixture system created only
`DOCS_UAT_MANAGED` rows; no legacy row was renamed, updated, deleted or reset.
The read-only verifier passed the Buyer/Seller/Admin graph, valid order
lifecycle states and positive QR provenance. The dedicated Playwright capture
test passed the B03 positive result and public B08 Community feed at Desktop
`1440x900` and Mobile `390x844`; both raw/annotated pairs are now registered
below and in `VISUAL_MANIFEST.md`. The same focused run passed the public
scheduled-live room-shell pair at both target viewports. That shell evidence is
kept as UAT evidence; it does not complete the Agora-dependent B09 watch step.
Front-End revision `c7dfc58` was deployed to the approved UAT/demo runtime by
GitHub Actions run `100`; the deployed Help binding probe passed all four
Desktop/Mobile B03/B08 checks.

```text
ANTIFAKE_CURRENT_ENVIRONMENT=UAT_DEMO
DATA_CLASSIFICATION=LEGACY_DEMO_PLUS_DOCS_UAT_MANAGED
OWNER_MIXED_DATA_CLASSIFICATION=CONFIRMED
SEPARATE_UAT_PROVISIONING_REQUIRED=NO
DESTRUCTIVE_RESET_ALLOWED=NO
DOCS_UAT_FIXTURES_VALID=YES
UNCLASSIFIED_NEW_DATA=NO
PROVIDER_SIDE_EFFECTS=NONE
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
| Steps classified as requiring a screenshot | 79 | Conservative classification: runnable action/status steps without an accepted visual are `TEXT_PLUS_SCREENSHOT`; unavailable routes are `TEXT_ONLY`; B08/report is currently not implemented |
| Published visual step bindings | 17 | Previous accepted/reuse bindings plus the B03 positive-result and B08 Community UAT fixture bindings; scheduled-live shell remains temporary UAT evidence |
| Served visual assets | 26 | Thirteen unique Desktop/Mobile pairs; published steps may reuse an accepted pair |
| Required steps missing a final visual | 62 | Pending safe fixture/provider evidence; B03 result and B08 feed are complete in the owner-approved UAT/demo runtime; B08/report is not implemented |
| Annotated visual assets | 26/26 | Every served pair has marker metadata and a written legend |
| Marker mismatches | 0 found | Automated number/guidance validation plus visual inspection of the accepted pairs |
| Missing marker explanations | 0 | Published visuals only |
| Wrong-role articles | 0 | Public and Admin registries are filtered by audience |
| Broken bound assets | 0 | Local asset existence test passes |
| Stale bound assets | 0 found | Historical assets remain explicitly labelled in the manifest |
| Responsive defects | 0 observed | Tested the accepted Help/Admin bindings at `1440x900` and `390x844` in production; unaccepted journey evidence remains blocked below |

## Goal reconciliation — 2026-09-04

The original request classified 70 missing visuals. After the B09/shop
equivalent-state reuse and the DOCS_UAT B03/B08 captures, the current required
set is 79 screenshot steps: 17 are complete and 62 remain. The remaining work
needs additional fixture-backed browser captures, provider sandboxes or absent
product routes. The public scheduled-live shell is now capturable, but it is a
partial B09 state and does not change the final complete/missing totals while
Agora media lifecycle remains unverified.

| Field | Result |
|---|---:|
| Original missing required visuals | 70 |
| Final required visual steps | 79 |
| Final complete visual steps | 17 |
| Final remaining visual steps | 62 |
| Final blocked by fixture | 57 |
| Final blocked by provider | 5 |
| Final not applicable / not implemented | 9 |
| Overall accepted coverage | 21.52% (`17/79`) |

```text
OVERALL_VISUAL_COVERAGE_STATUS=COMPLETE_WITH_EXTERNAL_VISUAL_DEPENDENCIES
```

The `62` remaining visuals are intentionally not treated as complete. They are
classified as `BLOCKED_FIXTURE`, `BLOCKED_PROVIDER` or `NOT_IMPLEMENTED` below.
The two public B04 reuse steps, B09/shop and the public B03/open and
B03/enter-code entry steps are complete
because their page, state, role,
controls, instructional meaning, raw/annotated evidence and approved-runtime
rendering were verified against the accepted evidence. No screenshot was
fabricated from a non-equivalent state, and no production mutation was
performed to manufacture evidence. The B03 positive-result step is now backed
by a genuine server `VERIFIED` result from the owner-approved `DOCS_UAT`
fixture, and B08/feed is backed by a public synthetic `DOCS_UAT` feed capture;
the broader B03 and B08 features remain `PARTIAL` where additional product
behavior is not evidenced. The B09 scheduled shell has raw/annotated UAT pairs
with an in-frame marker contract, but the watch step remains
`BLOCKED_PROVIDER` for Agora media/join and authenticated realtime behavior.

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
sidebar visibility. The public target route passed after deployment; a new
approved Admin-session retest was not available.

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
| B08 | buyer | B08 | feed | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B08 | buyer | B08 | interact | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B08 | buyer | B08 | report | Y | Y | TEXT_ONLY | N | N | - | - | - | N/A | N/A | Y | Y | N | N | - | NOT_IMPLEMENTED |
| B06 | buyer | B06 | find | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B06 | buyer | B06 | check-conditions | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B06 | buyer | B06 | apply | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B07 | buyer | B07 | open | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B07 | buyer | B07 | send | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B07 | buyer | B07 | reconnect | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_FIXTURE |
| B09 | buyer | B09 | discover | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B09 | buyer | B09 | watch | Y | Y | TEXT_PLUS_SCREENSHOT | N | Y | N | - | - | BLOCKED | BLOCKED | Y | Y | N | N | PENDING | BLOCKED_PROVIDER |
| B09 | buyer | B09 | shop | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B03 | qr | B03 | open | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B03 | qr | B03 | enter-code | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
| B03 | qr | B03 | result | Y | Y | DESKTOP_AND_MOBILE_SCREENSHOTS | Y | Y | Y | `1,2,3` | `1,2,3` | PASS | PASS | Y | Y | N | N | Y | PASS |
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

## Published visual bindings and temporary UAT evidence

| Step | Desktop asset | Mobile asset | Marker guidance |
|---|---|---|---|
| B01/register | `b01-registration-desktop.png` | `b01-registration-mobile.png` | `1` form heading; `2` identity fields; `3` consent/submit |
| B02/search | `b02-discovery-desktop.png` | `b02-discovery-mobile.png` | `1` category context; `2` discovery surface; `3` Flash Sale |
| B02/detail | `b02-product-detail-desktop.png` | `b02-product-detail-mobile.png` | Desktop: `1` product media; `2` variant/quantity; `3` AntiFake verification. Mobile: `1` product image; `2` name/price; `3` variant selector |
| B02/choose | `b02-product-detail-desktop.png` | `b02-product-detail-mobile.png` | Desktop: product media, variant controls, AntiFake verification. Mobile: product image, name/price before choosing, variant selector |
| B04/discover (reuse) | `b02-discovery-desktop.png` | `b02-discovery-mobile.png` | Reuses B02/search; production route, asset load and marker order verified at both target viewports |
| B04/product-detail (reuse) | `b02-product-detail-desktop.png` | `b02-product-detail-mobile.png` | Reuses B02/detail; production route, asset load and marker order verified at both target viewports |
| B03/open | `b03-open-desktop.png` | `b03-open-mobile.png` | Public QR entry state; `1` method, `2` image upload, `3` verification action; production render verified at both target viewports |
| B03/enter-code | `b03-enter-code-desktop.png` | `b03-enter-code-mobile.png` | Public QR code-entry state; `1` selected Mã xác thực method, `2` verification-code field, `3` verification action; production render verified at both target viewports; no code entered |
| B04/cart | `b04-cart-desktop.png` | `b04-cart-mobile.png` | `1` cart quantity/badge; `2` quantity controls |
| B09/discover | `b09-live-discovery-desktop.png` | `b09-live-discovery-mobile.png` | `1` live section; `2` search/state controls; `3` live card |
| B09/shop (reuse) | `b02-product-detail-desktop.png` | `b02-product-detail-mobile.png` | Reuses B02/detail for the equivalent public product-detail state opened from live; `1,2,3` marker order verified at both target viewports |
| B09/watch-shell (temporary UAT evidence) | `b09-live-scheduled-shell-desktop-uat-20260904.png` | `b09-live-scheduled-shell-mobile-uat-20260904.png` | Shell-only pair: Desktop `1` player, `2` session summary, `3` right chat; Mobile `1` session summary, `2` title, `3` bottom chat; no Agora join or mutation |
| S07/program | `affiliate-program-desktop.png` | `affiliate-program-mobile.png` | `1` discovery tab; `2` program summary; `3` referral/join area |
| A01/open | `admin-dashboard-desktop.png` | `admin-dashboard-mobile.png` | `1` active Dashboard nav; `2` coordination area; `3` header identity/controls |
| A05/pending | `admin-product-review-desktop.png` | `admin-product-review-mobile.png` | `1` product-registration nav; `2` queue/filter; `3` list or empty state |
| A09/list | `admin-promotions-desktop.png` | `admin-promotions-mobile.png` | `1` voucher nav; `2` voucher status; `3` create/preview form |

Published assets above are served from `Front-End/public/journey-visuals/` and
are checked by the content test. The temporary B09 shell pair is WorkSpace
evidence only and is not a served Help binding. The Admin pairs are rendered
only under `/admin/help/...`; they are not part of the public article catalog.

## Production verification - 2026-09-03

The approved deployment and targeted production verification are complete. The
general `237/237` UAT was not rerun.

The Admin Help/authorization bullets and the ten baseline binding audit below
carry forward approved run `90` session evidence. Run `91` remains the public
smoke and B04 reuse evidence; run `92` covers the deployed B03/open binding;
run `93` covers the B03/open recheck and B03/enter-code binding; current run
`94` covers the B09/shop binding. No approved Admin session was available for a
new current-revision visual sign-off.

| Evidence | Result |
|---|---|
| Front-End deployment | `65842923f7c3b33a3176653d651ff4c6a53b89e2` via GitHub Actions run `94` (`Deploy frontend to VPS`), conclusion `success` |
| Deployment URL | `https://github.com/Ecommerce-Anti-Fake/Front-End/actions/runs/33734823773` |
| WorkSpace audit commit | Documentation follow-up remains local; no remote WorkSpace publication was requested |
| Production revision evidence | Workflow pulled and reported the exact Front-End SHA; the live B09/shop Help route served the reused B02 product-detail visual from that revision |
| Viewports | Desktop `1440x900`; Mobile `390x844` with mobile emulation and touch |

### Public Help

- `/help` rendered successfully at both viewports with Buyer, Shop and QR
  categories. The Admin role, Admin links and Admin article text were absent.
- Public search for `Admin` returned `Chưa có bài phù hợp`; the legacy
  `/help/admin/admin-dashboard` URL remained on the public Help surface without
  exposing an Admin article.
- Buyer, Seller/Affiliate, QR and Journey Center deep links loaded; related
  and journey links contained no `/admin/help` target.
- `/help/qr/verify-product/open` served the B03/open binding at Desktop and
  Mobile; the expected asset returned HTTP `200`, matched `1440x900` or
  `390x844`, and exposed marker numbers `1,2,3` with no console messages.
- `/help/qr/verify-product/enter-code` served the B03/enter-code binding at
  Desktop and Mobile; the expected asset returned HTTP `200`, matched
  `1440x900` or `390x844`, and exposed marker numbers `1,2,3` with no code
  entered or submitted.
- `/help/buyer/livestream/shop` served the B09/shop binding at Desktop and
  Mobile; the reused B02 product-detail asset rendered at `1440x900` and
  `390x844`, exposed marker numbers `1,2,3`, and the browser session had no
  console messages. The corresponding public live-origin product-detail state
  was inspected read-only; no purchase, chat or live-session mutation was
  performed.

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
placeholder was present. The separately captured B03/open and B03/enter-code
raw and annotated pairs are also complete, PII-safe and registered for their
production bindings.
Written marker guidance matched the visible markers in order, with no missing or
unexplained marker.

B02 product detail and choose now use platform-specific marker guidance:

- Desktop detail: product media, variant/quantity, AntiFake verification.
- Mobile detail: product image, name/price, variant selector.
- Mobile choose: product image, name/price before choosing, variant selector.

The public B04/discover and B04/product-detail reuse bindings were verified on
the deployed revision at Desktop `1440x900` and Mobile `390x844`. Each route
returned HTTP `200`, selected the expected reused Desktop/Mobile asset, loaded
at the target dimensions and rendered marker numbers `1,2,3` in order.

The deployed B09/shop Help route was verified on revision `6584292` / run `94`
at Desktop `1440x900` and Mobile `390x844`. It selected the same B02
product-detail Desktop/Mobile pair, rendered marker numbers `1,2,3`, and had
no console messages. The public live-origin product-detail route matched the
same state and controls; this does not certify Agora media, chat, checkout or
purchase behavior.

The deployed B03/open Help route was verified at Desktop `1440x900` and Mobile
`390x844`. The route selected `b03-open-desktop.png` or
`b03-open-mobile.png`, each image returned HTTP `200` at its exact target
dimensions, marker text rendered in `1,2,3` order, and the read-only browser
session had no cookies or storage entries. No verification code was submitted.

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

These statuses apply to the approved Help Center/Admin Help targeted goal
and its affected published bindings. The 62 unaccepted visual steps and
unimplemented Admin feature routes retain their terminal classifications below.

## Local visual-reuse checkpoint — 2026-09-03

The current Front-End branch adds six local metadata bindings that reuse
accepted, immutable Desktop/Mobile pairs already listed above, plus the new
public B03/open and B03/enter-code bindings backed by captured raw/annotated
pairs:

| Local step | Reused accepted step | Production status |
|---|---|---|
| B04/discover | B02/search | Production-verified reuse at Desktop/Mobile; counts as complete |
| B04/product-detail | B02/detail | Production-verified reuse at Desktop/Mobile; counts as complete |
| B09/shop | B02/detail | Production-verified live-origin product-detail reuse at Desktop/Mobile; counts as complete |
| B03/open | Public QR entry capture | Production-verified read-only binding at Desktop/Mobile; counts as complete |
| B03/enter-code | Public QR code-entry capture | Production-verified read-only binding at Desktop/Mobile; counts as complete; no code entered |
| B03/result | DOCS_UAT positive QR capture | Genuine server-verified UAT/demo result at Desktop/Mobile; raw and annotated pair accepted |
| B08/feed | DOCS_UAT Community feed capture | Genuine synthetic UAT/demo feed at Desktop/Mobile; raw and annotated pair accepted |
| ADMIN-REVIEW/dashboard | A01/open | Route/image smoke only with test role; approved Admin-session visual retest pending |
| ADMIN-REVIEW/product-review | A05/pending | Route/image smoke only with test role; approved Admin-session visual retest pending |
| ADMIN-OPERATIONS/dashboard | A01/open | Route/image smoke only with test role; approved Admin-session visual retest pending |

The local content test confirms platform paths, marker metadata, asset
existence and exact state-matched reuse. The public B04 aliases and both B03
entry/input bindings have production route/image/marker evidence. The new
DOCS_UAT B03 result pair was captured from the genuine server `VERIFIED` state
and the B08 feed pair from synthetic public content, both at the target
viewports. A current source/runtime audit also found no B08 report control or
form, so that step is `NOT_IMPLEMENTED` rather than fixture-blocked. Together
the captures reduce the current required remainder to 62 (57 fixture-backed
and 5 provider-dependent). The Admin aliases do not count until
an approved Admin session verifies their runtime render.

## Remaining work

The following are explicit evidence blockers, not accepted quality defects:

- `BLOCKED_FIXTURE`: B04 cart/order completion, B05 order
  detail, B06 voucher eligibility, B07 synthetic two-session chat, B08
  interaction, S01-S06 seller fixtures, S07 conversion/payout, and
  A02/A04/A08 PII-safe Admin read sets.
- `BLOCKED_PROVIDER`: B04 PayOS/GHN completion, B09/S09 Agora lifecycle,
  Firebase-authenticated onboarding, upload/storage and payout-provider
  portions where applicable.
- `NOT_IMPLEMENTED`: B08/report has no current Community control or form.
  A03 KYC, A06 moderation, A07 Order/Payment oversight and A10
  audit/monitoring have no corresponding frontend route in the current product.
  These Help entries remain status-only and do not present executable
  instructions.

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
the seventeen published visual bindings, public Admin-content exclusion, and the
Guest/Buyer/Seller/Admin `/admin/help` access matrix at the configured Desktop
and Mobile viewports. The isolated Help-only DevTools pass reported no console
warnings or errors. A frontend-only Vite run can still log `Failed to fetch`
from existing API-backed shell widgets when the backend is not running; those
environment errors were not used as a Help feature verdict. Production run
`90`, `91`, `93` and `94` and their browser evidence are recorded above. The
separate UAT/demo QR and Community capture passed 4/4 at Desktop and Mobile,
and deployed run `98` plus run `99` served the current bindings; no general
`237/237` rerun was performed.

A separate read-only Playwright smoke against deployed revision
`78646d724e93e18a15a5b729aa29c15530f1c494` passed 12/12 public Help/Journey
checks at Desktop `1440x900`. The targeted B04 reuse probe and the B09/shop
live-origin product-detail reuse probe then passed at both Desktop and Mobile;
they did not exercise fixture-backed journeys or provider flows, and the Admin
aliases still lack approved-session evidence.
