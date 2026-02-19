const cuponesService = require("../services/CuponesService");

/**
 * Validar cupón y calcular descuento
 * POST /cupones/validar
 * Body: { codigo, montoCompra }
 */
const validarCupon = async (req, res, next) => {
  try {
    const { codigo, montoCompra } = req.body;
    const idCliente = req.userId;

    if (!codigo || !montoCompra) {
      return res.status(400).json({
        success: false,
        message: "Código de cupón y monto de compra son requeridos",
      });
    }

    const resultado = await cuponesService.validarYCalcularDescuento(
      codigo.toUpperCase(),
      idCliente,
      parseFloat(montoCompra),
    );

    if (!resultado.valido) {
      return res.status(400).json({
        success: false,
        message: resultado.mensaje,
      });
    }

    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      data: {
        descuento: resultado.descuento,
        montoFinal: resultado.montoFinal,
        cupon: resultado.cupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear cupón personalizado (admin)
 * POST /cupones
 * Body: { codigo, tipoCupon, valorDescuento, descripcion, fechaInicio, fechaVencimiento, ... }
 */
const crearCupon = async (req, res, next) => {
  try {
    const adminId = req.userId;
    const cuponData = req.body;

    const cupon = await cuponesService.crearCupon(cuponData, adminId);

    res.status(201).json({
      success: true,
      message: "Cupón creado exitosamente",
      data: cupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todos los cupones (admin)
 * GET /cupones
 */
const obtenerTodosCupones = async (req, res, next) => {
  try {
    const cupones = await cuponesService.obtenerTodosCupones();

    res.status(200).json({
      success: true,
      data: cupones,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener cupones activos
 * GET /cupones/activos
 */
const obtenerCuponesActivos = async (req, res, next) => {
  try {
    const cupones = await cuponesService.obtenerCuponesActivos();

    res.status(200).json({
      success: true,
      data: cupones,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener cupón por código
 * GET /cupones/:codigo
 */
const obtenerCuponPorCodigo = async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const cupon = await cuponesService.obtenerCuponPorCodigo(
      codigo.toUpperCase(),
    );

    res.status(200).json({
      success: true,
      data: cupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener historial de cupones usados por el cliente actual
 * GET /cupones/mis-cupones
 */
const obtenerMisCupones = async (req, res, next) => {
  try {
    const idCliente = req.userId;
    const historial = await cuponesService.obtenerHistorialCliente(idCliente);

    res.status(200).json({
      success: true,
      data: historial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar estado de cupón (admin)
 * PATCH /cupones/:id/estado
 * Body: { estado: 'activo' | 'inactivo' }
 */
const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await cuponesService.actualizarEstado(parseInt(id), estado);

    res.status(200).json({
      success: true,
      message: "Estado actualizado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar cupón (admin)
 * DELETE /cupones/:id
 */
const eliminarCupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    await cuponesService.eliminarCupon(parseInt(id));

    res.status(200).json({
      success: true,
      message: "Cupón eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener historial completo de uso de cupones (admin)
 * GET /cupones/historial
 */
const obtenerHistorial = async (req, res, next) => {
  try {
    const historial = await cuponesService.obtenerTodoHistorial();

    res.status(200).json({
      success: true,
      data: historial,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validarCupon,
  crearCupon,
  obtenerTodosCupones,
  obtenerCuponesActivos,
  obtenerCuponPorCodigo,
  obtenerMisCupones,
  obtenerHistorial,
  actualizarEstado,
  eliminarCupon,
};
