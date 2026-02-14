const { pool } = require("../config/database");

/**
 * Repository para gestionar el acceso a la tabla Productos
 */

/**
 * Obtiene todos los productos activos con información de ofertas
 * @returns {Promise<Array>}
 */
const findAllWithOfertas = async () => {
  const sql = `
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcion,
        p.precio AS precioRegular,
        p.img,
        p.categoria,
        p.stock,
        p.activo,
        p.requiereReceta,
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
    FROM 
        Productos p
    LEFT JOIN 
        ofertas_old_backup o ON p.idProducto = o.idProducto
        AND o.esActiva = 1 
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    ORDER BY 
        p.idProducto
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene un producto por ID con información de ofertas
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object|null>}
 */
const findByIdWithOfertas = async (idProducto) => {
  const sql = `
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcion,
        p.precio AS precioRegular,
        p.img,
        p.categoria,
        p.stock,
        p.activo,
        p.requiereReceta,
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
    FROM 
        Productos p
    LEFT JOIN 
        ofertas_old_backup o ON p.idProducto = o.idProducto
        AND o.esActiva = 1 
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    WHERE 
        p.idProducto = ?
    LIMIT 1
  `;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] || null;
};

/**
 * Obtiene un producto por ID
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object|null>}
 */
const findById = async (idProducto) => {
  const [rows] = await pool.query(
    "SELECT * FROM Productos WHERE idProducto = ?",
    [idProducto],
  );
  return rows[0] || null;
};

/**
 * Obtiene productos inactivos (dados de baja)
 * @returns {Promise<Array>}
 */
const findInactivos = async () => {
  const sql = "SELECT * FROM Productos WHERE activo = false";
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene productos por categoría con ofertas
 * @param {string} categoria - Nombre de la categoría
 * @returns {Promise<Array>}
 */
const findByCategoriaWithOfertas = async (categoria) => {
  const sql = `
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcion,
        p.precio AS precioRegular,
        p.img,
        p.categoria,
        o.porcentajeDescuento,
        p.precio * (1 - o.porcentajeDescuento / 100) AS precioFinal,
        TRUE AS enOferta
    FROM 
        Productos p
    INNER JOIN 
        ofertas_old_backup o ON p.idProducto = o.idProducto
    WHERE 
        p.activo = 1 
        AND p.categoria = ?
        AND o.esActiva = 1 
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    LIMIT 10
  `;
  const [rows] = await pool.query(sql, [categoria]);
  return rows;
};

/**
 * Busca productos por término de búsqueda
 * @param {string} term - Término de búsqueda
 * @returns {Promise<Array>}
 */
const searchByName = async (term) => {
  const sql = `
    SELECT idProducto, nombreProducto, precio, stock, categoria, requiereReceta 
    FROM Productos 
    WHERE LOWER(nombreProducto) LIKE LOWER(?) 
      AND activo = 1 
      AND stock > 0
    LIMIT 10
  `;
  const [rows] = await pool.query(sql, [`%${term}%`]);
  return rows;
};

/**
 * Crea un nuevo producto
 * @param {Object} data - Datos del producto
 * @returns {Promise<number>} ID del producto creado
 */
const create = async (data) => {
  const {
    nombreProducto,
    descripcion,
    precio,
    img,
    categoria,
    stock,
    activo,
    requiereReceta,
  } = data;
  const [result] = await pool.query(
    `INSERT INTO Productos (nombreProducto, descripcion, precio, img, categoria, stock, activo, requiereReceta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombreProducto,
      descripcion,
      precio,
      img,
      categoria,
      stock,
      activo,
      requiereReceta,
    ],
  );
  return result.insertId;
};

/**
 * Actualiza un producto
 * @param {number} idProducto - ID del producto
 * @param {Object} data - Campos a actualizar
 * @returns {Promise<boolean>}
 */
const update = async (idProducto, data) => {
  const fields = [];
  const values = [];

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  });

  if (fields.length === 0) return false;

  values.push(idProducto);
  const [result] = await pool.query(
    `UPDATE Productos SET ${fields.join(", ")} WHERE idProducto = ?`,
    values,
  );
  return result.affectedRows > 0;
};

/**
 * Verifica si existe un producto con los criterios dados
 * @param {Object} criteria - Criterios de búsqueda
 * @returns {Promise<boolean>}
 */
const exists = async (criteria) => {
  const keys = Object.keys(criteria);
  if (keys.length === 0) return false;

  const conditions = keys.map((key) => `${key} = ?`);
  const values = keys.map((key) => criteria[key]);

  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM Productos WHERE ${conditions.join(" AND ")}`,
    values,
  );
  return rows[0].count > 0;
};

/**
 * Actualiza el estado activo de un producto
 * @param {number} idProducto - ID del producto
 * @param {boolean} activo - Nuevo estado
 * @returns {Promise<boolean>}
 */
const updateActivo = async (idProducto, activo) => {
  return await update(idProducto, { activo });
};

/**
 * Da de baja un producto (activo = false)
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 */
const darBaja = async (idProducto) => {
  return await updateActivo(idProducto, false);
};

/**
 * Activa un producto (activo = true)
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 */
const activar = async (idProducto) => {
  return await updateActivo(idProducto, true);
};

/**
 * Decrementa el stock de un producto
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad a decrementar
 * @returns {Promise<boolean>}
 */
const decrementStock = async (idProducto, cantidad) => {
  const sql = `
    UPDATE Productos 
    SET stock = stock - ? 
    WHERE idProducto = ? AND stock >= ?
  `;
  const [result] = await pool.query(sql, [cantidad, idProducto, cantidad]);
  return result.affectedRows > 0;
};

/**
 * Verifica si hay stock suficiente
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad requerida
 * @returns {Promise<boolean>}
 */
const hasStock = async (idProducto, cantidad) => {
  const sql = "SELECT stock FROM Productos WHERE idProducto = ?";
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] && rows[0].stock >= cantidad;
};

/**
 * Obtiene productos con stock bajo (menos de 5 unidades)
 * @returns {Promise<Array>}
 */
const findWithLowStock = async () => {
  const sql = `
    SELECT idProducto, nombreProducto, stock, categoria 
    FROM Productos 
    WHERE activo = 1 AND stock < 5 AND stock > 0
    ORDER BY stock ASC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

module.exports = {
  findAllWithOfertas,
  findByIdWithOfertas,
  findById,
  findInactivos,
  findByCategoriaWithOfertas,
  searchByName,
  create,
  update,
  exists,
  updateActivo,
  darBaja,
  activar,
  decrementStock,
  hasStock,
  findWithLowStock,
};
