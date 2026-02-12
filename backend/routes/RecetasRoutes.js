const express = require("express");
const router = express.Router();
const {
  getRecetasPorMedico,
  getRecetasActivasCliente,
  getRecetaPorId,
  createRecetas,
  marcarRecetaUsada,
  darBajaReceta,
  reactivarReceta,
} = require("../controllers/RecetasController");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");
const {
  idRecetaParamSchema,
  idRecetaUsadaParamSchema,
  idMedicoParamSchema,
  dniClienteParamSchema,
  createRecetaSchema,
} = require("../schemas/RecetaSchemas");

/**
 * @route PUT /recetas/usada/:idReceta
 * @desc Marca una receta como usada al comprar
 * @access Cliente, Admin
 */
router.put(
  "/recetas/usada/:idReceta",
  auth,
  verificarRol(["cliente", "admin"]),
  validate(idRecetaUsadaParamSchema, "params"),
  marcarRecetaUsada,
);

/**
 * @route GET /recetas/cliente/:dniCliente
 * @desc Obtiene recetas activas de un cliente (no usadas)
 * @access Cliente, Admin
 */
router.get(
  "/recetas/cliente/:dniCliente",
  auth,
  verificarRol(["cliente", "admin"]),
  validate(dniClienteParamSchema, "params"),
  getRecetasActivasCliente,
);

/**
 * @route GET /recetas/medico/:idMedico
 * @desc Obtiene todas las recetas de un médico específico
 * @access Medico, Admin
 */
router.get(
  "/recetas/medico/:idMedico",
  auth,
  verificarRol(["medico", "admin"]),
  validate(idMedicoParamSchema, "params"),
  getRecetasPorMedico,
);

/**
 * @route POST /recetas/crear
 * @desc Crea múltiples recetas para un cliente
 * @access Medico
 */
router.post(
  "/recetas/crear",
  auth,
  verificarRol(["medico"]),
  validate(createRecetaSchema, "body"),
  createRecetas,
);

/**
 * @route PUT /recetas/baja/:id
 * @desc Da de baja una receta (soft delete)
 * @access Medico, Admin
 */
router.put(
  "/recetas/baja/:id",
  auth,
  verificarRol(["medico", "admin"]),
  validate(idRecetaParamSchema, "params"),
  darBajaReceta,
);

/**
 * @route PUT /recetas/reactivar/:id
 * @desc Reactiva una receta previamente dada de baja
 * @access Admin
 */
router.put(
  "/recetas/reactivar/:id",
  auth,
  verificarRol(["admin"]),
  validate(idRecetaParamSchema, "params"),
  reactivarReceta,
);

/**
 * @route GET /recetas/:id
 * @desc Obtiene una receta específica por ID con todos los detalles
 * @access Admin
 */
router.get(
  "/recetas/:id",
  auth,
  verificarRol(["admin"]),
  validate(idRecetaParamSchema, "params"),
  getRecetaPorId,
);

module.exports = router;
