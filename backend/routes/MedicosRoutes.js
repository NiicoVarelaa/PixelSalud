const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  idMedicoParamSchema,
  createMedicoSchema,
  updateMedicoSchema,
} = require("../schemas/MedicoSchemas");

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

router.get("/medicos", auth, verificarRol(["admin", "empleado"]), getMedicos);

router.get("/medicos/bajados", auth, verificarRol(["admin"]), getMedicoBajados);

router.get(
  "/medicos/:id",
  auth,
  verificarRol(["admin", "medico"]),
  validate({ params: idMedicoParamSchema }),
  getMedico,
);

router.post(
  "/medicos/crear",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ body: createMedicoSchema }),
  createMedico,
);

router.put(
  "/medicos/actualizar/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idMedicoParamSchema, body: updateMedicoSchema }),
  updateMedico,
);

router.put(
  "/medicos/baja/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idMedicoParamSchema }),
  darBajaMedico,
);

router.put(
  "/medicos/reactivar/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idMedicoParamSchema }),
  reactivarMedico,
);

module.exports = router;
