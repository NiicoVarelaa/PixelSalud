const express = require("express");
const router = express.Router();

// Controllers
const {
  reporteVentasOnline,
  reporteVentasEmpleados,
  reporteConsolidado,
  reporteProductosVendidos,
} = require("../controllers/ReportesController");

// Middlewares
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");

// Schemas
const {
  reporteVentasOnlineSchema,
  reporteVentasEmpleadosSchema,
  reporteConsolidadoSchema,
  reporteProductosVendidosSchema,
} = require("../schemas/ReporteSchemas");

// ====================================
// RUTAS PARA REPORTES
// Todas las rutas requieren autenticación y rol de administrador
// ====================================

/**
 * GET /reportes/ventas-online
 * Genera reporte de ventas online en Excel
 * Requiere: auth + admin
 * Query params: fechaDesde, fechaHasta, estado, metodoPago
 */
router.get(
  "/reportes/ventas-online",
  auth,
  verificarRol(["admin"]),
  validate(reporteVentasOnlineSchema),
  reporteVentasOnline,
);

/**
 * GET /reportes/ventas-empleados
 * Genera reporte de ventas de empleados en Excel
 * Requiere: auth + admin
 * Query params: fechaDesde, fechaHasta, estado, metodoPago, idEmpleado
 */
router.get(
  "/reportes/ventas-empleados",
  auth,
  verificarRol(["admin"]),
  validate(reporteVentasEmpleadosSchema),
  reporteVentasEmpleados,
);

/**
 * GET /reportes/consolidado
 * Genera reporte consolidado de todas las ventas en Excel
 * Requiere: auth + admin
 * Query params: fechaDesde, fechaHasta
 */
router.get(
  "/reportes/consolidado",
  auth,
  verificarRol(["admin"]),
  validate(reporteConsolidadoSchema),
  reporteConsolidado,
);

/**
 * GET /reportes/productos-vendidos
 * Genera reporte de productos vendidos en Excel
 * Requiere: auth + admin
 * Query params: fechaDesde, fechaHasta, categoria
 */
router.get(
  "/reportes/productos-vendidos",
  auth,
  verificarRol(["admin"]),
  validate(reporteProductosVendidosSchema),
  reporteProductosVendidos,
);

module.exports = router;
