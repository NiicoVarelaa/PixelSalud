# 🔒 Sistema de Transacciones SQL

## 📋 Tabla de Contenidos

- [¿Qué es una Transacción?](#-qué-es-una-transacción)
- [¿Por qué son Importantes?](#-por-qué-son-importantes)
- [Propiedades ACID](#-propiedades-acid)
- [Problema Sin Transacciones](#-problema-sin-transacciones)
- [Solución Con Transacciones](#-solución-con-transacciones)
- [Implementación en Pixel Salud](#-implementación-en-pixel-salud)
- [Cómo Usar el Sistema](#-cómo-usar-el-sistema)
- [Ejemplos Prácticos](#-ejemplos-prácticos)
- [Errores Comunes](#-errores-comunes)

---

## 🤔 ¿Qué es una Transacción?

Una **transacción** es un conjunto de operaciones de base de datos que se ejecutan como una **unidad atómica**:

- ✅ **Todas se ejecutan exitosamente** → COMMIT (confirmar cambios)
- ❌ **Alguna falla** → ROLLBACK (revertir TODO)

### Analogía del Mundo Real

Imagina que compras en MercadoPago:

```
1. Descontar $100 de tu cuenta bancaria
2. Agregar $100 a la cuenta del vendedor
3. Actualizar el estado del pedido a "pagado"
```

**Sin transacciones**: Si el paso 1 funciona pero el 2 falla, ¡perdiste $100 y el vendedor no recibió nada!

**Con transacciones**: Si cualquier paso falla, TODOS se revierten. Tu dinero está seguro.

---

## 🚨 ¿Por qué son Importantes?

### Escenarios Críticos en E-commerce

#### 1️⃣ **Venta Aprobada en MercadoPago**

```
Operaciones necesarias:
✓ Actualizar venta a "retirado"
✓ Descontar stock de productos
✓ Vaciar carrito del cliente
```

**Problema sin transacciones**:

- ✅ Venta actualizada a "retirado"
- ✅ Stock descontado
- ❌ ERROR al vaciar carrito (red caída)

**Resultado**: Cliente quedó con carrito lleno, pero ya pagó. Puede volver a comprar los mismos productos.

#### 2️⃣ **Stock Insuficiente**

**Sin transacciones**:

```javascript
// Usuario A compra 5 productos (stock actual: 5)
await updateVenta(ventaA, "retirado"); // ✅
await updateStock(producto, -5); // ✅ Stock = 0

// Usuario B compra 3 del mismo producto (simultáneo)
await updateVenta(ventaB, "retirado"); // ✅
await updateStock(producto, -3); // ✅ Stock = -3 ⚠️

// Resultado: Stock negativo, overselling
```

**Con transacciones + validación**:

```javascript
await withTransaction(async (connection) => {
  // SELECT FOR UPDATE bloquea el registro
  const stock = await getStock(connection, producto);

  if (stock < cantidad) {
    throw new Error("Stock insuficiente");
    // ROLLBACK automático
  }

  await updateStock(connection, producto, -cantidad);
  await updateVenta(connection, venta, "retirado");
  // COMMIT solo si TODO fue exitoso
});
```

#### 3️⃣ **Race Conditions (Condiciones de Carrera)**

Dos usuarios comprando el último producto simultáneamente:

**Sin transacciones**:

```
Tiempo | Usuario A          | Usuario B          | Stock
-------------------------------------------------------------
T0     | Check stock: 1     | Check stock: 1     | 1
T1     | Stock OK ✓         | Stock OK ✓         | 1
T2     | Compra exitosa     | Compra exitosa     | -1 ⚠️
```

**Con transacciones + SELECT FOR UPDATE**:

```
Tiempo | Usuario A          | Usuario B          | Stock
-------------------------------------------------------------
T0     | SELECT FOR UPDATE  | Espera...          | 1 (locked)
T1     | Stock OK ✓         | Espera...          | 1
T2     | UPDATE stock       | Espera...          | 0
T3     | COMMIT             | SELECT FOR UPDATE  | 0 (locked)
T4     |                    | Stock 0 ✗          | 0
T5     |                    | ROLLBACK           | 0
```

---

## 🎯 Propiedades ACID

Las transacciones garantizan 4 propiedades fundamentales:

### **A - Atomicity (Atomicidad)**

**"Todo o nada"**

```javascript
// Ejemplo: Transferencia bancaria
await withTransaction(async (connection) => {
  await retirar(connection, cuentaA, 100); // Operación 1
  await depositar(connection, cuentaB, 100); // Operación 2

  // Si alguna falla, AMBAS se revierten
});
```

### **C - Consistency (Consistencia)**

**"Las reglas de negocio se cumplen siempre"**

```javascript
// Ejemplo: Stock nunca negativo
if (stock < cantidad) {
  throw new Error("Stock insuficiente");
  // ROLLBACK garantiza que el stock no se descontó
}
```

### **I - Isolation (Aislamiento)**

**"Las transacciones no se interfieren"**

```javascript
// SELECT FOR UPDATE bloquea el registro
const [rows] = await connection.query(
  "SELECT stock FROM Productos WHERE id = ? FOR UPDATE",
  [idProducto],
);

// Otras transacciones esperan hasta que esta termine
```

### **D - Durability (Durabilidad)**

**"Una vez confirmado, persiste para siempre"**

```javascript
await connection.commit(); // ✅ Datos guardados en disco
// Aunque el servidor se apague, los cambios permanecen
```

---

## ❌ Problema Sin Transacciones

### Código Vulnerable (ANTES)

```javascript
// services/MercadoPagoService.js (versión antigua)
const updatePaymentInDatabase = async (paymentDetails) => {
  // ... validaciones ...

  // ⚠️ PROBLEMA: Operaciones independientes
  await mercadoPagoRepository.updateVentaEstado(idVenta, "retirado");
  await updateStockForOrder(idVenta);
  await mercadoPagoRepository.clearUserCart(idCliente);

  // Si clearUserCart falla, las anteriores YA se ejecutaron
};
```

### Problemas Potenciales

| Escenario                      | Consecuencia                       | Impacto                   |
| ------------------------------ | ---------------------------------- | ------------------------- |
| Error en `clearUserCart`       | Venta cobrada, pero carrito lleno  | Cliente puede re-comprar  |
| Error en `updateStock`         | Venta cobrada, stock no descontado | Overselling               |
| Error de red intermitente      | Estado inconsistente               | Datos corruptos           |
| Caída de servidor              | Operaciones parciales              | Inconsistencia permanente |
| Stock agotado por otro usuario | Se vende producto sin stock        | Pérdida de credibilidad   |

---

## ✅ Solución Con Transacciones

### Código Seguro (DESPUÉS)

```javascript
// services/MercadoPagoService.js (versión nueva)
const updatePaymentInDatabase = async (paymentDetails) => {
  // ... validaciones ...

  try {
    await withTransaction(async (connection) => {
      // ✅ Todas estas operaciones son ATÓMICAS

      // 1. Actualizar venta
      await mercadoPagoRepository.updateVentaEstadoTx(
        connection,
        idVenta,
        "retirado",
      );

      // 2. Obtener detalles
      const detalles = await mercadoPagoRepository.getDetallesVentaTx(
        connection,
        idVenta,
      );

      // 3. Validar y actualizar stock (con bloqueo)
      await mercadoPagoRepository.updateProductStockTx(
        connection,
        detalles.map((d) => ({
          idProducto: d.idProducto,
          quantity: d.cantidad,
        })),
      );

      // 4. Limpiar carrito
      await mercadoPagoRepository.clearUserCartTx(connection, idCliente);

      // Si llegamos aquí, COMMIT automático ✅
    });

    console.log("✅ Transacción exitosa");
  } catch (error) {
    // Si algo falló, ROLLBACK automático ❌
    console.error("❌ Error:", error.message);
    // TODOS los cambios se revirtieron
  }
};
```

### Ventajas del Nuevo Sistema

| Característica               | Beneficio                       |
| ---------------------------- | ------------------------------- |
| **Atomicidad**               | Todo se guarda o nada se guarda |
| **Validación de stock**      | No se puede vender sin stock    |
| **Bloqueo de registros**     | No hay race conditions          |
| **Rollback automático**      | Errores no corrompen datos      |
| **Consistencia garantizada** | Base de datos siempre íntegra   |

---

## 🛠️ Implementación en Pixel Salud

### Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│    Service (MercadoPagoService.js)      │
│  - Lógica de negocio                    │
│  - Llama a withTransaction()            │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│    Helper (utils/transaction.js)        │
│  - Gestiona BEGIN/COMMIT/ROLLBACK       │
│  - Manejo automático de errores         │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│   Repository (MercadoPagoRepository)    │
│  - Métodos *Tx (transaccionales)        │
│  - Reciben connection como parámetro    │
└──────────────┬──────────────────────────┘
               │
               ↓
          ┌────────┐
          │  MySQL │
          └────────┘
```

### Archivos Modificados

#### 1. `utils/transaction.js` (NUEVO)

Helper que simplifica el uso de transacciones:

```javascript
const withTransaction = async (callback) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // BEGIN
    const result = await callback(connection);
    await connection.commit(); // COMMIT
    return result;
  } catch (error) {
    await connection.rollback(); // ROLLBACK
    throw error;
  } finally {
    connection.release(); // Liberar conexión
  }
};
```

#### 2. `repositories/MercadoPagoRepository.js` (ACTUALIZADO)

Métodos transaccionales que aceptan una conexión:

```javascript
// Método normal (fuera de transacción)
const updateVentaEstado = async (idVenta, estado) => {
  await pool.query("UPDATE VentasOnlines SET estado = ? WHERE id = ?", [
    estado,
    idVenta,
  ]);
};

// Método transaccional (dentro de transacción)
const updateVentaEstadoTx = async (connection, idVenta, estado) => {
  await connection.query("UPDATE VentasOnlines SET estado = ? WHERE id = ?", [
    estado,
    idVenta,
  ]);
};

// ⚠️ NUEVO: Validación de stock con bloqueo
const updateProductStockTx = async (connection, items) => {
  for (const item of items) {
    // SELECT FOR UPDATE bloquea el registro
    const [rows] = await connection.query(
      "SELECT stock FROM Productos WHERE idProducto = ? FOR UPDATE",
      [item.idProducto],
    );

    // Validar stock disponible
    if (rows[0].stock < item.quantity) {
      throw new Error(`Stock insuficiente para producto ${item.idProducto}`);
    }

    // Actualizar stock
    await connection.query(
      "UPDATE Productos SET stock = stock - ? WHERE idProducto = ?",
      [item.quantity, item.idProducto],
    );
  }
};
```

#### 3. `services/MercadoPagoService.js` (ACTUALIZADO)

Usa transacciones en operaciones críticas:

```javascript
const { withTransaction } = require("../utils/transaction");

const updatePaymentInDatabase = async (paymentDetails) => {
  // ... código ...

  await withTransaction(async (connection) => {
    await mercadoPagoRepository.updateVentaEstadoTx(
      connection,
      venta.idVentaO,
      "retirado",
    );

    const detalles = await mercadoPagoRepository.getDetallesVentaTx(
      connection,
      venta.idVentaO,
    );

    await mercadoPagoRepository.updateProductStockTx(
      connection,
      detalles.map((d) => ({
        idProducto: d.idProducto,
        quantity: d.cantidad,
      })),
    );

    await mercadoPagoRepository.clearUserCartTx(connection, venta.idCliente);
  });
};
```

---

## 📖 Cómo Usar el Sistema

### Paso 1: Importar el Helper

```javascript
const { withTransaction } = require("../utils/transaction");
```

### Paso 2: Envolver Operaciones Críticas

```javascript
const realizarOperacionCritica = async () => {
  try {
    const resultado = await withTransaction(async (connection) => {
      // Todas las operaciones aquí son transaccionales

      await repository.operacion1Tx(connection, param1);
      await repository.operacion2Tx(connection, param2);
      await repository.operacion3Tx(connection, param3);

      // Retornar resultado si es necesario
      return { success: true };
    });

    console.log("✅ Transacción exitosa:", resultado);
  } catch (error) {
    console.error("❌ Transacción falló:", error.message);
    // Todos los cambios fueron revertidos
  }
};
```

### Paso 3: Crear Métodos Transaccionales en Repositories

```javascript
// Método normal
const crearUsuario = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre) VALUES (?)",
    [data.nombre],
  );
  return result.insertId;
};

// Método transaccional
const crearUsuarioTx = async (connection, data) => {
  const [result] = await connection.query(
    "INSERT INTO usuarios (nombre) VALUES (?)",
    [data.nombre],
  );
  return result.insertId;
};

module.exports = {
  crearUsuario, // Para uso normal
  crearUsuarioTx, // Para uso dentro de transacciones
};
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Crear Venta Completa

```javascript
const crearVentaCompleta = async (clienteId, productos) => {
  return await withTransaction(async (connection) => {
    // 1. Crear venta principal
    const [ventaResult] = await connection.query(
      "INSERT INTO VentasOnlines (idCliente, total, estado) VALUES (?, ?, ?)",
      [clienteId, total, "pendiente"],
    );
    const idVenta = ventaResult.insertId;

    // 2. Insertar detalles de productos
    for (const producto of productos) {
      await connection.query(
        "INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad) VALUES (?, ?, ?)",
        [idVenta, producto.id, producto.cantidad],
      );
    }

    // 3. Validar y descontar stock
    for (const producto of productos) {
      const [rows] = await connection.query(
        "SELECT stock FROM Productos WHERE idProducto = ? FOR UPDATE",
        [producto.id],
      );

      if (rows[0].stock < producto.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      await connection.query(
        "UPDATE Productos SET stock = stock - ? WHERE idProducto = ?",
        [producto.cantidad, producto.id],
      );
    }

    return { idVenta, success: true };
  });
};
```

### Ejemplo 2: Transferencia de Stock

```javascript
const transferirStock = async (origen, destino, cantidad) => {
  return await withTransaction(async (connection) => {
    // 1. Verificar stock origen
    const [origenRows] = await connection.query(
      "SELECT stock FROM Productos WHERE idProducto = ? FOR UPDATE",
      [origen],
    );

    if (origenRows[0].stock < cantidad) {
      throw new Error("Stock insuficiente en origen");
    }

    // 2. Descontar de origen
    await connection.query(
      "UPDATE Productos SET stock = stock - ? WHERE idProducto = ?",
      [cantidad, origen],
    );

    // 3. Agregar a destino
    await connection.query(
      "UPDATE Productos SET stock = stock + ? WHERE idProducto = ?",
      [cantidad, destino],
    );

    // 4. Registrar movimiento
    await connection.query(
      "INSERT INTO MovimientosStock (origen, destino, cantidad, fecha) VALUES (?, ?, ?, NOW())",
      [origen, destino, cantidad],
    );

    return { success: true };
  });
};
```

### Ejemplo 3: Cancelar Venta (Revertir Stock)

```javascript
const cancelarVenta = async (idVenta) => {
  return await withTransaction(async (connection) => {
    // 1. Verificar que la venta existe y está activa
    const [ventas] = await connection.query(
      "SELECT estado FROM VentasOnlines WHERE idVentaO = ? FOR UPDATE",
      [idVenta],
    );

    if (!ventas.length) {
      throw new Error("Venta no encontrada");
    }

    if (ventas[0].estado === "cancelado") {
      throw new Error("Venta ya cancelada");
    }

    // 2. Obtener productos de la venta
    const [detalles] = await connection.query(
      "SELECT idProducto, cantidad FROM DetalleVentaOnline WHERE idVentaO = ?",
      [idVenta],
    );

    // 3. Revertir stock (sumar)
    for (const detalle of detalles) {
      await connection.query(
        "UPDATE Productos SET stock = stock + ? WHERE idProducto = ?",
        [detalle.cantidad, detalle.idProducto],
      );
    }

    // 4. Actualizar estado de venta
    await connection.query(
      "UPDATE VentasOnlines SET estado = ? WHERE idVentaO = ?",
      ["cancelado", idVenta],
    );

    return { success: true, productosRevertidos: detalles.length };
  });
};
```

---

## ⚠️ Errores Comunes

### 1. Olvidar Liberar la Conexión

❌ **INCORRECTO**:

```javascript
const connection = await pool.getConnection();
await connection.beginTransaction();
// ... operaciones ...
// ⚠️ Nunca haces connection.release()
// Resultado: Pool de conexiones se agota
```

✅ **CORRECTO**:

```javascript
const { withTransaction } = require("../utils/transaction");

await withTransaction(async (connection) => {
  // ... operaciones ...
  // connection.release() se hace automáticamente
});
```

### 2. Mezclar pool y connection

❌ **INCORRECTO**:

```javascript
await withTransaction(async (connection) => {
  await pool.query("UPDATE ..."); // ⚠️ Usando pool en vez de connection
});
```

✅ **CORRECTO**:

```javascript
await withTransaction(async (connection) => {
  await connection.query("UPDATE ..."); // ✅ Usando connection
});
```

### 3. No Propagar Errores

❌ **INCORRECTO**:

```javascript
await withTransaction(async (connection) => {
  try {
    await operation(connection);
  } catch (error) {
    console.error(error);
    // ⚠️ Error tragado, transacción hace COMMIT igual
  }
});
```

✅ **CORRECTO**:

```javascript
await withTransaction(async (connection) => {
  try {
    await operation(connection);
  } catch (error) {
    console.error(error);
    throw error; // ✅ Propagar error para ROLLBACK
  }
});
```

### 4. Olvidar SELECT FOR UPDATE

❌ **INCORRECTO**:

```javascript
await withTransaction(async (connection) => {
  const [rows] = await connection.query(
    "SELECT stock FROM Productos WHERE id = ?", // ⚠️ Sin FOR UPDATE
    [id],
  );
  // Otro usuario puede modificar el stock aquí (race condition)
  await connection.query("UPDATE Productos SET stock = ?", [newStock]);
});
```

✅ **CORRECTO**:

```javascript
await withTransaction(async (connection) => {
  const [rows] = await connection.query(
    "SELECT stock FROM Productos WHERE id = ? FOR UPDATE", // ✅ Bloqueo
    [id],
  );
  // Registro bloqueado, nadie más puede modificarlo
  await connection.query("UPDATE Productos SET stock = ?", [newStock]);
});
```

---

## 📊 Comparación: Antes vs Después

| Aspecto                   | Sin Transacciones             | Con Transacciones               |
| ------------------------- | ----------------------------- | ------------------------------- |
| **Consistencia de datos** | ❌ Puede quedar inconsistente | ✅ Siempre consistente          |
| **Stock negativo**        | ❌ Posible                    | ✅ Imposible                    |
| **Race conditions**       | ❌ Posibles                   | ✅ Prevenidas                   |
| **Errores parciales**     | ❌ Corrompen datos            | ✅ Se revierten automáticamente |
| **Overselling**           | ❌ Puede ocurrir              | ✅ No puede ocurrir             |
| **Complejidad código**    | ✅ Más simple                 | ⚠️ Levemente más complejo       |
| **Performance**           | ✅ Más rápido                 | ⚠️ Ligeramente más lento        |
| **Confiabilidad**         | ❌ Baja                       | ✅ Alta                         |
| **Producción ready**      | ❌ No                         | ✅ Sí                           |

---

## 🎓 Conclusión

### ¿Cuándo Usar Transacciones?

✅ **SÍ usar transacciones**:

- Operaciones que modifican múltiples tablas
- Actualización de stock
- Creación de ventas con detalles
- Transferencias de cualquier tipo
- Operaciones financieras
- Cambios de estado críticos

❌ **NO necesitas transacciones**:

- Consultas simples (SELECT)
- Inserciones únicas sin dependencias
- Operaciones de lectura
- Logs o auditoría
- Envío de emails (fuera de la transacción)

### Regla de Oro

> **Si una operación falló y quieres que TODAS las anteriores se reviertan, usa transacciones.**

---

## 📚 Recursos Adicionales

- [MySQL Transactions Documentation](https://dev.mysql.com/doc/refman/8.0/en/commit.html)
- [ACID Properties Explained](https://en.wikipedia.org/wiki/ACID)
- [Node.js mysql2 Transactions](https://github.com/sidorares/node-mysql2#using-transaction-support)

---

**Última actualización**: Febrero 2026  
**Autor**: Equipo PixelSalud  
**Versión**: 1.0.0
