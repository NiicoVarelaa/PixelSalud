# 📋 Sistema de Auditoría y Logging

Sistema completo de auditoría para registrar y rastrear todas las acciones críticas del sistema.

## 📊 Tabla de Base de Datos

Ejecuta el script SQL para crear la tabla:

```bash
mysql -u tu_usuario -p pixel_salud < backend/database/auditoria.sql
```

### Estructura de la tabla `auditoria`

```sql
CREATE TABLE auditoria (
  idAuditoria INT PRIMARY KEY AUTO_INCREMENT,
  evento VARCHAR(100) NOT NULL,
  modulo VARCHAR(50) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  descripcion TEXT,
  tipoUsuario ENUM('admin', 'empleado', 'medico', 'cliente', 'sistema'),
  idUsuario INT NOT NULL,
  nombreUsuario VARCHAR(100),
  emailUsuario VARCHAR(100),
  entidadAfectada VARCHAR(50),
  idEntidad INT,
  datosAnteriores JSON,
  datosNuevos JSON,
  ip VARCHAR(45),
  userAgent VARCHAR(255),
  fechaHora DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Uso Básico

### 1. Importar el helper

```javascript
const { Auditoria } = require("../helps");
```

### 2. Registrar una acción

```javascript
// En cualquier controlador
await Auditoria.registrarAuditoria(
  {
    evento: Auditoria.EVENTOS_AUDITORIA.PRODUCTO_CREADO,
    modulo: Auditoria.MODULOS.PRODUCTOS,
    accion: Auditoria.ACCIONES.CREATE,
    descripcion: "Nuevo producto creado",
    tipoUsuario: req.usuario.rol,
    idUsuario: req.usuario.id,
    nombreUsuario: req.usuario.nombre,
    emailUsuario: req.usuario.email,
    entidadAfectada: "Productos",
    idEntidad: producto.idProducto,
    datosNuevos: producto,
  },
  req,
);
```

## 📝 Ejemplos Específicos

### Login Exitoso

```javascript
// En AuthController.js
const { Auditoria } = require("../helps");

const login = async (req, res, next) => {
  try {
    // ... lógica de login ...

    await Auditoria.registrarLoginExitoso(usuario, req);

    res.json({ token, usuario });
  } catch (error) {
    await Auditoria.registrarLoginFallido(req.body.email, error.message, req);
    next(error);
  }
};
```

### Crear Venta

```javascript
// En VentasOnlineController.js
const { Auditoria } = require("../helps");

const crearVenta = async (req, res, next) => {
  try {
    const venta = await VentasOnlineService.crearVenta(req.body);

    await Auditoria.registrarVentaCreada(
      {
        id: venta.idVentaO,
        totalPago: venta.totalPago,
        tipo: "online",
      },
      req.usuario,
      req,
    );

    res.status(201).json({ success: true, data: venta });
  } catch (error) {
    next(error);
  }
};
```

### Modificar Permisos

```javascript
// En PermisosController.js
const { Auditoria } = require("../helps");

const actualizarPermisos = async (req, res, next) => {
  try {
    // Obtener estado anterior
    const permisosAnteriores = await PermisosService.obtenerPorId(id);

    // Actualizar
    const permisosNuevos = await PermisosService.actualizar(id, req.body);

    // Auditar
    await Auditoria.registrarCambioPermiso(
      permisosNuevos,
      req.usuario,
      permisosAnteriores,
      req,
    );

    res.json({ success: true, data: permisosNuevos });
  } catch (error) {
    next(error);
  }
};
```

### Modificar Producto

```javascript
// En ProductosController.js
const { Auditoria } = require("../helps");

const actualizarProducto = async (req, res, next) => {
  try {
    const productoAnterior = await ProductosService.obtenerPorId(id);
    const productoNuevo = await ProductosService.actualizar(id, req.body);

    await Auditoria.registrarModificacionProducto(
      productoNuevo,
      req.usuario,
      productoAnterior,
      req,
    );

    res.json({ success: true, data: productoNuevo });
  } catch (error) {
    next(error);
  }
};
```

### Webhook de MercadoPago

```javascript
// En MercadoPagoController.js
const { Auditoria } = require("../helps");

