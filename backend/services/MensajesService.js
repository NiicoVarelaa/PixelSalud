const mensajesRepository = require("../repositories/MensajesRepository");
const { enviarConfirmacionCliente } = require("../helps/EnvioMail");
const { NotFoundError, ValidationError } = require("../errors");

/**
 * Obtiene todos los mensajes
 * @returns {Promise<Array>}
 */
const obtenerMensajes = async () => {
  const mensajes = await mensajesRepository.findAll();
  return mensajes || [];
};

/**
 * Obtiene un mensaje por ID
 * @param {number} idMensaje - ID del mensaje
 * @returns {Promise<Object>}
 */
const obtenerMensajePorId = async (idMensaje) => {
  const mensaje = await mensajesRepository.findById(idMensaje);

  if (!mensaje) {
    throw new NotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  return mensaje;
};

/**
 * Obtiene mensajes por estado
 * @param {string} estado - Estado del mensaje
 * @returns {Promise<Array>}
 */
const obtenerMensajesPorEstado = async (estado) => {
  const mensajes = await mensajesRepository.findByEstado(estado);
  return mensajes || [];
};

/**
 * Obtiene mensajes de un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Array>}
 */
const obtenerMensajesPorCliente = async (idCliente) => {
  // Verificar que el cliente existe
  const clienteExists = await mensajesRepository.existsCliente(idCliente);
  if (!clienteExists) {
    throw new NotFoundError(`Cliente con ID ${idCliente} no encontrado`);
  }

  const mensajes = await mensajesRepository.findByClienteId(idCliente);
  return mensajes || [];
};

/**
 * Crea un nuevo mensaje y envía email de confirmación
 * @param {Object} mensajeData - Datos del mensaje
 * @returns {Promise<Object>}
 */
const crearMensaje = async ({
  idCliente,
  nombre,
  email,
  asunto,
  mensaje,
  fechaEnvio,
}) => {
  // Validaciones
  if (!idCliente || !nombre || !email || !mensaje) {
    throw new ValidationError(
      "Faltan datos obligatorios (idCliente, nombre, email, mensaje)",
    );
  }

  if (
    typeof mensaje !== "string" ||
    mensaje.trim().length < 10 ||
    mensaje.trim().length > 1000
  ) {
    throw new ValidationError(
      "El mensaje debe tener entre 10 y 1000 caracteres",
    );
  }

  // Verificar que el cliente existe
  const clienteExists = await mensajesRepository.existsCliente(idCliente);
  if (!clienteExists) {
    throw new NotFoundError(`Cliente con ID ${idCliente} no encontrado`);
  }

  // Asignar asunto por defecto si no se proporciona
  const asuntoFinal = asunto && asunto.trim() ? asunto.trim() : "Sin Asunto";

  // Crear el mensaje
  const idMensaje = await mensajesRepository.create({
    idCliente,
    nombre: nombre.trim(),
    email: email.trim(),
    asunto: asuntoFinal,
    mensaje: mensaje.trim(),
    fechaEnvio,
    estado: "nuevo",
  });

  // Enviar email de confirmación (no bloquear respuesta si falla)
  enviarConfirmacionCliente(email, nombre, asuntoFinal).catch((error) =>
    console.error("Error enviando email de confirmación:", error),
  );

  return {
    message: "Mensaje recibido correctamente",
    idMensaje,
  };
};

/**
 * Actualiza el estado de un mensaje
 * @param {number} idMensaje - ID del mensaje
 * @param {string} estado - Nuevo estado
 * @returns {Promise<Object>}
 */
const actualizarEstado = async (idMensaje, estado) => {
  // Verificar que el mensaje existe
  const mensaje = await mensajesRepository.findById(idMensaje);
  if (!mensaje) {
    throw new NotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  // Actualizar estado
  await mensajesRepository.updateEstado(idMensaje, estado);

  return {
    message: "Estado actualizado correctamente",
  };
};

/**
 * Elimina un mensaje
 * @param {number} idMensaje - ID del mensaje
 * @returns {Promise<Object>}
 */
const eliminarMensaje = async (idMensaje) => {
  // Verificar que el mensaje existe
  const mensaje = await mensajesRepository.findById(idMensaje);
  if (!mensaje) {
    throw new NotFoundError(`Mensaje con ID ${idMensaje} no encontrado`);
  }

  // Eliminar mensaje
  await mensajesRepository.deleteById(idMensaje);

  return {
    message: "Mensaje eliminado correctamente",
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
};
