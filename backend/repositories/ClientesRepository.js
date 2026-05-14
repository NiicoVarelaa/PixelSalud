const { pool } = require("../config/database");

const findAll = async () => {
  const query = `
    SELECT 
      c.idCliente,
      c.nombreCliente,
      c.apellidoCliente,
      c.emailCliente,
      c.dni,
      c.fechaNacimiento,
      c.telefono,
      c.direccion,
      c.fecha_registro,
      c.activo,
      c.rol,
      COALESCE(v.totalCompras, 0) AS totalCompras,
      COALESCE(v.totalGastado, 0) AS totalGastado,
      v.ultimaCompra
    FROM Clientes c
    LEFT JOIN (
      SELECT
        idCliente,
        COUNT(*) AS totalCompras,
        SUM(totalPago) AS totalGastado,
        MAX(fechaPago) AS ultimaCompra
      FROM VentasOnlines
      WHERE estado = 'retirado'
      GROUP BY idCliente
    ) v ON c.idCliente = v.idCliente
    ORDER BY c.idCliente DESC`;

  const [rows] = await pool.query(query);
  return rows;
};

const findAllPaginated = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT 
      c.idCliente,
      c.nombreCliente,
      c.apellidoCliente,
      c.emailCliente,
      c.dni,
      c.fechaNacimiento,
      c.telefono,
      c.direccion,
      c.fecha_registro,
      c.activo,
      c.rol,
      COALESCE(v.totalCompras, 0) AS totalCompras,
      COALESCE(v.totalGastado, 0) AS totalGastado,
      v.ultimaCompra
    FROM Clientes c
    LEFT JOIN (
      SELECT
        idCliente,
        COUNT(*) AS totalCompras,
        SUM(totalPago) AS totalGastado,
        MAX(fechaPago) AS ultimaCompra
      FROM VentasOnlines
      WHERE estado = 'retirado'
      GROUP BY idCliente
    ) v ON c.idCliente = v.idCliente
    ORDER BY c.idCliente DESC
    LIMIT ? OFFSET ?`;

  const [rows] = await pool.query(query, [limit, offset]);

  const [countRows] = await pool.query("SELECT COUNT(*) as total FROM Clientes");

  return {
    clientes: rows,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(countRows[0].total / limit),
  };
};

const findInactivos = async () => {
  const query = `
    SELECT 
      idCliente, 
      nombreCliente, 
      apellidoCliente, 
      emailCliente, 
      dni, 
      fechaNacimiento,
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
      fechaNacimiento,
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
      fechaNacimiento,
      emailCliente,
      telefono,
      direccion,
      activo
    FROM Clientes 
    WHERE dni = ?`;

  const [results] = await pool.query(query, [dni]);
  return results[0] || null;
};

const findActivosConEmail = async () => {
  const query = `
    SELECT idCliente, nombreCliente, apellidoCliente, emailCliente
    FROM Clientes
    WHERE activo = true
      AND emailCliente IS NOT NULL
      AND emailCliente != ''
    ORDER BY idCliente DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
};

