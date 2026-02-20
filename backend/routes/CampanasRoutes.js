const express = require("express");
const router = express.Router();
const campanasController = require("../controllers/CampanasController");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const campanasSchemas = require("../schemas/CampanasSchemas");
const { mutationLimiter } = require("../config/rateLimiters");

router.get("/activas", campanasController.getCampanasActivas);

router.get(
  "/:idCampana/productos",
  validate({ params: campanasSchemas.idCampanaParam }),
  campanasController.getCampanaConProductos,
);

router.get(
  "/productos/:idProducto/mejor-descuento",
  validate({ params: campanasSchemas.idProductoParam }),
  campanasController.getMejorDescuento,
);

router.get(
  "/productos/:idProducto/campanas",
  validate({ params: campanasSchemas.idProductoParam }),
  campanasController.getCampanasDeProducto,
);

router.get("/", auth, verificarRol(["admin"]), campanasController.getCampanas);

router.get(
  "/:idCampana",
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  campanasController.getCampana,
);

router.post(
  "/",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ body: campanasSchemas.createCampanaSchema }),
  campanasController.createCampana,
);

router.put(
  "/:idCampana",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  validate({ body: campanasSchemas.updateCampanaSchema }),
  campanasController.updateCampana,
);

router.delete(
  "/:idCampana",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  campanasController.deleteCampana,
);

router.get(
  "/:idCampana/productos-lista",
  campanasController.getProductosCampana,
);

router.post(
  "/:idCampana/productos",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  validate({ body: campanasSchemas.addProductosSchema }),
  campanasController.addProductosCampana,
);

router.delete(
  "/:idCampana/productos",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idCampanaParam }),
  validate({ body: campanasSchemas.removeProductosSchema }),
  campanasController.removeProductosCampana,
);

router.patch(
  "/relaciones/:id/override",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: campanasSchemas.idRelacionParam }),
  validate({ body: campanasSchemas.updateOverrideSchema }),
  campanasController.updateOverride,
);

router.get(
  "/admin/proximas-a-vencer",
  auth,
  verificarRol(["admin"]),
  campanasController.getCampanasProximasAVencer,
);

module.exports = router;
