const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const crypto = require("crypto");
const mercadoPagoRepository = require("../repositories/MercadoPagoRepository");
const clientesRepository = require("../repositories/ClientesRepository");
const cuponesRepository = require("../repositories/CuponesRepository");
const { enviarConfirmacionCompra } = require("../helps/EnvioMail");
const { createValidationError, createNotFoundError } = require("../errors");
const { withTransaction } = require("../utils/transaction");

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

/**
 * Detecta si es un pago de prueba
 * @param {string} paymentId - ID del pago
 * @returns {boolean}
 */
const isTestPayment = (paymentId) => {
  const testIds = ["123456", "1325317138", "12345678"];
  return testIds.includes(paymentId.toString());
};

/**
 * Crea una orden de pago en MercadoPago
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<Object>}
 */
const createOrder = async ({
  products,
  customer_info,
  discount = 0,
  userId,
  cuponAplicado = null,
}) => {
  // Validaciones
  if (!products || products.length === 0) {
    throw createValidationError(
      "No se proporcionaron productos para la compra",
    );
  }

  if (!customer_info || !customer_info.email) {
    throw createValidationError("Información del cliente incompleta");
  }

  // Limpiar y validar URLs
  const frontendUrl = process.env.FRONTEND_URL?.trim();
  const backendUrl = process.env.BACKEND_URL?.trim();

  if (!frontendUrl?.startsWith("http")) {
    throw new Error("Error de configuración del servidor (FRONTEND_URL)");
  }

  const productIds = products.map((p) => p.id);
  const productQuantities = products.reduce(
    (acc, p) => ({ ...acc, [p.id]: p.quantity }),
    {},
  );

  // Obtener productos de la BD con precios y ofertas
  const dbProducts = await mercadoPagoRepository.getProductsByIds(productIds);

  if (dbProducts.length !== products.length) {
    throw createValidationError("Algunos productos no fueron encontrados");
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
    throw createValidationError("Stock insuficiente para algunos productos", {
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
      idProducto: product.idProducto,
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

  // Crear preferencia en MercadoPago
  const preference = new Preference(client);
  const isProduction = true;

  const preferenceBody = {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      unit_price: item.unit_price,
      quantity: item.quantity,
      picture_url: item.picture_url,
      category_id: item.category_id,
      currency_id: item.currency_id,
    })),
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

  if (isProduction) {
    preferenceBody.auto_return = "approved";
  }

  console.log("DEBUG - Configuración:");
  console.log("FRONTEND_URL:", frontendUrl);
  console.log("BACKEND_URL:", backendUrl);
  console.log("Es producción:", isProduction);
  console.log("Auto return:", preferenceBody.auto_return || "disabled");

  const response = await preference.create({ body: preferenceBody });

  console.log("=== RESPUESTA DE MERCADO PAGO ===");
  console.log("Preference ID:", response.id);
  console.log("Init Point:", response.init_point);
  console.log("Sandbox Init Point:", response.sandbox_init_point);

  // Crear venta en la BD en estado pendiente
  const idVentaO = await mercadoPagoRepository.createVentaOnline({
    idCliente: userId,
    totalPago: total,
    estado: "pendiente",
    externalReference: externalReference,
    idCuponAplicado: cuponAplicado?.idCupon || null,
  });

  // Crear detalles de la venta
  await mercadoPagoRepository.createDetalleVentaOnline(idVentaO, items);

  return {
    success: true,
    id: response.id,
    idVentaO: idVentaO,
    init_point: response.init_point,
    sandbox_init_point: response.sandbox_init_point,
    total: total,
    environment: "sandbox",
  };
};

/**
 * Verifica la firma del webhook de MercadoPago
 * @param {string} signature - Firma del header
 * @param {Object} body - Body del webhook
 * @returns {boolean}
 */
const verifyWebhookSignature = (signature, body) => {
  if (!signature || !process.env.MP_WEBHOOK_SECRET) {
    return true; // Si no hay configuración, permitir
  }

  const [tsPart, v1Part] = signature.split(",").map((s) => s.trim());
  const ts = tsPart?.split("=")[1];
  const v1 = v1Part?.split("=")[1];
  const bodyString = JSON.stringify(body);
  const secret = process.env.MP_WEBHOOK_SECRET;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(ts + bodyString)
    .digest("hex");

  return hash === v1;
};

/**
 * Procesa notificaciones de webhook de MercadoPago
 * @param {Object} webhookData - Datos del webhook
 * @returns {Promise<void>}
 */
const processWebhook = async (webhookData) => {
  const { type, data, action, topic, resource } = webhookData;
  const notificationType = type || topic;

  console.log("\n=== WEBHOOK RECIBIDO ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Type:", notificationType);
  console.log("Action:", action);
  console.log("Resource:", resource);

  // Detectar y manejar diferentes tipos de notificación
  if (notificationType === "payment") {
    if (resource) {
      console.log("🔍 Procesando recurso de pago:", resource);
      await handlePaymentResource(resource);
    } else if (data?.id) {
      const paymentId = data.id;
      console.log(`💳 Payment ID real: ${paymentId}`);

      // Ignorar payment.created - solo procesar cuando el pago se actualiza
      if (action === "payment.created") {
        console.log(
          "ℹ️ Webhook de payment.created IGNORADO - Esperando payment.updated",
        );
        return;
      }

      // Procesar solo payment.updated y payment.authorized
      if (["payment.updated", "payment.authorized"].includes(action)) {
        await handlePaymentNotification(paymentId, webhookData);
      } else {
        console.log(
          `ℹ️ Acción de pago no manejada: ${action}. Consultando estado actual...`,
        );
        try {
          const payment = new Payment(client);
          const paymentDetails = await payment.get({ id: paymentId });
          await updatePaymentInDatabase(paymentDetails);
        } catch (error) {
          console.error("❌ Error consultando pago:", error.message);
        }
      }
    }
  } else if (notificationType === "merchant_order") {
    if (resource) {
      await handleMerchantOrderResource(resource);
    }
  }

  console.log("=== FIN WEBHOOK ===\n");
};

/**
 * Consulta el recurso de pago por URL
 * @param {string} resourceUrl - URL del recurso
 * @returns {Promise<void>}
 */
const handlePaymentResource = async (resourceUrl) => {
  try {
    const match = resourceUrl.match(/\/payments\/(\d+)/);
    const paymentId = match ? match[1] : null;

    if (!paymentId) {
      console.error(
        "❌ No se pudo extraer paymentId del resource:",
        resourceUrl,
      );
      return;
    }

    console.log(`🔗 Consultando pago por resource: ${resourceUrl}`);
    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id: paymentId });
    await updatePaymentInDatabase(paymentDetails);
  } catch (error) {
    console.error("❌ Error consultando pago por resource:", error.message);
  }
};

