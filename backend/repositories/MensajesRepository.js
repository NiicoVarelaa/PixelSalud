const { pool } = require("../config/database");

/**
 * Obtiene todos los mensajes de clientes
 * @returns {Promise<Array>}
 */
const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado 
     FROM MensajesClientes 
     ORDER BY fechaEnvio DESC`,
  );
  return rows;
};

/**
 * Obtiene un mensaje por ID
 * @param {number} idMensaje - ID del mensaje
 * @returns {Promise<Object|null>}
 */
const findById = async (idMensaje) => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado 
     FROM MensajesClientes 
     WHERE idMensaje = ?`,
    [idMensaje],
  );
  return rows[0] || null;
};

/**
 * Obtiene mensajes por estado
 * @param {string} estado - Estado del mensaje ('nuevo', 'leido', 'respondido')
 * @returns {Promise<Array>}
 */
const findByEstado = async (estado) => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado 
     FROM MensajesClientes 
     WHERE estado = ? 
     ORDER BY fechaEnvio DESC`,
    [estado],
  );
  return rows;
};

/**
 * Obtiene mensajes por cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Array>}
 */
const findByClienteId = async (idCliente) => {
  const [rows] = await pool.query(
    `SELECT idMensaje, idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado 
     FROM MensajesClientes 
     WHERE idCliente = ? 
     ORDER BY fechaEnvio DESC`,
    [idCliente],
  );
  return rows;
};

/**
 * Crea un nuevo mensaje
 * @param {Object} mensajeData - Datos del mensaje
 * @returns {Promise<number>} - ID del mensaje creado
 */
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

/**
 * Actualiza el estado de un mensaje
 * @param {number} idMensaje - ID del mensaje
 * @param {string} estado - Nuevo estado
 * @returns {Promise<boolean>} - true si se actualizó correctamente
 */
const updateEstado = async (idMensaje, estado) => {
  const [result] = await pool.query(
    `UPDATE MensajesClientes 
     SET estado = ? 
     WHERE idMensaje = ?`,
    [estado, idMensaje],
  );
  return result.affectedRows > 0;
};

/**
 * Elimina un mensaje
 * @param {number} idMensaje - ID del mensaje
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
const deleteById = async (idMensaje) => {
  const [result] = await pool.query(
    `DELETE FROM MensajesClientes WHERE idMensaje = ?`,
    [idMensaje],
  );
  return result.affectedRows > 0;
};

/**
 * Verifica si existe un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<boolean>}
 */
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
  existsCliente,
};
