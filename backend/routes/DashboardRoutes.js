const express = require("express");
const router = express.Router();

const {
  obtenerMetricas,
  obtenerProductosMasVendidos,
  obtenerGraficoVentas,
} = require("../controllers/DashboardController");

const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");

const {
  productosMasVendidosSchema,
  graficoVentasSchema,
} = require("../schemas/DashboardSchemas");

router.get(
  "/dashboard/metricas",
  auth,
  verificarRol(["admin"]),
  obtenerMetricas,
);

router.get(
  "/dashboard/productos-mas-vendidos",
  auth,
  verificarRol(["admin"]),
  validate(productosMasVendidosSchema),
  obtenerProductosMasVendidos,
);

router.get(
  "/dashboard/grafico-ventas",
  auth,
  verificarRol(["admin"]),
  validate(graficoVentasSchema),
  obtenerGraficoVentas,
);

module.exports = router;
