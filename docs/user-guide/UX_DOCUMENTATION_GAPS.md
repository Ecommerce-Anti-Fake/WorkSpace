# UX and Documentation Gaps

These gaps are recorded instead of being hidden by guide copy.

| ID | Feature/role | Current behavior | Expected behavior | Severity | Evidence | Recommended fix |
|---|---|---|---|---|---|---|
| DOC-001 | Help Center / all roles | No `/help` or deep-link documentation surface existed before this slice | Searchable role-aware Help Center and step deep links | Major | Source audit before this change | Keep registry, route, article coverage and contextual links in sync |
| DOC-002 | Buyer checkout | Historical cart quote returned `400`; the fail-closed fix is deployed, the Buy Now quote returns `201` across Desktop/Laptop/Mobile, and the seeded-demo cart badge passed `7 -> 8 -> 7` with restoration; sanitized Desktop/Mobile cart badge visuals are now registered; no order was created | Retest cart quote and an approved order fixture | Critical | `docs/UAT_ISSUES.md` AF-B-003 and AF-UAT-010; `docs/UAT_REPORT.md` cart closeout; `docs/user-guide/VISUAL_MANIFEST.md` B04 cart badge | Keep cart checkout/order sign-off blocked; do not treat the badge or Buy Now read-only pass as full purchase sign-off |
| DOC-003 | Guest/Buyer QR | Code/link input and supported PNG/JPEG/WebP image uploads return server-owned states; local decoding and the deployed unknown-image negative path pass, while a known positive fixture remains incomplete | Verify a known positive deployed state and capture the feature at both viewports | Major | `docs/UAT_ISSUES.md` AF-Q-001; `Front-End/e2e/qr-verification.spec.ts`; deploy run `32806940404` | Keep B03 `PARTIAL`; do not publish QR feature visuals yet |
| DOC-004 | Admin | Read-only Admin route inventory is production-verified across Desktop/Laptop/Mobile; sanitized A01, A05 and A09 Desktop/Mobile visuals are accepted, while A03, A06, A07 and A10 are NOT_IMPLEMENTED and remaining decisions/mutations are unverified | Implement or replace the missing Admin routes, then complete remaining journeys with approved fixtures and capture sanitized visuals | Major | `docs/UAT_REPORT.md`, `docs/UAT_TEST_MATRIX.md`, `docs/user-guide/VISUAL_MANIFEST.md`, `docs/UAT_ISSUES.md` AF-AD-003 | Keep implemented read-only journeys `PARTIAL`; keep absent routes `NOT_IMPLEMENTED`; run only approved read-only or sandboxed mutation checks |
| DOC-005 | All core journeys | Public Help Center raw/annotated Desktop/Mobile assets now exist, and B03 unknown-result UAT assets are captured, but verified feature-step assets remain incomplete | Capture original and annotated images at the correct viewport after each journey is verified | Major | `docs/user-guide/VISUAL_MANIFEST.md` | Keep B03 negative-result assets separate from final positive-flow visuals; reuse the deterministic annotation pattern during verified UAT |
| DOC-006 | Seller onboarding/product/order | Source routes and controllers exist, but authenticated mutation walkthroughs are not signed off | Verify each state transition with an approved seller fixture | Major | `docs/UAT_TEST_MATRIX.md` AF-S rows | Continue the existing UAT lifecycle; do not mark guide content complete from source alone |
| DOC-007 | Seller onboarding | Seller Dashboard exposes a checklist derived from Shop, offer, voucher and order state; authenticated read-only Seller evidence now exists, but mutation/state-transition and final visual evidence remain pending | Verify state transitions with an approved seller fixture and capture both viewport assets | Major | `Front-End/src/components/dashboard/sellerGettingStarted.tsx`, `test/seller-getting-started.test.mjs`, `docs/UAT_REPORT.md` 2026-08-27 Seller follow-up | Keep mutation/provider gates and checklist evidence separate; keep checklist incomplete on data errors |
| DOC-008 | Buyer/Seller/Admin journey coverage | Help registry now exposes canonical B01-B09, S01-S09 and A01-A10 entries, but most authenticated and Admin journeys remain source-only or blocked | Complete role-specific UAT, then attach verified visuals and upgrade statuses selectively | Major | `docs/user-guide/JOURNEY_MAPS.md`, `docs/user-guide/SOURCE_AUDIT.md`, focused Help/Journey E2E | Keep source/runtime/documentation statuses separate; do not upgrade from route presence |
| DOC-009 | Buyer Community visuals | Public `/community` renders seeded author names and post content in the capture viewport | Capture with a PII-safe public fixture before publishing a B08 visual | Major | Production public route smoke passed; attempted capture intentionally discarded | Keep B08 visual `Pending`; do not redact or publish a raw production screenshot as if it were source evidence |
| DOC-010 | Buyer QR history | No server-backed verification-history route exists; the previously exposed sidebar target was replaced with supported `/qr` navigation in `3c512a8`, production-regressed 3/3 across Desktop/Laptop/Mobile | Implement a real history route and server-owned history state if the feature is required | Major | `Front-End/e2e/profile-navigation.spec.ts`; `docs/UAT_REPORT.md` and `docs/UAT_ISSUES.md` follow-up dated 2026-08-27 | Keep QR history out of verified guide claims until a real route, API and fixture exist |
| DOC-011 | Seller Wallet visual | Existing `ACTIVE_SELLER_UAT` session loaded `/seller/wallet` read-only with wallet/ledger and masked payout-account data; no approved PII-safe final capture target is registered | Provide an approved seller/staging capture target or authorized capture session, then publish raw plus separately annotated PII-safe Desktop/Mobile assets | Major | `docs/UAT_REPORT.md` authenticated Seller fixture follow-up; `docs/user-guide/VISUAL_MANIFEST.md`; prior attempt `AF-DOC-016` | Keep S08 runtime `PARTIAL` and its final visual `BLOCKED_EXTERNAL`; do not use unauthenticated or guessed data |
| DOC-012 | Buyer/Seller/Admin chat metadata | Chat messaging is implemented, but `chatHeader.tsx` records that avatar, verification and online fields are not returned by the backend; the UI uses a placeholder avatar | Return safe server-owned metadata where supported, then verify rendering and privacy behavior | Minor | `Front-End/src/components/message/chatHeader.tsx`; `docs/user-guide/SOURCE_AUDIT.md` backend/API/UI gap inventory | Keep chat guidance limited to supported thread/message behavior; do not claim verified identity or presence indicators |

