# Visual Execution Inventory

Reconciled: 2026-09-03

This inventory is the execution baseline for the 70 rows that were missing a
final visual in `HELP_CENTER_QUALITY_AUDIT.md`. The eight A03/A06/A07/A10
steps are not repeated here because their current frontend routes are absent
and the audit already classifies them as `NOT_IMPLEMENTED` / `TEXT_ONLY`.

Source baselines checked:

- Front-End: `723e550e95a570b5cf4ea2e14fb23eef16a3413d`
- Back-End: `3b59ab9`
- Canonical evidence: `DOCUMENTATION_EVIDENCE_MATRIX.md`, `VISUAL_MANIFEST.md`
- Seed source: `back-end/prisma/seed.ts` and `back-end/prisma/seeds/*`

## Legend

`Y` means yes; `N` means no; `P` means partial/source-defined but not an
approved runtime state; `—` means not applicable. `D+M` means Desktop
`1440x900` and Mobile `390x844`. `RO` is read-only capture possible after the
listed state is available. “Safe state” means approved for a published
screenshot, not merely present in seed code.

## P0 — Buyer core journeys

| VISUAL_ID | ROLE | JOURNEY / STEP | HELP_ROUTE | FEATURE_ROUTE | CURRENT | ROUTE | SEED | SAFE STATE | RO | FIXTURE / MUTATION | PROVIDER | UNSAFE BOUNDARY | VIEW | DEPS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B04-discover | buyer | B04 / discover | `/help/buyer/first-purchase/discover` | `/` or `/search` | LOCAL_REUSE_PENDING_DEPLOY | Y | Y | Y via B02 visual | Y | Reuse accepted B02 discovery; none | — | — | D+M | B02 accepted asset and production verification |
| B04-product-detail | buyer | B04 / product-detail | `/help/buyer/first-purchase/product-detail` | `/product/:id` | LOCAL_REUSE_PENDING_DEPLOY | Y | Y | Y via B02 visual | Y | Reuse accepted B02 detail; none | — | — | D+M | B02 accepted asset and equivalent meaning |
| B04-add-to-cart | buyer | B04 / add-to-cart | `/help/buyer/first-purchase/add-to-cart` | `/product/:id` | BLOCKED_FIXTURE | Y | Y | N | N | Disposable cart state; controlled cart mutation + restore | — | No real customer cart/order | D+M | approved product/variant and cleanup |
| B04-checkout | buyer | B04 / checkout | `/help/buyer/first-purchase/checkout` | `/checkout` | BLOCKED_PROVIDER | Y | P | N | Y for quote shell only | Seller business fixture; no payment mutation | PayOS, GHN | No real charge or shipment booking | D+M | address, cart, authoritative quote |
| B04-order | buyer | B04 / order | `/help/buyer/first-purchase/order` | `/profile/orders/:id` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `ORDER_DETAIL_PII_SAFE_UAT`; read-only | — | No real order transition | D+M | sanitized completed order |
| B05-list | buyer | B05 / list | `/help/buyer/orders/list` | `/profile/orders` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `ORDER_DETAIL_PII_SAFE_UAT`; read-only | — | No real customer data | D+M | buyer session and owned order |
| B05-detail | buyer | B05 / detail | `/help/buyer/orders/detail` | `/profile/orders/:id` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `ORDER_DETAIL_PII_SAFE_UAT`; read-only | — | No real recipient/tracking data | D+M | completed synthetic order |
| B05-next-action | buyer | B05 / next-action | `/help/buyer/orders/next-action` | `/profile/orders/:id` | BLOCKED_FIXTURE | Y | P | N | Y after sanitization | Controlled order state if an action must be shown | — | No dispute/refund mutation on real order | D+M | documented backend state |
| B01-profile | buyer | B01 / profile | `/help/buyer/account-start/profile` | `/profile` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `ACTIVE_BUYER_UAT` plus sanitized capture state | Firebase Auth | No account mutation solely for evidence | D+M | approved buyer session |
| B01-address | buyer | B01 / address | `/help/buyer/account-start/address` | `/profile/address` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `ACTIVE_BUYER_UAT` plus disposable address state | Firebase Auth | No real recipient/address data | D+M | approved buyer session and cleanup |
| B06-find | buyer | B06 / find | `/help/buyer/voucher/find` | `/checkout` | BLOCKED_FIXTURE | Y | Y | N | Y after eligible fixture | Seller business + buyer cart fixture; read-only | — | No settlement | D+M | active voucher and catalog match |
| B06-check-conditions | buyer | B06 / check-conditions | `/help/buyer/voucher/check-conditions` | `/checkout` | BLOCKED_FIXTURE | Y | P | N | Y after eligible fixture | Seller business + eligible cart; read-only | — | No real discount liability | D+M | scope/minimum/order-date match |
| B06-apply | buyer | B06 / apply | `/help/buyer/voucher/apply` | `/checkout` | BLOCKED_FIXTURE | Y | P | N | N | Disposable cart; apply then restore | — | No financial settlement | D+M | server quote and cleanup |

