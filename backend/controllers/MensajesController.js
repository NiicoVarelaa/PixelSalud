const mensajesService = require("../services/MensajesService");

const listarMensajes = async (req, res, next) => {
  try {
    const mensajes = await mensajesService.obtenerMensajes();
    res.status(200).json(mensajes);
  } catch (error) {
    next(error);
  }
};

const obtenerMensaje = async (req, res, next) => {
  try {
    const idMensaje = parseInt(req.params.idMensaje, 10);
    const mensaje = await mensajesService.obtenerMensajePorId(idMensaje);
    res.status(200).json(mensaje);
  } catch (error) {
    next(error);
  }
};

const listarMensajesPorEstado = async (req, res, next) => {
  try {
    const { estado } = req.params;
    const mensajes = await mensajesService.obtenerMensajesPorEstado(estado);
    res.status(200).json(mensajes);
  } catch (error) {
    next(error);
  }
};

const listarMensajesPorCliente = async (req, res, next) => {
  try {
    const idCliente = parseInt(req.params.idCliente, 10);
    const mensajes = await mensajesService.obtenerMensajesPorCliente(idCliente);
    res.status(200).json(mensajes);
  } catch (error) {
    next(error);
  }
};

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

const eliminarMensaje = async (req, res, next) => {
  try {
    const idMensaje = parseInt(req.params.idMensaje, 10);
    const resultado = await mensajesService.eliminarMensaje(idMensaje);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const marcarComoLeido = async (req, res, next) => {
  try {
    const idMensaje = parseInt(req.params.idMensaje, 10);
    const resultado = await mensajesService.marcarComoLeido(idMensaje);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const responderMensaje = async (req, res, next) => {
  try {
    const idMensaje = parseInt(req.params.idMensaje, 10);
    const { respuesta } = req.body;
    const respondidoPor =
      req.user?.nombre || req.user?.nombreEmpleado || "Admin";
    const resultado = await mensajesService.responderMensaje(
      idMensaje,
      respuesta,
      respondidoPor,
    );
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
  marcarComoLeido,
  responderMensaje,
};
