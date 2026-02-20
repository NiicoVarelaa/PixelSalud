const express = require("express");
const { login, registrarCliente } = require("../controllers/AuthController");
const validate = require("../middlewares/validate");
const {
  loginBodySchema,
  registroClienteBodySchema,
} = require("../schemas/AuthSchemas");
const { authLimiter, registerLimiter } = require("../config/rateLimiters");

const router = express.Router();

router.post("/login", authLimiter, validate({ body: loginBodySchema }), login);
router.post(
  "/registroCliente",
  registerLimiter,
  validate({ body: registroClienteBodySchema }),
  registrarCliente,
);

module.exports = router;
