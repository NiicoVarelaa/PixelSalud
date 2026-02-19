# Changelog - Sistema de Mensajes

## [Unreleased] - 2026-02-18

### 🐛 Fixed - CRÍTICO

#### Ventas Online

- **Error**: `Unknown column 'v.tipoEntrega' in 'field list'`
- **Solución**: Eliminada columna inexistente de query en `VentasOnlineRepository.js`
- **Impacto**: Sistema de ventas online funcional

#### Ventas Empleados

- **Error**: `pool.query is not a function`
- **Solución**: Corregida destructuración en importación `const { pool } = require('../config/database')`
- **Archivo**: `VentasEmpleadosRepository.js`
- **Impacto**: Sistema de ventas de empleados funcional

#### Error Handler

- **Error**: `ReferenceError: AppError is not defined`
- **Causa**: Clase AppError convertida a función en refactoring previo
- **Solución**: Cambiado `err instanceof AppError` por validación de propiedades `err.statusCode && err.isOperational`
- **Archivo**: `middlewares/ErrorHandler.js`

#### Autenticación Mensajes

- **Error**: `401 Unauthorized` en `/mensajes`
- **Causa**: AdminMensajes usaba `axios` directo sin token
- **Solución**: Cambiado a `apiClient` que agrega header automáticamente
- **Archivo**: `frontend/src/pages/AdminMensajes.jsx`

#### Sintaxis JSX

- **Error**: Etiquetas `</td>` duplicadas
- **Solución**: Eliminadas líneas duplicadas
- **Archivo**: `frontend/src/pages/AdminMensajes.jsx`

---

### ✨ Added - Sistema Completo de Mensajes

#### Backend API

**Nuevos Endpoints**:

- `PATCH /mensajes/:idMensaje/leido` - Marcar mensaje como leído
- `POST /mensajes/:idMensaje/responder` - Responder a mensaje

**Archivos modificados**:

- `repositories/MensajesRepository.js`
  - `+markAsRead(idMensaje)` - Marca como leído
  - `+responder(idMensaje, respuesta, respondidoPor)` - Guarda respuesta
  - Campos agregados en queries: `leido`, `respuesta`, `fechaRespuesta`, `respondidoPor`

- `services/MensajesService.js`
  - `+marcarComoLeido(idMensaje)` - Lógica de negocio
  - `+responderMensaje(idMensaje, respuesta, respondidoPor)` - Validación + guardado
  - Respuesta mínimo 5 caracteres, máximo 2000

- `controllers/MensajesController.js`
  - `+marcarComoLeido` - Handler del endpoint
  - `+responderMensaje` - Handler que captura admin desde token

- `routes/MensajesRoutes.js`
  - Agregadas rutas con auth + validación
- `schemas/MensajeSchemas.js`
  - `+responderMensajeSchema` - Validación Zod
  - Estados actualizados: `nuevo`, `en_proceso`, `respondido`, `cerrado`

#### Frontend UI

**AdminMensajes.jsx - Reescrito completamente**:

Funcionalidades:

- ✅ Marcar como leído con PATCH
- ✅ Responder mensajes (modal dedicado)
- ✅ Eliminar mensajes (confirmación SweetAlert)
- ✅ Archivar mensajes (estado cerrado)
- ✅ Ver respuestas guardadas
- ✅ Toast notifications (React Toastify)
- ✅ Manejo de errores en todas las peticiones

UX/UI:

- Iconos: `FaReply`, `FaTrash`, `FaArchive`, `FaEnvelope`, `FaTimes`
- Badges de color por estado
- Modal de detalle con scroll y responsive
- Modal de responder con editor + contador de caracteres
- Botones condicionales según estado
- Confirmación antes de eliminar

#### Migración Base de Datos

**Script nuevo**: `backend/migrations/add_mensajes_fields.sql`

Campos agregados a `MensajesClientes`:

```sql
+ leido BOOLEAN DEFAULT 0
+ respuesta TEXT NULL
+ fechaRespuesta DATETIME NULL
+ respondidoPor VARCHAR(100) NULL
```

**⚠️ ACCIÓN REQUERIDA**: Ejecutar migración antes de usar

#### Documentación

**Nuevo archivo**: `backend/MENSAJES_README.md`

- Guía completa del módulo
- Estructura de BD
- Instrucciones de instalación
- Cómo probar
- Troubleshooting

---

### 🔄 Changed

- Estados de mensajes expandidos de 3 a 4:
  - Antes: `nuevo`, `leido`, `respondido`
  - Ahora: `nuevo`, `en_proceso`, `respondido`, `cerrado`

---

### 🔧 Technical Details

**Backend**:

- Sin nuevas dependencias
- Queries optimizadas con campos adicionales
- Validación Zod completa

**Frontend**:

- Usa dependencias existentes: `react-toastify`, `sweetalert2`, `react-icons`
- Patrón de hooks: `useState` para estados locales
- Manejo de errores con try/catch

**Seguridad**:

- JWT requerido en todas las rutas admin
- Verificación de rol "admin"
- Validación de entrada (trim, longitud)
- Confirmación en acciones destructivas

---

### 📋 Testing

**Manual Testing Checklist**:

- [x] Listar mensajes
- [x] Filtrar por estado
- [x] Buscar por texto
- [x] Ver detalle de mensaje
- [x] Marcar como leído
- [x] Responder mensaje
- [x] Ver respuesta guardada
- [x] Archivar mensaje
- [x] Eliminar mensaje
- [x] Toasts funcionando
- [x] Validaciones backend
- [x] Manejo de errores

---

### 🚨 Breaking Changes

Ninguno. Retrocompatible con mensajes existentes.

---

### 📦 Files Changed

**Backend** (9 archivos):

- `repositories/MensajesRepository.js` ✏️
- `repositories/VentasOnlineRepository.js` 🐛
- `repositories/VentasEmpleadosRepository.js` 🐛
- `services/MensajesService.js` ✏️
- `controllers/MensajesController.js` ✏️
- `middlewares/ErrorHandler.js` 🐛
- `routes/MensajesRoutes.js` ✏️
- `schemas/MensajeSchemas.js` ✏️
- `migrations/add_mensajes_fields.sql` ➕

**Frontend** (1 archivo):

- `pages/AdminMensajes.jsx` 🔄 Reescrito

**Docs** (1 archivo):

- `MENSAJES_README.md` ➕

---

### 🎯 Impact

- **Critical Bugs Fixed**: 3 (ventas online, ventas empleados, error handler)
- **Auth Bug Fixed**: 1 (mensajes 401)
- **New Features**: 5 (marcar leído, responder, eliminar, archivar, ver respuestas)
- **UX Improvements**: 8 (iconos, badges, modales, toasts, confirmaciones)
- **Lines of Code**: ~600 líneas agregadas/modificadas

---

**Version**: 2.1.0  
**Author**: GitHub Copilot  
**Date**: February 18, 2026
