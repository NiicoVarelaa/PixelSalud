const express = require("express");
const router = express.Router();
const {
  getUserOrders,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta,
  obtenerDetalleVentaOnline,
  actualizarVentaOnline,
} = require("../controllers/VentasOnlineController");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");
const { mutationLimiter } = require("../config/rateLimiters");
const {
  idVentaOParamSchema,
  createVentaOnlineSchema,
  updateEstadoVentaSchema,
  updateVentaOnlineSchema,
} = require("../schemas/VentaOnlineSchemas");

router.get("/mis-compras", auth, verificarRol(["cliente"]), getUserOrders);

router.get(
  "/ventasOnline/todas",
  auth,
  verificarRol(["admin", "empleado"]),
  mostrarTodasLasVentas,
);

router.get(
  "/ventasOnline/detalle/:idVentaO",
  auth,
  verificarRol(["admin", "empleado"]),
  validate({ params: idVentaOParamSchema }),
  obtenerDetalleVentaOnline,
);

router.post(
  "/ventaOnline/crear",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado", "cliente"]),
  validate({ body: createVentaOnlineSchema }),
  registrarVentaOnline,
);

router.put(
  "/ventaOnline/estado",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  validate({ body: updateEstadoVentaSchema }),
  actualizarEstadoVenta,
);

router.put(
  "/ventaOnline/actualizar/:idVentaO",
  auth,
  verificarRol(["admin", "empleado"]),
  validate({ params: idVentaOParamSchema }),
  validate({ body: updateVentaOnlineSchema }),
  actualizarVentaOnline,
);

module.exports = router;
