const express = require("express");
const {
  registrarVentaEmpleado,
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
} = require("../controllers/VentasEmpleados");

const router = express.Router();
const auth = require("../middlewares/auth")
const {verificarRol, verificarPermisos}= require("../middlewares/verificarPermisos")

router.post("/ventasEmpleados/crear", auth, verificarRol(["admin", "empleado"]), registrarVentaEmpleado);
router.get("/ventasEmpleados",auth, verificarRol(["admin", "empleado"]),verificarPermisos("ver_ventasTotalesE"), obtenerVentasEmpleado);
router.get("/ventasEmpleados/:idEmpleado", auth, verificarRol(["admin", "empleado"]),obtenerLaVentaDeUnEmpleado);

module.exports = router;
