const pool = require("../config/database");

/**
 * Obtiene todas las ventas de empleados con detalles
 * @returns {Promise<Array>}
 */
const findAll = async () => {
  const sql = `
    SELECT 
      ve.idVentaE, 
      ve.idEmpleado,
      ve.fechaPago, 
      ve.horaPago, 
      ve.metodoPago, 
      ve.estado,
      ve.totalPago, 
      e.nombreEmpleado, 
      e.apellidoEmpleado, 
      e.dniEmpleado
    FROM VentasEmpleados ve
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    ORDER BY ve.idVentaE DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene las ventas de un empleado específico
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<Array>}
 */
const findByEmpleadoId = async (idEmpleado) => {
  const sql = `
    SELECT 
      ve.idVentaE, 
      ve.fechaPago, 
      ve.horaPago, 
      ve.metodoPago, 
      ve.estado,
      ve.totalPago, 
      e.nombreEmpleado, 
      e.apellidoEmpleado, 
      e.dniEmpleado
    FROM VentasEmpleados ve
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    WHERE e.idEmpleado = ?
    ORDER BY ve.idVentaE DESC
  `;
  const [rows] = await pool.query(sql, [idEmpleado]);
  return rows;
};

/**
 * Obtiene una venta por ID
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Object|null>}
 */
const findById = async (idVentaE) => {
  const sql = `
    SELECT 
      ve.*,
      e.nombreEmpleado,
      e.apellidoEmpleado,
      e.dniEmpleado
    FROM VentasEmpleados ve
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    WHERE ve.idVentaE = ?
  `;
  const [rows] = await pool.query(sql, [idVentaE]);
  return rows[0] || null;
};

/**
 * Obtiene una venta simple por ID (solo datos de VentasEmpleados)
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Object|null>}
 */
const findByIdSimple = async (idVentaE) => {
  const sql = `
    SELECT idVentaE, idEmpleado, totalPago, metodoPago, estado 
    FROM VentasEmpleados 
    WHERE idVentaE = ?
  `;
  const [rows] = await pool.query(sql, [idVentaE]);
  return rows[0] || null;
};

/**
 * Obtiene los detalles de productos de una venta
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Array>}
 */
const findDetallesByVentaId = async (idVentaE) => {
  const sql = `
    SELECT 
      dve.idProducto, 
      p.nombreProducto, 
      dve.cantidad, 
      dve.precioUnitario,
      dve.recetaFisica
    FROM DetalleVentaEmpleado dve
    JOIN Productos p ON dve.idProducto = p.idProducto
    WHERE dve.idVentaE = ?
  `;
  const [rows] = await pool.query(sql, [idVentaE]);
  return rows;
};

/**
 * Obtiene las ventas anuladas
 * @returns {Promise<Array>}
 */
const findAnuladas = async () => {
  const sql = `
    SELECT 
      ve.idVentaE, 
      ve.fechaPago, 
      ve.horaPago, 
      ve.metodoPago, 
      ve.totalPago, 
      ve.estado,
      e.nombreEmpleado, 
      e.apellidoEmpleado, 
      e.dniEmpleado
    FROM VentasEmpleados ve
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    WHERE ve.estado = 'anulada'
    ORDER BY ve.idVentaE DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene las ventas completadas
 * @returns {Promise<Array>}
 */
const findCompletadas = async () => {
  const sql = `
    SELECT 
      ve.idVentaE, 
      ve.fechaPago, 
      ve.horaPago, 
      ve.metodoPago, 
      ve.totalPago, 
      ve.estado,
      e.nombreEmpleado, 
      e.apellidoEmpleado, 
      e.dniEmpleado
    FROM VentasEmpleados ve
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    WHERE ve.estado = 'completada'
    ORDER BY ve.idVentaE DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Crea una venta de empleado
 * @param {Object} ventaData - Datos de la venta
 * @returns {Promise<number>} - ID de la venta creada
 */
const create = async (ventaData) => {
  const { idEmpleado, totalPago, metodoPago, estado } = ventaData;

  const sql = `
    INSERT INTO VentasEmpleados (idEmpleado, totalPago, metodoPago, estado)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    idEmpleado,
    totalPago,
    metodoPago,
    estado || "completada",
  ]);

  return result.insertId;
};

