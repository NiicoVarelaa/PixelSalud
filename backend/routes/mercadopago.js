const express = require("express");
const router = express.Router();
const mercadoPagoController = require("../controllers/mercadopago");

// Ruta POST para crear la orden
router.post("/create-order", mercadoPagoController.createOrder);

// Ruta POST para recibir las notificaciones (IPN)
router.post("/notifications", mercadoPagoController.receiveWebhook);

module.exports = router;