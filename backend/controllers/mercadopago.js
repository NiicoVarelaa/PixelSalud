require("dotenv").config();
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const { conection } = require("../config/database");
const jwt = require("jsonwebtoken");

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || req.header("auth");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Función para obtener productos de la base de datos
const getProductsByIds = (productIds) => {
  if (productIds.length === 0) return Promise.resolve([]);

  const placeholders = productIds.map(() => "?").join(", ");
  const sql = `
    SELECT 
      p.idProducto,
      p.nombreProducto,
      p.descripcion,
      p.precio AS precio,
      CASE
        WHEN o.idOferta IS NOT NULL AND o.esActiva = 1 AND NOW() BETWEEN o.fechaInicio AND o.fechaFin
        THEN p.precio * (1 - o.porcentajeDescuento / 100)
        ELSE p.precio
      END AS precioFinal,
      p.img,
      p.categoria,
      p.stock
    FROM Productos p
    LEFT JOIN ofertas o ON p.idProducto = o.idProducto
      AND o.esActiva = 1
      AND NOW() BETWEEN o.fechaInicio AND o.fechaFin
    WHERE p.idProducto IN (${placeholders});
  `;

  return new Promise((resolve, reject) => {
    conection.query(sql, productIds, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

// Función para crear venta online en la base de datos
const createVentaOnline = (ventaData) => {
  return new Promise((resolve, reject) => {
    const {
      idCliente,
      preferenceId,
      totalPago,
      customerInfo,
      estado = "pendiente",
      externalReference, // 👈 ACEPTAR externalReference
    } = ventaData;

    const sql = `
      INSERT INTO VentasOnlines (idCliente, totalPago, metodoPago, estado, fechaPago, horaPago, externalReference) 
      VALUES (?, ?, 'Mercado Pago', ?, CURRENT_DATE, CURRENT_TIME, ?) 
    `;

    conection.query(
      sql,
      [idCliente, totalPago, estado, externalReference],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      }
    );
  });
};

// Inserta los items de la venta online en la tabla DetalleVentaOnline
const createDetalleVentaOnline = (idVentaO, items) => {
  return new Promise((resolve, reject) => {
    if (!items || items.length === 0) {
      return resolve();
    }

    // Normaliza los campos por si vienen con id o idProducto
    const values = items.map((item) => [
      idVentaO,
      item.idProducto ?? item.id, // acepta ambos
      item.quantity,
      item.unit_price,
    ]);

    const sql = `
      INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario)
      VALUES ?
    `;

    conection.query(sql, [values], (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

// Función para actualizar stock de productos
const updateProductStock = (items) => {
  const promises = items.map((item) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE Productos 
        SET stock = stock - ? 
        WHERE idProducto = ? AND stock >= ?
      `;

      conection.query(
        sql,
        [item.quantity, item.idProducto, item.quantity],
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  });

  return Promise.all(promises);
};

// Crear orden de pago con JWT
exports.createOrder = [
  verifyToken,
  async (req, res) => {
    const { products, customer_info, discount = 0 } = req.body;
    const userId = req.user.id;

    // Limpiar y validar URLs
    const frontendUrl = process.env.FRONTEND_URL?.trim();
    const backendUrl = process.env.BACKEND_URL?.trim();

    const isProduction = true;

    if (!frontendUrl?.startsWith("http")) {
      console.error("FRONTEND_URL inválida:", process.env.FRONTEND_URL);
      return res.status(500).json({
        success: false,
        message: "Error de configuración del servidor",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron productos para la compra.",
      });
    }

    if (!customer_info || !customer_info.email) {
      return res.status(400).json({
        success: false,
        message: "Información del cliente incompleta.",
      });
    }

    const productIds = products.map((p) => p.id);
    const productQuantities = products.reduce(
      (acc, p) => ({ ...acc, [p.id]: p.quantity }),
      {}
    );

    try {
      const dbProducts = await getProductsByIds(productIds);

      if (dbProducts.length !== products.length) {
        return res.status(400).json({
          success: false,
          message: "Algunos productos no fueron encontrados.",
        });
      }

      // Verificar stock disponible
      const stockErrors = [];
      dbProducts.forEach((product) => {
        const requestedQuantity = productQuantities[product.idProducto];
        if (product.stock < requestedQuantity) {
          stockErrors.push({
            product: product.nombreProducto,
            available: product.stock,
            requested: requestedQuantity,
          });
        }
      });

      if (stockErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Stock insuficiente para algunos productos",
          errors: stockErrors,
        });
      }

      // Calcular totales
      let subtotal = 0;
      const items = dbProducts.map((product) => {
        const priceToUse = product.precioFinal || product.precio;
        const price = Number(priceToUse);
        const quantity = Number(productQuantities[product.idProducto]);
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        return {
          id: product.idProducto,
          title: product.nombreProducto,
          description: product.descripcion || product.nombreProducto,
          unit_price: price,
          quantity: quantity,
          picture_url: product.img,
          category_id: product.categoria || "general",
          currency_id: "ARS",
        };
      });

      const total = Math.max(subtotal - discount, 0);
      const externalReference = `venta_${userId}_${Date.now()}`;
      const preference = new Preference(client);

      // Construir el body de la preferencia
      const preferenceBody = {
        items,
        payer: {
          name: customer_info.name || "",
          surname: customer_info.surname || "",
          email: customer_info.email,
          phone: {
            number: customer_info.phone?.replace(/\D/g, "") || "",
          },
          address: {
            street_name: customer_info.address?.street_name || "",
            street_number: customer_info.address?.street_number || "",
            zip_code: customer_info.address?.zip_code || "",
          },
        },
        back_urls: {
          success: `${frontendUrl}/checkout/success`,
          failure: `${frontendUrl}/checkout/failure`,
          pending: `${frontendUrl}/checkout/pending`,
        },
        statement_descriptor: "PIXELSTORE",
        external_reference: externalReference,
        notification_url: `${backendUrl}/mercadopago/notifications`,
      };

      // ✅ SOLO EN PRODUCCIÓN REAL usar auto_return
      if (isProduction) {
        preferenceBody.auto_return = "approved";
      }

      console.log("DEBUG - Configuración:");
      console.log("FRONTEND_URL:", frontendUrl);
      console.log("BACKEND_URL:", backendUrl);
      console.log("Es producción:", isProduction);
      console.log("Auto return:", preferenceBody.auto_return || "disabled");
      console.log("Back URLs:", preferenceBody.back_urls);

      console.log("Creando orden de pago para usuario:", userId);

      const response = await preference.create({
        body: preferenceBody,
      });

      console.log("=== RESPUESTA DE MERCADO PAGO ===");
      console.log("Preference ID:", response.id);
      console.log("Init Point (Producción):", response.init_point);
      console.log(
        "Sandbox Init Point (Desarrollo):",
        response.sandbox_init_point
      );
      console.log("Back URLs configuradas:", preferenceBody.back_urls);
      console.log("================================");

      // Crear venta en la base de datos (estado pendiente)
      const idVentaO = await createVentaOnline({
        idCliente: userId,
        preferenceId: response.id,
        totalPago: total,
        customerInfo: customer_info,
        estado: "pendiente",
        externalReference: externalReference,
      });

      // Crear detalles de la venta
      await createDetalleVentaOnline(idVentaO, items);

      res.json({
        success: true,
        id: response.id,
        idVentaO: idVentaO,
        init_point: response.init_point, 
        sandbox_init_point: response.sandbox_init_point,
        total: total,
        environment: "sandbox", 
      });
    } catch (error) {
      console.error("Error al crear la orden de Mercado Pago:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear la orden",
        error: error.message,
      });
    }
  },
];

// Webhook robusto para MercadoPago: maneja payment, merchant_order, verifica firma y consulta por resource
const crypto = require("crypto");

exports.receiveWebhook = async (req, res) => {
  console.log("\n=== WEBHOOK RECIBIDO ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body recibido:", JSON.stringify(req.body, null, 2));
  
  // Registrar detalles específicos de la notificación
  const { type, data, action, id, topic, resource } = req.body;
  console.log(`🔔 Detalles de notificación:`);
  console.log(`- Tipo: ${type || 'N/A'}`);
  console.log(`- Tópico: ${topic || 'N/A'}`);
  console.log(`- Acción: ${action || 'N/A'}`);
  console.log(`- ID: ${id || 'N/A'}`);
  console.log(`- Resource: ${resource || 'N/A'}`);
  
  if (data?.id) {
    console.log(`- Data ID: ${data.id}`);
  }

  // Verificar firma del webhook (opcional, recomendado)
  const signature = req.headers["x-signature"];
  if (signature && process.env.MP_WEBHOOK_SECRET) {
    const [tsPart, v1Part] = signature.split(",").map((s) => s.trim());
    const ts = tsPart?.split("=")[1];
    const v1 = v1Part?.split("=")[1];
    const bodyString = JSON.stringify(req.body);
    const secret = process.env.MP_WEBHOOK_SECRET;
    const hash = crypto
      .createHmac("sha256", secret)
      .update(ts + bodyString)
      .digest("hex");
    if (hash !== v1) {
      console.error("❌ Firma de webhook inválida");
      res.status(400).send("Invalid signature");
      return;
    }
    console.log("✅ Firma de webhook verificada");
  }

  try {
    // ✅ RESPONDER INMEDIATAMENTE a MercadoPago
    res.status(200).send("OK");
    console.log("✅ Respuesta 200 OK enviada a MercadoPago");

    // MercadoPago puede enviar dos formatos:
    // 1. { type, data, action, id, ... }
    // 2. { topic, resource, ... }
    const { type, data, action, id, topic, resource } = req.body;

    // Preferir type, pero si no existe usar topic
    const notificationType = type || topic;

    console.log("Type:", notificationType);
    console.log("Data:", data);
    console.log("Action:", action);
    console.log("ID:", id);
    console.log("Resource:", resource);

    // 🎯 DETECTAR Y MANEJAR DIFERENTES TIPOS DE NOTIFICACIÓN
    if (notificationType === "payment") {
      // Si viene resource, consultar por resource
      if (resource) {
        console.log("🔍 Procesando recurso de pago:", resource);
        await handlePaymentResource(resource);
      } else if (data?.id) {
        // ✅ USAR data.id (ID del pago real), NO el id del webhook
        const paymentId = data.id;
        console.log(`🔍 Procesando notificación de pago (${action || 'sin acción'})`);
        console.log(`💳 Payment ID real: ${paymentId}`);
        
        // 🎯 IGNORAR payment.created - solo procesar cuando el pago se actualiza
        if (action === "payment.created") {
          console.log("ℹ️ Webhook de payment.created IGNORADO - Esperando payment.updated");
          console.log("   Razón: El pago puede no estar disponible aún en la API");
          console.log("   El webhook de payment.updated llegará cuando el pago sea procesado");
          return;
        }
        
        // Procesar solo payment.updated y payment.authorized
        if (["payment.updated", "payment.authorized"].includes(action)) {
          await handlePaymentNotification(paymentId, req.body);
        } else {
          console.log(`ℹ️ Acción de pago no manejada: ${action}. Consultando estado actual...`);
          // Si es una acción desconocida, consultar el estado actual del pago
          try {
            const payment = new Payment(client);
            const paymentDetails = await payment.get({ id: paymentId });
            await updatePaymentInDatabase(paymentDetails);
          } catch (error) {
            console.error("❌ Error consultando pago:", error.message);
          }
        }
      } else {
        console.log("ℹ️ Notificación de pago sin data.id válido");
      }
    } else if (notificationType === "merchant_order") {
      if (resource) {
        await handleMerchantOrderResource(resource);
      } else {
        console.log(
          "📦 Notificación de merchant_order recibida - ID:",
          data?.id || id
        );
      }
    } else {
      console.log(`ℹ️ Tipo de notificación no manejada: ${notificationType}`);
    }
  } catch (error) {
    console.error("❌ ERROR en receiveWebhook:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
  }

  console.log("=== FIN WEBHOOK ===\n");
};
// Consulta el recurso de pago por URL (según documentación oficial)
async function handlePaymentResource(resourceUrl) {
  try {
    const payment = new Payment(client);
    // Extraer el ID del pago desde la URL si es posible
    const match = resourceUrl.match(/\/payments\/(\d+)/);
    const paymentId = match ? match[1] : null;
    if (!paymentId) {
      console.error(
        "❌ No se pudo extraer paymentId del resource:",
        resourceUrl
      );
      return;
    }
    console.log(`🔗 Consultando pago por resource: ${resourceUrl}`);
    const paymentDetails = await payment.get({ id: paymentId });
    await updatePaymentInDatabase(paymentDetails);
  } catch (error) {
    console.error("❌ Error consultando pago por resource:", error.message);
  }
}

async function handleMerchantOrderResource(resourceUrl) {
  try {
    const orderIdMatch = resourceUrl.match(/merchant_orders\/(\d+)/);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;
    if (!orderId) {
      console.error(
        "❌ No se pudo extraer merchant_order_id del resource:",
        resourceUrl
      );
      return;
    }
    console.log(`🔗 Consultando merchant_order por resource: ${resourceUrl}`);
    const fetch = require("node-fetch");
    const url = `https://api.mercadolibre.com/merchant_orders/${orderId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });
    if (!response.ok) {
      console.error(
        "❌ Error consultando merchant_order:",
        await response.text()
      );
      return;
    }
    const orderDetails = await response.json();
    console.log("✅ Detalles de merchant_order:", orderDetails);
    const approvedPayment = orderDetails.payments?.find(
      (p) => p.status === "approved"
    );
    if (approvedPayment) {
      await updatePaymentInDatabase({
        id: approvedPayment.id,
        status: approvedPayment.status,
        external_reference: orderDetails.external_reference,
      });
    } else {
      console.log(
        `ℹ️ Merchant Order ${orderDetails.id} recibida. Estado: ${orderDetails.status}. Pago aún no aprobado en la orden.`
      );
    }
  } catch (error) {
    console.error(
      "❌ Error consultando merchant_order por resource:",
      error.message
    );
  }
}

// 🎯 MANEJAR NOTIFICACIONES DE PAGO CON LÓGICA DE REINTENTO
async function handlePaymentNotification(
  paymentId,
  webhookBody,
  maxRetries = 5,
  delayMs = 3000
) {
  if (!paymentId) {
    console.log("❌ No hay paymentId en la notificación");
    return;
  }

  console.log(`📋 Procesando pago ID: ${paymentId}`);
  console.log(`🔍 Action: ${webhookBody.action}`);
  console.log(`🔍 Live mode: ${webhookBody.live_mode}`);

  // 🎯 DETECTAR PAGOS DE PRUEBA (puedes ajustar la lista de testIds)
  if (isTestPayment(paymentId)) {
    console.log(
      "✅ NOTIFICACIÓN DE PRUEBA - Webhook funcionando correctamente"
    );
    return;
  }

  // ⚠️ Si es payment.created, esperar más tiempo antes del primer intento
  // porque el pago puede no estar disponible inmediatamente
  if (webhookBody.action === "payment.created") {
    console.log("⏳ Webhook de payment.created - Esperando 5s antes de consultar...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const payment = new Payment(client);
      console.log(
        `🔍 Consultando API de MercadoPago para obtener detalles... (Intento ${attempt}/${maxRetries})`
      );

      const paymentDetails = await payment.get({ id: paymentId });

      console.log("✅ DETALLES DEL PAGO OBTENIDOS:");
      console.log("  - payment_id:", paymentDetails.id);
      console.log("  - status:", paymentDetails.status);
      console.log("  - status_detail:", paymentDetails.status_detail);
      console.log("  - external_reference:", paymentDetails.external_reference);
      console.log("  - transaction_amount:", paymentDetails.transaction_amount);
      console.log("  - merchant_order_id:", paymentDetails.order?.id);
      console.log("  - payment_method_id:", paymentDetails.payment_method_id);
      console.log("  - payment_type_id:", paymentDetails.payment_type_id);

      // 🎯 ACTUALIZAR BASE DE DATOS SEGÚN ESTADO
      await updatePaymentInDatabase(paymentDetails);
      return; // ÉXITO: Salir de la función si la consulta es exitosa
    } catch (paymentError) {
      if (
        paymentError.message === "Payment not found" &&
        attempt < maxRetries
      ) {
        console.log(
          `ℹ️ Pago no encontrado en el intento ${attempt}. Reintentando en ${
            delayMs / 1000
          }s...`
        );
        // Esperar antes de reintentar
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue; // Ir al siguiente intento
      } else {
        console.error("❌ Error obteniendo detalles del pago:");
        console.error("Message:", paymentError.message);
        console.error("Stack:", paymentError.stack);

        if (paymentError.message === "Payment not found") {
          console.log(
            `ℹ️ El pago no se encontró después de ${maxRetries} intentos. El webhook falló.`
          );
        }
        return; // Salir si es el último intento o un error diferente
      }
    }
  }
}

// 🔍 DETECTAR PAGOS DE PRUEBA
function isTestPayment(paymentId) {
  const testIds = ["123456", "1325317138", "12345678"];
  return testIds.includes(paymentId.toString());
}

// 💾 ACTUALIZAR PAGO EN BASE DE DATOS
async function updatePaymentInDatabase(paymentDetails) {
  const {
    id: payment_id,
    status,
    external_reference,
    transaction_amount,
    order,
  } = paymentDetails;

  const merchant_order_id = order?.id;

  console.log(`🎯 Actualizando base de datos con:`);
  console.log("  - payment_id:", payment_id);
  console.log("  - status:", status);
  console.log("  - external_reference:", external_reference);
  console.log("  - merchant_order_id:", merchant_order_id);
  console.log("  - transaction_amount:", transaction_amount);

  if (!external_reference) {
    console.error(
      "❌ No se puede actualizar: external_reference no encontrado"
    );
    return;
  }

  // ✅ PAGO APROBADO O AUTORIZADO
  if (["approved", "authorized"].includes(status)) {
    console.log(`✅ PAGO APROBADO - Actualizando venta: ${external_reference}`);

    const findVentaSql = `
      SELECT vo.idVentaO, vo.estado
      FROM VentasOnlines vo
      WHERE vo.externalReference = ?
    `;

    conection.query(
      findVentaSql,
      [external_reference],
      async (error, results) => {
        if (error) {
          console.error("❌ Error buscando venta:", error);
          return;
        }

        if (results.length === 0) {
          console.log(
            `❌ No se encontró venta con external_reference: ${external_reference}`
          );
          return;
        }

        const venta = results[0];

        if (venta.estado !== "pendiente") {
          console.log(
            `⚠️ Venta ${venta.idVentaO} ya fue procesada (estado: ${venta.estado})`
          );
          return;
        }

        // ACTUALIZAR VENTA A "RETIRADO" (equivalente a aprobado)
        const updateVentaSql = `
        UPDATE VentasOnlines 
        SET estado = 'retirado',
            fechaPago = CURRENT_DATE,
            horaPago = CURRENT_TIME
        WHERE idVentaO = ?
      `;

        conection.query(
          updateVentaSql,
          [venta.idVentaO],
          async (updateError) => {
            if (updateError) {
              console.error("❌ Error actualizando venta:", updateError);
              return;
            }

            console.log(`✅ Venta ${venta.idVentaO} actualizada a 'aprobado'`);

            // ACTUALIZAR STOCK
            await updateStockForOrder(venta.idVentaO);
          }
        );
      }
    );
  }
  // ❌ PAGO RECHAZADO O CANCELADO
  else if (["rejected", "cancelled", "refunded", "charged_back"].includes(status)) {
    console.log(
      `❌ PAGO RECHAZADO - Marcando como cancelado: ${external_reference}`
    );

    const updateVentaSql = `
      UPDATE VentasOnlines 
      SET estado = 'cancelado'
      WHERE externalReference = ?
    `;

    conection.query(updateVentaSql, [external_reference], (updateError) => {
      if (updateError) {
        console.error("❌ Error actualizando venta rechazada:", updateError);
      } else {
        console.log(
          `✅ Venta con referencia ${external_reference} marcada como 'cancelado'`
        );
      }
    });
  }
  // ⏳ OTROS ESTADOS - Establecer como 'pendiente' por defecto
  else {
    console.log(`ℹ️ Pago en estado: ${status} - Estableciendo como 'pendiente'`);
    
    // Actualizar el estado a 'pendiente' para cualquier otro estado no manejado
    const updateStatusSql = `
      UPDATE VentasOnlines 
      SET estado = 'pendiente',
          fechaPago = IF(? IN ('approved', 'authorized'), CURRENT_DATE, fechaPago),
          horaPago = IF(? IN ('approved', 'authorized'), CURRENT_TIME, horaPago)
      WHERE externalReference = ?
    `;

    conection.query(
      updateStatusSql, 
      [status, status, status, external_reference], 
      (error) => {
        if (error) {
          console.error("❌ Error actualizando estado intermedio:", error);
        } else {
          console.log(`✅ Estado actualizado a '${status}' para referencia: ${external_reference}`);
        }
      }
    );
  }
}

// 📦 ACTUALIZAR STOCK (tu función existente)
async function updateStockForOrder(idVentaO) {
  const getDetallesSql = `
    SELECT idProducto, cantidad 
    FROM DetalleVentaOnline 
    WHERE idVentaO = ?
  `;

  conection.query(getDetallesSql, [idVentaO], async (error, detalles) => {
    if (error) {
      console.error("❌ Error obteniendo detalles:", error);
      return;
    }

    console.log(`📦 Actualizando stock para ${detalles.length} productos`);
    const itemsToUpdate = detalles.map(d => ({
      idProducto: d.idProducto,
      quantity: d.cantidad
    }));
    try {
      const results = await updateProductStock(itemsToUpdate);
      console.log(`✅ Stock actualizado exitosamente para venta ${idVentaO}`, results);
    } catch (stockError) {
      console.error("❌ Error actualizando stock:", stockError);
    }
  });
}

// Obtener historial de ventas del usuario
exports.getUserOrders = [
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const sql = `
        SELECT 
          vo.idVentaO,
          vo.totalPago,
          vo.fechaPago,
          vo.horaPago,
          vo.metodoPago,
          vo.estado,
          dvo.idProducto,
          dvo.cantidad,
          dvo.precioUnitario,
          p.nombreProducto,
          p.img
        FROM VentasOnlines vo
        INNER JOIN DetalleVentaOnline dvo ON vo.idVentaO = dvo.idVentaO
        INNER JOIN Productos p ON dvo.idProducto = p.idProducto
        WHERE vo.idCliente = ? 
        ORDER BY vo.fechaPago DESC, vo.horaPago DESC
      `;

      conection.query(sql, [userId], (error, results) => {
        if (error) {
          console.error("Error fetching user orders:", error);
          return res.status(500).json({
            success: false,
            message: "Error al obtener las ventas",
          });
        }

        const ventasMap = new Map();

        results.forEach((row) => {
          if (!ventasMap.has(row.idVentaO)) {
            ventasMap.set(row.idVentaO, {
              idVentaO: row.idVentaO,
              totalPago: row.totalPago,
              fechaPago: row.fechaPago,
              horaPago: row.horaPago,
              metodoPago: row.metodoPago,
              estado: row.estado,
              productos: [],
            });
          }

          ventasMap.get(row.idVentaO).productos.push({
            idProducto: row.idProducto,
            nombreProducto: row.nombreProducto,
            cantidad: row.cantidad,
            precioUnitario: row.precioUnitario,
            img: row.img,
          });
        });

        const ventas = Array.from(ventasMap.values());

        res.json({
          success: true,
          ventas: ventas,
        });
      });
    } catch (error) {
      console.error("Error in getUserOrders:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },
];

// Función para limpiar carrito después de una compra exitosa
exports.clearUserCart = [
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const sql = `DELETE FROM Carrito WHERE idCliente = ?`;

      conection.query(sql, [userId], (error) => {
        if (error) {
          console.error("Error clearing cart:", error);
          return res.status(500).json({
            success: false,
            message: "Error al limpiar el carrito",
          });
        }

        res.json({
          success: true,
          message: "Carrito limpiado exitosamente",
        });
      });
    } catch (error) {
      console.error("Error in clearUserCart:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },
];
