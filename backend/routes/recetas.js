const express = require("express")
const router = express.Router()
const {getMisRecetas, crearReceta, darBajaReceta} = require("../controllers/recetas")
const auth = require("../middlewares/auth")
const { verificarRol }= require("../middlewares/verificarPermisos")

router.get("/recetas/medico/:idMedico", auth, verificarRol(["medico", "admin"]), getMisRecetas);
router.post("/recetas/crear", auth, verificarRol(["medico"]), crearReceta);
router.put("/recetas/baja/:id", auth, verificarRol(["medico", "admin"]), darBajaReceta);

module.exports = router