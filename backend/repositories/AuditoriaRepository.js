const { pool } = require("../config/database");

/**
 * Helper para parsear JSON de forma segura
 * MySQL puede devolver campos JSON como objetos o strings dependiendo de la configuración
 */
const parseJsonSafe = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return null;
  }
};

/**
 * Registra una acción en el log de auditoría
 * @param {Object} datos - Datos de la auditoría
 * @returns {Promise<number>} ID del registro de auditoría creado
 */
const registrarAuditoria = async (datos) => {
  const {
    evento,
    modulo,
    accion,
    descripcion,
    tipoUsuario,
    idUsuario,
    nombreUsuario,
    emailUsuario,
    entidadAfectada,
    idEntidad,
    datosAnteriores,
    datosNuevos,
    ip,
    userAgent,
  } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO auditoria (
      evento, modulo, accion, descripcion,
      tipoUsuario, idUsuario, nombreUsuario, emailUsuario,
      entidadAfectada, idEntidad, datosAnteriores, datosNuevos,
      ip, userAgent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      evento,
      modulo,
      accion,
      descripcion || null,
      tipoUsuario,
      idUsuario,
      nombreUsuario || null,
      emailUsuario || null,
      entidadAfectada || null,
      idEntidad || null,
      datosAnteriores ? JSON.stringify(datosAnteriores) : null,
      datosNuevos ? JSON.stringify(datosNuevos) : null,
      ip || null,
      userAgent || null,
    ],
  );

  return resultado.insertId;
};

/**
 * Obtiene registros de auditoría con filtros
 * @param {Object} filtros - Filtros de búsqueda
 * @returns {Promise<Array>} Registros de auditoría
 */
const obtenerAuditorias = async (filtros = {}) => {
  const {
    modulo,
    tipoUsuario,
    idUsuario,
    entidadAfectada,
    idEntidad,
    fechaDesde,
    fechaHasta,
    limite = 100,
    offset = 0,
  } = filtros;

  let query = "SELECT * FROM auditoria WHERE 1=1";
  const params = [];

  if (modulo) {
    query += " AND modulo = ?";
    params.push(modulo);
  }

  if (tipoUsuario) {
    query += " AND tipoUsuario = ?";
    params.push(tipoUsuario);
  }

  if (idUsuario) {
    query += " AND idUsuario = ?";
    params.push(idUsuario);
  }

  if (entidadAfectada) {
    query += " AND entidadAfectada = ?";
    params.push(entidadAfectada);
  }

  if (idEntidad) {
    query += " AND idEntidad = ?";
    params.push(idEntidad);
  }

  if (fechaDesde) {
    query += " AND fechaHora >= ?";
    params.push(fechaDesde);
  }

  if (fechaHasta) {
    query += " AND fechaHora <= ?";
    params.push(fechaHasta);
  }

  query += " ORDER BY fechaHora DESC LIMIT ? OFFSET ?";
  params.push(limite, offset);

  const [registros] = await pool.query(query, params);

  // Parsear JSON en los campos que lo requieran
  return registros.map((registro) => ({
    ...registro,
    datosAnteriores: parseJsonSafe(registro.datosAnteriores),
    datosNuevos: parseJsonSafe(registro.datosNuevos),
  }));
};

/**
 * Obtiene auditorías de un usuario específico
 * @param {string} tipoUsuario - Tipo de usuario
 * @param {number} idUsuario - ID del usuario
 * @param {number} limite - Límite de registros
 * @returns {Promise<Array>} Registros de auditoría del usuario
 */
const obtenerAuditoriasPorUsuario = async (
  tipoUsuario,
  idUsuario,
  limite = 50,
) => {
  const [registros] = await pool.query(
    `SELECT * FROM auditoria
     WHERE tipoUsuario = ? AND idUsuario = ?
     ORDER BY fechaHora DESC
     LIMIT ?`,
    [tipoUsuario, idUsuario, limite],
  );

  return registros.map((registro) => ({
    ...registro,
    datosAnteriores: parseJsonSafe(registro.datosAnteriores),
    datosNuevos: parseJsonSafe(registro.datosNuevos),
  }));
};

/**
 * Obtiene auditorías de una entidad específica
 * @param {string} entidadAfectada - Nombre de la entidad
 * @param {number} idEntidad - ID de la entidad
 * @returns {Promise<Array>} Historial de cambios de la entidad
 */
const obtenerHistorialEntidad = async (entidadAfectada, idEntidad) => {
  const [registros] = await pool.query(
    `SELECT * FROM auditoria
     WHERE entidadAfectada = ? AND idEntidad = ?
     ORDER BY fechaHora DESC`,
    [entidadAfectada, idEntidad],
  );

  return registros.map((registro) => ({
    ...registro,
    datosAnteriores: parseJsonSafe(registro.datosAnteriores),
    datosNuevos: parseJsonSafe(registro.datosNuevos),
  }));
};

/**
 * Obtiene estadísticas de auditoría
 * @param {string} fechaDesde - Fecha desde
 * @param {string} fechaHasta - Fecha hasta
 * @returns {Promise<Object>} Estadísticas de auditoría
 */
const obtenerEstadisticasAuditoria = async (fechaDesde, fechaHasta) => {
  const [resultado] = await pool.query(
    `SELECT 
      COUNT(*) as totalAcciones,
      COUNT(DISTINCT CONCAT(tipoUsuario, '-', idUsuario)) as usuariosActivos,
      COUNT(DISTINCT modulo) as modulosAfectados,
      modulo,
      COUNT(*) as accionesPorModulo
     FROM auditoria
     WHERE fechaHora BETWEEN ? AND ?
     GROUP BY modulo`,
    [fechaDesde, fechaHasta],
  );

  const [accionesPorDia] = await pool.query(
    `SELECT 
      DATE(fechaHora) as fecha,
      COUNT(*) as totalAcciones
     FROM auditoria
     WHERE fechaHora BETWEEN ? AND ?
     GROUP BY DATE(fechaHora)
     ORDER BY fecha DESC`,
    [fechaDesde, fechaHasta],
  );

  return {
    totalAcciones: resultado.reduce((sum, r) => sum + r.accionesPorModulo, 0),
    accionesPorModulo: resultado.map((r) => ({
      modulo: r.modulo,
      cantidad: r.accionesPorModulo,
    })),
    accionesPorDia,
  };
};

/**
 * Elimina auditorías antiguas (limpieza)
 * @param {number} diasAntiguedad - Días de antigüedad para eliminar
 * @returns {Promise<number>} Cantidad de registros eliminados
 */
const limpiarAuditoriasAntiguas = async (diasAntiguedad = 365) => {
  const [resultado] = await pool.query(
    `DELETE FROM auditoria
     WHERE fechaHora < DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [diasAntiguedad],
  );

  return resultado.affectedRows;
};

module.exports = {
  registrarAuditoria,
  obtenerAuditorias,
  obtenerAuditoriasPorUsuario,
  obtenerHistorialEntidad,
  obtenerEstadisticasAuditoria,
  limpiarAuditoriasAntiguas,
};
