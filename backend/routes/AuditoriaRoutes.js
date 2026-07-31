const router = require("express").Router();
const AuditoriaController = require("../controllers/AuditoriaController");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");

router.get(
  "/",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerAuditorias,
);

router.get(
  "/usuario/:tipoUsuario/:idUsuario",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerAuditoriasPorUsuario,
);

router.get(
  "/entidad/:entidadAfectada/:idEntidad",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerHistorialEntidad,
);

router.get(
  "/estadisticas",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerEstadisticas,
);

module.exports = router;
