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
