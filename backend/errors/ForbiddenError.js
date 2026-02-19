/**
 * Crea un error de permisos insuficientes (403)
 * Se usa cuando el usuario está autenticado pero no tiene permisos
 * Ejemplo: un empleado intenta acceder a funciones de admin
 *
 * @param {string} message - Mensaje del error
 * @returns {Error} Error con statusCode 403
 */
function createForbiddenError(
  message = "No tienes permisos para realizar esta acción",
) {
  const error = new Error(message);
  error.statusCode = 403;
  error.status = "fail";
  error.isOperational = true;
  error.name = "ForbiddenError";

  Error.captureStackTrace(error, createForbiddenError);

  return error;
}

module.exports = createForbiddenError;
