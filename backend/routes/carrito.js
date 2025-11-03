const express = require("express");
const {
  getCarrito,
  addCarrito,
  deleteProductoDelCarrito, 
  vaciarCarrito,
  incrementCarrito,
  decrementCarrito,
} = require("../controllers/carrito");

const router = express.Router();
const auth = require("../middlewares/auth")
const { verificarRol }= require("../middlewares/verificarPermisos")

router.get("/carrito/:idCliente", auth, verificarRol(["cliente"]), getCarrito);
router.post("/carrito/agregar",auth, verificarRol(["cliente"]), addCarrito);
router.put("/carrito/aumentar",auth, verificarRol(["cliente"]), incrementCarrito); 
router.put("/carrito/disminuir",auth, verificarRol(["cliente"]), decrementCarrito);
router.delete("/carrito/eliminar/:idProducto",auth, verificarRol(["cliente"]), deleteProductoDelCarrito);
router.delete("/carrito/vaciar/:idCliente",auth, verificarRol(["cliente"]), vaciarCarrito);

module.exports = router;