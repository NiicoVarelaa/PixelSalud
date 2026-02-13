const authService = require("../services/AuthService");
const clientesService = require("../services/ClientesService");

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

/**
 * Registra un nuevo cliente
 * POST /registroCliente
 */
const registrarCliente = async (req, res, next) => {
  try {
    const {
      nombreCliente,
      apellidoCliente,
      contraCliente,
      emailCliente,
      dniCliente,
    } = req.body;

    const resultado = await clientesService.crearCliente({
      nombreCliente,
      apellidoCliente,
      contraCliente,
      emailCliente,
      dni: dniCliente,
    });

    res.status(201).json({
      mensaje: "Cliente registrado exitosamente",
      idCliente: resultado.insertId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  registrarCliente,
};
