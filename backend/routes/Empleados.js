const express = require("express");
const {
  getEmpleados,
  deleteEmpleado,
  updateEmpleado,
  createEmpleado,
  actualizarLogueado,
  desloguearEmpleado,
} = require("../controllers/empleados");

const router = express.Router();

router.get("/Empleados", getEmpleados);
router.delete("/Empleados/eliminar/:idEmpleado", deleteEmpleado);
router.put("/Empleados/modificar/:idEmpleado", updateEmpleado);
router.post("/Empleados/crear", createEmpleado);
router.put("/Empleados/loguear/:idEmpleado", actualizarLogueado);
router.put("/Empleados/:idEmpleado/desloguear", desloguearEmpleado);

module.exports = router;
