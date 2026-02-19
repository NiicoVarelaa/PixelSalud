/**
 * Crea un error de conflicto (409)
 * Se usa cuando hay un conflicto con el estado actual del recurso
 * Ejemplo: intentar crear un usuario que ya existe
 *
 * @param {string} message - Mensaje del error
 * @returns {Error} Error con statusCode 409
 */
function createConflictError(
  message = "El recurso ya existe o hay un conflicto",
) {
  const error = new Error(message);
  error.statusCode = 409;
  error.status = "fail";
  error.isOperational = true;
  error.name = "ConflictError";

  Error.captureStackTrace(error, createConflictError);

  return error;
}

module.exports = createConflictError;
