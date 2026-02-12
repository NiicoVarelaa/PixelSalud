const authService = require("../services/AuthService");

/**
 * Controlador de autenticación
 */

/**
 * Login de usuario
 * POST /login
 */
const login = async (req, res, next) => {
  try {
    const { email, contrasenia } = req.body;
    const resultado = await authService.login(email, contrasenia);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
