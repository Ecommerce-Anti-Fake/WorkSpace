# AntiFake Journey Maps

These maps are internal traceability artifacts. Status is derived from the UAT
matrix; it is not inferred from route names.

## Canonical journey coverage

The Help registry uses the canonical journey IDs from the documentation
specification. This index deliberately keeps source-only and blocked journeys
visible instead of hiding them from the Help Center.

| ID | Role | Goal | Help route | Documentation status |
|---|---|---|---|---|
| B01 | Buyer | Account and first use | `/help/buyer/account-start` | PARTIAL |
| B02 | Buyer | Search and product discovery | `/help/buyer/discover` | PARTIAL |
| B03 | Buyer/QR | QR verification | `/help/qr/verify-product` | PARTIAL |
| B04 | Buyer | Complete purchase | `/help/buyer/first-purchase` | PARTIAL |
| B05 | Buyer | Order management | `/help/buyer/orders` | PARTIAL |
| B06 | Buyer | Voucher | `/help/buyer/voucher` | SOURCE_VERIFIED |
| B07 | Buyer | Chat with Shop | `/help/buyer/chat-shop` | PARTIAL |
| B08 | Buyer | Community | `/help/buyer/community` | PARTIAL |
| B09 | Buyer | Livestream | `/help/buyer/livestream` | PARTIAL |
| S01 | Seller | Shop registration | `/help/seller/register-shop` | SOURCE_VERIFIED |
| S02 | Seller | Shop setup | `/help/seller/shop-setup` | PARTIAL |
| S03 | Seller | Create product | `/help/seller/create-product` | PARTIAL |
| S04 | Seller | Product management | `/help/seller/manage-products` | PARTIAL |
| S05 | Seller | Process order | `/help/seller/process-order` | PARTIAL |
| S06 | Seller | Shop voucher | `/help/seller/voucher` | PARTIAL |
| S07 | Seller | Affiliate | `/help/seller/affiliate` | PARTIAL |
| S08 | Seller | Wallet and revenue | `/help/seller/wallet` | PARTIAL |
| S09 | Seller | Livestream selling | `/help/seller/livestream` | PARTIAL |
| A01 | Admin | Dashboard | `/help/admin/admin-dashboard` | PARTIAL |
| A02 | Admin | User management | `/help/admin/admin-users` | PARTIAL |
| A03 | Admin | KYC | `/help/admin/admin-kyc` | NOT_IMPLEMENTED |
| A04 | Admin | Shop review | `/help/admin/admin-shop-review` | PARTIAL |
| A05 | Admin | Product review | `/help/admin/admin-product-review` | PARTIAL |
| A06 | Admin | Moderation | `/help/admin/admin-moderation` | NOT_IMPLEMENTED |
| A07 | Admin | Order and payment oversight | `/help/admin/admin-orders` | NOT_IMPLEMENTED |
| A08 | Admin | Wallet and financial operations | `/help/admin/admin-wallet` | PARTIAL |
| A09 | Admin | Platform vouchers | `/help/admin/admin-promotions` | PARTIAL |
| A10 | Admin | Audit and monitoring | `/help/admin/admin-audit` | NOT_IMPLEMENTED |

The status column is documentation status, not a production sign-off. A
production read-only route inventory passed across Desktop/Laptop/Mobile for
the dashboard, users, Shop registrations, product registrations, vouchers,
wallet and withdrawal surfaces. Those journeys are `PARTIAL`; A03, A06, A07
and A10 are `NOT_IMPLEMENTED` in the current frontend route map because their
specific KYC, moderation, order/payment oversight and audit routes are absent.
The current
`Front-End/src/App.tsx` router also has no `/admin/kyc`, `/admin/moderation`,
`/admin/orders` or `/admin/audit` route, so these four entries are not claimed
as production workflows.

Read-only visual evidence is now accepted for A05 and A09 from Front-End
`9637e9f`, with matching raw and annotated Desktop/Mobile assets in the Visual
Manifest. The captures do not change either journey from `PARTIAL`.

## Buyer

### BUYER-FIRST-PURCHASE — PARTIAL

Authentication → Product discovery → Product detail → Variant → Cart → Address
→ Shipping → Voucher/affiliate when eligible → Server quote → Order → Tracking
→ Receive → Review

Open evidence: the production Buy Now path loaded the default address and GHN
shipping, then returned an authoritative quote (`201`, buyer payable
`158,001 VND`) across Desktop, Laptop and Mobile. The historical cart quote
`400` remains unresolved for a current cart fixture, and order mutation remains
unexecuted. Separately, the seeded demo cart passed a reversible quantity/badge
check (`2 -> 3 -> 2`, badge `7 -> 8 -> 7`) with cleanup verified. Payment and
final order/payment evidence remain open, so B04 stays `PARTIAL`. The cart
quantity/badge step now has matching sanitized Desktop and Mobile raw/annotated
captures registered in the Visual Manifest.

### BUYER-ORDER — PARTIAL

Account → Orders → Order detail → Server-owned status → Allowed next action

Read-only order surfaces passed in the authenticated smoke scope; mutation,
review and dispute paths remain pending.

### BUYER-QR-VERIFY — PARTIAL

QR page → Enter/scan code → Submit verification → Result → Risk/provenance action

The local and deployed paths send code/link input, or a decoded PNG/JPEG/WebP
image value, to the server-owned verification endpoint and render verified,
suspicious, inactive or not-found results. The isolated production code/link
and unknown-image checks returned `200 GET` with `NOT_FOUND` across Desktop,
Laptop and Mobile. Raw and deterministic annotated unknown-result evidence is
captured for Desktop `1440×900` and Mobile `390×844` in the Visual Manifest.
A known positive fixture plus final feature visual evidence are still pending,
so B03 stays `PARTIAL`.

## Seller

### SELLER-ONBOARDING — SOURCE_VERIFIED

User → Shop registration → Documents/KYC when required → Submit → Admin review
→ Approval/rejection → Shop setup → First product

Authenticated production walkthrough is pending.

### SELLER-FIRST-PRODUCT — SOURCE_VERIFIED

Shop Dashboard → Product create → Basic information → Media → Variant/SKU →
Price → Inventory → Submit → Review → Publish

Authenticated mutation and approval evidence is pending.

### SELLER-FIRST-ORDER — SOURCE_VERIFIED

Seller orders → Order detail → Confirm → Prepare → Shipping → Complete →
Wallet/revenue

The source and server controllers are present; production state transitions are
not signed off.

### SELLER-AFFILIATE — PARTIAL

Affiliate center → Open program → Join → Create/share code → Attribution →
Conversion → Commission/payout

The authenticated production program-discovery view and its Desktop/Mobile
Journey Center visuals are verified read-only evidence. Joining, attribution,
conversion and payout remain unverified.

## Admin

### ADMIN-REVIEW — PARTIAL

Active Admin session → Dashboard → User/KYC/Shop/Product review → Decision →
Audit/notification

The read-only dashboard, user, Shop-registration and product-registration route
inventory passed on all three target viewports. Decisions, mutations, KYC,
moderation, order/payment oversight and audit remain unverified; do not perform
a production role change or mutation just to obtain screenshots.
