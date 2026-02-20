const permisosRepository = require("../repositories/PermisosRepository");
const { EmpleadosRepository } = require("../repositories");
const { createNotFoundError, createConflictError } = require("../errors");

const obtenerPermisos = async () => {
  const permisos = await permisosRepository.findAll();

  if (!permisos || permisos.length === 0) {
    throw createNotFoundError("No se encontraron permisos registrados");
  }

  return {
    message: "Permisos obtenidos exitosamente",
    data: permisos,
  };
};

const obtenerPermisosPorEmpleado = async (idEmpleado) => {
  const permisos = await permisosRepository.findByEmpleadoId(idEmpleado);

  if (!permisos) {
    throw createNotFoundError(
      `No se encontraron permisos para el empleado con ID ${idEmpleado}`,
    );
  }

  return {
    message: "Permisos del empleado obtenidos exitosamente",
    data: permisos,
  };
};

const crearPermisos = async (idEmpleado, permisoData) => {
  const empleado = await EmpleadosRepository.findById(idEmpleado);
  if (!empleado) {
    throw createNotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  const permisosExistentes =
    await permisosRepository.existsByEmpleadoId(idEmpleado);
  if (permisosExistentes) {
    throw createConflictError(
      `El empleado con ID ${idEmpleado} ya tiene permisos asignados`,
    );
  }

  const permisoId = await permisosRepository.create({
    idEmpleado,
    ...permisoData,
  });

  return {
    message: "Permisos concedidos correctamente",
    id: permisoId,
  };
};

const actualizarPermisos = async (idEmpleado, permisoData) => {
  const empleado = await EmpleadosRepository.findById(idEmpleado);
  if (!empleado) {
    throw createNotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  const permisosExistentes =
    await permisosRepository.findByEmpleadoId(idEmpleado);
  if (!permisosExistentes) {
    throw createNotFoundError(
      `El empleado con ID ${idEmpleado} no tiene permisos asignados`,
    );
  }

  await permisosRepository.update(idEmpleado, permisoData);

  return {
    message: "Permisos actualizados con éxito",
  };
};

const eliminarPermisos = async (idEmpleado) => {
  const permisosExistentes =
    await permisosRepository.findByEmpleadoId(idEmpleado);
  if (!permisosExistentes) {
    throw createNotFoundError(
      `El empleado con ID ${idEmpleado} no tiene permisos asignados`,
    );
  }

  await permisosRepository.deleteByEmpleadoId(idEmpleado);

  return {
    message: "Permisos eliminados con éxito",
  };
};

module.exports = {
  obtenerPermisos,
  obtenerPermisosPorEmpleado,
  crearPermisos,
  actualizarPermisos,
  eliminarPermisos,
};
