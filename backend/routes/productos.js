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
  updateProductosActivo
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
router.post("/ofertas/crear", createOferta);
router.get("/ofertas", getOfertas);
router.get("/ofertas/:idOferta", getOferta);
router.put("/ofertas/actualizar/:idOferta", updateOferta);
router.put("/ofertas/esActiva/:idOferta", updateOfertaEsActiva);
router.delete("/ofertas/eliminar/:idOferta", deleteOferta);
router.post("/ofertas/crear-cyber-monday",auth,verificarRol(["admin"]), ofertaCyberMonday);
router.get("/productos/ofertas/cyber-monday", getCyberMondayOffers);


module.exports = router;