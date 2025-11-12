const express = require("express");
const {
  // Rutas de Productos
  getProductos,
  getProducto,
  getProductoBajado,
  createProducto,
  updateProducto,
  darBajaProducto,
  activarProducto,
  getOfertasDestacadas,
  buscarProductos,

  // Rutas de Ofertas (CRUD)
  createOferta,
  getOfertas,
  getOferta,
  updateOferta,
  updateOfertaEsActiva,
  deleteOferta,
  ofertaCyberMonday,
  getCyberMondayOffers,
  updateProductosActivo,
  buscarProductos
} = require("../controllers/productos"); // Importa todas las funciones necesarias

const auth = require("../middlewares/auth")
const {verificarPermisos, verificarRol }= require("../middlewares/verificarPermisos")

const router = express.Router();

router.get("/productos", getProductos);
router.get("/productos/bajados", auth,verificarRol(["admin","empleado"]), getProductoBajado);
router.get('/productos/buscar', buscarProductos);
router.post("/productos/crear", auth,verificarRol(["admin","empleado"]),verificarPermisos("crear_productos"), createProducto);
router.get("/productos/:idProducto", getProducto);
router.put("/productos/actualizar/:idProducto",auth,verificarRol(["admin","empleado"]),verificarPermisos("modificar_productos"), updateProducto);
router.put("/productos/actualizar/activo/:idProducto", updateProductosActivo)
router.put("/productos/darBaja/:id",auth,verificarRol(["admin", "empleado"]), verificarPermisos("modificar_productos"),darBajaProducto)
router.put("/productos/activar/:id", auth, verificarRol(["admin", "empleado"]), verificarPermisos("modificar_productos"),activarProducto)

// ------------------------------------------------------------------
// --- RUTAS CRUD DE OFERTAS (Administración de Promociones) ---
// ------------------------------------------------------------------
router.get("/productos/ofertas-destacadas", getOfertasDestacadas);
// POST: Crear una nueva oferta
router.post("/ofertas/crear"/* ,auth, verificarRol(["admin"]) */, createOferta);

// GET: Obtener todas las ofertas (para el panel de administración)
router.get("/ofertas", getOfertas);

// GET: Obtener una oferta específica por ID
router.get("/ofertas/:idOferta", getOferta);

// PUT: Actualizar los detalles de una oferta (cambiar porcentaje, fechas, o desactivar 'esActiva')
router.put("/ofertas/actualizar/:idOferta"/* ,auth, verificarRol(["admin"]) */, updateOferta);

router.put("/ofertas/esActiva/:idOferta", updateOfertaEsActiva);

// DELETE: Eliminar una oferta
router.delete("/ofertas/eliminar/:idOferta"/* ,auth,verificarRol(["admin"]) */, deleteOferta);

// POST: Crea la oferta masiva de Cyber Monday
router.post("/ofertas/crear-cyber-monday",auth,verificarRol(["admin"]), ofertaCyberMonday);
router.get("/productos/ofertas/cyber-monday", getCyberMondayOffers);


module.exports = router;