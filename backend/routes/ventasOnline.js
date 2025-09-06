const express = require("express");
const {
  mostrarCompras,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta,
} = require("../controllers/ventasOnline");

const router = express.Router();

router.get("/ventaOnline/misCompras/:idCliente", mostrarCompras);
router.get("/ventasOnline/todas", mostrarTodasLasVentas);
router.post("/ventaOnline/crear", registrarVentaOnline);
router.put("/ventaOnline/estado", actualizarEstadoVenta);

module.exports = router;
