/**
 * Exportación centralizada de todos los repositories
 * Todos los repositories ahora usan programación funcional
 */
module.exports = {
  ProductosRepository: require("./ProductosRepository"),
  OfertasRepository: require("./OfertasRepository"),
  CarritoRepository: require("./CarritoRepository"),
  ClientesRepository: require("./ClientesRepository"),
  EmpleadosRepository: require("./EmpleadosRepository"),
  FavoritosRepository: require("./FavoritosRepository"),
  CampanasRepository: require("./CampanasRepository"),
  ProductosCampanasRepository: require("./ProductosCampanasRepository"),
  AuthRepository: require("./AuthRepository"),
  MedicosRepository: require("./MedicosRepository"),
  PermisosRepository: require("./PermisosRepository"),
  RecetasRepository: require("./RecetasRepository"),
  VentasOnlineRepository: require("./VentasOnlineRepository"),
  VentasEmpleadosRepository: require("./VentasEmpleadosRepository"),
};
