const router = require("express").Router();
const AuditoriaController = require("../controllers/AuditoriaController");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");

/**
 * @route   GET /api/admin/auditoria
 * @desc    Obtener auditorías con filtros
 * @access  Private/Admin
 */
router.get(
  "/",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerAuditorias,
);

/**
 * @route   GET /api/admin/auditoria/usuario/:tipoUsuario/:idUsuario
 * @desc    Obtener auditorías de un usuario específico
 * @access  Private/Admin
 */
router.get(
  "/usuario/:tipoUsuario/:idUsuario",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerAuditoriasPorUsuario,
);

/**
 * @route   GET /api/admin/auditoria/entidad/:entidadAfectada/:idEntidad
 * @desc    Obtener historial de una entidad
 * @access  Private/Admin
 */
router.get(
  "/entidad/:entidadAfectada/:idEntidad",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerHistorialEntidad,
);

/**
 * @route   GET /api/admin/auditoria/estadisticas
 * @desc    Obtener estadísticas de auditoría
 * @access  Private/Admin
 */
router.get(
  "/estadisticas",
  auth,
  verificarRol(["admin"]),
  AuditoriaController.obtenerEstadisticas,
);

module.exports = router;
