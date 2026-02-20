const ofertasRepository = require("../repositories/OfertasRepository");
const productosRepository = require("../repositories/ProductosRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
} = require("../errors");

const obtenerOfertas = async () => {
  return await ofertasRepository.findAllWithProductos();
};

const obtenerOfertaPorId = async (idOferta) => {
  const oferta = await ofertasRepository.findByIdWithProducto(idOferta);

  if (!oferta) {
    throw createNotFoundError("Oferta no encontrada");
  }

  return oferta;
};

const crearOferta = async (data) => {
  const { idProducto, porcentajeDescuento, fechaInicio, fechaFin } = data;

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

  const producto = await productosRepository.findById(idProducto, "idProducto");
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

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

const actualizarOferta = async (idOferta, data) => {
  const existe = await ofertasRepository.findById(idOferta);
  if (!existe) {
    throw createNotFoundError("Oferta no encontrada");
  }

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

const actualizarEstadoOferta = async (idOferta, esActiva) => {
  const existe = await ofertasRepository.findById(idOferta);
  if (!existe) {
    throw createNotFoundError("Oferta no encontrada");
  }

  return await ofertasRepository.updateEsActiva(idOferta, esActiva);
};

const eliminarOferta = async (idOferta) => {
  const existe = await ofertasRepository.findById(idOferta);
  if (!existe) {
    throw createNotFoundError("Oferta no encontrada");
  }

  return await ofertasRepository.delete(idOferta);
};

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

const obtenerOfertasCyberMonday = async () => {
  return await ofertasRepository.findCyberMondayWithProductos();
};

const obtenerOfertasDestacadas = async (categoria = "Dermocosmética") => {
  return await productosRepository.findByCategoriaWithOfertas(categoria);
};

const obtenerOfertasPorVencer = async (dias = 7) => {
  return await ofertasRepository.findExpiringIn(dias);
};

const productoTieneOfertaActiva = async (idProducto) => {
  return await ofertasRepository.hasActiveOferta(idProducto);
};

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
