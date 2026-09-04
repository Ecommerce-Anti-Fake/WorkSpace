# UAT visual unlock matrix

Reconciled: 2026-09-04

This is the handoff from the additive fixture goal to the existing visual
coverage goal. The owner-approved target is the current `UAT_DEMO` deployment;
separate UAT provisioning is not required. It does not publish screenshots,
change the visual baseline or close `ANTIFAKE VISUAL COVERAGE COMPLETION.md`.

The rows are logical Help steps. Desktop `1440x900` and Mobile `390x844`
bindings are both required where the step is applicable; the baseline counts
those bindings separately. `PENDING_RUNTIME_PROOF` is not a capture pass.
The older `isolated target` wording in some row notes means the approved
`UAT_DEMO` runtime plus a fresh isolated browser context; it does not mean a
second VPS, DNS name or external-UAT provisioning blocker.

Current data classification: the owner confirmed the existing runtime/database
as UAT/demo and classified all pre-existing rows as immutable
`LEGACY_DEMO_DATA`. The audit continues to report legacy external/unmarked
signals, but they do not block additive `DOCS_UAT_MANAGED` fixtures. Only
managed rows are changed or cleaned up; destructive reset and provider side
effects remain denied.

| VISUAL_STEP | PREVIOUS_BLOCKER | UAT_FIXTURE | UAT_ROUTE | NOW_CAPTURABLE | PROVIDER_STILL_REQUIRED |
|---|---|---|---|---|---|
| B01/profile | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` | `/profile` | No — isolated target/browser proof pending | None for read-only profile |
| B01/address | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` | `/profile/address` | No — isolated target/browser proof pending | None for read-only address |
| B03/positive-result | `BLOCKED_FIXTURE` | `QR_POSITIVE_LABEL_UAT` | `/qr` | Yes — genuine `VERIFIED` result captured at Desktop/Mobile; raw and annotated evidence accepted | None |
| B04/add-to-cart | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/product/:id`, `/cart` | No — isolated target/browser proof pending | None for cart state |
| B04/checkout-pre-provider | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `ORDER_DETAIL_PII_SAFE_UAT` | `/checkout` | No — isolated target/browser proof pending | PayOS/GHN only for provider completion |
| B04/order-read-only | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders` | No — isolated target/browser proof pending | None |
| B05/list | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders` | No — isolated target/browser proof pending | None |
| B05/detail | `BLOCKED_FIXTURE` | `ORDER_DETAIL_PII_SAFE_UAT` | `/profile/orders/:id` | No — isolated target/browser proof pending | None |
| B05/next-action | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/profile/orders/:id` | No — valid UAT transition/browser proof pending | None unless action calls shipping/payment |
| B06/find | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/cart`, `/checkout` | No — eligible cart/browser proof pending | None |
| B06/check-conditions | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/checkout` | No — eligible cart/browser proof pending | None |
| B06/apply | `BLOCKED_FIXTURE` | `ACTIVE_BUYER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/checkout` | No — disposable UAT mutation/browser proof pending | None; no real promotion |
| B07/open-history | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat` | No — isolated target/browser proof pending | None for REST history |
| B07/send | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat` | No — controlled UAT send/browser proof pending | Socket.IO/Redis for realtime delivery |
| B07/reconnect | `BLOCKED_FIXTURE` | `CHAT_SYNTHETIC_TWO_SESSION_UAT` | `/chat/:roomId` | No — two isolated sessions/browser proof pending | Socket.IO/Redis runtime |
| B08/feed | `BLOCKED_FIXTURE` | `COMMUNITY_PUBLIC_SAFE_UAT` | `/community` | Yes — synthetic DOCS_UAT feed captured at Desktop/Mobile; raw and annotated evidence accepted | None for seeded public content |
| B08/interact | `BLOCKED_FIXTURE` | `COMMUNITY_PUBLIC_SAFE_UAT` | `/community` | No — controlled UAT interaction/browser proof pending | None |
| B08/report | `BLOCKED_FIXTURE` | `COMMUNITY_PUBLIC_SAFE_UAT` | `/community` | No — current source and Desktop/Mobile probes expose no report control or report surface; `NOT_IMPLEMENTED` | None |
| B09/watch-shell | `BLOCKED_FIXTURE` | `ACTIVE_SELLER_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/live`, `/live/:id` | No — live fixture/browser proof pending | Agora for authenticated media lifecycle |
| S01/registration-form | `BLOCKED_FIXTURE` | `SELLER_UAT` + `KYC_SYNTHETIC_DOCUMENT_UAT` | `/register` | No — UAT form/browser proof pending | Firebase/Cloudinary/KYC provider for submission |
| S01/post-approved-state | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/shop-info` | No — isolated target/browser proof pending | None for seeded approved state |
| S02/setup | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/shop-info`, `/seller/business-info` | No — isolated target/browser proof pending | None for read-only/controlled UAT edit |
| S03/basic-information | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | No — isolated target/browser proof pending | None |
| S03/media | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | No — isolated target/browser proof pending | Cloudinary only for upload evidence |
| S03/variant-stock | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | No — isolated target/browser proof pending | None for seeded/editable UAT state |
| S03/review-submit | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | No — isolated target/browser proof pending | None for seeded moderation state |
| S04/list | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products` | No — isolated target/browser proof pending | None |
| S04/edit | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products/:offerId` | No — controlled UAT edit/browser proof pending | Cloudinary only for upload |
| S04/status | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/products/:offerId` | No — isolated target/browser proof pending | None |
| S05/list | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders` | No — isolated target/browser proof pending | None |
| S05/confirm-process | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | No — valid UAT transition/browser proof pending | None unless shipping is invoked |
| S05/prepare | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | No — valid UAT transition/browser proof pending | None |
| S05/shipping | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | No — isolated target/browser proof pending | GHN for booking/tracking |
| S05/complete | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` | `/seller/orders/:orderId` | No — valid UAT transition/browser proof pending | None for local state |
| S05/revenue | `BLOCKED_FIXTURE` | `ORDER_FULFILLMENT_CONTROLLED_UAT` + `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/orders`, `/seller/wallet` | No — isolated target/browser proof pending | None for seeded ledger view |
| S06/list | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/vouchers` | No — isolated target/browser proof pending | None |
| S06/create-edit | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/vouchers` | No — controlled UAT mutation/browser proof pending | None; no production promotion |
| S06/conditions-active | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/vouchers` | No — isolated target/browser proof pending | None |
| S07/affiliate-link | `BLOCKED_FIXTURE` | `AFFILIATE_CONVERSION_UAT` | `/affiliate`, `/seller/affiliate` | No — isolated target/browser proof pending | None for link display |
| S07/conversion | `BLOCKED_FIXTURE` | `AFFILIATE_CONVERSION_UAT` | `/affiliate` | No — isolated target/browser proof pending | None for non-payable UAT ledger |
| S07/commission | `BLOCKED_FIXTURE` | `AFFILIATE_CONVERSION_UAT` | `/affiliate` | No — isolated target/browser proof pending | None for read-only ledger |
| S07/payout-boundary | `BLOCKED_FIXTURE` | `AFFILIATE_CONVERSION_UAT` | `/affiliate` | No — isolated target/browser proof pending | VietQR/payout sandbox for execution |
| S08/balance | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/wallet` | No — isolated target/browser proof pending | None |
| S08/transactions | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/wallet` | No — isolated target/browser proof pending | None |
| S08/revenue | `BLOCKED_FIXTURE` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/wallet` | No — isolated target/browser proof pending | None |
| S08/payout-boundary | `BLOCKED_PROVIDER_SANDBOX` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/wallet` | No — provider sandbox not configured | VietQR/payout sandbox |
| S09/seller-live-shell | `BLOCKED_PROVIDER_SANDBOX` | `SELLER_DISPOSABLE_BUSINESS_UAT` | `/seller/live` | No — isolated live fixture/browser proof pending | Agora |
| A01/targeted-dashboard | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin` | No — isolated Admin session/browser proof pending | None |
| A02/list-detail | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/users` | No — isolated Admin session/browser proof pending | None |
| A04/pending-shop | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/shop-registrations` | No — isolated Admin session/browser proof pending | None |
| A05/detail | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/product-registrations` | No — isolated Admin session/browser proof pending | None |
| A08/withdrawal-read | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/withdraw-requests` | No — isolated Admin session/browser proof pending | None for read-only state |
| A09/targeted-promotion | `BLOCKED_FIXTURE` | `ADMIN_PIISAFE_READ_SET` | `/admin/vouchers` | No — isolated Admin session/browser proof pending | None |

## Exclusions and status calculation

`B02` discovery/detail, public `B03/open` and `B03/enter-code`, public
`B09/shop`, and the already accepted/read-only `S07` program and Admin visual
bindings retain their existing evidence classifications. They are not counted
as newly unlocked by this fixture implementation.

`A03`, `A06`, `A07` and `A10` remain excluded when their frontend routes are
absent; they remain `NOT_IMPLEMENTED`, not fixture failures. PayOS, GHN,
Agora, realtime, Cloudinary, Firebase and VietQR/payout remain provider rows
until an isolated configuration and safe runtime call are proven.

Current calculation after UAT_DEMO additive fixture verification and browser
evidence for the positive QR and public Community feed:

```text
FIXTURE_BLOCKED_BEFORE=60
FIXTURE_BLOCKED_AFTER=57
PROVIDER_BLOCKED_BEFORE=5
PROVIDER_BLOCKED_AFTER=5
VISUAL_STEPS_NOW_UNLOCKED=2
NEWLY_COMPLETED_VISUALS=B03/positive-result,B08/feed
NOT_IMPLEMENTED_OR_NA_AFTER=9
```

The current UAT/demo binding commit `c7dfc58e89950ce799a6c575988d0a5e78aeb96b`
was deployed through GitHub Actions run `100`. The isolated deployed Help probe
passed all four B03/B08 Desktop/Mobile checks; raw and annotated pairs were
privacy-reviewed before promotion.

The remaining 57 fixture rows still require their own browser/runtime evidence;
fixture creation alone is not a capture pass. This document intentionally does
not claim that source code or a seed manifest alone makes a visual capturable.

The B08/report row was reclassified from fixture-blocked to `NOT_IMPLEMENTED`
after a current source inspection and fresh public UAT probes at both target
viewports found no report control or form. No report mutation was attempted.
