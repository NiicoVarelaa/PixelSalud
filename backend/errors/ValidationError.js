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
