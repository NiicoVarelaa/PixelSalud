const ventasOnlineService = require("../services/VentasOnlineService");

const getUserOrders = async (req, res, next) => {
  try {
    const idCliente = req.user.id;
    const result = await ventasOnlineService.obtenerVentasPorCliente(idCliente);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const mostrarTodasLasVentas = async (req, res, next) => {
  try {
    const result = await ventasOnlineService.obtenerTodasLasVentas();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const obtenerDetalleVentaOnline = async (req, res, next) => {
  try {
    const { idVentaO } = req.params;
    const result = await ventasOnlineService.obtenerDetalleVenta(
      parseInt(idVentaO, 10),
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const registrarVentaOnline = async (req, res, next) => {
  try {
    const result = await ventasOnlineService.registrarVentaOnline(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const actualizarEstadoVenta = async (req, res, next) => {
  try {
    const { idVentaO, nuevoEstado } = req.body;
    const result = await ventasOnlineService.actualizarEstadoVenta(
      parseInt(idVentaO, 10),
      nuevoEstado,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const actualizarVentaOnline = async (req, res, next) => {
  try {
    const { idVentaO } = req.params;
    const result = await ventasOnlineService.actualizarVentaOnline(
      parseInt(idVentaO, 10),
      req.body,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  mostrarTodasLasVentas,
  obtenerDetalleVentaOnline,
  registrarVentaOnline,
  actualizarEstadoVenta,
  actualizarVentaOnline,
};
