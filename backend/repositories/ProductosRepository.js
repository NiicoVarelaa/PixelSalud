const BaseRepository = require("./BaseRepository");

/**
 * Repository para gestionar el acceso a la tabla Productos
 */
class ProductosRepository extends BaseRepository {
  constructor() {
    super("Productos");
  }

  /**
   * Obtiene todos los productos activos con información de ofertas
   * @returns {Promise<Array>}
   */
  async findAllWithOfertas() {
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
          ofertas o ON p.idProducto = o.idProducto
          AND o.esActiva = 1 
          AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
      ORDER BY 
          p.idProducto
    `;
    return await this.query(sql);
  }

  /**
   * Obtiene un producto por ID con información de ofertas
   * @param {number} idProducto - ID del producto
   * @returns {Promise<Object|null>}
   */
  async findByIdWithOfertas(idProducto) {
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
          ofertas o ON p.idProducto = o.idProducto
          AND o.esActiva = 1 
          AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
      WHERE 
          p.idProducto = ?
      LIMIT 1
    `;
    const rows = await this.query(sql, [idProducto]);
    return rows[0] || null;
  }

  /**
   * Obtiene productos inactivos (dados de baja)
   * @returns {Promise<Array>}
   */
  async findInactivos() {
    const sql = "SELECT * FROM Productos WHERE activo = false";
    return await this.query(sql);
  }

  /**
   * Obtiene productos por categoría con ofertas
   * @param {string} categoria - Nombre de la categoría
   * @returns {Promise<Array>}
   */
  async findByCategoriaWithOfertas(categoria) {
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
          ofertas o ON p.idProducto = o.idProducto
      WHERE 
          p.activo = 1 
          AND p.categoria = ?
          AND o.esActiva = 1 
          AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
      LIMIT 10
    `;
    return await this.query(sql, [categoria]);
  }

  /**
   * Busca productos por término de búsqueda
   * @param {string} term - Término de búsqueda
   * @returns {Promise<Array>}
   */
  async searchByName(term) {
    const sql = `
      SELECT idProducto, nombreProducto, precio, stock, categoria, requiereReceta 
      FROM Productos 
      WHERE LOWER(nombreProducto) LIKE LOWER(?) 
        AND activo = 1 
        AND stock > 0
      LIMIT 10
    `;
    return await this.query(sql, [`%${term}%`]);
  }

  /**
   * Actualiza el estado activo de un producto
   * @param {number} idProducto - ID del producto
   * @param {boolean} activo - Nuevo estado
   * @returns {Promise<boolean>}
   */
  async updateActivo(idProducto, activo) {
    return await this.update(idProducto, { activo }, "idProducto");
  }

  /**
   * Da de baja un producto (activo = false)
   * @param {number} idProducto - ID del producto
   * @returns {Promise<boolean>}
   */
  async darBaja(idProducto) {
    return await this.updateActivo(idProducto, false);
  }

  /**
   * Activa un producto (activo = true)
   * @param {number} idProducto - ID del producto
   * @returns {Promise<boolean>}
   */
  async activar(idProducto) {
    return await this.updateActivo(idProducto, true);
  }

  /**
   * Decrementa el stock de un producto
   * @param {number} idProducto - ID del producto
   * @param {number} cantidad - Cantidad a decrementar
   * @returns {Promise<boolean>}
   */
  async decrementStock(idProducto, cantidad) {
    const sql = `
      UPDATE Productos 
      SET stock = stock - ? 
      WHERE idProducto = ? AND stock >= ?
    `;
    const result = await this.query(sql, [cantidad, idProducto, cantidad]);
    return result.affectedRows > 0;
  }

  /**
   * Verifica si hay stock suficiente
   * @param {number} idProducto - ID del producto
   * @param {number} cantidad - Cantidad requerida
   * @returns {Promise<boolean>}
   */
  async hasStock(idProducto, cantidad) {
    const sql = "SELECT stock FROM Productos WHERE idProducto = ?";
    const rows = await this.query(sql, [idProducto]);
    return rows[0] && rows[0].stock >= cantidad;
  }

  /**
   * Obtiene productos con stock bajo (menos de 5 unidades)
   * @returns {Promise<Array>}
   */
  async findWithLowStock() {
    const sql = `
      SELECT idProducto, nombreProducto, stock, categoria 
      FROM Productos 
      WHERE activo = 1 AND stock < 5 AND stock > 0
      ORDER BY stock ASC
    `;
    return await this.query(sql);
  }
}

module.exports = new ProductosRepository();
