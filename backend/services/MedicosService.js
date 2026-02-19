const medicosRepository = require("../repositories/MedicosRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
} = require("../errors");
const bcryptjs = require("bcryptjs");

/**
 * Servicio para la lógica de negocio de Médicos
 * Maneja validaciones, hash de contraseñas
 */

/**
 * Obtiene todos los médicos activos
 * @returns {Promise<Array>}
 */
const obtenerMedicos = async () => {
  return await medicosRepository.findAll();
};

/**
 * Obtiene médicos inactivos
 * @returns {Promise<Array>}
 */
const obtenerMedicosInactivos = async () => {
  const medicos = await medicosRepository.findInactivos();

  if (medicos.length === 0) {
    throw createNotFoundError("No hay médicos dados de baja");
  }

  return medicos;
};

/**
 * Obtiene un médico por ID
 * @param {number} idMedico
 * @returns {Promise<Object>}
 */
const obtenerMedicoPorId = async (idMedico) => {
  const medico = await medicosRepository.findById(idMedico);

  if (!medico) {
    throw createNotFoundError("Médico no encontrado");
  }

  return medico;
};

/**
 * Crea un nuevo médico
 * @param {Object} medicoData
 * @returns {Promise<Object>}
 */
const crearMedico = async (medicoData) => {
  const { nombreMedico, apellidoMedico, matricula, emailMedico, contraMedico } =
    medicoData;

  // Validar que email y matrícula no existan
  const existeEmail = await medicosRepository.findByEmail(emailMedico);
  if (existeEmail) {
    throw createConflictError(
      "El médico que intentas crear ya se encuentra registrado (email duplicado)",
    );
  }

  const existeMatricula = await medicosRepository.findByMatricula(matricula);
  if (existeMatricula) {
    throw createConflictError("La matrícula ya está registrada");
  }

  // Hash de la contraseña
  const salt = await bcryptjs.genSalt(10);
  const contraEncrip = await bcryptjs.hash(contraMedico, salt);

  // Crear médico
  const idMedico = await medicosRepository.create({
    nombreMedico,
    apellidoMedico,
    matricula,
    emailMedico,
    contraMedico: contraEncrip,
  });

  return {
    idMedico,
    nombreMedico,
    apellidoMedico,
    matricula,
    emailMedico,
    message: "Médico creado correctamente",
  };
};

/**
 * Actualiza un médico
 * @param {number} idMedico
 * @param {Object} medicoData
 * @returns {Promise<Object>}
 */
const actualizarMedico = async (idMedico, medicoData) => {
  // Verificar que el médico existe
  const medicoExistente = await medicosRepository.findById(idMedico);
  if (!medicoExistente) {
    throw createNotFoundError("Médico no encontrado");
  }

  // Validar email único si se está actualizando
  if (medicoData.emailMedico) {
    const emailDuplicado = await medicosRepository.existsEmailExcept(
      medicoData.emailMedico,
      idMedico,
    );
    if (emailDuplicado) {
      throw createConflictError("El email ya está en uso por otro médico");
    }
  }

  // Validar matrícula única si se está actualizando
  if (medicoData.matricula) {
    const matriculaDuplicada = await medicosRepository.existsMatriculaExcept(
      medicoData.matricula,
      idMedico,
    );
    if (matriculaDuplicada) {
      throw createConflictError("La matrícula ya está en uso por otro médico");
    }
  }

  // Hash de contraseña si se proporciona
  if (medicoData.contraMedico) {
    const salt = await bcryptjs.genSalt(10);
    medicoData.contraMedico = await bcryptjs.hash(
      medicoData.contraMedico,
      salt,
    );
  }

  // Actualizar médico
  await medicosRepository.update(idMedico, medicoData);

  return {
    message: "Médico actualizado con éxito",
  };
};

/**
 * Da de baja un médico (soft delete)
 * @param {number} idMedico
 * @returns {Promise<Object>}
 */
const darBajaMedico = async (idMedico) => {
  // Verificar que el médico existe
  const medico = await medicosRepository.findById(idMedico);
  if (!medico) {
    throw createNotFoundError("Médico no encontrado");
  }

  await medicosRepository.darBaja(idMedico);

  return {
    message: "Médico dado de baja/eliminado con éxito",
  };
};

/**
 * Reactiva un médico
 * @param {number} idMedico
 * @returns {Promise<Object>}
 */
const reactivarMedico = async (idMedico) => {
  // Verificar que el médico existe
  const medico = await medicosRepository.findById(idMedico);
  if (!medico) {
    throw createNotFoundError("Médico no encontrado");
  }

  await medicosRepository.reactivar(idMedico);

  return {
    message: "Médico reactivado con éxito",
  };
};

module.exports = {
  obtenerMedicos,
  obtenerMedicosInactivos,
  obtenerMedicoPorId,
  crearMedico,
  actualizarMedico,
  darBajaMedico,
  reactivarMedico,
};
