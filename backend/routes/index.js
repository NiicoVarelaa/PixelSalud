/**
 * Exportación centralizada de todas las rutas
 *
 * Esto permite hacer:
 *   const { ProductosRoutes, ClientesRoutes } = require('../routes');
 *
 * En lugar de:
 *   const ProductosRoutes = require('../routes/ProductosRoutes');
 *   const ClientesRoutes = require('../routes/ClientesRoutes');
 *
 * NOTA: En index.js del servidor, las rutas se llaman con require() directo,
 * pero este archivo es útil si necesitas importar múltiples rutas en otro lugar.
 */

module.exports = {
  AuthRoutes: require("./AuthRoutes"),
  CampanasRoutes: require("./CampanasRoutes"),
  CarritoRoutes: require("./CarritoRoutes"),
  ClientesRoutes: require("./ClientesRoutes"),
  CuponesRoutes: require("./CuponesRoutes"),
  EmpleadosRoutes: require("./EmpleadosRoutes"),
  FavoritosRoutes: require("./FavoritosRoutes"),
  MedicosRoutes: require("./MedicosRoutes"),
  MensajesRoutes: require("./MensajesRoutes"),
  MercadoPagoRoutes: require("./MercadoPagoRoutes"),
  OfertasRoutes: require("./OfertasRoutes"),
  PermisosRoutes: require("./PermisosRoutes"),
  ProductosRoutes: require("./ProductosRoutes"),
  RecetasRoutes: require("./RecetasRoutes"),
  ReportesRoutes: require("./ReportesRoutes"),
  VentasEmpleadosRoutes: require("./VentasEmpleadosRoutes"),
  VentasOnlineRoutes: require("./VentasOnlineRoutes"),
};
