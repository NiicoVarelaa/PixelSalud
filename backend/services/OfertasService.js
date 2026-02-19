const ofertasRepository = require("../repositories/OfertasRepository");
const productosRepository = require("../repositories/ProductosRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
} = require("../errors");

/**
 * Service para la lógica de negocio de Ofertas
 */

/**
 * Obtiene todas las ofertas con información de productos
 * @returns {Promise<Array>}
 */
const obtenerOfertas = async () => {
  return await ofertasRepository.findAllWithProductos();
};

/**
 * Obtiene una oferta por ID
 * @param {number} idOferta - ID de la oferta
 * @returns {Promise<Object>}
 * @throws {NotFoundError} Si la oferta no existe
 */
const obtenerOfertaPorId = async (idOferta) => {
  const oferta = await ofertasRepository.findByIdWithProducto(idOferta);

  if (!oferta) {
    throw createNotFoundError("Oferta no encontrada");
  }

  return oferta;
};

/**
 * Crea una nueva oferta
 * @param {Object} data - Datos de la oferta
 * @returns {Promise<Object>} Oferta creada
 * @throws {ValidationError} Si los datos son inválidos
 * @throws {ConflictError} Si el producto ya tiene una oferta activa
 */
const crearOferta = async (data) => {
  const { idProducto, porcentajeDescuento, fechaInicio, fechaFin } = data;

  // Validaciones de negocio
  if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
    throw createValidationError(
      "El porcentaje de descuento debe estar entre 0 y 100",
    );
  }

  const fechaInicioDate = new Date(fechaInicio);
  const fechaFinDate = new Date(fechaFin);

  if (fechaFinDate <= fechaInicioDate) {
    throw createValidationError(
      "La fecha de fin debe ser posterior a la fecha de inicio",
    );
  }

  // Verificar que el producto existe
  const producto = await productosRepository.findById(idProducto, "idProducto");
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  // Verificar si ya tiene una oferta activa
  const tieneOferta = await ofertasRepository.hasActiveOferta(idProducto);
  if (tieneOferta) {
    throw createConflictError("El producto ya tiene una oferta activa");
  }

  const ofertaData = {
    idProducto,
    porcentajeDescuento,
    fechaInicio,
    fechaFin,
    esActiva: 1,
  };

  const idOferta = await ofertasRepository.create(ofertaData);
  return await ofertasRepository.findByIdWithProducto(idOferta);
};

/**
 * Actualiza una oferta existente
 * @param {number} idOferta - ID de la oferta
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Oferta actualizada
 * @throws {NotFoundError} Si la oferta no existe
 * @throws {ValidationError} Si los datos son inválidos
 */
const actualizarOferta = async (idOferta, data) => {
  const existe = await ofertasRepository.findById(idOferta);
  if (!existe) {
    throw createNotFoundError("Oferta no encontrada");
  }

  // Validaciones
  if (
    data.porcentajeDescuento !== undefined &&
    (data.porcentajeDescuento < 0 || data.porcentajeDescuento > 100)
  ) {
    throw createValidationError(
      "El porcentaje de descuento debe estar entre 0 y 100",
    );
  }

  if (data.fechaInicio && data.fechaFin) {
    const fechaInicioDate = new Date(data.fechaInicio);
    const fechaFinDate = new Date(data.fechaFin);

    if (fechaFinDate <= fechaInicioDate) {
      throw createValidationError(
        "La fecha de fin debe ser posterior a la fecha de inicio",
      );
    }
  }

  const actualizado = await ofertasRepository.update(idOferta, data);

  if (!actualizado) {
    throw new Error("Error al actualizar la oferta");
  }

  return await ofertasRepository.findByIdWithProducto(idOferta);
};

/**
 * Actualiza solo el estado activo de una oferta
 * @param {number} idOferta - ID de la oferta
 * @param {boolean} esActiva - Nuevo estado
 * @returns {Promise<boolean>}
 * @throws {NotFoundError} Si la oferta no existe
 */
const actualizarEstadoOferta = async (idOferta, esActiva) => {
  const existe = await ofertasRepository.findById(idOferta);
  if (!existe) {
    throw createNotFoundError("Oferta no encontrada");
  }

  return await ofertasRepository.updateEsActiva(idOferta, esActiva);
};

/**
 * Elimina una oferta
 * @param {number} idOferta - ID de la oferta
 * @returns {Promise<boolean>}
 * @throws {NotFoundError} Si la oferta no existe
 */
const eliminarOferta = async (idOferta) => {
  const existe = await ofertasRepository.findById(idOferta);
  if (!existe) {
    throw createNotFoundError("Oferta no encontrada");
  }

  return await ofertasRepository.delete(idOferta);
};

/**
 * Crea ofertas masivas (Cyber Monday u otros eventos)
 * @param {Array<number>} productIds - IDs de productos
 * @param {number} porcentajeDescuento - Porcentaje de descuento
 * @param {string} fechaFin - Fecha de finalización
 * @returns {Promise<Object>} Resultado de la operación
 * @throws {ValidationError} Si los datos son inválidos
 */
const crearOfertasMasivas = async (
  productIds,
  porcentajeDescuento = 25.0,
  fechaFin = "2026-12-31 23:59:59",
) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw createValidationError("Se requiere al menos un ID de producto");
  }

  if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
    throw createValidationError(
      "El porcentaje de descuento debe estar entre 0 y 100",
    );
  }

  const fechaInicio = new Date().toISOString().slice(0, 19).replace("T", " ");

  const result = await ofertasRepository.createMasive(
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
};

/**
 * Obtiene ofertas de Cyber Monday
 * @returns {Promise<Array>}
 */
const obtenerOfertasCyberMonday = async () => {
  return await ofertasRepository.findCyberMondayWithProductos();
};

/**
 * Obtiene ofertas destacadas de una categoría específica
 * @param {string} categoria - Nombre de la categoría (default: "Dermocosmética")
 * @returns {Promise<Array>}
 */
const obtenerOfertasDestacadas = async (categoria = "Dermocosmética") => {
  return await productosRepository.findByCategoriaWithOfertas(categoria);
};

/**
 * Obtiene ofertas que expiran pronto
 * @param {number} dias - Número de días (default: 7)
 * @returns {Promise<Array>}
 */
const obtenerOfertasPorVencer = async (dias = 7) => {
  return await ofertasRepository.findExpiringIn(dias);
};

/**
 * Verifica si un producto tiene oferta activa
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 */
const productoTieneOfertaActiva = async (idProducto) => {
  return await ofertasRepository.hasActiveOferta(idProducto);
};

/**
 * Desactiva todas las ofertas de un producto
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 */
const desactivarOfertasDeProducto = async (idProducto) => {
  return await ofertasRepository.desactivarByProducto(idProducto);
};
module.exports = {
  obtenerOfertas,
  obtenerOfertaPorId,
  crearOferta,
  actualizarOferta,
  actualizarEstadoOferta,
  eliminarOferta,
  crearOfertasMasivas,
  obtenerOfertasCyberMonday,
  obtenerOfertasDestacadas,
  obtenerOfertasPorVencer,
  productoTieneOfertaActiva,
  desactivarOfertasDeProducto,
};
