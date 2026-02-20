const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  idEmpleadoParamSchema,
  createEmpleadoSchema,
  updateEmpleadoSchema,
} = require("../schemas/EmpleadoSchemas");

const {
  getEmpleados,
  getEmpleadosBajados,
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  reactivarEmpleado,
  darBajaEmpleado,
} = require("../controllers/EmpleadosController");

const router = express.Router();

router.get("/Empleados", auth, verificarRol(["admin"]), getEmpleados);

router.get(
  "/Empleados/Bajados",
  auth,
  verificarRol(["admin"]),
  getEmpleadosBajados,
);

router.get(
  "/Empleados/:id",
  auth,
  verificarRol(["admin", "empleado"]),
  validate({ params: idEmpleadoParamSchema }),
  getEmpleado,
);

router.post(
  "/Empleados/crear",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ body: createEmpleadoSchema }),
  createEmpleado,
);

router.put(
  "/empleados/actualizar/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idEmpleadoParamSchema, body: updateEmpleadoSchema }),
  updateEmpleado,
);

router.put(
  "/empleados/baja/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idEmpleadoParamSchema }),
  darBajaEmpleado,
);

router.put(
  "/empleados/reactivar/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idEmpleadoParamSchema }),
  reactivarEmpleado,
);

module.exports = router;
