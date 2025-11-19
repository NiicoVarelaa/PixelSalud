const express = require("express");
const router = express.Router();
const mercadoPagoController = require("../controllers/mercadopago");
const auth = require("../middlewares/auth")
const {verificarRol} = require("../middlewares/verificarPermisos")

// Ruta POST para crear la orden
router.post("/create-order",auth,verificarRol(["cliente"]), mercadoPagoController.createOrder);

// Ruta POST para recibir las notificaciones (IPN)
router.post("/notifications", mercadoPagoController.receiveWebhook);

// ✅ NUEVA: Ruta para limpiar el carrito después del pago
router.delete("/clearUserCart",auth, verificarRol(["cliente"]), mercadoPagoController.clearUserCart);

// ✅ NUEVA: Ruta para obtener las órdenes del usuario
router.get("/orders", auth, verificarRol(["cliente"]), mercadoPagoController.getUserOrders);

module.exports = router;
