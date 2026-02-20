const { pool } = require("../config/database");

const findUserByEmail = async (email) => {
  const sqlAdmin = `
    SELECT idAdmin AS id, nombreAdmin AS nombre, 
           emailAdmin AS email, contraAdmin AS contra, rol, 'admin' as tipo
    FROM Admins WHERE emailAdmin = ? AND activo = TRUE
  `;
  const [admins] = await pool.query(sqlAdmin, [email]);
  if (admins.length > 0) {
    return { user: admins[0], tipo: "admin" };
  }

  const sqlMedico = `
    SELECT idMedico AS id, nombreMedico AS nombre, apellidoMedico AS apellido, 
           emailMedico AS email, contraMedico AS contra, 'medico' as rol, 'medico' as tipo
    FROM Medicos WHERE emailMedico = ?
  `;
  const [medicos] = await pool.query(sqlMedico, [email]);
  if (medicos.length > 0) {
    return { user: medicos[0], tipo: "medico" };
  }

  const sqlEmpleado = `
    SELECT idEmpleado AS id, nombreEmpleado AS nombre, apellidoEmpleado AS apellido, 
           emailEmpleado AS email, contraEmpleado AS contra, rol, 'empleado' as tipo
    FROM Empleados WHERE emailEmpleado = ? AND activo = TRUE
  `;
  const [empleados] = await pool.query(sqlEmpleado, [email]);
  if (empleados.length > 0) {
    return { user: empleados[0], tipo: "empleado" };
  }

  const sqlCliente = `
    SELECT idCliente AS id, nombreCliente AS nombre, apellidoCliente AS apellido, 
           emailCliente AS email, contraCliente AS contra, rol, dni, 'cliente' as tipo
    FROM Clientes WHERE emailCliente = ?
  `;
  const [clientes] = await pool.query(sqlCliente, [email]);
  if (clientes.length > 0) {
    return { user: clientes[0], tipo: "cliente" };
  }

  return { user: null, tipo: null };
};

const findPermisosByAdmin = async (idAdmin) => {
  const sql = "SELECT * FROM Permisos WHERE idAdmin = ? AND idEmpleado IS NULL";
  const [results] = await pool.query(sql, [idAdmin]);
  return results[0] || null;
};

const findPermisosByEmpleado = async (idEmpleado) => {
  const sql = "SELECT * FROM Permisos WHERE idEmpleado = ? AND idAdmin IS NULL";
  const [results] = await pool.query(sql, [idEmpleado]);
  return results[0] || null;
};

module.exports = {
  findUserByEmail,
  findPermisosByAdmin,
  findPermisosByEmpleado,
};