/**
 * Maneja notificaciones de pago con lógica de reintento
 * @param {string} paymentId - ID del pago
 * @param {Object} webhookBody - Body del webhook
 * @returns {Promise<void>}
 */
const handlePaymentNotification = async (
  paymentId,
  webhookBody,
  maxRetries = 5,
  delayMs = 3000,
) => {
  if (!paymentId) {
    console.log("❌ No hay paymentId en la notificación");
    return;
  }

  console.log(`📋 Procesando pago ID: ${paymentId}`);

  // Detectar pagos de prueba
  if (isTestPayment(paymentId)) {
    console.log(
      "✅ NOTIFICACIÓN DE PRUEBA - Webhook funcionando correctamente",
    );
    return;
  }

  // Si es payment.created, esperar más tiempo
  if (webhookBody.action === "payment.created") {
    console.log(
      "⏳ Webhook de payment.created - Esperando 5s antes de consultar...",
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // Reintentar si el pago no se encuentra
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const payment = new Payment(client);
      console.log(
        `🔍 Consultando API de MercadoPago... (Intento ${attempt}/${maxRetries})`,
      );

      const paymentDetails = await payment.get({ id: paymentId });

      console.log("✅ DETALLES DEL PAGO OBTENIDOS:");
      console.log("  - payment_id:", paymentDetails.id);
      console.log("  - status:", paymentDetails.status);
      console.log("  - external_reference:", paymentDetails.external_reference);

      await updatePaymentInDatabase(paymentDetails);
      return;
    } catch (paymentError) {
      if (
        paymentError.message === "Payment not found" &&
        attempt < maxRetries
      ) {
        console.log(
          `ℹ️ Pago no encontrado en el intento ${attempt}. Reintentando en ${
            delayMs / 1000
          }s...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      } else {
        console.error(
          "❌ Error obteniendo detalles del pago:",
          paymentError.message,
        );
        return;
      }
    }
  }
};

/**
 * Actualiza el pago en la base de datos
 * @param {Object} paymentDetails - Detalles del pago
 * @returns {Promise<void>}
 */
const updatePaymentInDatabase = async (paymentDetails) => {
  const { id: payment_id, status, external_reference } = paymentDetails;

  console.log(`🎯 Actualizando base de datos con:`);
  console.log("  - payment_id:", payment_id);
  console.log("  - status:", status);
  console.log("  - external_reference:", external_reference);

  if (!external_reference) {
    console.error(
      "❌ No se puede actualizar: external_reference no encontrado",
    );
    return;
  }

  // Pago aprobado o autorizado
  if (["approved", "authorized"].includes(status)) {
    console.log(`✅ PAGO APROBADO - Actualizando venta: ${external_reference}`);

    const venta =
      await mercadoPagoRepository.findVentaByExternalReference(
        external_reference,
      );

    if (!venta) {
      console.log(
        `❌ No se encontró venta con external_reference: ${external_reference}`,
      );
      return;
    }

    if (venta.estado !== "pendiente") {
      console.log(
        `⚠️ Venta ${venta.idVentaO} ya fue procesada (estado: ${venta.estado})`,
      );
      return;
    }

    // ========================================
    // BLOQUE TRANSACCIONAL (ACID)
    // ========================================
    // Todas estas operaciones se ejecutan de forma atómica:
    // - Si alguna falla, TODAS se revierten (ROLLBACK)
    // - Si todas tienen éxito, se confirman (COMMIT)
    try {
      await withTransaction(async (connection) => {
        // 1. Actualizar venta a "retirado" (aprobado)
        await mercadoPagoRepository.updateVentaEstadoTx(
          connection,
          venta.idVentaO,
          "retirado",
        );
        console.log(`✅ Venta ${venta.idVentaO} actualizada a 'retirado'`);

        // 2. Obtener detalles de la venta
        const detallesVenta = await mercadoPagoRepository.getDetallesVentaTx(
          connection,
          venta.idVentaO,
        );

        if (detallesVenta.length === 0) {
          throw new Error(
            `No se encontraron detalles para la venta ${venta.idVentaO}`,
          );
        }

        // 3. Actualizar stock (con validación y bloqueo)
        const itemsToUpdate = detallesVenta.map((d) => ({
          idProducto: d.idProducto,
          quantity: d.cantidad,
        }));

        await mercadoPagoRepository.updateProductStockTx(
          connection,
          itemsToUpdate,
        );
        console.log(
          `✅ Stock actualizado para ${detallesVenta.length} productos`,
        );

        // 4. Limpiar carrito del cliente
        await mercadoPagoRepository.clearUserCartTx(
          connection,
          venta.idCliente,
        );
        console.log(
          `🗑️ Carrito del cliente ${venta.idCliente} limpiado exitosamente`,
        );

        // 5. Registrar uso de cupón si fue aplicado
        if (venta.idCuponAplicado) {
          const montoOriginal = venta.totalPago;
          await cuponesRepository.aplicarCuponTx(connection, {
            idCupon: venta.idCuponAplicado,
            idCliente: venta.idCliente,
            idVentaO: venta.idVentaO,
            montoDescuento: 0,
            montoOriginal: montoOriginal,
            montoFinal: venta.totalPago,
          });
        }

        // Si llegamos aquí, todas las operaciones fueron exitosas
        // withTransaction hará COMMIT automáticamente
      });

      console.log(
        `🎉 Transacción completada exitosamente para venta ${venta.idVentaO}`,
      );
    } catch (transactionError) {
      console.error(
        `❌ Error en transacción para venta ${venta.idVentaO}:`,
        transactionError.message,
      );
      // La transacción ya hizo ROLLBACK automáticamente
      // Puedes agregar lógica adicional aquí (notificaciones, logs, etc.)
      throw transactionError; // Propagar el error
    }

    // Enviar email de confirmación
    try {
      const cliente = await clientesRepository.findById(venta.idCliente);
      const detallesVenta = await mercadoPagoRepository.getDetallesVenta(
        venta.idVentaO,
      );

      if (cliente && cliente.emailCliente && detallesVenta.length > 0) {
        await enviarConfirmacionCompra(
          cliente.emailCliente,
          cliente.nombreCliente,
          venta.idVentaO,
          venta.totalPago,
          detallesVenta,
        );
        console.log(
          `📧 Email de confirmación enviado a ${cliente.emailCliente}`,
        );
      }
    } catch (emailError) {
      console.error(
        `⚠️ Error enviando email de confirmación:`,
        emailError.message,
      );
      // No lanzamos el error para que no afecte el flujo principal
    }
  }
  // Pago rechazado o cancelado
  else if (
    ["rejected", "cancelled", "refunded", "charged_back"].includes(status)
  ) {
    console.log(
      `❌ PAGO RECHAZADO - Marcando como cancelado: ${external_reference}`,
    );
    await mercadoPagoRepository.updateVentaEstadoCancelado(external_reference);
    console.log(
      `✅ Venta con referencia ${external_reference} marcada como 'cancelado'`,
    );
  }
  // Otros estados
  else {
    console.log(
      `ℹ️ Pago en estado: ${status} - Estableciendo como 'pendiente'`,
    );
    await mercadoPagoRepository.updateVentaEstadoPendiente(
      external_reference,
      status,
    );
  }
};

/**
 * Actualiza el stock para una orden
 * @param {number} idVentaO - ID de la venta
 * @returns {Promise<void>}
 */
const updateStockForOrder = async (idVentaO) => {
  const detalles = await mercadoPagoRepository.getDetallesVenta(idVentaO);

  console.log(`📦 Actualizando stock para ${detalles.length} productos`);

  const itemsToUpdate = detalles.map((d) => ({
    idProducto: d.idProducto,
    quantity: d.cantidad,
  }));

  try {
    await mercadoPagoRepository.updateProductStock(itemsToUpdate);
    console.log(`✅ Stock actualizado exitosamente para venta ${idVentaO}`);
  } catch (error) {
    console.error("❌ Error actualizando stock:", error);
  }
};

/**
 * Maneja recursos de merchant order
 * @param {string} resourceUrl - URL del recurso
 * @returns {Promise<void>}
 */
const handleMerchantOrderResource = async (resourceUrl) => {
  try {
    const orderIdMatch = resourceUrl.match(/merchant_orders\/(\d+)/);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    if (!orderId) {
      console.error(
        "❌ No se pudo extraer merchant_order_id del resource:",
        resourceUrl,
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
        await response.text(),
      );
      return;
    }

    const orderDetails = await response.json();
    console.log("✅ Detalles de merchant_order:", orderDetails);

    const approvedPayment = orderDetails.payments?.find(
      (p) => p.status === "approved",
    );

    if (approvedPayment) {
      await updatePaymentInDatabase({
        id: approvedPayment.id,
        status: approvedPayment.status,
        external_reference: orderDetails.external_reference,
      });
    }
  } catch (error) {
    console.error(
      "❌ Error consultando merchant_order por resource:",
      error.message,
    );
  }
};

/**
 * Obtiene el historial de órdenes del usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>}
 */
const getUserOrders = async (userId) => {
  const results = await mercadoPagoRepository.getUserOrders(userId);

  // Agrupar por venta
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

  return Array.from(ventasMap.values());
};

/**
 * Limpia el carrito del usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<void>}
 */
const clearUserCart = async (userId) => {
  await mercadoPagoRepository.clearUserCart(userId);
};

module.exports = {
  createOrder,
  verifyWebhookSignature,
  processWebhook,
  getUserOrders,
  clearUserCart,
};
