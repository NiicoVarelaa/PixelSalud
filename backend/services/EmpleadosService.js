const empleadosRepository = require("../repositories/EmpleadosRepository");
const { NotFoundError, ValidationError, ConflictError } = require("../errors");
const bcryptjs = require("bcryptjs");

/**
 * Servicio para la lógica de negocio de Empleados
 * Maneja validaciones, hash de contraseñas, y gestión de permisos
 */
/**
 * Obtiene todos los empleados activos con permisos
 * @returns {Promise<Array>}
 */
const obtenerEmpleados = async () => {
  return await empleadosRepository.findAllWithPermisos();
};

/**
 * Obtiene empleados inactivos
 * @returns {Promise<Array>}
 */
const obtenerEmpleadosInactivos = async () => {
  const empleados = await empleadosRepository.findInactivos();

  if (empleados.length === 0) {
    throw new NotFoundError("No hay empleados dados de baja");
  }

  return empleados;
};

/**
 * Obtiene un empleado por ID con sus permisos
 * @param {number} idEmpleado
 * @returns {Promise<Object>}
 */
const obtenerEmpleadoPorId = async (idEmpleado) => {
  const empleado = await empleadosRepository.findByIdWithPermisos(idEmpleado);

  if (!empleado) {
    throw new NotFoundError("Empleado no encontrado");
  }

  return empleado;
};

/**
 * Crea un nuevo empleado con permisos
 * @param {Object} empleadoData
 * @param {Object} permisos
 * @returns {Promise<Object>}
 */
const crearEmpleado = async (empleadoData, permisos) => {
  // Validar que email y DNI no existan
  const existeEmail = await empleadosRepository.findByEmail(
    empleadoData.emailEmpleado,
  );
  if (existeEmail) {
    throw new ConflictError("El email ya está registrado");
  }

  const existeDNI = await empleadosRepository.findByDNI(
    empleadoData.dniEmpleado,
  );
  if (existeDNI) {
    throw new ConflictError("El DNI ya está registrado");
  }

  // Hashear contraseña
  const salt = await bcryptjs.genSalt(10);
  const contraHash = await bcryptjs.hash(empleadoData.contraEmpleado, salt);

  // Crear empleado
  const idEmpleado = await empleadosRepository.create({
    ...empleadoData,
    contraEmpleado: contraHash,
  });

  // Crear permisos si se proporcionaron
  if (permisos) {
    await empleadosRepository.createPermisos(idEmpleado, permisos);
  }

  return {
    idEmpleado,
    nombreEmpleado: empleadoData.nombreEmpleado,
    apellidoEmpleado: empleadoData.apellidoEmpleado,
    emailEmpleado: empleadoData.emailEmpleado,
    dniEmpleado: empleadoData.dniEmpleado,
    activo: true,
  };
};

/**
 * Actualiza un empleado y sus permisos
 * @param {number} idEmpleado
 * @param {Object} empleadoData
 * @param {Object} permisos
 * @returns {Promise<void>}
 */
const actualizarEmpleado = async (idEmpleado, empleadoData, permisos) => {
  // Verificar que el empleado existe
  const empleadoExiste =
    await empleadosRepository.findByIdWithPermisos(idEmpleado);
  if (!empleadoExiste) {
    throw new NotFoundError("Empleado no encontrado");
  }

  // Validar unicidad de email (si se está actualizando)
  if (empleadoData.emailEmpleado) {
    const emailEnUso = await empleadosRepository.existsEmailExcept(
      empleadoData.emailEmpleado,
      idEmpleado,
    );
    if (emailEnUso) {
      throw new ConflictError("El email ya está en uso por otro empleado");
    }
  }

  // Validar unicidad de DNI (si se está actualizando)
  if (empleadoData.dniEmpleado) {
    const dniEnUso = await empleadosRepository.existsDNIExcept(
      empleadoData.dniEmpleado,
      idEmpleado,
    );
    if (dniEnUso) {
      throw new ConflictError("El DNI ya está en uso por otro empleado");
    }
  }

  // Hashear contraseña si se proporciona
  if (
    empleadoData.contraEmpleado &&
    empleadoData.contraEmpleado.trim().length > 0
  ) {
    const salt = await bcryptjs.genSalt(10);
    empleadoData.contraEmpleado = await bcryptjs.hash(
      empleadoData.contraEmpleado,
      salt,
    );
  } else {
    // No actualizar contraseña si no se proporciona
    delete empleadoData.contraEmpleado;
  }

  // Actualizar empleado
  await empleadosRepository.update(idEmpleado, empleadoData);

  // Actualizar permisos si se proporcionaron
  if (permisos) {
    const existenPermisos =
      await empleadosRepository.existsPermisos(idEmpleado);

    if (existenPermisos) {
      await empleadosRepository.updatePermisos(idEmpleado, permisos);
    } else {
      await empleadosRepository.createPermisos(idEmpleado, permisos);
    }
  }
};

/**
 * Da de baja (soft delete) a un empleado
 * @param {number} idEmpleado
 * @returns {Promise<void>}
 */
const darBajaEmpleado = async (idEmpleado) => {
  const empleado = await empleadosRepository.findByIdWithPermisos(idEmpleado);

  if (!empleado) {
    throw new NotFoundError("Empleado no encontrado");
  }

  if (!empleado.activo) {
    throw new ValidationError("El empleado ya está dado de baja");
  }

  await empleadosRepository.updateEstado(idEmpleado, false);
};

/**
 * Reactiva un empleado dado de baja
 * @param {number} idEmpleado
 * @returns {Promise<void>}
 */
const reactivarEmpleado = async (idEmpleado) => {
  const empleado = await empleadosRepository.findByIdWithPermisos(idEmpleado);

  if (!empleado) {
    throw new NotFoundError("Empleado no encontrado");
  }

  if (empleado.activo) {
    throw new ValidationError("El empleado ya está activo");
  }

  await empleadosRepository.updateEstado(idEmpleado, true);
};

module.exports = {
  obtenerEmpleados,
  obtenerEmpleadosInactivos,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  darBajaEmpleado,
  reactivarEmpleado,
};