## P0 — Buyer fixture-driven journeys

| VISUAL_ID | ROLE | JOURNEY / STEP | HELP_ROUTE | FEATURE_ROUTE | CURRENT | ROUTE | SEED | SAFE STATE | RO | FIXTURE / MUTATION | PROVIDER | UNSAFE BOUNDARY | VIEW | DEPS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B03-open | qr | B03 / open | `/help/qr/verify-product/open` | `/qr` | BLOCKED_FIXTURE | Y | P | N | Y after fixture | `QR_POSITIVE_LABEL_UAT`; read-only | — | No production label creation | D+M | active label and public route |
| B03-enter-code | qr | B03 / enter-code | `/help/qr/verify-product/enter-code` | `/qr` | BLOCKED_FIXTURE | Y | P | N | N | `QR_POSITIVE_LABEL_UAT`; enter disposable code | — | No plaintext/secret committed | D+M | private fixture code and cleanup |
| B03-result | qr | B03 / result | `/help/qr/verify-product/result` | `/qr` | BLOCKED_FIXTURE | Y | P | N | Y after fixture | `QR_POSITIVE_LABEL_UAT`; read-only result | — | No real product claim | D+M | active batch/link/provenance |
| B07-open | buyer | B07 / open | `/help/buyer/chat-shop/open` | `/chat` or `/messages` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `CHAT_SYNTHETIC_TWO_SESSION_UAT`; history read-only | Socket.IO / Redis | No real messages or participants | D+M | buyer/seller session and thread |
| B07-send | buyer | B07 / send | `/help/buyer/chat-shop/send` | `/chat/:roomId` | BLOCKED_FIXTURE | Y | Y | N | N | Synthetic text; controlled message mutation | Socket.IO / Redis | No real customer communication | D+M | two-session thread and cleanup |
| B07-reconnect | buyer | B07 / reconnect | `/help/buyer/chat-shop/reconnect` | `/chat/:roomId` | BLOCKED_FIXTURE | Y | P | N | N | Synthetic thread; transport recovery test | Socket.IO / Redis | No claim without second live session | D+M | real two-session runtime |
| B08-feed | buyer | B08 / feed | `/help/buyer/community/feed` | `/community` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `COMMUNITY_PUBLIC_SAFE_UAT`; read-only | — | No seeded author/customer data | D+M | synthetic public alias/post |
| B08-interact | buyer | B08 / interact | `/help/buyer/community/interact` | `/community` | BLOCKED_FIXTURE | Y | Y | N | N | Synthetic post; controlled reaction/comment if needed | — | No real content interaction | D+M | safe public post and cleanup |
| B08-report | buyer | B08 / report | `/help/buyer/community/report` | `/community` | BLOCKED_FIXTURE | Y | P | N | Y if form-only | `COMMUNITY_PUBLIC_SAFE_UAT`; show report form without submit | — | No harmful moderation report | D+M | report surface and safe cancellation |

## P1 — Seller core journeys

