const recetasRepository = require("../repositories/RecetasRepository");
const { createNotFoundError, createValidationError } = require("../errors");

/**
 * Obtiene todas las recetas de un médico específico
 * @param {number} idMedico - ID del médico
 * @returns {Promise<Object>}
 */
const obtenerRecetasPorMedico = async (idMedico) => {
  // Verificar que el médico existe
  const medicoExists = await recetasRepository.existsMedico(idMedico);
  if (!medicoExists) {
    throw createNotFoundError(`Médico con ID ${idMedico} no encontrado`);
  }

  const recetas = await recetasRepository.findByMedicoId(idMedico);

  if (!recetas || recetas.length === 0) {
    return {
      message: "No se encontraron recetas para este médico",
      data: [],
    };
  }

  return {
    message: "Recetas obtenidas exitosamente",
    data: recetas,
  };
};

/**
 * Obtiene recetas activas (no usadas) de un cliente
 * @param {string} dniCliente - DNI del cliente
 * @returns {Promise<Object>}
 */
const obtenerRecetasActivasCliente = async (dniCliente) => {
  // Verificar que el cliente existe
  const clienteExists = await recetasRepository.existsCliente(dniCliente);
  if (!clienteExists) {
    throw createNotFoundError(`Cliente con DNI ${dniCliente} no encontrado`);
  }

  const recetas = await recetasRepository.findActivasByClienteDni(dniCliente);

  return {
    message: "Recetas activas obtenidas exitosamente",
    data: recetas,
  };
};

/**
 * Obtiene una receta por su ID
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<Object>}
 */
const obtenerRecetaPorId = async (idReceta) => {
  const receta = await recetasRepository.findById(idReceta);

  if (!receta) {
    throw createNotFoundError(`Receta con ID ${idReceta} no encontrada`);
  }

  return {
    message: "Receta obtenida exitosamente",
    data: receta,
  };
};

/**
 * Crea múltiples recetas para un cliente
 * @param {Object} recetaData - Datos de las recetas
 * @param {string} recetaData.dniCliente - DNI del cliente
 * @param {number} recetaData.idMedico - ID del médico
 * @param {Array<Object>} recetaData.productos - Array de productos [{idProducto, cantidad}]
 * @returns {Promise<Object>}
 */
const crearRecetas = async ({ dniCliente, idMedico, productos }) => {
  // Validar que hay productos
  if (!productos || productos.length === 0) {
    throw createValidationError("No hay productos en la receta");
  }

  // Verificar que el cliente existe
  const clienteExists = await recetasRepository.existsCliente(dniCliente);
  if (!clienteExists) {
    throw createValidationError("El DNI del paciente no existe en el sistema");
  }

  // Verificar que el médico existe
  const medicoExists = await recetasRepository.existsMedico(idMedico);
  if (!medicoExists) {
    throw createNotFoundError(`Médico con ID ${idMedico} no encontrado`);
  }

  // Verificar que todos los productos existen
  for (const prod of productos) {
    const productoExists = await recetasRepository.existsProducto(
      prod.idProducto,
    );
    if (!productoExists) {
      throw createValidationError(
        `Producto con ID ${prod.idProducto} no encontrado`,
      );
    }

    // Validar cantidad
    if (!prod.cantidad || prod.cantidad <= 0) {
      throw createValidationError(
        `La cantidad para el producto ${prod.idProducto} debe ser mayor a 0`,
      );
    }
  }

  // Preparar los valores para insertar múltiples filas
  const fechaEmision = new Date();
  const valores = productos.map((prod) => [
    dniCliente,
    idMedico,
    prod.idProducto,
    prod.cantidad,
    fechaEmision,
  ]);

  // Crear las recetas
  const cantidadCreada = await recetasRepository.createMultiple(valores);

  return {
    message: "Recetas emitidas exitosamente",
    cantidad: cantidadCreada,
  };
};

/**
 * Marca una receta como usada
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<Object>}
 */
const marcarRecetaUsada = async (idReceta) => {
  // Verificar que la receta existe
  const receta = await recetasRepository.findById(idReceta);
  if (!receta) {
    throw createNotFoundError(`Receta con ID ${idReceta} no encontrada`);
  }

  // Verificar que no esté ya usada
  if (receta.usada) {
    throw createValidationError("La receta ya ha sido utilizada");
  }

  // Verificar que esté activa
  if (!receta.activo) {
    throw createValidationError("La receta no está activa");
  }

  await recetasRepository.marcarComoUsada(idReceta);

  return {
    message: "Receta marcada como usada exitosamente",
  };
};

/**
 * Da de baja una receta (soft delete)
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<Object>}
 */
const darBajaReceta = async (idReceta) => {
  // Verificar que la receta existe
  const receta = await recetasRepository.findById(idReceta);
  if (!receta) {
    throw createNotFoundError(`Receta con ID ${idReceta} no encontrada`);
  }

  // Verificar que no esté ya inactiva
  if (!receta.activo) {
    throw createValidationError("La receta ya está inactiva");
  }

  await recetasRepository.darBaja(idReceta);

  return {
    message: "Receta eliminada correctamente",
  };
};

/**
 * Reactiva una receta
 * @param {number} idReceta - ID de la receta
 * @returns {Promise<Object>}
 */
const reactivarReceta = async (idReceta) => {
  // Verificar que la receta existe
  const receta = await recetasRepository.findById(idReceta);
  if (!receta) {
    throw createNotFoundError(`Receta con ID ${idReceta} no encontrada`);
  }

  // Verificar que esté inactiva
  if (receta.activo) {
    throw createValidationError("La receta ya está activa");
  }

  await recetasRepository.reactivar(idReceta);

  return {
    message: "Receta reactivada exitosamente",
  };
};

module.exports = {
  obtenerRecetasPorMedico,
  obtenerRecetasActivasCliente,
  obtenerRecetaPorId,
  crearRecetas,
  marcarRecetaUsada,
  darBajaReceta,
  reactivarReceta,
};
