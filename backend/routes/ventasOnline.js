const express = require("express");
const {
  mostrarCompras,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta,
  getUserOrders
} = require("../controllers/ventasOnline");

const router = express.Router();
const auth = require("../middlewares/auth");
const {verificarRol, verificarPermisos}= require("../middlewares/verificarPermisos");

// ✅ CORREGIR: Cambiar la ruta para que coincida con el frontend
router.get("/mis-compras", auth, verificarRol(["cliente"]), getUserOrders);
router.get("/ventasOnline/todas", auth, verificarRol(["admin","empleado"]), verificarPermisos("ver_ventasTotalesO"), mostrarTodasLasVentas);
router.post("/ventaOnline/crear", auth, verificarRol(["cliente"]), registrarVentaOnline);
router.put("/ventaOnline/estado", actualizarEstadoVenta);

module.exports = router;