# Account Security Flows

Status: New Firebase-first form registration and verification flow implemented locally on 2026-08-03; migration application and deployed provider smoke remain pending.

## Current form/Google contract (2026-08-03)

- Form registration calls Firebase Email/Password first. `POST /auth/register` receives only the fresh Firebase ID token, normalized phone, and display name; it creates/upserts `PendingRegistration` by `firebaseUid` and never creates `User` before proof.
- `PendingRegistration` stores normalized email, E.164 phone, display name, expiry, completion marker, and timestamps. It does not store a password, Firebase credential, or secret. Expired rows are deleted on registration and by the auth-service cleanup timer. A retry with the same Firebase UID recreates an expired pending row without creating another Firebase user.
- Promotion is backend-only and requires `decodedToken.uid === pending.firebaseUid`. Email proof requires `email_verified === true` plus normalized token email equality. Phone proof requires a present `phone_number` plus normalized E.164 equality with the pending phone. `verified=true` is UI copy only.
- Promotion is serializable and creates `User` plus `AuthIdentity(provider=FIREBASE)` before deleting the pending row. Existing identity reads and unique constraints make repeated/concurrent promotion safe.
- Google login/registration requires `firebase.sign_in_provider === google.com` and `email_verified === true`; both paths create or link the official `User`/`AuthIdentity`, issue the app session, and send no email verification.
- Frontend phone linking uses only `PhoneAuthProvider.verifyPhoneNumber`, `PhoneAuthProvider.credential`, and modular `linkWithCredential`. It then calls `currentUser.reload()` and `currentUser.getIdToken(true)`. The linking flow does not call `signInWithCredential` or `signInWithPhoneNumber`.
- Email verification uses `sendEmailVerification` with `https://antifake.io.vn/login?verified=true`. The login screen displays “Xác minh tài khoản thành công. Bạn có thể đăng nhập.”, then requires a new Firebase login and backend token verification. A fallback custom handler is available at `/auth/email-action`; staging must confirm whether Firebase hosted handling redirects directly before switching the Firebase console action handler.
- The schema artifact is `back-end/prisma/migrations/20260803120000_add_pending_registration/migration.sql`; it has not been applied to production.

Focused checks passed locally: Prisma merge/validate/generate, auth-service and API-gateway builds, 5 backend auth/RPC suites (26 tests), targeted backend/frontend auth lint, frontend build, and local browser UI smoke. Full frontend lint still reports pre-existing repository-wide errors outside this auth slice; deployed Email/Password, hosted email, Phone OTP, retry, and Google smoke remain required.

Update on 2026-08-03: `POST /auth/firebase-login` now auto-creates or links a verified Google account through the same serializable repository path as `POST /auth/google-register`; repeated Google sign-ins reuse the existing `AuthIdentity` and issue a new app session.

## Historical specification (superseded for the new form/Google path)

## Registration verification specification (approved 2026-07-22)

- Standard registration requires email, phone, display name, and password, then creates a `pending_verification` account without issuing application tokens.
- The user verifies one of the contacts already submitted: Firebase Email Link or a six-digit Firebase Phone OTP. Phone challenges expire server-side after exactly three minutes and can only be resent after expiry.
- A successful verification activates the account and returns the UI to login; it never auto-signs the user into the application.
- Google registration creates a pending account and requires an additional Email Link proof before Google login succeeds.
- One normalized email belongs to one local `User`. Local -> Google requires local password login before linking; Google -> local requires fresh Google proof before adding a password. Neither direction creates a duplicate user.
- Pending registration sessions expire after 24 hours. Registration, link-intent, and refresh secrets remain in scoped httpOnly cookies and are stored hashed at rest.
- Existing active users are preserved during migration and their populated legacy contacts are backfilled as verified.

Acceptance checks: pending accounts cannot login or refresh; email/phone proof must match the selected contact and challenge; expired/replayed challenges fail; phone resend fails before second 180; Google tokens cannot substitute for Email Link proof; duplicate-email provider linking never increases the user count.

