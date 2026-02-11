/**
 * Exportación centralizada de todos los services
 * A medida que agregues nuevos services, impórtalos aquí
 */
module.exports = {
  ProductosService: require("./ProductosService"),
  CarritoService: require("./CarritoService"),
  ClientesService: require("./ClientesService"),
  // AuthService: require('./AuthService'),           // Ejemplo
};
