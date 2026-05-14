const { pool } = require("../config/database");

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
      COALESCE(
        (
          SELECT ip.urlImagen
          FROM ImagenesProductos ip
          WHERE ip.idProducto = p.idProducto
          ORDER BY ip.esPrincipal DESC, ip.orden ASC, ip.idImagen ASC
          LIMIT 1
        ),
        p.img
      ) AS img,
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

const findAll = async () => {
  const sql = `
    SELECT 
      v.idVentaO, 
      v.fechaPago, 
      v.horaPago, 
      v.metodoPago, 
      v.estado,
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

const findById = async (idVentaO) => {
  const sql = `
    SELECT 
      v.*,
      c.nombreCliente,
      c.apellidoCliente,
      c.dni as dniCliente,
      c.emailCliente,
      c.telefono as telefonoCliente
    FROM VentasOnlines v
    JOIN Clientes c ON v.idCliente = c.idCliente
    WHERE v.idVentaO = ?
  `;
  const [rows] = await pool.query(sql, [idVentaO]);
  return rows[0] || null;
};

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

const updateEstado = async (idVentaO, nuevoEstado) => {
  const sql = `UPDATE VentasOnlines SET estado = ? WHERE idVentaO = ?`;
  const [result] = await pool.query(sql, [nuevoEstado, idVentaO]);
  return result.affectedRows;
};

const update = async (idVentaO, totalPago, metodoPago) => {
  const sql = `
    UPDATE VentasOnlines 
    SET totalPago = ?, metodoPago = ? 
    WHERE idVentaO = ?
  `;
  await pool.query(sql, [totalPago, metodoPago, idVentaO]);
};

const deleteDetalles = async (idVentaO) => {
  const sql = `DELETE FROM DetalleVentaOnline WHERE idVentaO = ?`;
  await pool.query(sql, [idVentaO]);
};

const getProductoStock = async (idProducto) => {
  const sql = `SELECT stock FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] ? rows[0].stock : null;
};

const getProductoPrecioYStock = async (idProducto) => {
  const sql = `SELECT precio, stock FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] || null;
};

const updateStockRestar = async (idProducto, cantidad) => {
  const sql = `UPDATE Productos SET stock = stock - ? WHERE idProducto = ?`;
  await pool.query(sql, [cantidad, idProducto]);
};

const updateStockSumar = async (idProducto, cantidad) => {
  const sql = `UPDATE Productos SET stock = stock + ? WHERE idProducto = ?`;
  await pool.query(sql, [cantidad, idProducto]);
};

const existsCliente = async (idCliente) => {
  const sql = `SELECT COUNT(*) as count FROM Clientes WHERE idCliente = ?`;
  const [rows] = await pool.query(sql, [idCliente]);
  return rows[0].count > 0;
};

const existsClienteWithConn = async (conn, idCliente) => {
  const sql = `SELECT COUNT(*) as count FROM Clientes WHERE idCliente = ?`;
  const [rows] = await conn.query(sql, [idCliente]);
  return rows[0].count > 0;
};

const getProductoStockWithConn = async (conn, idProducto) => {
  const sql = `SELECT stock FROM Productos WHERE idProducto = ?`;
  const [rows] = await conn.query(sql, [idProducto]);
  return rows[0] ? rows[0].stock : null;
};

const createDireccionWithConn = async (conn, direccionData) => {
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

  const [result] = await conn.query(sql, [
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

const createWithConn = async (conn, ventaData) => {
  const { totalPago, metodoPago, idCliente, tipoEntrega, estado, idDireccion } =
    ventaData;

  const sql = `
    INSERT INTO VentasOnlines 
    (totalPago, metodoPago, idCliente, tipoEntrega, estado, idDireccion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await conn.query(sql, [
    totalPago,
    metodoPago,
    idCliente,
    tipoEntrega,
    estado || "Pendiente",
    idDireccion || null,
  ]);

  return result.insertId;
};

const createDetalleWithConn = async (
  conn,
  idVentaO,
  idProducto,
  cantidad,
  precioUnitario,
) => {
  const sql = `
    INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario)
    VALUES (?, ?, ?, ?)
  `;
  await conn.query(sql, [idVentaO, idProducto, cantidad, precioUnitario]);
};

const updateStockRestarWithConn = async (conn, idProducto, cantidad) => {
  const sql = `UPDATE Productos SET stock = stock - ? WHERE idProducto = ? AND stock >= ?`;
  const [result] = await conn.query(sql, [cantidad, idProducto, cantidad]);
  return result.affectedRows > 0;
};

const findAllPaginated = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const sql = `
    SELECT 
      v.idVentaO, 
      v.fechaPago, 
      v.horaPago, 
      v.metodoPago, 
      v.estado,
      v.totalPago,
      c.nombreCliente, 
      c.apellidoCliente, 
      c.dni,
      COUNT(d.idProducto) as cantidadProductos
    FROM VentasOnlines v
    JOIN Clientes c ON v.idCliente = c.idCliente
    JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
    GROUP BY v.idVentaO
    ORDER BY v.idVentaO DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [limit, offset]);

  const [countRows] = await pool.query(
    "SELECT COUNT(DISTINCT idVentaO) as total FROM VentasOnlines",
  );

  return {
    ventas: rows,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(countRows[0].total / limit),
  };
};

const findByClienteIdPaginated = async (idCliente, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const sql = `
    SELECT 
      v.idVentaO, 
      v.fechaPago, 
      v.horaPago, 
      v.metodoPago, 
      v.totalPago,
      v.estado,
      COUNT(d.idProducto) as cantidadProductos
    FROM VentasOnlines v
    JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
    WHERE v.idCliente = ?
    GROUP BY v.idVentaO
    ORDER BY v.idVentaO DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [idCliente, limit, offset]);

  const [countRows] = await pool.query(
    "SELECT COUNT(DISTINCT idVentaO) as total FROM VentasOnlines WHERE idCliente = ?",
    [idCliente],
  );

  return {
    ventas: rows,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(countRows[0].total / limit),
  };
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
  existsClienteWithConn,
  getProductoStockWithConn,
  createDireccionWithConn,
  createWithConn,
  createDetalleWithConn,
  updateStockRestarWithConn,
  findAllPaginated,
  findByClienteIdPaginated,
};
