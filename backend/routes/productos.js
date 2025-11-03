const express = require("express");
const {
  // Rutas de Productos
  getProductos,
  getProducto,
  deleteProducto,
  updateProducto,
  createProducto,
  getOfertasDestacadas,

  // Rutas de Ofertas (CRUD)
  createOferta,
  getOfertas,
  getOferta,
  updateOferta,
  deleteOferta,
  ofertaCyberMonday,
  getCyberMondayOffers,
} = require("../controllers/productos"); // Importa todas las funciones necesarias

const router = express.Router();

// ------------------------------------------------------------------
// --- RUTAS PRINCIPALES DE PRODUCTOS (Listado y Detalle) ---
// ------------------------------------------------------------------

// GET: Obtener todos los productos (con info de oferta aplicada)
router.get("/productos", getProductos); 

// GET: Obtener un producto individual (con info de oferta aplicada)
router.get("/productos/:idProducto", getProducto); 

// GET: Obtener solo las ofertas destacadas para el carrusel
router.get("/productos/ofertas-destacadas", getOfertasDestacadas);


// ------------------------------------------------------------------
// --- RUTAS CRUD DE PRODUCTOS (Administración) ---
// ------------------------------------------------------------------

// DELETE: Eliminar un producto
router.delete("/productos/eliminar/:idProducto", deleteProducto);

// PUT: Actualizar un producto existente
router.put("/productos/actualizar/:idProducto", updateProducto);

// POST: Crear un nuevo producto
router.post("/productos/crear", createProducto);


// ------------------------------------------------------------------
// --- RUTAS CRUD DE OFERTAS (Administración de Promociones) ---
// ------------------------------------------------------------------

// POST: Crear una nueva oferta
router.post("/ofertas/crear", createOferta);

// GET: Obtener todas las ofertas (para el panel de administración)
router.get("/ofertas", getOfertas);

// GET: Obtener una oferta específica por ID
router.get("/ofertas/:idOferta", getOferta);

// PUT: Actualizar los detalles de una oferta (cambiar porcentaje, fechas, o desactivar 'esActiva')
router.put("/ofertas/actualizar/:idOferta", updateOferta);

// DELETE: Eliminar una oferta
router.delete("/ofertas/eliminar/:idOferta", deleteOferta);

// POST: Crea la oferta masiva de Cyber Monday
router.post("/ofertas/crear-cyber-monday", ofertaCyberMonday);
router.get("/productos/ofertas/cyber-monday", getCyberMondayOffers);


module.exports = router;