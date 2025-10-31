const express = require("express");
const {
  getProductos,
  getProducto,
  deleteProducto,
  updateProducto,
  createProducto,
} = require("../controllers/productos");

const auth = require("../middlewares/auth")
const {verificarPermisos, verificarRol }= require("../middlewares/verificarPermisos")

const router = express.Router();

router.get("/productos", getProductos);
router.get("/productos/:idProducto", getProducto);
router.delete("/productos/eliminar/:idProducto", deleteProducto);
router.put("/productos/actualizar/:idProducto",auth,verificarPermisos("modificar_productos"), updateProducto);
router.post("/productos/crear", auth,verificarPermisos("crear_productos"), createProducto);

module.exports = router;
