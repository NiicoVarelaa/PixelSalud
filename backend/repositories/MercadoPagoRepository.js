const { pool } = require("../config/database");

const getSucursalByCodigo = async (codigo) => {
  const sql = `
    SELECT idSucursal, codigo, nombre, direccion, horario, telefono
    FROM Sucursales
    WHERE codigo = ? AND activo = TRUE
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [codigo]);
  return rows[0] || null;
};

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
        WHEN co.tipo = '2X1'
        THEN p.precio
        WHEN co.idCampana IS NOT NULL
        THEN p.precio * (1 - COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento) / 100)
        WHEN o.idOferta IS NOT NULL
        THEN p.precio * (1 - o.porcentajeDescuento / 100)
        ELSE p.precio
      END AS precioFinal,
      co.tipo AS tipoPromocion,
      CASE WHEN co.tipo = '2X1' THEN TRUE ELSE FALSE END AS promo2x1Activa,
      CASE
        WHEN co.tipo = '2X1' THEN NULL
        WHEN co.idCampana IS NOT NULL THEN COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento)
        WHEN o.idOferta IS NOT NULL THEN o.porcentajeDescuento
        ELSE NULL
      END AS porcentajeDescuentoAplicado,
      p.img,
      p.categoria,
      p.stock
    FROM Productos p
    LEFT JOIN productos_campanas pc ON pc.id = (
      SELECT pc2.id
      FROM productos_campanas pc2
      JOIN campanas_ofertas co2 ON co2.idCampana = pc2.idCampana
      WHERE pc2.idProducto = p.idProducto
        AND pc2.esActivo = 1
        AND co2.esActiva = 1
        AND NOW() BETWEEN co2.fechaInicio AND co2.fechaFin
      ORDER BY
        CASE WHEN co2.tipo = '2X1' THEN 1 ELSE 0 END DESC,
        co2.prioridad DESC,
        COALESCE(pc2.porcentajeDescuentoOverride, co2.porcentajeDescuento) DESC,
        pc2.id DESC
      LIMIT 1
    )
    LEFT JOIN campanas_ofertas co ON pc.idCampana = co.idCampana
    LEFT JOIN Ofertas o ON p.idProducto = o.idProducto
      AND o.esActiva = 1
      AND co.idCampana IS NULL
      AND NOW() BETWEEN o.fechaInicio AND o.fechaFin
    WHERE p.idProducto IN (${placeholders})
  `;

  const [rows] = await pool.query(sql, productIds);
  return rows;
};

const createVentaOnline = async ({
  idCliente,
  totalPago,
  estado = "pendiente",
  externalReference,
  idCuponAplicado = null,
  idSucursal = null,
  sucursalNombre = null,
  sucursalDireccion = null,
  tipoEntrega = "retiro_sucursal",
  dniClienteSnapshot = null,
  fechaNacimientoSnapshot = null,
  celularSnapshot = null,
  termsAccepted = false,
  termsAcceptedAt = null,
  termsVersion = null,
}) => {
  const sql = `
    INSERT INTO VentasOnlines (
      idCliente,
      totalPago,
      metodoPago,
      estado,
      fechaPago,
      horaPago,
      externalReference,
      idCuponAplicado,
      idSucursal,
      sucursalNombre,
      sucursalDireccion,
      tipoEntrega,
      dniClienteSnapshot,
      fechaNacimientoSnapshot,
      celularSnapshot,
      termsAccepted,
      termsAcceptedAt,
      termsVersion
    )
    VALUES (?, ?, 'Mercado Pago', ?, CURRENT_DATE, CURRENT_TIME, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    idCliente,
    totalPago,
    estado,
    externalReference,
    idCuponAplicado,
    idSucursal,
    sucursalNombre,
    sucursalDireccion,
    tipoEntrega,
    dniClienteSnapshot,
    fechaNacimientoSnapshot,
    celularSnapshot,
    termsAccepted,
    termsAcceptedAt,
    termsVersion,
  ]);
  return result.insertId;
};

const createDetalleVentaOnline = async (idVentaO, items) => {
  if (!items || items.length === 0) {
    return;
  }

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

const findVentaByExternalReference = async (externalReference) => {
  const sql = `
    SELECT idVentaO, idCliente, estado, totalPago, fechaPago, horaPago, idCuponAplicado
    FROM VentasOnlines
    WHERE externalReference = ?
  `;

  const [rows] = await pool.query(sql, [externalReference]);
  return rows[0] || null;
};

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

const updateVentaEstadoCancelado = async (externalReference) => {
  const sql = `
    UPDATE VentasOnlines 
    SET estado = 'cancelado'
    WHERE externalReference = ?
  `;

  const [result] = await pool.query(sql, [externalReference]);
  return result.affectedRows > 0;
};

const updateVentaEstadoPendiente = async (externalReference, status) => {
  const sql = `
    UPDATE VentasOnlines 
    SET estado = 'pendiente'
    WHERE externalReference = ?
  `;

  const [result] = await pool.query(sql, [externalReference]);
  return result.affectedRows > 0;
};

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
      COALESCE(imgPrincipal.urlImagen, p.img) as img
    FROM VentasOnlines vo
    INNER JOIN DetalleVentaOnline dvo ON vo.idVentaO = dvo.idVentaO
    INNER JOIN Productos p ON dvo.idProducto = p.idProducto
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
    WHERE vo.idCliente = ? AND vo.metodoPago = 'Mercado Pago'
    ORDER BY vo.fechaPago DESC, vo.horaPago DESC
  `;

  const [rows] = await pool.query(sql, [idCliente]);
  return rows;
};

const clearUserCart = async (idCliente) => {
  const sql = `DELETE FROM Carrito WHERE idCliente = ?`;

  const [result] = await pool.query(sql, [idCliente]);
  return result.affectedRows > 0;
};

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

const updateProductStockTx = async (connection, items) => {
  for (const item of items) {
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

const clearUserCartTx = async (connection, idCliente) => {
  const sql = `DELETE FROM Carrito WHERE idCliente = ?`;
  const [result] = await connection.query(sql, [idCliente]);
  return result.affectedRows > 0;
};

module.exports = {
  getSucursalByCodigo,
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
  updateVentaEstadoTx,
  updateProductStockTx,
  getDetallesVentaTx,
  clearUserCartTx,
};
