const express = require("express");
const {
  login,
  registrarCliente,
  startGoogleAuth,
  googleCallback,
  refreshToken,
  logout,
  logoutAll,
} = require("../controllers/AuthController");
const validate = require("../middlewares/validate");
const {
  loginBodySchema,
  registroClienteBodySchema,
} = require("../schemas/AuthSchemas");
const { authLimiter, registerLimiter } = require("../config/rateLimiters");
const { authMiddleware } = require("../middlewares/Auth");

const router = express.Router();

router.post("/login", authLimiter, validate({ body: loginBodySchema }), login);
router.post(
  "/registroCliente",
  registerLimiter,
  validate({ body: registroClienteBodySchema }),
  registrarCliente,
);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/logout-all", authMiddleware, logoutAll);
router.get("/google-auth", startGoogleAuth);
router.get("/google-callback", googleCallback);

module.exports = router;