Update on 2026-07-22:
- Local registration now creates a `pending_verification` user plus a hashed 24-hour registration session. A matching password can resume the original window; an expired pending registration can be replaced only with the same normalized email/phone pair.
- Google registration creates one pending user and a `GOOGLE` identity, then requires Firebase Email Link proof. Google pending sessions retain the original 24-hour boundary instead of extending indefinitely.
- Added verification APIs for session resume/read, challenge create/resend/confirm, and opaque Email Link context. Phone challenges have an exact server-side 180-second TTL; send attempts are limited to five per contact channel per hour.
- Local -> Google creates a 10-minute one-use link intent and requires password login. An account activated only by phone must complete Email Link proof before Google is linked.
- Google -> local requires a fresh matching Google proof before setting a password and phone. The phone remains unusable for login until its OTP challenge succeeds.
- `POST /auth/firebase-login` is now login-only: it requires an existing `GOOGLE` identity and an active account; it never creates or merges a user implicitly.
- Registration and link secrets are returned only inside auth-service RPC boundaries, hashed at rest, and exposed to the browser only as scoped httpOnly cookies.
- Migration adds `AuthIdentity`, `RegistrationSession`, `RegistrationChallenge`, and `AuthLinkIntent`, normalizes legacy email/phone identifiers, and backfills populated contacts of active users as verified. It intentionally fails if normalization reveals duplicate identities.
- Production prerequisite: backfill `AuthIdentity(provider=GOOGLE, providerSubject=<Firebase uid>)` for accounts created by the legacy Firebase auto-create bridge before switching traffic. Firebase UID cannot be derived safely from SQL-only user rows.

Update on 2026-06-02:
- Added Firebase Auth bridge for email verification link, phone SMS OTP, and Google provider.
- Frontend `/auth` now supports Firebase email registration/login, Firebase phone OTP registration/login, and Google sign-in while keeping the existing auth logic.
- `/auth` visual layout was refreshed toward the ACFMart-style red/gold ecommerce auth surface; Facebook and Zalo buttons are intentionally omitted.
- Backend originally added `POST /auth/firebase-login` with implicit local-user creation. That behavior is superseded by the 2026-07-22 login-only identity contract above.
- Local user/database ownership remains in NestJS/PostgreSQL; Firebase only proves email/phone ownership.

Update on 2026-06-09:
- Google popup/provider/domain Firebase errors are surfaced explicitly in `/auth` instead of being collapsed into the generic email/password credential error.
- If the popup closes before account selection, first check the displayed Firebase-specific error, especially `auth/unauthorized-domain` and `auth/operation-not-allowed`.
- Frontend API refresh handling now treats `POST /auth/firebase-login` as an auth endpoint, so Firebase token failures are reported directly.

Update on 2026-06-10:
- `/auth` register mode now uses register-specific Google copy in the account subtitle and Firebase Google popup/provider/network error messages.
- Mobile bottom navigation labels now wrap instead of truncating, and the account dropdown is capped to the viewport to avoid clipped text on small screens.
- On mobile `/auth`, the fixed bottom navigation is hidden so it cannot cover the login/register form switch controls.
- Mobile catalog pages are constrained to the viewport; product breadcrumbs, hero, filters, price inputs, results, and sort controls no longer overflow horizontally.

Update on 2026-06-25:
- Public auth responses no longer expose `refreshToken` in JSON.
- `POST /auth/login`, `POST /auth/firebase-login`, and `POST /auth/refresh` set the rotated refresh token in an `httpOnly`, `sameSite=lax` cookie scoped to `/api/auth`.
- `POST /auth/refresh` and `POST /auth/logout` read the refresh token from that cookie; the frontend sends requests with `credentials: 'include'` and only stores the access token/user session.

Update on 2026-06-29:
- Auth success responses now include `user.avatar` as the current avatar URL or `null` for `POST /auth/login`, `POST /auth/firebase-login`, and `POST /auth/refresh`.

Update on 2026-07-07:
- Auth safe-user payloads now include `user.shopId`, using the user's newest owned shop ID when present, otherwise `null`. This applies to `POST /auth/login`, `POST /auth/firebase-login`, `POST /auth/refresh`, and active-user guard hydration.

