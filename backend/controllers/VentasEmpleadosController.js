const ventasEmpleadosService = require("../services/VentasEmpleadosService");
const { Auditoria } = require("../helps");

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

    // Registrar auditoría de creación de venta empleado
    await Auditoria.registrarVentaCreada(
      {
        id: resultado.idVentaE,
        tipo: "empleado",
        total: totalPago,
        idEmpleado: idEmpleado,
        metodoPago: metodoPago,
      },
      req.user || { id: idEmpleado, role: "empleado" },
      req,
    );

    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

const updateVenta = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);
    const { totalPago, metodoPago, productos, idEmpleado } = req.body;

    // Obtener venta antes de actualizar para auditoría
    const ventaAnterior =
      await ventasEmpleadosService.obtenerVentaPorId(idVentaE);

    const resultado = await ventasEmpleadosService.actualizarVenta(idVentaE, {
      totalPago,
      metodoPago,
      productos,
      idEmpleado,
    });

    // Registrar auditoría de actualización de venta
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.VENTA_MODIFICADA,
        modulo: Auditoria.MODULOS.VENTAS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Venta empleado #${idVentaE} actualizada`,
        tipoUsuario: req.user?.role || "empleado",
        idUsuario: req.user?.id,
        entidadAfectada: "VentasEmpleados",
        idEntidad: idVentaE,
        datosAnteriores: ventaAnterior,
        datosNuevos: { totalPago, metodoPago, productos, idEmpleado },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const anularVenta = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);

    // Obtener venta antes de anular para auditoría
    const ventaAnterior =
      await ventasEmpleadosService.obtenerVentaPorId(idVentaE);

    const resultado = await ventasEmpleadosService.anularVenta(idVentaE);

    // Registrar auditoría de anulación de venta
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.VENTA_ANULADA,
        modulo: Auditoria.MODULOS.VENTAS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Venta empleado #${idVentaE} anulada`,
        tipoUsuario: req.user?.role || "empleado",
        idUsuario: req.user?.id,
        entidadAfectada: "VentasEmpleados",
        idEntidad: idVentaE,
        datosAnteriores: ventaAnterior,
        datosNuevos: { estado: "anulada" },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const reactivarVenta = async (req, res, next) => {
  try {
    const idVentaE = parseInt(req.params.idVentaE, 10);

    // Obtener venta antes de reactivar para auditoría
    const ventaAnterior =
      await ventasEmpleadosService.obtenerVentaPorId(idVentaE);

    const resultado = await ventasEmpleadosService.reactivarVenta(idVentaE);

    // Registrar auditoría de reactivación de venta
    await Auditoria.registrarAuditoria(
      {
        evento: "VENTA_REACTIVADA",
        modulo: Auditoria.MODULOS.VENTAS,
        accion: Auditoria.ACCIONES.AUTORIZAR,
        descripcion: `Venta empleado #${idVentaE} reactivada`,
        tipoUsuario: req.user?.role || "empleado",
        idUsuario: req.user?.id,
        entidadAfectada: "VentasEmpleados",
        idEntidad: idVentaE,
        datosAnteriores: ventaAnterior,
        datosNuevos: { estado: "completada" },
      },
      req,
    );

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
