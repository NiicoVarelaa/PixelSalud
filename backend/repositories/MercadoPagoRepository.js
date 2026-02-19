const { pool } = require("../config/database");

/**
 * Obtiene productos con precios y descuentos de campañas activas
 * @param {Array<number>} productIds - Array de IDs de productos
 * @returns {Promise<Array>}
 */
const getProductsByIds = async (productIds) => {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  const placeholders = productIds.map(() => "?").join(", ");
  const sql = `
    SELECT 
      p.idProducto,
      p.nombreProducto,
      p.descripcion,
      p.precio AS precio,
      CASE
        WHEN pc.id IS NOT NULL AND pc.esActivo = 1 
          AND co.esActiva = 1 
          AND NOW() BETWEEN co.fechaInicio AND co.fechaFin
        THEN p.precio * (1 - COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento) / 100)
        ELSE p.precio
      END AS precioFinal,
      p.img,
      p.categoria,
      p.stock
    FROM Productos p
    LEFT JOIN productos_campanas pc ON p.idProducto = pc.idProducto 
      AND pc.esActivo = 1
    LEFT JOIN campanas_ofertas co ON pc.idCampana = co.idCampana
      AND co.esActiva = 1
      AND NOW() BETWEEN co.fechaInicio AND co.fechaFin
    WHERE p.idProducto IN (${placeholders})
  `;

  const [rows] = await pool.query(sql, productIds);
  return rows;
};

/**
 * Crea una venta online en estado pendiente
 * @param {Object} ventaData - Datos de la venta
 * @returns {Promise<number>} - ID de la venta creada
 */
