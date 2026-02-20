const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const {
  verificarPermisos,
  verificarRol,
} = require("../middlewares/VerificarPermisos");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  idProductoParamSchema,
  idParamSchema,
  buscarProductosQuerySchema,
  createProductoSchema,
  updateProductoSchema,
  updateActivoSchema,
} = require("../schemas/ProductoSchemas");

const {
  getProductos,
  getProducto,
  getProductoBajado,
  createProducto,
  updateProducto,
  updateProductoActivo,
  deleteProducto,
  activarProducto,
  buscarProductos,
} = require("../controllers/ProductosController");

const router = express.Router();

router.get("/productos", getProductos);

router.get(
  "/productos/bajados",
  auth,
  verificarRol(["admin", "empleado"]),
  getProductoBajado,
);

router.get(
  "/productos/buscar",
  validate({ query: buscarProductosQuerySchema }),
  buscarProductos,
);

router.post(
  "/productos/crear",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("crear_productos"),
  validate({ body: createProductoSchema }),
  createProducto,
);

router.get(
  "/productos/:idProducto",
  validate({ params: idProductoParamSchema }),
  getProducto,
);

router.put(
  "/productos/actualizar/:idProducto",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_productos"),
  validate({
    params: idProductoParamSchema,
    body: updateProductoSchema,
  }),
  updateProducto,
);

router.put(
  "/productos/actualizar/activo/:idProducto",
  mutationLimiter,
  validate({
    params: idProductoParamSchema,
    body: updateActivoSchema,
  }),
  updateProductoActivo,
);

router.put(
  "/productos/darBaja/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_productos"),
  validate({ params: idParamSchema }),
  deleteProducto,
);

router.put(
  "/productos/activar/:id",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_productos"),
  validate({ params: idParamSchema }),
  activarProducto,
);

module.exports = router;
