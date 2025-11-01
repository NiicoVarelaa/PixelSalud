const express = require("express");
const {
  getProductos,
  getProducto,
  getProductoBajado,
  createProducto,
  updateProducto,
  darBajaProducto,
  activarProducto
} = require("../controllers/productos");

const auth = require("../middlewares/auth")
const {verificarPermisos, verificarRol }= require("../middlewares/verificarPermisos")

const router = express.Router();

router.get("/productos", getProductos);
router.get("/productos/bajados", auth,verificarRol(["admin","empleado"]), getProductoBajado);
router.get("/productos/:idProducto", getProducto);
router.post("/productos/crear", auth,verificarRol(["admin","empleado"]),verificarPermisos("crear_productos"), createProducto);
router.put("/productos/actualizar/:idProducto",auth,verificarRol(["admin","empleado"]),verificarPermisos("modificar_productos"), updateProducto);
router.put("/productos/darBaja/:id",auth,verificarRol(["admin", "empleado"]), verificarPermisos("modificar_productos"),darBajaProducto)
router.put("/productos/activar/:id", auth, verificarRol(["admin", "empleado"]), verificarPermisos("modificar_productos"),activarProducto)

module.exports = router;
