const productosRepository = require("../repositories/ProductosRepository");
const ofertasRepository = require("../repositories/OfertasRepository");
const { NotFoundError, ValidationError, ConflictError } = require("../errors");

/**
 * Service para la lógica de negocio de Productos
 */
class ProductosService {
  constructor() {
    this.productosRepo = productosRepository;
    this.ofertasRepo = ofertasRepository;
  }

  /**
   * Obtiene todos los productos con información de ofertas
   * @returns {Promise<Array>}
   */
  async obtenerProductos() {
    return await this.productosRepo.findAllWithOfertas();
  }

  /**
   * Obtiene un producto por ID con información de ofertas
   * @param {number} idProducto - ID del producto
   * @returns {Promise<Object>}
   * @throws {NotFoundError} Si el producto no existe
   */
  async obtenerProductoPorId(idProducto) {
    const producto = await this.productosRepo.findByIdWithOfertas(idProducto);

    if (!producto) {
      throw new NotFoundError("Producto no encontrado");
    }

    return producto;
  }

  /**
   * Obtiene productos inactivos (dados de baja)
   * @returns {Promise<Array>}
   * @throws {NotFoundError} Si no hay productos inactivos
   */
  async obtenerProductosInactivos() {
    const productos = await this.productosRepo.findInactivos();

    if (productos.length === 0) {
      throw new NotFoundError("No hay productos dados de baja");
    }

    return productos;
  }

  /**
   * Obtiene ofertas destacadas de una categoría específica
   * @param {string} categoria - Nombre de la categoría (default: "Dermocosmética")
   * @returns {Promise<Array>}
   */
  async obtenerOfertasDestacadas(categoria = "Dermocosmética") {
    return await this.productosRepo.findByCategoriaWithOfertas(categoria);
  }

  /**
   * Busca productos por término
   * @param {string} term - Término de búsqueda
   * @returns {Promise<Array>}
   * @throws {ValidationError} Si el término es muy corto
   */
  async buscarProductos(term) {
    if (!term || term.length < 3) {
      throw new ValidationError(
        "El término de búsqueda debe tener al menos 3 caracteres",
      );
    }

    return await this.productosRepo.searchByName(term);
  }

  /**
   * Crea un nuevo producto
   * @param {Object} data - Datos del producto
   * @returns {Promise<Object>} Producto creado
   * @throws {ValidationError} Si faltan datos o son inválidos
   * @throws {ConflictError} Si el producto ya existe
   */
  async crearProducto(data) {
    // Validaciones de negocio
    if (data.precio < 0) {
      throw new ValidationError("El precio no puede ser negativo");
    }

    if (data.stock < 0) {
      throw new ValidationError("El stock no puede ser negativo");
    }

    // Verificar si ya existe un producto con el mismo nombre
    const existe = await this.productosRepo.exists({
      nombreProducto: data.nombreProducto,
    });

    if (existe) {
      throw new ConflictError("Ya existe un producto con ese nombre");
    }

    // Agregar activo = true por defecto
    const productoData = {
      ...data,
      activo: true,
    };

    const idProducto = await this.productosRepo.create(productoData);
    return await this.productosRepo.findByIdWithOfertas(idProducto);
  }

  /**
   * Actualiza un producto existente
   * @param {number} idProducto - ID del producto
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   * @throws {NotFoundError} Si el producto no existe
   * @throws {ValidationError} Si los datos son inválidos
   */
  async actualizarProducto(idProducto, data) {
    // Verificar que el producto existe
    const existe = await this.productosRepo.findById(idProducto, "idProducto");
    if (!existe) {
      throw new NotFoundError("Producto no encontrado");
    }

    // Validaciones de negocio
    if (data.precio !== undefined && data.precio < 0) {
      throw new ValidationError("El precio no puede ser negativo");
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new ValidationError("El stock no puede ser negativo");
    }

    const actualizado = await this.productosRepo.update(
      idProducto,
      data,
      "idProducto",
    );

    if (!actualizado) {
      throw new Error("Error al actualizar el producto");
    }

    return await this.productosRepo.findByIdWithOfertas(idProducto);
  }

