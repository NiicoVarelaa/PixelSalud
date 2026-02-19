/**
 * Crea un error de recurso no encontrado (404)
 * Se usa cuando el recurso solicitado no existe
 * Ejemplo: intentar obtener un producto que no está en la BD
 *
 * @param {string} message - Mensaje del error
 * @returns {Error} Error con statusCode 404
 */
function createNotFoundError(message = "Recurso no encontrado") {
  const error = new Error(message);
  error.statusCode = 404;
  error.status = "fail";
  error.isOperational = true;
  error.name = "NotFoundError";

  Error.captureStackTrace(error, createNotFoundError);

  return error;
}

module.exports = createNotFoundError;
