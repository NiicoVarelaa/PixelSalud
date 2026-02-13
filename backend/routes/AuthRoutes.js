const express = require("express");
const { login, registrarCliente } = require("../controllers/AuthController");
const validate = require("../middlewares/validate");
const {
  loginBodySchema,
  registroClienteBodySchema,
} = require("../schemas/AuthSchemas");

const router = express.Router();

/**
 * POST /login
 * Login de usuarios (Admins, Medicos, Empleados, Clientes)
 * @body {string} email - Email del usuario
 * @body {string} contrasenia - Contraseña del usuario
 * @returns {Object} Token JWT + datos del usuario + permisos
 */
router.post("/login", validate({ body: loginBodySchema }), login);

/**
 * POST /registroCliente
 * Registro de nuevos clientes
 * @body {string} nombreCliente - Nombre del cliente
 * @body {string} apellidoCliente - Apellido del cliente
 * @body {string} contraCliente - Contraseña del cliente
 * @body {string} emailCliente - Email del cliente
 * @body {string|number} dniCliente - DNI del cliente (7-8 dígitos)
 * @returns {Object} Confirmación de registro + idCliente
 */
router.post(
  "/registroCliente",
  validate({ body: registroClienteBodySchema }),
  registrarCliente,
);

module.exports = router;
