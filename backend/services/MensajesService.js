const mensajesRepository = require("../repositories/MensajesRepository");
const { enviarConfirmacionCliente } = require("../helps/EnvioMail");
const { createNotFoundError, createValidationError } = require("../errors");

const obtenerMensajes = async () => {
  const mensajes = await mensajesRepository.findAll();
  return mensajes || [];
};

const obtenerMensajePorId = async (idMensaje) => {
  const mensaje = await mensajesRepository.findById(idMensaje);

  if (!mensaje) {
    throw createNotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  return mensaje;
};

const obtenerMensajesPorEstado = async (estado) => {
  const mensajes = await mensajesRepository.findByEstado(estado);
  return mensajes || [];
};

const obtenerMensajesPorCliente = async (idCliente) => {
  const clienteExists = await mensajesRepository.existsCliente(idCliente);
  if (!clienteExists) {
    throw createNotFoundError(`Cliente con ID ${idCliente} no encontrado`);
  }

  const mensajes = await mensajesRepository.findByClienteId(idCliente);
  return mensajes || [];
};

const crearMensaje = async ({
  idCliente,
  nombre,
  email,
  asunto,
  mensaje,
  fechaEnvio,
}) => {
  if (!idCliente || !nombre || !email || !mensaje) {
    throw createValidationError(
      "Faltan datos obligatorios (idCliente, nombre, email, mensaje)",
    );
  }

  if (
    typeof mensaje !== "string" ||
    mensaje.trim().length < 10 ||
    mensaje.trim().length > 1000
  ) {
    throw createValidationError(
      "El mensaje debe tener entre 10 y 1000 caracteres",
    );
  }

  const clienteExists = await mensajesRepository.existsCliente(idCliente);
  if (!clienteExists) {
    throw createNotFoundError(`Cliente con ID ${idCliente} no encontrado`);
  }

  const asuntoFinal = asunto && asunto.trim() ? asunto.trim() : "Sin Asunto";

  const idMensaje = await mensajesRepository.create({
    idCliente,
    nombre: nombre.trim(),
    email: email.trim(),
    asunto: asuntoFinal,
    mensaje: mensaje.trim(),
    fechaEnvio,
    estado: "nuevo",
  });

  enviarConfirmacionCliente(email, nombre, asuntoFinal).catch((error) =>
    console.error("Error enviando email de confirmación:", error),
  );

  return {
    message: "Mensaje recibido correctamente",
    idMensaje,
  };
};

const actualizarEstado = async (idMensaje, estado) => {
  const mensaje = await mensajesRepository.findById(idMensaje);
  if (!mensaje) {
    throw createNotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  await mensajesRepository.updateEstado(idMensaje, estado);

  return {
    message: "Estado actualizado correctamente",
  };
};

const eliminarMensaje = async (idMensaje) => {
  const mensaje = await mensajesRepository.findById(idMensaje);
  if (!mensaje) {
    throw createNotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  await mensajesRepository.deleteById(idMensaje);

  return {
    message: "Mensaje eliminado correctamente",
  };
};

const marcarComoLeido = async (idMensaje) => {
  const mensaje = await mensajesRepository.findById(idMensaje);
  if (!mensaje) {
    throw createNotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  await mensajesRepository.markAsRead(idMensaje);

  return {
    message: "Mensaje marcado como leído",
  };
};

const responderMensaje = async (idMensaje, respuesta, respondidoPor) => {
  const mensaje = await mensajesRepository.findById(idMensaje);
  if (!mensaje) {
    throw createNotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  if (
    !respuesta ||
    typeof respuesta !== "string" ||
    respuesta.trim().length < 5
  ) {
    throw createValidationError(
      "La respuesta debe tener al menos 5 caracteres",
    );
  }

  await mensajesRepository.responder(
    idMensaje,
    respuesta.trim(),
    respondidoPor,
  );

  return {
    message: "Mensaje respondido correctamente",
  };
};

module.exports = {
  obtenerMensajes,
  obtenerMensajePorId,
  obtenerMensajesPorEstado,
  obtenerMensajesPorCliente,
  crearMensaje,
  actualizarEstado,
  eliminarMensaje,
  marcarComoLeido,
  responderMensaje,
};
