const express = require("express");
const { login } = require("../controllers/login");
const validate = require("../middlewares/validate");
const { loginBodySchema } = require("../schemas/AuthSchemas");

const router = express.Router();

/**
 * POST /login
 * Login de usuarios (Admins, Medicos, Empleados, Clientes)
 */
router.post("/login", validate({ body: loginBodySchema }), login);

module.exports = router;
