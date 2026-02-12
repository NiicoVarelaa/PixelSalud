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
const {
  idVentaOParamSchema,
  createVentaOnlineSchema,
  updateEstadoVentaSchema,
  updateVentaOnlineSchema,
} = require("../schemas/VentaOnlineSchemas");

/**
 * @route GET /mis-compras
 * @desc Obtiene las compras/ventas online del cliente logueado
 * @access Cliente
 */
router.get("/mis-compras", auth, verificarRol(["cliente"]), getUserOrders);

/**
 * @route GET /ventasOnline/todas
 * @desc Obtiene todas las ventas online del sistema
 * @access Admin, Empleado
 */
router.get(
  "/ventasOnline/todas",
  auth,
  verificarRol(["admin", "empleado"]),
  mostrarTodasLasVentas,
);

/**
 * @route GET /ventasOnline/detalle/:idVentaO
 * @desc Obtiene los detalles de una venta online específica
 * @access Admin, Empleado
 */
router.get(
  "/ventasOnline/detalle/:idVentaO",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idVentaOParamSchema, "params"),
  obtenerDetalleVentaOnline,
);

/**
 * @route POST /ventaOnline/crear
 * @desc Registra una nueva venta online
 * @access Admin, Empleado, Cliente
 */
router.post(
  "/ventaOnline/crear",
  auth,
  verificarRol(["admin", "empleado", "cliente"]),
  validate(createVentaOnlineSchema, "body"),
  registrarVentaOnline,
);

/**
 * @route PUT /ventaOnline/estado
 * @desc Actualiza el estado de una venta online
 * @access Admin, Empleado
 */
router.put(
  "/ventaOnline/estado",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(updateEstadoVentaSchema, "body"),
  actualizarEstadoVenta,
);

/**
 * @route PUT /ventaOnline/actualizar/:idVentaO
 * @desc Actualiza una venta online completa (productos y método de pago)
 * @access Admin, Empleado
 */
router.put(
  "/ventaOnline/actualizar/:idVentaO",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idVentaOParamSchema, "params"),
  validate(updateVentaOnlineSchema, "body"),
  actualizarVentaOnline,
);

module.exports = router;
