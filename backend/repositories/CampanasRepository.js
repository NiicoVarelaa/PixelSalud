const { pool } = require("../config/database");

// ==================== CAMPAÑAS ====================

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT 
        idCampana, 
        nombreCampana, 
        descripcion, 
        porcentajeDescuento, 
        fechaInicio, 
        fechaFin, 
        esActiva, 
        tipo, 
        prioridad,
        created_at,
        updated_at
      FROM campanas_ofertas
      ORDER BY prioridad DESC, fechaInicio DESC`,
  );
  return rows;
};

const findActive = async () => {
  const [rows] = await pool.query(
    `SELECT 
        idCampana, 
        nombreCampana, 
        descripcion, 
        porcentajeDescuento, 
        fechaInicio, 
        fechaFin, 
        esActiva, 
        tipo, 
        prioridad,
        created_at,
        updated_at
      FROM campanas_ofertas
      WHERE esActiva = 1 
        AND fechaInicio <= NOW() 
        AND fechaFin >= NOW()
      ORDER BY prioridad DESC`,
  );
  return rows;
};

const findById = async (idCampana) => {
  const [rows] = await pool.query(
    `SELECT 
        idCampana, 
        nombreCampana, 
        descripcion, 
        porcentajeDescuento, 
        fechaInicio, 
        fechaFin, 
        esActiva, 
        tipo, 
        prioridad,
        created_at,
        updated_at
      FROM campanas_ofertas
      WHERE idCampana = ?`,
    [idCampana],
  );
  return rows[0];
};

const findByNombre = async (nombreCampana) => {
  const [rows] = await pool.query(
    `SELECT 
        idCampana, 
        nombreCampana, 
        descripcion, 
        porcentajeDescuento, 
        fechaInicio, 
        fechaFin, 
        esActiva, 
        tipo, 
        prioridad,
        created_at,
        updated_at
      FROM campanas_ofertas
      WHERE nombreCampana = ?`,
    [nombreCampana],
  );
  return rows[0];
};

const findWithProductos = async (idCampana) => {
  const [rows] = await pool.query(
    `SELECT 
        c.idCampana, 
        c.nombreCampana, 
        c.descripcion, 
        c.porcentajeDescuento as descuentoCampana, 
        c.fechaInicio, 
        c.fechaFin, 
        c.esActiva, 
        c.tipo, 
        c.prioridad,
        p.idProducto,
        p.nombreProducto,
        p.precio,
        p.stock,
        p.categoria,
        p.img,
        pc.porcentajeDescuentoOverride,
        pc.esActivo as productoActivo,
        COALESCE(pc.porcentajeDescuentoOverride, c.porcentajeDescuento) as descuentoFinal
      FROM campanas_ofertas c
      LEFT JOIN productos_campanas pc ON c.idCampana = pc.idCampana
      LEFT JOIN Productos p ON pc.idProducto = p.idProducto
      WHERE c.idCampana = ?`,
    [idCampana],
  );
  return rows;
};

const create = async (campanaData) => {
  const {
    nombreCampana,
    descripcion,
    porcentajeDescuento,
    fechaInicio,
    fechaFin,
    esActiva = 1,
    tipo = "DESCUENTO",
    prioridad = 0,
  } = campanaData;

  const [result] = await pool.query(
    `INSERT INTO campanas_ofertas 
        (nombreCampana, descripcion, porcentajeDescuento, fechaInicio, fechaFin, esActiva, tipo, prioridad)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombreCampana,
      descripcion,
      porcentajeDescuento,
      fechaInicio,
      fechaFin,
      esActiva,
      tipo,
      prioridad,
    ],
  );

  return result.insertId;
};

const update = async (idCampana, campanaData) => {
  const fields = [];
  const values = [];

  if (campanaData.nombreCampana !== undefined) {
    fields.push("nombreCampana = ?");
    values.push(campanaData.nombreCampana);
  }
  if (campanaData.descripcion !== undefined) {
    fields.push("descripcion = ?");
    values.push(campanaData.descripcion);
  }
  if (campanaData.porcentajeDescuento !== undefined) {
    fields.push("porcentajeDescuento = ?");
    values.push(campanaData.porcentajeDescuento);
  }
  if (campanaData.fechaInicio !== undefined) {
    fields.push("fechaInicio = ?");
    values.push(campanaData.fechaInicio);
  }
  if (campanaData.fechaFin !== undefined) {
    fields.push("fechaFin = ?");
    values.push(campanaData.fechaFin);
  }
  if (campanaData.esActiva !== undefined) {
    fields.push("esActiva = ?");
    values.push(campanaData.esActiva);
  }
  if (campanaData.tipo !== undefined) {
    fields.push("tipo = ?");
    values.push(campanaData.tipo);
  }
  if (campanaData.prioridad !== undefined) {
    fields.push("prioridad = ?");
    values.push(campanaData.prioridad);
  }

  if (fields.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  values.push(idCampana);

  const [result] = await pool.query(
    `UPDATE campanas_ofertas SET ${fields.join(", ")} WHERE idCampana = ?`,
    values,
  );

  return result.affectedRows;
};

const deleteCampana = async (idCampana) => {
  const [result] = await pool.query(
    "DELETE FROM campanas_ofertas WHERE idCampana = ?",
    [idCampana],
  );
  return result.affectedRows;
};

// ==================== ESTADÍSTICAS ====================

const countProductos = async (idCampana) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as total 
      FROM productos_campanas 
      WHERE idCampana = ? AND esActivo = 1`,
    [idCampana],
  );
  return rows[0].total;
};

const findExpiringIn = async (dias = 7) => {
  const [rows] = await pool.query(
    `SELECT 
        idCampana, 
        nombreCampana, 
        descripcion, 
        porcentajeDescuento, 
        fechaInicio, 
        fechaFin, 
        esActiva, 
        tipo, 
        prioridad,
        DATEDIFF(fechaFin, NOW()) as diasRestantes
      FROM campanas_ofertas
      WHERE esActiva = 1 
        AND fechaFin > NOW() 
        AND fechaFin <= DATE_ADD(NOW(), INTERVAL ? DAY)
      ORDER BY fechaFin ASC`,
    [dias],
  );
  return rows;
};

module.exports = {
  findAll,
  findActive,
  findById,
  findByNombre,
  findWithProductos,
  create,
  update,
  delete: deleteCampana,
  countProductos,
  findExpiringIn,
};
