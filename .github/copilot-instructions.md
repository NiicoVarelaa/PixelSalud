# Project Guidelines

## Architecture

- This workspace has two apps: `backend/` (Node.js + Express + MySQL) and `frontend/` (React + Vite).
- Backend follows a 4-layer flow: Routes -> Controllers -> Services -> Repositories.
- Keep responsibilities strict:
  - Routes: endpoint wiring, middleware chain, schema validation.
  - Controllers: HTTP input/output only.
  - Services: business rules and orchestration.
  - Repositories: SQL access and transactions.
- Prefer existing module boundaries and central exports in `index.js` files inside layer folders.

## Build and Test

- Backend (`backend/`):
  - `npm install`
  - `npm run dev`
  - `npm start`
  - `npm run verify-exports` (run this when changing exported symbols in controllers/repositories/errors/helpers indexes)
- Frontend (`frontend/`):
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
  - `npm run preview`
- Backend has no automated tests configured yet (`npm test` exits with error by design).

## Conventions

- Project code and domain language are in Spanish (entity names, comments, messages).
- Backend validation uses Zod schemas plus validate middleware; keep validation close to routes.
- Backend error handling is centralized through middleware and custom errors from `backend/errors/index.js`.
- Preserve auth and permission flow through existing middlewares (`Auth`, `VerificarPermisos`).
- CORS and env validation are runtime-critical; do not bypass startup checks in `backend/config/validateEnv.js`.
- Frontend auth state uses Zustand with `sessionStorage` persistence (`frontend/src/store/useAuthStore.js`).

## Docs

Link to existing docs instead of duplicating details:

- Backend architecture and setup: `backend/README.md`
- Transactions and stock consistency: `backend/docs/TRANSACCIONES.md`
- Rate limiting policy: `backend/docs/RATE_LIMITING.md`
- CORS and ngrok notes: `backend/docs/CORS_CONFIGURATION.md`
- Audit system docs: `backend/docs/AUDITORIA.md`
- Audit integration details: `backend/docs/INTEGRACION_AUDITORIA.md`
- Frontend setup: `frontend/README.md`

## Pitfalls

- MercadoPago webhook setups can depend on public URL changes; keep `BACKEND_URL`/CORS origins aligned with current environment.
- Route files are split by module; follow existing naming and wiring patterns from `backend/index.js`.
- When adding or renaming module exports, update the corresponding layer `index.js` and run `npm run verify-exports` in `backend/`.
