const express = require("express");
const router = express.Router();
const campanasController = require("../controllers/CampanasController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const campanasSchemas = require("../schemas/CampanasSchemas");

// ==================== RUTAS PÚBLICAS ====================

// Obtener todas las campañas activas
router.get("/activas", campanasController.getCampanasActivas);

// Obtener campaña específica con productos
router.get(
  "/:idCampana/productos",
  validate({ params: campanasSchemas.idCampanaParam }),
  campanasController.getCampanaConProductos,
);

// Obtener mejor descuento para un producto
router.get(
  "/productos/:idProducto/mejor-descuento",
  validate({ params: campanasSchemas.idProductoParam }),
  campanasController.getMejorDescuento,
);

// Obtener campañas de un producto
router.get(
  "/productos/:idProducto/campanas",
  validate({ params: campanasSchemas.idProductoParam }),
  campanasController.getCampanasDeProducto,
);

// ==================== RUTAS PROTEGIDAS (ADMIN) ====================

// Obtener todas las campañas (con conteo de productos)
router.get("/", auth, verificarRol(["admin"]), campanasController.getCampanas);

// Obtener campaña por ID
router.get(
  "/:idCampana",
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  campanasController.getCampana,
);

// Crear campaña
router.post(
  "/",
  auth,
  verificarRol(["admin"]),
  validate({ body: campanasSchemas.createCampanaSchema }),
  campanasController.createCampana,
);

// Actualizar campaña
router.put(
  "/:idCampana",
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  validate({ body: campanasSchemas.updateCampanaSchema }),
  campanasController.updateCampana,
);

// Eliminar campaña
router.delete(
  "/:idCampana",
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  campanasController.deleteCampana,
);

// Obtener productos de campaña (con query param activos=true/false)
router.get(
  "/:idCampana/productos-lista",
  campanasController.getProductosCampana,
);

// Agregar productos a campaña (uno o varios)
router.post(
  "/:idCampana/productos",
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  validate({ body: campanasSchemas.addProductosSchema }),
  campanasController.addProductosCampana,
);

// Quitar productos de campaña (uno o varios)
router.delete(
  "/:idCampana/productos",
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  validate({ body: campanasSchemas.removeProductosSchema }),
  campanasController.removeProductosCampana,
);

// Actualizar descuento override de relación producto-campaña
router.patch(
  "/relaciones/:id/override",
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idRelacionParam }),
  validate({ body: campanasSchemas.updateOverrideSchema }),
  campanasController.updateOverride,
);

// Obtener campañas próximas a vencer (query param: dias=7)
router.get(
  "/admin/proximas-a-vencer",
  auth,
  verificarRol(["admin"]),
  campanasController.getCampanasProximasAVencer,
);

module.exports = router;