  /**
   * Actualiza solo el estado activo de un producto
   * @param {number} idProducto - ID del producto
   * @param {boolean} activo - Nuevo estado
   * @returns {Promise<boolean>}
   * @throws {NotFoundError} Si el producto no existe
   */
  async actualizarEstadoActivo(idProducto, activo) {
    const existe = await this.productosRepo.findById(idProducto, "idProducto");
    if (!existe) {
      throw new NotFoundError("Producto no encontrado");
    }

    return await this.productosRepo.updateActivo(idProducto, activo);
  }

  /**
   * Da de baja un producto (activo = false)
   * @param {number} idProducto - ID del producto
   * @returns {Promise<boolean>}
   * @throws {NotFoundError} Si el producto no existe
   */
  async darBajaProducto(idProducto) {
    const existe = await this.productosRepo.findById(idProducto, "idProducto");
    if (!existe) {
      throw new NotFoundError("Producto no encontrado");
    }

    return await this.productosRepo.darBaja(idProducto);
  }

  /**
   * Activa un producto (activo = true)
   * @param {number} idProducto - ID del producto
   * @returns {Promise<boolean>}
   * @throws {NotFoundError} Si el producto no existe
   */
  async activarProducto(idProducto) {
    const existe = await this.productosRepo.findById(idProducto, "idProducto");
    if (!existe) {
      throw new NotFoundError("Producto no encontrado");
    }

    return await this.productosRepo.activar(idProducto);
  }

  // ==========================================
  // MÉTODOS PARA OFERTAS
  // ==========================================

  /**
   * Obtiene todas las ofertas con información de productos
   * @returns {Promise<Array>}
   */
  async obtenerOfertas() {
    return await this.ofertasRepo.findAllWithProductos();
  }

  /**
   * Obtiene una oferta por ID
   * @param {number} idOferta - ID de la oferta
   * @returns {Promise<Object>}
   * @throws {NotFoundError} Si la oferta no existe
   */
  async obtenerOfertaPorId(idOferta) {
    const oferta = await this.ofertasRepo.findByIdWithProducto(idOferta);

    if (!oferta) {
      throw new NotFoundError("Oferta no encontrada");
    }

    return oferta;
  }

  /**
   * Crea una nueva oferta
   * @param {Object} data - Datos de la oferta
   * @returns {Promise<Object>} Oferta creada
   * @throws {ValidationError} Si los datos son inválidos
   * @throws {ConflictError} Si el producto ya tiene una oferta activa
   */
  async crearOferta(data) {
    const { idProducto, porcentajeDescuento, fechaInicio, fechaFin } = data;

    // Validaciones de negocio
    if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
      throw new ValidationError(
        "El porcentaje de descuento debe estar entre 0 y 100",
      );
    }

    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    if (fechaFinDate <= fechaInicioDate) {
      throw new ValidationError(
        "La fecha de fin debe ser posterior a la fecha de inicio",
      );
    }

    // Verificar que el producto existe
    const producto = await this.productosRepo.findById(
      idProducto,
      "idProducto",
    );
    if (!producto) {
      throw new NotFoundError("Producto no encontrado");
    }

    // Verificar si ya tiene una oferta activa
    const tieneOferta = await this.ofertasRepo.hasActiveOferta(idProducto);
    if (tieneOferta) {
      throw new ConflictError("El producto ya tiene una oferta activa");
    }

    const ofertaData = {
      idProducto,
      porcentajeDescuento,
      fechaInicio,
      fechaFin,
      esActiva: 1,
    };

