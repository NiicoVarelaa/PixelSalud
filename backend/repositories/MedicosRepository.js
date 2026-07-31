const { pool } = require("../config/database");

const findAll = async () => {
  const sql = `
    SELECT 
      idMedico, 
      nombreMedico, 
      apellidoMedico, 
      matricula, 
      emailMedico, 
      activo 
    FROM Medicos 
    WHERE activo = true
    ORDER BY idMedico DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

const findAllPaginated = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const sql = `
    SELECT 
      idMedico, 
      nombreMedico, 
      apellidoMedico, 
      matricula, 
      emailMedico, 
      activo 
    FROM Medicos 
    WHERE activo = true
    ORDER BY idMedico DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [limit, offset]);
  const [countRows] = await pool.query("SELECT COUNT(*) as total FROM Medicos WHERE activo = true");
  return {
    medicos: rows,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(countRows[0].total / limit),
  };
};

const findInactivos = async () => {
  const sql = `
    SELECT 
      idMedico, 
      nombreMedico, 
      apellidoMedico, 
      matricula, 
      emailMedico, 
      activo 
    FROM Medicos 
    WHERE activo = false
    ORDER BY idMedico DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

const findById = async (idMedico) => {
  const sql = `
    SELECT 
      idMedico, 
      nombreMedico, 
      apellidoMedico, 
      matricula, 
      emailMedico, 
      activo 
    FROM Medicos 
    WHERE idMedico = ?
  `;
  const [results] = await pool.query(sql, [idMedico]);
  return results[0] || null;
};

const findByEmail = async (emailMedico) => {
  const sql = `SELECT * FROM Medicos WHERE emailMedico = ?`;
  const [results] = await pool.query(sql, [emailMedico]);
  return results[0] || null;
};

const findByMatricula = async (matricula) => {
  const sql = `SELECT * FROM Medicos WHERE matricula = ?`;
  const [results] = await pool.query(sql, [matricula]);
  return results[0] || null;
};

const existsEmailExcept = async (emailMedico, excludeId) => {
  const sql = `
    SELECT COUNT(*) as count 
    FROM Medicos 
    WHERE emailMedico = ? AND idMedico != ?
  `;
  const [results] = await pool.query(sql, [emailMedico, excludeId]);
  return results[0].count > 0;
};

const existsMatriculaExcept = async (matricula, excludeId) => {
  const sql = `
    SELECT COUNT(*) as count 
    FROM Medicos 
    WHERE matricula = ? AND idMedico != ?
  `;
  const [results] = await pool.query(sql, [matricula, excludeId]);
  return results[0].count > 0;
};

const create = async (medicoData) => {
  const sql = `
    INSERT INTO Medicos 
    (nombreMedico, apellidoMedico, matricula, emailMedico, contraMedico, activo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    medicoData.nombreMedico,
    medicoData.apellidoMedico,
    medicoData.matricula,
    medicoData.emailMedico,
    medicoData.contraMedico,
    medicoData.activo !== undefined ? medicoData.activo : true,
  ];
  const [result] = await pool.query(sql, values);
  return result.insertId;
};

const update = async (idMedico, updates) => {
  const fields = [];
  const values = [];

  if (updates.nombreMedico !== undefined) {
    fields.push("nombreMedico = ?");
    values.push(updates.nombreMedico);
  }
  if (updates.apellidoMedico !== undefined) {
    fields.push("apellidoMedico = ?");
    values.push(updates.apellidoMedico);
  }
  if (updates.matricula !== undefined) {
    fields.push("matricula = ?");
    values.push(updates.matricula);
  }
  if (updates.emailMedico !== undefined) {
    fields.push("emailMedico = ?");
    values.push(updates.emailMedico);
  }
  if (updates.contraMedico !== undefined) {
    fields.push("contraMedico = ?");
    values.push(updates.contraMedico);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(idMedico);
  const sql = `UPDATE Medicos SET ${fields.join(", ")} WHERE idMedico = ?`;
  await pool.query(sql, values);
};

const darBaja = async (idMedico) => {
  const sql = `UPDATE Medicos SET activo = false WHERE idMedico = ?`;
  await pool.query(sql, [idMedico]);
};

const reactivar = async (idMedico) => {
  const sql = `UPDATE Medicos SET activo = true WHERE idMedico = ?`;
  await pool.query(sql, [idMedico]);
};

module.exports = {
  findAll,
  findAllPaginated,
  findInactivos,
  findById,
  findByEmail,
  findByMatricula,
  existsEmailExcept,
  existsMatriculaExcept,
  create,
  update,
  darBaja,
  reactivar,
};
