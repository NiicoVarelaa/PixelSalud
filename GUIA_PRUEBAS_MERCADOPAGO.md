# 🧪 Guía de Pruebas - Integración Mercado Pago

## 📋 Estado Actual de la Integración

✅ **Webhook configurado correctamente** - Recibiendo notificaciones
✅ **Backend funcionando** - Ngrok activo y procesando webhooks
✅ **Lógica de reintentos activa** - 5 intentos con 3s de espera
⚠️ **Problema identificado**: Los pagos no se completan en Mercado Pago

## 🔍 Análisis del Último Intento

Según los logs:
1. ✅ Se creó la preferencia de pago correctamente
2. ✅ Se recibió webhook de `merchant_order` (estado: opened)
3. ✅ Se recibió webhook de `payment.created` (ID: 1342311195)
4. ❌ **NO se recibió webhook de `payment.updated` con estado `approved`**

**Conclusión**: El pago fue creado pero **nunca fue completado/aprobado** en la página de Mercado Pago.

## 🎯 Flujo Correcto de Webhooks

Para que un pago se apruebe correctamente, debes recibir estos webhooks en orden:

1. **`merchant_order`** (topic) - Estado: `opened`
   - Indica que se creó la orden
   - `order_status: 'payment_required'`
   - ✅ Se recibe automáticamente

2. **`payment.created`** (action) - Pago creado ⚠️ **SE IGNORA**
   - El usuario abrió la página de pago
   - ⚠️ **Este webhook se IGNORA** porque el pago puede no estar disponible en la API
   - El pago aún no fue procesado

3. **`payment.updated`** (action) - Pago actualizado ⭐ **ESTE ES EL IMPORTANTE**
   - El usuario completó el pago con tarjeta
   - Estado final: `approved`, `rejected`, etc.
   - **Este webhook actualiza la DB a "aprobado"**
   - ✅ **SOLO ESTE WEBHOOK PROCESA EL PAGO**

4. **`merchant_order`** (topic) - Orden actualizada
   - Estado: `closed`
   - `order_status: 'paid'`
   - Se recibe después de que el pago fue aprobado

## 💳 Tarjetas de Prueba para Sandbox

### ✅ Tarjetas que APRUEBAN el pago

| Tarjeta | Número | CVV | Fecha | Nombre |
|---------|--------|-----|-------|--------|
| **Visa** | 4509 9535 6623 3704 | 123 | 11/25 | APRO |
| **Mastercard** | 5031 7557 3453 0604 | 123 | 11/25 | APRO |
| **American Express** | 3711 803032 57522 | 1234 | 11/25 | APRO |

### ❌ Tarjetas que RECHAZAN el pago

| Tarjeta | Número | CVV | Fecha | Nombre | Motivo |
|---------|--------|-----|-------|--------|--------|
| **Visa** | 4509 9535 6623 3704 | 123 | 11/25 | OCHO | Fondos insuficientes |
| **Mastercard** | 5031 7557 3453 0604 | 123 | 11/25 | OCHO | Fondos insuficientes |

### 📝 Datos del Titular (para cualquier tarjeta)

- **Documento**: CPF o DNI
- **Número**: 12345678 (o cualquier número válido)
- **Email**: test_user_123@test.com

## 🧪 Pasos para Probar Correctamente

### 1. Iniciar el Servidor Backend
```bash
cd backend
npm start
# Asegúrate de que Ngrok esté activo
```

### 2. Iniciar el Frontend
```bash
cd frontend
npm run dev
# Debería estar en http://localhost:5173
```

### 3. Realizar una Compra de Prueba

1. Agrega productos al carrito
2. Ve al checkout
3. Haz clic en "Pagar con Mercado Pago"
4. **En la página de Mercado Pago (IMPORTANTE)**:
   - Selecciona "Tarjeta de débito o crédito"
   - Ingresa el número de tarjeta: **4509 9535 6623 3704**
   - **Nombre del titular**: **APRO** (exactamente así, en mayúsculas)
   - **Fecha de vencimiento**: 11/25
   - **CVV**: 123
   - **Tipo de documento**: DNI o CPF
   - **Número de documento**: 12345678
   - **Email**: test@test.com
5. **⚠️ MUY IMPORTANTE**: Haz clic en el botón **"Pagar"** o **"Finalizar compra"**
   - NO cierres la ventana antes de hacer clic en "Pagar"
   - NO vuelvas atrás sin completar el pago
   - Espera a que aparezca la confirmación de pago

### 4. Verificar los Webhooks

Deberías ver en la consola del backend:

```
=== WEBHOOK RECIBIDO ===
🔔 Detalles de notificación:
- Tipo: payment
- Acción: payment.created
💳 Payment ID real: [ID_DEL_PAGO]
ℹ️ Webhook de payment.created IGNORADO - Esperando payment.updated
   Razón: El pago puede no estar disponible aún en la API
   El webhook de payment.updated llegará cuando el pago sea procesado
=== FIN WEBHOOK ===

=== WEBHOOK RECIBIDO ===
🔔 Detalles de notificación:
- Tipo: payment
- Acción: payment.updated  ⭐ ESTE ES EL QUE APRUEBA
💳 Payment ID real: [ID_DEL_PAGO]
📋 Procesando pago ID: [ID_DEL_PAGO]
✅ DETALLES DEL PAGO OBTENIDOS:
  - payment_id: [ID_DEL_PAGO]
  - status: approved  ⭐ ESTADO APROBADO
  - status_detail: accredited
  - external_reference: venta_XX_XXXXXXXXX
  - transaction_amount: 16500
  - payment_method_id: visa
✅ PAGO APROBADO - Actualizando venta: venta_XX_XXXXXXXXX
✅ Venta XX actualizada a 'aprobado'
✅ Stock actualizado correctamente
=== FIN WEBHOOK ===
```