| VISUAL_ID | ROLE | JOURNEY / STEP | HELP_ROUTE | FEATURE_ROUTE | CURRENT | ROUTE | SEED | SAFE STATE | RO | FIXTURE / MUTATION | PROVIDER | UNSAFE BOUNDARY | VIEW | DEPS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S01-prepare | seller | S01 / prepare | `/help/seller/register-shop/prepare` | `/register` | BLOCKED_FIXTURE | Y | P | N | Y for form | `KYC_SYNTHETIC_DOCUMENT_UAT`; form/navigation only | Firebase Auth, Cloudinary | No real identity/KYC media | D+M | seller onboarding entry |
| S01-submit | seller | S01 / submit | `/help/seller/register-shop/submit` | `/register` | BLOCKED_FIXTURE | Y | P | N | N | Synthetic seller registration; controlled submit only | Firebase Auth, Cloudinary | No real business/KYC submission | D+M | approved sandbox and cleanup |
| S01-approval | seller | S01 / approval | `/help/seller/register-shop/approval` | `/register` or `/seller/shop-info` | BLOCKED_FIXTURE | Y | P | N | Y after fixture | Synthetic pending/approved status read-only | Firebase Auth | No real KYC decision | D+M | synthetic review state |
| S01-setup | seller | S01 / setup | `/help/seller/register-shop/setup` | `/seller/shop-info` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `SELLER_DISPOSABLE_BUSINESS_UAT`; read-only setup | — | No real business identity | D+M | owned disposable Shop |
| S02-profile | seller | S02 / profile | `/help/seller/shop-setup/profile` | `/seller/shop-info` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `SELLER_DISPOSABLE_BUSINESS_UAT`; read-only | — | No real Shop data | D+M | owned Shop and media |
| S02-business | seller | S02 / business | `/help/seller/shop-setup/business` | `/seller/business-info` | BLOCKED_FIXTURE | Y | Y | N | Y for form; N for saved mutation | Disposable business fields; controlled update if required | — | No real tax/KYC data | D+M | synthetic Shop fixture |
| S02-save | seller | S02 / save | `/help/seller/shop-setup/save` | `/seller/business-info` | BLOCKED_FIXTURE | Y | P | N | N | Controlled update then reload and cleanup | — | No real Shop mutation | D+M | deterministic cleanup |
| S03-basic-info | seller | S03 / basic-info | `/help/seller/create-product/basic-info` | `/seller/products` | BLOCKED_FIXTURE | Y | Y | N | Y for form | `SELLER_DISPOSABLE_BUSINESS_UAT`; draft form | — | No real product publish | D+M | owner Shop and category |
| S03-media | seller | S03 / media | `/help/seller/create-product/media` | `/seller/products` | BLOCKED_FIXTURE | Y | Y | N | N | Synthetic media only; upload cleanup | Cloudinary | No identity/customer media | D+M | approved upload sandbox |
| S03-variant | seller | S03 / variant | `/help/seller/create-product/variant` | `/seller/products` | BLOCKED_FIXTURE | Y | Y | N | Y for draft form | Disposable product/variant/stock | — | No real catalog mutation | D+M | draft state and stock |
| S03-submit | seller | S03 / submit | `/help/seller/create-product/submit` | `/seller/products` | BLOCKED_FIXTURE | Y | P | N | N | Controlled disposable product submit | Cloudinary | No production product publication | D+M | review route and cleanup |
| S04-open | seller | S04 / open | `/help/seller/manage-products/open` | `/seller/products` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | Reuse disposable product list | — | No real product data | D+M | S03 disposable product |
| S04-edit | seller | S04 / edit | `/help/seller/manage-products/edit` | `/seller/products/:offerId` | BLOCKED_FIXTURE | Y | Y | N | Y for form; N for save | Disposable product edit; restore/delete | Cloudinary if media | No real product mutation | D+M | owned disposable product |
| S04-moderation | seller | S04 / moderation | `/help/seller/manage-products/moderation` | `/seller/products/:offerId` | BLOCKED_FIXTURE | Y | P | N | Y after fixture | Read status from disposable product | — | No real moderation state | D+M | controlled status and ownership |
| S05-orders | seller | S05 / orders | `/help/seller/process-order/orders` | `/seller/orders` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `ORDER_FULFILLMENT_CONTROLLED_UAT`; read-only | — | No real customer order | D+M | seller-owned synthetic order |
| S05-confirm-order | seller | S05 / confirm-order | `/help/seller/process-order/confirm-order` | `/seller/orders/:orderId` | BLOCKED_FIXTURE | Y | P | N | N | Controlled transition only | — | No real order transition | D+M | actual backend transition rule |
| S05-prepare-order | seller | S05 / prepare-order | `/help/seller/process-order/prepare-order` | `/seller/orders/:orderId` | BLOCKED_FIXTURE | Y | P | N | N | Controlled transition only | — | No real order transition | D+M | prior transition and cleanup |
| S05-ship-order | seller | S05 / ship-order | `/help/seller/process-order/ship-order` | `/seller/orders/:orderId` | BLOCKED_FIXTURE | Y | P | N | N | Controlled transition; booking only in sandbox | GHN if booking | No production shipment booking | D+M | GHN sandbox or transition-only view |
| S05-complete-order | seller | S05 / complete-order | `/help/seller/process-order/complete-order` | `/seller/orders/:orderId` | BLOCKED_FIXTURE | Y | P | N | N | Controlled transition only | GHN if tracking | No real delivery completion | D+M | synthetic order lifecycle |
| S05-revenue | seller | S05 / revenue | `/help/seller/process-order/revenue` | `/seller/dashboard` or `/seller/wallet` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | Same controlled order; read-only revenue | — | No payout/settlement mutation | D+M | completed synthetic order |

