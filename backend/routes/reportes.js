const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { verificarRol } = require("../middlewares/verificarPermisos");
const {
  reporteVentasOnline,
  reporteVentasEmpleados,
  reporteConsolidado,
  reporteProductosVendidos,
} = require("../controllers/reportes");

// Todas las rutas requieren autenticación y rol de administrador
router.get(
  "/reportes/ventas-online",
  auth,
  verificarRol(["admin"]),
  reporteVentasOnline,
);

router.get(
  "/reportes/ventas-empleados",
  auth,
  verificarRol(["admin"]),
  reporteVentasEmpleados,
);

router.get(
  "/reportes/consolidado",
  auth,
  verificarRol(["admin"]),
  reporteConsolidado,
);

router.get(
  "/reportes/productos-vendidos",
  auth,
  verificarRol(["admin"]),
  reporteProductosVendidos,
);

module.exports = router;
