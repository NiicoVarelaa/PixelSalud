const { pool } = require("../config/database");

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado, leido, respuesta, fechaRespuesta, respondidoPor 
     FROM MensajesClientes 
     ORDER BY fechaEnvio DESC`,
  );
  return rows;
};

const findById = async (idMensaje) => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado, leido, respuesta, fechaRespuesta, respondidoPor 
     FROM MensajesClientes 
     WHERE idMensaje = ?`,
    [idMensaje],
  );
  return rows[0] || null;
};

const findByEstado = async (estado) => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado, leido, respuesta, fechaRespuesta, respondidoPor 
     FROM MensajesClientes 
     WHERE estado = ? 
     ORDER BY fechaEnvio DESC`,
    [estado],
  );
  return rows;
};

const findByClienteId = async (idCliente) => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado, leido, respuesta, fechaRespuesta, respondidoPor 
     FROM MensajesClientes 
     WHERE idCliente = ? 
     ORDER BY fechaEnvio DESC`,
    [idCliente],
  );
  return rows;
};

const create = async ({
  idCliente,
  nombre,
  email,
  asunto,
  mensaje,
  fechaEnvio,
  estado = "nuevo",
}) => {
  const query = fechaEnvio
    ? `INSERT INTO MensajesClientes (idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    : `INSERT INTO MensajesClientes (idCliente, nombre, email, asunto, mensaje, estado) 
       VALUES (?, ?, ?, ?, ?, ?)`;

  const params = fechaEnvio
    ? [idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado]
    : [idCliente, nombre, email, asunto, mensaje, estado];

  const [result] = await pool.query(query, params);
  return result.insertId;
};

const updateEstado = async (idMensaje, estado) => {
  const [result] = await pool.query(
    `UPDATE MensajesClientes 
     SET estado = ? 
     WHERE idMensaje = ?`,
    [estado, idMensaje],
  );
  return result.affectedRows > 0;
};

const deleteById = async (idMensaje) => {
  const [result] = await pool.query(
    `DELETE FROM MensajesClientes WHERE idMensaje = ?`,
    [idMensaje],
  );
  return result.affectedRows > 0;
};

const markAsRead = async (idMensaje) => {
  const [result] = await pool.query(
    `UPDATE MensajesClientes 
     SET leido = 1 
     WHERE idMensaje = ?`,
    [idMensaje],
  );
  return result.affectedRows > 0;
};

const responder = async (idMensaje, respuesta, respondidoPor) => {
  const [result] = await pool.query(
    `UPDATE MensajesClientes 
     SET respuesta = ?, fechaRespuesta = NOW(), respondidoPor = ?, estado = 'respondido', leido = 1 
     WHERE idMensaje = ?`,
    [respuesta, respondidoPor, idMensaje],
  );
  return result.affectedRows > 0;
};

const existsCliente = async (idCliente) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM Clientes WHERE idCliente = ?`,
    [idCliente],
  );
  return rows[0].count > 0;
};

module.exports = {
  findAll,
  findById,
  findByEstado,
  findByClienteId,
  create,
  updateEstado,
  deleteById,
  markAsRead,
  responder,
  existsCliente,
};
