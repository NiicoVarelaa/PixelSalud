/**
 * Crea un error de autenticación (401)
 * Se usa cuando el usuario no está autenticado o el token no es válido
 * Ejemplo: token expirado, token inválido, sin token
 *
 * @param {string} message - Mensaje del error
 * @returns {Error} Error con statusCode 401
 */
function createUnauthorizedError(
  message = "No autenticado. Token requerido o inválido",
) {
  const error = new Error(message);
  error.statusCode = 401;
  error.status = "fail";
  error.isOperational = true;
  error.name = "UnauthorizedError";

  Error.captureStackTrace(error, createUnauthorizedError);

  return error;
}

module.exports = createUnauthorizedError;
