const medicosRepository = require("../repositories/MedicosRepository");
const {
  createNotFoundError,
  createConflictError,
} = require("../errors");
const bcryptjs = require("bcryptjs");

const obtenerMedicos = async () => {
  return await medicosRepository.findAll();
};

const obtenerMedicosInactivos = async () => {
  const medicos = await medicosRepository.findInactivos();

  if (medicos.length === 0) {
    throw createNotFoundError("No hay médicos dados de baja");
  }

  return medicos;
};

const obtenerMedicoPorId = async (idMedico) => {
  const medico = await medicosRepository.findById(idMedico);

  if (!medico) {
    throw createNotFoundError("Médico no encontrado");
  }

  return medico;
};

const crearMedico = async (medicoData) => {
  const { nombreMedico, apellidoMedico, matricula, emailMedico, contraMedico } =
    medicoData;

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

  const salt = await bcryptjs.genSalt(10);
  const contraEncrip = await bcryptjs.hash(contraMedico, salt);

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

const actualizarMedico = async (idMedico, medicoData) => {
  const medicoExistente = await medicosRepository.findById(idMedico);
  if (!medicoExistente) {
    throw createNotFoundError("Médico no encontrado");
  }

  if (medicoData.emailMedico) {
    const emailDuplicado = await medicosRepository.existsEmailExcept(
      medicoData.emailMedico,
      idMedico,
    );
    if (emailDuplicado) {
      throw createConflictError("El email ya está en uso por otro médico");
    }
  }

  if (medicoData.matricula) {
    const matriculaDuplicada = await medicosRepository.existsMatriculaExcept(
      medicoData.matricula,
      idMedico,
    );
    if (matriculaDuplicada) {
      throw createConflictError("La matrícula ya está en uso por otro médico");
    }
  }

  if (medicoData.contraMedico) {
    const salt = await bcryptjs.genSalt(10);
    medicoData.contraMedico = await bcryptjs.hash(
      medicoData.contraMedico,
      salt,
    );
  }

  await medicosRepository.update(idMedico, medicoData);

  return {
    message: "Médico actualizado con éxito",
  };
};

const darBajaMedico = async (idMedico) => {
  const medico = await medicosRepository.findById(idMedico);
  if (!medico) {
    throw createNotFoundError("Médico no encontrado");
  }

  await medicosRepository.darBaja(idMedico);

  return {
    message: "Médico dado de baja/eliminado con éxito",
  };
};

const reactivarMedico = async (idMedico) => {
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
