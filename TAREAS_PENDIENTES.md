# ✅ Tareas Completadas - Sesión 18/02/2026

## 🐛 Bugs Críticos Resueltos

- [x] Error ventas online: `Unknown column 'v.tipoEntrega'`
- [x] Error ventas empleados: `pool.query is not a function`
- [x] Error handler: `AppError is not defined`
- [x] Error mensajes: 401 Unauthorized (falta token)
- [x] Error JSX: etiquetas `</td>` duplicadas

## ✨ Sistema de Mensajes Implementado

- [x] Backend: Endpoint PATCH marcar como leído
- [x] Backend: Endpoint POST responder mensaje
- [x] Backend: Repository con funciones nuevas
- [x] Backend: Service con validaciones
- [x] Backend: Controller con handlers
- [x] Backend: Routes con autenticación
- [x] Backend: Schema de validación Zod
- [x] Frontend: Marcar como leído (UI + lógica)
- [x] Frontend: Modal responder mensaje
- [x] Frontend: Eliminar mensaje con confirmación
- [x] Frontend: Archivar mensaje (cerrar)
- [x] Frontend: Ver respuestas guardadas
- [x] Frontend: Toast notifications
- [x] Frontend: Manejo de errores
- [x] Frontend: Badge de colores por estado
- [x] Frontend: Iconos intuitivos
- [x] Migración: Script SQL para BD
- [x] Documentación: README del módulo
- [x] Documentación: PR completo
- [x] Documentación: CHANGELOG

---

# 📋 Próximas Tareas - Pendientes del Audit Original

## 🔴 CRÍTICO - Seguridad

### 1. CORS Abierto a Todos los Orígenes

**Problema**:

```javascript
// backend/index.js - línea ~32
app.use(cors()); // ❌ Acepta peticiones de cualquier origen
```

**Solución sugerida**:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend dev
      "https://tu-dominio.com", // Frontend producción
      "https://pixel-salud.vercel.app", // Si usas Vercel
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "auth"],
  }),
);
```

**Tiempo estimado**: 5 minutos  
**Impacto**: Alta seguridad

---

### 2. Sin Rate Limiting en Autenticación

**Problema**: Sin protección contra ataques de fuerza bruta en `/auth/login`

**Solución sugerida**:

```bash
npm install express-rate-limit
```

```javascript
// backend/index.js o routes/AuthRoutes.js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: "Demasiados intentos de login. Intenta en 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar solo a ruta de login
app.use("/auth/login", loginLimiter);
```

**Tiempo estimado**: 15 minutos  
**Impacto**: Alta seguridad

---

### 3. AdminMédicos Completamente Comentado

**Problema**:

- `frontend/src/components/AdminMedicos.jsx` - TODO comentado
- Ruta en `App.jsx` también comentada

**Acciones**:

1. Descomentar `AdminMedicos.jsx`
2. Verificar que componente funcione
3. Descomentar ruta en `App.jsx`
4. Probar desde UI admin

**Tiempo estimado**: 30 minutos  
**Impacto**: Funcionalidad faltante

---

## 🟡 IMPORTANTE - Configuración

### 4. URLs Hardcoded en Vite Config

**Problema**:

```javascript
// frontend/vite.config.js
define: {
  'process.env.VITE_CLOUDFLARE_IMAGES_URL': JSON.stringify('https://...'),
  'process.env.VITE_CLOUDFLARE_PRODUCT_IMAGES': JSON.stringify('https://...'),
}
```

**Solución**:

1. Mover a `.env`:

```bash
# frontend/.env
VITE_CLOUDFLARE_IMAGES_URL=https://...
VITE_CLOUDFLARE_PRODUCT_IMAGES=https://...
```

2. Usar en Vite:

```javascript
// Ya no hace falta define, Vite los toma automáticamente
```

**Tiempo estimado**: 10 minutos

---

### 5. Sin Validación de Variables de Entorno

**Problema**: Backend puede iniciar sin variables críticas

**Solución**:

```javascript
// backend/config/validateEnv.js (nuevo archivo)
const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
  "MERCADOPAGO_ACCESS_TOKEN",
];

function validateEnv() {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error("❌ Faltan variables de entorno:");
    missing.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  console.log("✅ Variables de entorno validadas");
}

