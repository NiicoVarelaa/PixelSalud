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
        
        -- NUEVO: Traemos la segunda imagen con MIN() para evitar el error de GROUP BY
        imgSecundaria.urlImagen as img2, 

        p.categoria,
        p.stock,
        p.activo,
        p.requiereReceta,
        CASE
          WHEN co.tipo = '2X1' THEN NULL
          WHEN co.idCampana IS NOT NULL THEN COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento)
          WHEN o.idOferta IS NOT NULL THEN o.porcentajeDescuento
          ELSE NULL
        END AS porcentajeDescuento,
        CASE
          WHEN co.tipo = '2X1'
          THEN p.precio
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
        CASE WHEN co.tipo = '2X1' THEN TRUE ELSE FALSE END AS promo2x1Activa
    FROM 
        Productos p
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
    
    -- NUEVO JOIN CORREGIDO: Usamos MIN()
    LEFT JOIN (
      SELECT idProducto, MIN(urlImagen) as urlImagen
      FROM ImagenesProductos
      WHERE esPrincipal = FALSE
      GROUP BY idProducto
    ) as imgSecundaria ON p.idProducto = imgSecundaria.idProducto

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
        
        -- NUEVO: Traemos la segunda imagen con MIN() al igual que en findAll
        imgSecundaria.urlImagen as img2,

        p.categoria,
        p.stock,
        p.activo,
        p.requiereReceta,
        CASE
          WHEN co.tipo = '2X1' THEN NULL
          WHEN co.idCampana IS NOT NULL THEN COALESCE(pc.porcentajeDescuentoOverride, co.porcentajeDescuento)
          WHEN o.idOferta IS NOT NULL THEN o.porcentajeDescuento
          ELSE NULL
        END AS porcentajeDescuento,
        CASE
          WHEN co.tipo = '2X1'
          THEN p.precio
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
        CASE WHEN co.tipo = '2X1' THEN TRUE ELSE FALSE END AS promo2x1Activa
    FROM 
        Productos p
    LEFT JOIN (
      SELECT idProducto, urlImagen 
      FROM ImagenesProductos 
      WHERE esPrincipal = TRUE
    ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
    
    -- NUEVO JOIN CORREGIDO: Usamos MIN()
    LEFT JOIN (
      SELECT idProducto, MIN(urlImagen) as urlImagen
      FROM ImagenesProductos
      WHERE esPrincipal = FALSE
      GROUP BY idProducto
    ) as imgSecundaria ON p.idProducto = imgSecundaria.idProducto

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
        
        -- NUEVO: Traemos la segunda imagen para el hover
        imgSecundaria.urlImagen as img2,

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
    
    -- NUEVO JOIN CORREGIDO: Usamos MIN() igual que en las otras consultas
    LEFT JOIN (
      SELECT idProducto, MIN(urlImagen) as urlImagen
      FROM ImagenesProductos
      WHERE esPrincipal = FALSE
      GROUP BY idProducto
    ) as imgSecundaria ON p.idProducto = imgSecundaria.idProducto

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

const upsertOfertaProducto = async (idProducto, porcentajeDescuento, fechaInicio = null, fechaFin = null) => {
  await pool.query(
    `UPDATE Ofertas
     SET esActiva = 0,
         fechaFin = NOW()
     WHERE idProducto = ?
       AND esActiva = 1
       AND NOW() BETWEEN fechaInicio AND fechaFin`,
    [idProducto],
  );

  const inicio = fechaInicio || new Date();
  const fin = fechaFin || new Date(new Date().setFullYear(new Date().getFullYear() + 10));

  const [result] = await pool.query(
    `INSERT INTO Ofertas (idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva)
     VALUES (?, ?, ?, ?, 1)`,
    [idProducto, porcentajeDescuento, inicio, fin],
  );

  return result.affectedRows > 0;
};

const desactivarOfertaProducto = async (idProducto) => {
  const [result] = await pool.query(
    `UPDATE Ofertas
     SET esActiva = 0,
         fechaFin = NOW()
     WHERE idProducto = ?
       AND esActiva = 1
       AND NOW() BETWEEN fechaInicio AND fechaFin`,
    [idProducto],
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

const enrichProductsWithImages = async (productos) => {
  if (!productos || productos.length === 0) return [];

  return Promise.all(
    productos.map((producto) => enrichProductWithImages(producto)),
  );
};

const findAllWithOfertasAndImages = async () => {
  const productos = await findAllWithOfertas();
  return enrichProductsWithImages(productos);
};

const findByIdWithOfertasAndImages = async (idProducto) => {
  const producto = await findByIdWithOfertas(idProducto);
  return enrichProductWithImages(producto);
};

const searchByNameWithImages = async (term) => {
  const productos = await searchByName(term);
  return enrichProductsWithImages(productos);
};

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
  upsertOfertaProducto,
  desactivarOfertaProducto,
  exists,
  updateActivo,
  darBaja,
  activar,
  decrementStock,
  hasStock,
  findWithLowStock,
  enrichProductWithImages,
  enrichProductsWithImages,
  findAllWithOfertasAndImages,
  findByIdWithOfertasAndImages,
  searchByNameWithImages,
  findByCategoriaWithOfertasAndImages,
};
