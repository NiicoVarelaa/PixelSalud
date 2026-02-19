const mercadoPagoService = require("../services/MercadoPagoService");
const cuponesService = require("../services/CuponesService");

/**
 * Crea una nueva orden de compra en MercadoPago
 */
const createOrder = async (req, res, next) => {
  try {
    const { products, customer_info, discount, codigoCupon } = req.body;
    const userId = req.user.id;

    console.log("\n=== NUEVA ORDEN DE COMPRA ===");
    console.log("Usuario ID:", userId);
    console.log("Productos:", products?.length || 0);
    console.log("Cliente:", customer_info?.email);
    console.log("Cupón:", codigoCupon || "Sin cupón");

    let descuentoFinal = discount || 0;
    let cuponAplicado = null;

    if (codigoCupon) {
      const subtotal = products.reduce(
        (sum, p) => sum + p.unit_price * p.quantity,
        0,
      );

      const validacion = await cuponesService.validarYCalcularDescuento(
        codigoCupon.toUpperCase(),
        userId,
        subtotal,
      );

      if (!validacion.valido) {
        return res.status(400).json({
          success: false,
          message: validacion.mensaje,
        });
      }

      descuentoFinal = validacion.descuento;
      cuponAplicado = validacion.cupon;

      console.log(`✅ Cupón ${codigoCupon} aplicado: -$${descuentoFinal}`);
    }

    const result = await mercadoPagoService.createOrder({
      products,
      customer_info,
      discount: descuentoFinal,
      userId,
      cuponAplicado, // Pasar info del cupón para guardarlo después
    });

    console.log("✅ Orden creada exitosamente");
    console.log("Preference ID:", result.id);
    console.log("Venta ID:", result.idVentaO);

    res.json({
      ...result,
      cuponAplicado: cuponAplicado
        ? {
            codigo: cuponAplicado.codigo,
            descuento: descuentoFinal,
          }
        : null,
    });
  } catch (error) {
    console.error("❌ Error creando orden:", error.message);
    next(error);
  }
};

/**
 * Recibe notificaciones de webhook de MercadoPago
 */
const receiveWebhook = async (req, res, next) => {
  try {
    console.log("\n==================================================");
    console.log("🔔 WEBHOOK RECIBIDO:", new Date().toISOString());
    console.log("==================================================");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));
    console.log("==================================================\n");

    // Verificar firma del webhook
    const signature = req.headers["x-signature"];
    const isValid = mercadoPagoService.verifyWebhookSignature(
      signature,
      req.body,
    );

    if (!isValid) {
      console.error("❌ Firma de webhook inválida");
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Responder inmediatamente a MercadoPago
    res.status(200).send("OK");

    // Procesar webhook de forma asíncrona
    setImmediate(async () => {
      try {
        await mercadoPagoService.processWebhook(req.body);
      } catch (webhookError) {
        console.error("❌ Error procesando webhook:", webhookError.message);
      }
    });
  } catch (error) {
    console.error("❌ Error en webhook handler:", error.message);
    // Aún así responder OK para evitar reintentos innecesarios
    if (!res.headersSent) {
      res.status(200).send("OK");
    }
  }
};

/**
 * Obtiene las órdenes de compra del usuario
 */
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    console.log(`📦 Obteniendo órdenes del usuario ${userId}`);

    const orders = await mercadoPagoService.getUserOrders(userId);

    console.log(`✅ ${orders.length} órdenes encontradas`);

    res.json({ ventas: orders });
  } catch (error) {
    console.error("❌ Error obteniendo órdenes:", error.message);
    next(error);
  }
};

/**
 * Limpia el carrito del usuario
 */
const clearUserCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    console.log(`🧹 Limpiando carrito del usuario ${userId}`);

    await mercadoPagoService.clearUserCart(userId);

    console.log("✅ Carrito limpiado exitosamente");

    res.json({
      success: true,
      message: "Carrito limpiado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error limpiando carrito:", error.message);
    next(error);
  }
};

module.exports = {
  createOrder,
  receiveWebhook,
  getUserOrders,
  clearUserCart,
};
