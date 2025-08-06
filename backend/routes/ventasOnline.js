const express = require("express");
const {
  createVenta,
  mostrarCompras,
  mostrarTodasLasVentas,
} = require("../controllers/ventasOnline");

const router = express.Router();

router.post("/ventaOnline/crear", createVenta);
router.get("/ventaOnline/misCompras/:idCliente", mostrarCompras);
router.get("/ventasOnline/todas", mostrarTodasLasVentas);

module.exports = router;
