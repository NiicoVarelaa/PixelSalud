const ventasEmpleadosService = require("../services/VentasEmpleadosService");

const obtenerVentasEmpleado = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerTodasLasVentas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

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

const obtenerDetalleVentaEmpleado = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const detalles = await ventasEmpleadosService.obtenerDetalleVenta(idVentaE);
    res.status(200).json(detalles);
  } catch (error) {
    next(error);
  }
};

const obtenerVentasAnuladas = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerVentasAnuladas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

const obtenerVentasCompletadas = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerVentasCompletadas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

const obtenerVentaPorId = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const venta = await ventasEmpleadosService.obtenerVentaPorId(idVentaE);
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

const obtenerVentaParaEditar = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const venta = await ventasEmpleadosService.obtenerVentaPorId(idVentaE);
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

const obtenerVentasParaAdmin = async (req, res, next) => {
  try {
    const ventas = await ventasEmpleadosService.obtenerTodasLasVentas();
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

const obtenerVentaCompletaAdmin = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const venta = await ventasEmpleadosService.obtenerVentaCompleta(idVentaE);
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

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

const anularVenta = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const resultado = await ventasEmpleadosService.anularVenta(idVentaE);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

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
