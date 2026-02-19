const { pool } = require("../config/database");

// ========================================
// CRUD CUPONES
// ========================================

/**
 * Crear un nuevo cupón
 * @param {Object} cuponData - Datos del cupón
 * @returns {Promise<number>} - ID del cupón creado
 */
const create = async (cuponData) => {
  const {
    codigo,
    tipoCupon,
    valorDescuento,
    descripcion,
    fechaInicio,
    fechaVencimiento,
    usoMaximo = 1,
    tipoUsuario = "todos",
    montoMinimo = 0,
    creadoPor = null,
  } = cuponData;

  const query = `
    INSERT INTO Cupones (
      codigo, tipoCupon, valorDescuento, descripcion,
      fechaInicio, fechaVencimiento, usoMaximo, tipoUsuario,
      montoMinimo, creadoPor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    codigo,
    tipoCupon,
    valorDescuento,
    descripcion,
    fechaInicio,
    fechaVencimiento,
    usoMaximo,
    tipoUsuario,
    montoMinimo,
    creadoPor,
  ]);

  return result.insertId;
};

/**
 * Buscar cupón por código
 * @param {string} codigo - Código del cupón
 * @returns {Promise<Object|null>}
 */
const findByCodigo = async (codigo) => {
  const query = `
    SELECT * FROM Cupones
    WHERE codigo = ?
  `;

  const [rows] = await pool.query(query, [codigo]);
  return rows[0] || null;
};

/**
 * Buscar cupón por ID
 * @param {number} idCupon - ID del cupón
 * @returns {Promise<Object|null>}
 */
const findById = async (idCupon) => {
  const query = `SELECT * FROM Cupones WHERE idCupon = ?`;
  const [rows] = await pool.query(query, [idCupon]);
  return rows[0] || null;
};

/**
 * Listar todos los cupones activos
 * @returns {Promise<Array>}
 */
const findAllActivos = async () => {
  const query = `
    SELECT * FROM CuponesActivos
    ORDER BY fechaCreacion DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Listar todos los cupones (admin)
 * @returns {Promise<Array>}
 */
const findAll = async () => {
  const query = `
    SELECT 
      *,
      (usoMaximo - vecesUsado) AS usosDisponibles,
      CASE 
        WHEN CURDATE() > fechaVencimiento THEN 'expirado'
        WHEN vecesUsado >= usoMaximo THEN 'agotado'
        ELSE estado
      END AS estadoCalculado
    FROM Cupones
    ORDER BY fechaCreacion DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Validar si un cupón es aplicable
 * @param {string} codigo - Código del cupón
 * @param {number} idCliente - ID del cliente
 * @param {number} montoCompra - Monto de la compra
 * @returns {Promise<Object>} - { valido, mensaje, cupon }
 */
const validarCupon = async (codigo, idCliente, montoCompra) => {
  const cupon = await findByCodigo(codigo);

  if (!cupon) {
    return { valido: false, mensaje: "Cupón no encontrado", cupon: null };
  }

  if (cupon.estado !== "activo") {
    return { valido: false, mensaje: "Cupón inactivo", cupon: null };
  }

  const hoy = new Date();
  const fechaInicio = new Date(cupon.fechaInicio);
  const fechaVencimiento = new Date(cupon.fechaVencimiento);

  if (hoy < fechaInicio) {
    return {
      valido: false,
      mensaje: "Cupón aún no disponible",
      cupon: null,
    };
  }

  if (hoy > fechaVencimiento) {
    return { valido: false, mensaje: "Cupón vencido", cupon: null };
  }

  if (cupon.vecesUsado >= cupon.usoMaximo) {
    return { valido: false, mensaje: "Cupón agotado", cupon: null };
  }

  if (montoCompra < cupon.montoMinimo) {
    return {
      valido: false,
      mensaje: `Monto mínimo de compra: $${cupon.montoMinimo}`,
      cupon: null,
    };
  }

  if (cupon.tipoUsuario === "nuevo") {
    const esPrimeraCompra = await verificarPrimeraCompra(idCliente);
    if (!esPrimeraCompra) {
      return {
        valido: false,
        mensaje: "Cupón solo para nuevos usuarios",
        cupon: null,
      };
    }
  }

  const yaUso = await verificarUsoCliente(cupon.idCupon, idCliente);
  if (yaUso) {
    return { valido: false, mensaje: "Ya usaste este cupón", cupon: null };
  }

  return { valido: true, mensaje: "Cupón válido", cupon };
};

/**
 * Verificar si es la primera compra del cliente
 * @param {number} idCliente
 * @returns {Promise<boolean>}
 */
const verificarPrimeraCompra = async (idCliente) => {
  const query = `
    SELECT COUNT(*) AS totalCompras
    FROM VentasOnlines
    WHERE idCliente = ? AND estado IN ('retirado', 'entregado')
  `;

  const [rows] = await pool.query(query, [idCliente]);
  return rows[0].totalCompras === 0;
};

/**
 * Verificar si el cliente ya usó un cupón
 * @param {number} idCupon
 * @param {number} idCliente
 * @returns {Promise<boolean>}
 */
const verificarUsoCliente = async (idCupon, idCliente) => {
  const query = `
    SELECT COUNT(*) AS veces
    FROM CuponesUsados
    WHERE idCupon = ? AND idCliente = ?
  `;

  const [rows] = await pool.query(query, [idCupon, idCliente]);
  return rows[0].veces > 0;
};

/**
 * Incrementar contador de usos
 * @param {number} idCupon
 * @returns {Promise<boolean>}
 */
const incrementarUso = async (idCupon) => {
  const query = `
    UPDATE Cupones
    SET vecesUsado = vecesUsado + 1
    WHERE idCupon = ?
  `;

  const [result] = await pool.query(query, [idCupon]);
  return result.affectedRows > 0;
};

/**
 * Registrar uso de cupón
 * @param {Object} usoData
 * @returns {Promise<number>}
 */
const registrarUso = async (usoData) => {
  const {
    idCupon,
    idCliente,
    idVentaO,
    montoDescuento,
    montoOriginal,
    montoFinal,
  } = usoData;

  const query = `
    INSERT INTO CuponesUsados (
      idCupon, idCliente, idVentaO, montoDescuento, montoOriginal, montoFinal
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    idCupon,
    idCliente,
    idVentaO,
    montoDescuento,
    montoOriginal,
    montoFinal,
  ]);

  return result.insertId;
};

