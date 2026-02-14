const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");

// Importar schemas
const {
  idOfertaParamSchema,
  createOfertaSchema,
  updateOfertaSchema,
  updateEsActivaSchema,
  createOfertaMasivaSchema,
} = require("../schemas/OfertasSchemas");

// Importar controladores
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

// ==========================================
// RUTAS DE OFERTAS
// ==========================================

/**
 * GET /ofertas - Obtiene todas las ofertas
 * Acceso: Público
 */
router.get("/", getOfertas);

/**
 * GET /ofertas/destacadas - Obtiene ofertas destacadas
 * Acceso: Público
 */
router.get("/destacadas", getOfertasDestacadas);

/**
 * GET /ofertas/cyber-monday - Obtiene ofertas Cyber Monday
 * Acceso: Público
 */
router.get("/cyber-monday", getCyberMondayOffers);

/**
 * GET /ofertas/:idOferta - Obtiene una oferta por ID
 * Acceso: Público
 */
router.get("/:idOferta", validate({ params: idOfertaParamSchema }), getOferta);

/**
 * POST /ofertas - Crea una nueva oferta
 * Acceso: Admin
 */
router.post(
  "/",
  auth,
  verificarRol(["admin"]),
  validate({ body: createOfertaSchema }),
  createOferta,
);

/**
 * POST /ofertas/masivas - Crea ofertas masivas (Cyber Monday)
 * Acceso: Admin
 */
router.post(
  "/masivas",
  auth,
  verificarRol(["admin"]),
  validate({ body: createOfertaMasivaSchema }),
  createOfertasMasivas,
);

/**
 * PUT /ofertas/:idOferta - Actualiza una oferta
 * Acceso: Admin
 */
router.put(
  "/:idOferta",
  auth,
  verificarRol(["admin"]),
  validate({
    params: idOfertaParamSchema,
    body: updateOfertaSchema,
  }),
  updateOferta,
);

/**
 * PUT /ofertas/:idOferta/estado - Actualiza solo estado activo de oferta
 * Acceso: Admin
 */
router.put(
  "/:idOferta/estado",
  auth,
  verificarRol(["admin"]),
  validate({
    params: idOfertaParamSchema,
    body: updateEsActivaSchema,
  }),
  updateOfertaEsActiva,
);

/**
 * DELETE /ofertas/:idOferta - Elimina una oferta
 * Acceso: Admin
 */
router.delete(
  "/:idOferta",
  auth,
  verificarRol(["admin"]),
  validate({ params: idOfertaParamSchema }),
  deleteOferta,
);

module.exports = router;
