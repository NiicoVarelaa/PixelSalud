const express = require("express");
const router = express.Router();

const {
  reporteVentasOnline,
  reporteVentasEmpleados,
  reporteConsolidado,
  reporteProductosVendidos,
} = require("../controllers/ReportesController");

const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");

const {
  reporteVentasOnlineSchema,
  reporteVentasEmpleadosSchema,
  reporteConsolidadoSchema,
  reporteProductosVendidosSchema,
} = require("../schemas/ReporteSchemas");

router.get(
  "/reportes/ventas-online",
  auth,
  verificarRol(["admin"]),
  validate(reporteVentasOnlineSchema),
  reporteVentasOnline,
);

router.get(
  "/reportes/ventas-empleados",
  auth,
  verificarRol(["admin"]),
  validate(reporteVentasEmpleadosSchema),
  reporteVentasEmpleados,
);

router.get(
  "/reportes/consolidado",
  auth,
  verificarRol(["admin"]),
  validate(reporteConsolidadoSchema),
  reporteConsolidado,
);

router.get(
  "/reportes/productos-vendidos",
  auth,
  verificarRol(["admin"]),
  validate(reporteProductosVendidosSchema),
  reporteProductosVendidos,
);

module.exports = router;
