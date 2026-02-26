const { pool } = require("../config/database");

/**
 * Repository para gestionar las imágenes de productos
 * Maneja la tabla ImagenesProductos
 */

// Obtener todas las imágenes de un producto
const findByProductoId = async (idProducto) => {
  const sql = `
    SELECT 
      idImagen,
      idProducto,
      urlImagen,
      orden,
      esPrincipal,
      altText,
      fechaCreacion
    FROM ImagenesProductos
    WHERE idProducto = ?
    ORDER BY esPrincipal DESC, orden ASC
  `;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows;
};

// Obtener la imagen principal de un producto
const findPrincipalByProductoId = async (idProducto) => {
  const sql = `
    SELECT 
      idImagen,
      idProducto,
      urlImagen,
      orden,
      esPrincipal,
      altText,
      fechaCreacion
    FROM ImagenesProductos
    WHERE idProducto = ? AND esPrincipal = TRUE
    LIMIT 1
  `;
  const [rows] = await pool.query(sql, [idProducto]);
  return rows[0] || null;
};

// Obtener una imagen específica por ID
const findById = async (idImagen) => {
  const sql = `
    SELECT 
      idImagen,
      idProducto,
      urlImagen,
      orden,
      esPrincipal,
      altText,
      fechaCreacion
    FROM ImagenesProductos
    WHERE idImagen = ?
  `;
  const [rows] = await pool.query(sql, [idImagen]);
  return rows[0] || null;
};

// Crear una nueva imagen para un producto
const create = async (data) => {
  const {
    idProducto,
    urlImagen,
    orden = 1,
    esPrincipal = false,
    altText,
  } = data;

  // Si es principal, desmarcar las demás como principales
  if (esPrincipal) {
    await pool.query(
      "UPDATE ImagenesProductos SET esPrincipal = FALSE WHERE idProducto = ?",
      [idProducto],
    );
  }

  const [result] = await pool.query(
    `INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText)
     VALUES (?, ?, ?, ?, ?)`,
    [idProducto, urlImagen, orden, esPrincipal, altText],
  );

  return result.insertId;
};

// Crear múltiples imágenes en batch
const createMany = async (idProducto, imagenes) => {
  if (!imagenes || imagenes.length === 0) return [];

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const ids = [];

    for (let i = 0; i < imagenes.length; i++) {
      const imagen = imagenes[i];
      const esPrincipal = i === 0 || imagen.esPrincipal === true;

      // Si es la primera imagen o está marcada como principal, desmarcar las demás
      if (esPrincipal) {
        await connection.query(
          "UPDATE ImagenesProductos SET esPrincipal = FALSE WHERE idProducto = ?",
          [idProducto],
        );
      }

      const [result] = await connection.query(
        `INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText)
         VALUES (?, ?, ?, ?, ?)`,
        [
          idProducto,
          imagen.urlImagen,
          imagen.orden || i + 1,
          esPrincipal,
          imagen.altText || null,
        ],
      );

      ids.push(result.insertId);
    }

    await connection.commit();
    return ids;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Actualizar una imagen
const update = async (idImagen, data) => {
  const { urlImagen, orden, esPrincipal, altText } = data;

  // Si se marca como principal, desmarcar las demás del mismo producto
  if (esPrincipal) {
    const imagen = await findById(idImagen);
    if (imagen) {
      await pool.query(
        "UPDATE ImagenesProductos SET esPrincipal = FALSE WHERE idProducto = ? AND idImagen != ?",
        [imagen.idProducto, idImagen],
      );
    }
  }

  const [result] = await pool.query(
    `UPDATE ImagenesProductos 
     SET urlImagen = COALESCE(?, urlImagen),
         orden = COALESCE(?, orden),
         esPrincipal = COALESCE(?, esPrincipal),
         altText = COALESCE(?, altText)
     WHERE idImagen = ?`,
    [urlImagen, orden, esPrincipal, altText, idImagen],
  );

  return result.affectedRows > 0;
};

// Establecer una imagen como principal
const setPrincipal = async (idImagen) => {
  const imagen = await findById(idImagen);
  if (!imagen) return false;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Desmarcar todas las imágenes del producto
    await connection.query(
      "UPDATE ImagenesProductos SET esPrincipal = FALSE WHERE idProducto = ?",
      [imagen.idProducto],
    );

    // Marcar la seleccionada como principal
    await connection.query(
      "UPDATE ImagenesProductos SET esPrincipal = TRUE WHERE idImagen = ?",
      [idImagen],
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Eliminar una imagen
const deleteById = async (idImagen) => {
  const [result] = await pool.query(
    "DELETE FROM ImagenesProductos WHERE idImagen = ?",
    [idImagen],
  );
  return result.affectedRows > 0;
};

// Eliminar todas las imágenes de un producto
const deleteByProductoId = async (idProducto) => {
  const [result] = await pool.query(
    "DELETE FROM ImagenesProductos WHERE idProducto = ?",
    [idProducto],
  );
  return result.affectedRows;
};

// Actualizar el orden de las imágenes
const updateOrden = async (reordenamientos) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const item of reordenamientos) {
      await connection.query(
        "UPDATE ImagenesProductos SET orden = ? WHERE idImagen = ?",
        [item.orden, item.idImagen],
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  findByProductoId,
  findPrincipalByProductoId,
  findById,
  create,
  createMany,
  update,
  setPrincipal,
  deleteById,
  deleteByProductoId,
  updateOrden,
};
