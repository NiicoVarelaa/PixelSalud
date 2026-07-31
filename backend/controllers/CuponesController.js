const cuponesService = require("../services/CuponesService");
const cuponesCumpleanosService = require("../services/CuponesCumpleanosService");
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

    await Auditoria.registrarAuditoria(
      {
        evento: "CUPON_CREADO",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Cupón "${cuponData.codigo}" creado - Descuento: ${cuponData.valorDescuento}${cuponData.tipoCupon === "porcentaje" ? "%" : "$"}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id || adminId,
        entidadAfectada: "Cupones",
        idEntidad: cupon.idCupon,
        datosAnteriores: null,
        datosNuevos: cuponData,
      },
      req,
    );

    const envioMail = cupon?.envioMail;
    const message = envioMail
      ? `Cupón creado exitosamente. Emails enviados: ${envioMail.enviados}/${envioMail.totalDestinatarios}`
      : "Cupón creado exitosamente";

    res.status(201).json({
      success: true,
      message,
      data: cupon,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerTodosCupones = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const cupones = await cuponesService.obtenerTodosCuponesPaginados(page, limit);

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

    const cuponAnterior = await cuponesService.obtenerCuponPorId(parseInt(id));

    await cuponesService.actualizarEstado(parseInt(id), estado);

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

    const cuponAnterior = await cuponesService.obtenerCuponPorId(parseInt(id));

    await cuponesService.eliminarCupon(parseInt(id));

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

const procesarCuponesCumpleanos = async (req, res, next) => {
  try {
    const resumen = await cuponesCumpleanosService.procesarCuponesCumpleanos();

    res.status(200).json({
      success: true,
      message: `Proceso completado. Enviados: ${resumen.enviados}, Fallidos: ${resumen.fallidos}`,
      data: resumen,
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
  procesarCuponesCumpleanos,
  actualizarEstado,
  eliminarCupon,
};
