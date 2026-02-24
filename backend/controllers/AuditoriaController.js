const AuditoriaRepository = require("../repositories/AuditoriaRepository");
const { createAppError } = require("../errors");

/**
 * Obtiene auditorías con filtros
 * @route GET /api/admin/auditoria
 */
const obtenerAuditorias = async (req, res, next) => {
  try {
    const {
      modulo,
      tipoUsuario,
      idUsuario,
      entidadAfectada,
      idEntidad,
      fechaDesde,
      fechaHasta,
      limite = 50,
      offset = 0,
    } = req.query;

    const auditorias = await AuditoriaRepository.obtenerAuditorias({
      modulo,
      tipoUsuario,
      idUsuario: idUsuario ? parseInt(idUsuario) : undefined,
      entidadAfectada,
      idEntidad: idEntidad ? parseInt(idEntidad) : undefined,
      fechaDesde,
      fechaHasta,
      limite: parseInt(limite),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: auditorias,
      total: auditorias.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene auditorías de un usuario específico
 * @route GET /api/admin/auditoria/usuario/:tipoUsuario/:idUsuario
 */
const obtenerAuditoriasPorUsuario = async (req, res, next) => {
  try {
    const { tipoUsuario, idUsuario } = req.params;
    const { limite = 50 } = req.query;

    const auditorias = await AuditoriaRepository.obtenerAuditoriasPorUsuario(
      tipoUsuario,
      parseInt(idUsuario),
      parseInt(limite),
    );

    res.status(200).json({
      success: true,
      data: auditorias,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene historial de una entidad
 * @route GET /api/admin/auditoria/entidad/:entidadAfectada/:idEntidad
 */
const obtenerHistorialEntidad = async (req, res, next) => {
  try {
    const { entidadAfectada, idEntidad } = req.params;

    const historial = await AuditoriaRepository.obtenerHistorialEntidad(
      entidadAfectada,
      parseInt(idEntidad),
    );

    res.status(200).json({
      success: true,
      data: historial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene estadísticas de auditoría
 * @route GET /api/admin/auditoria/estadisticas
 */
const obtenerEstadisticas = async (req, res, next) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    if (!fechaDesde || !fechaHasta) {
      throw createAppError(
        "Se requieren fechaDesde y fechaHasta",
        400,
        "MISSING_DATES",
      );
    }

    const estadisticas = await AuditoriaRepository.obtenerEstadisticasAuditoria(
      fechaDesde,
      fechaHasta,
    );

    res.status(200).json({
      success: true,
      data: estadisticas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerAuditorias,
  obtenerAuditoriasPorUsuario,
  obtenerHistorialEntidad,
  obtenerEstadisticas,
};
