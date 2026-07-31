const ventasOnlineService = require("../services/VentasOnlineService");
const { Auditoria } = require("../helps");

const getUserOrders = async (req, res, next) => {
  try {
    const idCliente = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const result = await ventasOnlineService.obtenerVentasPorCliente(idCliente, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const mostrarTodasLasVentas = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const result = await ventasOnlineService.obtenerTodasLasVentas(page, limit);
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

    await Auditoria.registrarVentaCreada(
      {
        id: result.idVentaO,
        tipo: "online",
        total:
          result.totalPago ||
          req.body.productos?.reduce(
            (acc, p) => acc + p.precioUnitario * p.cantidad,
            0,
          ),
        idCliente: req.body.idCliente,
        metodoPago: req.body.metodoPago,
      },
      req.user || { id: req.body.idCliente, role: "cliente" },
      req,
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const actualizarEstadoVenta = async (req, res, next) => {
  try {
    const { idVentaO, nuevoEstado } = req.body;

    const ventaAnterior = await ventasOnlineService.obtenerDetalleVenta(
      parseInt(idVentaO, 10),
    );

    const result = await ventasOnlineService.actualizarEstadoVenta(
      parseInt(idVentaO, 10),
      nuevoEstado,
    );

    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.VENTA_ESTADO_CAMBIADO,
        modulo: Auditoria.MODULOS.VENTAS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Estado de venta online #${idVentaO} cambiado a: ${nuevoEstado}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "VentasOnlines",
        idEntidad: idVentaO,
        datosAnteriores: { estado: ventaAnterior[0]?.estado },
        datosNuevos: { estado: nuevoEstado },
      },
      req,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const actualizarVentaOnline = async (req, res, next) => {
  try {
    const { idVentaO } = req.params;

    const ventaAnterior = await ventasOnlineService.obtenerDetalleVenta(
      parseInt(idVentaO, 10),
    );

    const result = await ventasOnlineService.actualizarVentaOnline(
      parseInt(idVentaO, 10),
      req.body,
    );

    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.VENTA_MODIFICADA,
        modulo: Auditoria.MODULOS.VENTAS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Venta online #${idVentaO} actualizada`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "VentasOnlines",
        idEntidad: idVentaO,
        datosAnteriores: ventaAnterior[0],
        datosNuevos: req.body,
      },
      req,
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
