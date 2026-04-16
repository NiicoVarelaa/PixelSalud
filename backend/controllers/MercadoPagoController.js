const mercadoPagoService = require("../services/MercadoPagoService");
const cuponesService = require("../services/CuponesService");
const mercadoPagoRepository = require("../repositories/MercadoPagoRepository");
const { Auditoria } = require("../helps");

const createOrder = async (req, res, next) => {
  try {
    const { products, customer_info, checkout_data, codigoCupon } = req.body;
    const userId = req.user.id;

    let descuentoFinal = 0;
    let cuponAplicado = null;

    if (codigoCupon) {
      const productIds = products.map((p) => Number(p.id));
      const dbProducts =
        await mercadoPagoRepository.getProductsByIds(productIds);
      const dbProductsById = new Map(
        dbProducts.map((p) => [Number(p.idProducto), p]),
      );

      const subtotal = products.reduce((sum, p) => {
        const quantity = Number(p.quantity) || 0;
        const dbProduct = dbProductsById.get(Number(p.id));
        const unitPrice = Number(
          dbProduct?.precioFinal || dbProduct?.precio || 0,
        );

        if (dbProduct?.promo2x1Activa) {
          const precioBase = Number(dbProduct?.precio || 0);
          return sum + precioBase * Math.ceil(quantity / 2);
        }

        return sum + unitPrice * quantity;
      }, 0);

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
    }

    const result = await mercadoPagoService.createOrder({
      products,
      customer_info,
      checkout_data,
      discount: descuentoFinal,
      userId,
      cuponAplicado,
    });

    await Auditoria.registrarAuditoria(
      {
        evento: "ORDEN_MERCADOPAGO_CREADA",
        modulo: Auditoria.MODULOS.MERCADOPAGO,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Orden de MercadoPago creada - Preference ID: ${result.id}`,
        tipoUsuario: "cliente",
        idUsuario: userId,
        entidadAfectada: "VentasOnlines",
        idEntidad: result.idVentaO,
        datosAnteriores: null,
        datosNuevos: {
          preferenceId: result.id,
          total: result.total,
          productos: products.length,
          cupon: codigoCupon || null,
        },
      },
      req,
    );

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
        const webhookResult = await mercadoPagoService.processWebhook(req.body);

        if (webhookResult && webhookResult.success && webhookResult.payment) {
          await Auditoria.registrarPagoRecibido(webhookResult.payment, req);
        }
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
