const express = require("express");
const router = express.Router();
const {
  getPermisos,
  getPermisosByEmpleado,
  createPermisos,
  updatePermisos,
  deletePermisos,
} = require("../controllers/PermisosController");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");
const { mutationLimiter } = require("../config/rateLimiters");
const {
  idEmpleadoParamSchema,
  permisoSchema,
  updatePermisoSchema,
} = require("../schemas/PermisoSchemas");

router.get("/permisos", auth, verificarRol(["admin"]), getPermisos);

router.get(
  "/permisos/:id",
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  getPermisosByEmpleado,
);

router.post(
  "/permisos/crear/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  validate(permisoSchema, "body"),
  createPermisos,
);

router.put(
  "/permisos/update/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  validate(updatePermisoSchema, "body"),
  updatePermisos,
);

router.delete(
  "/permisos/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  deletePermisos,
);

module.exports = router;
