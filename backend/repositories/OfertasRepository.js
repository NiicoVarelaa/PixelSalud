const BaseRepository = require("./BaseRepository");

/**
 * Repository para gestionar el acceso a la tabla Ofertas
 */
class OfertasRepository extends BaseRepository {
  constructor() {
    super("ofertas");
  }

  /**
   * Obtiene todas las ofertas con información de productos
   * @returns {Promise<Array>}
   */
  async findAllWithProductos() {
    const sql = `
      SELECT 
          o.*, 
          p.nombreProducto 
      FROM 
          ofertas o
      JOIN 
          Productos p ON o.idProducto = p.idProducto
      ORDER BY o.fechaFin DESC
    `;
    return await this.query(sql);
  }

  /**
   * Obtiene una oferta por ID con información del producto
   * @param {number} idOferta - ID de la oferta
   * @returns {Promise<Object|null>}
   */
  async findByIdWithProducto(idOferta) {
    const sql = `
      SELECT 
          o.*, 
          p.nombreProducto 
      FROM 
          ofertas o
      JOIN 
          Productos p ON o.idProducto = p.idProducto
      WHERE 
          o.idOferta = ?
    `;
    const rows = await this.query(sql, [idOferta]);
    return rows[0] || null;
  }

  /**
   * Obtiene ofertas activas de un producto específico
   * @param {number} idProducto - ID del producto
   * @returns {Promise<Array>}
   */
  async findActiveByProducto(idProducto) {
    const sql = `
      SELECT * FROM ofertas 
      WHERE idProducto = ? 
        AND esActiva = 1 
        AND NOW() BETWEEN fechaInicio AND fechaFin
    `;
    return await this.query(sql, [idProducto]);
  }

  /**
   * Obtiene ofertas de Cyber Monday (25% de descuento)
   * @param {number} descuento - Porcentaje de descuento (default: 25)
   * @param {string} fechaFin - Fecha de finalización específica
   * @returns {Promise<Array>}
   */
  async findCyberMondayWithProductos(
    descuento = 25.0,
    fechaFin = "2026-12-31 23:59:59",
  ) {
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
          AND o.esActiva = 1 
          AND o.porcentajeDescuento = ?
          AND o.fechaFin = ?
          AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
      ORDER BY
          p.idProducto
    `;
    return await this.query(sql, [descuento, fechaFin]);
  }

  /**
   * Crea ofertas masivas (para eventos como Cyber Monday)
   * @param {Array<number>} productIds - Array de IDs de productos
   * @param {number} porcentajeDescuento - Porcentaje de descuento
   * @param {string} fechaInicio - Fecha de inicio
   * @param {string} fechaFin - Fecha de fin
   * @returns {Promise<Object>} Resultado de la inserción
   */
  async createMasive(productIds, porcentajeDescuento, fechaInicio, fechaFin) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("Se requiere al menos un ID de producto");
    }

    const ofertaValues = productIds.map(
      (idProducto) => [
        idProducto,
        porcentajeDescuento,
        fechaInicio,
        fechaFin,
        1,
      ], // esActiva = 1
    );

    const sql = `
      INSERT INTO ofertas (idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva) 
      VALUES ?
    `;

    const result = await this.query(sql, [ofertaValues]);
    return {
      affectedRows: result.affectedRows,
      insertId: result.insertId,
    };
  }

  /**
   * Actualiza el estado activo de una oferta
   * @param {number} idOferta - ID de la oferta
   * @param {boolean} esActiva - Nuevo estado
   * @returns {Promise<boolean>}
   */
  async updateEsActiva(idOferta, esActiva) {
    return await this.update(idOferta, { esActiva }, "idOferta");
  }

  /**
   * Desactiva todas las ofertas de un producto
   * @param {number} idProducto - ID del producto
   * @returns {Promise<boolean>}
   */
  async desactivarByProducto(idProducto) {
    const sql = "UPDATE ofertas SET esActiva = 0 WHERE idProducto = ?";
    const result = await this.query(sql, [idProducto]);
    return result.affectedRows > 0;
  }

  /**
   * Obtiene ofertas que expiran pronto (en los próximos N días)
   * @param {number} dias - Número de días
   * @returns {Promise<Array>}
   */
  async findExpiringIn(dias = 7) {
    const sql = `
      SELECT 
          o.*, 
          p.nombreProducto,
          DATEDIFF(o.fechaFin, NOW()) as diasRestantes
      FROM 
          ofertas o
      JOIN 
          Productos p ON o.idProducto = p.idProducto
      WHERE 
          o.esActiva = 1 
          AND o.fechaFin > NOW()
          AND DATEDIFF(o.fechaFin, NOW()) <= ?
      ORDER BY o.fechaFin ASC
    `;
    return await this.query(sql, [dias]);
  }

  /**
   * Verifica si un producto ya tiene una oferta activa
   * @param {number} idProducto - ID del producto
   * @returns {Promise<boolean>}
   */
  async hasActiveOferta(idProducto) {
    const ofertas = await this.findActiveByProducto(idProducto);
    return ofertas.length > 0;
  }
}

module.exports = OfertasRepository;
