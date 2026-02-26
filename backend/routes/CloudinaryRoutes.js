/**
 * CLOUDINARY ROUTES
 * =================
 * Rutas para gestión de uploads a Cloudinary
 */

const express = require("express");
const router = express.Router();
const CloudinaryController = require("../controllers/CloudinaryController");
const {
  uploadSingleWithErrorHandler,
  uploadMultipleWithErrorHandler,
} = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const { verificarRol } = require("../middlewares/verificarPermisos");

// Todas las rutas requieren autenticación y rol admin/empleado
router.use(auth);
router.use(verificarRol(["admin", "empleado"]));

/**
 * @route   POST /api/cloudinary/upload/:idProducto
 * @desc    Sube una imagen de producto
 * @access  Admin, Empleado
 */
router.post(
  "/upload/:idProducto",
  uploadSingleWithErrorHandler,
  CloudinaryController.uploadProductImage,
);

/**
 * @route   POST /api/cloudinary/upload-multiple/:idProducto
 * @desc    Sube múltiples imágenes de producto
 * @access  Admin, Empleado
 */
router.post(
  "/upload-multiple/:idProducto",
  uploadMultipleWithErrorHandler,
  CloudinaryController.uploadMultipleProductImages,
);

/**
 * @route   DELETE /api/cloudinary/delete/:idImagen
 * @desc    Elimina una imagen de producto
 * @access  Admin, Empleado
 */
router.delete("/delete/:idImagen", CloudinaryController.deleteProductImage);

/**
 * @route   GET /api/cloudinary/stats
 * @desc    Obtiene estadísticas de uso de Cloudinary
 * @access  Admin
 */
router.get("/stats", verificarRol(["admin"]), CloudinaryController.getStats);

/**
 * @route   POST /api/cloudinary/transform
 * @desc    Genera URL con transformaciones
 * @access  Admin, Empleado
 */
router.post("/transform", CloudinaryController.getTransformedUrl);

module.exports = router;
