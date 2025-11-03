const express = require("express")
const router = express.Router()
const {getPermisosEmp ,crearPermisosEmp, updatePermisosEmp}= require("../controllers/permisos")
const auth = require("../middlewares/auth")
const {verificarRol}= require("../middlewares/verificarPermisos")

router.get("/permisos",auth,verificarRol(["admin"]), getPermisosEmp)
router.post("/permisos/crear/:id",auth,verificarRol(["admin"]),crearPermisosEmp)
router.put("/permisos/update/:id",auth,verificarRol(["admin"]),updatePermisosEmp)

module.exports= router