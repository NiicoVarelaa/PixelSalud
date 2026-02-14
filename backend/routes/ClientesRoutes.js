const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");

// Importar schemas de validación
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

// Importar controladores
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

// ==========================================
// RUTAS DE CLIENTES
// ==========================================

/**
 * GET /clientes - Obtiene todos los clientes
 * Acceso: Admin
 */
router.get("/clientes", auth, verificarRol(["admin"]), getClientes);

/**
 * GET /clientes/bajados - Obtiene clientes inactivos
 * Acceso: Admin
 */
router.get(
  "/clientes/bajados",
  auth,
  verificarRol(["admin"]),
  getClienteBajados,
);

/**
 * GET /clientes/buscar/:dni - Busca un cliente por DNI
 * Acceso: Médico, Admin, Empleado
 */
router.get(
  "/clientes/buscar/:dni",
  auth,
  verificarRol(["medico", "admin", "empleado"]),
  validate({ params: dniParamSchema }),
  buscarClientePorDNI,
);

/**
 * GET /clientes/:id - Obtiene un cliente por ID
 * Acceso: Admin, Cliente (solo su propio ID)
 */
router.get(
  "/clientes/:id",
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idParamSchema }),
  getCliente,
);

/**
 * POST /clientes/crear - Crea un nuevo cliente (registro público)
 * Acceso: Público
 */
router.post(
  "/clientes/crear",
  validate({ body: createClienteSchema }),
  crearCliente,
);

/**
 * POST /clientes/express - Registro express de paciente (para médicos)
 * Acceso: Médico, Admin
 */
router.post(
  "/clientes/express",
  auth,
  verificarRol(["medico", "admin"]),
  validate({ body: registroExpressSchema }),
  registrarPacienteExpress,
);

/**
 * PUT /clientes/actualizar/:idCliente - Actualiza un cliente
 * Acceso: Admin, Cliente (solo su propio ID)
 */
router.put(
  "/clientes/actualizar/:idCliente",
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idClienteParamSchema, body: updateClienteSchema }),
  updateCliente,
);

/**
 * PUT /clientes/darBaja/:id - Da de baja un cliente
 * Acceso: Admin, Cliente (solo su propio ID)
 */
router.put(
  "/clientes/darBaja/:id",
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idParamSchema }),
  darBajaCliente,
);

/**
 * PUT /clientes/activar/:id - Activa un cliente
 * Acceso: Admin, Cliente (solo su propio ID)
 */
router.put(
  "/clientes/activar/:id",
  auth,
  verificarRol(["admin", "cliente"]),
  validate({ params: idParamSchema }),
  activarCliente,
);

// ==========================================
// RUTAS DE RECUPERACIÓN DE CONTRASEÑA (Públicas)
// ==========================================

/**
 * POST /clientes/olvide-password - Solicita recuperación de contraseña
 * Acceso: Público
 */
router.post(
  "/clientes/olvide-password",
  validate({ body: olvidePasswordSchema }),
  olvideContrasena,
);

/**
 * POST /clientes/restablecer-password/:token - Restablece contraseña con token
 * Acceso: Público
 */
router.post(
  "/clientes/restablecer-password/:token",
  validate({ params: tokenParamSchema, body: restablecerPasswordSchema }),
  nuevoPassword,
);

module.exports = router;
