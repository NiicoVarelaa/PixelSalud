const pool = require("../config/database");

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

const createMultiple = async (recetas) => {
  const sql = `
    INSERT INTO Recetas (dniCliente, idMedico, idProducto, cantidad, fechaEmision)
    VALUES ?
  `;
  const [result] = await pool.query(sql, [recetas]);
  return result.affectedRows;
};

const marcarComoUsada = async (idReceta) => {
  const sql = `UPDATE Recetas SET usada = true WHERE idReceta = ?`;
  await pool.query(sql, [idReceta]);
};

const darBaja = async (idReceta) => {
  const sql = `UPDATE Recetas SET activo = false WHERE idReceta = ?`;
  await pool.query(sql, [idReceta]);
};

const reactivar = async (idReceta) => {
  const sql = `UPDATE Recetas SET activo = true WHERE idReceta = ?`;
  await pool.query(sql, [idReceta]);
};

const existsCliente = async (dni) => {
  const sql = `SELECT COUNT(*) as count FROM Clientes WHERE dni = ?`;
  const [rows] = await pool.query(sql, [dni]);
  return rows[0].count > 0;
};

const existsMedico = async (idMedico) => {
  const sql = `SELECT COUNT(*) as count FROM Medicos WHERE idMedico = ?`;
  const [rows] = await pool.query(sql, [idMedico]);
  return rows[0].count > 0;
};

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
