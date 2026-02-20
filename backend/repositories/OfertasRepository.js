const { pool } = require("../config/database");

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

const findById = async (idOferta) => {
  const [rows] = await pool.query(
    "SELECT * FROM ofertas_old_backup WHERE idOferta = ?",
    [idOferta],
  );
  return rows[0] || null;
};

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
    1, 
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

const updateEsActiva = async (idOferta, esActiva) => {
  return await update(idOferta, { esActiva });
};

const deleteOferta = async (idOferta) => {
  const [result] = await pool.query(
    "DELETE FROM ofertas_old_backup WHERE idOferta = ?",
    [idOferta],
  );
  return result.affectedRows > 0;
};

const desactivarByProducto = async (idProducto) => {
  const sql = "UPDATE ofertas_old_backup SET esActiva = 0 WHERE idProducto = ?";
  const [result] = await pool.query(sql, [idProducto]);
  return result.affectedRows > 0;
};

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
