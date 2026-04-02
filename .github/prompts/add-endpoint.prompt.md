---
description: "Create or extend a backend API endpoint in Pixel Salud using Routes -> Controllers -> Services -> Repositories with Zod validation and middleware wiring."
name: "Add Backend Endpoint"
argument-hint: "Modulo y endpoint a implementar (ej: cupones POST /cupones/validar para cliente autenticado)"
agent: "agent"
---

Implementa un endpoint backend completo en Pixel Salud para: $ARGUMENTS.

Requisitos obligatorios:

- Respetar arquitectura: Routes -> Controllers -> Services -> Repositories.
- Agregar/actualizar schema Zod y middleware de validacion donde corresponda.
- Mantener controllers con responsabilidad HTTP (req/res/next) y mover la logica de negocio al service.
- Reutilizar errores custom y middlewares existentes (`Auth`, `VerificarPermisos`, `Validate`) segun el caso.
- Mantener consistencia de nombres en espanol.
- Si hay cambios de exportaciones en index de capas, ejecutar `cd backend && npm run verify-exports`.

Entregables:

1. Cambios de codigo completos en archivos necesarios.
2. Resumen breve de decisiones tecnicas y riesgos.
3. Comandos de verificacion ejecutados y resultado.
