const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const {
  mutationLimiter,
  registerLimiter,
  authLimiter,
} = require("../config/rateLimiters");

const {
  idClienteParamSchema,
  idParamSchema,
  dniParamSchema,
  createClienteSchema,
  updateClienteSchema,
  registroExpressSchema,
  olvidePasswordSchema,
  restablecerPasswordSchema,
  tokenParamSchema,
} = require("../schemas/ClienteSchemas");

const {
  getClientes,
  getClienteBajados,
  getCliente,
  crearCliente,
  updateCliente,
  darBajaCliente,
  activarCliente,
  buscarClientePorDNI,
  registrarPacienteExpress,
  olvideContrasena,
  nuevoPassword,
} = require("../controllers/ClientesController");

const router = express.Router();

router.get("/clientes", auth, verificarRol(["admin"]), getClientes);

router.get(
  "/clientes/bajados",
  auth,
  verificarRol(["admin"]),
  getClienteBajados,
);

router.get(
  "/clientes/buscar/:dni",
  auth,
  verificarRol(["medico", "admin", "empleado"]),
  validate({ params: dniParamSchema }),
  buscarClientePorDNI,
);

router.get(
  "/clientes/:id",
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idParamSchema }),
  getCliente,
);

router.post(
  "/clientes/crear",
  registerLimiter,
  validate({ body: createClienteSchema }),
  crearCliente,
);

router.post(
  "/clientes/express",
  mutationLimiter,
  auth,
  verificarRol(["medico", "admin"]),
  validate({ body: registroExpressSchema }),
  registrarPacienteExpress,
);

router.put(
  "/clientes/actualizar/:idCliente",
  mutationLimiter,
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idClienteParamSchema, body: updateClienteSchema }),
  updateCliente,
);

router.put(
  "/clientes/darBaja/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idParamSchema }),
  darBajaCliente,
);

router.put(
  "/clientes/activar/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idParamSchema }),
  activarCliente,
);

router.post(
  "/clientes/olvide-password",
  authLimiter,
  validate({ body: olvidePasswordSchema }),
  olvideContrasena,
);

router.post(
  "/clientes/restablecer-password/:token",
  authLimiter,
  validate({ params: tokenParamSchema, body: restablecerPasswordSchema }),
  nuevoPassword,
);

module.exports = router;
