# 🌐 CORS Configuration - Pixel Salud

## 📋 Descripción

CORS (Cross-Origin Resource Sharing) controla qué dominios externos pueden hacer peticiones a la API de Pixel Salud. Esta configuración es **crítica para la seguridad** en producción.

---

## ⚙️ Configuración Actual

### 📁 Archivo: `backend/index.js`

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL, // Vercel (producción)
      "https://pixel-salud.vercel.app",
      "http://localhost:5173", // Vite dev (local)
      "http://localhost:3000", // React/Next dev (local)
      "http://127.0.0.1:5173", // Vite IP alternativa
      process.env.BACKEND_URL, // ngrok (webhooks)
    ];

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloqueado: ${origin}`);
      callback(new Error(`Origen ${origin} no permitido`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "auth", "Authorization"],
  exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
```

---

## 🔑 Variables de Entorno

### Backend (`.env`)

```bash
# URLs de la aplicación
FRONTEND_URL=https://pixel-salud.vercel.app
BACKEND_URL=https://tu-url-de-ngrok.ngrok-free.app
```

### ⚠️ Importante para ngrok

Cada vez que inicies **ngrok**, se genera una nueva URL. Debes actualizar:

1. **`.env`** con la nueva URL de ngrok:

   ```bash
   BACKEND_URL=https://nueva-url.ngrok-free.app
   ```

2. **Webhook de MercadoPago** en el panel de desarrolladores:

   ```
   https://nueva-url.ngrok-free.app/mercadopago/notifications
   ```

3. **Reiniciar el servidor backend** para que tome la nueva URL

---

## 🚀 Escenarios de Uso

### 1. **Desarrollo Local (sin ngrok)**

```bash
# .env
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

**Funciona:**

- ✅ Frontend localhost → Backend localhost
- ❌ Webhooks de MercadoPago (requiere URL pública)

---

### 2. **Desarrollo con ngrok (actual)**

```bash
# .env
FRONTEND_URL=https://pixel-salud.vercel.app
BACKEND_URL=https://tu-url.ngrok-free.app
```

**Funciona:**

- ✅ Frontend Vercel → Backend ngrok
- ✅ Frontend localhost → Backend ngrok
- ✅ Webhooks de MercadoPago → Backend ngrok

**Comandos:**

```bash
# Terminal 1: Iniciar backend
cd backend
npm run dev

# Terminal 2: Iniciar ngrok
ngrok http 5000

