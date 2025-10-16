const express = require("express");
const {
  addCarrito,
  getCarrito,
  deleteCarrito,
  incrementCarrito,
  decrementCarrito,
  vaciarCarrito,
} = require("../controllers/carrito");

const router = express.Router();

router.get("/carrito/:idCliente", getCarrito);
router.post("/carrito/agregar", addCarrito);
router.put("/carrito/aumentar", incrementCarrito); 
router.put("/carrito/disminuir", decrementCarrito);
router.delete("/carrito/eliminar/:idProducto", deleteCarrito);
router.delete("/carrito/vaciar/:idCliente", vaciarCarrito);

module.exports = router;