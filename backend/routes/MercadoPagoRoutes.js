const express = require("express");
const router = express.Router();
const mercadoPagoController = require("../controllers/MercadoPagoController");
const Auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");
const { createOrderSchema } = require("../schemas/MercadoPagoSchemas");
const { paymentLimiter, mutationLimiter } = require("../config/rateLimiters");

router.post(
  "/create-order",
  paymentLimiter,
  Auth,
  verificarRol(["cliente"]),
  validate({ body: createOrderSchema }),
  mercadoPagoController.createOrder,
);

router.post("/notifications", mercadoPagoController.receiveWebhook);

router.get(
  "/orders",
  Auth,
  verificarRol(["cliente"]),
  mercadoPagoController.getUserOrders,
);

router.delete(
  "/clearUserCart",
  mutationLimiter,
  Auth,
  verificarRol(["cliente"]),
  mercadoPagoController.clearUserCart,
);

module.exports = router;
