const express = require("express")
const router = express.Router()
const {getMedicos, getMedicoBajados, getMedico, createMedico, updateMedico, darBajaMedico, reactivarMedico} = require("../controllers/medicos")
const auth = require("../middlewares/auth")
const {verificarRol} = require("../middlewares/verificarPermisos")

router.get("/medicos",auth, verificarRol(["admin"]), getMedicos)
router.get("/medicos/bajados", auth, verificarRol(["admin"]), getMedicoBajados)
router.get("/medicos/:id", auth, verificarRol(["admin", "medico"]),getMedico)
router.post("/medicos/crear", auth, verificarRol(["admin"]), createMedico)
router.put("/medicos/actualizar/:id", auth, verificarRol(["admin", "medico"]), updateMedico)
router.put("/medicos/darBaja/:id", auth, verificarRol(["admin", "medico"]), darBajaMedico)
router.put("/medicos/reactivar/:id", auth, verificarRol(["admin"]), reactivarMedico)

module.exports = router