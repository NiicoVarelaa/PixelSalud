# ⚡ Instrucciones Rápidas - Prueba de Pago

## 🎯 Problema Actual

❌ **El pago NO se está completando** en la página de Mercado Pago
❌ Solo llega `payment.created` (se ignora)
❌ NO llega `payment.updated` (el que aprueba el pago)

## ✅ Solución

**DEBES COMPLETAR EL PAGO** haciendo clic en "Pagar" en la página de Mercado Pago.

---

## 📝 Pasos para Probar (5 minutos)

### 1️⃣ Asegúrate de que el backend esté corriendo
```bash
cd backend
npm start
```
✅ Verifica que veas: `Servidor corriendo en puerto 3000`

### 2️⃣ Verifica que Ngrok esté activo
```bash
ngrok http 3000
```
✅ Copia la URL: `https://tu-dominio.ngrok-free.dev`

### 3️⃣ Inicia el frontend
```bash
cd frontend
npm run dev
```
✅ Abre: `http://localhost:5173`

### 4️⃣ Realiza una compra
1. Agrega un producto al carrito
2. Ve al checkout
3. Haz clic en "Pagar con Mercado Pago"

### 5️⃣ **IMPORTANTE**: Completa el pago en Mercado Pago

En la página de Mercado Pago:

```
┌─────────────────────────────────────────┐
│  💳 Tarjeta de débito o crédito         │
├─────────────────────────────────────────┤
│  Número:  4509 9535 6623 3704          │
│  Nombre:  APRO                          │
│  Vence:   11/25                         │
│  CVV:     123                           │
│  DNI:     12345678                      │
└─────────────────────────────────────────┘

    ⚠️ HAZ CLIC EN "PAGAR" ⚠️
    
    NO cierres la ventana
    NO vuelvas atrás
    Espera la confirmación
```

### 6️⃣ Verifica los logs del backend

Deberías ver:

```
✅ Webhook de payment.created IGNORADO
✅ Webhook de payment.updated recibido
✅ PAGO APROBADO
✅ Venta actualizada a 'aprobado'
```

---

## 🔍 ¿Qué cambió en el código?

### Antes (❌ ERROR)
```javascript
// Usaba el ID del webhook (incorrecto)
await handlePaymentNotification(id, req.body);
// id = 126221706588 ❌ (ID del webhook, no del pago)
```

### Ahora (✅ CORRECTO)
```javascript
// Usa el ID real del pago
const paymentId = data.id;
await handlePaymentNotification(paymentId, req.body);
// paymentId = "1325326370" ✅ (ID real del pago)

// Y además ignora payment.created
if (action === "payment.created") {
  console.log("ℹ️ Webhook de payment.created IGNORADO");
  return; // No procesar
}
```

---

## 🎉 Resultado Esperado

Después de hacer clic en "Pagar":

1. ✅ Llega `payment.created` → Se IGNORA
2. ✅ Llega `payment.updated` → Se PROCESA
3. ✅ Estado del pago: `approved`
4. ✅ Venta en DB: `'aprobado'`
5. ✅ Stock actualizado
6. ✅ Redirección a `/checkout/success`

---

## 🚨 Si Sigue Sin Funcionar

### Verifica:
- [ ] ¿Hiciste clic en "Pagar" en Mercado Pago?
- [ ] ¿Usaste el nombre "APRO" (en mayúsculas)?
- [ ] ¿Completaste todos los campos de la tarjeta?
- [ ] ¿Esperaste la confirmación de pago?
- [ ] ¿Ngrok sigue activo?
- [ ] ¿El backend está corriendo?

### Logs que deberías ver:

#### ❌ Si NO completaste el pago:
```
=== WEBHOOK RECIBIDO ===
- Acción: payment.created
ℹ️ Webhook de payment.created IGNORADO
=== FIN WEBHOOK ===

(NO llega payment.updated)
```

#### ✅ Si SÍ completaste el pago:
```
=== WEBHOOK RECIBIDO ===
- Acción: payment.created
ℹ️ Webhook de payment.created IGNORADO
=== FIN WEBHOOK ===

=== WEBHOOK RECIBIDO ===
- Acción: payment.updated  ⭐
💳 Payment ID real: 1234567890
✅ DETALLES DEL PAGO OBTENIDOS:
  - status: approved  ⭐
✅ PAGO APROBADO
✅ Venta actualizada a 'aprobado'
=== FIN WEBHOOK ===
```

---

## 📞 Necesitas Ayuda?

Si después de seguir estos pasos el pago sigue sin aprobarse:

1. Copia los logs completos del backend
2. Verifica en la DB: `SELECT * FROM VentasOnlines ORDER BY idVentaO DESC LIMIT 1;`
3. Comparte los logs y el resultado de la consulta

---

**Última actualización**: 2025-11-09
**Cambios**: Ignorar payment.created, usar data.id correcto
