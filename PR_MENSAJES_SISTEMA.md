# 🚀 PR: Sistema Completo de Gestión de Mensajes + Correcciones Críticas

## 📋 Resumen

Este PR implementa un **sistema completo de gestión de mensajes** con funcionalidades de respuesta, archivado, eliminación y marcado como leído. Además, corrige **errores críticos** en el sistema de ventas y manejo de errores.

---

## 🐛 Bugs Corregidos

### 1. Error en Ventas Online y Empleados (Crítico)

**Problema**:

- ❌ `Unknown column 'v.tipoEntrega'` en VentasOnlineRepository
- ❌ `pool.query is not a function` en VentasEmpleadosRepository
- ❌ `ReferenceError: AppError is not defined` en ErrorHandler

**Solución**:

- ✅ Eliminada columna inexistente `tipoEntrega` de query SQL
- ✅ Corregida importación del pool: `const { pool } = require('../config/database')`
- ✅ Actualizado ErrorHandler para validar errores sin clase AppError

**Archivos modificados**:

- `backend/repositories/VentasOnlineRepository.js`
- `backend/repositories/VentasEmpleadosRepository.js`
- `backend/middlewares/ErrorHandler.js`

---

### 2. Error de Autenticación en Mensajes

**Problema**:

- ❌ `GET /mensajes 401 Unauthorized` - AdminMensajes no enviaba token

**Solución**:

- ✅ Cambiado `axios` por `apiClient` que maneja tokens automáticamente

**Archivos modificados**:

- `frontend/src/pages/AdminMensajes.jsx`

---

### 3. Error de Sintaxis JSX

**Problema**:

- ❌ Etiquetas `</td>` duplicadas causando error de compilación

**Solución**:

- ✅ Eliminadas etiquetas duplicadas en la tabla de mensajes

---

## ✨ Nuevas Funcionalidades: Sistema de Mensajes

### Backend

#### Nuevos Endpoints

| Método  | Ruta                             | Descripción              | Autenticación |
| ------- | -------------------------------- | ------------------------ | ------------- |
| `PATCH` | `/mensajes/:idMensaje/leido`     | Marca mensaje como leído | Admin         |
| `POST`  | `/mensajes/:idMensaje/responder` | Responde a un mensaje    | Admin         |

#### Cambios en Backend

**1. Repository (MensajesRepository.js)**

```javascript
// Nuevas funciones
+markAsRead(idMensaje) + // Marca como leído
  responder(idMensaje, respuesta, respondidoPor); // Guarda respuesta
```

- Agregados campos en todas las queries: `leido`, `respuesta`, `fechaRespuesta`, `respondidoPor`

**2. Service (MensajesService.js)**

```javascript
+marcarComoLeido(idMensaje) +
  responderMensaje(idMensaje, respuesta, respondidoPor);
```

- Validación: Respuesta mínimo 5 caracteres
- Al responder: Cambia estado a "respondido" automáticamente
- Al responder: Marca como leído automáticamente

**3. Controller (MensajesController.js)**

```javascript
+marcarComoLeido + responderMensaje; // Captura admin desde req.user
```

**4. Schemas (MensajeSchemas.js)**

```javascript
+responderMensajeSchema; // Validación Zod 5-2000 caracteres
```

- Estados actualizados: `nuevo`, `en_proceso`, `respondido`, `cerrado`

**5. Routes (MensajesRoutes.js)**

- Rutas nuevas con autenticación y validación completa

---

### Frontend

#### AdminMensajes.jsx - Reescritura Completa

**Nuevas Funcionalidades**:

1. ✅ **Marcar como leído** - PATCH con notificación
2. ✅ **Responder mensajes** - Modal dedicado con editor
3. ✅ **Eliminar mensajes** - Con confirmación SweetAlert
4. ✅ **Archivar mensajes** - Cambio a estado "cerrado"
5. ✅ **Ver respuestas** - Sección diferenciada en modal
6. ✅ **Toast notifications** - Feedback visual de todas las acciones
7. ✅ **Manejo de errores** - Try/catch en todas las peticiones

**Mejoras de UX/UI**:

- 🎨 Iconos intuitivos: `FaReply`, `FaTrash`, `FaArchive`, `FaEnvelope`
- 🎨 Badges de color según estado (azul primario, amarillo, azul claro, gris)
- 🎨 Modal de detalle mejorado con scroll y responsive
- 🎨 Modal de responder con contexto del mensaje original
- 🎨 Contador de caracteres en respuesta
- 🎨 Botones condicionales según estado del mensaje
- 🎨 Confirmación antes de eliminar (SweetAlert2)

**Nuevas Dependencias**:

```jsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FaReply, FaTrash, FaArchive } from "react-icons/fa";
```

---

## 🗄️ Migración de Base de Datos

### Scripts SQL Incluidos

**Archivo**: `backend/migrations/add_mensajes_fields.sql`

```sql
ALTER TABLE MensajesClientes
ADD COLUMN leido BOOLEAN DEFAULT 0 COMMENT 'Indica si el mensaje fue leído por el admin',
ADD COLUMN respuesta TEXT NULL COMMENT 'Respuesta del administrador al mensaje',
ADD COLUMN fechaRespuesta DATETIME NULL COMMENT 'Fecha y hora en que se respondió el mensaje',
ADD COLUMN respondidoPor VARCHAR(100) NULL COMMENT 'Nombre del admin que respondió';
```

### ⚠️ ACCIÓN REQUERIDA

**Antes de mergear este PR, ejecutar en la base de datos**:

```bash
# Opción 1: Desde MySQL
mysql -u root -p pixel_salud < backend/migrations/add_mensajes_fields.sql

# Opción 2: Copiar y pegar el SQL directamente en phpMyAdmin/MySQL Workbench
```

