# Secure Wallet Withdrawals

Status: implemented behind rollout flags; admin withdrawal UI and reconciliation enum fix added; staging provider smoke pending

Last updated: 2026-08-05

## 2026-08-05 searchable bank picker and provider gate

- The payout-account modal now uses one unified searchable bank control instead of a native `<select>` plus a separate search field: provider logos are shown with a short-name fallback, results filter live by short name, full name, bank code, or BIN internally, and keyboard selection supports Arrow keys, Enter, and Escape. BIN and bank codes are not shown to users.
- The bank list still filters to provider-supported lookup banks. The selected bank BIN remains the only value sent to the verification API; no bank contract or database shape changed.
- VietQR `/v2/lookup` accepts a beneficiary bank account number, not a phone-number alias. A phone number can work only when it is actually the bank account number; MoMo-style phone recipient lookup requires a separate provider capability and must not be emulated by sending the phone as `accountNumber`.
- A live verification attempt that returns `503` with `Tra cứu tài khoản ngân hàng chưa được bật.` is an environment gate, not a frontend validation failure. The running backend must set `BANK_ACCOUNT_LOOKUP_ENABLED=true` and provide `VIETQR_CLIENT_ID` plus `VIETQR_API_KEY`, then restart/redeploy before authenticated lookup smoke.
- The local `back-end/.env` does not currently contain the provider lookup settings; do not enable the flag with fabricated credentials or bypass provider verification.

## Current decision

Bank ownership and local KYC identity are separate concerns:

- The user first selects a supported bank and enters an account number.
- The backend calls VietQR Lookup and accepts the account only when the provider returns an account holder.
- The returned holder name is displayed read-only and stored as the verified beneficiary snapshot.
- The beneficiary name does **not** need to match user KYC, shop owner KYC, or a company legal name.
- Firebase SMS/email step-up proves the authenticated local user is authorizing the action. It does not prove that user owns the bank account.
- Third-party beneficiaries are therefore allowed when the provider verifies the bank account.

## Data and security

- `BankAccountVerification` is a ten-minute, one-use provider result bound to `userId` and optional `shopId`.
- `PayoutAccount` receives the provider bank metadata and encrypted account number from that verification session.
- Account numbers use AES-256-GCM at rest; deterministic lookup uses a keyed HMAC; normal responses remain masked.
- Provider credentials, Firebase tokens, authorization tokens, OTP values, and full account numbers must never be logged.
- Bank lookup and authorization challenge endpoints are rate limited.
- A new payout account has a 24-hour withdrawal cooldown.

## API contract

Bank lookup:

- `GET /api/wallet/banks`
- `POST /api/wallet/me/payout-account-verifications`
- `POST /api/shops/:shopId/wallet/payout-account-verifications`
- verification request: `{ bankBin, accountNumber }`
- verification response: `{ verificationId, bank, accountNumberMasked, accountHolder, expiresAt }`

Payout accounts:

- `GET|POST /api/wallet/me/payout-accounts`
- `GET|POST /api/shops/:shopId/wallet/payout-accounts`
- create request: `{ verificationId, authorizationToken }`
- delete routes still require an operation-bound authorization token

Step-up:

- `POST /api/wallet/withdrawal-authorizations/challenges`
- create-payout challenge binds `bankAccountVerificationId`
- withdrawal challenge binds `payoutAccountId` and normalized amount
- `POST /api/wallet/withdrawal-authorizations/challenges/:id/verify`

User withdrawals:

- `POST /api/wallet/me/withdrawals`
- `GET /api/wallet/me/withdrawals`
- `POST /api/wallet/me/withdrawals/:id/cancel`

Shop withdrawals:

- `POST /api/shops/:shopId/wallet/withdrawals`
- `GET /api/shops/:shopId/wallet/withdrawals`
- `POST /api/shops/:shopId/wallet/withdrawals/:id/cancel`
- cancellation verifies the withdrawal belongs to the requested shop wallet

