const express = require("express");
const router = express.Router();
const mercadoPagoController = require("../controllers/mercadopago");
const auth = require("../middlewares/auth")
const {verificarRol} = require("../middlewares/verificarPermisos")

// Ruta POST para crear la orden
router.post("/create-order",auth,verificarRol(["cliente"]), mercadoPagoController.createOrder);

// Ruta POST para recibir las notificaciones (IPN)
router.post("/notifications",auth,verificarRol(["cliente"]), mercadoPagoController.receiveWebhook);

module.exports = router;