## P1/P2 — Seller supporting operations

| VISUAL_ID | ROLE | JOURNEY / STEP | HELP_ROUTE | FEATURE_ROUTE | CURRENT | ROUTE | SEED | SAFE STATE | RO | FIXTURE / MUTATION | PROVIDER | UNSAFE BOUNDARY | VIEW | DEPS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S06-open | seller | S06 / open | `/help/seller/voucher/open` | `/seller/vouchers` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | `SELLER_DISPOSABLE_BUSINESS_UAT`; read-only | — | No real promotion | D+M | owned Shop and voucher |
| S06-configure | seller | S06 / configure | `/help/seller/voucher/configure` | `/seller/vouchers` | BLOCKED_FIXTURE | Y | Y | N | Y for form; N for save | Synthetic voucher form; controlled create | — | No customer-facing real promotion | D+M | scope/minimum/date rules |
| S06-review | seller | S06 / review | `/help/seller/voucher/review` | `/seller/vouchers` | BLOCKED_FIXTURE | Y | P | N | Y after fixture | Read list/status; cleanup if created | — | No live promotion | D+M | server response and cleanup |
| S08-balance | seller | S08 / balance | `/help/seller/wallet/balance` | `/seller/wallet` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | Disposable seller wallet read-only state | — | No wallet mutation | D+M | masked owner data |
| S08-transactions | seller | S08 / transactions | `/help/seller/wallet/transactions` | `/seller/wallet` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitization | Disposable seller ledger read-only state | — | No financial mutation | D+M | masked order references |
| S08-withdrawal | seller | S08 / withdrawal | `/help/seller/wallet/withdrawal` | `/seller/wallet` | BLOCKED_FIXTURE | Y | Y | N | Y for boundary/form only | Masked payout account; no submit | VietQR / payout | Production payout prohibited | D+M | approved payout sandbox for result |
| S07-conversion | seller | S07 / conversion | `/help/seller/affiliate/conversion` | `/seller/affiliate` or `/affiliate?tab=member` | BLOCKED_FIXTURE | Y | Y | N | Y after fixture | `AFFILIATE_CONVERSION_UAT`; read-only ledger | — | No financial liability | D+M | synthetic conversion attribution |
| S07-payout | seller | S07 / payout | `/help/seller/affiliate/payout` | `/seller/affiliate` | BLOCKED_FIXTURE | Y | P | N | Y for status only | Synthetic payout ledger; no execution | VietQR / payout | No real commission payout | D+M | payout status fixture |
| S09-prepare | seller | S09 / prepare | `/help/seller/livestream/prepare` | `/seller/live` | BLOCKED_PROVIDER | Y | Y | N | Y for form shell | `SELLER_DISPOSABLE_BUSINESS_UAT`; draft live form | Agora | No live session start | D+M | eligible offer/voucher |
| S09-start | seller | S09 / start | `/help/seller/livestream/start` | `/seller/live` | BLOCKED_PROVIDER | Y | P | N | N | Isolated channel only if UAT provider exists | Agora | No production broadcast | D+M | token/channel/config |
| S09-review | seller | S09 / review | `/help/seller/livestream/review` | `/seller/live` | BLOCKED_PROVIDER | Y | P | N | Y after provider run | Synthetic session status/read-only | Agora | No real viewer/order claim | D+M | provider lifecycle evidence |

