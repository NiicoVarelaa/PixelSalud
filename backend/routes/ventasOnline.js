const express = require("express");
const {
  getUserOrders,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta,
  obtenerDetalleVentaOnline,
  actualizarVentaOnline
} = require("../controllers/ventasOnline"); // Asegúrate de importar getUserOrders si lo usas

const router = express.Router();
const auth = require("../middlewares/auth");
const { verificarRol, verificarPermisos } = require("../middlewares/verificarPermisos");

// Rutas
router.get("/mis-compras", auth, verificarRol(["cliente"]), getUserOrders);

// ✅ ACTUALIZADO: Agregamos "admin" y "empleado" para que puedan ver el historial
router.get("/ventasOnline/todas", auth, verificarRol(["admin", "empleado"]), mostrarTodasLasVentas);

// ✅ ACTUALIZADO: Permitimos que admin y empleados registren ventas online manualmente
router.post("/ventaOnline/crear", auth, verificarRol(["admin", "empleado", "cliente"]), registrarVentaOnline);

router.put("/ventaOnline/estado", auth, verificarRol(["admin", "empleado"]), actualizarEstadoVenta);
router.get("/ventasOnline/detalle/:idVentaO", auth, verificarRol(["admin", "empleado"]), obtenerDetalleVentaOnline);
router.put("/ventaOnline/actualizar/:idVentaO", auth, verificarRol(["admin", "empleado"]), actualizarVentaOnline);

module.exports = router;