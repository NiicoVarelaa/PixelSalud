const { pool } = require("../config/database");

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

const findById = async (idProducto) => {
  const [rows] = await pool.query(
    "SELECT * FROM Productos WHERE idProducto = ?",
    [idProducto],
  );
  return rows[0] || null;
};

const findInactivos = async () => {
  const sql = "SELECT * FROM Productos WHERE activo = false";
  const [rows] = await pool.query(sql);
  return rows;
};

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

const updateActivo = async (idProducto, activo) => {
  return await update(idProducto, { activo });
};

const darBaja = async (idProducto) => {
  return await updateActivo(idProducto, false);
};

const activar = async (idProducto) => {
  return await updateActivo(idProducto, true);
};

const decrementStock = async (idProducto, cantidad) => {
  const sql = `
    UPDATE Productos 
    SET stock = stock - ? 
    WHERE idProducto = ? AND stock >= ?
  `;
  const [result] = await pool.query(sql, [cantidad, idProducto, cantidad]);
  return result.affectedRows > 0;
};

const hasStock = async (idProducto, cantidad) => {
  const sql = "SELECT stock FROM Productos WHERE idProducto = ?";
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] && rows[0].stock >= cantidad;
};

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
