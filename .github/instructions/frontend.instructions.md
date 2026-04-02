---
description: "Use when modifying frontend React code, features, routes, state store, forms, or API consumption in Pixel Salud."
name: "Frontend Pixel Salud"
applyTo: "frontend/src/**"
---

# Frontend Guidelines

## Structure

- Follow feature-based organization under `frontend/src/features/`.
- Prefer colocated components/hooks/services inside the relevant feature when possible.
- Keep reusable UI and cross-feature logic in shared folders already used by the project.

## Conventions

- Keep domain language aligned with backend terminology in Spanish.
- Preserve auth state behavior from `frontend/src/store/useAuthStore.js` (Zustand + sessionStorage).
- Respect existing API integration patterns (Axios services and `VITE_API_URL`).

## Implementation Rules

- Avoid embedding business rules that belong to backend.
- Keep components focused: UI rendering in components, side effects in hooks/services.
- Reuse existing form and validation patterns before introducing new abstractions.

## Validation Before Finish

- Run frontend checks after meaningful changes:
  - `cd frontend && npm run lint`
  - `cd frontend && npm run build`

## References

- `frontend/README.md`
- `frontend/src/features/auth/README.md`
- `frontend/src/features/public/README.md`
- `frontend/src/services/README.md`
