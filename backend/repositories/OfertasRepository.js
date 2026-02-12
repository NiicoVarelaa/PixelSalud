const { pool } = require("../config/database");

/**
 * Repository para gestionar el acceso a la tabla ofertas_old_backup
 */

/**
 * Obtiene todas las ofertas con información de productos
 * @returns {Promise<Array>}
 */
const findAllWithProductos = async () => {
  const sql = `
    SELECT 
        o.*, 
        p.nombreProducto,
        p.categoria,
        p.img
    FROM 
        ofertas_old_backup o
    JOIN 
        Productos p ON o.idProducto = p.idProducto
    ORDER BY o.fechaFin DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene una oferta por ID con información del producto
 * @param {number} idOferta - ID de la oferta
 * @returns {Promise<Object|null>}
 */
const findByIdWithProducto = async (idOferta) => {
  const sql = `
    SELECT 
        o.*, 
        p.nombreProducto,
        p.categoria,
        p.img
    FROM 
        ofertas_old_backup o
    JOIN 
        Productos p ON o.idProducto = p.idProducto
    WHERE 
        o.idOferta = ?
  `;
  const [rows] = await pool.query(sql, [idOferta]);
  return rows[0] || null;
};

/**
 * Obtiene una oferta por ID
 * @param {number} idOferta - ID de la oferta
 * @returns {Promise<Object|null>}
 */
const findById = async (idOferta) => {
  const [rows] = await pool.query(
    "SELECT * FROM ofertas_old_backup WHERE idOferta = ?",
    [idOferta],
  );
  return rows[0] || null;
};

/**
 * Obtiene ofertas activas de un producto específico
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Array>}
 */
const findActiveByProducto = async (idProducto) => {
  const sql = `
    SELECT * FROM ofertas_old_backup 
    WHERE idProducto = ? 
      AND esActiva = 1 
      AND NOW() BETWEEN fechaInicio AND fechaFin
  `;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows;
};

/**
 * Obtiene ofertas de Cyber Monday (25% de descuento)
 * @param {number} descuento - Porcentaje de descuento (default: 25)
 * @param {string} fechaFin - Fecha de finalización específica
 * @returns {Promise<Array>}
 */
const findCyberMondayWithProductos = async (
  descuento = 25.0,
  fechaFin = "2026-12-31 23:59:59",
) => {
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
        AND o.esActiva = 1 
        AND o.porcentajeDescuento = ?
        AND o.fechaFin = ?
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    ORDER BY
        p.idProducto
  `;
  const [rows] = await pool.query(sql, [descuento, fechaFin]);
  return rows;
};

/**
 * Crea una nueva oferta
 * @param {Object} data - Datos de la oferta
 * @returns {Promise<number>} ID de la oferta creada
 */
const create = async (data) => {
  const { idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva } =
    data;
  const [result] = await pool.query(
    `INSERT INTO ofertas_old_backup 
      (idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva) 
    VALUES (?, ?, ?, ?, ?)`,
    [idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva],
  );
  return result.insertId;
};

/**
 * Crea ofertas masivas (para eventos como Cyber Monday)
 * @param {Array<number>} productIds - Array de IDs de productos
 * @param {number} porcentajeDescuento - Porcentaje de descuento
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaFin - Fecha de fin
 * @returns {Promise<Object>} Resultado de la inserción
 */
const createMasive = async (
  productIds,
  porcentajeDescuento,
  fechaInicio,
  fechaFin,
) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new Error("Se requiere al menos un ID de producto");
  }

  const ofertaValues = productIds.map((idProducto) => [
    idProducto,
    porcentajeDescuento,
    fechaInicio,
    fechaFin,
    1, // esActiva = 1
  ]);

  const sql = `
    INSERT INTO ofertas_old_backup (idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva) 
    VALUES ?
  `;

  const [result] = await pool.query(sql, [ofertaValues]);
  return {
    affectedRows: result.affectedRows,
    insertId: result.insertId,
  };
};

/**
 * Actualiza una oferta
 * @param {number} idOferta - ID de la oferta
 * @param {Object} data - Campos a actualizar
 * @returns {Promise<boolean>}
 */
const update = async (idOferta, data) => {
  const fields = [];
  const values = [];

  if (data.porcentajeDescuento !== undefined) {
    fields.push("porcentajeDescuento = ?");
    values.push(data.porcentajeDescuento);
  }
  if (data.fechaInicio !== undefined) {
    fields.push("fechaInicio = ?");
    values.push(data.fechaInicio);
  }
  if (data.fechaFin !== undefined) {
    fields.push("fechaFin = ?");
    values.push(data.fechaFin);
  }
  if (data.esActiva !== undefined) {
    fields.push("esActiva = ?");
    values.push(data.esActiva);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(idOferta);

  const [result] = await pool.query(
    `UPDATE ofertas_old_backup SET ${fields.join(", ")} WHERE idOferta = ?`,
    values,
  );

  return result.affectedRows > 0;
};

/**
 * Actualiza el estado activo de una oferta
 * @param {number} idOferta - ID de la oferta
 * @param {boolean} esActiva - Nuevo estado
 * @returns {Promise<boolean>}
 */
const updateEsActiva = async (idOferta, esActiva) => {
  return await update(idOferta, { esActiva });
};

/**
 * Elimina una oferta
 * @param {number} idOferta - ID de la oferta
 * @returns {Promise<boolean>}
 */
const deleteOferta = async (idOferta) => {
  const [result] = await pool.query(
    "DELETE FROM ofertas_old_backup WHERE idOferta = ?",
    [idOferta],
  );
  return result.affectedRows > 0;
};

/**
 * Desactiva todas las ofertas de un producto
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 */
const desactivarByProducto = async (idProducto) => {
  const sql = "UPDATE ofertas_old_backup SET esActiva = 0 WHERE idProducto = ?";
  const [result] = await pool.query(sql, [idProducto]);
  return result.affectedRows > 0;
};

/**
 * Obtiene ofertas que expiran pronto (en los próximos N días)
 * @param {number} dias - Número de días
 * @returns {Promise<Array>}
 */
const findExpiringIn = async (dias = 7) => {
  const sql = `
    SELECT 
        o.*, 
        p.nombreProducto,
        p.categoria,
        p.img,
        DATEDIFF(o.fechaFin, NOW()) as diasRestantes
    FROM 
        ofertas_old_backup o
    JOIN 
        Productos p ON o.idProducto = p.idProducto
    WHERE 
        o.esActiva = 1 
        AND o.fechaFin > NOW()
        AND DATEDIFF(o.fechaFin, NOW()) <= ?
    ORDER BY o.fechaFin ASC
  `;
  const [rows] = await pool.query(sql, [dias]);
  return rows;
};

/**
 * Verifica si un producto ya tiene una oferta activa
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 */
const hasActiveOferta = async (idProducto) => {
  const ofertas = await findActiveByProducto(idProducto);
  return ofertas.length > 0;
};

module.exports = {
  findAllWithProductos,
  findByIdWithProducto,
  findById,
  findActiveByProducto,
  findCyberMondayWithProductos,
  create,
  createMasive,
  update,
  updateEsActiva,
  delete: deleteOferta,
  desactivarByProducto,
  findExpiringIn,
  hasActiveOferta,
};