### 5. Verificar en la Base de Datos

```sql
SELECT * FROM VentasOnlines 
WHERE externalReference = 'venta_16_1762626201588' 
ORDER BY idVentaO DESC LIMIT 1;
```

El campo `estado` debería ser `'aprobado'`.

## 🔧 Cambios Realizados en el Código

### 1. Corrección del ID del Pago
**Antes**: Usaba `id` (ID del webhook)
**Ahora**: Usa `data.id` (ID real del pago)

### 2. Procesamiento de Más Acciones
**Antes**: Solo procesaba `payment.updated`
**Ahora**: Procesa `payment.created`, `payment.updated`, `payment.authorized`

### 3. Manejo de Más Estados
**Antes**: Solo manejaba `approved` y `rejected`
**Ahora**: Maneja `approved`, `authorized`, `rejected`, `cancelled`, `refunded`, `charged_back`

### 4. Logs Mejorados
- Muestra todos los detalles de la notificación
- Indica claramente qué ID se está usando
- Muestra más información del pago (status_detail, payment_method, etc.)

## 🐛 Troubleshooting

### Problema: Solo llega payment.created, no llega payment.updated

**Síntomas**:
```
✅ Webhook de payment.created recibido
ℹ️ Webhook de payment.created IGNORADO
❌ NO llega webhook de payment.updated
```

**Causa**: El pago **NO fue completado** en la página de Mercado Pago.

**Solución**:
1. ⚠️ **DEBES hacer clic en el botón "Pagar"** en la página de Mercado Pago
2. NO cierres la ventana antes de completar el pago
3. Espera a que aparezca la confirmación de pago
4. Usa el nombre del titular **"APRO"** (en mayúsculas) para que el pago sea aprobado

### Problema: "Payment not found" después de 5 intentos

**Síntomas**:
```
🔍 Consultando API de MercadoPago... (Intento 1/5)
ℹ️ Pago no encontrado en el intento 1. Reintentando en 3s...
...
❌ Error obteniendo detalles del pago: Payment not found
```

**Causa**: El pago fue notificado pero **no existe en la API** porque no fue completado.

**Solución**:
- ✅ **Ahora se ignora `payment.created`** para evitar este error
- Solo se procesa `payment.updated` cuando el pago realmente existe
- Completa el pago en la página de Mercado Pago para recibir `payment.updated`

### Problema: No llega el webhook de payment.updated

**Posibles causas**:
1. El pago no se completó en Mercado Pago
2. El webhook no está configurado correctamente
3. Ngrok se desconectó

**Solución**:
- Verifica que completaste el pago en la página de Mercado Pago
- Verifica que Ngrok esté activo: `ngrok http 3000`
- Verifica la configuración del webhook en el panel de Mercado Pago

### Problema: El estado sigue siendo "pendiente"

**Posibles causas**:
1. No llegó el webhook de `payment.updated`
2. El `external_reference` no coincide
3. Error en la actualización de la DB

**Solución**:
- Revisa los logs del backend para ver qué webhooks llegaron
- Verifica que el `external_reference` en la DB coincida con el del pago
- Verifica que no haya errores de SQL en los logs

### Problema: "Payment not found"

**Posibles causas**:
1. El pago fue creado pero aún no está disponible en la API
2. Estás usando el token incorrecto (producción vs sandbox)
3. El pago expiró o fue cancelado

**Solución**:
- Espera unos segundos y vuelve a intentar
- Verifica que estés usando el token de sandbox para pagos de prueba
- Completa el pago en la página de Mercado Pago

## 📊 Verificación de la Configuración

### Verificar Token de Acceso
El token debe ser de **TEST** (sandbox) para pruebas:
- Comienza con: `TEST-`
- Ejemplo: `TEST-1234567890-123456-abcdefghijklmnopqrstuvwxyz-123456789`

### Verificar URL del Webhook
Debe ser accesible desde Internet:
- ✅ Correcto: `https://tu-dominio.ngrok-free.dev/mercadopago/notifications`
- ❌ Incorrecto: `http://localhost:3000/mercadopago/notifications`

### Verificar Back URLs
Deben apuntar al frontend:
```javascript
back_urls: {
  success: 'http://localhost:5173/checkout/success',
  failure: 'http://localhost:5173/checkout/failure',
  pending: 'http://localhost:5173/checkout/pending'
}
```

## ✅ Checklist Final

- [ ] Backend corriendo en el puerto correcto
- [ ] Ngrok activo y URL actualizada en Mercado Pago
- [ ] Token de TEST configurado en .env
- [ ] Webhook configurado en el panel de Mercado Pago
- [ ] Frontend corriendo en localhost:5173
- [ ] Base de datos accesible
- [ ] Usar tarjeta de prueba con nombre "APRO"
- [ ] Completar el pago en la página de Mercado Pago
- [ ] Verificar logs del backend
- [ ] Verificar estado en la base de datos

## 🎉 Resultado Esperado

Después de completar el pago con una tarjeta de prueba:

1. ✅ El webhook de `payment.updated` llega al backend
2. ✅ El pago se consulta exitosamente en la API de Mercado Pago
3. ✅ El estado del pago es `approved`
4. ✅ La venta se actualiza a `'aprobado'` en la DB
5. ✅ El stock se actualiza automáticamente
6. ✅ El navegador redirige a `/checkout/success`

---

**Última actualización**: 2025-11-08
**Versión del código**: Con correcciones de ID y manejo mejorado de webhooks
