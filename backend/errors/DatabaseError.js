/**
 * Crea un error de base de datos (500)
 * Se usa cuando ocurre un error inesperado en la BD
 * Ejemplo: query mal formado, conexión perdida, etc.
 *
 * @param {string} message - Mensaje del error
 * @param {Error} originalError - Error original de la BD (opcional)
 * @returns {Error} Error con statusCode 500
 */
function createDatabaseError(
  message = "Error en la base de datos",
  originalError = null,
) {
  const error = new Error(message);
  error.statusCode = 500;
  error.status = "error";
  error.isOperational = false; // No es un error esperado
  error.name = "DatabaseError";
  error.originalError = originalError;

  Error.captureStackTrace(error, createDatabaseError);

  return error;
}

module.exports = createDatabaseError;
