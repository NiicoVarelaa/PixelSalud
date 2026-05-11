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

const TIPOS_CONSULTA_AUTH_REQUERIDA = new Set(["pedido", "receta"]);

const ASUNTOS_POR_TIPO = {
  general: "Consulta general",
  pedido: "Consulta sobre pedido",
  receta: "Consulta sobre receta",
  facturacion: "Consulta sobre facturacion",
  otro: "Otra consulta",
};

const crearMensaje = async ({
  idCliente,
  nombre,
  email,
  asunto,
  mensaje,
  tipoConsulta,
  fechaEnvio,
}) => {
  if (!nombre || !email || !mensaje) {
    throw createValidationError(
      "Faltan datos obligatorios (nombre, email, mensaje)",
    );
  }

  if (asunto && asunto.trim().length > 200) {
    throw createValidationError(
      "El asunto no puede superar los 200 caracteres",
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

  const tipoConsultaFinal = tipoConsulta || "general";
  if (TIPOS_CONSULTA_AUTH_REQUERIDA.has(tipoConsultaFinal) && !idCliente) {
    throw createValidationError(
      "Debes iniciar sesión para enviar consultas de pedido o receta",
    );
  }

  if (idCliente) {
    const clienteExists = await mensajesRepository.existsCliente(idCliente);
    if (!clienteExists) {
      throw createNotFoundError(`Cliente con ID ${idCliente} no encontrado`);
    }
  }

  const asuntoDefault = ASUNTOS_POR_TIPO[tipoConsultaFinal] || "Consulta";
  const asuntoFinal = asunto && asunto.trim() ? asunto.trim() : asuntoDefault;

  let idMensaje;
  try {
    idMensaje = await mensajesRepository.create({
      idCliente: idCliente || null,
      nombre: nombre.trim(),
      email: email.trim(),
      asunto: asuntoFinal,
      tipoConsulta: tipoConsultaFinal,
      mensaje: mensaje.trim(),
      fechaEnvio,
      estado: "nuevo",
    });
  } catch (error) {
    const isIdClienteNullSchemaIssue =
      error?.code === "ER_BAD_NULL_ERROR" &&
      typeof error?.message === "string" &&
      error.message.includes("idCliente");

    if (isIdClienteNullSchemaIssue) {
      throw createValidationError(
        "La base de datos requiere migración para contacto público (idCliente nullable en MensajesClientes)",
      );
    }

    throw error;
  }

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

const contarNoLeidos = async () => {
  const count = await mensajesRepository.countUnread();
  return count;
};

const obtenerRecientesNoLeidos = async (limit = 5) => {
  const mensajes = await mensajesRepository.findRecentUnread(limit);
  return mensajes || [];
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
  contarNoLeidos,
  obtenerRecientesNoLeidos,
};
