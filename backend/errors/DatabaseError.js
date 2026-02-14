const AppError = require("./AppError");

class DatabaseError extends AppError {
  constructor(message = "Error en la base de datos", originalError = null) {
    super(message, 500, false); // isOperational = false
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}

module.exports = DatabaseError;
