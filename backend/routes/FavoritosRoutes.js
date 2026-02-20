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
const { mutationLimiter } = require("../config/rateLimiters");

router.post(
  "/toggle",
  mutationLimiter,
  auth,
  verificarRol(["cliente"]),
  validate({ body: toggleFavoritoSchema }),
  toggleFavorito,
);

router.get("/", auth, verificarRol(["cliente"]), obtenerFavoritosPorCliente);

module.exports = router;
module.exports = router;
