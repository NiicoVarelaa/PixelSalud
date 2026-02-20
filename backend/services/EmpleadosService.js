const empleadosRepository = require("../repositories/EmpleadosRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
} = require("../errors");
const bcryptjs = require("bcryptjs");

const obtenerEmpleados = async () => {
  return await empleadosRepository.findAllWithPermisos();
};

const obtenerEmpleadosInactivos = async () => {
  const empleados = await empleadosRepository.findInactivos();

  if (empleados.length === 0) {
    throw createNotFoundError("No hay empleados dados de baja");
  }

  return empleados;
};

const obtenerEmpleadoPorId = async (idEmpleado) => {
  const empleado = await empleadosRepository.findByIdWithPermisos(idEmpleado);

  if (!empleado) {
    throw createNotFoundError("Empleado no encontrado");
  }

  return empleado;
};

const crearEmpleado = async (empleadoData, permisos) => {
  const existeEmail = await empleadosRepository.findByEmail(
    empleadoData.emailEmpleado,
  );
  if (existeEmail) {
    throw createConflictError("El email ya está registrado");
  }

  const existeDNI = await empleadosRepository.findByDNI(
    empleadoData.dniEmpleado,
  );
  if (existeDNI) {
    throw createConflictError("El DNI ya está registrado");
  }

  const salt = await bcryptjs.genSalt(10);
  const contraHash = await bcryptjs.hash(empleadoData.contraEmpleado, salt);

  const idEmpleado = await empleadosRepository.create({
    ...empleadoData,
    contraEmpleado: contraHash,
  });

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

const actualizarEmpleado = async (idEmpleado, empleadoData, permisos) => {
  const empleadoExiste =
    await empleadosRepository.findByIdWithPermisos(idEmpleado);
  if (!empleadoExiste) {
    throw createNotFoundError("Empleado no encontrado");
  }

  if (empleadoData.emailEmpleado) {
    const emailEnUso = await empleadosRepository.existsEmailExcept(
      empleadoData.emailEmpleado,
      idEmpleado,
    );
    if (emailEnUso) {
      throw createConflictError("El email ya está en uso por otro empleado");
    }
  }

  if (empleadoData.dniEmpleado) {
    const dniEnUso = await empleadosRepository.existsDNIExcept(
      empleadoData.dniEmpleado,
      idEmpleado,
    );
    if (dniEnUso) {
      throw createConflictError("El DNI ya está en uso por otro empleado");
    }
  }

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
    delete empleadoData.contraEmpleado;
  }

  await empleadosRepository.update(idEmpleado, empleadoData);

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

const darBajaEmpleado = async (idEmpleado) => {
  const empleado = await empleadosRepository.findByIdWithPermisos(idEmpleado);

  if (!empleado) {
    throw createNotFoundError("Empleado no encontrado");
  }

  if (!empleado.activo) {
    throw createValidationError("El empleado ya está dado de baja");
  }

  await empleadosRepository.updateEstado(idEmpleado, false);
};

const reactivarEmpleado = async (idEmpleado) => {
  const empleado = await empleadosRepository.findByIdWithPermisos(idEmpleado);

  if (!empleado) {
    throw createNotFoundError("Empleado no encontrado");
  }

  if (empleado.activo) {
    throw createValidationError("El empleado ya está activo");
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
