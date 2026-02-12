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

/**
 * Busca un item específico en el carrito de un cliente
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object|null>} Item del carrito o null
 */
const findItem = async (idCliente, idProducto) => {
  const query = "SELECT * FROM Carrito WHERE idCliente = ? AND idProducto = ?";
  const [results] = await pool.query(query, [idCliente, idProducto]);
  return results.length > 0 ? results[0] : null;
};

/**
 * Verifica si existe un producto en el carrito de un cliente
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>} True si existe
 */
const existsItem = async (idCliente, idProducto) => {
  const item = await findItem(idCliente, idProducto);
  return item !== null;
};

/**
 * Obtiene la cantidad actual de un producto en el carrito
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<number>} Cantidad actual o 0 si no existe
 */
const getItemQuantity = async (idCliente, idProducto) => {
  const item = await findItem(idCliente, idProducto);
  return item ? item.cantidad : 0;
};

/**
 * Crea un nuevo item en el carrito
 * @param {Object} data - Datos del item
 * @returns {Promise<Object>} Resultado de la inserción
 */
const create = async (data) => {
  const { idCliente, idProducto, cantidad } = data;
  const [result] = await pool.query(
    "INSERT INTO Carrito (idCliente, idProducto, cantidad) VALUES (?, ?, ?)",
    [idCliente, idProducto, cantidad],
  );
  return result;
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Nueva cantidad
 * @returns {Promise<Object>} Resultado de la actualización
 */
const updateQuantity = async (idCliente, idProducto, cantidad) => {
  const query = `
    UPDATE Carrito 
    SET cantidad = ? 
    WHERE idCliente = ? AND idProducto = ?`;

  const [result] = await pool.query(query, [cantidad, idCliente, idProducto]);
  return result;
};

/**
 * Incrementa la cantidad de un producto en el carrito
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @param {number} incremento - Cantidad a incrementar (default: 1)
 * @returns {Promise<Object>} Resultado de la actualización
 */
const incrementQuantity = async (idCliente, idProducto, incremento = 1) => {
  const query = `
    UPDATE Carrito 
    SET cantidad = cantidad + ? 
    WHERE idCliente = ? AND idProducto = ?`;

  const [result] = await pool.query(query, [incremento, idCliente, idProducto]);
  return result;
};

/**
 * Decrementa la cantidad de un producto en el carrito (mínimo 1)
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object>} Resultado de la actualización
 */
const decrementQuantity = async (idCliente, idProducto) => {
  const query = `
    UPDATE Carrito 
    SET cantidad = GREATEST(1, cantidad - 1)
    WHERE idCliente = ? AND idProducto = ?`;

  const [result] = await pool.query(query, [idCliente, idProducto]);
  return result;
};

/**
 * Elimina un producto específico del carrito
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object>} Resultado de la eliminación
 */
const deleteItem = async (idCliente, idProducto) => {
  const query = "DELETE FROM Carrito WHERE idCliente = ? AND idProducto = ?";
  const [result] = await pool.query(query, [idCliente, idProducto]);
  return result;
};

/**
 * Elimina todos los items del carrito de un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Object>} Resultado de la eliminación
 */
const deleteByCliente = async (idCliente) => {
  const query = "DELETE FROM Carrito WHERE idCliente = ?";
  const [result] = await pool.query(query, [idCliente]);
  return result;
};

/**
 * Cuenta la cantidad de productos únicos en el carrito de un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<number>} Cantidad de productos
 */
const countByCliente = async (idCliente) => {
  const query = "SELECT COUNT(*) as total FROM Carrito WHERE idCliente = ?";
  const [result] = await pool.query(query, [idCliente]);
  return result[0]?.total || 0;
};

/**
 * Obtiene el total de items (suma de cantidades) en el carrito
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<number>} Total de items
 */
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
