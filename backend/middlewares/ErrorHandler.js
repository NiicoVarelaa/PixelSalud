const { createAppError } = require("../errors");
const { z } = require("zod");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error capturado:", {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    });
  }

  if (err instanceof z.ZodError) {
    const message = "Error de validación";
    const errors =
      err.errors && Array.isArray(err.errors)
        ? err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          }))
        : [];

    return res.status(400).json({
      status: "fail",
      message,
      errors,
    });
  }

  if (err.code) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        error.statusCode = 409;
        error.message = "Ya existe un registro con esos datos";
        break;
      case "ER_NO_REFERENCED_ROW":
      case "ER_NO_REFERENCED_ROW_2":
        error.statusCode = 400;
        error.message = "Referencia inválida a otro registro";
        break;
      case "ER_ROW_IS_REFERENCED":
      case "ER_ROW_IS_REFERENCED_2":
        error.statusCode = 409;
        error.message = "No se puede eliminar, hay registros relacionados";
        break;
      case "ECONNREFUSED":
        error.statusCode = 503;
        error.message = "No se pudo conectar a la base de datos";
        break;
    }
  }

  if (err.name === "JsonWebTokenError") {
    error.statusCode = 401;
    error.message = "Token inválido";
  }
  if (err.name === "TokenExpiredError") {
    error.statusCode = 401;
    error.message = "Token expirado";
  }

  if (err.statusCode && err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors }), 
    });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Error interno del servidor";

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

const notFoundHandler = (req, res, next) => {
  const error = createAppError(
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    404,
  );
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