/**
 * Obtener historial de uso de cupones por cliente
 * @param {number} idCliente
 * @returns {Promise<Array>}
 */
const obtenerHistorialCliente = async (idCliente) => {
  const query = `
    SELECT * FROM CuponesUsadosDetalle
    WHERE idCliente = ?
    ORDER BY fechaUso DESC
  `;

  const [rows] = await pool.query(query, [idCliente]);
  return rows;
};

/**
 * Obtener todo el historial de uso de cupones (admin)
 * @returns {Promise<Array>}
 */
const obtenerTodoHistorial = async () => {
  const query = `
    SELECT * FROM CuponesUsadosDetalle
    ORDER BY fechaUso DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Actualizar estado de cupón
 * @param {number} idCupon
 * @param {string} estado - 'activo' | 'inactivo' | 'expirado'
 * @returns {Promise<boolean>}
 */
const updateEstado = async (idCupon, estado) => {
  const query = `UPDATE Cupones SET estado = ? WHERE idCupon = ?`;
  const [result] = await pool.query(query, [estado, idCupon]);
  return result.affectedRows > 0;
};

/**
 * Eliminar cupón (solo si no fue usado)
 * @param {number} idCupon
 * @returns {Promise<boolean>}
 */
const deleteCupon = async (idCupon) => {
  // Verificar que no haya sido usado
  const query = `
    DELETE FROM Cupones
    WHERE idCupon = ? AND vecesUsado = 0
  `;

  const [result] = await pool.query(query, [idCupon]);
  return result.affectedRows > 0;
};

// ========================================
// MÉTODOS TRANSACCIONALES
// ========================================

/**
 * Aplicar cupón dentro de una transacción
 * @param {Object} connection - Conexión de la transacción
 * @param {Object} data - { idCupon, idCliente, idVentaO, montoDescuento, montoOriginal, montoFinal }
 * @returns {Promise<void>}
 */
const aplicarCuponTx = async (connection, data) => {
  const {
    idCupon,
    idCliente,
    idVentaO,
    montoDescuento,
    montoOriginal,
    montoFinal,
  } = data;

  // 1. Registrar uso
  await connection.query(
    `INSERT INTO CuponesUsados (
      idCupon, idCliente, idVentaO, montoDescuento, montoOriginal, montoFinal
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [idCupon, idCliente, idVentaO, montoDescuento, montoOriginal, montoFinal],
  );

  // 2. Incrementar contador
  await connection.query(
    `UPDATE Cupones SET vecesUsado = vecesUsado + 1 WHERE idCupon = ?`,
    [idCupon],
  );
};

module.exports = {
  create,
  findByCodigo,
  findById,
  findAllActivos,
  findAll,
  validarCupon,
  verificarPrimeraCompra,
  verificarUsoCliente,
  incrementarUso,
  registrarUso,
  obtenerHistorialCliente,
  obtenerTodoHistorial,
  updateEstado,
  deleteCupon,
  // Transaccional
  aplicarCuponTx,
};
