const AppError = require("./AppError");

class ForbiddenError extends AppError {
  constructor(message = "No tienes permisos para realizar esta acción") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

module.exports = ForbiddenError;
