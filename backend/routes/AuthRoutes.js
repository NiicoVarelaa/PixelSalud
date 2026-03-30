const express = require("express");
const {
  login,
  registrarCliente,
  startGoogleAuth,
  googleCallback,
} = require("../controllers/AuthController");
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
router.get("/google-auth", startGoogleAuth);
router.get("/google-callback", googleCallback);

module.exports = router;
