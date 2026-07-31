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
const { mutationLimiter } = require("../config/rateLimiters");
const {
  idRecetaParamSchema,
  idRecetaUsadaParamSchema,
  idMedicoParamSchema,
  dniClienteParamSchema,
  createRecetaSchema,
} = require("../schemas/RecetaSchemas");

router.put(
  "/recetas/usada/:idReceta",
  mutationLimiter,
  auth,
  verificarRol(["cliente", "admin"]),
  validate(idRecetaUsadaParamSchema, "params"),
  marcarRecetaUsada,
);

router.get(
  "/recetas/cliente/:dniCliente",
  auth,
  verificarRol(["cliente", "admin"]),
  validate(dniClienteParamSchema, "params"),
  getRecetasActivasCliente,
);

router.get(
  "/recetas/medico/:idMedico",
  auth,
  verificarRol(["medico", "admin"]),
  validate(idMedicoParamSchema, "params"),
  getRecetasPorMedico,
);

router.post(
  "/recetas/crear",
  mutationLimiter,
  auth,
  verificarRol(["medico"]),
  validate(createRecetaSchema, "body"),
  createRecetas,
);

router.put(
  "/recetas/baja/:id",
  mutationLimiter,
  auth,
  verificarRol(["medico", "admin"]),
  validate(idRecetaParamSchema, "params"),
  darBajaReceta,
);

router.put(
  "/recetas/reactivar/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate(idRecetaParamSchema, "params"),
  reactivarReceta,
);

router.get(
  "/recetas/:id",
  auth,
  verificarRol(["admin"]),
  validate(idRecetaParamSchema, "params"),
  getRecetaPorId,
);

module.exports = router;
