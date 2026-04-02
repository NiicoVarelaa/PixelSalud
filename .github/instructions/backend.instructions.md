---
description: "Use when modifying backend routes, controllers, services, repositories, schemas, middlewares, or errors in Pixel Salud."
name: "Backend Pixel Salud"
applyTo: "backend/**"
---

# Backend Guidelines

## Architecture Boundaries

- Keep the 4-layer flow strict: Routes -> Controllers -> Services -> Repositories.
- Routes define endpoints, middleware chain, and Zod validation only.
- Controllers handle HTTP concerns only (req/res/next).
- Services contain business logic and orchestration.
- Repositories handle SQL access and transactions.

## Conventions

- Keep domain language in Spanish (entities, messages, comments).
- Reuse centralized exports in layer `index.js` files.
- Use custom errors from `backend/errors/index.js` instead of generic `Error` where possible.
- Preserve authentication/authorization flow with `Auth` and `VerificarPermisos` middlewares.

## Validation and Safety

- Keep Zod schemas close to routes/schemas and wire them through validate middleware.
- Do not bypass env validation in `backend/config/validateEnv.js`.
- Respect existing CORS policy and MercadoPago webhook constraints.
- For stock/payment critical operations, preserve transaction-safe patterns documented in backend docs.

## Required Verification

- If you add/rename/delete exported symbols in backend layer index files (`controllers/index.js`, `repositories/index.js`, `errors/index.js`, `helps/index.js`), run:
  - `cd backend && npm run verify-exports`

## References

- `backend/README.md`
- `backend/docs/TRANSACCIONES.md`
- `backend/docs/RATE_LIMITING.md`
- `backend/docs/CORS_CONFIGURATION.md`
- `backend/docs/AUDITORIA.md`
- `backend/docs/INTEGRACION_AUDITORIA.md`
