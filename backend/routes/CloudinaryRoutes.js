const express = require("express");
const router = express.Router();
const CloudinaryController = require("../controllers/CloudinaryController");
const {
  uploadSingleWithErrorHandler,
  uploadMultipleWithErrorHandler,
} = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const { verificarRol } = require("../middlewares/verificarPermisos");

router.use(auth);
router.use(verificarRol(["admin", "empleado"]));

router.post(
  "/upload/:idProducto",
  uploadSingleWithErrorHandler,
  CloudinaryController.uploadProductImage,
);

router.post(
  "/upload-multiple/:idProducto",
  uploadMultipleWithErrorHandler,
  CloudinaryController.uploadMultipleProductImages,
);

router.delete("/delete/:idImagen", CloudinaryController.deleteProductImage);

router.get("/stats", verificarRol(["admin"]), CloudinaryController.getStats);

router.post("/transform", CloudinaryController.getTransformedUrl);

module.exports = router;
