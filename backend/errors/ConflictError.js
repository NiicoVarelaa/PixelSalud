const AppError = require("./AppError");

class ConflictError extends AppError {
  constructor(message = "El recurso ya existe o hay un conflicto") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

module.exports = ConflictError;
