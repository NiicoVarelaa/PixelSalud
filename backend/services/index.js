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
  MedicosService: require("./MedicosService"),
  PermisosService: require("./PermisosService"),
  RecetasService: require("./RecetasService"),
  VentasOnlineService: require("./VentasOnlineService"),
  VentasEmpleadosService: require("./VentasEmpleadosService"),
  MensajesService: require("./MensajesService"),
  ReportesService: require("./ReportesService"),
  // AuthService: require('./AuthService'),           // Ejemplo
};
