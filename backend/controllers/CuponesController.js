const cuponesService = require("../services/CuponesService");
const { Auditoria } = require("../helps");

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

const crearCupon = async (req, res, next) => {
  try {
    const adminId = req.userId;
    const cuponData = req.body;

    const cupon = await cuponesService.crearCupon(cuponData, adminId);

    // Registrar auditoría de creación de cupón
    await Auditoria.registrarAuditoria(
      {
        evento: "CUPON_CREADO",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Cupón "${cuponData.codigo}" creado - Descuento: ${cuponData.descuento}${cuponData.tipoCupon === "porcentaje" ? "%" : "$"}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id || adminId,
        entidadAfectada: "Cupones",
        idEntidad: cupon.id,
        datosAnteriores: null,
        datosNuevos: cuponData,
      },
      req,
    );

    res.status(201).json({
      success: true,
      message: "Cupón creado exitosamente",
      data: cupon,
    });
  } catch (error) {
    next(error);
  }
};

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

const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Obtener cupón antes de actualizar para auditoría
    const cuponAnterior = await cuponesService.obtenerCuponPorId(parseInt(id));

    await cuponesService.actualizarEstado(parseInt(id), estado);

    // Registrar auditoría de cambio de estado de cupón
    await Auditoria.registrarAuditoria(
      {
        evento: estado ? "CUPON_ACTIVADO" : "CUPON_DESACTIVADO",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Cupón "${cuponAnterior?.codigo}" ${estado ? "activado" : "desactivado"}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Cupones",
        idEntidad: id,
        datosAnteriores: { estado: cuponAnterior?.estado },
        datosNuevos: { estado },
      },
      req,
    );

    res.status(200).json({
      success: true,
      message: "Estado actualizado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const eliminarCupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener cupón antes de eliminar para auditoría
    const cuponAnterior = await cuponesService.obtenerCuponPorId(parseInt(id));

    await cuponesService.eliminarCupon(parseInt(id));

    // Registrar auditoría de eliminación de cupón
    await Auditoria.registrarAuditoria(
      {
        evento: "CUPON_ELIMINADO",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Cupón "${cuponAnterior?.codigo}" eliminado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Cupones",
        idEntidad: id,
        datosAnteriores: cuponAnterior,
        datosNuevos: null,
      },
      req,
    );

    res.status(200).json({
      success: true,
      message: "Cupón eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

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
