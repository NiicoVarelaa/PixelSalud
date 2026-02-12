const ventasOnlineService = require("../services/VentasOnlineService");

/**
 * Obtiene las compras/ventas online de un cliente específico
 * @route GET /mis-compras
 * @access Cliente
 */
const getUserOrders = async (req, res, next) => {
  try {
    const idCliente = req.user.id;
    const result = await ventasOnlineService.obtenerVentasPorCliente(idCliente);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todas las ventas online del sistema
 * @route GET /ventasOnline/todas
 * @access Admin, Empleado
 */
const mostrarTodasLasVentas = async (req, res, next) => {
  try {
    const result = await ventasOnlineService.obtenerTodasLasVentas();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los detalles de una venta online específica
 * @route GET /ventasOnline/detalle/:idVentaO
 * @access Admin, Empleado
 */
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

/**
 * Registra una nueva venta online
 * @route POST /ventaOnline/crear
 * @access Admin, Empleado, Cliente
 */
const registrarVentaOnline = async (req, res, next) => {
  try {
    const result = await ventasOnlineService.registrarVentaOnline(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el estado de una venta online
 * @route PUT /ventaOnline/estado
 * @access Admin, Empleado
 */
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

/**
 * Actualiza una venta online completa (productos y método de pago)
 * @route PUT /ventaOnline/actualizar/:idVentaO
 * @access Admin, Empleado
 */
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
