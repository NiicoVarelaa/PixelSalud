const mercadoPagoService = require("../services/MercadoPagoService");
const cuponesService = require("../services/CuponesService");

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
      cuponAplicado,
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

const receiveWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["x-signature"];
    const isValid = mercadoPagoService.verifyWebhookSignature(
      signature,
      req.body,
    );

    if (!isValid) {
      console.error("❌ Firma de webhook inválida");
      return res.status(401).json({ error: "Invalid signature" });
    }

    res.status(200).send("OK");

    setImmediate(async () => {
      try {
        await mercadoPagoService.processWebhook(req.body);
      } catch (webhookError) {
        console.error("❌ Error procesando webhook:", webhookError.message);
      }
    });
  } catch (error) {
    console.error("❌ Error en webhook handler:", error.message);
    if (!res.headersSent) {
      res.status(200).send("OK");
    }
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await mercadoPagoService.getUserOrders(userId);
    res.json({ ventas: orders });
  } catch (error) {
    console.error("❌ Error obteniendo órdenes:", error.message);
    next(error);
  }
};

const clearUserCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await mercadoPagoService.clearUserCart(userId);
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
