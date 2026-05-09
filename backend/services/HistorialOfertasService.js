const historialRepository = require("../repositories/HistorialOfertasRepository");

const registrarCambioOferta = async (data) => {
  return await historialRepository.registrarCambioOferta(data);
};

const obtenerHistorialPorProducto = async (idProducto) => {
  return await historialRepository.obtenerHistorialPorProducto(idProducto);
};

const obtenerHistorialGeneral = async (limit = 50, offset = 0) => {
  return await historialRepository.obtenerHistorialGeneral(limit, offset);
};

const contarRegistros = async () => {
  return await historialRepository.contarRegistros();
};

module.exports = {
  registrarCambioOferta,
  obtenerHistorialPorProducto,
  obtenerHistorialGeneral,
  contarRegistros,
};
