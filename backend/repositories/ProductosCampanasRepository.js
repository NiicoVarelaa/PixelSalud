const { pool } = require("../config/database");

// ==================== RELACIONES ====================

const findByCampana = async (idCampana) => {
  const [rows] = await pool.query(
    `SELECT 
        pc.id,
        pc.idCampana,
        pc.idProducto,
        pc.porcentajeDescuentoOverride,
        pc.esActivo,
        pc.fechaAgregado,
        p.nombreProducto,
        p.precio,
        p.stock,
        p.categoria,
        p.img,
        c.porcentajeDescuento as descuentoCampana,
        COALESCE(pc.porcentajeDescuentoOverride, c.porcentajeDescuento) as descuentoFinal
      FROM productos_campanas pc
      JOIN Productos p ON pc.idProducto = p.idProducto
      JOIN campanas_ofertas c ON pc.idCampana = c.idCampana
      WHERE pc.idCampana = ?`,
    [idCampana],
  );
  return rows;
};

const findByProducto = async (idProducto) => {
  const [rows] = await pool.query(
    `SELECT 
        pc.id,
        pc.idCampana,
        pc.idProducto,
        pc.porcentajeDescuentoOverride,
        pc.esActivo,
        pc.fechaAgregado,
        c.nombreCampana,
        c.porcentajeDescuento as descuentoCampana,
        c.fechaInicio,
        c.fechaFin,
        c.esActiva as campanaActiva,
        c.prioridad,
        COALESCE(pc.porcentajeDescuentoOverride, c.porcentajeDescuento) as descuentoFinal
      FROM productos_campanas pc
      JOIN campanas_ofertas c ON pc.idCampana = c.idCampana
      WHERE pc.idProducto = ? AND pc.esActivo = 1
      ORDER BY c.prioridad DESC`,
    [idProducto],
  );
  return rows;
};

const findActiveByCampana = async (idCampana) => {
  const [rows] = await pool.query(
    `SELECT 
        pc.id,
        pc.idCampana,
        pc.idProducto,
        pc.porcentajeDescuentoOverride,
        pc.esActivo,
        pc.fechaAgregado,
        p.nombreProducto,
        p.precio,
        p.stock,
        p.categoria,
        p.img
      FROM productos_campanas pc
      JOIN Productos p ON pc.idProducto = p.idProducto
      WHERE pc.idCampana = ? AND pc.esActivo = 1`,
    [idCampana],
  );
  return rows;
};

const exists = async (idCampana, idProducto) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as existe 
      FROM productos_campanas 
      WHERE idCampana = ? AND idProducto = ?`,
    [idCampana, idProducto],
  );
  return rows[0].existe > 0;
};

// ==================== CREAR/ACTUALIZAR ====================

const create = async (
  idCampana,
  idProducto,
  porcentajeDescuentoOverride = null,
) => {
  const [result] = await pool.query(
    `INSERT INTO productos_campanas 
        (idCampana, idProducto, porcentajeDescuentoOverride, esActivo)
      VALUES (?, ?, ?, 1)`,
    [idCampana, idProducto, porcentajeDescuentoOverride],
  );
  return result.insertId;
};

const addMultiple = async (
  idCampana,
  productosIds,
  porcentajeDescuentoOverride = null,
) => {
  if (productosIds.length === 0) return 0;

  const values = productosIds.map((idProducto) => [
    idCampana,
    idProducto,
    porcentajeDescuentoOverride,
    1, // esActivo
  ]);

  const [result] = await pool.query(
    `INSERT INTO productos_campanas 
        (idCampana, idProducto, porcentajeDescuentoOverride, esActivo)
      VALUES ?
      ON DUPLICATE KEY UPDATE esActivo = 1`,
    [values],
  );

  return result.affectedRows;
};

const updateOverride = async (id, porcentajeDescuentoOverride) => {
  const [result] = await pool.query(
    `UPDATE productos_campanas 
      SET porcentajeDescuentoOverride = ?
      WHERE id = ?`,
    [porcentajeDescuentoOverride, id],
  );
  return result.affectedRows;
};

const toggleActivo = async (id, esActivo) => {
  const [result] = await pool.query(
    `UPDATE productos_campanas 
      SET esActivo = ?
      WHERE id = ?`,
    [esActivo, id],
  );
  return result.affectedRows;
};

// ==================== ELIMINAR ====================

const deleteRelacion = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM productos_campanas WHERE id = ?",
    [id],
  );
  return result.affectedRows;
};

const deleteByProducto = async (idCampana, idProducto) => {
  const [result] = await pool.query(
    "DELETE FROM productos_campanas WHERE idCampana = ? AND idProducto = ?",
    [idCampana, idProducto],
  );
  return result.affectedRows;
};

const deleteMultiple = async (idCampana, productosIds) => {
  if (productosIds.length === 0) return 0;

  const [result] = await pool.query(
    "DELETE FROM productos_campanas WHERE idCampana = ? AND idProducto IN (?)",
    [idCampana, productosIds],
  );
  return result.affectedRows;
};

const deleteByCampana = async (idCampana) => {
  const [result] = await pool.query(
    "DELETE FROM productos_campanas WHERE idCampana = ?",
    [idCampana],
  );
  return result.affectedRows;
};

module.exports = {
  findByCampana,
  findByProducto,
  findActiveByCampana,
  exists,
  create,
  addMultiple,
  updateOverride,
  toggleActivo,
  delete: deleteRelacion,
  deleteByProducto,
  deleteMultiple,
  deleteByCampana,
};
