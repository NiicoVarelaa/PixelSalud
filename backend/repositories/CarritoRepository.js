const { pool } = require("../config/database");

/**
 * Repository para gestionar el acceso a la tabla Carrito
 */

/**
 * Obtiene el carrito de un cliente con información de productos y ofertas
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Array>} Array de items del carrito con productos y ofertas
 */
const findByClienteWithProducts = async (idCliente) => {
  const query = `
    SELECT 
      c.idCarrito, 
      c.cantidad, 
      p.idProducto, 
      p.nombreProducto, 
      p.precio AS precioRegular,
      p.img,
      p.stock,
      p.activo,
      o.porcentajeDescuento,
      CASE
        WHEN o.idOferta IS NOT NULL 
        THEN p.precio * (1 - o.porcentajeDescuento / 100)
        ELSE p.precio
      END AS precioFinal, 
      CASE
        WHEN o.idOferta IS NOT NULL 
        THEN TRUE
        ELSE FALSE
      END AS enOferta
    FROM Carrito c
    JOIN Productos p ON c.idProducto = p.idProducto
    LEFT JOIN ofertas_old_backup o ON p.idProducto = o.idProducto
      AND o.esActiva = 1 
      AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    WHERE c.idCliente = ?
    ORDER BY c.idCarrito DESC`;

  const [rows] = await pool.query(query, [idCliente]);
  return rows;
};

const findItem = async (idCliente, idProducto) => {
  const query = "SELECT * FROM Carrito WHERE idCliente = ? AND idProducto = ?";
  const [results] = await pool.query(query, [idCliente, idProducto]);
  return results.length > 0 ? results[0] : null;
};

const existsItem = async (idCliente, idProducto) => {
  const item = await findItem(idCliente, idProducto);
  return item !== null;
};

const getItemQuantity = async (idCliente, idProducto) => {
  const item = await findItem(idCliente, idProducto);
  return item ? item.cantidad : 0;
};

const create = async (data) => {
  const { idCliente, idProducto, cantidad } = data;
  const [result] = await pool.query(
    "INSERT INTO Carrito (idCliente, idProducto, cantidad) VALUES (?, ?, ?)",
    [idCliente, idProducto, cantidad],
  );
  return result;
};

const updateQuantity = async (idCliente, idProducto, cantidad) => {
  const query = `
    UPDATE Carrito 
    SET cantidad = ? 
    WHERE idCliente = ? AND idProducto = ?`;

  const [result] = await pool.query(query, [cantidad, idCliente, idProducto]);
  return result;
};

const incrementQuantity = async (idCliente, idProducto, incremento = 1) => {
  const query = `
    UPDATE Carrito 
    SET cantidad = cantidad + ? 
    WHERE idCliente = ? AND idProducto = ?`;

  const [result] = await pool.query(query, [incremento, idCliente, idProducto]);
  return result;
};

const decrementQuantity = async (idCliente, idProducto) => {
  const query = `
    UPDATE Carrito 
    SET cantidad = GREATEST(1, cantidad - 1)
    WHERE idCliente = ? AND idProducto = ?`;

  const [result] = await pool.query(query, [idCliente, idProducto]);
  return result;
};

const deleteItem = async (idCliente, idProducto) => {
  const query = "DELETE FROM Carrito WHERE idCliente = ? AND idProducto = ?";
  const [result] = await pool.query(query, [idCliente, idProducto]);
  return result;
};

const deleteByCliente = async (idCliente) => {
  const query = "DELETE FROM Carrito WHERE idCliente = ?";
  const [result] = await pool.query(query, [idCliente]);
  return result;
};

const countByCliente = async (idCliente) => {
  const query = "SELECT COUNT(*) as total FROM Carrito WHERE idCliente = ?";
  const [result] = await pool.query(query, [idCliente]);
  return result[0]?.total || 0;
};

const getTotalItems = async (idCliente) => {
  const query = `
    SELECT COALESCE(SUM(cantidad), 0) as total 
    FROM Carrito 
    WHERE idCliente = ?`;

  const [result] = await pool.query(query, [idCliente]);
  return result[0]?.total || 0;
};

module.exports = {
  findByClienteWithProducts,
  findItem,
  existsItem,
  getItemQuantity,
  create,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  deleteItem,
  deleteByCliente,
  countByCliente,
  getTotalItems,
};