const findActivosByIdsConEmail = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  const placeholders = ids.map(() => "?").join(", ");
  const query = `
    SELECT idCliente, nombreCliente, apellidoCliente, emailCliente
    FROM Clientes
    WHERE activo = true
      AND emailCliente IS NOT NULL
      AND emailCliente != ''
      AND idCliente IN (${placeholders})
    ORDER BY idCliente DESC
  `;

  const [rows] = await pool.query(query, ids);
  return rows;
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
    (nombreCliente, apellidoCliente, contraCliente, emailCliente, dni, fechaNacimiento, telefono, direccion, rol, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    clienteData.nombreCliente,
    clienteData.apellidoCliente,
    clienteData.contraCliente,
    clienteData.emailCliente,
    clienteData.dni,
    clienteData.fechaNacimiento || null,
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
  if (updates.fechaNacimiento !== undefined) {
    campos.push("fechaNacimiento = ?");
    valores.push(updates.fechaNacimiento);
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

const findDireccionesByClienteId = async (idCliente) => {
  const query = `
    SELECT
      idDireccion,
      idCliente,
      alias,
      pais,
      calle,
      numero,
      piso,
      departamento,
      localidad,
      provincia,
      codigoPostal,
      referencias,
      esPredeterminada,
      fechaCreacion
    FROM DireccionesClientes
    WHERE idCliente = ?
    ORDER BY esPredeterminada DESC, fechaCreacion DESC, idDireccion DESC`;

  const [rows] = await pool.query(query, [idCliente]);
  return rows;
};

const findDireccionByIdAndCliente = async (idCliente, idDireccion) => {
  const query = `
    SELECT
      idDireccion,
      idCliente,
      alias,
      pais,
      calle,
      numero,
      piso,
      departamento,
      localidad,
      provincia,
      codigoPostal,
      referencias,
      esPredeterminada,
      fechaCreacion
    FROM DireccionesClientes
    WHERE idCliente = ? AND idDireccion = ?`;

  const [rows] = await pool.query(query, [idCliente, idDireccion]);
  return rows[0] || null;
};

const findDireccionPredeterminadaByClienteId = async (idCliente) => {
  const query = `
    SELECT
      idDireccion,
      idCliente,
      alias,
      pais,
      calle,
      numero,
      piso,
      departamento,
      localidad,
      provincia,
      codigoPostal,
      referencias,
      esPredeterminada,
      fechaCreacion
    FROM DireccionesClientes
    WHERE idCliente = ? AND esPredeterminada = true
    LIMIT 1`;

  const [rows] = await pool.query(query, [idCliente]);
  return rows[0] || null;
};

const countDireccionesByClienteId = async (idCliente) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM DireccionesClientes
    WHERE idCliente = ?`;

  const [rows] = await pool.query(query, [idCliente]);
  return rows[0]?.total || 0;
};

const createDireccionCliente = async (direccionData) => {
  const query = `
    INSERT INTO DireccionesClientes
    (idCliente, alias, pais, calle, numero, piso, departamento, localidad, provincia, codigoPostal, referencias, esPredeterminada)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    direccionData.idCliente,
    direccionData.alias,
    direccionData.pais,
    direccionData.calle,
    direccionData.numero,
    direccionData.piso || null,
    direccionData.departamento || null,
    direccionData.localidad,
    direccionData.provincia,
    direccionData.codigoPostal,
    direccionData.referencias || null,
    direccionData.esPredeterminada === true,
  ];

  const [result] = await pool.query(query, values);
  return result;
};

const updateDireccionCliente = async (idCliente, idDireccion, updates) => {
  const campos = [];
  const valores = [];

  const camposPermitidos = [
    "alias",
    "pais",
    "calle",
    "numero",
    "piso",
    "departamento",
    "localidad",
    "provincia",
    "codigoPostal",
    "referencias",
    "esPredeterminada",
  ];

  for (const campo of camposPermitidos) {
    if (updates[campo] !== undefined) {
      campos.push(`${campo} = ?`);
      valores.push(updates[campo]);
    }
  }

  if (campos.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  const query = `
    UPDATE DireccionesClientes
    SET ${campos.join(", ")}
    WHERE idCliente = ? AND idDireccion = ?`;

  valores.push(idCliente, idDireccion);
  const [result] = await pool.query(query, valores);
  return result;
};

const clearDireccionPredeterminadaByClienteId = async (idCliente) => {
  const query = `
    UPDATE DireccionesClientes
    SET esPredeterminada = false
    WHERE idCliente = ?`;

  const [result] = await pool.query(query, [idCliente]);
  return result;
};

const setDireccionPredeterminada = async (idCliente, idDireccion) => {
  const query = `
    UPDATE DireccionesClientes
    SET esPredeterminada = true
    WHERE idCliente = ? AND idDireccion = ?`;

  const [result] = await pool.query(query, [idCliente, idDireccion]);
  return result;
};

const deleteDireccionCliente = async (idCliente, idDireccion) => {
  const query = `
    DELETE FROM DireccionesClientes
    WHERE idDireccion = ? AND idCliente = ?`;

  const [result] = await pool.query(query, [idDireccion, idCliente]);
  return result;
};

module.exports = {
  findAll,
  findAllPaginated,
  findInactivos,
  findById,
  findByEmail,
  findByDNI,
  findActivosConEmail,
  findActivosByIdsConEmail,
  existsEmailExcept,
  existsByEmail,
  existsByDNI,
  create,
  update,
  updateEstado,
  saveRecoveryToken,
  findByValidToken,
  updatePassword,
  findDireccionesByClienteId,
  findDireccionByIdAndCliente,
  findDireccionPredeterminadaByClienteId,
  countDireccionesByClienteId,
  createDireccionCliente,
  updateDireccionCliente,
  clearDireccionPredeterminadaByClienteId,
  setDireccionPredeterminada,
  deleteDireccionCliente,
};
