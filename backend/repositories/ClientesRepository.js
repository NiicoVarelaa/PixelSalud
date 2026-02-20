const { pool } = require("../config/database");

const findAll = async () => {
  const query = `
    SELECT 
      idCliente, 
      nombreCliente, 
      apellidoCliente, 
      emailCliente, 
      dni, 
      telefono,
      direccion,
      activo, 
      rol 
    FROM Clientes 
    ORDER BY idCliente DESC`;

  const [rows] = await pool.query(query);
  return rows;
};

const findInactivos = async () => {
  const query = `
    SELECT 
      idCliente, 
      nombreCliente, 
      apellidoCliente, 
      emailCliente, 
      dni, 
      telefono,
      direccion,
      activo, 
      rol 
    FROM Clientes 
    WHERE activo = false 
    ORDER BY idCliente DESC`;

  const [rows] = await pool.query(query);
  return rows;
};

const findById = async (idCliente) => {
  const query = `
    SELECT 
      idCliente, 
      nombreCliente, 
      apellidoCliente, 
      emailCliente, 
      dni, 
      telefono,
      direccion,
      activo, 
      rol,
      tokenRecuperacion,
      tokenExpiracion
    FROM Clientes 
    WHERE idCliente = ?`;

  const [results] = await pool.query(query, [idCliente]);
  return results[0] || null;
};

const findByEmail = async (email) => {
  const query = "SELECT * FROM Clientes WHERE emailCliente = ?";
  const [results] = await pool.query(query, [email]);
  return results[0] || null;
};

const findByDNI = async (dni) => {
  const query = `
    SELECT 
      idCliente,
      nombreCliente, 
      apellidoCliente, 
      dni,
      emailCliente,
      telefono,
      direccion,
      activo
    FROM Clientes 
    WHERE dni = ?`;

  const [results] = await pool.query(query, [dni]);
  return results[0] || null;
};

const existsEmailExcept = async (email, excludeId) => {
  const query =
    "SELECT COUNT(*) as count FROM Clientes WHERE emailCliente = ? AND idCliente != ?";
  const [results] = await pool.query(query, [email, excludeId]);
  return results[0].count > 0;
};

const existsByEmail = async (email) => {
  const query = "SELECT COUNT(*) as count FROM Clientes WHERE emailCliente = ?";
  const [results] = await pool.query(query, [email]);
  return results[0].count > 0;
};

const existsByDNI = async (dni) => {
  const query = "SELECT COUNT(*) as count FROM Clientes WHERE dni = ?";
  const [results] = await pool.query(query, [dni]);
  return results[0].count > 0;
};

const create = async (clienteData) => {
  const query = `
    INSERT INTO Clientes 
    (nombreCliente, apellidoCliente, contraCliente, emailCliente, dni, telefono, direccion, rol, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    clienteData.nombreCliente,
    clienteData.apellidoCliente,
    clienteData.contraCliente,
    clienteData.emailCliente,
    clienteData.dni,
    clienteData.telefono || null,
    clienteData.direccion || null,
    clienteData.rol || "cliente",
    clienteData.activo !== undefined ? clienteData.activo : true,
  ];

  const [result] = await pool.query(query, values);
  return result;
};

const update = async (idCliente, updates) => {
  const campos = [];
  const valores = [];

  if (updates.nombreCliente !== undefined) {
    campos.push("nombreCliente = ?");
    valores.push(updates.nombreCliente);
  }
  if (updates.apellidoCliente !== undefined) {
    campos.push("apellidoCliente = ?");
    valores.push(updates.apellidoCliente);
  }
  if (updates.emailCliente !== undefined) {
    campos.push("emailCliente = ?");
    valores.push(updates.emailCliente);
  }
  if (updates.dni !== undefined) {
    campos.push("dni = ?");
    valores.push(updates.dni);
  }
  if (updates.telefono !== undefined) {
    campos.push("telefono = ?");
    valores.push(updates.telefono);
  }
  if (updates.direccion !== undefined) {
    campos.push("direccion = ?");
    valores.push(updates.direccion);
  }
  if (updates.contraCliente !== undefined) {
    campos.push("contraCliente = ?");
    valores.push(updates.contraCliente);
  }

  if (campos.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  const query = `UPDATE Clientes SET ${campos.join(", ")} WHERE idCliente = ?`;
  valores.push(idCliente);

  const [result] = await pool.query(query, valores);
  return result;
};

const updateEstado = async (idCliente, activo) => {
  const query = "UPDATE Clientes SET activo = ? WHERE idCliente = ?";
  const [result] = await pool.query(query, [activo, idCliente]);
  return result;
};

const saveRecoveryToken = async (idCliente, token, expiracion) => {
  const query = `
    UPDATE Clientes 
    SET tokenRecuperacion = ?, tokenExpiracion = ? 
    WHERE idCliente = ?`;

  const [result] = await pool.query(query, [token, expiracion, idCliente]);
  return result;
};

const findByValidToken = async (token) => {
  const query = `
    SELECT * FROM Clientes 
    WHERE tokenRecuperacion = ? 
    AND tokenExpiracion > NOW()`;

  const [results] = await pool.query(query, [token]);
  return results[0] || null;
};

const updatePassword = async (idCliente, nuevaContra) => {
  const query = `
    UPDATE Clientes 
    SET contraCliente = ?, 
        tokenRecuperacion = NULL, 
        tokenExpiracion = NULL 
    WHERE idCliente = ?`;

  const [result] = await pool.query(query, [nuevaContra, idCliente]);
  return result;
};

module.exports = {
  findAll,
  findInactivos,
  findById,
  findByEmail,
  findByDNI,
  existsEmailExcept,
  existsByEmail,
  existsByDNI,
  create,
  update,
  updateEstado,
  saveRecoveryToken,
  findByValidToken,
  updatePassword,
};
