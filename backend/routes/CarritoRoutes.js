const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  idClienteParamSchema,
  eliminarProductoParamsSchema,
  agregarCarritoSchema,
  modificarCantidadSchema,
} = require("../schemas/CarritoSchemas");

const {
  getCarrito,
  addCarrito,
  deleteProductoDelCarrito,
  vaciarCarrito,
  incrementCarrito,
  decrementCarrito,
} = require("../controllers/CarritoController");

const router = express.Router();

router.get(
  "/carrito/:idCliente",
  auth,
  verificarRol(["cliente"]),
  validate({ params: idClienteParamSchema }),
  getCarrito,
);

router.post(
  "/carrito/agregar",
  mutationLimiter,
  auth,
  verificarRol(["cliente"]),
  validate({ body: agregarCarritoSchema }),
  addCarrito,
);

router.put(
  "/carrito/aumentar",
  mutationLimiter,
  auth,
  verificarRol(["cliente"]),
  validate({ body: modificarCantidadSchema }),
  incrementCarrito,
);

router.put(
  "/carrito/disminuir",
  mutationLimiter,
  auth,
  verificarRol(["cliente"]),
  validate({ body: modificarCantidadSchema }),
  decrementCarrito,
);

router.delete(
  "/carrito/eliminar/:idCliente/:idProducto",
  mutationLimiter,
  auth,
  verificarRol(["cliente"]),
  validate({ params: eliminarProductoParamsSchema }),
  deleteProductoDelCarrito,
);

router.delete(
  "/carrito/vaciar/:idCliente",
  mutationLimiter,
  auth,
  verificarRol(["cliente"]),
  validate({ params: idClienteParamSchema }),
  vaciarCarrito,
);

module.exports = router;
