const { pool } = require("../config/database");

/**
 * Repository para la tabla Empleados
 * Maneja acceso a datos de empleados y su relación con Permisos
 */

/**
 * Obtiene todos los empleados activos con sus permisos
 * @returns {Promise<Array>}
 */
const findAllWithPermisos = async () => {
  const sql = `
    SELECT e.*, 
           p.crear_productos, 
           p.modificar_productos, 
           p.modificar_ventasE, 
           p.ver_ventasTotalesE 
    FROM Empleados e
    LEFT JOIN Permisos p ON e.idEmpleado = p.idEmpleado
    WHERE e.activo = true
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene empleados inactivos
 * @returns {Promise<Array>}
 */
const findInactivos = async () => {
  const sql = `SELECT * FROM Empleados WHERE activo = false`;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Busca empleado por ID con permisos
 * @param {number} idEmpleado
 * @returns {Promise<Object|null>}
 */
const findByIdWithPermisos = async (idEmpleado) => {
  const sql = `
    SELECT e.*, 
           p.crear_productos, 
           p.modificar_productos, 
           p.modificar_ventasE, 
           p.ver_ventasTotalesE 
    FROM Empleados e
    LEFT JOIN Permisos p ON e.idEmpleado = p.idEmpleado
    WHERE e.idEmpleado = ?
  `;
  const [results] = await pool.query(sql, [idEmpleado]);
  return results[0] || null;
};

/**
 * Busca empleado por email
 * @param {string} emailEmpleado
 * @returns {Promise<Object|null>}
 */
const findByEmail = async (emailEmpleado) => {
  const sql = `SELECT * FROM Empleados WHERE emailEmpleado = ?`;
  const [results] = await pool.query(sql, [emailEmpleado]);
  return results[0] || null;
};

/**
 * Busca empleado por DNI
 * @param {string} dniEmpleado
 * @returns {Promise<Object|null>}
 */
const findByDNI = async (dniEmpleado) => {
  const sql = `SELECT * FROM Empleados WHERE dniEmpleado = ?`;
  const [results] = await pool.query(sql, [dniEmpleado]);
  return results[0] || null;
};

/**
 * Verifica si existe un email excluyendo un ID específico
 * @param {string} emailEmpleado
 * @param {number} excludeId
 * @returns {Promise<boolean>}
 */
const existsEmailExcept = async (emailEmpleado, excludeId) => {
  const sql = `SELECT COUNT(*) as count FROM Empleados WHERE emailEmpleado = ? AND idEmpleado != ?`;
  const [results] = await pool.query(sql, [emailEmpleado, excludeId]);
  return results[0].count > 0;
};

/**
 * Verifica si existe un DNI excluyendo un ID específico
 * @param {string} dniEmpleado
 * @param {number} excludeId
 * @returns {Promise<boolean>}
 */
const existsDNIExcept = async (dniEmpleado, excludeId) => {
  const sql = `SELECT COUNT(*) as count FROM Empleados WHERE dniEmpleado = ? AND idEmpleado != ?`;
  const [results] = await pool.query(sql, [dniEmpleado, excludeId]);
  return results[0].count > 0;
};

/**
 * Crea un nuevo empleado
 * @param {Object} empleadoData
 * @returns {Promise<number>} ID del empleado creado
 */
const create = async (empleadoData) => {
  const sql = `
    INSERT INTO Empleados 
    (nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, contraEmpleado, activo) 
    VALUES (?, ?, ?, ?, ?, 1)
  `;
  const [result] = await pool.query(sql, [
    empleadoData.nombreEmpleado,
    empleadoData.apellidoEmpleado,
    empleadoData.dniEmpleado,
    empleadoData.emailEmpleado,
    empleadoData.contraEmpleado,
  ]);
  return result.insertId;
};

/**
 * Actualiza un empleado (con o sin contraseña)
 * @param {number} idEmpleado
 * @param {Object} empleadoData
 * @returns {Promise<void>}
 */
const update = async (idEmpleado, empleadoData) => {
  const campos = [];
  const valores = [];

  if (empleadoData.nombreEmpleado !== undefined) {
    campos.push("nombreEmpleado = ?");
    valores.push(empleadoData.nombreEmpleado);
  }
  if (empleadoData.apellidoEmpleado !== undefined) {
    campos.push("apellidoEmpleado = ?");
    valores.push(empleadoData.apellidoEmpleado);
  }
  if (empleadoData.dniEmpleado !== undefined) {
    campos.push("dniEmpleado = ?");
    valores.push(empleadoData.dniEmpleado);
  }
  if (empleadoData.emailEmpleado !== undefined) {
    campos.push("emailEmpleado = ?");
    valores.push(empleadoData.emailEmpleado);
  }
  if (empleadoData.contraEmpleado !== undefined) {
    campos.push("contraEmpleado = ?");
    valores.push(empleadoData.contraEmpleado);
  }

  if (campos.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  valores.push(idEmpleado);
  const sql = `UPDATE Empleados SET ${campos.join(", ")} WHERE idEmpleado = ?`;
  await pool.query(sql, valores);
};

/**
 * Actualiza el estado activo de un empleado
 * @param {number} idEmpleado
 * @param {boolean} activo
 * @returns {Promise<void>}
 */
const updateEstado = async (idEmpleado, activo) => {
  const sql = `UPDATE Empleados SET activo = ? WHERE idEmpleado = ?`;
  await pool.query(sql, [activo ? 1 : 0, idEmpleado]);
};

/**
 * Crea permisos para un empleado
 * @param {number} idEmpleado
 * @param {Object} permisos
 * @returns {Promise<void>}
 */
const createPermisos = async (idEmpleado, permisos) => {
  const sql = `
    INSERT INTO Permisos 
    (idEmpleado, crear_productos, modificar_productos, modificar_ventasE, ver_ventasTotalesE) 
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.query(sql, [
    idEmpleado,
    permisos.crear_productos ? 1 : 0,
    permisos.modificar_productos ? 1 : 0,
    permisos.modificar_ventasE ? 1 : 0,
    permisos.ver_ventasTotalesE ? 1 : 0,
  ]);
};

/**
 * Actualiza permisos de un empleado
 * @param {number} idEmpleado
 * @param {Object} permisos
 * @returns {Promise<void>}
 */
const updatePermisos = async (idEmpleado, permisos) => {
  const sql = `
    UPDATE Permisos SET 
      crear_productos = ?, 
      modificar_productos = ?, 
      modificar_ventasE = ?, 
      ver_ventasTotalesE = ?
    WHERE idEmpleado = ?
  `;
  await pool.query(sql, [
    permisos.crear_productos ? 1 : 0,
    permisos.modificar_productos ? 1 : 0,
    permisos.modificar_ventasE ? 1 : 0,
    permisos.ver_ventasTotalesE ? 1 : 0,
    idEmpleado,
  ]);
};

/**
 * Verifica si existen permisos para un empleado
 * @param {number} idEmpleado
 * @returns {Promise<boolean>}
 */
const existsPermisos = async (idEmpleado) => {
  const sql = `SELECT COUNT(*) as count FROM Permisos WHERE idEmpleado = ?`;
  const [results] = await pool.query(sql, [idEmpleado]);
  return results[0].count > 0;
};

module.exports = {
  findAllWithPermisos,
  findInactivos,
  findByIdWithPermisos,
  findByEmail,
  findByDNI,
  existsEmailExcept,
  existsDNIExcept,
  create,
  update,
  updateEstado,
  createPermisos,
  updatePermisos,
  existsPermisos,
};
