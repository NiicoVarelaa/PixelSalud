const { pool } = require("../config/database");

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

const findAllPaginated = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
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
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [limit, offset]);

  const [countRows] = await pool.query("SELECT COUNT(*) as total FROM VentasEmpleados");

  return {
    ventas: rows,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(countRows[0].total / limit),
  };
};

const findByEmpleadoIdPaginated = async (idEmpleado, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const sql = `
    SELECT 
      ve.idVentaE, 
      ve.fechaPago, 
      ve.horaPago, 
      ve.metodoPago, 
      ve.estado,
      ve.totalPago
    FROM VentasEmpleados ve
    WHERE ve.idEmpleado = ?
    ORDER BY ve.idVentaE DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [idEmpleado, limit, offset]);

  const [countRows] = await pool.query(
    "SELECT COUNT(*) as total FROM VentasEmpleados WHERE idEmpleado = ?",
    [idEmpleado],
  );

  return {
    ventas: rows,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(countRows[0].total / limit),
  };
};

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

const findByIdSimple = async (idVentaE) => {
  const sql = `
    SELECT idVentaE, idEmpleado, totalPago, metodoPago, estado 
    FROM VentasEmpleados 
    WHERE idVentaE = ?
  `;
  const [rows] = await pool.query(sql, [idVentaE]);
  return rows[0] || null;
};

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

const update = async (idVentaE, updateData) => {
  const { totalPago, metodoPago, idEmpleado } = updateData;

  const sql = `
    UPDATE VentasEmpleados 
    SET totalPago = ?, metodoPago = ?, idEmpleado = ?
    WHERE idVentaE = ?
  `;

  await pool.query(sql, [totalPago, metodoPago, idEmpleado, idVentaE]);
};

const updateEstado = async (idVentaE, estado) => {
  const sql = `UPDATE VentasEmpleados SET estado = ? WHERE idVentaE = ?`;
  await pool.query(sql, [estado, idVentaE]);
};

const deleteDetalles = async (idVentaE) => {
  const sql = `DELETE FROM DetalleVentaEmpleado WHERE idVentaE = ?`;
  await pool.query(sql, [idVentaE]);
};

const getProductoStockYNombre = async (idProducto) => {
  const sql = `SELECT stock, nombreProducto FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] || null;
};

const getProductoStock = async (idProducto) => {
  const sql = `SELECT stock FROM Productos WHERE idProducto = ?`;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] ? rows[0].stock : null;
};

const updateStockRestar = async (idProducto, cantidad) => {
  const sql = `UPDATE Productos SET stock = stock - ? WHERE idProducto = ?`;
  await pool.query(sql, [cantidad, idProducto]);
};

const updateStockSumar = async (idProducto, cantidad) => {
  const sql = `UPDATE Productos SET stock = stock + ? WHERE idProducto = ?`;
  await pool.query(sql, [cantidad, idProducto]);
};

const existsEmpleado = async (idEmpleado) => {
  const sql = `SELECT COUNT(*) as count FROM Empleados WHERE idEmpleado = ?`;
  const [rows] = await pool.query(sql, [idEmpleado]);
  return rows[0].count > 0;
};

module.exports = {
  findAll,
  findAllPaginated,
  findByEmpleadoIdPaginated,
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
