const { pool } = require("../config/database");

/**
 * Obtiene todas las ventas online de un cliente con detalles de productos
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Array>}
 */
const findByClienteId = async (idCliente) => {
  const sql = `
    SELECT 
      v.idVentaO, 
      v.fechaPago, 
      v.horaPago, 
      v.metodoPago, 
      v.totalPago, 
      v.estado,
      p.nombreProducto, 
      p.img, 
      d.cantidad, 
      d.precioUnitario
    FROM VentasOnlines v
    JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
    JOIN Productos p ON d.idProducto = p.idProducto
    WHERE v.idCliente = ?
    ORDER BY v.idVentaO DESC
  `;
  const [rows] = await pool.query(sql, [idCliente]);
  return rows;
};

/**
 * Obtiene todas las ventas online con detalles de clientes y productos
 * @returns {Promise<Array>}
 */
const findAll = async () => {
  const sql = `
    SELECT 
      v.idVentaO, 
      v.fechaPago, 
      v.horaPago, 
      v.metodoPago, 
      v.estado,
      v.tipoEntrega,
      c.nombreCliente, 
      c.apellidoCliente, 
      c.dni,
      p.nombreProducto, 
      d.cantidad, 
      d.precioUnitario, 
      v.totalPago
    FROM VentasOnlines v
    JOIN Clientes c ON v.idCliente = c.idCliente
    JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
    JOIN Productos p ON d.idProducto = p.idProducto
    ORDER BY v.idVentaO DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene una venta online por ID con todos los detalles
 * @param {number} idVentaO - ID de la venta online
 * @returns {Promise<Object|null>}
 */
const findById = async (idVentaO) => {
  const sql = `
    SELECT 
      v.*,
      c.nombreCliente,
      c.apellidoCliente,
      c.dni as dniCliente,
      de.direccion,
      de.ciudad,
      de.provincia
    FROM VentasOnlines v
    JOIN Clientes c ON v.idCliente = c.idCliente
    LEFT JOIN DireccionesEnvio de ON v.idDireccion = de.idDireccion
    WHERE v.idVentaO = ?
  `;
  const [rows] = await pool.query(sql, [idVentaO]);
  return rows[0] || null;
};

/**
 * Obtiene los detalles de productos de una venta online
 * @param {number} idVentaO - ID de la venta online
 * @returns {Promise<Array>}
 */
const findDetallesByVentaId = async (idVentaO) => {
  const sql = `
    SELECT 
      d.idProducto, 
      p.nombreProducto, 
      d.cantidad, 
      d.precioUnitario
    FROM DetalleVentaOnline d
    JOIN Productos p ON d.idProducto = p.idProducto
    WHERE d.idVentaO = ?
  `;
  const [rows] = await pool.query(sql, [idVentaO]);
  return rows;
};

/**
 * Crea una dirección de envío
 * @param {Object} direccionData - Datos de la dirección
 * @returns {Promise<number>} - ID de la dirección creada
 */
const createDireccion = async (direccionData) => {
  const {
    idCliente,
    nombreDestinatario,
    telefono,
    direccion,
    ciudad,
    provincia,
    codigoPostal,
    referencias,
  } = direccionData;

  const sql = `
    INSERT INTO DireccionesEnvio 
    (idCliente, nombreDestinatario, telefono, direccion, ciudad, provincia, codigoPostal, referencias)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    idCliente,
    nombreDestinatario,
    telefono,
    direccion,
    ciudad,
    provincia,
    codigoPostal,
    referencias || null,
  ]);

  return result.insertId;
};

/**
 * Crea una venta online
 * @param {Object} ventaData - Datos de la venta
 * @returns {Promise<number>} - ID de la venta creada
 */
const create = async (ventaData) => {
  const { totalPago, metodoPago, idCliente, tipoEntrega, estado, idDireccion } =
    ventaData;

  const sql = `
    INSERT INTO VentasOnlines 
    (totalPago, metodoPago, idCliente, tipoEntrega, estado, idDireccion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    totalPago,
    metodoPago,
    idCliente,
    tipoEntrega,
    estado || "Pendiente",
    idDireccion || null,
  ]);

  return result.insertId;
};

/**
 * Crea un detalle de venta online
 * @param {number} idVentaO - ID de la venta online
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad del producto
 * @param {number} precioUnitario - Precio unitario del producto
 * @returns {Promise<void>}
 */
const createDetalle = async (
  idVentaO,
  idProducto,
  cantidad,
  precioUnitario,
) => {
  const sql = `
    INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario)
    VALUES (?, ?, ?, ?)
  `;
  await pool.query(sql, [idVentaO, idProducto, cantidad, precioUnitario]);
};

/**
 * Actualiza el estado de una venta online
 * @param {number} idVentaO - ID de la venta online
 * @param {string} nuevoEstado - Nuevo estado
 * @returns {Promise<number>} - Número de filas afectadas
 */
const updateEstado = async (idVentaO, nuevoEstado) => {
  const sql = `UPDATE VentasOnlines SET estado = ? WHERE idVentaO = ?`;
  const [result] = await pool.query(sql, [nuevoEstado, idVentaO]);
  return result.affectedRows;
};

/**
 * Actualiza los datos de una venta online (total y método de pago)
 * @param {number} idVentaO - ID de la venta online
 * @param {number} totalPago - Total de la venta
 * @param {string} metodoPago - Método de pago
 * @returns {Promise<void>}
 */
const update = async (idVentaO, totalPago, metodoPago) => {
  const sql = `
    UPDATE VentasOnlines 
    SET totalPago = ?, metodoPago = ? 
    WHERE idVentaO = ?
  `;
  await pool.query(sql, [totalPago, metodoPago, idVentaO]);
};

/**
 * Elimina todos los detalles de una venta online
 * @param {number} idVentaO - ID de la venta online
 * @returns {Promise<void>}
 */
const deleteDetalles = async (idVentaO) => {
  const sql = `DELETE FROM DetalleVentaOnline WHERE idVentaO = ?`;
  await pool.query(sql, [idVentaO]);
};

/**
 * Obtiene el stock actual de un producto
 * @param {number} idProducto - ID del producto
 * @returns {Promise<number|null>}
 */
const getProductoStock = async (idProducto) => {
  const sql = `SELECT stock FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] ? rows[0].stock : null;
};

/**
 * Obtiene el precio actual de un producto
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object|null>} - {precio, stock}
 */
const getProductoPrecioYStock = async (idProducto) => {
  const sql = `SELECT precio, stock FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] || null;
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
 * Verifica si existe un cliente por ID
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<boolean>}
 */
const existsCliente = async (idCliente) => {
  const sql = `SELECT COUNT(*) as count FROM Clientes WHERE idCliente = ?`;
  const [rows] = await pool.query(sql, [idCliente]);
  return rows[0].count > 0;
};

module.exports = {
  findByClienteId,
  findAll,
  findById,
  findDetallesByVentaId,
  createDireccion,
  create,
  createDetalle,
  updateEstado,
  update,
  deleteDetalles,
  getProductoStock,
  getProductoPrecioYStock,
  updateStockRestar,
  updateStockSumar,
  existsCliente,
};
