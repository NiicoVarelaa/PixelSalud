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
const {
  idEmpleadoParamSchema,
  permisoSchema,
  updatePermisoSchema,
} = require("../schemas/PermisoSchemas");

/**
 * @route GET /permisos
 * @desc Obtiene todos los permisos
 * @access Admin
 */
router.get("/permisos", auth, verificarRol(["admin"]), getPermisos);

/**
 * @route GET /permisos/:id
 * @desc Obtiene los permisos de un empleado específico
 * @access Admin
 */
router.get(
  "/permisos/:id",
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  getPermisosByEmpleado,
);

/**
 * @route POST /permisos/crear/:id
 * @desc Crea permisos para un empleado
 * @access Admin
 */
router.post(
  "/permisos/crear/:id",
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  validate(permisoSchema, "body"),
  createPermisos,
);

/**
 * @route PUT /permisos/update/:id
 * @desc Actualiza los permisos de un empleado
 * @access Admin
 */
router.put(
  "/permisos/update/:id",
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  validate(updatePermisoSchema, "body"),
  updatePermisos,
);

/**
 * @route DELETE /permisos/:id
 * @desc Elimina los permisos de un empleado
 * @access Admin
 */
router.delete(
  "/permisos/:id",
  auth,
  verificarRol(["admin"]),
  validate(idEmpleadoParamSchema, "params"),
  deletePermisos,
);

module.exports = router;
