function createForbiddenError(
  message = "No tienes permisos para realizar esta acción",
) {
  const error = new Error(message);
  error.statusCode = 403;
  error.status = "fail";
  error.isOperational = true;
  error.name = "ForbiddenError";

  Error.captureStackTrace(error, createForbiddenError);

  return error;
}

module.exports = createForbiddenError;
