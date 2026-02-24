const DashboardService = require("../services/DashboardService");

const obtenerMetricas = async (req, res, next) => {
  try {
    const metricas = await DashboardService.obtenerMetricas();

    res.status(200).json({
      success: true,
      message: "Métricas obtenidas exitosamente",
      data: metricas,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerProductosMasVendidos = async (req, res, next) => {
  try {
    const limite = parseInt(req.query.limite) || 10;

    const resultado =
      await DashboardService.obtenerProductosMasVendidos(limite);

    res.status(200).json({
      success: true,
      message: "Productos más vendidos obtenidos exitosamente",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerGraficoVentas = async (req, res, next) => {
  try {
    const dias = parseInt(req.query.dias) || 7;

    const grafico = await DashboardService.obtenerGraficoVentas(dias);

    res.status(200).json({
      success: true,
      message: "Gráfico de ventas obtenido exitosamente",
      data: grafico,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerMetricas,
  obtenerProductosMasVendidos,
  obtenerGraficoVentas,
};
