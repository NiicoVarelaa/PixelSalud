const express = require("express");
const router = express.Router();
const mercadoPagoController = require("../controllers/MercadoPagoController");
const Auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");
const { createOrderSchema } = require("../schemas/MercadoPagoSchemas");

/**
 * @route   POST /mercadopago/create-order
 * @desc    Crea una nueva orden de compra en MercadoPago
 * @access  Privado (cliente)
 * @body    {products: Array, customer_info: Object, discount: Number}
 */
router.post(
  "/create-order",
  Auth,
  verificarRol(["cliente"]),
  validate({ body: createOrderSchema }),
  mercadoPagoController.createOrder,
);

/**
 * @route   POST /mercadopago/notifications
 * @desc    Recibe notificaciones de webhook de MercadoPago
 * @access  Público (webhook de MercadoPago)
 * @body    Datos del webhook de MercadoPago
 * @note    Este endpoint debe ser accesible sin autenticación
 */
router.post("/notifications", mercadoPagoController.receiveWebhook);

/**
 * @route   GET /mercadopago/orders
 * @desc    Obtiene el historial de órdenes del usuario autenticado
 * @access  Privado (cliente)
 */
router.get(
  "/orders",
  Auth,
  verificarRol(["cliente"]),
  mercadoPagoController.getUserOrders,
);

/**
 * @route   DELETE /mercadopago/clearUserCart
 * @desc    Limpia el carrito del usuario después de una compra
 * @access  Privado (cliente)
 */
router.delete(
  "/clearUserCart",
  Auth,
  verificarRol(["cliente"]),
  mercadoPagoController.clearUserCart,
);

module.exports = router;
