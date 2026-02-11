const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const {
  verificarPermisos,
  verificarRol,
} = require("../middlewares/verificarPermisos");

// Importar schemas de validación
const {
  idProductoParamSchema,
  idOfertaParamSchema,
  idParamSchema,
  buscarProductosQuerySchema,
  createProductoSchema,
  updateProductoSchema,
  updateActivoSchema,
  createOfertaSchema,
  updateOfertaSchema,
  updateEsActivaSchema,
  createOfertaMasivaSchema,
} = require("../validators/productoSchemas");

// Importar controladores
const {
  // Productos
  getProductos,
  getProducto,
  getProductoBajado,
  createProducto,
  updateProducto,
  updateProductosActivo,
  darBajaProducto,
  activarProducto,
  buscarProductos,
  getOfertasDestacadas,

  // Ofertas
  getOfertas,
  getOferta,
  createOferta,
  updateOferta,
  updateOfertaEsActiva,
  deleteOferta,
  ofertaCyberMonday,
  getCyberMondayOffers,
} = require("../controllers/productos");

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
 * GET /productos/ofertas-destacadas - Obtiene ofertas destacadas
 * Acceso: Público
 */
router.get("/productos/ofertas-destacadas", getOfertasDestacadas);

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
  updateProductosActivo,
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
  darBajaProducto,
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

// ==========================================
// RUTAS DE OFERTAS
// ==========================================

/**
 * GET /ofertas - Obtiene todas las ofertas
 * Acceso: Público
 */
router.get("/ofertas", getOfertas);

/**
 * GET /ofertas/:idOferta - Obtiene una oferta por ID
 * Acceso: Público
 */
router.get(
  "/ofertas/:idOferta",
  validate({ params: idOfertaParamSchema }),
  getOferta,
);

/**
 * POST /ofertas/crear - Crea una nueva oferta
 * Acceso: Admin
 */
router.post(
  "/ofertas/crear",
  auth,
  verificarRol(["admin"]),
  validate({ body: createOfertaSchema }),
  createOferta,
);

/**
 * PUT /ofertas/actualizar/:idOferta - Actualiza una oferta
 * Acceso: Admin
 */
router.put(
  "/ofertas/actualizar/:idOferta",
  auth,
  verificarRol(["admin"]),
  validate({
    params: idOfertaParamSchema,
    body: updateOfertaSchema,
  }),
  updateOferta,
);

/**
 * PUT /ofertas/esActiva/:idOferta - Actualiza solo estado activo de oferta
 * Acceso: Admin
 */
router.put(
  "/ofertas/esActiva/:idOferta",
  validate({
    params: idOfertaParamSchema,
    body: updateEsActivaSchema,
  }),
  updateOfertaEsActiva,
);

/**
 * DELETE /ofertas/eliminar/:idOferta - Elimina una oferta
 * Acceso: Admin
 */
router.delete(
  "/ofertas/eliminar/:idOferta",
  auth,
  verificarRol(["admin"]),
  validate({ params: idOfertaParamSchema }),
  deleteOferta,
);

/**
 * POST /ofertas/crear-cyber-monday - Crea ofertas masivas
 * Acceso: Admin
 */
router.post(
  "/ofertas/crear-cyber-monday",
  auth,
  verificarRol(["admin"]),
  validate({ body: createOfertaMasivaSchema }),
  ofertaCyberMonday,
);

/**
 * GET /productos/ofertas/cyber-monday - Obtiene ofertas Cyber Monday
 * Acceso: Público
 */
router.get("/productos/ofertas/cyber-monday", getCyberMondayOffers);

module.exports = router;
