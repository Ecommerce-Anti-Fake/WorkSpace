# Order-first cart checkout

## Objective

Replace cart `CheckoutSession` with one buyer-facing `Order` per checkout. An order may contain cart items from multiple shops. Shop-specific shipping, fulfillment, settlement, and seller access belong to child `OrderShopGroup` records.

## Contract

- `POST /cart/checkout` creates one order.
- `POST /offers/buy-now/checkout` creates one order directly from `offerId`,
  optional `variantId`, `quantity`, `paymentMethod`, and `shippingOptionCode`;
  it must not create, update, or delete active cart items.
- Authenticated `GET /offers/buy-now` keeps the existing offer/variant preview
  fields and adds public `shippingOptions` (`optionCode`, `providerCode`,
  `providerName`, `methodName`, `shippingFee`, `estimatedDelivery`). It derives
  the buyer from the access token and quotes the requested offer directly via
  `CheckoutShippingService.quoteOptionsForItems()` without reading or creating
  cart items.
- The Buy Now query/body parameter `variantId` is one required UUID string,
  matching `offerId`; Swagger must render it as a plain string input rather than
  an object/JSON value.
- Buy Now validation and business-rule error messages are returned in Vietnamese.
- Buy Now resolves the buyer default address and selected shipping option on
  the backend, matching the `POST /cart/checkout` shipping-option flow.
- `POST /cart/items` accepts optional `variantId`.
- If an offer has variants, `variantId` is required and must reference an active
  variant belonging to the offer.
- Cart item price snapshot uses `OfferVariant.price` when `variantId` is
  selected; otherwise it uses `Offer.price`.
- Cart upsert identity is `(cartId, offerId, variantId)`, so the same offer with
  different variants creates separate cart items.
- `GET /cart` returns compact variant fields per item:
  `variantId` and `variantSku`; it does not expose the full variant object.
- PAYOS returns `{ orderId, orderCode, paymentLinkId, checkoutUrl }`; cart items remain until a verified successful webhook.
- COD creates the order and removes its source cart items immediately.
- Each `OrderItem.sourceCartItemId` records the exact cart item copied into the order.
- A successful PAYOS webhook marks the existing order paid, preserves existing payment audit/escrow behavior, and removes its source cart items idempotently.
- Failed PAYOS payment marks the payment intent failed and leaves the cart unchanged.
- Buy Now PAYOS payment uses the request quantity only; cancelling/failing the
  provider payment leaves the active cart exactly as it was before Buy Now.
- `POST /orders/:id/payment/retry` reuses the order and creates a new provider payment link.

## Domain rules

- `Order` owns buyer identity, aggregate totals, and one `PaymentIntent`.
- `OrderShopGroup` owns `shopId`, shop amounts, shipping snapshot, tracking, and fulfillment state.
- `OrderItem` belongs to one order and one shop group.
- Cart quantity updates re-check selected variant stock before persisting.
- PAYOS orders are not fulfillable until payment is `PAID`; COD orders remain eligible under the existing COD rule.
- Provider callbacks are untrusted, amount-checked, and idempotent.
- Voucher codes are revalidated and recalculated by the backend at quote and checkout; cart and Buy Now remain separate input flows.
- Voucher redemption reservation runs inside a serializable order transaction; payment failure/cancel releases the reservation.

## Commands

- Merge schema: `npm run prisma:schema:merge`
- Generate client: `npx prisma generate`
- Focused Buy Now quote tests: `npm test -- quote-buy-now-shipping-options.use-case.spec.ts offer.controller.spec.ts --runInBand`
- Builds: `npx nest build orders-service` and `npx nest build api-gateway`

## Testing strategy

- Unit-test aggregate order creation, cart retention/removal, webhook idempotency, failure behavior, and retry.
- Compile both orders-service and api-gateway after contract removal.
- Validate the merged Prisma schema before concluding.

## Boundaries

- Preserve existing audit and escrow semantics.
- Do not delete cart items on PAYOS initiation or failure.
- Do not delete cart items by `offerId` or reuse `CartItem.id` as `OrderItem.id`.
- Do not add frontend changes in this backend-first slice.

## Success criteria

- One selected-cart checkout creates exactly one order with shop groups and multiple items.
- Checkout session schema, RPC, API, and application code are removed.
- PAYOS status and retry are addressed by `orderId`.
- Existing seller and fulfillment paths resolve through shop groups.
- Focused tests and builds pass.

## Implementation status (2026-07-01)

- Backend schema, migration, checkout contract, direct order webhook handling, retry compatibility, seller shop-group listing, and per-group fulfillment/shipping are implemented.
- Prisma validation passed; 34 focused tests passed; `orders-service` and `api-gateway` builds passed.
- Frontend source is not present in this workspace checkout. FE must replace `checkoutSessionId` polling with the returned `orderId` and normal order-detail polling when that repository is available.
