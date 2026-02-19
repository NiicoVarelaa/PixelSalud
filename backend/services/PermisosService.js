const permisosRepository = require("../repositories/PermisosRepository");
const { EmpleadosRepository } = require("../repositories");
const { createNotFoundError, createConflictError } = require("../errors");

/**
 * Obtiene todos los permisos
 * @returns {Promise<Object>}
 */
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

/**
 * Obtiene los permisos de un empleado específico
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<Object>}
 */
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

/**
 * Crea permisos para un empleado
 * @param {number} idEmpleado - ID del empleado
 * @param {Object} permisoData - Datos de permisos
 * @returns {Promise<Object>}
 */
const crearPermisos = async (idEmpleado, permisoData) => {
  // Verificar que el empleado existe
  const empleado = await EmpleadosRepository.findById(idEmpleado);
  if (!empleado) {
    throw createNotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  // Verificar que el empleado no tenga permisos ya asignados
  const permisosExistentes =
    await permisosRepository.existsByEmpleadoId(idEmpleado);
  if (permisosExistentes) {
    throw createConflictError(
      `El empleado con ID ${idEmpleado} ya tiene permisos asignados`,
    );
  }

  // Crear los permisos
  const permisoId = await permisosRepository.create({
    idEmpleado,
    ...permisoData,
  });

  return {
    message: "Permisos concedidos correctamente",
    id: permisoId,
  };
};

/**
 * Actualiza los permisos de un empleado
 * @param {number} idEmpleado - ID del empleado
 * @param {Object} permisoData - Datos de permisos a actualizar
 * @returns {Promise<Object>}
 */
const actualizarPermisos = async (idEmpleado, permisoData) => {
  // Verificar que el empleado existe
  const empleado = await EmpleadosRepository.findById(idEmpleado);
  if (!empleado) {
    throw createNotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  // Verificar que el empleado tiene permisos asignados
  const permisosExistentes =
    await permisosRepository.findByEmpleadoId(idEmpleado);
  if (!permisosExistentes) {
    throw createNotFoundError(
      `El empleado con ID ${idEmpleado} no tiene permisos asignados`,
    );
  }

  // Actualizar los permisos
  await permisosRepository.update(idEmpleado, permisoData);

  return {
    message: "Permisos actualizados con éxito",
  };
};

/**
 * Elimina los permisos de un empleado
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<Object>}
 */
const eliminarPermisos = async (idEmpleado) => {
  // Verificar que el empleado tiene permisos asignados
  const permisosExistentes =
    await permisosRepository.findByEmpleadoId(idEmpleado);
  if (!permisosExistentes) {
    throw createNotFoundError(
      `El empleado con ID ${idEmpleado} no tiene permisos asignados`,
    );
  }

  // Eliminar los permisos
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
