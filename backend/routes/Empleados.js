const express = require("express")
const { getEmpleados, deleteEmpleado, updateEmpleado, createEmpleado } = require("../controllers/empleados")

const router = express.Router()

router.get("/Empleados", getEmpleados)
router.delete("/Empleados/eliminar/:id", deleteEmpleado)
router.put("/Empleados/modificar/:id", updateEmpleado)
router.post("/Empleados/crear", createEmpleado)




module.exports = router