    const idOferta = await this.ofertasRepo.create(ofertaData);
    return await this.ofertasRepo.findByIdWithProducto(idOferta);
  }

  /**
   * Actualiza una oferta existente
   * @param {number} idOferta - ID de la oferta
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Oferta actualizada
   * @throws {NotFoundError} Si la oferta no existe
   * @throws {ValidationError} Si los datos son inválidos
   */
  async actualizarOferta(idOferta, data) {
    const existe = await this.ofertasRepo.findById(idOferta, "idOferta");
    if (!existe) {
      throw new NotFoundError("Oferta no encontrada");
    }

    // Validaciones
    if (
      data.porcentajeDescuento !== undefined &&
      (data.porcentajeDescuento < 0 || data.porcentajeDescuento > 100)
    ) {
      throw new ValidationError(
        "El porcentaje de descuento debe estar entre 0 y 100",
      );
    }

    if (data.fechaInicio && data.fechaFin) {
      const fechaInicioDate = new Date(data.fechaInicio);
      const fechaFinDate = new Date(data.fechaFin);

      if (fechaFinDate <= fechaInicioDate) {
        throw new ValidationError(
          "La fecha de fin debe ser posterior a la fecha de inicio",
        );
      }
    }

    const actualizado = await this.ofertasRepo.update(
      idOferta,
      data,
      "idOferta",
    );

    if (!actualizado) {
      throw new Error("Error al actualizar la oferta");
    }

    return await this.ofertasRepo.findByIdWithProducto(idOferta);
  }

  /**
   * Actualiza solo el estado activo de una oferta
   * @param {number} idOferta - ID de la oferta
   * @param {boolean} esActiva - Nuevo estado
   * @returns {Promise<boolean>}
   * @throws {NotFoundError} Si la oferta no existe
   */
  async actualizarEstadoOferta(idOferta, esActiva) {
    const existe = await this.ofertasRepo.findById(idOferta, "idOferta");
    if (!existe) {
      throw new NotFoundError("Oferta no encontrada");
    }

    return await this.ofertasRepo.updateEsActiva(idOferta, esActiva);
  }

  /**
   * Elimina una oferta
   * @param {number} idOferta - ID de la oferta
   * @returns {Promise<boolean>}
   * @throws {NotFoundError} Si la oferta no existe
   */
  async eliminarOferta(idOferta) {
    const existe = await this.ofertasRepo.findById(idOferta, "idOferta");
    if (!existe) {
      throw new NotFoundError("Oferta no encontrada");
    }

    return await this.ofertasRepo.delete(idOferta, "idOferta");
  }

  /**
   * Crea ofertas masivas (Cyber Monday u otros eventos)
   * @param {Array<number>} productIds - IDs de productos
   * @param {number} porcentajeDescuento - Porcentaje de descuento
   * @param {string} fechaFin - Fecha de finalización
   * @returns {Promise<Object>} Resultado de la operación
   * @throws {ValidationError} Si los datos son inválidos
   */
  async crearOfertasMasivas(
    productIds,
    porcentajeDescuento = 25.0,
    fechaFin = "2026-12-31 23:59:59",
  ) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new ValidationError("Se requiere al menos un ID de producto");
    }

    if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
      throw new ValidationError(
        "El porcentaje de descuento debe estar entre 0 y 100",
      );
    }

    const fechaInicio = new Date().toISOString().slice(0, 19).replace("T", " ");

    const result = await this.ofertasRepo.createMasive(
      productIds,
      porcentajeDescuento,
      fechaInicio,
      fechaFin,
    );

    return {
      mensaje: `Oferta masiva (${porcentajeDescuento}%) creada exitosamente para ${result.affectedRows} productos`,
      vigencia: `Del ${fechaInicio.split(" ")[0]} al ${fechaFin.split(" ")[0]}`,
      productosInsertados: productIds,
      totalInsertados: result.affectedRows,
    };
  }

  /**
   * Obtiene ofertas de Cyber Monday
   * @returns {Promise<Array>}
   */
  async obtenerOfertasCyberMonday() {
    return await this.ofertasRepo.findCyberMondayWithProductos();
  }
}

// Exportamos una instancia singleton
module.exports = new ProductosService();