Request payload:

`{ amount, payoutAccountId, idempotencyKey, authorizationToken }`

## State and ledger invariants

- Minimum withdrawal: 100,000 VND; current fee: 0 VND.
- Request atomically moves `AVAILABLE -> LOCKED`.
- `PENDING -> PROCESSING` is admin approval only; no balance movement occurs at approval.
- `PROCESSING -> COMPLETED` requires a real bank transfer reference and then debits `LOCKED`.
- Reject, cancel, or final failure moves `LOCKED -> AVAILABLE` exactly once.
- A shop cannot request a withdrawal while it has an outstanding COD obligation.
- `PAYOS_PAYOUT_ENABLED=false`; there is no automatic payout claim.

## Configuration

- `PAYOUT_ACCOUNT_ENCRYPTION_KEY`: 32-byte hex/base64 secret
- `BANK_ACCOUNT_LOOKUP_ENABLED=true`
- `VIETQR_CLIENT_ID`
- `VIETQR_API_KEY`
- optional `VIETQR_API_BASE_URL`
- `SELLER_WITHDRAWALS_ENABLED=true` only after staging smoke
- `BUYER_WITHDRAWALS_ENABLED=true` only after staging smoke
- `PAYOS_PAYOUT_ENABLED=false`

## Admin operations UI

- Withdrawal status contract is intentionally limited to `PENDING` (Có yêu cầu), `PROCESSING` (Đang xử lý), `COMPLETED` (Đã hoàn tất), `REJECTED` (Đã từ chối), and `CANCELLED` (Đã hủy). Admin approves only `PENDING`; approval moves it to `PROCESSING`, where `Chuyển tiền` prepares an audited transfer QR containing the bank BIN, account number, amount, and deterministic `AFWD ...` content.
- `/admin/withdraw-requests` exposes `Duyệt` / `Từ chối` for `PENDING` and `Chuyển tiền` for `PROCESSING`. Sellers/users can cancel only `PENDING` requests.
- The QR is generated locally as a VietQR/NAPAS payload. The admin can press `Đã chuyển tiền xong`, but completion still requires the bank transfer reference; the current system has no bank-statement webhook/provider that could prove the transfer automatically.
- For UAT-only withdrawal fixtures, run `npm run db:seed:withdrawals` from `back-end`. It removes only rows whose idempotency key starts with `SEED-WITHDRAWAL-` and recreates four production-shaped statuses (`PENDING`, `PROCESSING`, `COMPLETED`, `REJECTED`) using encrypted account snapshots. It does not reset the rest of the database and refuses hosted databases unless `SEED_ALLOW_HOSTED_DB=true` is explicitly set.
- `/admin/wallet` loads platform balances, reconciliation, and payout-account review independently. A reconciliation failure is shown inline without hiding the wallet snapshot or payout-account sections.
- `20260805100000_add_dispute_wallet_transaction_types` aligns the database enum with the schema and the reconciliation query (`DISPUTE_HOLD`, `DISPUTE_RELEASE`, `DISPUTE_REFUND`).

## Verification

Passed locally on 2026-08-05:

- provider response validation and fail-closed tests
- encrypted verification-session and one-use ownership tests
- operation-bound Firebase authorization tests
- payout account, withdrawal, cancellation ownership, COD-debt blocking, and ledger tests
- focused aggregate: 16 suites, 78 tests
- Prisma merge/validate/generate
- backend `api-gateway`, `orders-service`, and `catalog-service` builds
- frontend production build
- focused withdrawal/reconciliation wallet tests (9 tests)

Still required:

- deploy `20260805100000_add_dispute_wallet_transaction_types` before rechecking `GET /api/admin/wallets/reconciliation`
- live VietQR lookup with configured credentials
- authenticated Firebase SMS and email-link smoke
- user and shop request/cancel smoke
- admin transfer completion with a real transfer reference
