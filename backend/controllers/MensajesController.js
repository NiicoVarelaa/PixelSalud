const mensajesService = require("../services/MensajesService");

/**
 * Lista todos los mensajes
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const listarMensajes = async (req, res, next) => {
  try {
    const mensajes = await mensajesService.obtenerMensajes();
    res.status(200).json(mensajes);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un mensaje por ID
 * @param {Object} req - Request con idMensaje en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerMensaje = async (req, res, next) => {
  try {
    const idMensaje = parseInt(req.params.idMensaje, 10);
    const mensaje = await mensajesService.obtenerMensajePorId(idMensaje);
    res.status(200).json(mensaje);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene mensajes por estado
 * @param {Object} req - Request con estado en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const listarMensajesPorEstado = async (req, res, next) => {
  try {
    const { estado } = req.params;
    const mensajes = await mensajesService.obtenerMensajesPorEstado(estado);
    res.status(200).json(mensajes);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene mensajes de un cliente
 * @param {Object} req - Request con idCliente en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const listarMensajesPorCliente = async (req, res, next) => {
  try {
    const idCliente = parseInt(req.params.idCliente, 10);
    const mensajes = await mensajesService.obtenerMensajesPorCliente(idCliente);
    res.status(200).json(mensajes);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo mensaje
 * @param {Object} req - Request con datos del mensaje en body
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const crearMensaje = async (req, res, next) => {
  try {
    const { idCliente, nombre, email, asunto, mensaje, fechaEnvio } = req.body;
    const resultado = await mensajesService.crearMensaje({
      idCliente,
      nombre,
      email,
      asunto,
      mensaje,
      fechaEnvio,
    });
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el estado de un mensaje
 * @param {Object} req - Request con idMensaje en params y estado en body
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const actualizarEstadoMensaje = async (req, res, next) => {
  try {
    const idMensaje = parseInt(req.params.idMensaje, 10);
    const { estado } = req.body;
    const resultado = await mensajesService.actualizarEstado(idMensaje, estado);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un mensaje
 * @param {Object} req - Request con idMensaje en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const eliminarMensaje = async (req, res, next) => {
  try {
    const idMensaje = parseInt(req.params.idMensaje, 10);
    const resultado = await mensajesService.eliminarMensaje(idMensaje);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarMensajes,
  obtenerMensaje,
  listarMensajesPorEstado,
  listarMensajesPorCliente,
  crearMensaje,
  actualizarEstadoMensaje,
  eliminarMensaje,
};
