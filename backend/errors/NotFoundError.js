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
