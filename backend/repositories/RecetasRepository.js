const pool = require("../config/database");

/**
 * Obtiene todas las recetas de un médico específico con detalles completos
 * @param {number} idMedico - ID del médico
 * @returns {Promise<Array>}
 */
const findByMedicoId = async (idMedico) => {
  const sql = `
    SELECT 
      r.idReceta, 
      r.dniCliente, 
      r.cantidad, 
      r.usada, 
      r.fechaEmision,
      r.activo,
      c.nombreCliente, 
      c.apellidoCliente,
      p.nombreProducto,
      p.idProducto
    FROM Recetas r
    JOIN Clientes c ON r.dniCliente = c.dni
    JOIN Productos p ON r.idProducto = p.idProducto
    WHERE r.idMedico = ?
    ORDER BY r.idReceta DESC
  `;
  const [rows] = await pool.query(sql, [idMedico]);
  return rows;
};

/**
 * Obtiene recetas activas (no usadas) de un cliente específico
 * @param {string} dniCliente - DNI del cliente
 * @returns {Promise<Array>}
 */
const findActivasByClienteDni = async (dniCliente) => {
  const sql = `
    SELECT 
      r.idReceta, 
      r.idProducto, 
      r.cantidad, 
      r.activo, 
      r.usada,
      r.fechaEmision,
      p.nombreProducto
    FROM Recetas r
    JOIN Productos p ON r.idProducto = p.idProducto
    WHERE r.dniCliente = ? 
      AND r.activo = true 
      AND r.usada = false
    ORDER BY r.fechaEmision DESC
  `;
  const [rows] = await pool.query(sql, [dniCliente]);
  return rows;
};

/**
 * Obtiene una receta por su ID
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<Object|null>}
 */
const findById = async (idReceta) => {
  const sql = `
    SELECT 
      r.*,
      c.nombreCliente, 
      c.apellidoCliente,
      p.nombreProducto,
      m.nombreMedico,
      m.apellidoMedico
    FROM Recetas r
    JOIN Clientes c ON r.dniCliente = c.dni
    JOIN Productos p ON r.idProducto = p.idProducto
    JOIN Medicos m ON r.idMedico = m.idMedico
    WHERE r.idReceta = ?
  `;
  const [rows] = await pool.query(sql, [idReceta]);
  return rows[0] || null;
};

/**
 * Crea múltiples recetas (bulk insert)
 * @param {Array} recetas - Array de objetos [dniCliente, idMedico, idProducto, cantidad, fechaEmision]
 * @returns {Promise<number>} - Número de filas insertadas
 */
const createMultiple = async (recetas) => {
  const sql = `
    INSERT INTO Recetas (dniCliente, idMedico, idProducto, cantidad, fechaEmision)
    VALUES ?
  `;
  const [result] = await pool.query(sql, [recetas]);
  return result.affectedRows;
};

/**
 * Marca una receta como usada
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<void>}
 */
const marcarComoUsada = async (idReceta) => {
  const sql = `UPDATE Recetas SET usada = true WHERE idReceta = ?`;
  await pool.query(sql, [idReceta]);
};

/**
 * Da de baja una receta (soft delete)
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<void>}
 */
const darBaja = async (idReceta) => {
  const sql = `UPDATE Recetas SET activo = false WHERE idReceta = ?`;
  await pool.query(sql, [idReceta]);
};

/**
 * Reactiva una receta
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<void>}
 */
const reactivar = async (idReceta) => {
  const sql = `UPDATE Recetas SET activo = true WHERE idReceta = ?`;
  await pool.query(sql, [idReceta]);
};

/**
 * Verifica si existe un cliente por DNI
 * @param {string} dni - DNI del cliente
 * @returns {Promise<boolean>}
 */
const existsCliente = async (dni) => {
  const sql = `SELECT COUNT(*) as count FROM Clientes WHERE dni = ?`;
  const [rows] = await pool.query(sql, [dni]);
  return rows[0].count > 0;
};

/**
 * Verifica si existe un médico por ID
 * @param {number} idMedico - ID del médico
 * @returns {Promise<boolean>}
 */
const existsMedico = async (idMedico) => {
  const sql = `SELECT COUNT(*) as count FROM Medicos WHERE idMedico = ?`;
  const [rows] = await pool.query(sql, [idMedico]);
  return rows[0].count > 0;
};

/**
 * Verifica si existe un producto por ID
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 */
const existsProducto = async (idProducto) => {
  const sql = `SELECT COUNT(*) as count FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0].count > 0;
};

module.exports = {
  findByMedicoId,
  findActivasByClienteDni,
  findById,
  createMultiple,
  marcarComoUsada,
  darBaja,
  reactivar,
  existsCliente,
  existsMedico,
  existsProducto,
};
