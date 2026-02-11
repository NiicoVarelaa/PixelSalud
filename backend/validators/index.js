/**
 * Exportación centralizada de todos los esquemas de validación
 * A medida que agregues nuevos schemas, impórtalos aquí
 */
module.exports = {
  productoSchemas: require("./productoSchemas"),
  carritoSchemas: require("./carritoSchemas"),
  clienteSchemas: require("./clienteSchemas"),
  empleadoSchemas: require("./empleadoSchemas"),
  // authSchemas: require('./authSchemas'),         // Ejemplo
};
