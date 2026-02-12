/**
 * Exportación centralizada de todos los esquemas de validación
 * A medida que agregues nuevos schemas, impórtalos aquí
 */
module.exports = {
  productoSchemas: require("./ProductoSchemas"),
  carritoSchemas: require("./CarritoSchemas"),
  clienteSchemas: require("./ClienteSchemas"),
  empleadoSchemas: require("./EmpleadoSchemas"),
  favoritoSchemas: require("./FavoritoSchemas"),
  // authSchemas: require('./authSchemas'),         // Ejemplo
};
