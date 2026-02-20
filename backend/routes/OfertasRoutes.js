const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  idOfertaParamSchema,
  createOfertaSchema,
  updateOfertaSchema,
  updateEsActivaSchema,
  createOfertaMasivaSchema,
} = require("../schemas/OfertasSchemas");

const {
  getOfertas,
  getOferta,
  createOferta,
  updateOferta,
  updateOfertaEsActiva,
  deleteOferta,
  createOfertasMasivas,
  getCyberMondayOffers,
  getOfertasDestacadas,
} = require("../controllers/OfertasController");

router.get("/", getOfertas);

router.get("/destacadas", getOfertasDestacadas);

router.get("/cyber-monday", getCyberMondayOffers);

router.get("/:idOferta", validate({ params: idOfertaParamSchema }), getOferta);

router.post(
  "/",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ body: createOfertaSchema }),
  createOferta,
);

router.post(
  "/masivas",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ body: createOfertaMasivaSchema }),
  createOfertasMasivas,
);

router.put(
  "/:idOferta",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({
    params: idOfertaParamSchema,
    body: updateOfertaSchema,
  }),
  updateOferta,
);

router.put(
  "/:idOferta/estado",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({
    params: idOfertaParamSchema,
    body: updateEsActivaSchema,
  }),
  updateOfertaEsActiva,
);

router.delete(
  "/:idOferta",
  mutationLimiter,
  auth,
  verificarRol(["admin"]),
  validate({ params: idOfertaParamSchema }),
  deleteOferta,
);

module.exports = router;
