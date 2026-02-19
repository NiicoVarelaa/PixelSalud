# Commit Messages Sugeridos

## Opción 1: Commit Único (Todo en uno)

```
feat(mensajes): sistema completo + fixes críticos de ventas

BREAKING CHANGE: Requiere migración de BD (add_mensajes_fields.sql)

Features:
- Sistema completo de gestión de mensajes
- PATCH /mensajes/:id/leido - Marcar como leído
- POST /mensajes/:id/responder - Responder mensaje
- Modal de respuesta con editor y validación
- Toast notifications en todas las acciones
- Eliminar mensajes con confirmación SweetAlert
- Archivar mensajes (estado cerrado)
- Ver respuestas guardadas con diseño diferenciado

Bugfixes:
- fix(ventas): columna tipoEntrega inexistente en VentasOnlineRepository
- fix(ventas): pool.query is not a function en VentasEmpleadosRepository
- fix(errors): AppError referencia a clase no existente en ErrorHandler
- fix(auth): 401 Unauthorized en /mensajes por falta de token en axios

Refactor:
- AdminMensajes.jsx reescrito 100% con mejor UX
- Agregados campos BD: leido, respuesta, fechaRespuesta, respondidoPor
- Estados expandidos: nuevo, en_proceso, respondido, cerrado

Docs:
- MENSAJES_README.md con guía completa
- Migraciones SQL con datos de testing
- PR completo y CHANGELOG actualizado

Archivos: 12 modificados, 4 creados
```

---

## Opción 2: Commits Separados (Recomendado para historial limpio)

### 1. Bugs Críticos

```
fix(ventas): corrige errores críticos en VentasOnlineRepository y VentasEmpleadosRepository

- Elimina columna inexistente 'tipoEntrega' de query SQL
- Corrige destructuración de pool: const { pool } = require(...)
- Previene errores 500 en módulo de ventas

Fixes: #issue-number
```

### 2. Error Handler

```
fix(errors): elimina referencia a clase AppError en ErrorHandler

ErrorHandler validaba err instanceof AppError pero la clase
fue convertida a función en refactoring previo. Ahora valida
por propiedades: err.statusCode && err.isOperational

Fixes: #issue-number
```

### 3. Backend Mensajes

```
feat(mensajes): agrega endpoints para marcar leído y responder

Backend:
- PATCH /mensajes/:idMensaje/leido - Marca mensaje como leído
- POST /mensajes/:idMensaje/responder - Responde mensaje
- Agregadas funciones en Repository: markAsRead, responder
- Agregadas funciones en Service con validaciones
- Agregados controllers y schemas Zod

Modificados:
- repositories/MensajesRepository.js
- services/MensajesService.js
- controllers/MensajesController.js
- routes/MensajesRoutes.js
- schemas/MensajeSchemas.js
```

### 4. Frontend Mensajes

```
feat(mensajes): reescribe AdminMensajes con funcionalidad completa

UI/UX:
- Modal de respuesta con editor y contador de caracteres
- Eliminar mensajes con confirmación SweetAlert
- Archivar mensajes (estado cerrado)
- Ver respuestas guardadas con diseño diferenciado
- Toast notifications para todas las acciones
- Iconos intuitivos (FaReply, FaTrash, FaArchive)
- Badges de color por estado
- Manejo de errores con try/catch

Fix:
- Cambia axios por apiClient para enviar token JWT automáticamente
- Corrige etiquetas </td> duplicadas

Completamente reescrito: frontend/src/pages/AdminMensajes.jsx
```

### 5. Migración BD

```
feat(mensajes): agrega migración SQL y datos de testing

BREAKING CHANGE: Requiere ejecutar migración antes de usar

Campos agregados a MensajesClientes:
- leido BOOLEAN DEFAULT 0
- respuesta TEXT NULL
- fechaRespuesta DATETIME NULL
- respondidoPor VARCHAR(100) NULL

Archivos:
- backend/migrations/add_mensajes_fields.sql
- backend/migrations/test_mensajes_data.sql (datos de prueba)
```

### 6. Documentación

```
docs(mensajes): agrega documentación completa del módulo

- MENSAJES_README.md: Guía de uso y estructura
- PR_MENSAJES_SISTEMA.md: PR detallado con checklist
- CHANGELOG.md: Historial de cambios v2.1.0
- TAREAS_PENDIENTES.md: Roadmap con próximos pasos
- PR_RESUMEN.md: Resumen ejecutivo
```

---

## Opción 3: Solo Título (Para commits rápidos)

```
feat(mensajes): sistema completo + fixes críticos ventas
```

```
fix: errores críticos en ventas y ErrorHandler
```

```
feat: PATCH /mensajes/:id/leido y POST /mensajes/:id/responder
```

---

## Convención Utilizada

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `refactor`: Cambio de código sin afectar funcionalidad
- `docs`: Solo documentación
- `style`: Cambios de formato (no afectan código)
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

**Scope** (entre paréntesis):

- `(mensajes)`: Módulo de mensajes
- `(ventas)`: Módulo de ventas
- `(errors)`: Sistema de errores
- `(auth)`: Autenticación

---

## Ejemplo de PR Title

GitHub Pull Request Title:

```
feat(mensajes): Sistema completo de gestión + Fixes críticos de ventas
```

Bitbucket/GitLab:

```
Feature: Sistema de Mensajes Completo + Bugfixes Críticos
```

---

## Tags Sugeridos

```
v2.1.0
```

Git Tag Message:

```
Release v2.1.0 - Sistema de Mensajes

Incluye:
- Sistema completo de gestión de mensajes (responder, archivar, eliminar)
- Fixes críticos en módulo de ventas
- Mejoras de UX con toasts y modales
- Migración SQL requerida

Notas: Ver CHANGELOG.md para detalles
```

---

**Formato**: Conventional Commits  
**Referencia**: https://www.conventionalcommits.org/
