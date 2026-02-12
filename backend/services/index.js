/**
 * Exportación centralizada de todos los services
 * A medida que agregues nuevos services, impórtalos aquí
 */
module.exports = {
  ProductosService: require("./ProductosService"),
  CarritoService: require("./CarritoService"),
  ClientesService: require("./ClientesService"),
  EmpleadosService: require("./EmpleadosService"),
  favoritosService: require("./FavoritosService"),
  // AuthService: require('./AuthService'),           // Ejemplo
};
