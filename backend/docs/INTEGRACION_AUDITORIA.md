# 🚀 Guía de Integración de Auditoría en Controladores Existentes

Esta guía te ayudará a integrar el sistema de auditoría en tus controladores existentes.

## ✅ Paso 1: Ejecutar el Script SQL

```bash
mysql -u tu_usuario -p pixel_salud < backend/database/auditoria.sql
```

Verifica que la tabla se creó correctamente:

```sql
SHOW TABLES LIKE 'auditoria';
DESCRIBE auditoria;
```

## 📝 Paso 2: Integrar en Controladores

### Controladores a Auditar (Prioritarios)

#### 1. **PermisosController** - CRÍTICO

```javascript
const { Auditoria } = require("../helps");

// En actualizarPermisos o similar
const actualizarPermisos = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener estado anterior
    const permisosAnteriores = await PermisosService.obtenerPorId(id);

    // Realizar actualización
    const permisosNuevos = await PermisosService.actualizar(id, req.body);

    // AUDITAR
    await Auditoria.registrarCambioPermiso(
      permisosNuevos,
      req.usuario, // Viene del middleware auth
      permisosAnteriores,
      req,
    );

    res.json({ success: true, data: permisosNuevos });
  } catch (error) {
    next(error);
  }
};
```

#### 2. **VentasOnlineController** - CRÍTICO

```javascript
const { Auditoria } = require("../helps");

// En crearVenta
const crearVenta = async (req, res, next) => {
  try {
    const venta = await VentasOnlineService.crearVenta(req.body);

    // AUDITAR
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

// En cancelarVenta
const cancelarVenta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await VentasOnlineService.cancelar(id);

    // AUDITAR
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.VENTA_CANCELADA,
        modulo: Auditoria.MODULOS.VENTAS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Venta online #${id} cancelada`,
        tipoUsuario: req.usuario.rol,
        idUsuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre,
        emailUsuario: req.usuario.email,
        entidadAfectada: "VentasOnlines",
        idEntidad: id,
        datosNuevos: { estado: "cancelado" },
      },
      req,
    );

    res.json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
};
```

#### 3. **VentasEmpleadosController** - CRÍTICO

```javascript
const { Auditoria } = require("../helps");

const crearVenta = async (req, res, next) => {
  try {
    const venta = await VentasEmpleadosService.crearVenta(req.body);

    // AUDITAR
    await Auditoria.registrarVentaCreada(
      {
        id: venta.idVentaE,
        totalPago: venta.totalPago,
        tipo: "empleado",
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

#### 4. **ProductosController** - IMPORTANTE

```javascript
const { Auditoria } = require("../helps");

// En crear producto
const crearProducto = async (req, res, next) => {
  try {
    const producto = await ProductosService.crear(req.body);

    // AUDITAR
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.PRODUCTO_CREADO,
        modulo: Auditoria.MODULOS.PRODUCTOS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Producto "${producto.nombreProducto}" creado`,
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

    res.status(201).json({ success: true, data: producto });
  } catch (error) {
    next(error);
  }
};

// En actualizar producto
const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productoAnterior = await ProductosService.obtenerPorId(id);
    const productoNuevo = await ProductosService.actualizar(id, req.body);

    // AUDITAR
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

// En eliminar producto
const eliminarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const producto = await ProductosService.obtenerPorId(id);
    await ProductosService.eliminar(id);

    // AUDITAR
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.PRODUCTO_ELIMINADO,
        modulo: Auditoria.MODULOS.PRODUCTOS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Producto "${producto.nombreProducto}" eliminado`,
        tipoUsuario: req.usuario.rol,
        idUsuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre,
        emailUsuario: req.usuario.email,
        entidadAfectada: "Productos",
        idEntidad: id,
        datosAnteriores: producto,
      },
      req,
    );

    res.json({ success: true, message: "Producto eliminado" });
  } catch (error) {
    next(error);
  }
};
```

#### 5. **EmpleadosController** - IMPORTANTE

```javascript
const { Auditoria } = require("../helps");

const crearEmpleado = async (req, res, next) => {
  try {
    const empleado = await EmpleadosService.crear(req.body);

    // AUDITAR
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.USUARIO_CREADO,
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Empleado "${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}" creado`,
        tipoUsuario: req.usuario.rol,
        idUsuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre,
        emailUsuario: req.usuario.email,
        entidadAfectada: "Empleados",
        idEntidad: empleado.idEmpleado,
        datosNuevos: {
          ...empleado,
          contraEmpleado: undefined, // No guardar contraseña
        },
      },
      req,
    );

    res.status(201).json({ success: true, data: empleado });
  } catch (error) {
    next(error);
  }
};

const desactivarEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    await EmpleadosService.desactivar(id);

    // AUDITAR
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.USUARIO_DESACTIVADO,
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Empleado #${id} desactivado`,
        tipoUsuario: req.usuario.rol,
        idUsuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre,
        emailUsuario: req.usuario.email,
        entidadAfectada: "Empleados",
        idEntidad: id,
        datosNuevos: { activo: false },
      },
      req,
    );

    res.json({ success: true, message: "Empleado desactivado" });
  } catch (error) {
    next(error);
  }
};
```

#### 6. **MercadoPagoController** - MEDIO

```javascript
const { Auditoria } = require("../helps");

const webhookHandler = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const payment = await mercadopago.payment.get(data.id);

      // AUDITAR
      await Auditoria.registrarPagoRecibido(
        {
          id: payment.id,
          transaction_amount: payment.transaction_amount,
          status: payment.status,
          external_reference: payment.external_reference,
        },
        req,
      );

      // ... procesar pago ...
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
};
```

#### 7. **OfertasController y CampanasController** - MEDIO

```javascript
const { Auditoria } = require("../helps");

const crearOferta = async (req, res, next) => {
  try {
    const oferta = await OfertasService.crear(req.body);

    // AUDITAR
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.OFERTA_CREADA,
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Oferta creada: ${oferta.porcentajeDescuento}% para producto #${oferta.idProducto}`,
        tipoUsuario: req.usuario.rol,
        idUsuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre,
        emailUsuario: req.usuario.email,
        entidadAfectada: "Ofertas",
        idEntidad: oferta.idOferta,
        datosNuevos: oferta,
      },
      req,
    );

    res.status(201).json({ success: true, data: oferta });
  } catch (error) {
    next(error);
  }
};
```

## 🔍 Controladores Opcionales (Baja Prioridad)

- **ClientesController** - Registro/modificación de clientes
- **MedicosController** - Gestión de médicos
- **RecetasController** - Emisión de recetas
- **CarritoController** - No crítico (no auditar)
- **FavoritosController** - No crítico (no auditar)

## 📊 Verificar que Funciona

1. **Inicia el servidor**:

   ```bash
   npm run dev
   ```

2. **Haz login** (ya está integrado en AuthController)

3. **Consulta la tabla**:
   ```sql
   SELECT * FROM auditoria ORDER BY fechaHora DESC LIMIT 10;
   ```

Deberías ver un registro con:

- `evento: LOGIN_EXITOSO`
- Tu información de usuario
- IP y user agent

## 🎯 Prioridades de Integración

1. **CRÍTICO** (Hacer primero):
   - ✅ AuthController (ya integrado)
   - ⏳ PermisosController
   - ⏳ VentasOnlineController
   - ⏳ VentasEmpleadosController

2. **IMPORTANTE** (Hacer segundo):
   - ⏳ ProductosController
   - ⏳ EmpleadosController

3. **MEDIO** (Hacer tercero):
   - ⏳ MercadoPagoController
   - ⏳ OfertasController
   - ⏳ CampanasController

4. **OPCIONAL** (Si tienes tiempo):
   - ClientesController
   - MedicosController
   - RecetasController

## 🚨 Buenas Prácticas

1. **NO guardes datos sensibles**:

   ```javascript
   datosNuevos: {
     ...usuario,
     contraCliente: undefined, // ❌ NO guardar contraseñas
     token: undefined // ❌ NO guardar tokens
   }
   ```

2. **Captura el estado anterior en UPDATE/DELETE**:

   ```javascript
   const anterior = await Service.obtenerPorId(id);
   await Service.actualizar(id, datos);
   // Guardar 'anterior' en datosAnteriores
   ```

3. **No lances errores si falla la auditoría**:

   ```javascript
   // El helper ya maneja errores internamente
   // La auditoría NO debe interrumpir el flujo principal
   ```

4. **Usuario debe venir del middleware auth**:

   ```javascript
   // En routes:
   router.put("/:id", auth, verificarRol(["admin"]), actualizar);

   // En controller, req.usuario ya está disponible:
   tipoUsuario: req.usuario.rol,
   idUsuario: req.usuario.id,
   ```

## ✅ Checklist Final

- [ ] Tabla `auditoria` creada en la BD
- [ ] AuthController integrado (ya hecho)
- [ ] PermisosController integrado
- [ ] VentasOnlineController integrado
- [ ] VentasEmpleadosController integrado
- [ ] ProductosController integrado
- [ ] EmpleadosController integrado
- [ ] MercadoPagoController integrado
- [ ] Probado con consultas SQL
- [ ] No hay errores en consola

¡Listo! Tu sistema de auditoría está completo 🎉
