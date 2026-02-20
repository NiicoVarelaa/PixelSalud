const express = require("express");
const router = express.Router();
const cuponesController = require("../controllers/CuponesController");
const Auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { mutationLimiter, paymentLimiter } = require("../config/rateLimiters");

router.post(
  "/cupones/validar",
  paymentLimiter,
  Auth,
  cuponesController.validarCupon,
);

router.get("/cupones/mis-cupones", Auth, cuponesController.obtenerMisCupones);

router.get(
  "/cupones/historial",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerHistorial,
);

router.get(
  "/cupones",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerTodosCupones,
);

router.get(
  "/cupones/activos",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerCuponesActivos,
);

router.post(
  "/cupones",
  mutationLimiter,
  Auth,
  verificarRol(["admin"]),
  cuponesController.crearCupon,
);

router.get(
  "/cupones/:codigo",
  Auth,
  verificarRol(["admin", "empleado"]),
  cuponesController.obtenerCuponPorCodigo,
);

router.patch(
  "/cupones/:id/estado",
  mutationLimiter,
  Auth,
  verificarRol(["admin"]),
  cuponesController.actualizarEstado,
);

router.delete(
  "/cupones/:id",
  mutationLimiter,
  Auth,
  verificarRol(["admin"]),
  cuponesController.eliminarCupon,
);

module.exports = router;
