const { pool } = require("../config/database");

const findByClienteWithProducts = async (idCliente) => {
  const query = `
    SELECT 
      c.idCarrito, 
      c.cantidad, 
      p.idProducto, 
      p.nombreProducto, 
      p.precio AS precioRegular,
      COALESCE(imgPrincipal.urlImagen, p.img) as img,
      p.stock,
      p.activo,
      CASE
        WHEN co.tipo = '2X1' THEN NULL
        WHEN co.idCampana IS NOT NULL THEN COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento)
        WHEN o.idOferta IS NOT NULL THEN o.porcentajeDescuento
        ELSE NULL
      END AS porcentajeDescuento,
      CASE
        WHEN co.tipo = '2X1'
        THEN (p.precio * CEIL(c.cantidad / 2)) / c.cantidad
        WHEN co.idCampana IS NOT NULL
        THEN p.precio * (1 - COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento) / 100)
        WHEN o.idOferta IS NOT NULL
        THEN p.precio * (1 - o.porcentajeDescuento / 100)
        ELSE p.precio
      END AS precioFinal, 
      CASE
        WHEN co.idCampana IS NOT NULL OR o.idOferta IS NOT NULL
        THEN TRUE
        ELSE FALSE
      END AS enOferta,
      co.tipo AS tipoPromocion,
      CASE WHEN co.tipo = '2X1' THEN TRUE ELSE FALSE END AS promo2x1Activa,
      CASE
        WHEN co.tipo = '2X1'
        THEN p.precio * CEIL(c.cantidad / 2)
        WHEN co.idCampana IS NOT NULL
        THEN (p.precio * (1 - COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento) / 100)) * c.cantidad
        WHEN o.idOferta IS NOT NULL
        THEN (p.precio * (1 - o.porcentajeDescuento / 100)) * c.cantidad
        ELSE p.precio * c.cantidad
      END AS subtotalItem
    FROM Carrito c
    JOIN Productos p ON c.idProducto = p.idProducto
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
    LEFT JOIN productos_campanas pc ON pc.id = (
      SELECT pc2.id
      FROM productos_campanas pc2
      JOIN campanas_ofertas co2 ON co2.idCampana = pc2.idCampana
      WHERE pc2.idProducto = p.idProducto
        AND pc2.esActivo = 1
        AND co2.esActiva = 1
        AND NOW() BETWEEN co2.fechaInicio AND co2.fechaFin
      ORDER BY
        CASE WHEN co2.tipo = '2X1' THEN 1 ELSE 0 END DESC,
        co2.prioridad DESC,
        COALESCE(pc2.porcentajeDescuentoOverride, co2.porcentajeDescuento) DESC,
        pc2.id DESC
      LIMIT 1
    )
    LEFT JOIN campanas_ofertas co ON co.idCampana = pc.idCampana
    LEFT JOIN Ofertas o ON p.idProducto = o.idProducto
      AND o.esActiva = 1 
      AND co.idCampana IS NULL
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