# Copiar la URL generada (ej: https://abc123.ngrok-free.app)
# Actualizar BACKEND_URL en .env
```

---

### 3. **Producción (ambos desplegados)**

```bash
# .env (backend en producción)
FRONTEND_URL=https://pixel-salud.vercel.app
BACKEND_URL=https://api.pixelsalud.com  # Tu dominio real
```

**Funciona:**

- ✅ Frontend Vercel → Backend producción
- ✅ Webhooks de MercadoPago → Backend producción

---

## 🔒 Seguridad

### ✅ Qué permite la configuración actual:

1. **Orígenes permitidos:**
   - Frontend en Vercel
   - Localhost (puertos 3000, 5173)
   - Backend en ngrok (para webhooks)

2. **Methods permitidos:**
   - GET, POST, PUT, PATCH, DELETE

3. **Headers permitidos:**
   - `Content-Type`: JSON
   - `auth`: Token JWT custom
   - `Authorization`: Bearer tokens estándar

4. **Sin origen (webhooks):**
   - Permite peticiones de MercadoPago, Postman, curl

### ❌ Qué bloquea:

- Cualquier otro dominio no listado
- Métodos HTTP no permitidos (CONNECT, TRACE, etc.)
- Headers no autorizados

---

## 🧪 Testing

### Test 1: CORS desde frontend Vercel

```javascript
// Desde consola del navegador en pixel-salud.vercel.app
fetch("https://tu-ngrok.ngrok-free.app/productos", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((data) => console.log("✅ CORS OK:", data))
  .catch((err) => console.error("❌ CORS Error:", err));
```

**Resultado esperado:** ✅ Respuesta con productos

---

### Test 2: CORS desde origen no permitido

```javascript
// Desde cualquier otra web (ej: google.com)
fetch("https://tu-ngrok.ngrok-free.app/productos")
  .then((res) => res.json())
  .catch((err) => console.error("❌ Bloqueado por CORS:", err));
```

**Resultado esperado:** ❌ Error CORS bloqueado

---

### Test 3: Verificar headers en respuesta

```bash
# PowerShell
curl -I -X OPTIONS http://localhost:5000/productos `
  -H "Origin: http://localhost:5173" `
  -H "Access-Control-Request-Method: GET"
```

**Headers esperados en respuesta:**

```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, auth, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

---

## 🐛 Troubleshooting

### ❌ Error: "No 'Access-Control-Allow-Origin' header"

**Causa:** El origen no está en la whitelist

**Solución:**

1. Verifica la URL exacta en el error
2. Agrégala a `allowedOrigins` en `index.js`:
   ```javascript
   const allowedOrigins = [
     // ... otras URLs
     "https://nueva-url.com", // Agregar aquí
   ];
   ```

---

### ❌ Error: "Webhook de MercadoPago no llega"

**Causa:** URL de ngrok desactualizada

**Solución:**

1. Verificar que ngrok esté activo: `curl https://tu-url.ngrok-free.app`
2. Actualizar `BACKEND_URL` en `.env`
3. Reiniciar servidor backend
4. Actualizar webhook en MercadoPago:
   - Panel → Webhooks → Editar
   - URL: `https://nueva-url.ngrok-free.app/mercadopago/notifications`

---

### ❌ Error: "Credentials mode requires origin header"

**Causa:** `credentials: true` sin origin específico

**Solución:** Ya está resuelto con la función `origin` que valida cada petición

---

### ⚠️ Warning: "CORS bloqueado para origen: ..."

**Causa:** Alguien intentó acceder desde origen no permitido (normal)

**Acción:**

- Si es legítimo → Agregar a whitelist
- Si es sospechoso → Ignorar (seguridad funcionando)

---

## 📊 Logs de CORS

Los intentos de CORS bloqueados aparecen en consola:

```
⚠️ CORS bloqueado para origen: https://sitio-malicioso.com
```

Para producción, considera enviar estos logs a un servicio de monitoreo (Sentry, LogRocket, etc.)

---

## 🔄 Actualización de ngrok

### Script automático (opcional)

Crea `backend/update-ngrok.sh`:

```bash
#!/bin/bash
# Actualiza automáticamente la URL de ngrok en .env

NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*ngrok[^"]*')

if [ -z "$NGROK_URL" ]; then
  echo "❌ Error: ngrok no está corriendo"
  exit 1
fi

echo "✅ Nueva URL de ngrok: $NGROK_URL"

# Actualizar .env
sed -i "s|BACKEND_URL=.*|BACKEND_URL=$NGROK_URL|" .env

echo "✅ .env actualizado"
echo "⚠️ Recuerda actualizar el webhook en MercadoPago"
```

**Uso:**

```bash
chmod +x update-ngrok.sh
./update-ngrok.sh
```

---

## 📝 Checklist de Despliegue

### Desarrollo Local

- [ ] `FRONTEND_URL=http://localhost:5173`
- [ ] `BACKEND_URL=http://localhost:5000`
- [ ] Frontend y backend corriendo localmente

### Desarrollo con ngrok

- [x] ngrok instalado y corriendo
- [x] `BACKEND_URL` actualizado con URL de ngrok
- [x] Webhook de MercadoPago actualizado
- [x] Frontend en Vercel apuntando a ngrok

### Producción

- [ ] `FRONTEND_URL` con dominio real de producción
- [ ] `BACKEND_URL` con dominio real de producción
- [ ] Webhook de MercadoPago con URL de producción
- [ ] SSL/HTTPS configurado
- [ ] Eliminar URLs de desarrollo de `allowedOrigins`

---

## 🔗 Referencias

- [MDN - CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://github.com/expressjs/cors)
- [ngrok Documentation](https://ngrok.com/docs)
- [MercadoPago Webhooks](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0.0  
**Mantenedor:** Equipo Pixel Salud
