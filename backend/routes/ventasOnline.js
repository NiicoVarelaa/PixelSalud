const express = require("express");
const {
  mostrarCompras,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta,
} = require("../controllers/ventasOnline");

const router = express.Router();
const auth = require("../middlewares/auth")
const {verificarRol, verificarPermisos}= require("../middlewares/verificarPermisos")


router.get("/ventaOnline/misCompras/:idCliente",auth,verificarRol(["admin","cliente"]), mostrarCompras);
router.get("/ventasOnline/todas",auth,verificarRol(["admin","empleado"]),verificarPermisos("ver_ventasTotalesO"), mostrarTodasLasVentas);
router.post("/ventaOnline/crear",auth,verificarRol(["cliente"]), registrarVentaOnline);
router.put("/ventaOnline/estado", actualizarEstadoVenta);/* Sacar */

module.exports = router;
