const { pool } = require("../config/database");

const findByClienteAndProducto = async (idCliente, idProducto) => {
  const sql = `SELECT * FROM Favoritos WHERE idCliente = ? AND idProducto = ?`;
  const [results] = await pool.query(sql, [idCliente, idProducto]);
  return results[0] || null;
};

const exists = async (idCliente, idProducto) => {
  const favorito = await findByClienteAndProducto(idCliente, idProducto);
  return favorito !== null;
};

const create = async (idCliente, idProducto) => {
  const sql = `INSERT INTO Favoritos (idCliente, idProducto) VALUES (?, ?)`;
  const [result] = await pool.query(sql, [idCliente, idProducto]);
  return result.insertId;
};

const deleteByClienteAndProducto = async (idCliente, idProducto) => {
  const sql = `DELETE FROM Favoritos WHERE idCliente = ? AND idProducto = ?`;
  await pool.query(sql, [idCliente, idProducto]);
};

const findAllByClienteWithProductos = async (idCliente) => {
  const sql = `
    SELECT 
      f.idFavorito,
      p.idProducto, 
      p.nombreProducto, 
      p.precio AS precioRegular,
      p.img,
      p.stock,
      p.categoria, 
      f.fechaAgregado,
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
      Favoritos f
    JOIN 
      Productos p ON f.idProducto = p.idProducto
    LEFT JOIN 
      ofertas_old_backup o ON p.idProducto = o.idProducto
      AND o.esActiva = 1 
      AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    WHERE 
      f.idCliente = ?  
      AND p.activo = 1
    ORDER BY 
      f.fechaAgregado DESC
  `;
  const [rows] = await pool.query(sql, [idCliente]);
  return rows;
};

const countByCliente = async (idCliente) => {
  const sql = `SELECT COUNT(*) as count FROM Favoritos WHERE idCliente = ?`;
  const [results] = await pool.query(sql, [idCliente]);
  return results[0].count;
};

module.exports = {
  findByClienteAndProducto,
  exists,
  create,
  deleteByClienteAndProducto,
  findAllByClienteWithProductos,
  countByCliente,
};
