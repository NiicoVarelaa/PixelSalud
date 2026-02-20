const express = require("express");
const router = express.Router();

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

const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");

const {
  idMensajeParamSchema,
  idClienteParamSchema,
  estadoParamSchema,
  createMensajeSchema,
  updateEstadoMensajeSchema,
  responderMensajeSchema,
} = require("../schemas/MensajeSchemas");

router.post("/crear", validate(createMensajeSchema), crearMensaje);

router.get("/", auth, verificarRol(["admin"]), listarMensajes);

router.get(
  "/:idMensaje",
  auth,
  verificarRol(["admin"]),
  validate(idMensajeParamSchema, "params"),
  obtenerMensaje,
);

router.get(
  "/estado/:estado",
  auth,
  verificarRol(["admin"]),
  validate(estadoParamSchema, "params"),
  listarMensajesPorEstado,
);

router.get(
  "/cliente/:idCliente",
  auth,
  verificarRol(["admin"]),
  validate(idClienteParamSchema, "params"),
  listarMensajesPorCliente,
);

router.put(
  "/:idMensaje/estado",
  auth,
  verificarRol(["admin"]),
  validate(updateEstadoMensajeSchema),
  actualizarEstadoMensaje,
);

router.patch(
  "/:idMensaje/leido",
  auth,
  verificarRol(["admin"]),
  validate(idMensajeParamSchema, "params"),
  marcarComoLeido,
);

router.post(
  "/:idMensaje/responder",
  auth,
  verificarRol(["admin"]),
  validate(responderMensajeSchema),
  responderMensaje,
);

router.delete(
  "/:idMensaje",
  auth,
  verificarRol(["admin"]),
  validate(idMensajeParamSchema, "params"),
  eliminarMensaje,
);

module.exports = router;
