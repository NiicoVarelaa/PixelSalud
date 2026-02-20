function createDatabaseError(
  message = "Error en la base de datos",
  originalError = null,
) {
  const error = new Error(message);
  error.statusCode = 500;
  error.status = "error";
  error.isOperational = false;
  error.name = "DatabaseError";
  error.originalError = originalError;

  Error.captureStackTrace(error, createDatabaseError);

  return error;
}

module.exports = createDatabaseError;
