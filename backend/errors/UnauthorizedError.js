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
