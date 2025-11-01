const express = require("express")
const router = express.Router()
const {crearPermisosEmp, updatePermisosEmp}= require("../controllers/permisos")

router.post("/permisos/crear",crearPermisosEmp)
router.put("/permisos/update/:id",updatePermisosEmp)

module.exports= router