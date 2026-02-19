const express = require("express");
const router = express.Router();
const cuponesController = require("../controllers/CuponesController");
const Auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");

// ========================================
// RUTAS PÚBLICAS/CLIENTES (requieren auth)
// ========================================

/**
 * Validar cupón y calcular descuento
 * POST /cupones/validar
 * Body: { codigo: string, montoCompra: number }
 */
router.post("/cupones/validar", Auth, cuponesController.validarCupon);

/**
 * Obtener historial de cupones del cliente
 * GET /cupones/mis-cupones
 */
router.get("/cupones/mis-cupones", Auth, cuponesController.obtenerMisCupones);

// ========================================
// RUTAS ADMIN/EMPLEADO
// ========================================

/**
 * Obtener historial completo de uso de cupones (admin)
 * GET /cupones/historial
 */
router.get(
  "/cupones/historial",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerHistorial,
);

/**
 * Obtener todos los cupones (admin)
 * GET /cupones
 */
router.get(
  "/cupones",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerTodosCupones,
);

/**
 * Obtener cupones activos (admin)
 * GET /cupones/activos
 */
router.get(
  "/cupones/activos",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerCuponesActivos,
);

/**
 * Crear cupón personalizado (admin)
 * POST /cupones
 * Body: {
 *   codigo?: string,
 *   tipoCupon: 'porcentaje' | 'monto_fijo',
 *   valorDescuento: number,
 *   descripcion: string,
 *   fechaInicio: string (YYYY-MM-DD),
 *   fechaVencimiento: string (YYYY-MM-DD),
 *   usoMaximo?: number,
 *   tipoUsuario?: 'nuevo' | 'todos' | 'vip',
 *   montoMinimo?: number
 * }
 */
router.post(
  "/cupones",
  Auth,
  verificarRol(["admin"]),
  cuponesController.crearCupon,
);

/**
 * Obtener cupón por código (admin)
 * GET /cupones/:codigo
 */
router.get(
  "/cupones/:codigo",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerCuponPorCodigo,
);

/**
 * Actualizar estado de cupón (admin)
 * PATCH /cupones/:id/estado
 * Body: { estado: 'activo' | 'inactivo' }
 */
router.patch(
  "/cupones/:id/estado",
  Auth,
  verificarRol(["admin"]),
  cuponesController.actualizarEstado,
);

/**
 * Eliminar cupón (admin - solo si no fue usado)
 * DELETE /cupones/:id
 */
router.delete(
  "/cupones/:id",
  Auth,
  verificarRol(["admin"]),
  cuponesController.eliminarCupon,
);

module.exports = router;