/**
 * Crea un detalle de venta de empleado
 * @param {number} idVentaE - ID de la venta
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad del producto
 * @param {number} precioUnitario - Precio unitario del producto
 * @param {string|null} recetaFisica - Referencia de receta física si aplica
 * @returns {Promise<void>}
 */
const createDetalle = async (
  idVentaE,
  idProducto,
  cantidad,
  precioUnitario,
  recetaFisica = null,
) => {
  const sql = `
    INSERT INTO DetalleVentaEmpleado (idVentaE, idProducto, cantidad, precioUnitario, recetaFisica)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.query(sql, [
    idVentaE,
    idProducto,
    cantidad,
    precioUnitario,
    recetaFisica,
  ]);
};

/**
 * Actualiza una venta de empleado
 * @param {number} idVentaE - ID de la venta
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<void>}
 */
const update = async (idVentaE, updateData) => {
  const { totalPago, metodoPago, idEmpleado } = updateData;

  const sql = `
    UPDATE VentasEmpleados 
    SET totalPago = ?, metodoPago = ?, idEmpleado = ?
    WHERE idVentaE = ?
  `;

  await pool.query(sql, [totalPago, metodoPago, idEmpleado, idVentaE]);
};

/**
 * Actualiza el estado de una venta
 * @param {number} idVentaE - ID de la venta
 * @param {string} estado - Nuevo estado
 * @returns {Promise<void>}
 */
const updateEstado = async (idVentaE, estado) => {
  const sql = `UPDATE VentasEmpleados SET estado = ? WHERE idVentaE = ?`;
  await pool.query(sql, [estado, idVentaE]);
};

/**
 * Elimina todos los detalles de una venta
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<void>}
 */
const deleteDetalles = async (idVentaE) => {
  const sql = `DELETE FROM DetalleVentaEmpleado WHERE idVentaE = ?`;
  await pool.query(sql, [idVentaE]);
};

/**
 * Obtiene el stock y nombre de un producto
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object|null>} - {stock, nombreProducto}
 */
const getProductoStockYNombre = async (idProducto) => {
  const sql = `SELECT stock, nombreProducto FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] || null;
};

/**
 * Obtiene el stock de un producto
 * @param {number} idProducto - ID del producto
 * @returns {Promise<number|null>}
 */
const getProductoStock = async (idProducto) => {
  const sql = `SELECT stock FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] ? rows[0].stock : null;
};

/**
 * Actualiza el stock de un producto (resta)
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad a restar
 * @returns {Promise<void>}
 */
const updateStockRestar = async (idProducto, cantidad) => {
  const sql = `UPDATE Productos SET stock = stock - ? WHERE idProducto = ?`;
  await pool.query(sql, [cantidad, idProducto]);
};

/**
 * Actualiza el stock de un producto (suma)
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad a sumar
 * @returns {Promise<void>}
 */
const updateStockSumar = async (idProducto, cantidad) => {
  const sql = `UPDATE Productos SET stock = stock + ? WHERE idProducto = ?`;
  await pool.query(sql, [cantidad, idProducto]);
};

/**
 * Verifica si existe un empleado por ID
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<boolean>}
 */
const existsEmpleado = async (idEmpleado) => {
  const sql = `SELECT COUNT(*) as count FROM Empleados WHERE idEmpleado = ?`;
  const [rows] = await pool.query(sql, [idEmpleado]);
  return rows[0].count > 0;
};

module.exports = {
  findAll,
  findByEmpleadoId,
  findById,
  findByIdSimple,
  findDetallesByVentaId,
  findAnuladas,
  findCompletadas,
  create,
  createDetalle,
  update,
  updateEstado,
  deleteDetalles,
  getProductoStockYNombre,
  getProductoStock,
  updateStockRestar,
  updateStockSumar,
  existsEmpleado,
};
