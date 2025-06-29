const express = require("express")

const {registrarVentaEmpleado, obtenerVentasEmpleado} = require ("../controllers/VentasEmpleados")


const router = express.Router()

router.post("/ventasEmpleados/crear", registrarVentaEmpleado)
router.get('/ventasEmpleados', obtenerVentasEmpleado);

module.exports = router