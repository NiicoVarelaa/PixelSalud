const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { verificarRol } = require("../middlewares/verificarPermisos");

// Importar schemas de validación
const {
  idEmpleadoParamSchema,
  createEmpleadoSchema,
  updateEmpleadoSchema,
} = require("../validators/empleadoSchemas");

// Importar controladores
const {
  getEmpleados,
  getEmpleadosBajados,
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  reactivarEmpleado,
  darBajaEmpleado,
} = require("../controllers/empleados");

const router = express.Router();

// ==========================================
// RUTAS DE EMPLEADOS
// ==========================================

/**
 * GET /Empleados - Obtiene todos los empleados activos con permisos
 * Acceso: Admin
 */
router.get("/Empleados", auth, verificarRol(["admin"]), getEmpleados);

/**
 * GET /Empleados/Bajados - Obtiene empleados inactivos
 * Acceso: Admin
 */
router.get(
  "/Empleados/Bajados",
  auth,
  verificarRol(["admin"]),
  getEmpleadosBajados,
);

/**
 * GET /Empleados/:id - Obtiene un empleado por ID con sus permisos
 * Acceso: Admin, Empleado propio
 */
router.get(
  "/Empleados/:id",
  auth,
  verificarRol(["admin", "empleado"]),
  validate({ params: idEmpleadoParamSchema }),
  getEmpleado,
);

/**
 * POST /Empleados/crear - Crea un nuevo empleado con permisos
 * Acceso: Admin
 */
router.post(
  "/Empleados/crear",
  auth,
  verificarRol(["admin"]),
  validate({ body: createEmpleadoSchema }),
  createEmpleado,
);

/**
 * PUT /empleados/actualizar/:id - Actualiza un empleado y sus permisos
 * Acceso: Admin
 */
router.put(
  "/empleados/actualizar/:id",
  auth,
  verificarRol(["admin"]),
  validate({ params: idEmpleadoParamSchema, body: updateEmpleadoSchema }),
  updateEmpleado,
);

/**
 * PUT /empleados/baja/:id - Da de baja un empleado (soft delete)
 * Acceso: Admin
 */
router.put(
  "/empleados/baja/:id",
  auth,
  verificarRol(["admin"]),
  validate({ params: idEmpleadoParamSchema }),
  darBajaEmpleado,
);

/**
 * PUT /empleados/reactivar/:id - Reactiva un empleado dado de baja
 * Acceso: Admin
 */
router.put(
  "/empleados/reactivar/:id",
  auth,
  verificarRol(["admin"]),
  validate({ params: idEmpleadoParamSchema }),
  reactivarEmpleado,
);

module.exports = router;
