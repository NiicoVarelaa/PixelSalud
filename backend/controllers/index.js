/**
 * Exportación centralizada de todos los controllers
 *
 * Esto permite hacer:
 *   const { ProductosController, ClientesController } = require('../controllers');
 *
 * En lugar de:
 *   const ProductosController = require('../controllers/ProductosController');
 *   const ClientesController = require('../controllers/ClientesController');
 */

module.exports = {
  AuthController: require("./AuthController"),
  CampanasController: require("./CampanasController"),
  CarritoController: require("./CarritoController"),
  ClientesController: require("./ClientesController"),
  CuponesController: require("./CuponesController"),
  EmpleadosController: require("./EmpleadosController"),
  FavoritosController: require("./FavoritosController"),
  MedicosController: require("./MedicosController"),
  MensajesController: require("./MensajesController"),
  MercadoPagoController: require("./MercadoPagoController"),
  OfertasController: require("./OfertasController"),
  PermisosController: require("./PermisosController"),
  ProductosController: require("./ProductosController"),
  RecetasController: require("./RecetasController"),
  ReportesController: require("./ReportesController"),
  VentasEmpleadosController: require("./VentasEmpleadosController"),
  VentasOnlineController: require("./VentasOnlineController"),
};
