const AppError = require("./AppError");

class UnauthorizedError extends AppError {
  constructor(message = "No autenticado. Token requerido o inválido") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

module.exports = UnauthorizedError;
