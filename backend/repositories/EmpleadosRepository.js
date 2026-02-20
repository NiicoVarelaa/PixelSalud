const { pool } = require("../config/database");

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

const findInactivos = async () => {
  const sql = `SELECT * FROM Empleados WHERE activo = false`;
  const [rows] = await pool.query(sql);
  return rows;
};

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

const findByEmail = async (emailEmpleado) => {
  const sql = `SELECT * FROM Empleados WHERE emailEmpleado = ?`;
  const [results] = await pool.query(sql, [emailEmpleado]);
  return results[0] || null;
};

const findByDNI = async (dniEmpleado) => {
  const sql = `SELECT * FROM Empleados WHERE dniEmpleado = ?`;
  const [results] = await pool.query(sql, [dniEmpleado]);
  return results[0] || null;
};

const existsEmailExcept = async (emailEmpleado, excludeId) => {
  const sql = `SELECT COUNT(*) as count FROM Empleados WHERE emailEmpleado = ? AND idEmpleado != ?`;
  const [results] = await pool.query(sql, [emailEmpleado, excludeId]);
  return results[0].count > 0;
};

const existsDNIExcept = async (dniEmpleado, excludeId) => {
  const sql = `SELECT COUNT(*) as count FROM Empleados WHERE dniEmpleado = ? AND idEmpleado != ?`;
  const [results] = await pool.query(sql, [dniEmpleado, excludeId]);
  return results[0].count > 0;
};

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

const updateEstado = async (idEmpleado, activo) => {
  const sql = `UPDATE Empleados SET activo = ? WHERE idEmpleado = ?`;
  await pool.query(sql, [activo ? 1 : 0, idEmpleado]);
};

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
