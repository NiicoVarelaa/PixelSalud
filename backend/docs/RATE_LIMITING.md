# 🛡️ Rate Limiting - Documentación Técnica

## 📋 Índice

- [Descripción General](#descripción-general)
- [Configuración](#configuración)
- [Tipos de Limitadores](#tipos-de-limitadores)
- [Implementación](#implementación)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Descripción General

El sistema de Rate Limiting protege la API de Pixel Salud contra:

- ✅ **Ataques de fuerza bruta** (login)
- ✅ **Spam de cuentas** (registro)
- ✅ **Abuso de endpoints** (operaciones masivas)
- ✅ **Fraude financiero** (transacciones excesivas)

### Tecnología

- **Paquete**: `express-rate-limit` v7.x
- **Almacenamiento**: Memoria (desarrollo) / Redis (producción recomendado)
- **Headers estándar**: `RateLimit-*` (RFC draft)

---

## Configuración

### 📁 Archivo: `backend/config/rateLimiters.js`

```javascript
const rateLimit = require("express-rate-limit");

// 5 tipos de limitadores definidos:
// - generalLimiter
// - authLimiter
// - registerLimiter
// - mutationLimiter
// - paymentLimiter
```

---

## Tipos de Limitadores

### 1. **generalLimiter**

Protección general para endpoints públicos

| Configuración    | Valor                                                |
| ---------------- | ---------------------------------------------------- |
| **Ventana**      | 15 minutos                                           |
| **Max requests** | 100                                                  |
| **Uso**          | Rutas GET públicas                                   |
| **Mensaje**      | "Demasiadas solicitudes, intenta de nuevo más tarde" |

**Ejemplo de aplicación:**

```javascript
router.get("/productos", generalLimiter, getProductos);
```

---

### 2. **authLimiter**

Previene ataques de fuerza bruta

| Configuración    | Valor                                                         |
| ---------------- | ------------------------------------------------------------- |
| **Ventana**      | 15 minutos                                                    |
| **Max requests** | 5                                                             |
| **Uso**          | Login, password reset                                         |
| **Mensaje**      | "Demasiados intentos de autenticación, intenta en 15 minutos" |

**Endpoints protegidos:**

- ✅ `POST /login` - Inicio de sesión
- ✅ `POST /clientes/olvide-password` - Solicitar reset
- ✅ `POST /clientes/restablecer-password/:token` - Restablecer contraseña

**Ejemplo:**

```javascript
router.post("/login", authLimiter, validate(...), login);
```

---

### 3. **registerLimiter**

Previene spam de cuentas

| Configuración    | Valor                                                   |
| ---------------- | ------------------------------------------------------- |
| **Ventana**      | 1 hora                                                  |
| **Max requests** | 3                                                       |
| **Uso**          | Registro de usuarios                                    |
| **Mensaje**      | "Demasiados registros desde esta IP, intenta en 1 hora" |

**Endpoints protegidos:**

- ✅ `POST /registroCliente` - Registro de cliente
- ✅ `POST /clientes/crear` - Crear cliente (público)

**Ejemplo:**

```javascript
router.post("/registroCliente", registerLimiter, validate(...), registrarCliente);
```

---

### 4. **mutationLimiter**

Protege operaciones de escritura

| Configuración    | Valor                                                           |
| ---------------- | --------------------------------------------------------------- |
| **Ventana**      | 10 minutos                                                      |
| **Max requests** | 30                                                              |
| **Uso**          | POST/PUT/DELETE (excepto auth y register)                       |
| **Mensaje**      | "Demasiadas operaciones de modificación, intenta en 10 minutos" |

**Endpoints protegidos:**

- ✅ Productos: crear, actualizar, dar de baja, activar
- ✅ Clientes: crear express, actualizar, dar de baja, activar
- ✅ Empleados: crear, actualizar, dar de baja, reactivar
- ✅ Y otras operaciones de escritura

**Ejemplo:**

```javascript
router.post("/productos/crear", mutationLimiter, auth, verificarRol(...), createProducto);
```

---

### 5. **paymentLimiter**

Protección para transacciones financieras

| Configuración    | Valor                                             |
| ---------------- | ------------------------------------------------- |
| **Ventana**      | 30 minutos                                        |
| **Max requests** | 10                                                |
| **Uso**          | Operaciones con MercadoPago                       |
| **Mensaje**      | "Demasiadas transacciones, intenta en 30 minutos" |

**Endpoints protegidos:**

- ✅ `POST /mercadopago/create-order` - Crear orden de pago

**⚠️ Importante:** El webhook de MercadoPago (`/notifications`) **NO** tiene rate limit para no bloquear notificaciones legítimas.

**Ejemplo:**

```javascript
router.post("/create-order", paymentLimiter, Auth, verificarRol(...), createOrder);
```

---

## Implementación

### 📌 Paso 1: Importar limitadores

En el archivo de rutas:

```javascript
const {
  authLimiter,
  registerLimiter,
  mutationLimiter,
  paymentLimiter,
} = require("../config/rateLimiters");
```

### 📌 Paso 2: Aplicar middleware

**Orden recomendado:**

```javascript
router.post(
  "/ruta",
  limitadorElegido,     // 1️⃣ Rate limiter (PRIMERO)
  auth,                 // 2️⃣ Autenticación
  verificarRol(...),    // 3️⃣ Autorización
  validate(...),        // 4️⃣ Validación
  controller            // 5️⃣ Controlador
);
```

### 📌 Paso 3: Seleccionar limiter apropiado

| Tipo de endpoint | Limiter a usar              |
| ---------------- | --------------------------- |
| Login / Auth     | `authLimiter`               |
| Registro público | `registerLimiter`           |
| Transacciones $  | `paymentLimiter`            |
| POST/PUT/DELETE  | `mutationLimiter`           |
| GET público      | `generalLimiter` (opcional) |

---

## Testing

### ✅ Test Manual

#### 1. Test de Login (authLimiter)

```bash
# Script de prueba - PowerShell
for ($i=1; $i -le 6; $i++) {
  Write-Host "Intento $i"
  curl -X POST http://localhost:5000/login `
    -H "Content-Type: application/json" `
    -d '{"email":"test@test.com","password":"wrong"}'
}
# Intento 6 debe retornar HTTP 429
```

**Respuesta esperada en intento 6:**

```json
{
  "message": "Demasiados intentos de autenticación, intenta en 15 minutos"
}
```

#### 2. Test de Registro (registerLimiter)

```bash
# Script de prueba
for ($i=1; $i -le 4; $i++) {
  Write-Host "Registro $i"
  curl -X POST http://localhost:5000/registroCliente `
    -H "Content-Type: application/json" `
    -d "{\"email\":\"test$i@test.com\",\"password\":\"Test123\"}"
}
# Intento 4 debe retornar HTTP 429
```

#### 3. Test de Pagos (paymentLimiter)

```bash
# 11 intentos de crear orden
for ($i=1; $i -le 11; $i++) {
  curl -X POST http://localhost:5000/mercadopago/create-order `
    -H "auth: tu-token-jwt" `
    -H "Content-Type: application/json" `
    -d '{"products":[],"customer_info":{}}'
}
# Intento 11 debe retornar HTTP 429
```

### 📊 Verificar Headers de Respuesta

Todas las respuestas incluyen headers estándar:

```http
RateLimit-Limit: 5
RateLimit-Remaining: 3
RateLimit-Reset: 1735689600
```

| Header                | Descripción                                  |
| --------------------- | -------------------------------------------- |
| `RateLimit-Limit`     | Máximo de requests permitidos                |
| `RateLimit-Remaining` | Requests restantes en ventana actual         |
| `RateLimit-Reset`     | Timestamp Unix cuando se resetea el contador |

---

## Troubleshooting

### ❌ Problema: "Demasiadas solicitudes" en desarrollo

**Causa:** Estás testeando repetidamente y alcanzaste el límite.

**Soluciones:**

1. **Espera el tiempo de ventana** (15 min, 30 min, etc.)
2. **Reinicia el servidor** (memoria se limpia)
3. **Usa diferentes IPs** (VPN, móvil, etc.)
4. **Desactiva temporalmente** (solo desarrollo):
   ```javascript
   // En rateLimiters.js
   skip: () => process.env.NODE_ENV === "development";
   ```

### ❌ Problema: Usuarios legítimos bloqueados

**Causa:** Límites muy estrictos o IPs compartidas (NAT corporativo).

**Solución:**

1. **Ajusta los límites** en `rateLimiters.js`:

   ```javascript
   const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 10, // Aumenta de 5 a 10
   });
   ```

2. **Usa keyGenerator personalizado** (por usuario en lugar de IP):
   ```javascript
   const userBasedLimiter = rateLimit({
     keyGenerator: (req) => req.user?.id || req.ip,
   });
   ```

### ❌ Problema: Webhook de MercadoPago bloqueado

**Causa:** Se aplicó rate limit al endpoint de notificaciones.

**Solución:**
Asegurarse de que `/mercadopago/notifications` **NO** tiene rate limiter:

```javascript
// ✅ CORRECTO - Sin rate limiter
router.post("/notifications", mercadoPagoController.receiveWebhook);

// ❌ INCORRECTO - Con rate limiter
router.post(
  "/notifications",
  paymentLimiter,
  mercadoPagoController.receiveWebhook,
);
```

### ❌ Problema: Rate limit no funciona

**Checklist:**

- [ ] ¿El paquete está instalado? `npm list express-rate-limit`
- [ ] ¿El limiter está importado en la ruta?
- [ ] ¿El middleware está **ANTES** del controlador?
- [ ] ¿El servidor se reinició después de aplicar cambios?

---

## 🚀 Recomendaciones de Producción

### 1. **Usar Redis para almacenamiento**

En producción, usar memoria compartida:

```javascript
const RedisStore = require("rate-limit-redis");
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
});
```

**Ventajas:**

- ✅ Funciona en múltiples servidores (load balancing)
- ✅ Persistencia entre reinicios
- ✅ No consume memoria del servidor Node.js

### 2. **Configurar diferentes límites por entorno**

```javascript
const isDevelopment = process.env.NODE_ENV === "development";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 100 : 5, // Más permisivo en dev
});
```

### 3. **Logging de bloqueos**

```javascript
const authLimiter = rateLimit({
  // ... config
  handler: (req, res) => {
    console.warn(`🚨 Rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({
      message: "Demasiados intentos, intenta más tarde",
    });
  },
});
```

### 4. **Whitelist de IPs confiables**

```javascript
const trustedIPs = ["127.0.0.1", "::1", process.env.ADMIN_IP];

const authLimiter = rateLimit({
  skip: (req) => trustedIPs.includes(req.ip),
  // ... resto de config
});
```

---

## 📊 Resumen de Endpoints Protegidos

### Autenticación (authLimiter - 5/15min)

- `POST /login`
- `POST /clientes/olvide-password`
- `POST /clientes/restablecer-password/:token`

### Registro (registerLimiter - 3/1hr)

- `POST /registroCliente`
- `POST /clientes/crear`

### Pagos (paymentLimiter - 10/30min)

- `POST /mercadopago/create-order`

### Mutaciones (mutationLimiter - 30/10min)

- **Productos**: crear, actualizar, dar baja, activar
- **Clientes**: express, actualizar, dar baja, activar
- **Empleados**: crear, actualizar, dar baja, reactivar

---

## 📝 Checklist de Implementación

- [x] Paquete `express-rate-limit` instalado
- [x] Archivo `rateLimiters.js` creado con 5 tipos
- [x] Login protegido con `authLimiter`
- [x] Registro protegido con `registerLimiter`
- [x] Pagos protegidos con `paymentLimiter`
- [x] Mutaciones protegidas con `mutationLimiter`
- [x] Webhook de MercadoPago **sin** rate limit
- [ ] Testing manual completado
- [ ] Redis configurado para producción
- [ ] Logging de bloqueos implementado
- [ ] Monitoreo en producción activo

---

## 🔗 Enlaces Útiles

- [express-rate-limit Documentación](https://github.com/express-rate-limit/express-rate-limit)
- [RFC Rate Limit Headers](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/)
- [Redis Rate Limit Store](https://github.com/wyattjoh/rate-limit-redis)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0  
**Mantenedor:** Equipo Pixel Salud