### Current update - DOC-010

The dead `/profile/verify-history` navigation target has been replaced by the
supported `/qr` verification entry in Front-End commit `3c512a8`. The
production `e2e/profile-navigation.spec.ts` regression passed on Desktop,
Laptop and Mobile after the push. The separate QR verification-history
feature remains unimplemented and must not be claimed in the guide.

### Current update - DOC-002 and DOC-011

The cart-badge check is now complete as a reversible seeded-demo mutation, but
cart quote/order/payment evidence remains open. Seller wallet read-only runtime
is also confirmed with the existing seller fixture; only the final PII-safe
visual capture remains externally constrained by the approved capture-target
requirement.

### Current update - Help Center production verification

The targeted Help Center/Admin Help slice is now production-verified on
Front-End revision `723e550e95a570b5cf4ea2e14fb23eef16a3413d` after GitHub
Actions run `90`. Public role filtering, Admin exclusion, search, deep links,
Admin shell navigation, direct route protection and the accepted Desktop/Mobile
visual bindings passed the targeted browser audit. The B02 product-detail
Mobile marker mismatch found during verification was corrected and retested.

This closes the Help Center deployment gap for the affected published
bindings. It does not close the broader fixture/provider, mutation or missing
feature-route gaps recorded in DOC-002 through DOC-012.

## Scope note

This file records product/documentation gaps, not a replacement bug tracker. UAT
issues remain canonical in `docs/UAT_ISSUES.md`.
