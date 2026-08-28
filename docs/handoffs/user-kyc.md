# User KYC API

Status: Updated on 2026-06-29.

## Implemented

- Authenticated KYC submit route remains `POST /user/kyc`.
- Submit body is now `multipart/form-data` only:
  - `idType: string`
  - `front: file`
  - `back: file`
- Submit response is now mutation-only: `{ success: true }`.
- Validation still requires exactly two image documents: one `FRONT` and one `BACK`.
- Gateway uploads both files to Cloudinary before forwarding KYC persistence to users-service.
- Gateway no longer accepts or forwards `fullName`, `dateOfBirth`, `phone`, or `idNumber` on KYC submit.
- Users service keeps legacy KYC persistence fields internally so no database migration is required for this API slice.

## Backend Path

- REST: `back-end/apps/api-gateway/src/modules/kyc/kyc.controller.ts`
- REST spec: `back-end/apps/api-gateway/src/modules/kyc/kyc.controller.spec.ts`
- DTO: `back-end/libs/users/src/application/dto/user-management.dto.ts`
- Message contract: `back-end/libs/contracts/src/microservice/patterns.ts`
- Use case: `back-end/libs/users/src/application/use-cases/submit-user-kyc.use-case.ts`
- Use-case spec: `back-end/libs/users/src/application/use-cases/submit-user-kyc.use-case.spec.ts`

## Verification

- `npm test -- submit-user-kyc.use-case.spec.ts kyc.controller.spec.ts` in `back-end`
- `npx nest build api-gateway` in `back-end`
- `npx nest build users-service` in `back-end`
