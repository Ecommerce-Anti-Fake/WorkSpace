# User Profile API

Status: Added on 2026-06-28.

## Implemented

- Added authenticated current-user profile mutation:
  - `PATCH /user/profile`
  - Body: `displayName?: string | null`, `phone?: string | null`
  - Success response: `{ success: true, message: 'Profile updated successfully.' }`
- Added authenticated current-user avatar upload:
  - `POST /user/avatar`
  - Content-Type: `multipart/form-data`
  - Field: `avatar` as exactly one image file.
  - Success response: `{ success: true, message, mediaAssetId, avatarUrl }`
- Avatar upload stores the new image in Cloudinary, creates a `MediaAsset` with `resourceType = USER_AVATAR`, updates `User.avatarMediaId`, then deletes the old Cloudinary asset when one exists.
- Avatar upload accepts image files only and rejects missing, empty, unsupported, or oversized files.
- Phone updates keep the existing duplicate-phone guard.
- Empty body is rejected.
- Kept legacy `PATCH /user/:id` in place for compatibility, but the current-user profile route is explicit and registered before `:id`.

## Backend Path

- REST: `back-end/apps/api-gateway/src/modules/user/user.controller.ts`
- RPC client: `back-end/apps/api-gateway/src/modules/user/users-rpc.service.ts`
- Message contract: `back-end/libs/contracts/src/microservice/patterns.ts`
- RPC handler: `back-end/libs/users/src/presentation/rpc/users.rpc-controller.ts`
- Use case: `back-end/libs/users/src/application/use-cases/update-current-user-profile.use-case.ts`
- Avatar use case: `back-end/libs/users/src/application/use-cases/upload-current-user-avatar.use-case.ts`
- Persistence: `back-end/libs/users/src/infrastructure/persistence/users.repository.ts`

## Verification

- `npm test -- update-current-user-profile.use-case.spec.ts upload-current-user-avatar.use-case.spec.ts user.controller.spec.ts --runInBand` in `back-end`
- `npx nest build api-gateway` in `back-end`
- `npx nest build users-service` in `back-end`

## Notes

- Do not add a generic `GET /user/:id`; route shadowing broke account subresources before.
- Prefer `PATCH /user/profile` for current-user profile edits instead of sending the current user's id through the path.
- Keep avatar changes on `POST /user/avatar`; do not re-add avatar to the generic profile update body.