## P3 — Affiliate and implemented Admin operations

| VISUAL_ID | ROLE | JOURNEY / STEP | HELP_ROUTE | FEATURE_ROUTE | CURRENT | ROUTE | SEED | SAFE STATE | RO | FIXTURE / MUTATION | PROVIDER | UNSAFE BOUNDARY | VIEW | DEPS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A01-read | admin | A01 / read | `/admin/help/admin/admin-dashboard/read` | `/admin` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | `ADMIN_PIISAFE_READ_SET`; read-only | — | No Admin mutation | D+M | KPI/read state and Admin session |
| A02-search | admin | A02 / search | `/admin/help/admin/admin-users/search` | `/admin/users` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | `ADMIN_PIISAFE_READ_SET`; alias-only users | — | No real user data | D+M | safe user list |
| A02-detail | admin | A02 / detail | `/admin/help/admin/admin-users/detail` | `/admin/users/:userId` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | `ADMIN_PIISAFE_READ_SET`; read-only | — | No role/status mutation | D+M | safe user detail |
| A04-inspect | admin | A04 / inspect | `/admin/help/admin/admin-shop-review/inspect` | `/admin/shop-registrations/:shopId` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | `ADMIN_PIISAFE_READ_SET`; pending synthetic Shop | — | No real KYC/business docs | D+M | sanitized application |
| A04-decision | admin | A04 / decision | `/admin/help/admin/admin-shop-review/decision` | `/admin/shop-registrations/:shopId` | BLOCKED_FIXTURE | Y | P | N | N | Show decision controls; execute only isolated UAT transition | — | No real Shop approval/rejection | D+M | controlled review state |
| A05-decision | admin | A05 / decision | `/admin/help/admin/admin-product-review/decision` | `/admin/product-registrations/:offerId` | BLOCKED_FIXTURE | Y | Y | N | N | Synthetic offer; decision only in isolated UAT | — | No real product moderation | D+M | disposable offer and cleanup |
| A08-reconciliation | admin | A08 / reconciliation | `/admin/help/admin/admin-wallet/reconciliation` | `/admin/wallet` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | `ADMIN_PIISAFE_READ_SET`; masked balances | — | No financial mutation | D+M | safe financial read set |
| A08-payout | admin | A08 / payout | `/admin/help/admin/admin-wallet/payout` | `/admin/withdraw-requests` | BLOCKED_FIXTURE | Y | Y | N | Y for status/read-only | Masked withdrawal records; no approve/settle | VietQR / payout | Production financial mutation prohibited | D+M | masked withdrawal fixture |
| A09-change | admin | A09 / change | `/admin/help/admin/admin-promotions/change` | `/admin/vouchers` | BLOCKED_FIXTURE | Y | Y | N | Y for controls; N for save | Synthetic platform voucher; controlled status change | — | No real platform promotion | D+M | disposable voucher |
| ADMIN-REVIEW-dashboard | admin | ADMIN-REVIEW / dashboard | `/admin/help/admin/admin-review/dashboard` | `/admin` | LOCAL_REUSE_PENDING_DEPLOY | Y | Y | Y via A01 visual | Y | Reuse accepted A01 dashboard; none | — | — | D+M | same dashboard state/role |
| ADMIN-REVIEW-shop-review | admin | ADMIN-REVIEW / shop-review | `/admin/help/admin/admin-review/shop-review` | `/admin/shop-registrations` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | `ADMIN_PIISAFE_READ_SET`; read-only queue/detail | — | No real Shop decision | D+M | A04 safe application |
| ADMIN-REVIEW-product-review | admin | ADMIN-REVIEW / product-review | `/admin/help/admin/admin-review/product-review` | `/admin/product-registrations` | LOCAL_REUSE_PENDING_DEPLOY | Y | Y | Y via A05 visual | Y | Reuse accepted A05 queue; none | — | — | D+M | same product-review queue/role |
| ADMIN-OPERATIONS-dashboard | admin | ADMIN-OPERATIONS / dashboard | `/admin/help/admin/operations/dashboard` | `/admin` | LOCAL_REUSE_PENDING_DEPLOY | Y | Y | Y via A01 visual | Y | Reuse accepted A01 dashboard; none | — | — | D+M | same dashboard state/role |
| ADMIN-OPERATIONS-review | admin | ADMIN-OPERATIONS / review | `/admin/help/admin/operations/review` | `/admin/users`, `/admin/shop-registrations`, `/admin/product-registrations`, `/admin/vouchers`, `/admin/wallet` | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | Admin safe read set across implemented pages | — | No real Admin mutation | D+M | route-specific visual required |
| ADMIN-OPERATIONS-audit | admin | ADMIN-OPERATIONS / audit | `/admin/help/admin/operations/audit` | Implemented Admin route(s) only | BLOCKED_FIXTURE | Y | Y | N | Y after sanitized read set | Read-only audit/status surface where implemented | — | No financial/moderation mutation | D+M | source confirms route and fields |

