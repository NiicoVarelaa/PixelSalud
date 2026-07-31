const recetasRepository = require("../repositories/RecetasRepository");
const { createNotFoundError, createValidationError } = require("../errors");

const obtenerRecetasPorMedico = async (idMedico) => {
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

const obtenerRecetasActivasCliente = async (dniCliente) => {
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

const crearRecetas = async ({ dniCliente, idMedico, productos }) => {
  if (!productos || productos.length === 0) {
    throw createValidationError("No hay productos en la receta");
  }

  const clienteExists = await recetasRepository.existsCliente(dniCliente);
  if (!clienteExists) {
    throw createValidationError("El DNI del paciente no existe en el sistema");
  }

  const medicoExists = await recetasRepository.existsMedico(idMedico);
  if (!medicoExists) {
    throw createNotFoundError(`Médico con ID ${idMedico} no encontrado`);
  }

  for (const prod of productos) {
    const productoExists = await recetasRepository.existsProducto(
      prod.idProducto,
    );
    if (!productoExists) {
      throw createValidationError(
        `Producto con ID ${prod.idProducto} no encontrado`,
      );
    }

    if (!prod.cantidad || prod.cantidad <= 0) {
      throw createValidationError(
        `La cantidad para el producto ${prod.idProducto} debe ser mayor a 0`,
      );
    }
  }

  const fechaEmision = new Date();
  const valores = productos.map((prod) => [
    dniCliente,
    idMedico,
    prod.idProducto,
    prod.cantidad,
    fechaEmision,
  ]);

  const cantidadCreada = await recetasRepository.createMultiple(valores);

  return {
    message: "Recetas emitidas exitosamente",
    cantidad: cantidadCreada,
  };
};

const marcarRecetaUsada = async (idReceta) => {
  const receta = await recetasRepository.findById(idReceta);
  if (!receta) {
    throw createNotFoundError(`Receta con ID ${idReceta} no encontrada`);
  }

  if (receta.usada) {
    throw createValidationError("La receta ya ha sido utilizada");
  }

  if (!receta.activo) {
    throw createValidationError("La receta no está activa");
  }

  await recetasRepository.marcarComoUsada(idReceta);

  return {
    message: "Receta marcada como usada exitosamente",
  };
};

const darBajaReceta = async (idReceta) => {
  const receta = await recetasRepository.findById(idReceta);
  if (!receta) {
    throw createNotFoundError(`Receta con ID ${idReceta} no encontrada`);
  }

  if (!receta.activo) {
    throw createValidationError("La receta ya está inactiva");
  }

  await recetasRepository.darBaja(idReceta);

  return {
    message: "Receta eliminada correctamente",
  };
};

const reactivarReceta = async (idReceta) => {
  const receta = await recetasRepository.findById(idReceta);
  if (!receta) {
    throw createNotFoundError(`Receta con ID ${idReceta} no encontrada`);
  }

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