---

## 📁 Archivos Modificados

### Backend (9 archivos)

**Repositorios**:

- ✏️ `backend/repositories/VentasOnlineRepository.js` - Eliminada columna tipoEntrega
- ✏️ `backend/repositories/VentasEmpleadosRepository.js` - Corregida importación pool
- ✏️ `backend/repositories/MensajesRepository.js` - Agregadas funciones markAsRead y responder

**Servicios**:

- ✏️ `backend/services/MensajesService.js` - Agregadas funciones de negocio

**Controladores**:

- ✏️ `backend/controllers/MensajesController.js` - Agregados endpoints

**Middlewares**:

- ✏️ `backend/middlewares/ErrorHandler.js` - Eliminada referencia a clase AppError

**Rutas**:

- ✏️ `backend/routes/MensajesRoutes.js` - Agregadas rutas PATCH y POST

**Schemas**:

- ✏️ `backend/schemas/MensajeSchemas.js` - Agregado responderMensajeSchema

### Frontend (1 archivo)

- ✏️ `frontend/src/pages/AdminMensajes.jsx` - Reescritura completa del componente

### Documentación (2 archivos nuevos)

- ➕ `backend/migrations/add_mensajes_fields.sql` - Script de migración
- ➕ `backend/MENSAJES_README.md` - Documentación completa del módulo

---

## 🧪 Testing Manual

### Pasos para Probar

1. **Ejecutar migración SQL** (ver sección "Migración de Base de Datos")
2. **Reiniciar backend**: `cd backend && npm run dev`
3. **Iniciar frontend**: `cd frontend && npm run dev`
4. **Login como Admin**
5. **Ir a**: `/admin/mensajes`

### Checklist de Funcionalidades

- [ ] Ver lista de mensajes con filtros (todos, nuevos, en proceso, respondidos, cerrados)
- [ ] Buscar mensajes por nombre, email, asunto o contenido
- [ ] Ver indicador visual de leído/no leído (icono sobre)
- [ ] Ver badge de color según estado
- [ ] Click "Ver" → Modal con detalle completo
- [ ] Marcar como leído → Icono cambia + Toast de éxito
- [ ] Click "Responder" → Modal con editor de texto
  - Escribir respuesta (mínimo 5 caracteres)
  - Enviar → Toast de éxito + Estado cambia a "respondido"
  - Reabrir mensaje → Ver respuesta con fondo azul
- [ ] Click "Archivar" → Estado cambia a "cerrado" + Badge gris
- [ ] Click "Eliminar" → Confirmación SweetAlert → Mensaje eliminado
- [ ] Verificar que mensajes cerrados/respondidos no muestran botón "Responder"

---

## 📊 Estructura de Estados

| Estado       | Color Badge   | Puede Responder | Puede Archivar |
| ------------ | ------------- | --------------- | -------------- |
| `nuevo`      | Azul primario | ✅ Sí           | ✅ Sí          |
| `en_proceso` | Amarillo      | ✅ Sí           | ✅ Sí          |
| `respondido` | Azul claro    | ❌ No           | ✅ Sí          |
| `cerrado`    | Gris          | ❌ No           | ❌ No          |

---

## 🔐 Seguridad

- ✅ Todas las rutas admin requieren JWT válido
- ✅ Verificación de rol "admin" en todas las operaciones
- ✅ Validación Zod en backend (schema de respuesta)
- ✅ Confirmación antes de eliminar (SweetAlert)
- ✅ Sanitización de entrada (trim en respuestas)

---

## 📦 Dependencias

### Backend

- Ninguna dependencia nueva (usa existentes: express, zod, mysql2)

### Frontend

- ✅ Ya instaladas: `react-toastify`, `sweetalert2`, `react-icons`

---

## 🚀 Impacto

### Performance

- ⚡ Sin impacto negativo
- ⚡ Queries optimizadas con índices existentes

### Compatibilidad

- ✅ Retrocompatible con mensajes existentes
- ✅ Campos nuevos con valores NULL/DEFAULT

### UX

- 🎯 Gestión completa de mensajes desde UI
- 🎯 Feedback visual inmediato (toasts)
- 🎯 Interfaz intuitiva con iconos

---

## 📝 Notas Adicionales

1. **Campo `respondidoPor`**: Se captura automáticamente desde `req.user.nombre` o `req.user.nombreEmpleado`
2. **Auto-marcado como leído**: Al responder un mensaje, se marca como leído automáticamente
3. **Estados inmutables**: Un mensaje "cerrado" no puede responder, pero sí puede eliminarse
4. **Respuestas editables**: Para editar una respuesta, usar `PUT /mensajes/:id/estado` o agregar endpoint futuro

---

## 🔄 Próximos Pasos

- [ ] Implementar envío de email al cliente cuando se responde (opcional)
- [ ] Agregar paginación si hay muchos mensajes (>100)
- [ ] Agregar filtro por fecha
- [ ] Agregar estadísticas (mensajes por mes, tiempo promedio de respuesta)

---

## 👥 Reviewers

- @niico - Revisar funcionalidad completa
- @team - Probar en staging antes de producción

---

## 📸 Screenshots

_Agregar screenshots del módulo funcionando:_

- [ ] Vista de tabla con mensajes
- [ ] Modal de detalle con respuesta
- [ ] Modal de responder
- [ ] Toasts de notificación

---

**Creado por**: GitHub Copilot 🤖  
**Fecha**: 18 de Febrero, 2026  
**Tipo**: Feature + Bugfix  
**Prioridad**: Alta (incluye fixes críticos de ventas)
