/**
 * Crea un error personalizado para la aplicación
 * @param {string} message - Mensaje del error
 * @param {number} statusCode - Código HTTP del error (default: 500)
 * @param {boolean} isOperational - Si es un error operacional esperado (default: true)
 * @returns {Error} Objeto Error con propiedades personalizadas
 */
function createAppError(message, statusCode = 500, isOperational = true) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  error.name = "AppError";

  // Captura el stack trace
  Error.captureStackTrace(error, createAppError);

  return error;
}

module.exports = createAppError;
