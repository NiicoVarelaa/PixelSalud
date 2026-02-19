/**
 * Crea un error de validación (400)
 * Se usa cuando los datos enviados no cumplen con las reglas de negocio
 * Ejemplo: email inválido, campo requerido faltante, etc.
 *
 * @param {string} message - Mensaje del error
 * @param {object|array} errors - Detalles de los errores de validación (opcional)
 * @returns {Error} Error con statusCode 400
 */
function createValidationError(message = "Datos inválidos", errors = null) {
  const error = new Error(message);
  error.statusCode = 400;
  error.status = "fail";
  error.isOperational = true;
  error.name = "ValidationError";
  error.errors = errors;

  Error.captureStackTrace(error, createValidationError);

  return error;
}

module.exports = createValidationError;
