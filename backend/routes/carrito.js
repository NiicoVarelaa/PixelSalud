const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { verificarRol } = require("../middlewares/verificarPermisos");

// Importar schemas de validación
const {
  idClienteParamSchema,
  eliminarProductoParamsSchema,
  agregarCarritoSchema,
  modificarCantidadSchema,
} = require("../validators/carritoSchemas");

// Importar controladores
const {
  getCarrito,
  addCarrito,
  deleteProductoDelCarrito,
  vaciarCarrito,
  incrementCarrito,
  decrementCarrito,
} = require("../controllers/carrito");

const router = express.Router();

// ==========================================
// RUTAS DE CARRITO
// ==========================================

/**
 * GET /carrito/:idCliente - Obtiene el carrito de un cliente
 * Acceso: Cliente autenticado
 */
router.get(
  "/carrito/:idCliente",
  auth,
  verificarRol(["cliente"]),
  validate({ params: idClienteParamSchema }),
  getCarrito,
);

/**
 * POST /carrito/agregar - Agrega un producto al carrito
 * Acceso: Cliente autenticado
 * Body: { idCliente, idProducto, cantidad? }
 */
router.post(
  "/carrito/agregar",
  auth,
  verificarRol(["cliente"]),
  validate({ body: agregarCarritoSchema }),
  addCarrito,
);

/**
 * PUT /carrito/aumentar - Incrementa cantidad en 1
 * Acceso: Cliente autenticado
 * Body: { idCliente, idProducto }
 */
router.put(
  "/carrito/aumentar",
  auth,
  verificarRol(["cliente"]),
  validate({ body: modificarCantidadSchema }),
  incrementCarrito,
);

/**
 * PUT /carrito/disminuir - Decrementa cantidad en 1
 * Acceso: Cliente autenticado
 * Body: { idCliente, idProducto }
 */
router.put(
  "/carrito/disminuir",
  auth,
  verificarRol(["cliente"]),
  validate({ body: modificarCantidadSchema }),
  decrementCarrito,
);

/**
 * DELETE /carrito/eliminar/:idCliente/:idProducto - Elimina un producto
 * Acceso: Cliente autenticado
 */
router.delete(
  "/carrito/eliminar/:idCliente/:idProducto",
  auth,
  verificarRol(["cliente"]),
  validate({ params: eliminarProductoParamsSchema }),
  deleteProductoDelCarrito,
);

/**
 * DELETE /carrito/vaciar/:idCliente - Vacía el carrito completo
 * Acceso: Cliente autenticado
 */
router.delete(
  "/carrito/vaciar/:idCliente",
  auth,
  verificarRol(["cliente"]),
  validate({ params: idClienteParamSchema }),
  vaciarCarrito,
);

module.exports = router;