const createVentaOnline = async ({
  idCliente,
  totalPago,
  estado = "pendiente",
  externalReference,
  idCuponAplicado = null,
}) => {
  const sql = `
    INSERT INTO VentasOnlines (idCliente, totalPago, metodoPago, estado, fechaPago, horaPago, externalReference, idCuponAplicado) 
    VALUES (?, ?, 'Mercado Pago', ?, CURRENT_DATE, CURRENT_TIME, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    idCliente,
    totalPago,
    estado,
    externalReference,
    idCuponAplicado,
  ]);
  return result.insertId;
};

/**
 * Crea los detalles de una venta online
 * @param {number} idVentaO - ID de la venta
 * @param {Array} items - Items del carrito
 * @returns {Promise<void>}
 */
const createDetalleVentaOnline = async (idVentaO, items) => {
  if (!items || items.length === 0) {
    return;
  }

  // Normaliza los campos por si vienen con id o idProducto
  const values = items.map((item) => [
    idVentaO,
    item.idProducto ?? item.id,
    item.quantity,
    item.unit_price,
  ]);

  const sql = `
    INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario)
    VALUES ?
  `;

  await pool.query(sql, [values]);
};

/**
 * Actualiza el stock de productos (decrementa)
 * @param {Array} items - Items con idProducto y quantity
 * @returns {Promise<void>}
 */
const updateProductStock = async (items) => {
  const promises = items.map((item) => {
    const sql = `
      UPDATE Productos 
      SET stock = stock - ? 
      WHERE idProducto = ? AND stock >= ?
    `;

    return pool.query(sql, [item.quantity, item.idProducto, item.quantity]);
  });

  await Promise.all(promises);
};

/**
 * Busca una venta por external reference
 * @param {string} externalReference - External reference
 * @returns {Promise<Object|null>}
 */
const findVentaByExternalReference = async (externalReference) => {
  const sql = `
    SELECT idVentaO, idCliente, estado, totalPago, fechaPago, horaPago
    FROM VentasOnlines
    WHERE externalReference = ?
  `;

  const [rows] = await pool.query(sql, [externalReference]);
  return rows[0] || null;
};

/**
 * Actualiza el estado de una venta
 * @param {number} idVentaO - ID de la venta
 * @param {string} estado - Nuevo estado
 * @returns {Promise<boolean>}
 */
const updateVentaEstado = async (idVentaO, estado) => {
  const sql = `
    UPDATE VentasOnlines 
    SET estado = ?,
        fechaPago = CURRENT_DATE,
        horaPago = CURRENT_TIME
    WHERE idVentaO = ?
  `;

  const [result] = await pool.query(sql, [estado, idVentaO]);
  return result.affectedRows > 0;
};

/**
 * Actualiza el estado de una venta a cancelado por external reference
 * @param {string} externalReference - External reference
 * @returns {Promise<boolean>}
 */
const updateVentaEstadoCancelado = async (externalReference) => {
  const sql = `
    UPDATE VentasOnlines 
    SET estado = 'cancelado'
    WHERE externalReference = ?
  `;

  const [result] = await pool.query(sql, [externalReference]);
  return result.affectedRows > 0;
};

/**
 * Actualiza el estado de una venta a pendiente por external reference
 * @param {string} externalReference - External reference
 * @param {string} status - Estado del pago
 * @returns {Promise<boolean>}
 */
const updateVentaEstadoPendiente = async (externalReference, status) => {
  const sql = `
    UPDATE VentasOnlines 
    SET estado = 'pendiente'
    WHERE externalReference = ?
  `;

  const [result] = await pool.query(sql, [externalReference]);
  return result.affectedRows > 0;
};

/**
 * Obtiene los detalles de una venta
 * @param {number} idVentaO - ID de la venta
 * @returns {Promise<Array>}
 */
const getDetallesVenta = async (idVentaO) => {
  const sql = `
    SELECT 
      d.idProducto, 
      d.cantidad,
      d.precioUnitario,
      p.nombreProducto
    FROM DetalleVentaOnline d
    JOIN Productos p ON d.idProducto = p.idProducto
    WHERE d.idVentaO = ?
  `;

  const [rows] = await pool.query(sql, [idVentaO]);
  return rows;
};

/**
 * Obtiene el historial de ventas de un cliente con productos
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Array>}
 */
const getUserOrders = async (idCliente) => {
  const sql = `
    SELECT 
      vo.idVentaO,
      vo.totalPago,
      vo.fechaPago,
      vo.horaPago,
      vo.metodoPago,
      vo.estado,
      dvo.idProducto,
      dvo.cantidad,
      dvo.precioUnitario,
      p.nombreProducto,
      p.img
    FROM VentasOnlines vo
    INNER JOIN DetalleVentaOnline dvo ON vo.idVentaO = dvo.idVentaO
    INNER JOIN Productos p ON dvo.idProducto = p.idProducto
    WHERE vo.idCliente = ? AND vo.metodoPago = 'Mercado Pago'
    ORDER BY vo.fechaPago DESC, vo.horaPago DESC
  `;

  const [rows] = await pool.query(sql, [idCliente]);
  return rows;
};

/**
 * Limpia el carrito de un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<boolean>}
 */
const clearUserCart = async (idCliente) => {
  const sql = `DELETE FROM Carrito WHERE idCliente = ?`;

  const [result] = await pool.query(sql, [idCliente]);
  return result.affectedRows > 0;
};

// ========================================
// MÉTODOS TRANSACCIONALES
// ========================================
// Estos métodos aceptan una conexión como parámetro para ser usados dentro de transacciones

/**
 * Actualiza el estado de una venta (versión transaccional)
 * @param {Object} connection - Conexión de la transacción
 * @param {number} idVentaO - ID de la venta
 * @param {string} estado - Nuevo estado
 * @returns {Promise<boolean>}
 */
const updateVentaEstadoTx = async (connection, idVentaO, estado) => {
  const sql = `
    UPDATE VentasOnlines 
    SET estado = ?,
        fechaPago = CURRENT_DATE,
        horaPago = CURRENT_TIME
    WHERE idVentaO = ?
  `;

  const [result] = await connection.query(sql, [estado, idVentaO]);
  return result.affectedRows > 0;
};

/**
 * Actualiza el stock de productos (versión transaccional con validación)
 * @param {Object} connection - Conexión de la transacción
 * @param {Array} items - Items con idProducto y quantity
 * @returns {Promise<void>}
 * @throws {Error} Si no hay stock suficiente
 */
const updateProductStockTx = async (connection, items) => {
  for (const item of items) {
    // Primero verificar stock disponible con bloqueo (SELECT FOR UPDATE)
    const [products] = await connection.query(
      `SELECT stock FROM Productos WHERE idProducto = ? FOR UPDATE`,
      [item.idProducto],
    );

    if (products.length === 0) {
      throw new Error(`Producto ${item.idProducto} no encontrado`);
    }

    const currentStock = products[0].stock;

    if (currentStock < item.quantity) {
      throw new Error(
        `Stock insuficiente para producto ${item.idProducto}. ` +
          `Disponible: ${currentStock}, Solicitado: ${item.quantity}`,
      );
    }

    // Actualizar stock
    const [result] = await connection.query(
      `UPDATE Productos SET stock = stock - ? WHERE idProducto = ?`,
      [item.quantity, item.idProducto],
    );

    if (result.affectedRows === 0) {
      throw new Error(
        `No se pudo actualizar stock del producto ${item.idProducto}`,
      );
    }
  }
};

/**
 * Obtiene los detalles de una venta (versión transaccional)
 * @param {Object} connection - Conexión de la transacción
 * @param {number} idVentaO - ID de la venta
 * @returns {Promise<Array>}
 */
const getDetallesVentaTx = async (connection, idVentaO) => {
  const sql = `
    SELECT 
      d.idProducto, 
      d.cantidad,
      d.precioUnitario,
      p.nombreProducto
    FROM DetalleVentaOnline d
    JOIN Productos p ON d.idProducto = p.idProducto
    WHERE d.idVentaO = ?
  `;

  const [rows] = await connection.query(sql, [idVentaO]);
  return rows;
};

/**
 * Limpia el carrito de un cliente (versión transaccional)
 * @param {Object} connection - Conexión de la transacción
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<boolean>}
 */
const clearUserCartTx = async (connection, idCliente) => {
  const sql = `DELETE FROM Carrito WHERE idCliente = ?`;
  const [result] = await connection.query(sql, [idCliente]);
  return result.affectedRows > 0;
};

module.exports = {
  getProductsByIds,
  createVentaOnline,
  createDetalleVentaOnline,
  updateProductStock,
  findVentaByExternalReference,
  updateVentaEstado,
  updateVentaEstadoCancelado,
  updateVentaEstadoPendiente,
  getDetallesVenta,
  getUserOrders,
  clearUserCart,
  // Métodos transaccionales
  updateVentaEstadoTx,
  updateProductStockTx,
  getDetallesVentaTx,
  clearUserCartTx,
};
