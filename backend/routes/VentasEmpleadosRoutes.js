const express = require("express");
const router = express.Router();

// Controllers
const {
  registrarVentaEmpleado,
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
  obtenerDetalleVentaEmpleado,
  obtenerVentasAnuladas,
  obtenerVentasCompletadas,
  updateVenta,
  anularVenta,
  reactivarVenta,
  obtenerVentaPorId,
  obtenerVentaParaEditar,
  obtenerVentasParaAdmin,
  obtenerVentaCompletaAdmin,
} = require("../controllers/VentasEmpleadosController");

// Middlewares
const auth = require("../middlewares/Auth");
const {
  verificarRol,
  verificarPermisos,
} = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");

// Schemas
const {
  idVentaEParamSchema,
  idEmpleadoParamSchema,
  createVentaEmpleadoSchema,
  updateVentaEmpleadoSchema,
} = require("../schemas/VentaEmpleadoSchemas");

// ====================================
// RUTAS PARA CONSULTAS
// ====================================

/**
 * GET /ventasEmpleados
 * Obtiene todas las ventas de empleados
 * Requiere: auth + (admin o empleado) + permiso ver_ventasTotalesE
 */
router.get(
  "/ventasEmpleados",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("ver_ventasTotalesE"),
  obtenerVentasEmpleado,
);

/**
 * GET /ventasEmpleados/completas
 * Obtiene las ventas completadas
 * Requiere: auth + (admin o empleado) + permiso ver_ventasTotalesE
 */
router.get(
  "/ventasEmpleados/completas",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("ver_ventasTotalesE"),
  obtenerVentasCompletadas,
);

/**
 * GET /ventasEmpleados/anuladas
 * Obtiene las ventas anuladas
 * Requiere: auth + (admin o empleado) + permiso ver_ventasTotalesE
 */
router.get(
  "/ventasEmpleados/anuladas",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("ver_ventasTotalesE"),
  obtenerVentasAnuladas,
);

/**
 * GET /ventasEmpleados/detalle/:idVentaE
 * Obtiene los detalles de una venta específica
 * Requiere: auth + (admin o empleado)
 */
router.get(
  "/ventasEmpleados/detalle/:idVentaE",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idVentaEParamSchema, "params"),
  obtenerDetalleVentaEmpleado,
);

/**
 * GET /ventasEmpleados/venta/:idVentaE
 * Obtiene una venta específica por ID
 * Requiere: auth + (admin o empleado)
 */
router.get(
  "/ventasEmpleados/venta/:idVentaE",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idVentaEParamSchema, "params"),
  obtenerVentaPorId,
);

/**
 * GET /ventasEmpleados/:idEmpleado
 * Obtiene las ventas de un empleado específico
 * Requiere: auth + (admin o empleado)
 */
router.get(
  "/ventasEmpleados/:idEmpleado",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idEmpleadoParamSchema, "params"),
  obtenerLaVentaDeUnEmpleado,
);

/**
 * GET /ventasEmpleados/admin/listado
 * Obtiene todas las ventas para administrador
 * Requiere: auth + admin
 */
router.get(
  "/ventasEmpleados/admin/listado",
  auth,
  verificarRol(["admin"]),
  obtenerVentasParaAdmin,
);

/**
 * GET /ventasEmpleados/admin/detalle/:idVentaE
 * Obtiene una venta específica para editar (admin)
 * Requiere: auth + admin
 */
router.get(
  "/ventasEmpleados/admin/detalle/:idVentaE",
  auth,
  verificarRol(["admin"]),
  validate(idVentaEParamSchema, "params"),
  obtenerVentaParaEditar,
);

// ====================================
// RUTAS PARA CREACIÓN Y MODIFICACIÓN
// ====================================

/**
 * POST /ventasEmpleados/crear
 * Crea una nueva venta de empleado
 * Requiere: auth + (admin o empleado)
 */
router.post(
  "/ventasEmpleados/crear",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(createVentaEmpleadoSchema),
  registrarVentaEmpleado,
);

/**
 * PUT /ventasEmpleados/actualizar/:idVentaE
 * Actualiza una venta de empleado
 * Requiere: auth + (admin o empleado) + permiso modificar_ventasE
 */
router.put(
  "/ventasEmpleados/actualizar/:idVentaE",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_ventasE"),
  validate(updateVentaEmpleadoSchema),
  updateVenta,
);

/**
 * PUT /ventasEmpleados/anular/:idVentaE
 * Anula una venta de empleado
 * Requiere: auth + (admin o empleado) + permiso modificar_ventasE
 */
router.put(
  "/ventasEmpleados/anular/:idVentaE",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_ventasE"),
  validate(idVentaEParamSchema, "params"),
  anularVenta,
);

/**
 * PUT /ventasEmpleados/reactivar/:idVentaE
 * Reactiva una venta anulada
 * Requiere: auth + (admin o empleado) + permiso modificar_ventasE
 */
router.put(
  "/ventasEmpleados/reactivar/:idVentaE",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_ventasE"),
  validate(idVentaEParamSchema, "params"),
  reactivarVenta,
);

module.exports = router;

