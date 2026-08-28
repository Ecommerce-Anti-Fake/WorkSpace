# Payment payOS Handoff

## Feature Overview
payOS handles buyer online payment. Backend creates payment links, receives webhook callbacks, and updates order/payment state.

## Completed Work
- Backend is deployed with a public payOS webhook.
- Frontend points to the production backend.
- payOS dashboard webhook validation passed.
- Cart and Buy Now normalize existing PayOS response aliases into
  `{ orderId, orderCode, paymentLinkId, checkoutUrl }`, then navigate internally
  to `/payment`.
- `/payment` uses the official PayOS CDN checkout SDK with the full
  `checkoutUrl` and `embedded: true`; `RETURN_URL` is always the frontend
  `/payment` URL, so normal checkout does not navigate the top-level browser
  to PayOS.
- Only HTTPS checkout URLs from `pay.payos.vn` and `next.pay.payos.vn` with a
  matching `/web/:paymentLinkId` are accepted. There is no hosted-page redirect
  fallback in the embedded flow; an SDK or iframe failure remains visible as
  an in-app retryable error.
- Embedded success for orders only triggers another backend status check. The
  UI reaches `/payment-success` only after order detail reports `PAID`.
- Cancel/exit stays inside the app. The failed-payment CTA now opens the order
  list and does not reopen `/payment` without checkout state.
- Cancelled payOS payment cancels pending order.
- Successful paid transitions now write order payment audit entries and appear in order detail timelines.
- Failed payOS webhooks mark pending order payments as `FAILED`, write payment audit entries, and keep the order pending for buyer action.
- Buyers can retry a failed payOS payment on the existing pending order via `POST /orders/:id/retry-payos-payment`.
- Cart checkout creates one pending order before payment. `POST /cart/checkout` with `paymentMethod = PAYOS` returns `{ orderId, orderCode, paymentLinkId, checkoutUrl }`; FE polls the normal order detail by `orderId`.
- Buy Now must use `POST /offers/buy-now/checkout` with `offerId`, optional
  `variantId`, `quantity`, `paymentMethod`, and `shippingOptionCode`. It
  resolves the buyer default address and shipping option on the backend,
  creates the order/payment link directly, and never calls add-to-cart or
  mutates active cart items.

## Business Rules
- payOS webhook is the source of truth for final payment update.
- The embedded callback is UX-only; it must never write payment or ledger state.
- For cart checkout, payOS success marks the existing order paid and atomically removes its source cart items. Non-success marks its `PaymentIntent` failed and leaves the cart intact.
- For Buy Now checkout, payOS success marks only the direct order paid. There
  are no source cart items to remove, so success, failure, and cancellation do
  not change cart quantities.
- Successful payment marks order paid, but fulfillment remains seller-controlled.
- Seller manually starts processing after payment.
- Cancelled payOS payment cancels the order if still pending.
- Failed payOS payment does not cancel the order or restore stock automatically.
- Retrying failed payOS payment creates a new checkout link, resets payment status to `PENDING`, and does not create a duplicate order.

## Schema/API Changes
- Uses existing `PaymentIntent`.
- Uses `OrderShopGroup` for per-shop shipping and fulfillment under one buyer order.
- Each copied `OrderItem` stores `sourceCartItemId`; `CheckoutSession` and its status endpoint are removed.
- Order response exposes payment status/method/provider ref fields.
- Retry updates `PaymentIntent.providerRef` to the new `PAYOS:<paymentLinkId>`.
- Webhook endpoint must remain public and point to backend.

## Deployment/Test Status
- Backend production deploy: pass.
- Frontend production deploy: pass.
- Manual payOS success/cancel flow: pass.
- Focused failed webhook test: pass (`handle-payos-webhook.use-case.spec.ts`).
- Focused retry test: pass (`retry-payos-payment.use-case.spec.ts`).
- Stale/duplicate webhook idempotency tests: pass (`handle-payos-webhook.use-case.spec.ts` covers duplicate success, duplicate failure, duplicate failure after paid, stale success, and stale failure).
- Backend build: pass.
- Frontend embedded-form unit tests: pass (`npm run test:payos`, 7 tests).
- Frontend build: pass after the embedded-form change (`npm run build`).
- 2026-07-27 focused backend VPS-preparation gate: 5 suites / 18 tests passed,
  including production callback fallback rejection and explicit realtime CORS.
- 2026-07-27 VPS configuration prepared for
  `https://antifake.io.vn` and `https://api.antifake.io.vn`; no VPS deploy or
  DNS cutover has been executed.
- Production embedded PayOS return URL is the containing frontend route
  `https://antifake.io.vn/payment`; backend callback URLs remain provider
  webhook/return endpoints and are not passed as the iframe return URL.

## Pending Work
- Authenticated staging smoke for Cart, Buy Now, success, cancel, exit, iframe
  fallback, and real webhook confirmation.
- Failed-order retry UI remains intentionally out of this frontend slice.

## Important Constraints
- payOS secrets must stay backend-only.
- Production redirects must not use localhost.
- Confirm in the PayOS dashboard whether order and wallet top-up webhooks use
  multiple destinations or separate credentials before VPS cutover; source
  currently exposes both public routes.
- Do not auto-start fulfillment from webhook.

