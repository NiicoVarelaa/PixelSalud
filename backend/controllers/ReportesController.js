const reportesService = require("../services/ReportesService");
const {
  generarWorkbookVentasOnline,
  generarWorkbookVentasEmpleados,
  generarWorkbookConsolidado,
  generarWorkbookProductosVendidos,
  responderArchivoExcel,
} = require("../services/ReportesExcelService");

const reporteVentasOnline = async (req, res, next) => {
  try {
    const filters = {
      fechaDesde: req.query.fechaDesde,
      fechaHasta: req.query.fechaHasta,
      estado: req.query.estado,
      metodoPago: req.query.metodoPago,
    };

    const { ventas, estadisticas } =
      await reportesService.generarReporteVentasOnline(filters);

    const workbook = generarWorkbookVentasOnline({
      ventas,
      estadisticas,
      filters,
    });

    await responderArchivoExcel(res, workbook, "VentasOnline");
  } catch (error) {
    next(error);
  }
};

const reporteVentasEmpleados = async (req, res, next) => {
  try {
    const filters = {
      fechaDesde: req.query.fechaDesde,
      fechaHasta: req.query.fechaHasta,
      estado: req.query.estado,
      metodoPago: req.query.metodoPago,
      idEmpleado: req.query.idEmpleado,
    };

    const { ventas, ranking, estadisticas } =
      await reportesService.generarReporteVentasEmpleados(filters);

    const workbook = generarWorkbookVentasEmpleados({
      ventas,
      ranking,
      estadisticas,
      filters,
    });

    await responderArchivoExcel(res, workbook, "VentasEmpleados");
  } catch (error) {
    next(error);
  }
};

const reporteConsolidado = async (req, res, next) => {
  try {
    const filters = {
      fechaDesde: req.query.fechaDesde,
      fechaHasta: req.query.fechaHasta,
    };

    const {
      productosTop,
      estadisticasOnline,
      estadisticasEmpleados,
      totalGeneral,
      ventasGenerales,
      porcentajeOnline,
      porcentajeLocal,
    } = await reportesService.generarReporteConsolidado(filters);

    const workbook = generarWorkbookConsolidado({
      productosTop,
      estadisticasOnline,
      estadisticasEmpleados,
      totalGeneral,
      ventasGenerales,
      porcentajeOnline,
      porcentajeLocal,
      filters,
    });

    await responderArchivoExcel(res, workbook, "ReporteConsolidado");
  } catch (error) {
    next(error);
  }
};

const reporteProductosVendidos = async (req, res, next) => {
  try {
    const filters = {
      fechaDesde: req.query.fechaDesde,
      fechaHasta: req.query.fechaHasta,
    };

    const {
      productosTop,
      categorias,
      totalUnidadesVendidas,
      ingresoTotalProductos,
    } = await reportesService.generarReporteProductosVendidos(filters);

    const workbook = generarWorkbookProductosVendidos({
      productosTop,
      categorias,
      totalUnidadesVendidas,
      ingresoTotalProductos,
      filters,
    });

    await responderArchivoExcel(res, workbook, "ProductosVendidos");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reporteVentasOnline,
  reporteVentasEmpleados,
  reporteConsolidado,
  reporteProductosVendidos,
};