Update on 2026-07-10:
- Refresh cookies use `SameSite=None; Secure` in production so the Vercel frontend can send them to `api.antifake.io.vn`; non-production keeps `SameSite=Lax`.
- Cookie creation and clearing share the same `httpOnly`, `secure`, `sameSite`, and `/api/auth` path options.

## Implemented

- Added password reset persistence with `PasswordResetToken`.
- Added auth APIs:
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
  - `POST /auth/change-password`
  - `POST /auth/firebase-login`
  - `POST /auth/google-register`
  - `POST /auth/registration-verifications/resume`
  - `GET /auth/registration-verifications/session`
  - `GET /auth/registration-verifications/email-context`
  - `POST /auth/registration-verifications`
  - `POST /auth/registration-verifications/:id/resend`
  - `POST /auth/registration-verifications/:id/confirm`
  - `POST /auth/google-link-intents/confirm`
  - `POST /auth/local-credentials`
  - `GET /auth/security-decisions`
- Forgot-password returns a generic message for missing and existing accounts to avoid account enumeration.
- Reset tokens are stored hashed, expire by `PASSWORD_RESET_TTL_MINUTES` (default 30), and are single-use.
- `PASSWORD_RESET_RETURN_TOKEN=true` can expose the reset token for local/demo flows until email delivery exists; default behavior does not expose it.
- Reset/change password revoke active refresh sessions for the user.
- Change password requires the current password and an authenticated active account.
- Frontend `/auth` supports forgot/reset modes; `/user?tab=settings` exposes change password.

## Decisions

- Email verification uses Firebase email verification links.
- Phone OTP uses Firebase Phone Authentication.
- Google login uses Firebase Google provider.
- Existing NestJS JWT/session ownership remains the auth source of truth.

## Verification

- `npm test -- request-password-reset.use-case.spec.ts reset-password.use-case.spec.ts change-password.use-case.spec.ts` in `back-end` passed on 2026-05-29.
- `npm run build` in `back-end` passed on 2026-05-29.
- `npm run build` in `front-end-web` passed on 2026-05-29.
- `npm test -- firebase-login.use-case.spec.ts` in `back-end` passed on 2026-06-02.
- `npx nest build auth-service` and `npx nest build api-gateway` passed on 2026-06-02.
- `npm run build` in `front-end-web` passed on 2026-06-02.
- `npm test -- auth.controller.spec.ts --runInBand` and `npm run build:deploy` in `back-end` passed on 2026-07-10.
- `npm test -- register.use-case.spec.ts resume-registration.use-case.spec.ts registration-verification.use-cases.spec.ts google-register.use-case.spec.ts auth-linking.use-cases.spec.ts firebase-login.use-case.spec.ts login.use-case.spec.ts auth.controller.spec.ts get-user-by-id.use-case.spec.ts --runInBand` passed: 9 suites, 39 tests on 2026-07-22.
- `npx nest build auth-service`, `npx nest build api-gateway`, and `npx nest build users-service` passed on 2026-07-22.
- `npm run prisma:merge`, `npx prisma validate`, and `npx prisma generate` passed on 2026-07-22.
- Focused production backend ESLint, focused frontend ESLint, and frontend `npm run build` passed on 2026-07-22. Vite still reports the existing >500 kB chunk warning.
- Chrome `/auth` smoke passed for login/register rendering, accessibility names, clean console, and mobile auth navigation. Live Firebase Email Link/SMS/Google provider completion was not run locally.
- Dependency audit: frontend reported 0 vulnerabilities. Backend reported 29 pre-existing dependency findings (1 critical, 14 high); no dependency versions changed in this slice.

## Next

Best next feature: run the Firebase UID identity backfill and a deployed Email Link/SMS/Google end-to-end smoke before enabling the new login-only bridge in production.

## Update 2026-08-03

- Frontend email/password login now calls `POST /api/auth/login` first. Firebase email login is attempted only after a local `401 Invalid credentials`; local verification/account-status errors are returned directly.
- Seeded UAT admin and the first two seller accounts are marked email/phone verified by the seed/update helper so their DB passwords can exercise local login.
- Local login flow tests and the frontend production build passed. Live deployment still needs to publish this frontend change.
