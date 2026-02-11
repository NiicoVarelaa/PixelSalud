/**
 * Exportación centralizada de todos los repositories
 * A medida que agregues nuevos repositories, impórtalos aquí
 */
module.exports = {
  BaseRepository: require("./BaseRepository"),
  ProductosRepository: require("./ProductosRepository"),
  OfertasRepository: require("./OfertasRepository"),
  // ClientesRepository: require('./ClientesRepository'), // Ejemplo
};
