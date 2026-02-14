const ventasEmpleadosService = require("../services/VentasEmpleadosService");

/**
 * Obtiene todas las ventas de empleados
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerVentasEmpleado = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerTodasLasVentas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las ventas de un empleado específico
 * @param {Object} req - Request con idEmpleado en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerLaVentaDeUnEmpleado = async (req, res, next) => {
  try {
    const idEmpleado = parseInt(req.params.idEmpleado, 10);
    const ventas =
      await ventasEmpleadosService.obtenerVentasPorEmpleado(idEmpleado);
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los detalles de una venta específica
 * @param {Object} req - Request con idVentaE en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerDetalleVentaEmpleado = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const detalles = await ventasEmpleadosService.obtenerDetalleVenta(idVentaE);
    res.status(200).json(detalles);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las ventas anuladas
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerVentasAnuladas = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerVentasAnuladas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las ventas completadas
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerVentasCompletadas = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerVentasCompletadas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una venta específica por ID (simple)
 * @param {Object} req - Request con idVentaE en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerVentaPorId = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const venta = await ventasEmpleadosService.obtenerVentaPorId(idVentaE);
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una venta para editar (simple)
 * @param {Object} req - Request con idVentaE en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerVentaParaEditar = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const venta = await ventasEmpleadosService.obtenerVentaPorId(idVentaE);
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todas las ventas (para admin con detalles)
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerVentasParaAdmin = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerTodasLasVentas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una venta con detalles completos (para admin)
 * @param {Object} req - Request con idVentaE en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const obtenerVentaCompletaAdmin = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const venta = await ventasEmpleadosService.obtenerVentaCompleta(idVentaE);
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

/**
 * Registra una nueva venta de empleado
 * @param {Object} req - Request con datos de venta en body
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const registrarVentaEmpleado = async (req, res, next) => {
  try {
    const { idEmpleado, totalPago, metodoPago, productos } = req.body;
    const resultado = await ventasEmpleadosService.registrarVenta({
      idEmpleado,
      totalPago,
      metodoPago,
      productos,
    });
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una venta de empleado
 * @param {Object} req - Request con idVentaE en params y datos en body
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const updateVenta = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const { totalPago, metodoPago, productos, idEmpleado } = req.body;
    const resultado = await ventasEmpleadosService.actualizarVenta(idVentaE, {
      totalPago,
      metodoPago,
      productos,
      idEmpleado,
    });
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Anula una venta de empleado
 * @param {Object} req - Request con idVentaE en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const anularVenta = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const resultado = await ventasEmpleadosService.anularVenta(idVentaE);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Reactiva una venta anulada
 * @param {Object} req - Request con idVentaE en params
 * @param {Object} res - Response
 * @param {Function} next - Next middleware
 */
const reactivarVenta = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const resultado = await ventasEmpleadosService.reactivarVenta(idVentaE);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
  obtenerDetalleVentaEmpleado,
  obtenerVentasAnuladas,
  obtenerVentasCompletadas,
  obtenerVentaPorId,
  obtenerVentaParaEditar,
  obtenerVentasParaAdmin,
  obtenerVentaCompletaAdmin,
  registrarVentaEmpleado,
  updateVenta,
  anularVenta,
  reactivarVenta,
};