## Recommended Next Steps
- Run one small-value staging transaction for Cart and Buy Now. Confirm the
  top-level origin remains AntiFake, the iframe uses `/embedded/`, and the
  success screen appears only after the backend reports `PAID`.

## 2026-08-04 callback hardening
- `Back-End:d031c51` preserves the allowlisted PayOS return fields
  (`code`, `id`, `cancel`, `status`, `orderCode`) when redirecting to the
  frontend, selects the failed route for failed/cancelled provider returns,
  uses `/payment-failed` as the order cancel fallback, and requires both the
  top-level and nested webhook codes to be `00` before crediting a wallet.
- `Front-End:31a2569` parses provider return query state when a full-page
  redirect loses React `location.state`, routes `/payment` returns to the
  correct result page, and displays a pending-webhook message instead of
  claiming backend-confirmed payment.
- Local verification: frontend PayOS tests 6/6, backend PayOS-focused tests
  17/17, frontend build pass, backend `build:deploy` pass.
- Frontend production deploy passed for `31a2569`; the production network now
  serves the new `index-DiPgH97j.js` bundle.
- Backend quality gates passed for `d031c51`. Its first deploy run
  `30841034306` hit Prisma `P1002` while acquiring the PostgreSQL advisory lock
  and rolled back safely. `Back-End:655381e` wires the existing migration retry
  script into the VPS workflow; deploy run `30842099222` then completed
  successfully.
- Production safe callback verification now passes: synthetic PAID returns
  preserve the allowlisted query and reach `/payment-success`, while synthetic
  CANCELLED returns reach `/payment-failed`; both protected routes send a guest
  to `/auth` with no console errors.
- Real sandbox transaction and provider webhook confirmation remain pending.
  Do not run a manual migration, reset, or restart outside the deployment
  runbook.

## 2026-08-04 wallet top-up callback hardening
- Found a second callback seam: user wallet return went through
  `/api/wallet/top-ups/payos/return` but discarded PayOS query fields; default
  user/shop wallet cancel URLs did not identify cancellation in the wallet UI.
- `Back-End:ab2ea9f` contains the wallet fix and is deployed. Wallet return now forwards only
  `code/id/cancel/status/orderCode`, maps failed/cancelled returns to
  `topUp=cancelled`, and fallback cancel URLs include that marker.
- Focused verification: wallet return controller 2/2, wallet PayOS service 3/3,
  combined payment/wallet tests 21/21. No real wallet mutation or webhook replay
  was performed.
- Deployment/retest: Quality Gates `30845646705` and deploy `30845646717` passed;
  production synthetic wallet success/cancel callbacks returned the expected
  `topUp=returned`/`topUp=cancelled` state with no console errors.

## 2026-08-04 embedded checkout production smoke
- `Back-End:d546daa` uses compact PayOS order codes and passed focused PayOS
  tests 7/7 plus backend deploy run #25.
- `Front-End:873cd1d` sends the same-page embedded return URL and passed the
  PayOS tests 7/7, production build, and frontend deploy run #33.
- An authorized 10,000 VND production test link rendered PayOS QR and
  transfer tabs inside the AntiFake `/payment` iframe. The top-level browser
  stayed on AntiFake; the hosted PayOS page was used only to cancel the test
  link afterward.
- No payment was authorized or made, no wallet credit occurred, and no real
  webhook confirmation was claimed. Embedded rendering is verified; paid/
  webhook reconciliation remains a separate pending gate.

## 2026-08-04 inline wallet result
- `Front-End:64bbe36` keeps user/shop wallet top-ups on `/payment` after the
  PayOS embedded callback and renders success, cancelled, or failed states in
  an AntiFake result card. The QR iframe is hidden after a result; the user
  explicitly chooses `Mở ví` or `Quay lại ví`.
- Production browser verification used a synthetic SDK callback in an
  isolated context: success and cancelled cards rendered on `/payment` with no
  PayOS link creation or wallet mutation. Frontend tests 7/7, build, and
  targeted ESLint passed; production assets updated after the push.
- A separately authorized 10,000 VND real payment reached the PayOS success
  page, but the wallet remained at 1,500,000 VND with no top-up ledger entry
  after refresh. Provider success is confirmed; webhook delivery/reconciliation
  is still open and must not be represented as credited balance in the UI.

## 2026-08-04 wallet reconciliation fix
- Root cause: PayOS channel webhooks are configured at channel level. The order
  webhook returned 2xx with `order_not_found` for wallet links, so PayOS stopped
  retrying without creating a wallet ledger entry.
- `Back-End:556b354` dispatches unknown order webhook payloads to the wallet
  handler, supports authenticated return-time PayOS status reconciliation, checks
  ownership and amount, and credits through an idempotent serializable ledger
  transaction.
- `Front-End:3fe1ce1` passes the returned payment link id into wallet state and
  calls reconciliation before refreshing the wallet and transaction list.
- Verification: backend focused tests 18/18, CI 25/25, deploy build pass;
  frontend PayOS tests 7/7, build pass, targeted ESLint pass. Backend deploy
  run #26 succeeded and production health restarted on the new build.
- The previously paid 10,000 VND link was reconciled successfully in production:
  API returned `PAID`, wallet became 1,510,000 VND, and the transaction list
  contains one completed `TOP_UP` credit of 10,000 VND. No second payment was
  created.
