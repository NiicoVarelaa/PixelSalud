const { Router } = require("express");
const { getHistorialPorProducto, getHistorialGeneral } = require("../controllers/HistorialOfertasController");
const auth = require("../middlewares/auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");

const router = Router();

router.get(
  "/historial-ofertas",
  auth,
  verificarRol(["admin"]),
  getHistorialGeneral,
);

router.get(
  "/historial-ofertas/producto/:idProducto",
  auth,
  verificarRol(["admin"]),
  getHistorialPorProducto,
);

module.exports = router;
