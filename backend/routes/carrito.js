const express = require("express");
const {
  getCarrito,
  addCarrito,
  // 1. Se actualiza el nombre de la función importada
  deleteProductoDelCarrito, 
  vaciarCarrito,
  incrementCarrito,
  decrementCarrito,
} = require("../controllers/carrito");

const router = express.Router();

// --- RUTAS AJUSTADAS Y MÁS SEGURAS ---

// Obtiene todos los productos del carrito de un cliente específico
// GET /api/carrito/123 -> OK
router.get("/carrito/:idCliente", getCarrito);

// Agrega un producto al carrito (o incrementa su cantidad)
// POST /api/carrito -> (idProducto, idCliente) van en el body
router.post("/carrito/agregar", addCarrito);

// Incrementa en 1 la cantidad de un producto en el carrito
// PUT /api/carrito/aumentar -> (idProducto, idCliente) van en el body
router.put("/carrito/aumentar", incrementCarrito); 

// Disminuye en 1 la cantidad de un producto en el carrito
// PUT /api/carrito/disminuir -> (idProducto, idCliente) van en el body
router.put("/carrito/disminuir", decrementCarrito);

// 2. ¡RUTA CORREGIDA Y MÁS SEGURA!
// Elimina un producto específico del carrito de un cliente específico
// DELETE /api/carrito/eliminar/123/45 -> (idCliente=123, idProducto=45)
router.delete("/carrito/eliminar/:idCliente/:idProducto", deleteProductoDelCarrito);

// Elimina TODOS los productos del carrito de un cliente
// DELETE /api/carrito/vaciar/123 -> OK
router.delete("/carrito/vaciar/:idCliente", vaciarCarrito);

module.exports = router;