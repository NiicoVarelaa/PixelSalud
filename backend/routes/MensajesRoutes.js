const express = require("express");
const router = express.Router();

// Controllers
const {
  listarMensajes,
  obtenerMensaje,
  listarMensajesPorEstado,
  listarMensajesPorCliente,
  crearMensaje,
  actualizarEstadoMensaje,
  eliminarMensaje,
  marcarComoLeido,
  responderMensaje,
} = require("../controllers/MensajesController");

// Middlewares
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");

// Schemas
const {
  idMensajeParamSchema,
  idClienteParamSchema,
  estadoParamSchema,
  createMensajeSchema,
  updateEstadoMensajeSchema,
  responderMensajeSchema,
} = require("../schemas/MensajeSchemas");

// ====================================
// RUTAS PÚBLICAS (sin autenticación)
// ====================================

/**
 * POST /mensajes/crear
 * Crea un nuevo mensaje desde el formulario de contacto
 * Acceso público
 */
router.post("/crear", validate(createMensajeSchema), crearMensaje);

// ====================================
// RUTAS PARA ADMINISTRACIÓN
// ====================================

/**
 * GET /mensajes
 * Lista todos los mensajes
 * Requiere: auth + admin
 */
router.get("/", auth, verificarRol(["admin"]), listarMensajes);

/**
 * GET /mensajes/:idMensaje
 * Obtiene un mensaje específico
 * Requiere: auth + admin
 */
router.get(
  "/:idMensaje",
  auth,
  verificarRol(["admin"]),
  validate(idMensajeParamSchema, "params"),
  obtenerMensaje,
);

/**
 * GET /mensajes/estado/:estado
 * Lista mensajes por estado (nuevo, leido, respondido)
 * Requiere: auth + admin
 */
router.get(
  "/estado/:estado",
  auth,
  verificarRol(["admin"]),
  validate(estadoParamSchema, "params"),
  listarMensajesPorEstado,
);

/**
 * GET /mensajes/cliente/:idCliente
 * Lista mensajes de un cliente específico
 * Requiere: auth + admin
 */
router.get(
  "/cliente/:idCliente",
  auth,
  verificarRol(["admin"]),
  validate(idClienteParamSchema, "params"),
  listarMensajesPorCliente,
);

/**
 * PUT /mensajes/:idMensaje/estado
 * Actualiza el estado de un mensaje
 * Requiere: auth + admin
 */
router.put(
  "/:idMensaje/estado",
  auth,
  verificarRol(["admin"]),
  validate(updateEstadoMensajeSchema),
  actualizarEstadoMensaje,
);

/**
 * PATCH /mensajes/:idMensaje/leido
 * Marca un mensaje como leído
 * Requiere: auth + admin
 */
router.patch(
  "/:idMensaje/leido",
  auth,
  verificarRol(["admin"]),
  validate(idMensajeParamSchema, "params"),
  marcarComoLeido,
);

/**
 * POST /mensajes/:idMensaje/responder
 * Responde a un mensaje
 * Requiere: auth + admin
 */
router.post(
  "/:idMensaje/responder",
  auth,
  verificarRol(["admin"]),
  validate(responderMensajeSchema),
  responderMensaje,
);

/**
 * DELETE /mensajes/:idMensaje
 * Elimina un mensaje
 * Requiere: auth + admin
 */
router.delete(
  "/:idMensaje",
  auth,
  verificarRol(["admin"]),
  validate(idMensajeParamSchema, "params"),
  eliminarMensaje,
);

module.exports = router;
