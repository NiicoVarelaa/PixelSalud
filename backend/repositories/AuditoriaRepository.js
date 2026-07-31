const { pool } = require("../config/database");

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

const obtenerAuditorias = async (filtros = {}) => {
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
  } = filtros;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (modulo) {
    whereClause += " AND modulo = ?";
    params.push(modulo);
  }

  if (tipoUsuario) {
    whereClause += " AND tipoUsuario = ?";
    params.push(tipoUsuario);
  }

  if (idUsuario) {
    whereClause += " AND idUsuario = ?";
    params.push(idUsuario);
  }

  if (entidadAfectada) {
    whereClause += " AND entidadAfectada = ?";
    params.push(entidadAfectada);
  }

  if (idEntidad) {
    whereClause += " AND idEntidad = ?";
    params.push(idEntidad);
  }

  if (fechaDesde) {
    whereClause += " AND fechaHora >= ?";
    params.push(fechaDesde);
  }

  if (fechaHasta) {
    whereClause += " AND fechaHora < DATE_ADD(?, INTERVAL 1 DAY)";
    params.push(fechaHasta);
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM auditoria ${whereClause}`,
    params,
  );

  const query = `SELECT * FROM auditoria ${whereClause} ORDER BY fechaHora DESC LIMIT ? OFFSET ?`;
  const dataParams = [...params, limite, offset];
  const [registros] = await pool.query(query, dataParams);

  return {
    data: registros.map((registro) => ({
      ...registro,
      datosAnteriores: parseJsonSafe(registro.datosAnteriores),
      datosNuevos: parseJsonSafe(registro.datosNuevos),
    })),
    total,
  };
};

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
