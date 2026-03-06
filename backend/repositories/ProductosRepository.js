const { pool } = require("../config/database");
const imagenesRepository = require("./ImagenesProductosRepository");

const findAllWithOfertas = async () => {
  const sql = `
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcion,
        p.precio AS precioRegular,
        COALESCE(imgPrincipal.urlImagen, p.img) as img,
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
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
    LEFT JOIN 
        Ofertas o ON p.idProducto = o.idProducto
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
        COALESCE(imgPrincipal.urlImagen, p.img) as img,
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
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
    LEFT JOIN 
        Ofertas o ON p.idProducto = o.idProducto
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
        COALESCE(imgPrincipal.urlImagen, p.img) as img,
        p.categoria,
        o.porcentajeDescuento,
        p.precio * (1 - o.porcentajeDescuento / 100) AS precioFinal,
        TRUE AS enOferta
    FROM 
        Productos p
    INNER JOIN 
        Ofertas o ON p.idProducto = o.idProducto
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
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
    SELECT 
      p.idProducto, 
      p.nombreProducto, 
      p.precio, 
      COALESCE(imgPrincipal.urlImagen, p.img) as img, 
      p.stock, 
      p.categoria, 
      p.requiereReceta 
    FROM Productos p
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
    WHERE LOWER(p.nombreProducto) LIKE LOWER(?) 
      AND p.activo = 1 
      AND p.stock > 0
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

// ===============================================
// FUNCIONES HELPERS PARA IMÁGENES
// ===============================================

/**
 * Enriquece un producto con sus imágenes desde la tabla ImagenesProductos
 * Mantiene compatibilidad con el campo 'img' legacy
 */
const enrichProductWithImages = async (producto) => {
  if (!producto) return null;

  try {
    const imagenes = await imagenesRepository.findByProductoId(
      producto.idProducto,
    );

    return {
      ...producto,
      imagenes:
        imagenes.length > 0
          ? imagenes
          : [
              // Si no hay imágenes en la nueva tabla pero existe img legacy, usarla
              ...(producto.img
                ? [
                    {
                      idImagen: null,
                      urlImagen: producto.img,
                      orden: 1,
                      esPrincipal: true,
                      altText: producto.nombreProducto,
                    },
                  ]
                : []),
            ],
    };
  } catch (error) {
    console.error("Error al enriquecer producto con imágenes:", error);
    // En caso de error, devolver el producto con img legacy
    return {
      ...producto,
      imagenes: producto.img
        ? [
            {
              idImagen: null,
              urlImagen: producto.img,
              orden: 1,
              esPrincipal: true,
              altText: producto.nombreProducto,
            },
          ]
        : [],
    };
  }
};

/**
 * Enriquece un array de productos con sus imágenes
 */
const enrichProductsWithImages = async (productos) => {
  if (!productos || productos.length === 0) return [];

  return Promise.all(
    productos.map((producto) => enrichProductWithImages(producto)),
  );
};

/**
 * Obtiene todos los productos con ofertas e imágenes
 */
const findAllWithOfertasAndImages = async () => {
  const productos = await findAllWithOfertas();
  return enrichProductsWithImages(productos);
};

/**
 * Obtiene un producto por ID con ofertas e imágenes
 */
const findByIdWithOfertasAndImages = async (idProducto) => {
  const producto = await findByIdWithOfertas(idProducto);
  return enrichProductWithImages(producto);
};

/**
 * Busca productos por nombre con imágenes
 */
const searchByNameWithImages = async (term) => {
  const productos = await searchByName(term);
  return enrichProductsWithImages(productos);
};

/**
 * Obtiene productos por categoría con ofertas e imágenes
 */
const findByCategoriaWithOfertasAndImages = async (categoria) => {
  const productos = await findByCategoriaWithOfertas(categoria);
  return enrichProductsWithImages(productos);
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
  // Nuevas funciones con imágenes
  enrichProductWithImages,
  enrichProductsWithImages,
  findAllWithOfertasAndImages,
  findByIdWithOfertasAndImages,
  searchByNameWithImages,
  findByCategoriaWithOfertasAndImages,
};
