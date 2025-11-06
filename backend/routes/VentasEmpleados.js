const express = require("express");
const {
  registrarVentaEmpleado,
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
  obtenerVentasAnuladas,
  obtenerVentasCompletadas,
  updateVenta,
  anularVenta
} = require("../controllers/VentasEmpleados");

const router = express.Router();
const auth = require("../middlewares/auth")
const {verificarRol, verificarPermisos}= require("../middlewares/verificarPermisos")

router.get("/ventasEmpleados",auth, verificarRol(["admin", "empleado"]),verificarPermisos("ver_ventasTotalesE"), obtenerVentasEmpleado);
router.get("/ventasEmpleados/completas",auth,verificarRol(["admin" , "empleado"]), verificarPermisos("ver_ventasTotalesE"), obtenerVentasCompletadas)
router.get("/ventasEmpleados/anuladas",auth,verificarRol(["admin" , "empleado"]), verificarPermisos("ver_ventasTotalesE"), obtenerVentasAnuladas)
router.get("/ventasEmpleados/:idEmpleado", auth, verificarRol(["admin", "empleado"]),obtenerLaVentaDeUnEmpleado);
router.post("/ventasEmpleados/crear", auth, verificarRol(["admin", "empleado"]), registrarVentaEmpleado);
router.put("/ventasEmpleados/actualizar/:idVentaE",auth,verificarRol(["admin" , "empleado"]), verificarPermisos("modificar_ventasE"), updateVenta)
router.put("/ventasEmpleados/anular/:idVentaE",auth,verificarRol(["admin" , "empleado"]), verificarPermisos("modificar_ventasE"), anularVenta)

module.exports = router;
