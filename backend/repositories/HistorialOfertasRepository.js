const { pool } = require("../config/database");

const registrarCambioOferta = async (data) => {
  const {
    idProducto,
    accion,
    porcentajeAnterior = 0,
    porcentajeNuevo = 0,
    idUsuario,
    nombreUsuario,
    tipoUsuario,
  } = data;

  const query = `
    INSERT INTO historial_ofertas 
      (idProducto, accion, porcentajeAnterior, porcentajeNuevo, idUsuario, nombreUsuario, tipoUsuario)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [
    idProducto,
    accion,
    porcentajeAnterior,
    porcentajeNuevo,
    idUsuario,
    nombreUsuario,
    tipoUsuario,
  ]);

  return result.insertId;
};

const obtenerHistorialPorProducto = async (idProducto) => {
  const query = `
    SELECT 
      h.idHistorial,
      h.idProducto,
      h.accion,
      h.porcentajeAnterior,
      h.porcentajeNuevo,
      h.idUsuario,
      h.nombreUsuario,
      h.tipoUsuario,
      h.fechaHora
    FROM historial_ofertas h
    WHERE h.idProducto = ?
    ORDER BY h.fechaHora DESC
  `;

  const [rows] = await pool.execute(query, [idProducto]);
  return rows;
};

const obtenerHistorialGeneral = async (limit = 50, offset = 0) => {
  const query = `
    SELECT 
      h.idHistorial,
      h.idProducto,
      p.nombreProducto,
      h.accion,
      h.porcentajeAnterior,
      h.porcentajeNuevo,
      h.idUsuario,
      h.nombreUsuario,
      h.tipoUsuario,
      h.fechaHora
    FROM historial_ofertas h
    INNER JOIN Productos p ON h.idProducto = p.idProducto
    ORDER BY h.fechaHora DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.execute(query, [limit, offset]);
  return rows;
};

const contarRegistros = async () => {
  const [rows] = await pool.execute("SELECT COUNT(*) as total FROM historial_ofertas");
  return rows[0].total;
};

module.exports = {
  registrarCambioOferta,
  obtenerHistorialPorProducto,
  obtenerHistorialGeneral,
  contarRegistros,
};
