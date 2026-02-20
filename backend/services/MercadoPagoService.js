const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const crypto = require("crypto");
const mercadoPagoRepository = require("../repositories/MercadoPagoRepository");
const clientesRepository = require("../repositories/ClientesRepository");
const cuponesRepository = require("../repositories/CuponesRepository");
const { enviarConfirmacionCompra } = require("../helps/EnvioMail");
const { createValidationError } = require("../errors");
const { withTransaction } = require("../utils/transaction");

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const isTestPayment = (paymentId) => {
  const testIds = ["123456", "1325317138", "12345678"];
  return testIds.includes(paymentId.toString());
};

const createOrder = async ({
  products,
  customer_info,
  discount = 0,
  userId,
  cuponAplicado = null,
}) => {
  if (!products || products.length === 0) {
    throw createValidationError(
      "No se proporcionaron productos para la compra",
    );
  }

  if (!customer_info || !customer_info.email) {
    throw createValidationError("Información del cliente incompleta");
  }

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

  const dbProducts = await mercadoPagoRepository.getProductsByIds(productIds);

  if (dbProducts.length !== products.length) {
    throw createValidationError("Algunos productos no fueron encontrados");
  }

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

  const response = await preference.create({ body: preferenceBody });

  const idVentaO = await mercadoPagoRepository.createVentaOnline({
    idCliente: userId,
    totalPago: total,
    estado: "pendiente",
    externalReference: externalReference,
    idCuponAplicado: cuponAplicado?.idCupon || null,
  });

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

const verifyWebhookSignature = (signature, body) => {
  if (!signature || !process.env.MP_WEBHOOK_SECRET) {
    return true;
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

const processWebhook = async (webhookData) => {
  const { type, data, action, topic, resource } = webhookData;
  const notificationType = type || topic;

  if (notificationType === "payment") {
    if (resource) {
      await handlePaymentResource(resource);
    } else if (data?.id) {
      const paymentId = data.id;
      if (action === "payment.created") {
        return;
      }

      if (["payment.updated", "payment.authorized"].includes(action)) {
        await handlePaymentNotification(paymentId, webhookData);
      } else {
        try {
          const payment = new Payment(client);
          const paymentDetails = await payment.get({ id: paymentId });
          await updatePaymentInDatabase(paymentDetails);
        } catch (error) {}
      }
    }
  } else if (notificationType === "merchant_order") {
    if (resource) {
      await handleMerchantOrderResource(resource);
    }
  }
};

const handlePaymentResource = async (resourceUrl) => {
  try {
    const match = resourceUrl.match(/\/payments\/(\d+)/);
    const paymentId = match ? match[1] : null;

    if (!paymentId) {
      return;
    }

    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id: paymentId });
    await updatePaymentInDatabase(paymentDetails);
  } catch (error) {}
};

const handlePaymentNotification = async (
  paymentId,
  webhookBody,
  maxRetries = 5,
  delayMs = 3000,
) => {
  if (!paymentId) {
    return;
  }

  if (isTestPayment(paymentId)) {
    return;
  }

  if (webhookBody.action === "payment.created") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });
      await updatePaymentInDatabase(paymentDetails);
      return;
    } catch (paymentError) {
      if (
        paymentError.message === "Payment not found" &&
        attempt < maxRetries
      ) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      } else {
        return;
      }
    }
  }
};

const updatePaymentInDatabase = async (paymentDetails) => {
  const { id: payment_id, status, external_reference } = paymentDetails;

  if (!external_reference) {
    return;
  }

  if (["approved", "authorized"].includes(status)) {
    const venta =
      await mercadoPagoRepository.findVentaByExternalReference(
        external_reference,
      );

    if (!venta) {
      return;
    }

    if (venta.estado !== "pendiente") {
      return;
    }

    try {
      await withTransaction(async (connection) => {
        await mercadoPagoRepository.updateVentaEstadoTx(
          connection,
          venta.idVentaO,
          "retirado",
        );

        const detallesVenta = await mercadoPagoRepository.getDetallesVentaTx(
          connection,
          venta.idVentaO,
        );

        if (detallesVenta.length === 0) {
          throw new Error(
            `No se encontraron detalles para la venta ${venta.idVentaO}`,
          );
        }

        const itemsToUpdate = detallesVenta.map((d) => ({
          idProducto: d.idProducto,
          quantity: d.cantidad,
        }));

        await mercadoPagoRepository.updateProductStockTx(
          connection,
          itemsToUpdate,
        );

        await mercadoPagoRepository.clearUserCartTx(
          connection,
          venta.idCliente,
        );

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
      });
    } catch (transactionError) {
      throw transactionError;
    }

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
      }
    } catch (emailError) {}
  } else if (
    ["rejected", "cancelled", "refunded", "charged_back"].includes(status)
  ) {
    await mercadoPagoRepository.updateVentaEstadoCancelado(external_reference);
  } else {
    await mercadoPagoRepository.updateVentaEstadoPendiente(
      external_reference,
      status,
    );
  }
};

const updateStockForOrder = async (idVentaO) => {
  const detalles = await mercadoPagoRepository.getDetallesVenta(idVentaO);

  const itemsToUpdate = detalles.map((d) => ({
    idProducto: d.idProducto,
    quantity: d.cantidad,
  }));

  try {
    await mercadoPagoRepository.updateProductStock(itemsToUpdate);
  } catch (error) {}
};

const handleMerchantOrderResource = async (resourceUrl) => {
  try {
    const orderIdMatch = resourceUrl.match(/merchant_orders\/(\d+)/);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    if (!orderId) {
      return;
    }

    const fetch = require("node-fetch");
    const url = `https://api.mercadolibre.com/merchant_orders/${orderId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      return;
    }

    const orderDetails = await response.json();

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
  } catch (error) {}
};

const getUserOrders = async (userId) => {
  const results = await mercadoPagoRepository.getUserOrders(userId);

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
