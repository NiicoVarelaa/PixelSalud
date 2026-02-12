const express = require("express");
const router = express.Router();

const {
  toggleFavorito,
  obtenerFavoritosPorCliente,
} = require("../controllers/FavoritosController");

const auth = require("../middlewares/Auth");
const { verificarRol } = require("../middlewares/VerificarPermisos");
const validate = require("../middlewares/validate");
const { toggleFavoritoSchema } = require("../schemas/FavoritoSchemas");

/**
 * @route POST /favoritos/toggle
 * @desc Agregar o quitar producto de favoritos
 * @access Private (Cliente)
 */
router.post(
  "/toggle",
  auth,
  verificarRol(["cliente"]),
  validate({ body: toggleFavoritoSchema }),
  toggleFavorito,
);

/**
 * @route GET /favoritos
 * @desc Obtener todos los favoritos del cliente autenticado
 * @access Private (Cliente)
 */
router.get("/", auth, verificarRol(["cliente"]), obtenerFavoritosPorCliente);

module.exports = router;
module.exports = router;
