const express = require("express");
const {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  permisoCrearProductoEmp,
  quitarCrearProductoEmp,
  permisoModifProducEmp,
  quitarModifProducEmp,
  permisoModifVentaE,
  quitarModifVentaE,
  permisoModifVentaO,
  quitarModifVentaO,
  reactivarEmpleado,
  darBajaEmpleado

} = require("../controllers/empleados");

const router = express.Router();

router.get("/Empleados", getEmpleados);
router.post("/Empleados/crear", createEmpleado);
router.put("/empleados/actualizar/:id", updateEmpleado)
router.put("/empleados/crearProdSi/:id", permisoCrearProductoEmp)
router.put("/empleados/crearProdNo/:id", quitarCrearProductoEmp)
router.put("/empleados/modificarProdSi/:id",permisoModifProducEmp)
router.put("/empleados/modificarProdNo/:id",quitarModifProducEmp)
router.put("/empleados/modificarVentaESi/:id",permisoModifVentaE)
router.put("/empleados/modificarVentaENo/:id",quitarModifVentaE)
router.put("/empleados/modificarVentaOSi/:id",permisoModifVentaO)
router.put("/empleados/modificarVentaONo/:id",quitarModifVentaO)
router.put("/empleados/baja/:id",darBajaEmpleado)
router.put("/empleados/reactivar/:id",reactivarEmpleado)


module.exports = router;
