const express = require("express");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  getImagenesProducto,
  getImagenPrincipal,
  addImagen,
  addImagenes,
  updateImagen,
  setPrincipal,
  deleteImagen,
  deleteImagenesProducto,
  reordenarImagenes,
} = require("../controllers/ImagenesProductosController");

const router = express.Router();

// Rutas públicas - Consultar imágenes
router.get("/productos/:idProducto/imagenes", getImagenesProducto);
router.get("/productos/:idProducto/imagenes/principal", getImagenPrincipal);

// Rutas protegidas - Administración de imágenes (solo admins)
router.post(
  "/productos/:idProducto/imagenes",
  auth,
  verificarRol(["admin"]),
  mutationLimiter,
  addImagen,
);

router.post(
  "/productos/:idProducto/imagenes/batch",
  auth,
  verificarRol(["admin"]),
  mutationLimiter,
  addImagenes,
);

router.put(
  "/imagenes/:idImagen",
  auth,
  verificarRol(["admin"]),
  mutationLimiter,
  updateImagen,
);

router.patch(
  "/imagenes/:idImagen/principal",
  auth,
  verificarRol(["admin"]),
  mutationLimiter,
  setPrincipal,
);

router.delete(
  "/imagenes/:idImagen",
  auth,
  verificarRol(["admin"]),
  mutationLimiter,
  deleteImagen,
);

router.delete(
  "/productos/:idProducto/imagenes",
  auth,
  verificarRol(["admin"]),
  mutationLimiter,
  deleteImagenesProducto,
);

router.patch(
  "/productos/:idProducto/imagenes/reordenar",
  auth,
  verificarRol(["admin"]),
  mutationLimiter,
  reordenarImagenes,
);

module.exports = router;