## Provider recheck

This is deliberately conservative: source integration or an old runtime note
does not prove that the current environment has a safe sandbox. `Unknown`
means it must be verified in the approved environment before a visual is
accepted.

| Provider | CONFIG_PRESENT | SAFE_UAT_MODE | PRODUCTION_ONLY | SANDBOX_AVAILABLE | RUNTIME_TESTABLE_NOW | MUTATION_RISK |
|---|---|---|---|---|---|---|
| PayOS | Source integration; current secret config not inspected | Unknown | No | Unknown | Checkout shell only | Real charge/refund prohibited |
| GHN | Source integration; quote path previously evidenced | Quote read may be testable; booking unknown | No | Unknown | Quote/read-only only | Shipment booking/tracking mutation |
| Agora | Source integration | Unknown | No | Unknown | Public discovery only | Channel/media lifecycle mutation |
| Socket.IO / Redis | Source integration; REST/history path exists | Synthetic thread requires approved UAT | No | Unknown | Read-only history only | Two-session delivery/reconnect state |
| Cloudinary / upload storage | Source integration | Unknown | No | Unknown | No final upload claim | Upload and retained media mutation |
| Firebase Auth / FCM | Source integration | Unknown | No | Unknown | Public auth shell only | Account/token/push mutation |
| VietQR / payout | Source integration; masked read state exists in seed source | Unknown | Withdrawal is prohibited in production | Unknown | Masked read-only status only | Bank resolution, payout and withdrawal |

## Reconciliation summary

| Classification | Rows | Current disposition |
|---|---:|---|
| Implemented local reuse bindings | 5 | B04 discover, B04 product-detail, ADMIN-REVIEW dashboard, ADMIN-REVIEW product-review, ADMIN-OPERATIONS dashboard; each still needs deployment verification |
| Read-only capture after safe fixture | 39 | Buyer account/order/voucher/chat/community, seller read surfaces, Admin read sets |
| Controlled fixture mutation required | 18 | Cart/voucher apply, chat send/reconnect, seller writes, Admin decisions/status |
| Provider-dependent | 8 | B04 checkout, B09/S09 lifecycle portions represented in the 70 rows |
| Unsafe production mutation | Applies to 17 rows | Payment, payout, shipment booking, real KYC/moderation/order actions remain excluded |
| NOT_IMPLEMENTED / not in 70 | 8 | A03, A06, A07 and A10 each have two `TEXT_ONLY` steps |

All visual acceptance still requires raw Desktop and Mobile captures,
separate annotation copies, marker/text validation, manifest registration,
quality-matrix update, and production rendering verification. Inventory status
alone never upgrades a Help step.
