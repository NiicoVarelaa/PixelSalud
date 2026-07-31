const historialService = require("../services/HistorialOfertasService");

const getHistorialPorProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const historial = await historialService.obtenerHistorialPorProducto(idProducto);
    res.json(historial);
  } catch (error) {
    next(error);
  }
};

const getHistorialGeneral = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const [historial, total] = await Promise.all([
      historialService.obtenerHistorialGeneral(limit, offset),
      historialService.contarRegistros(),
    ]);
    res.json({ historial, total, limit, offset });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistorialPorProducto,
  getHistorialGeneral,
};
