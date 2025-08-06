const express = require("express");

const {
  registrarVentaEmpleado,
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
} = require("../controllers/VentasEmpleados");

const router = express.Router();

router.post("/ventasEmpleados/crear", registrarVentaEmpleado);
router.get("/ventasEmpleados", obtenerVentasEmpleado);
router.get("/ventasEmpleados/:idEmpleado", obtenerLaVentaDeUnEmpleado);

module.exports = router;
