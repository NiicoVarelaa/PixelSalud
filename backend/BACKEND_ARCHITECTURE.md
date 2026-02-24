# 🏗️ Arquitectura del Backend - Pixel Salud

> Documentación técnica de la arquitectura en capas, decisiones de diseño y convenciones del backend

---

## 📋 Tabla de Contenidos

- [1. Resumen Ejecutivo](#1-resumen-ejecutivo)
- [2. Arquitectura en 4 Capas](#2-arquitectura-en-4-capas)
- [3. Estructura de Carpetas Detallada](#3-estructura-de-carpetas-detallada)
- [4. Decisiones de Diseño](#4-decisiones-de-diseño)
- [5. Flujo de Request Completo](#5-flujo-de-request-completo)
- [6. Convenciones del Proyecto](#6-convenciones-del-proyecto)
- [7. Patrones de Implementación](#7-patrones-de-implementación)
- [8. Sistema de Errores](#8-sistema-de-errores)
- [9. Cómo Desarrollar Features Nuevas](#9-cómo-desarrollar-features-nuevas)
- [10. Mejores Prácticas](#10-mejores-prácticas)

---

## 1. Resumen Ejecutivo

### 🎯 Objetivos de la Arquitectura

Este backend fue diseñado con una **arquitectura limpia en 4 capas** para lograr:

1. **Separación de responsabilidades**: Cada capa tiene un propósito único y bien definido
2. **Mantenibilidad**: Código organizado y fácil de entender
3. **Escalabilidad**: Fácil agregar nuevos módulos sin afectar existentes
4. **Testabilidad**: Cada capa puede probarse de forma independiente
5. **Reutilización**: Lógica compartida centralizada en services y helpers

### ✨ Mejoras Implementadas

- ✅ **Eliminación de callbacks**: Todo usa Promises y async/await
- ✅ **Validación robusta**: Zod schemas en todas las rutas
- ✅ **Manejo de errores centralizado**: Middleware global con errores tipados
- ✅ **Transacciones SQL (ACID)**: Garantiza consistencia de datos en operaciones críticas
- ✅ **Rate limiting**: Protección contra abuso de API
- ✅ **Sistema de auditoría**: Registro automático de acciones críticas
- ✅ **Integración MercadoPago**: Webhooks con retry logic y state machine
- ✅ **Seguridad mejorada**: JWT, roles, permisos granulares, CORS configurado

### 📊 Estadísticas del Proyecto

- **18 módulos** completamente funcionales
- **4 capas** de arquitectura limpia
- **3 roles** de usuario (Admin, Empleado, Médico, Cliente)
- **60+ endpoints** REST documentados
- **100% async/await** (sin callbacks)

---

## 2. Arquitectura en 4 Capas

### 🏛️ Diagrama de Flujo

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│                   http://localhost:5173                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTP Request (JSON)
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                  CAPA 1: ROUTES                              │
│  Responsabilidad: Definir endpoints y aplicar middlewares   │
│                                                              │
│  ✓ Validación de datos (Zod schemas)                        │
│  ✓ Autenticación (JWT verify)                               │
│  ✓ Autorización (roles y permisos)                          │
│  ✓ Rate limiting                                             │
│  ✓ Enrutamiento a controllers                               │
│                                                              │
│  Archivos: routes/*.js                                       │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│               CAPA 2: CONTROLLERS                            │
│  Responsabilidad: Manejar HTTP (req, res, next)             │
│                                                              │
│  ✓ Extraer datos del request (body, params, query)          │
│  ✓ Llamar al service correspondiente                        │
│  ✓ Formatear respuesta HTTP (status, json)                  │
│  ✓ Capturar errores y pasarlos a next()                     │
│  ✓ Registrar auditoría                                       │
│                                                              │
│  Archivos: controllers/*.js                                  │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                CAPA 3: SERVICES                              │
│  Responsabilidad: Lógica de negocio                          │
│                                                              │
│  ✓ Validaciones complejas de negocio                        │
│  ✓ Coordinación de múltiples repositories                   │
│  ✓ Transformación y procesamiento de datos                  │
│  ✓ Envío de emails (Nodemailer)                             │
│  ✓ Generación de reportes                                    │
│  ✓ Cálculo de descuentos y precios                          │
│  ✓ Lanzamiento de errores de negocio                        │
│                                                              │
│  Archivos: services/*.js                                     │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│              CAPA 4: REPOSITORIES                            │
│  Responsabilidad: Acceso a datos (SQL)                       │
│                                                              │
│  ✓ Queries SQL (SELECT, INSERT, UPDATE, DELETE)             │
│  ✓ Manejo de transacciones SQL (ACID)                       │
│  ✓ Operaciones CRUD puras                                    │
│  ✓ Joins y agregaciones                                      │
│  ✓ SIN lógica de negocio                                     │
│                                                              │
│  Archivos: repositories/*.js                                 │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
                  ┌──────────────┐
                  │    MySQL     │
                  │  Database    │
                  └──────────────┘
```

### 🔑 Principio Clave: Separación de Responsabilidades

Cada capa hace **una sola cosa** y lo hace bien:

| Capa         | Hace                       | NO Hace                    |
| ------------ | -------------------------- | -------------------------- |
| Routes       | Validación, auth, enrutado | Lógica de negocio, SQL     |
| Controllers  | Manejo HTTP, orquestación  | Validación, lógica, SQL    |
| Services     | Lógica de negocio compleja | SQL directo, manejo HTTP   |
| Repositories | Queries SQL puras          | Validación, lógica negocio |

---

## 3. Estructura de Carpetas Detallada

```
backend/
│
├── 📁 config/                      # Configuración centralizada
│   ├── database.js                 # Pool de conexiones MySQL
│   ├── rateLimiters.js             # Rate limiting por tipo de operación
│   └── validateEnv.js              # Validación de variables de entorno
│
├── 📁 controllers/                 # CAPA 2: Manejadores HTTP
│   ├── AuthController.js           # Login, registro, recuperación
│   ├── ProductosController.js      # CRUD de productos
│   ├── MercadoPagoController.js    # Webhooks y pagos
│   ├── ClientesController.js       # Gestión de clientes
│   ├── EmpleadosController.js      # Gestión de empleados
│   ├── MedicosController.js        # Gestión de médicos
│   ├── CarritoController.js        # Carrito de compras
│   ├── CampanasController.js       # Descuentos programables
│   ├── VentasOnlineController.js   # E-commerce
│   ├── VentasEmpleadosController.js # Punto de venta
│   ├── RecetasController.js        # Prescripciones médicas
│   ├── FavoritosController.js      # Wishlist
│   ├── MensajesController.js       # Contacto
│   ├── ReportesController.js       # Exportación Excel
│   ├── AuditoriaController.js      # Logs de auditoría
│   ├── DashboardController.js      # Métricas y KPIs
│   ├── PermisosController.js       # Control de acceso
│   └── index.js                    # Exportación centralizada
│
├── 📁 services/                    # CAPA 3: Lógica de negocio
│   ├── AuthService.js              # Autenticación y tokens
│   ├── ProductosService.js         # Lógica de productos
│   ├── MercadoPagoService.js       # Integración MP con retry
│   ├── ClientesService.js          # Validaciones de clientes
│   ├── CarritoService.js           # Cálculo de precios/descuentos
│   ├── CampanasService.js          # Lógica de campañas activas
│   ├── VentasService.js            # Procesamiento de ventas
│   ├── EmailService.js             # Envío de correos
│   ├── ReportesService.js          # Generación de Excel
│   └── ... (18 servicios en total)
│
├── 📁 repositories/                # CAPA 4: Acceso a datos SQL
│   ├── ProductosRepository.js      # Queries de productos
│   ├── ClientesRepository.js       # Queries de clientes
│   ├── MercadoPagoRepository.js    # Persistencia de pagos
│   ├── CarritoRepository.js        # CRUD de carrito
│   ├── VentasOnlineRepository.js   # Queries de ventas online
│   ├── VentasEmpleadosRepository.js # Queries punto venta
│   ├── AuditoriaRepository.js      # Logs en BD
│   └── index.js                    # Exportación centralizada
│
├── 📁 routes/                      # CAPA 1: Definición de endpoints
│   ├── AuthRoutes.js               # POST /auth/login, /auth/registro
│   ├── ProductosRoutes.js          # GET/POST/PUT /productos
│   ├── ClientesRoutes.js           # CRUD clientes
│   ├── MercadoPagoRoutes.js        # POST /webhook, /crear-preferencia
│   └── ... (18 archivos de rutas)
│
├── 📁 middlewares/                 # Middlewares transversales
│   ├── Auth.js                     # Verificación JWT
│   ├── VerificarPermisos.js        # Control de roles y permisos
│   ├── Validate.js                 # Validación Zod
│   └── ErrorHandler.js             # Manejo global de errores
│
├── 📁 schemas/                     # Esquemas de validación Zod
│   ├── ProductoSchemas.js          # Validaciones de productos
│   ├── ClienteSchemas.js           # Validaciones de clientes
│   ├── AuthSchemas.js              # Validaciones de auth
│   └── ... (schemas por módulo)
│
├── 📁 errors/                      # Sistema de errores tipados
│   ├── AppError.js                 # Clase base de errores
│   ├── ValidationError.js          # 400 - Datos inválidos
│   ├── UnauthorizedError.js        # 401 - No autenticado
│   ├── ForbiddenError.js           # 403 - Sin permisos
│   ├── NotFoundError.js            # 404 - Recurso no existe
│   ├── ConflictError.js            # 409 - Conflicto (duplicados)
│   ├── DatabaseError.js            # 500 - Error de BD
│   └── index.js                    # Factory functions
│
├── 📁 helps/                       # Utilidades reutilizables
│   ├── EnvioMail.js                # Nodemailer configurado
│   ├── GenerarHash.js              # Bcrypt para contraseñas
│   ├── Auditoria.js                # Helper de auditoría
│   └── index.js
│
├── 📁 utils/                       # Utilidades generales
│   ├── generateToken.js            # JWT generation
│   ├── formatters.js               # Formateo de datos
│   └── validators.js               # Validaciones custom
│
├── 📁 docs/                        # Documentación adicional
│   ├── TRANSACCIONES.md            # Doc de transacciones SQL
│   ├── AUDITORIA.md                # Sistema de auditoría
│   ├── RATE_LIMITING.md            # Rate limiting
│   ├── CORS_CONFIGURATION.md       # Configuración CORS
│   └── INTEGRACION_AUDITORIA.md    # Guía de integración
│
├── 📁 database/                    # Scripts SQL
│   ├── migration_campanas_ofertas.sql
│   ├── cupones.sql
│   └── auditoria.sql
│
├── .env                            # Variables de entorno (no en repo)
├── .env.example                    # Plantilla de .env
├── .gitignore
├── index.js                        # Punto de entrada de la app
├── package.json
└── README.md                       # Documentación principal
```

### 📦 Propósito de Cada Carpeta

#### `config/`

Configuración centralizada para evitar hard-coding. Incluye conexión a BD, rate limiters, y validación de env vars al inicio.

#### `controllers/`

Manejadores delgados que solo orquestan: extraen datos → llaman service → responden HTTP. NO contienen lógica de negocio.

#### `services/`

Corazón de la aplicación. Contiene TODA la lógica de negocio. Puede llamar múltiples repos, enviar emails, calcular descuentos, etc.

#### `repositories/`

Capa de datos pura. Solo ejecutan SQL. Retornan datos crudos sin transformar. Manejan transacciones.

#### `routes/`

Definen endpoints REST. Aplican middlewares en orden: rateLimiter → auth → verificarRol → verificarPermisos → validate → controller.

#### `middlewares/`

Funciones reutilizables que se ejecutan antes de los controllers. Autenticación, autorización, validación, manejo de errores.

#### `schemas/`

Esquemas Zod para validación de datos. Uno por módulo. Validan body, params, query.

#### `errors/`

Sistema de errores tipados con códigos HTTP. Permite lanzar errores semánticos desde services.

#### `helps/`

Helpers para funcionalidades transversales: envío de emails, hashing de contraseñas, auditoría.

#### `docs/`

Documentación técnica específica de features complejas (transacciones, auditoría, rate limiting, etc).

---

## 4. Decisiones de Diseño

### 🎯 Por Qué Esta Arquitectura

#### 1. **Separación Routes → Controllers → Services → Repositories**

**Problema anterior**: Controllers con lógica de negocio mezclada con SQL.

**Solución**: Cada capa tiene una sola responsabilidad.

**Ventajas**:

- ✅ Fácil de testear (mocks de services/repos)
- ✅ Reutilización de lógica en services
- ✅ Controllers delgados y legibles
- ✅ Cambios de BD no afectan services

#### 2. **Promises y Async/Await en Todo**

**Problema anterior**: Callback hell, difícil de leer y mantener.

**Solución**: 100% async/await, código secuencial y limpio.

**Ejemplo**:

```javascript
// ❌ ANTES: Callbacks anidados
db.query("SELECT * FROM productos", (err, productos) => {
  if (err) return callback(err);
  db.query("SELECT * FROM ofertas", (err2, ofertas) => {
    if (err2) return callback(err2);
    const resultado = procesarDatos(productos, ofertas);
    callback(null, resultado);
  });
});

// ✅ DESPUÉS: Async/await limpio
const obtenerProductosConOfertas = async () => {
  const productos = await productosRepo.findAll();
  const ofertas = await ofertasRepo.findActive();
  return procesarDatos(productos, ofertas);
};
```

#### 3. **Validación con Zod en Routes**

**Problema anterior**: Validaciones manuales repetidas, propensas a errores.

**Solución**: Schemas Zod centralizados y reutilizables.

**Ventajas**:

- ✅ Validación automática antes de llegar al controller
- ✅ Errores descriptivos para el frontend
- ✅ Type-safety (TypeScript-like en JS)
- ✅ DRY: Un schema, múltiples usos

**Ejemplo**:

```javascript
// schemas/ProductoSchemas.js
const createProductoSchema = z.object({
  nombreProducto: z.string().min(3).max(100),
  precio: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoria: z.string(),
  requiereReceta: z.boolean().optional(),
});

// routes/ProductosRoutes.js
router.post(
  "/productos",
  validate({ body: createProductoSchema }), // ← Validación automática
  createProducto,
);
```

#### 4. **Sistema de Errores Tipado**

**Problema anterior**: `throw new Error()` genéricos, difícil saber qué código HTTP usar.

**Solución**: Clases de errores con status codes semánticos.

**Ventajas**:

- ✅ Services lanzan errores semánticos (`NotFoundError`, `ConflictError`)
- ✅ Middleware global los convierte a HTTP responses
- ✅ Consistencia en toda la API

**Ejemplo**:

```javascript
// services/ProductosService.js
const obtenerProducto = async (id) => {
  const producto = await productosRepo.findById(id);

  if (!producto) {
    throw createNotFoundError("Producto no encontrado"); // ← 404
  }

  return producto;
};

// middlewares/ErrorHandler.js captura y responde:
// { status: "error", message: "Producto no encontrado", statusCode: 404 }
```

#### 5. **Transacciones SQL para Operaciones Críticas**

**Problema**: Race conditions, stock negativo, datos inconsistentes.

**Solución**: Transacciones SQL (ACID) en ventas y operaciones críticas.

**Ventajas**:

- ✅ Todo se ejecuta o nada (atomicidad)
- ✅ Stock nunca queda negativo
- ✅ Integridad de datos garantizada

**Ejemplo**:

```javascript
// repositories/VentasOnlineRepository.js
const crearVentaConDetalles = async (venta, detalles) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // ← Inicia transacción

    // 1. Crear venta
    const [result] = await connection.query(
      "INSERT INTO VentasOnline SET ?",
      venta,
    );
    const idVenta = result.insertId;

    // 2. Descontar stock de cada producto
    for (const detalle of detalles) {
      await connection.query(
        "UPDATE Productos SET stock = stock - ? WHERE idProducto = ?",
        [detalle.cantidad, detalle.idProducto],
      );
    }

    // 3. Insertar detalles de venta
    await connection.query(
      "INSERT INTO DetalleVentaOnline (idVenta, idProducto, cantidad, precio) VALUES ?",
      [detalles.map((d) => [idVenta, d.idProducto, d.cantidad, d.precio])],
    );

    await connection.commit(); // ← Todo OK, confirmar cambios
    return idVenta;
  } catch (error) {
    await connection.rollback(); // ← Error, revertir TODO
    throw error;
  } finally {
    connection.release(); // ← Liberar conexión siempre
  }
};
```

**📖 Ver más**: [docs/TRANSACCIONES.md](docs/TRANSACCIONES.md)

#### 6. **Sistema de Auditoría**

**Problema**: No hay registro de quién modificó qué y cuándo.

**Solución**: Helper de auditoría centralizado que registra acciones críticas.

**Ventajas**:

- ✅ Trazabilidad completa
- ✅ Cumplimiento normativo
- ✅ Debugging facilitado

**Ejemplo**:

```javascript
// controllers/ProductosController.js
const createProducto = async (req, res, next) => {
  try {
    const producto = await productosService.crearProducto(req.body);

    // Registrar en auditoría
    await Auditoria.registrarAuditoria(
      {
        evento: "PRODUCTO_CREADO",
        modulo: Auditoria.MODULOS.PRODUCTOS,
        detalles: { idProducto: producto.idProducto },
      },
      req,
    );

    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};
```

**📖 Ver más**: [docs/AUDITORIA.md](docs/AUDITORIA.md)

#### 7. **Rate Limiting por Tipo de Operación**

**Problema**: Abuso de API, ataques DDoS, brute force en login.

**Solución**: Rate limiters diferenciados por criticidad de operación.

**Tipos**:

- `authLimiter`: Login/registro (5 intentos / 15 min)
- `mutationLimiter`: POST/PUT/DELETE (100 req / 15 min)
- `generalLimiter`: GET público (1000 req / 15 min)

**Ejemplo**:

```javascript
// routes/AuthRoutes.js
router.post(
  "/auth/login",
  authLimiter, // ← 5 intentos cada 15 min
  validate({ body: loginSchema }),
  login,
);
```

**📖 Ver más**: [docs/RATE_LIMITING.md](docs/RATE_LIMITING.md)

#### 8. **Integración MercadoPago con Estado y Retry**

**Problema**: Webhooks pueden fallar, duplicarse, o llegar fuera de orden.

**Solución**: State machine + retry logic + idempotencia.

**Flujo**:

1. Frontend solicita preferencia de pago
2. Backend crea preferencia en MP y guarda estado `PENDIENTE`
3. Usuario paga en MP
4. MP envía webhook a `/mercadopago/webhook`
5. Backend valida, actualiza estado según tipo de evento
6. Si falla, reintenta hasta 3 veces con backoff exponencial
7. Envía email de confirmación al cliente

**Ventajas**:

- ✅ Idempotencia (mismo webhook no duplica venta)
- ✅ Retry automático en fallos transitorios
- ✅ Trazabilidad completa de estados

---

## 5. Flujo de Request Completo

### 📨 Ejemplo Real: Crear un Producto

Vamos a seguir una request **POST /productos/crear** desde que llega hasta que responde:

#### **1. ROUTE: Definición y Middlewares**

**Archivo**: `routes/ProductosRoutes.js`

```javascript
router.post(
  "/productos/crear",
  mutationLimiter, // ← 1. Rate limiting (100 req/15min)
  auth, // ← 2. Verificar JWT válido
  verificarRol(["admin", "empleado"]), // ← 3. Solo admin/empleado pueden crear
  verificarPermisos("crear_productos"), // ← 4. Permiso granular específico
  validate({ body: createProductoSchema }), // ← 5. Validar datos con Zod
  createProducto, // ← 6. Controller (si todo OK)
);
```

**¿Qué pasa aquí?**

1. Si supera 100 requests en 15 min → **429 Too Many Requests**
2. Si no hay token o es inválido → **401 Unauthorized**
3. Si el rol no es admin/empleado → **403 Forbidden**
4. Si no tiene permiso `crear_productos` → **403 Forbidden**
5. Si los datos no cumplen schema → **400 Bad Request** con errores específicos
6. Si todo OK → llama al controller

---

#### **2. CONTROLLER: Manejo HTTP**

**Archivo**: `controllers/ProductosController.js`

```javascript
const createProducto = async (req, res, next) => {
  try {
    // 1. Extraer datos validados del body
    const datosProducto = req.body;

    // 2. Llamar al service (lógica de negocio)
    const producto = await productosService.crearProducto(datosProducto);

    // 3. Registrar auditoría
    await Auditoria.registrarAuditoria(
      {
        evento: "PRODUCTO_CREADO",
        modulo: Auditoria.MODULOS.PRODUCTOS,
        detalles: { idProducto: producto.idProducto },
      },
      req,
    );

    // 4. Responder con 201 Created
    res.status(201).json({
      status: "success",
      data: producto,
    });
  } catch (error) {
    // 5. Si hay error, pasarlo al middleware de errores
    next(error);
  }
};
```

**Responsabilidades**:

- ✅ Extraer datos de req.body (ya validados)
- ✅ Llamar al service
- ✅ Formatear respuesta HTTP
- ✅ Capturar errores y pasarlos a `next()`
- ❌ NO valida (lo hace la route)
- ❌ NO tiene lógica de negocio (lo hace el service)
- ❌ NO ejecuta SQL (lo hace el repository)

---

#### **3. SERVICE: Lógica de Negocio**

**Archivo**: `services/ProductosService.js`

```javascript
const crearProducto = async (data) => {
  // 1. Validaciones de negocio
  if (data.precio < 0) {
    throw createValidationError("El precio no puede ser negativo");
  }

  if (data.stock < 0) {
    throw createValidationError("El stock no puede ser negativo");
  }

  // 2. Verificar si ya existe producto con ese nombre
  const existe = await productosRepository.exists({
    nombreProducto: data.nombreProducto,
  });

  if (existe) {
    throw createConflictError("Ya existe un producto con ese nombre");
  }

  // 3. Preparar datos (agregar activo: true por defecto)
  const productoData = {
    ...data,
    activo: true,
  };

  // 4. Crear en base de datos
  const idProducto = await productosRepository.create(productoData);

  // 5. Obtener producto completo (con ofertas si tiene)
  return await productosRepository.findByIdWithOfertas(idProducto);
};
```

**Responsabilidades**:

- ✅ Validaciones de negocio complejas
- ✅ Verificar existencia de recursos
- ✅ Transformar datos antes de persistir
- ✅ Llamar a uno o múltiples repositories
- ✅ Lanzar errores semánticos
- ❌ NO maneja HTTP (lo hace el controller)
- ❌ NO ejecuta SQL directamente (lo hace el repository)

---

#### **4. REPOSITORY: Acceso a Datos**

**Archivo**: `repositories/ProductosRepository.js`

```javascript
const create = async (producto) => {
  const sql = `
    INSERT INTO Productos 
    (nombreProducto, descripcion, precio, img, categoria, stock, activo, requiereReceta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    producto.nombreProducto,
    producto.descripcion,
    producto.precio,
    producto.img,
    producto.categoria,
    producto.stock,
    producto.activo,
    producto.requiereReceta || false,
  ]);

  return result.insertId; // Retorna el ID del producto creado
};

const findByIdWithOfertas = async (idProducto) => {
  const sql = `
    SELECT 
      p.idProducto,
      p.nombreProducto,
      p.descripcion,
      p.precio AS precioRegular,
      p.img,
      p.categoria,
      p.stock,
      p.activo,
      p.requiereReceta,
      o.porcentajeDescuento,
      CASE
        WHEN o.idOferta IS NOT NULL 
        THEN p.precio * (1 - o.porcentajeDescuento / 100)
        ELSE p.precio
      END AS precioFinal,
      CASE
        WHEN o.idOferta IS NOT NULL THEN TRUE
        ELSE FALSE
      END AS enOferta
    FROM Productos p
    LEFT JOIN ofertas_old_backup o 
      ON p.idProducto = o.idProducto
      AND o.esActiva = 1 
      AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    WHERE p.idProducto = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] || null;
};
```

**Responsabilidades**:

- ✅ Ejecutar queries SQL
- ✅ Parametrizar queries (prevenir SQL injection)
- ✅ Retornar datos crudos
- ❌ NO valida datos de negocio (lo hace el service)
- ❌ NO transforma datos (lo hace el service)
- ❌ NO lanza errores de negocio (solo errores SQL)

---

#### **5. RESPUESTA HTTP**

Si todo sale bien:

```json
{
  "status": "success",
  "data": {
    "idProducto": 123,
    "nombreProducto": "Ibuprofeno 600mg",
    "descripcion": "Antiinflamatorio...",
    "precioRegular": 450.0,
    "precioFinal": 450.0,
    "img": "/productos/ibuprofeno.webp",
    "categoria": "Analgésicos",
    "stock": 100,
    "activo": true,
    "requiereReceta": false,
    "enOferta": false,
    "porcentajeDescuento": null
  }
}
```

Status: **201 Created**

---

#### **6. MANEJO DE ERRORES**

Si ocurre un error en alguna capa:

**Ejemplo 1**: Producto duplicado

```javascript
// Service lanza:
throw createConflictError("Ya existe un producto con ese nombre");

// ErrorHandler responde:
{
  "status": "error",
  "message": "Ya existe un producto con ese nombre",
  "statusCode": 409
}
```

**Ejemplo 2**: Validación Zod falla

```javascript
// Middleware validate() captura error Zod y responde:
{
  "status": "fail",
  "message": "Error de validación",
  "errors": [
    {
      "field": "precio",
      "message": "Expected number, received string"
    }
  ]
}
```

Status: **400 Bad Request**

---

### 🎯 Resumen del Flujo

```
Request: POST /productos/crear
Body: { nombreProducto: "...", precio: 450, ... }

1. ROUTE
   - ✅ Rate limit OK (no superó 100 req)
   - ✅ JWT válido (token correcto)
   - ✅ Rol = admin (autorizado)
   - ✅ Permiso crear_productos (tiene permiso)
   - ✅ Validación Zod OK (datos correctos)

2. CONTROLLER
   - Extrae req.body
   - Llama productosService.crearProducto()

3. SERVICE
   - ✅ Precio >= 0 (válido)
   - ✅ Stock >= 0 (válido)
   - ✅ No existe producto con ese nombre
   - Llama productosRepository.create()
   - Llama productosRepository.findByIdWithOfertas()
   - Retorna producto completo

4. REPOSITORY
   - INSERT INTO Productos ...
   - SELECT producto con ofertas
   - Retorna datos

5. CONTROLLER
   - Registra auditoría
   - res.status(201).json(data)

Response: 201 Created
{ status: "success", data: { ... } }
```

---

## 6. Convenciones del Proyecto

### 📝 Naming Conventions

#### Archivos

```
Controllers:   PascalCase + Controller.js  → ProductosController.js
Services:      PascalCase + Service.js     → ProductosService.js
Repositories:  PascalCase + Repository.js  → ProductosRepository.js
Routes:        PascalCase + Routes.js      → ProductosRoutes.js
Schemas:       PascalCase + Schemas.js     → ProductoSchemas.js
Middlewares:   PascalCase.js               → Auth.js, Validate.js
Errors:        PascalCase + Error.js       → NotFoundError.js
Helpers:       PascalCase.js               → EnvioMail.js
```

#### Funciones y Variables

```javascript
// Funciones: camelCase
const obtenerProductos = async () => { ... };
const crearVenta = async (datos) => { ... };

// Variables: camelCase
const productos = [];
const precioFinal = calcularPrecio();

// Constantes: UPPER_SNAKE_CASE
const MAX_INTENTOS = 3;
const TIEMPO_REINTENTO = 5000;

// Clases: PascalCase
class ProductosService { ... }
class NotFoundError extends AppError { ... }
```

#### SQL

```javascript
// Tablas y columnas: PascalCase (convención de la BD existente)
SELECT
  idProducto,
  nombreProducto,
  precioRegular
FROM Productos
WHERE activo = true;

// Alias: camelCase
SELECT
  p.idProducto,
  p.nombreProducto,
  c.nombreCategoria
FROM Productos p
INNER JOIN Categorias c ON p.idCategoria = c.idCategoria;
```

---

### 🏗️ Cómo Crear un Módulo Nuevo

Imaginemos que queremos agregar un módulo de **Proveedores**.

#### **Paso 1: Crear Schema de Validación**

```javascript
// schemas/ProveedorSchemas.js
const { z } = require("zod");

const createProveedorSchema = z.object({
  nombreProveedor: z.string().min(3).max(100),
  cuit: z.string().regex(/^\d{11}$/),
  email: z.string().email(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

const updateProveedorSchema = createProveedorSchema.partial();

const idProveedorParamSchema = z.object({
  idProveedor: z.string().regex(/^\d+$/).transform(Number),
});

module.exports = {
  createProveedorSchema,
  updateProveedorSchema,
  idProveedorParamSchema,
};
```

---

#### **Paso 2: Crear Repository**

```javascript
// repositories/ProveedoresRepository.js
const { pool } = require("../config/database");

const findAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM Proveedores WHERE activo = true ORDER BY nombreProveedor",
  );
  return rows;
};

const findById = async (idProveedor) => {
  const [rows] = await pool.query(
    "SELECT * FROM Proveedores WHERE idProveedor = ?",
    [idProveedor],
  );
  return rows[0] || null;
};

const create = async (proveedor) => {
  const sql = `
    INSERT INTO Proveedores 
    (nombreProveedor, cuit, email, telefono, direccion, activo)
    VALUES (?, ?, ?, ?, ?, true)
  `;

  const [result] = await pool.query(sql, [
    proveedor.nombreProveedor,
    proveedor.cuit,
    proveedor.email,
    proveedor.telefono,
    proveedor.direccion,
  ]);

  return result.insertId;
};

const update = async (idProveedor, data) => {
  const fields = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  values.push(idProveedor);

  const sql = `UPDATE Proveedores SET ${fields.join(", ")} WHERE idProveedor = ?`;
  await pool.query(sql, values);
};

const remove = async (idProveedor) => {
  await pool.query(
    "UPDATE Proveedores SET activo = false WHERE idProveedor = ?",
    [idProveedor],
  );
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
```

**Agregar al index**:

```javascript
// repositories/index.js
const ProveedoresRepository = require("./ProveedoresRepository");

module.exports = {
  // ... otros repos
  ProveedoresRepository,
};
```

---

#### **Paso 3: Crear Service**

```javascript
// services/ProveedoresService.js
const proveedoresRepository = require("../repositories/ProveedoresRepository");
const { createNotFoundError, createConflictError } = require("../errors");

const obtenerProveedores = async () => {
  return await proveedoresRepository.findAll();
};

const obtenerProveedorPorId = async (idProveedor) => {
  const proveedor = await proveedoresRepository.findById(idProveedor);

  if (!proveedor) {
    throw createNotFoundError("Proveedor no encontrado");
  }

  return proveedor;
};

const crearProveedor = async (data) => {
  // Validación de negocio: CUIT único
  const existe = await proveedoresRepository.findByCuit(data.cuit);

  if (existe) {
    throw createConflictError("Ya existe un proveedor con ese CUIT");
  }

  const idProveedor = await proveedoresRepository.create(data);
  return await proveedoresRepository.findById(idProveedor);
};

const actualizarProveedor = async (idProveedor, data) => {
  const existe = await proveedoresRepository.findById(idProveedor);

  if (!existe) {
    throw createNotFoundError("Proveedor no encontrado");
  }

  await proveedoresRepository.update(idProveedor, data);
  return await proveedoresRepository.findById(idProveedor);
};

const eliminarProveedor = async (idProveedor) => {
  const existe = await proveedoresRepository.findById(idProveedor);

  if (!existe) {
    throw createNotFoundError("Proveedor no encontrado");
  }

  await proveedoresRepository.remove(idProveedor);
};

module.exports = {
  obtenerProveedores,
  obtenerProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
};
```

---

#### **Paso 4: Crear Controller**

```javascript
// controllers/ProveedoresController.js
const proveedoresService = require("../services/ProveedoresService");
const { Auditoria } = require("../helps");

const getProveedores = async (req, res, next) => {
  try {
    const proveedores = await proveedoresService.obtenerProveedores();
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
};

const getProveedor = async (req, res, next) => {
  try {
    const { idProveedor } = req.params;
    const proveedor =
      await proveedoresService.obtenerProveedorPorId(idProveedor);
    res.json(proveedor);
  } catch (error) {
    next(error);
  }
};

const createProveedor = async (req, res, next) => {
  try {
    const proveedor = await proveedoresService.crearProveedor(req.body);

    await Auditoria.registrarAuditoria(
      {
        evento: "PROVEEDOR_CREADO",
        modulo: Auditoria.MODULOS.PROVEEDORES,
        detalles: { idProveedor: proveedor.idProveedor },
      },
      req,
    );

    res.status(201).json(proveedor);
  } catch (error) {
    next(error);
  }
};

const updateProveedor = async (req, res, next) => {
  try {
    const { idProveedor } = req.params;
    const proveedor = await proveedoresService.actualizarProveedor(
      idProveedor,
      req.body,
    );

    await Auditoria.registrarAuditoria(
      {
        evento: "PROVEEDOR_ACTUALIZADO",
        modulo: Auditoria.MODULOS.PROVEEDORES,
        detalles: { idProveedor },
      },
      req,
    );

    res.json(proveedor);
  } catch (error) {
    next(error);
  }
};

const deleteProveedor = async (req, res, next) => {
  try {
    const { idProveedor } = req.params;
    await proveedoresService.eliminarProveedor(idProveedor);

    await Auditoria.registrarAuditoria(
      {
        evento: "PROVEEDOR_ELIMINADO",
        modulo: Auditoria.MODULOS.PROVEEDORES,
        detalles: { idProveedor },
      },
      req,
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProveedores,
  getProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
```

**Agregar al index**:

```javascript
// controllers/index.js
const ProveedoresController = require("./ProveedoresController");

module.exports = {
  // ... otros controllers
  ProveedoresController,
};
```

---

#### **Paso 5: Crear Routes**

```javascript
// routes/ProveedoresRoutes.js
const express = require("express");
const validate = require("../middlewares/Validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  createProveedorSchema,
  updateProveedorSchema,
  idProveedorParamSchema,
} = require("../schemas/ProveedorSchemas");

const {
  getProveedores,
  getProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} = require("../controllers/ProveedoresController");

const router = express.Router();

// GET /proveedores - Listar todos
router.get(
  "/proveedores",
  auth,
  verificarRol(["admin", "empleado"]),
  getProveedores,
);

// GET /proveedores/:idProveedor - Obtener uno
router.get(
  "/proveedores/:idProveedor",
  auth,
  verificarRol(["admin", "empleado"]),
  validate({ params: idProveedorParamSchema }),
  getProveedor,
);

// POST /proveedores - Crear
router.post(
  "/proveedores",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ body: createProveedorSchema }),
  createProveedor,
);

// PUT /proveedores/:idProveedor - Actualizar
router.put(
  "/proveedores/:idProveedor",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({
    params: idProveedorParamSchema,
    body: updateProveedorSchema,
  }),
  updateProveedor,
);

// DELETE /proveedores/:idProveedor - Eliminar (baja lógica)
router.delete(
  "/proveedores/:idProveedor",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idProveedorParamSchema }),
  deleteProveedor,
);

module.exports = router;
```

**Agregar al index**:

```javascript
// routes/index.js
const ProveedoresRoutes = require("./ProveedoresRoutes");

module.exports = {
  // ... otras rutas
  ProveedoresRoutes,
};
```

---

#### **Paso 6: Registrar en index.js**

```javascript
// index.js
const { ProveedoresRoutes } = require("./routes");

// ... otras rutas
app.use("/", ProveedoresRoutes);
```

---

## 7. Patrones de Implementación

### 🔄 Patrón Repository

Todos los repositories siguen el mismo patrón CRUD:

```javascript
// Patrón estándar para repositories

const findAll = async () => {
  // SELECT con filtros, joins, etc
};

const findById = async (id) => {
  // SELECT WHERE id = ?
  // Retorna un objeto o null
};

const findByField = async (field, value) => {
  // SELECT WHERE field = ?
};

const create = async (data) => {
  // INSERT
  // Retorna insertId
};

const update = async (id, data) => {
  // UPDATE
  // No retorna nada (o rows affected)
};

const remove = async (id) => {
  // UPDATE activo = false (soft delete)
  // o DELETE (hard delete)
};
```

---

### 🛠️ Patrón Service

```javascript
// services/ExampleService.js

const obtener = async () => {
  // Llamar a repository.findAll()
  // Posible transformación de datos
  return data;
};

const obtenerPorId = async (id) => {
  const item = await repository.findById(id);

  if (!item) {
    throw createNotFoundError("Recurso no encontrado");
  }

  return item;
};

const crear = async (data) => {
  // 1. Validaciones de negocio
  if (data.campo < 0) {
    throw createValidationError("Campo no puede ser negativo");
  }

  // 2. Verificar duplicados
  const existe = await repository.findByField("nombre", data.nombre);
  if (existe) {
    throw createConflictError("Ya existe");
  }

  // 3. Preparar datos
  const dataPreparada = { ...data, activo: true };

  // 4. Persistir
  const id = await repository.create(dataPreparada);

  // 5. Retornar completo
  return await repository.findById(id);
};

const actualizar = async (id, data) => {
  // 1. Verificar que existe
  const existe = await repository.findById(id);
  if (!existe) {
    throw createNotFoundError("No encontrado");
  }

  // 2. Validaciones
  // ...

  // 3. Actualizar
  await repository.update(id, data);

  // 4. Retornar actualizado
  return await repository.findById(id);
};

const eliminar = async (id) => {
  const existe = await repository.findById(id);
  if (!existe) {
    throw createNotFoundError("No encontrado");
  }

  await repository.remove(id);
};
```

---

### 🎯 Patrón Controller

```javascript
// controllers/ExampleController.js

const get = async (req, res, next) => {
  try {
    const data = await service.obtener();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await service.obtenerPorId(id);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const item = await service.crear(req.body);

    // Auditoría
    await Auditoria.registrarAuditoria(
      {
        evento: "RECURSO_CREADO",
        modulo: Auditoria.MODULOS.RECURSO,
        detalles: { id: item.id },
      },
      req,
    );

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await service.actualizar(id, req.body);

    await Auditoria.registrarAuditoria(
      {
        evento: "RECURSO_ACTUALIZADO",
        modulo: Auditoria.MODULOS.RECURSO,
        detalles: { id },
      },
      req,
    );

    res.json(item);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.eliminar(id);

    await Auditoria.registrarAuditoria(
      {
        evento: "RECURSO_ELIMINADO",
        modulo: Auditoria.MODULOS.RECURSO,
        detalles: { id },
      },
      req,
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
```

---

## 8. Sistema de Errores

### 🚨 Tipos de Errores

El backend tiene clases de errores específicas para cada situación:

| Error             | Status | Cuándo usarlo                             |
| ----------------- | ------ | ----------------------------------------- |
| ValidationError   | 400    | Datos inválidos de negocio                |
| UnauthorizedError | 401    | Sin token o token inválido                |
| ForbiddenError    | 403    | Sin permisos para la acción               |
| NotFoundError     | 404    | Recurso no existe                         |
| ConflictError     | 409    | Duplicados, violación de única constraint |
| DatabaseError     | 500    | Error de base de datos                    |

---

### 🛠️ Cómo Lanzar Errores

```javascript
const {
  createValidationError,
  createNotFoundError,
  createConflictError,
  createForbiddenError,
} = require("../errors");

// En un service:

// ❌ Dato inválido
if (precio < 0) {
  throw createValidationError("El precio no puede ser negativo");
}

// 🔍 No encontrado
const producto = await repository.findById(id);
if (!producto) {
  throw createNotFoundError("Producto no encontrado");
}

// ⚠️ Conflicto (duplicado)
const existe = await repository.findByEmail(email);
if (existe) {
  throw createConflictError("Ya existe un usuario con ese email");
}

// 🚫 Sin permisos
if (user.rol !== "admin") {
  throw createForbiddenError(
    "Solo administradores pueden realizar esta acción",
  );
}
```

---

### 🌐 Middleware de Errores

El middleware `ErrorHandler` captura todos los errores:

```javascript
// middlewares/ErrorHandler.js

const errorHandler = (err, req, res, next) => {
  // 1. Loguear en desarrollo
  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error capturado:", {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    });
  }

  // 2. Errores Zod (validación)
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      status: "fail",
      message: "Error de validación",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // 3. Errores MySQL
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      status: "error",
      message: "Ya existe un registro con esos datos",
    });
  }

  // 4. Errores personalizados (AppError)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: err.status || "error",
      message: err.message,
    });
  }

  // 5. Error genérico 500
  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
};
```

---

### ✅ Respuestas Estandarizadas

Todas las respuestas siguen este formato:

**Éxito**:

```json
{
  "status": "success",
  "data": { ... }
}
```

**Error de validación (400)**:

```json
{
  "status": "fail",
  "message": "Error de validación",
  "errors": [{ "field": "email", "message": "Email inválido" }]
}
```

**Error de negocio (404, 409, etc)**:

```json
{
  "status": "error",
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

**Error de servidor (500)**:

```json
{
  "status": "error",
  "message": "Error interno del servidor"
}
```

---

## 9. Cómo Desarrollar Features Nuevas

### 📝 Checklist para Nuevo Feature

- [ ] **1. Schema de validación** (`schemas/`) - Define qué datos acepta la API
- [ ] **2. Repository** (`repositories/`) - Queries SQL para persistir/obtener datos
- [ ] **3. Service** (`services/`) - Lógica de negocio y validaciones
- [ ] **4. Controller** (`controllers/`) - Manejo HTTP y auditoría
- [ ] **5. Routes** (`routes/`) - Endpoints con middlewares
- [ ] **6. Registrar en index.js** - Montar las rutas
- [ ] **7. Probar endpoints** - Postman/Thunder Client
- [ ] **8. Documentar** - Agregar a README si es complejo

---

### 🧪 Testing Manual

Usar herramientas como **Postman**, **Thunder Client** o **curl**:

```bash
# Crear producto
curl -X POST http://localhost:5000/productos/crear \
  -H "Content-Type: application/json" \
  -H "auth: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nombreProducto": "Aspirina 500mg",
    "descripcion": "Analgésico",
    "precio": 350,
    "stock": 100,
    "categoria": "Analgésicos",
    "img": "/productos/aspirina.webp"
  }'

# Obtener productos
curl http://localhost:5000/productos

# Obtener un producto
curl http://localhost:5000/productos/1
```

---

### 📊 Order de Implementación Recomendado

1. **Schema** → Define el contrato de datos
2. **Repository** → Implementa persistencia SQL
3. **Service** → Agrega lógica de negocio
4. **Controller** → Conecta HTTP con services
5. **Routes** → Configura endpoints y middlewares
6. **Testing** → Prueba cada endpoint

---

## 10. Mejores Prácticas

### ✅ DOs (Hacer)

1. **Usar async/await** siempre (nunca callbacks)
2. **Lanzar errores semánticos** (`createNotFoundError`, no `throw new Error()`)
3. **Validar en capas**: Zod en routes, lógica en services
4. **Usar transacciones** para operaciones críticas (ventas, stock)
5. **Registrar auditoría** en acciones importantes
6. **Parametrizar queries SQL** (prevenir SQL injection)
7. **Usar rate limiters** en rutas sensibles
8. **Retornar datos completos** después de crear/actualizar
9. **Soft deletes** (activo = false) en vez de DELETE
10. **Liberar conexiones** siempre en transacciones (finally)

---

### ❌ DON'Ts (No Hacer)

1. **No mezclar capas**: Controller NO debe tener SQL
2. **No hardcodear valores**: Usar variables de entorno
3. **No usar callbacks**: Todo debe ser async/await
4. **No ignorar errores**: Siempre usar try/catch y next()
5. **No validar solo en frontend**: Siempre validar en backend
6. **No exponer datos sensibles**: Nunca retornar contraseñas
7. **No hacer queries N+1**: Usar JOINs cuando sea posible
8. **No olvidar auditoría**: Registrar acciones críticas
9. **No commitear .env**: Está en .gitignore
10. **No usar `SELECT *`**: Especificar columnas necesarias

---

### 🔐 Seguridad

```javascript
// ✅ BIEN: Token en header
const token = req.headers.auth?.split(" ")[1];

// ✅ BIEN: Hash de contraseñas
const hash = await bcrypt.hash(password, 10);

// ✅ BIEN: Queries parametrizadas
await pool.query("SELECT * FROM Usuarios WHERE email = ?", [email]);

// ❌ MAL: Query sin parametrizar (SQL injection)
await pool.query(`SELECT * FROM Usuarios WHERE email = '${email}'`);

// ❌ MAL: Contraseña en respuesta
res.json({ user: { ...user, password: hash } }); // ❌ NUNCA

// ✅ BIEN: Excluir contraseña
const { password, ...userData } = user;
res.json(userData);
```

---

### 🚀 Performance

```javascript
// ✅ BIEN: Un query con JOIN
const productos = await pool.query(`
  SELECT p.*, c.nombreCategoria
  FROM Productos p
  LEFT JOIN Categorias c ON p.idCategoria = c.idCategoria
`);

// ❌ MAL: N+1 queries
const productos = await pool.query("SELECT * FROM Productos");
for (const p of productos) {
  p.categoria = await pool.query(
    "SELECT * FROM Categorias WHERE idCategoria = ?",
    [p.idCategoria],
  );
}

// ✅ BIEN: Limitar resultados
await pool.query("SELECT * FROM Productos LIMIT 100");

// ✅ BIEN: Paginación
const offset = (page - 1) * limit;
await pool.query("SELECT * FROM Productos LIMIT ? OFFSET ?", [limit, offset]);
```

---

## 📚 Recursos Adicionales

### Documentación Interna

- [docs/TRANSACCIONES.md](docs/TRANSACCIONES.md) - Sistema de transacciones SQL (ACID)
- [docs/AUDITORIA.md](docs/AUDITORIA.md) - Sistema de auditoría
- [docs/RATE_LIMITING.md](docs/RATE_LIMITING.md) - Rate limiting
- [docs/CORS_CONFIGURATION.md](docs/CORS_CONFIGURATION.md) - Configuración CORS
- [docs/INTEGRACION_AUDITORIA.md](docs/INTEGRACION_AUDITORIA.md) - Guía de auditoría
- [README.md](README.md) - Documentación principal del proyecto

---

## 🎓 Conclusión

Este backend fue diseñado para ser:

- ✅ **Mantenible**: Código organizado y fácil de entender
- ✅ **Escalable**: Fácil agregar nuevos módulos
- ✅ **Seguro**: Autenticación, autorización, validación en capas
- ✅ **Performante**: Transacciones SQL, queries optimizados
- ✅ **Trazable**: Sistema de auditoría completo
- ✅ **Robusto**: Manejo de errores centralizado

La arquitectura en 4 capas garantiza que cada parte del sistema tenga una responsabilidad única y bien definida, facilitando el desarrollo, testing y mantenimiento a largo plazo.

---

**Autor**: Equipo de Desarrollo Pixel Salud  
**Última actualización**: Febrero 2026  
**Versión**: 1.0.0
