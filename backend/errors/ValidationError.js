const AppError = require("./AppError");

class ValidationError extends AppError {
  constructor(message = "Datos inválidos", errors = null) {
    super(message, 400);
    this.name = "ValidationError";
    this.errors = errors; 
  }
}

module.exports = ValidationError;
