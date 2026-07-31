const DashboardRepository = require("../repositories/DashboardRepository");
const { createAppError } = require("../errors");

const obtenerMetricas = async () => {
  try {
    const metricas = await DashboardRepository.getMetricasCompletas();

    if (!metricas) {
      throw createAppError("No se pudieron obtener las métricas", 500);
    }

    const ticketPromedio =
      metricas.ventasHoy.transacciones > 0
        ? metricas.ventasHoy.total / metricas.ventasHoy.transacciones
        : 0;

    const promedioSemana = metricas.ventasSemana.total / 7;
    const tendencia = {
      tipo: metricas.ventasHoy.total > promedioSemana ? "positiva" : "negativa",
      porcentaje:
        promedioSemana > 0
          ? ((metricas.ventasHoy.total - promedioSemana) / promedioSemana) * 100
          : 0,
    };

    return {
      ...metricas,
      ticketPromedio: parseFloat(ticketPromedio.toFixed(2)),
      tendencia,
      ultimaActualizacion: new Date().toISOString(),
    };
  } catch (error) {
    if (error.statusCode && error.isOperational) {
      throw error;
    }
    throw createAppError(
      "Error al obtener las métricas del dashboard",
      500,
      error.message,
    );
  }
};

const obtenerProductosMasVendidos = async (limite = 10) => {
  try {
    if (limite < 1 || limite > 50) {
      throw createAppError(
        "El límite debe estar entre 1 y 50",
        400,
        "INVALID_LIMIT",
      );
    }

    const productos = await DashboardRepository.getProductosMasVendidos(limite);

    return {
      productos,
      total: productos.length,
      limite,
    };
  } catch (error) {
    if (error.statusCode && error.isOperational) {
      throw error;
    }
    throw createAppError(
      "Error al obtener los productos más vendidos",
      500,
      error.message,
    );
  }
};

const obtenerGraficoVentas = async (dias = 7) => {
  try {
    if (dias < 1 || dias > 90) {
      throw createAppError(
        "El rango de días debe estar entre 1 y 90",
        400,
        "INVALID_RANGE",
      );
    }

    const ventasPorDia = await DashboardRepository.getVentasPorDia(dias);

    const totalVentas = ventasPorDia.reduce(
      (sum, venta) => sum + venta.total,
      0,
    );
    const totalTransacciones = ventasPorDia.reduce(
      (sum, venta) => sum + venta.transacciones,
      0,
    );

    return {
      datos: ventasPorDia,
      resumen: {
        totalVentas: parseFloat(totalVentas.toFixed(2)),
        totalTransacciones,
        promedioDiario: parseFloat((totalVentas / dias).toFixed(2)),
      },
    };
  } catch (error) {
    if (error.statusCode && error.isOperational) {
      throw error;
    }
    throw createAppError(
      "Error al obtener el gráfico de ventas",
      500,
      error.message,
    );
  }
};

module.exports = {
  obtenerMetricas,
  obtenerProductosMasVendidos,
  obtenerGraficoVentas,
};
