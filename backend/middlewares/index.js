/**
 * Exportación centralizada de todos los middlewares
 *
 * Esto permite hacer:
 *   const { auth, verificarRol, errorHandler } = require('../middlewares');
 *
 * En lugar de:
 *   const auth = require('../middlewares/Auth');
 *   const { verificarRol } = require('../middlewares/VerificarPermisos');
 *   const { errorHandler } = require('../middlewares/ErrorHandler');
 */

module.exports = {
  Auth: require("./Auth"),
  ErrorHandler: require("./ErrorHandler"),
  Validate: require("./Validate"),
  VerificarPermisos: require("./VerificarPermisos"),
};