module.exports = { validateEnv };
```

```javascript
// backend/index.js - al inicio después de dotenv
require("dotenv").config();
const { validateEnv } = require("./config/validateEnv");
validateEnv();
```

**Tiempo estimado**: 20 minutos

---

### 6. Falta archivo .env.example

**Problema**: Nuevos developers no saben qué variables configurar

**Solución**:

```bash
# backend/.env.example
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pixel_salud

# JWT
JWT_SECRET=tu_secret_muy_seguro_aqui

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_app

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui

# Server
PORT=5000
NODE_ENV=development
```

```bash
# frontend/.env.example
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDFLARE_IMAGES_URL=https://imagedelivery.net/...
VITE_CLOUDFLARE_PRODUCT_IMAGES=https://imagedelivery.net/...
```

**Tiempo estimado**: 10 minutos

---

## 🟢 MENOR - Mejoras Opcionales

### 7. Sin Error Boundary en React

**Problema**: Si hay error en componente, pantalla blanca sin mensaje

**Solución**:

```jsx
// frontend/src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ¡Oops! Algo salió mal
            </h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || "Error desconocido"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

```jsx
// frontend/src/main.jsx
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
```

**Tiempo estimado**: 20 minutos

---

### 8. Verificar Backend de PerfilDirecciones

**Problema**: No verificado si el endpoint existe y funciona

**Acciones**:

1. Probar endpoint: `GET /clientes/:idCliente/direcciones`
2. Probar: `POST /clientes/:idCliente/direcciones`
3. Probar: `PUT /clientes/:idCliente/direcciones/:idDireccion`
4. Probar: `DELETE /clientes/:idCliente/direcciones/:idDireccion`

**Tiempo estimado**: 15 minutos

---

## 🎨 UI/UX Improvements (Objetivo Original del Usuario)

### Mejoras Rápidas (Quick Wins)

#### 1. Empty States

Componentes que necesitan mensajes cuando no hay datos:

- `AdminProductos` - "No hay productos registrados"
- `AdminClientes` - "No hay clientes registrados"
- `AdminEmpleados` - "No hay empleados registrados"
- `AdminVentasE` - "No hay ventas registradas"
- `AdminVentasO` - "No hay ventas online"

**Componente reutilizable**:

```jsx
// frontend/src/components/EmptyState.jsx
const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="text-center py-12">
    <Icon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
    {actionLabel && (
      <button onClick={onAction} className="mt-4 btn-primary">
        {actionLabel}
      </button>
    )}
  </div>
);
```

**Tiempo estimado**: 1 hora

---

#### 2. Loading Skeletons

Reemplazar "Cargando..." por skeletons animados:

```jsx
// frontend/src/components/SkeletonCard.jsx
const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-lg shadow p-4">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);
```

**Tiempo estimado**: 1 hora

---

#### 3. Hover Actions en Tablas

Mostrar botones solo al hacer hover:

```jsx
<tr className="group hover:bg-gray-50">
  <td>Dato 1</td>
  <td>Dato 2</td>
  <td className="opacity-0 group-hover:opacity-100 transition-opacity">
    <button>Editar</button>
    <button>Eliminar</button>
  </td>
</tr>
```

**Tiempo estimado**: 30 minutos

---

#### 4. Breadcrumbs en Todas las Vistas

Navegación clara:

```jsx
// Usar componente Breadcrumbs existente
<Breadcrumbs
  items={[
    { label: "Admin", path: "/admin" },
    { label: "Productos", path: "/admin/productos" },
    { label: "Editar", path: null },
  ]}
/>
```

**Tiempo estimado**: 1 hora

---

## 📊 Prioridad Sugerida

### Sprint 1: Seguridad y Estabilidad (2-3 horas)

1. 🔴 CORS configurado
2. 🔴 Rate limiting en login
3. 🔴 AdminMédicos funcional
4. 🟡 Validación de env variables
5. 🟡 .env.example creados

### Sprint 2: UI/UX Básico (3-4 horas)

1. Empty states en todos los componentes
2. Loading skeletons
3. Hover actions en tablas
4. Breadcrumbs completos

### Sprint 3: Mejoras Avanzadas (4-6 horas)

1. Error Boundary
2. Verificar PerfilDirecciones
3. Mover URLs de Cloudflare a .env
4. Otras mejoras de UX personalizadas

---

## 🎯 Meta Final

Sistema completo, seguro y con excelente UX listo para producción.

---

**Última actualización**: 18/02/2026  
**Sesión actual completada**: ✅ Sistema de Mensajes + Fixes Críticos
