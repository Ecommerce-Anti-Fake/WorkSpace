# Unified Order API

## Objective

Replace retail/wholesale order creation with one offer-based order flow. An offer is the atomic sellable unit: if its title is `Lo 30 mat na` and `availableQuantity` is `100`, ordering `quantity: 1` reserves and delivers one such lot, leaving `99` offers available.

## Contract

- Create through `POST /orders` only.
- Input has `offerId`, number of offer units (`quantity`), optional buyer shop/distribution context, payment, affiliate, and shipping fields.
- Remove `POST /orders/retail` and `POST /orders/wholesale` without compatibility aliases.
- Remove `Offer.salesMode`, `Offer.minWholesaleQty`, `Order.orderMode`, and the now-redundant `Order.orderType` from persistence and public contracts.
- Keep distribution pricing when valid buyer shop/node context is supplied; otherwise use the offer price.
- Keep order inventory receipt eligibility based on buyer shop/node and fulfillment state, not an order mode.

## Implementation Plan

1. Add a failing `CreateOrderUseCase` contract test covering one offer unit, public pricing, distribution context, stock, shipping, and payment behavior.
2. Replace the two create-order use cases, REST routes, RPC patterns, and message/DTO types with unified equivalents.
3. Remove mode fields from offer creation/listing, order mapping, Prisma schema, and seed data; add a migration.
4. Update cart checkout, distribution receipt, affected tests, and handoff routing.

## Verification

- Focused create-order/cart/offer/inventory tests passed: 7 suites, 24 tests.
- Prisma schema merge and client generation passed.
- Full backend build passed.
- Full Jest run reached 150 passing suites; 2 unrelated existing suites failed in chat thread setup and review UUID route validation.

## Boundaries

- No frontend work: this workspace currently contains backend and docs only.
- `price` remains the price of one offer unit/lot; no hidden multiplication by quantities described in the title.
- Physical contents such as `30 mat na` remain part of the offer definition/title and are not parsed from text.

## Status

Implemented on 2026-07-01. Apply migration `20260701090000_unify_order_creation` before deploying the new contract.
