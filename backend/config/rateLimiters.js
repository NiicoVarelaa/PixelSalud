const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message:
    "Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos",
  standardHeaders: true, 
  legacyHeaders: false, 
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message:
    "Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3,
  message: "Demasiados registros desde esta IP. Intenta nuevamente en 1 hora",
  standardHeaders: true,
  legacyHeaders: false,
});

const mutationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 30,
  message: "Demasiadas operaciones de escritura. Espera 10 minutos",
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 10, 
  message:
    "Límite de transacciones alcanzado. Contacta soporte si necesitas más",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  mutationLimiter,
  paymentLimiter,
};