const webhookHandler = async (req, res) => {
  try {
    const pago = req.body.data;

    await Auditoria.registrarPagoRecibido(pago, req);

    // ... procesar pago ...

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};
```

## 🎯 Eventos Disponibles

### Autenticación

- `LOGIN_EXITOSO`
- `LOGIN_FALLIDO`
- `LOGOUT`
- `RECUPERACION_CONTRASENA`
- `CAMBIO_CONTRASENA`

### Ventas

- `VENTA_CREADA`
- `VENTA_MODIFICADA`
- `VENTA_CANCELADA`
- `VENTA_ANULADA`

### Productos

- `PRODUCTO_CREADO`
- `PRODUCTO_MODIFICADO`
- `PRODUCTO_ELIMINADO`
- `PRODUCTO_STOCK_ACTUALIZADO`

### Permisos

- `PERMISO_OTORGADO`
- `PERMISO_REVOCADO`
- `PERMISO_MODIFICADO`

### Usuarios

- `USUARIO_CREADO`
- `USUARIO_MODIFICADO`
- `USUARIO_ELIMINADO`
- `USUARIO_DESACTIVADO`
- `USUARIO_ACTIVADO`

### Ofertas

- `OFERTA_CREADA`
- `OFERTA_MODIFICADA`
- `OFERTA_ELIMINADA`
- `CAMPANA_CREADA`
- `CAMPANA_MODIFICADA`

### MercadoPago

- `PAGO_RECIBIDO`
- `PAGO_RECHAZADO`
- `WEBHOOK_PROCESADO`

## 🔍 Consultar Auditorías

```javascript
const { AuditoriaRepository } = require("../repositories");

// Obtener auditorías con filtros
const auditorias = await AuditoriaRepository.obtenerAuditorias({
  modulo: "ventas",
  fechaDesde: "2026-01-01",
  fechaHasta: "2026-12-31",
  limite: 100,
  offset: 0,
});

// Obtener historial de un usuario
const historialUsuario = await AuditoriaRepository.obtenerAuditoriasPorUsuario(
  "admin",
  1,
  50,
);

// Obtener historial de una entidad
const historialProducto = await AuditoriaRepository.obtenerHistorialEntidad(
  "Productos",
  123,
);

// Obtener estadísticas
const stats = await AuditoriaRepository.obtenerEstadisticasAuditoria(
  "2026-01-01",
  "2026-12-31",
);
```

## 🧹 Limpieza de Datos Antiguos

```javascript
// Eliminar auditorías mayores a 365 días
const eliminados = await AuditoriaRepository.limpiarAuditoriasAntiguas(365);
console.log(`${eliminados} registros eliminados`);
```

## 🎨 Crear Endpoint de Auditoría (Opcional)

Puedes crear endpoints para consultar auditorías desde el frontend:

```javascript
// routes/AuditoriaRoutes.js
const router = require("express").Router();
const { auth, verificarRol } = require("../middlewares");
const { AuditoriaRepository } = require("../repositories");

// Solo admins pueden ver auditorías
router.get("/", auth, verificarRol(["admin"]), async (req, res, next) => {
  try {
    const auditorias = await AuditoriaRepository.obtenerAuditorias(req.query);
    res.json({ success: true, data: auditorias });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

## 📈 Beneficios

✅ **Trazabilidad completa** - Saber quién hizo qué y cuándo  
✅ **Cumplimiento normativo** - GDPR, LOPD, etc.  
✅ **Seguridad** - Detectar accesos no autorizados  
✅ **Debugging** - Rastrear origen de errores  
✅ **Análisis** - Estadísticas de uso del sistema  
✅ **Recuperación** - Ver estados anteriores de registros

## ⚠️ Consideraciones

1. **Performance**: Los logs de auditoría son operaciones adicionales. Se ejecutan sin lanzar errores para no interferir con el flujo principal.

2. **Almacenamiento**: La tabla puede crecer rápidamente. Implementa limpieza periódica:

   ```javascript
   // Cron job mensual
   cron.schedule("0 0 1 * *", async () => {
     await AuditoriaRepository.limpiarAuditoriasAntiguas(365);
   });
   ```

3. **Privacidad**: No registres datos sensibles (contraseñas, tokens, etc.) en los campos JSON.

4. **Índices**: La tabla ya tiene índices optimizados para búsquedas frecuentes.

## 🔐 Seguridad

- Solo roles `admin` deberían poder ver auditorías completas
- Los usuarios pueden consultar su propio historial
- Nunca expongas IPs o user agents al frontend sin necesidad
- Los logs NO se deben poder eliminar/modificar (solo limpieza automática)
