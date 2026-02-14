const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const {
  verificarPermisos,
  verificarRol,
} = require("../middlewares/VerificarPermisos");

// Importar schemas de validación
const {
  idProductoParamSchema,
  idParamSchema,
  buscarProductosQuerySchema,
  createProductoSchema,
  updateProductoSchema,
  updateActivoSchema,
} = require("../schemas/ProductoSchemas");

// Importar controladores
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

// ==========================================
// RUTAS DE PRODUCTOS
// ==========================================

/**
 * GET /productos - Obtiene todos los productos con ofertas
 * Acceso: Público
 */
router.get("/productos", getProductos);

/**
 * GET /productos/bajados - Obtiene productos inactivos
 * Acceso: Admin, Empleado
 */
router.get(
  "/productos/bajados",
  auth,
  verificarRol(["admin", "empleado"]),
  getProductoBajado,
);

/**
 * GET /productos/buscar - Busca productos por término
 * Acceso: Público
 */
router.get(
  "/productos/buscar",
  validate({ query: buscarProductosQuerySchema }),
  buscarProductos,
);

/**
 * POST /productos/crear - Crea un nuevo producto
 * Acceso: Admin, Empleado con permiso
 */
router.post(
  "/productos/crear",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("crear_productos"),
  validate({ body: createProductoSchema }),
  createProducto,
);

/**
 * GET /productos/:idProducto - Obtiene un producto por ID
 * Acceso: Público
 */
router.get(
  "/productos/:idProducto",
  validate({ params: idProductoParamSchema }),
  getProducto,
);

/**
 * PUT /productos/actualizar/:idProducto - Actualiza un producto
 * Acceso: Admin, Empleado con permiso
 */
router.put(
  "/productos/actualizar/:idProducto",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_productos"),
  validate({
    params: idProductoParamSchema,
    body: updateProductoSchema,
  }),
  updateProducto,
);

/**
 * PUT /productos/actualizar/activo/:idProducto - Actualiza solo estado activo
 * Acceso: Admin, Empleado
 */
router.put(
  "/productos/actualizar/activo/:idProducto",
  validate({
    params: idProductoParamSchema,
    body: updateActivoSchema,
  }),
  updateProductoActivo,
);

/**
 * PUT /productos/darBaja/:id - Da de baja un producto
 * Acceso: Admin, Empleado con permiso
 */
router.put(
  "/productos/darBaja/:id",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_productos"),
  validate({ params: idParamSchema }),
  deleteProducto,
);

/**
 * PUT /productos/activar/:id - Activa un producto
 * Acceso: Admin, Empleado con permiso
 */
router.put(
  "/productos/activar/:id",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_productos"),
  validate({ params: idParamSchema }),
  activarProducto,
);

module.exports = router;
