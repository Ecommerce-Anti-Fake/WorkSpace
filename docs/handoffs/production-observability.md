# Production Observability

## Status

Task 15 completed on 2026-06-08 for API gateway request/error logs, health smoke, route-scoped rate limiting, and provider-neutral monitoring decision.

## Scope

This slice prepares the existing NestJS API gateway for demo/production operations without adding a new monitoring vendor or changing business modules.

Implemented:
- `GET /api/health` deploy health endpoint.
- `npm run smoke:deploy` health smoke script in `back-end`.
- Structured JSON request logs with `x-request-id`, method, path, status, duration, IP, and user agent.
- Structured JSON error logs for HTTP/unhandled exceptions with request ID and status.
- Route-scoped in-process rate limits for auth, upload-signature, payOS webhook, and public catalog endpoints.
- Rate-limit violation logs with `rate_limit.exceeded`.
- Production HTTP CORS allowlist for `https://antifake.io.vn`,
  `https://www.antifake.io.vn`, and `https://api.antifake.io.vn`, with env
  extension via `CORS_ALLOWED_ORIGINS`, `CORS_ORIGIN`, or `FRONTEND_URL`.
- Production API-host CORS allowlist includes `https://api.antifake.io.vn`; keep origins host-only because browser `Origin` headers never include `/api` paths.
- Localhost/LAN origins are defaults only outside production. Preview origins
  must be explicitly added through environment configuration.
- Socket.IO uses the same explicit origin list; it no longer reflects arbitrary
  origins while `credentials: true`.
- `GET /` redirects to the existing Swagger UI at `/swagger` so `https://api.antifake.io.vn` opens API docs instead of returning 404.
- `HEAD /` returns 200 for platform/root probes so health checks do not create noisy `Cannot HEAD /` 404 error logs.
- API gateway disables Nest's default 100kb body parser and installs JSON/urlencoded parsers with `API_JSON_BODY_LIMIT` override, defaulting to `5mb`; body-parser payload limit failures return/log as HTTP 413 instead of generic 500.
- Structured exception logs use `warn` for expected 4xx client/auth/validation failures and `error` only for 5xx server failures.

Monitoring decision:
- Keep code provider-neutral and send stdout/stderr to the deployment log pipeline.
- Attach Sentry or OpenTelemetry at the platform/logger sink before public production launch.
- Keep current gateway limiter for single-instance/demo protection; use edge/WAF or Redis-backed limiting for multi-instance production.

## Rate-Limit Profiles

Defaults:
- Auth public endpoints: 10 requests / 60 seconds.
- Upload-signature endpoints: 20 requests / 60 seconds.
- payOS webhook endpoint: 60 requests / 60 seconds.
- Public catalog endpoints: 120 requests / 60 seconds.

Environment overrides:
- `RATE_LIMIT_AUTH_LIMIT`, `RATE_LIMIT_AUTH_WINDOW_MS`
- `RATE_LIMIT_UPLOAD_SIGNATURE_LIMIT`, `RATE_LIMIT_UPLOAD_SIGNATURE_WINDOW_MS`
- `RATE_LIMIT_PAYMENT_WEBHOOK_LIMIT`, `RATE_LIMIT_PAYMENT_WEBHOOK_WINDOW_MS`
- `RATE_LIMIT_PUBLIC_CATALOG_LIMIT`, `RATE_LIMIT_PUBLIC_CATALOG_WINDOW_MS`

## Verification

- `npm test -- health.controller.spec.ts rate-limit.guard.spec.ts` in `back-end` passed.
- `npm run build:deploy` in `back-end` passed.
- `npm run build:deploy` in `back-end` passed again after CORS and root Swagger redirect changes on 2026-06-08.
- Manual health smoke passed with `DEPLOY_SMOKE_BASE_URL=http://127.0.0.1:3097 npm run smoke:deploy`.
- Manual throttling check passed with `RATE_LIMIT_AUTH_LIMIT=1`: second `/api/auth/login` attempt returned HTTP 429.
- 2026-06-11 follow-up: `npm test -- bootstrap-http.spec.ts health.controller.spec.ts rate-limit.guard.spec.ts` passed after adding `HEAD /` handling. `npx nest build api-gateway` passed. `npm run build:deploy` was attempted twice but stopped before compile in local `prisma generate` with `UNKNOWN: unknown error, open ...\node_modules\prisma\build\index.js`.
- 2026-06-11 production login CORS follow-up: `npm test -- bootstrap-http.spec.ts` passed after allowing `https://api.antifake.io.vn` as a host-only origin and making denied origins return `false` without raising a 500. `npx nest build api-gateway` passed.
- 2026-06-12 preview/LAN origins were historically added for deployed QA.
- 2026-07-27 VPS preparation superseded that default: production uses only
  canonical AntiFake origins plus env overrides, while local/LAN defaults remain
  development-only. Focused HTTP/Socket.IO CORS tests passed.
- 2026-07-27 final VPS-preparation gate: Prisma merge/generate, the full backend
  build, the frontend production build, refresh-cookie tests, focused
  CORS/Socket.IO/PayOS tests, frontend PayOS tests, and `bash -n` for both deploy
  scripts passed. Nginx directives were statically checked; a real `nginx -t`
  remains for the Ubuntu VPS because Nginx is not installed in the Windows
  development environment.
- 2026-07-07 payload/logging follow-up: `npm test -- bootstrap-http.spec.ts structured-exception.filter.spec.ts --runInBand` and `npx nest build api-gateway` passed after adding configurable body parser limits and downgrading 4xx exception logs to warnings.

## VPS preparation

- Backend PM2 entry: `ecosystem.config.cjs` -> `scripts/start-deploy.js` ->
  compiled `deploy-main.js`.
- API Nginx sample proxies `api.antifake.io.vn` to `127.0.0.1:10000` and
  supports `/api/socket.io`.
- Full installation, DNS, TLS, firewall, rollback, log and smoke instructions:
  `docs/VPS_DEPLOYMENT.md`.
- Configuration is prepared only; no VPS deploy or DNS cutover has been run.

## cPanel Passenger preparation

- Passenger startup file: `back-end/passenger.js` -> compiled
  `passenger-main.js` -> shared `deploy-bootstrap`.
- Passenger reuses the production HTTP/CORS/Swagger/Socket.IO bootstrap and
  keeps TCP microservices on loopback with environment-overridable ports.
- Startup validates required configuration, uses a per-process singleton plus
  a cross-process lock, and fails clearly if Passenger starts a second worker.
- The topology requires exactly one Passenger application process. WebSocket,
  SSE and TCP loopback still require smoke testing on the target hosting plan.
- Full runbook: `docs/DEPLOY_CPANEL_PASSENGER.md`.
- Configuration is prepared only; no cPanel deploy or migration was executed.
- Local verification passed on 2026-07-28: Passenger runtime tests, targeted
  ESLint, legacy deploy build, Passenger build, CI tests, loader syntax check,
  artifact inspection, secret scan, and final diff audit.

## Recommended Next Step

Move to Task 17: UAT package and final launch walkthrough.
