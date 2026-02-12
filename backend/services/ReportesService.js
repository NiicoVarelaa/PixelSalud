const reportesRepository = require("../repositories/ReportesRepository");

/**
 * Calcula estadísticas de ventas
 * @param {Array} ventas - Array de ventas
 * @returns {Object} - Estadísticas calculadas
 */
const calcularEstadisticas = (ventas) => {
  const totalIngresos = ventas.reduce(
    (sum, v) => sum + parseFloat(v.totalPago || 0),
    0,
  );
  const cantidadVentas = ventas.length;
  const ticketPromedio =
    cantidadVentas > 0 ? totalIngresos / cantidadVentas : 0;

  return {
    totalIngresos,
    cantidadVentas,
    ticketPromedio,
  };
};

/**
 * Genera datos para reporte de ventas online
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Object>}
 */
const generarReporteVentasOnline = async (filters) => {
  const ventas = await reportesRepository.getVentasOnline(filters);
  const estadisticas = calcularEstadisticas(ventas);

  return {
    ventas,
    estadisticas,
    filtros: filters,
    fechaGeneracion: new Date(),
  };
};

/**
 * Genera datos para reporte de ventas empleados
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Object>}
 */
const generarReporteVentasEmpleados = async (filters) => {
  const ventas = await reportesRepository.getVentasEmpleados(filters);
  const ranking = await reportesRepository.getRankingEmpleados({
    fechaDesde: filters.fechaDesde,
    fechaHasta: filters.fechaHasta,
  });
  const estadisticas = calcularEstadisticas(ventas);

  return {
    ventas,
    ranking,
    estadisticas,
    filtros: filters,
    fechaGeneracion: new Date(),
  };
};

/**
 * Genera datos para reporte consolidado
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Object>}
 */
const generarReporteConsolidado = async (filters) => {
  const { ventasOnline, ventasEmpleados } =
    await reportesRepository.getComparativaCanales(filters);
  const productosTop = await reportesRepository.getProductosTop(filters);

  // Estadísticas por canal
  const estadisticasOnline = calcularEstadisticas(ventasOnline);
  const estadisticasEmpleados = calcularEstadisticas(ventasEmpleados);

  // Totales generales
  const totalGeneral =
    estadisticasOnline.totalIngresos + estadisticasEmpleados.totalIngresos;
  const ventasGenerales =
    estadisticasOnline.cantidadVentas + estadisticasEmpleados.cantidadVentas;

  // Porcentajes por canal
  const porcentajeOnline =
    totalGeneral > 0
      ? ((estadisticasOnline.totalIngresos / totalGeneral) * 100).toFixed(2)
      : 0;
  const porcentajeLocal =
    totalGeneral > 0
      ? ((estadisticasEmpleados.totalIngresos / totalGeneral) * 100).toFixed(2)
      : 0;

  return {
    ventasOnline,
    ventasEmpleados,
    productosTop,
    estadisticasOnline,
    estadisticasEmpleados,
    totalGeneral,
    ventasGenerales,
    porcentajeOnline,
    porcentajeLocal,
    filtros: filters,
    fechaGeneracion: new Date(),
  };
};

/**
 * Genera datos para reporte de productos vendidos
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Object>}
 */
const generarReporteProductosVendidos = async (filters) => {
  const productosTop = await reportesRepository.getProductosTop(filters);
  const ventasDetalladas =
    await reportesRepository.getVentasConDetalles(filters);

  // Agrupar por categoría
  const ventasPorCategoria = ventasDetalladas.reduce((acc, venta) => {
    const cat = venta.categoria || "Sin Categoría";
    if (!acc[cat]) {
      acc[cat] = {
        categoria: cat,
        cantidadVendida: 0,
        ingresoTotal: 0,
      };
    }
    acc[cat].cantidadVendida += venta.cantidad;
    acc[cat].ingresoTotal += parseFloat(venta.subtotal || 0);
    return acc;
  }, {});

  const categorias = Object.values(ventasPorCategoria).sort(
    (a, b) => b.ingresoTotal - a.ingresoTotal,
  );

  // Calcular totales
  const totalUnidadesVendidas = productosTop.reduce(
    (sum, p) => sum + parseInt(p.cantidadVendida || 0),
    0,
  );
  const ingresoTotalProductos = productosTop.reduce(
    (sum, p) => sum + parseFloat(p.ingresoTotal || 0),
    0,
  );

  return {
    productosTop,
    ventasDetalladas,
    categorias,
    totalUnidadesVendidas,
    ingresoTotalProductos,
    filtros: filters,
    fechaGeneracion: new Date(),
  };
};

module.exports = {
  generarReporteVentasOnline,
  generarReporteVentasEmpleados,
  generarReporteConsolidado,
  generarReporteProductosVendidos,
};
