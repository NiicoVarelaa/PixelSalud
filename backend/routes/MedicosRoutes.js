const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");

// Importar schemas de validación
const {
  idMedicoParamSchema,
  createMedicoSchema,
  updateMedicoSchema,
} = require("../schemas/MedicoSchemas");

// Importar controladores
const {
  getMedicos,
  getMedicoBajados,
  getMedico,
  createMedico,
  updateMedico,
  darBajaMedico,
  reactivarMedico,
} = require("../controllers/MedicosController");

const router = express.Router();

// ==========================================
// RUTAS DE MÉDICOS
// ==========================================

/**
 * GET /medicos - Obtiene todos los médicos activos
 * Acceso: Admin, Empleado
 */
router.get("/medicos", auth, verificarRol(["admin", "empleado"]), getMedicos);

/**
 * GET /medicos/bajados - Obtiene médicos inactivos
 * Acceso: Admin
 */
router.get("/medicos/bajados", auth, verificarRol(["admin"]), getMedicoBajados);

/**
 * GET /medicos/:id - Obtiene un médico por ID
 * Acceso: Admin, Médico (solo su propio ID)
 */
router.get(
  "/medicos/:id",
  auth,
  verificarRol(["admin", "medico"]),
  validate({ params: idMedicoParamSchema }),
  getMedico,
);

/**
 * POST /medicos/crear - Crea un nuevo médico
 * Acceso: Admin
 */
router.post(
  "/medicos/crear",
  auth,
  verificarRol(["admin"]),
  validate({ body: createMedicoSchema }),
  createMedico,
);

/**
 * PUT /medicos/actualizar/:id - Actualiza un médico
 * Acceso: Admin
 */
router.put(
  "/medicos/actualizar/:id",
  auth,
  verificarRol(["admin"]),
  validate({ params: idMedicoParamSchema, body: updateMedicoSchema }),
  updateMedico,
);

/**
 * PUT /medicos/baja/:id - Da de baja un médico (soft delete)
 * Acceso: Admin
 */
router.put(
  "/medicos/baja/:id",
  auth,
  verificarRol(["admin"]),
  validate({ params: idMedicoParamSchema }),
  darBajaMedico,
);

/**
 * PUT /medicos/reactivar/:id - Reactiva un médico
 * Acceso: Admin
 */
router.put(
  "/medicos/reactivar/:id",
  auth,
  verificarRol(["admin"]),
  validate({ params: idMedicoParamSchema }),
  reactivarMedico,
);

module.exports = router;
