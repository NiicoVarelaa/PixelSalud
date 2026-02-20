# 🏥 Pixel Salud - Backend API

> Sistema e-commerce para farmacia con arquitectura moderna en 4 capas

## 📋 Índice

- [Descripción General](#-descripción-general)
- [Arquitectura](#-arquitectura)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Guía para Desarrolladores](#-guía-para-desarrolladores)
- [Convenciones de Código](#-convenciones-de-código)
- [API Endpoints](#-api-endpoints)

---

## 🎯 Descripción General

Backend de un e-commerce farmacéutico construido con **Node.js + Express + MySQL**, completamente refactorizado desde una arquitectura monolítica con callbacks a una **arquitectura limpia de 4 capas** usando **Promises y Async/Await**.

### ✨ Características Principales

- 🏛️ **Arquitectura en capas**: Routes → Controllers → Services → Repositories
- ✅ **Validación robusta**: Zod para validación de schemas
- 🔐 **Autenticación JWT**: Sistema de roles (Admin, Empleado, Médico, Cliente)
- 💳 **Integración MercadoPago**: Webhooks + State machine + Retry logic
- 📧 **Sistema de emails**: Confirmaciones automáticas con Nodemailer
- 📊 **Reportes Excel**: Generación con ExcelJS
- 🎯 **Sistema de campañas**: Descuentos programables con prioridad
- 🛒 **Carrito inteligente**: Calcula descuentos en tiempo real
- 🔒 **Transacciones SQL (ACID)**: Garantiza consistencia de datos

### 🔒 Sistema de Transacciones

El backend implementa **transacciones SQL con propiedades ACID** para operaciones críticas como ventas y actualización de stock. Esto garantiza:

- ✅ **Atomicidad**: Todas las operaciones se ejecutan o ninguna
- ✅ **Consistencia**: Stock nunca negativo, datos siempre íntegros
- ✅ **Aislamiento**: Sin race conditions entre usuarios simultáneos
- ✅ **Durabilidad**: Cambios confirmados persisten siempre

**📖 [Ver documentación completa de Transacciones](docs/TRANSACCIONES.md)**

---

## 🏗️ Arquitectura

### Flujo de Datos (4 Capas)

```
┌─────────────┐
│   Cliente   │ (Frontend React)
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────────────────────────────────┐
│           1. ROUTES                      │  ← Define endpoints y middleware
│  - Validación (Zod)                     │
│  - Autenticación (JWT)                  │
│  - Permisos (Roles)                     │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│        2. CONTROLLERS                    │  ← Maneja HTTP (req, res, next)
│  - Extrae datos del request             │
│  - Llama al Service                     │
│  - Devuelve respuesta formateada        │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│         3. SERVICES                      │  ← Lógica de negocio
│  - Validaciones complejas               │
│  - Coordinación de múltiples repos      │
│  - Transformación de datos              │
│  - Envío de emails                      │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│       4. REPOSITORIES                    │  ← Acceso a datos
│  - Queries SQL                          │
│  - Transacciones                        │
│  - Operaciones CRUD                     │
└──────────────┬──────────────────────────┘
               ↓
          ┌─────────┐
          │  MySQL  │
          └─────────┘
```

### Principios de Diseño

1. **Separación de responsabilidades**: Cada capa tiene un propósito único
2. **Dependency Injection**: Las capas superiores dependen de interfaces, no implementaciones
3. **Error Handling centralizado**: Middleware global para errores
4. **Validación en capas**: Zod en routes, lógica en services
5. **Single Responsibility**: Cada función hace una sola cosa

---

## 📦 Módulos del Sistema

### Módulos Completados (18/18)

| Módulo               | Descripción             | Features Principales                |
| -------------------- | ----------------------- | ----------------------------------- |
| **Auth**             | Login/Registro          | JWT, roles, recuperación contraseña |
| **Productos**        | Gestión productos       | CRUD, búsqueda, alta/baja lógica    |
| **Campañas**         | Descuentos programables | Fechas, prioridad, porcentaje       |
| **Ofertas**          | Sistema legacy          | Migrado a Campañas                  |
| **Carrito**          | Gestión carrito         | Cálculo automático descuentos       |
| **Clientes**         | Gestión clientes        | CRUD, contraseñas, tokens           |
| **Empleados**        | Gestión empleados       | CRUD, permisos, activo/inactivo     |
| **Médicos**          | Gestión médicos         | CRUD, verificación, matricula       |
| **Favoritos**        | Wishlist                | Agregar/quitar productos            |
| **Permisos**         | Control acceso          | CRUD, asociación empleados          |
| **Recetas**          | Prescripciones          | CRUD, validación médico             |
| **Mensajes**         | Contacto                | Email automático                    |
| **Reportes**         | Exportación datos       | Excel con estilos                   |
| **Ventas Online**    | E-commerce              | Estado, historial                   |
| **Ventas Empleados** | Punto venta             | Búsqueda cliente, productos         |
| **MercadoPago**      | Pagos online            | Webhooks, retry, emails             |

---

## 📁 Estructura de Carpetas

```
backend/
├── config/
│   └── database.js              # Configuración pool MySQL
│
├── controllers/                 # Capa 2: Manejadores HTTP
│   ├── AuthController.js
│   ├── ProductosController.js
│   ├── MercadoPagoController.js
│   └── ... (18 controladores)
│
├── services/                    # Capa 3: Lógica de negocio
│   ├── AuthService.js
│   ├── ProductosService.js
│   ├── MercadoPagoService.js
│   └── ... (18 servicios)
│
├── repositories/                # Capa 4: Acceso a datos
│   ├── ProductosRepository.js
│   ├── ClientesRepository.js
│   ├── MercadoPagoRepository.js
│   └── index.js                 # Exportación centralizada
│
├── routes/                      # Capa 1: Definición endpoints
│   ├── AuthRoutes.js
│   ├── ProductosRoutes.js
│   ├── MercadoPagoRoutes.js
│   └── ... (18 rutas)
│
├── schemas/                     # Validación con Zod
│   ├── AuthSchemas.js
│   ├── ProductosSchemas.js
│   └── MercadoPagoSchemas.js
│
├── middlewares/                 # Middleware global
│   ├── Auth.js                  # Verificación JWT
│   ├── VerificarPermisos.js     # Control de roles
│   ├── validate.js              # Validador Zod
│   └── ErrorHandler.js          # Manejo centralizado errores
│
├── errors/                      # Clases de error custom
│   └── index.js                 # ValidationError, NotFoundError, etc.
│
├── helps/                       # Utilidades
│   ├── EnvioMail.js            # Servicio emails (Nodemailer)
│   └── generarHash.js          # Hashing contraseñas
│
├── utils/                       # Helpers generales
│   ├── dateUtils.js
│   ├── priceUtils.js
│   └── stringUtils.js
│
└── index.js                     # Entry point
```

---

## 🚀 Instalación

### Requisitos Previos

- Node.js >= 16.x
- MySQL >= 8.0
- NPM >= 8.x

### Pasos de Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/NiicoVarelaa/PixelSalud.git
cd PixelSalud/backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Crear base de datos (si no existe)
mysql -u root -p < database/schema.sql

# 5. Iniciar servidor
npm run dev  # Desarrollo (nodemon)
npm start    # Producción
```

---

## 🔐 Variables de Entorno

Crear archivo `.env` en la raíz del backend:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pixel_salud
DB_USER=root
DB_PASSWORD=tu_password

# JWT
SECRET_KEY=tu_clave_secreta_muy_segura_123

# MercadoPago
MP_ACCESS_TOKEN=tu_access_token_de_mercadopago
MP_WEBHOOK_SECRET=tu_webhook_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=PixelSalud <no-reply@pixelsalud.com>

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Servidor
PORT=5000
NODE_ENV=development
```

### Configuración Gmail para Emails

1. Ir a: https://myaccount.google.com/security
2. Habilitar "Verificación en 2 pasos"
3. Crear "Contraseña de aplicación"
4. Usar esa contraseña en `SMTP_PASS`

---

## 👨‍💻 Guía para Desarrolladores

### 1. Crear un nuevo Endpoint

#### Paso 1: Repository (Acceso a Datos)

```javascript
// repositories/EjemploRepository.js
const { pool } = require("../config/database");

const findAll = async () => {
  const query = "SELECT * FROM tabla_ejemplo WHERE activo = 1";
  const [rows] = await pool.query(query);
  return rows;
};

const create = async (data) => {
  const query = "INSERT INTO tabla_ejemplo (campo1, campo2) VALUES (?, ?)";
  const [result] = await pool.query(query, [data.campo1, data.campo2]);
  return result;
};

module.exports = { findAll, create };
```

#### Paso 2: Service (Lógica de Negocio)

```javascript
// services/EjemploService.js
const ejemploRepository = require("../repositories/EjemploRepository");
const { ValidationError } = require("../errors");

const obtenerTodos = async () => {
  const items = await ejemploRepository.findAll();

  // Transformar datos si es necesario
  return items.map((item) => ({
    id: item.id,
    nombre: item.campo1.toUpperCase(),
    fecha: new Date(item.createdAt).toLocaleDateString(),
  }));
};

const crear = async (data) => {
  // Validaciones de negocio
  if (data.campo1.length < 3) {
    throw new ValidationError("Campo1 debe tener al menos 3 caracteres");
  }

  const result = await ejemploRepository.create(data);
  return { id: result.insertId, ...data };
};

module.exports = { obtenerTodos, crear };
```

#### Paso 3: Controller (Manejo HTTP)

```javascript
// controllers/EjemploController.js
const ejemploService = require("../services/EjemploService");

const getAll = async (req, res, next) => {
  try {
    const items = await ejemploService.obtenerTodos();
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error); // Error handler lo maneja
  }
};

const create = async (req, res, next) => {
  try {
    const nuevoItem = await ejemploService.crear(req.body);
    res.status(201).json({
      success: true,
      data: nuevoItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create };
```

#### Paso 4: Schema (Validación)

```javascript
// schemas/EjemploSchemas.js
const { z } = require("zod");

const createEjemploSchema = z.object({
  campo1: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(100, "Máximo 100 caracteres"),
  campo2: z.number().int().positive("Debe ser positivo"),
});

module.exports = { createEjemploSchema };
```

#### Paso 5: Routes (Endpoints)

```javascript
// routes/EjemploRoutes.js
const express = require("express");
const router = express.Router();
const { getAll, create } = require("../controllers/EjemploController");
const Auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");
const { createEjemploSchema } = require("../schemas/EjemploSchemas");

// GET /ejemplo
router.get("/ejemplo", Auth, getAll);

// POST /ejemplo
router.post(
  "/ejemplo",
  Auth,
  verificarRol(["admin", "empleado"]),
  validate({ body: createEjemploSchema }),
  create,
);

module.exports = router;
```

#### Paso 6: Registrar en index.js

```javascript
// index.js
const ejemploRoutes = require("./routes/EjemploRoutes");
app.use("/", ejemploRoutes);
```

---

## 📝 Convenciones de Código

### Nomenclatura

```javascript
// Variables: camelCase
const nombreUsuario = "Juan";
const totalPrecio = 100;

// Funciones: camelCase + verbo
const obtenerProductos = async () => {};
const crearCliente = async (data) => {};

// Clases: PascalCase
class ProductosService {}
class ValidationError extends Error {}

// Constantes: UPPERCASE
const MAX_INTENTOS = 5;
const DB_HOST = process.env.DB_HOST;

// Archivos: PascalCase para clases/módulos
ProductosController.js;
ProductosService.js;
ProductosRepository.js;
```

### Manejo de Errores

```javascript
// ✅ CORRECTO: Usar clases de error custom
const { ValidationError, NotFoundError } = require("../errors");

if (!producto) {
  throw new NotFoundError("Producto no encontrado");
}

if (precio < 0) {
  throw new ValidationError("Precio debe ser positivo");
}

// ✅ CORRECTO: Propagar errores con next()
try {
  const resultado = await service.operacion();
  res.json(resultado);
} catch (error) {
  next(error); // ErrorHandler lo maneja automáticamente
}

// ❌ INCORRECTO: Manejar errores manualmente
try {
  // ...
} catch (error) {
  res.status(500).json({ error: error.message }); // NO HACER
}
```

### Async/Await

```javascript
// ✅ CORRECTO: Siempre async/await
const obtenerProducto = async (id) => {
  const producto = await repository.findById(id);
  return producto;
};

// ❌ INCORRECTO: Callbacks o Promises sin await
const obtenerProducto = (id, callback) => {
  repository.findById(id, (err, result) => {
    callback(err, result);
  });
};
```

### Validación

```javascript
// ✅ CORRECTO: Usar Zod en routes
const schema = z.object({
  email: z.string().email(),
  edad: z.number().min(18),
});

router.post("/ruta", validate({ body: schema }), controller);

// Validaciones de negocio en services
if (stock < cantidad) {
  throw new ValidationError("Stock insuficiente");
}
```

---

## 🔗 API Endpoints

### Autenticación

```http
POST   /login              # Login de usuarios
POST   /registroCliente    # Registro de nuevos clientes
POST   /recuperar-password # Solicitar token recuperación
POST   /reset-password     # Cambiar contraseña con token
```

### Productos

```http
GET    /productos          # Listar todos (con ofertas/campañas)
GET    /productos/:id      # Obtener uno por ID
POST   /productos          # Crear producto (admin/empleado)
PUT    /productos/:id      # Actualizar producto (admin/empleado)
DELETE /productos/:id      # Dar de baja (admin)
GET    /productos/inactivos # Productos dados de baja (admin)
PUT    /productos/:id/activar # Reactivar producto (admin)
```

### Carrito

```http
GET    /carrito            # Obtener carrito (con descuentos)
POST   /carrito            # Agregar producto al carrito
PUT    /carrito/:id        # Actualizar cantidad
DELETE /carrito/:id        # Quitar producto
DELETE /carrito/vaciar     # Vaciar carrito completo
```

### Campañas

```http
GET    /campanas           # Listar todas las campañas
GET    /campanas/activas   # Solo campañas activas
GET    /campanas/:id       # Obtener campaña con productos
POST   /campanas           # Crear campaña (admin)
PUT    /campanas/:id       # Actualizar campaña (admin)
DELETE /campanas/:id       # Eliminar campaña (admin)
```

### Productos en Campañas

```http
GET    /campanas/:id/productos          # Productos de una campaña
POST   /campanas/:id/productos          # Agregar producto a campaña
PUT    /campanas/:id/productos/:prodId  # Actualizar descuento override
DELETE /campanas/:id/productos/:prodId  # Quitar de campaña
```

### MercadoPago

```http
POST   /mercadopago/create-order       # Crear orden de pago
POST   /mercadopago/notifications      # Webhook (MP lo llama)
GET    /mercadopago/orders              # Historial de compras
DELETE /mercadopago/clearUserCart      # Limpiar carrito
```

### Favoritos

```http
GET    /favoritos          # Listar favoritos del usuario
POST   /favoritos          # Agregar a favoritos
DELETE /favoritos/:id      # Quitar de favoritos
```

### Clientes (Admin)

```http
GET    /clientes           # Listar todos
GET    /clientes/:id       # Obtener uno
POST   /clientes           # Crear cliente
PUT    /clientes/:id       # Actualizar cliente
DELETE /clientes/:id       # Desactivar cliente
```

### Ventas Online

```http
GET    /mis-compras        # Historial del cliente
GET    /ventasOnline/todas # Todas las ventas (admin/empleado)
GET    /ventasOnline/:id   # Detalle de una venta
POST   /ventasOnline       # Crear venta manual (empleado)
```

### Reportes

```http
GET    /reportes/ventas-online    # Excel ventas online
GET    /reportes/ventas-empleado  # Excel ventas empleado
```

---

## 🧪 Testing

### Ejecutar Tests (cuando estén implementados)

```bash
npm test              # Todos los tests
npm run test:unit     # Tests unitarios
npm run test:integration # Tests de integración
npm run test:coverage # Cobertura de código
```

### Ejemplo de Test

```javascript
// tests/services/ProductosService.test.js
const productosService = require("../../services/ProductosService");

describe("ProductosService", () => {
  test("obtenerProductos devuelve array", async () => {
    const productos = await productosService.obtenerProductos();
    expect(Array.isArray(productos)).toBe(true);
  });

  test("obtenerProductoPorId lanza NotFoundError si no existe", async () => {
    await expect(productosService.obtenerProductoPorId(99999)).rejects.toThrow(
      "Producto no encontrado",
    );
  });
});
```

---

## 🐛 Debugging

### Logs en Desarrollo

```javascript
// Usar console.log con contexto
console.log("=== WEBHOOK RECIBIDO ===");
console.log("Timestamp:", new Date().toISOString());
console.log("Data:", JSON.stringify(data, null, 2));
console.log("=== FIN WEBHOOK ===");
```

### Errores Comunes

#### 1. "Token no válido"

```bash
# Verificar que el header sea:
Authorization: Bearer <tu-token-jwt>
```

#### 2. "ValidationError: ..."

```bash
# Revisar el schema en /schemas y comparar con el body enviado
```

#### 3. "Unknown column en BD"

```bash
# Verificar que la columna exista en MySQL
# Revisar mayúsculas/minúsculas de nombres de tablas
```

---

## 📚 Recursos Adicionales

### Documentación Externa

- [Express.js](https://expressjs.com/)
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [Zod](https://zod.dev/)
- [JSON Web Tokens](https://jwt.io/)
- [MercadoPago API](https://www.mercadopago.com.ar/developers/es/docs)
- [Nodemailer](https://nodemailer.com/)
- [ExcelJS](https://github.com/exceljs/exceljs)

### Diagramas

#### Flujo de Autenticación

```
Cliente → POST /login → AuthController → AuthService
                           ↓
                    Verificar contraseña
                           ↓
                    Obtener permisos
                           ↓
                    Generar JWT
                           ↓
                    Retornar token
```

#### Flujo MercadoPago

```
Cliente → POST /create-order → Validar stock → Crear venta pendiente
                                    ↓
                            Crear preference MP
                                    ↓
                            Cliente paga en MP
                                    ↓
                            MP envía webhook
                                    ↓
                POST /notifications → Validar firma → Obtener payment
                                    ↓
                            Estado = approved?
                                    ↓
                        Actualizar venta a "retirado"
                                    ↓
                            Descontar stock
                                    ↓
                            Vaciar carrito
                                    ↓
                            Enviar email confirmación
```

---

## 🤝 Contribuir

### Workflow de Git

```bash
# 1. Crear rama desde dev
git checkout dev
git pull origin dev
git checkout -b feature/nombre-feature

# 2. Hacer cambios y commits
git add .
git commit -m "feat: descripción del cambio"

# 3. Pushear rama
git push origin feature/nombre-feature

# 4. Crear Pull Request en GitHub
# Base: dev
# Compare: feature/nombre-feature

# 5. Code review y merge

# 6. Actualizar local
git checkout dev
git pull origin dev
```

### Commits Convencionales

```bash
feat:     Nueva funcionalidad
fix:      Corrección de bug
refactor: Cambio de código sin afectar funcionalidad
perf:     Mejora de performance
docs:     Documentación
style:    Formato de código
test:     Tests
chore:    Tareas de mantenimiento
```

---

## 📞 Soporte

Para consultas o problemas:

1. **Issues en GitHub**: Crear issue descriptivo
2. **Documentación interna**: Revisar este README
3. **Code review**: Pedir revisión a compañeros

---

## 📄 Licencia

Proyecto privado - PixelSalud © 2026

---

## 🎉 ¡Gracias por ser parte del equipo!

**Última actualización**: Febrero 2026  
**Versión**: 2.0.0  
**Mantenedores**: Equipo PixelSalud
