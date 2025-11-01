const express = require("express");
const {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  reactivarEmpleado,
  darBajaEmpleado

} = require("../controllers/empleados");
const auth = require("../middlewares/auth")
const {verificarRol}= require("../middlewares/verificarPermisos")

const router = express.Router();

router.get("/Empleados", getEmpleados);
router.post("/Empleados/crear",auth,verificarRol(["admin"]), createEmpleado);
router.put("/empleados/actualizar/:id",auth,verificarRol(["admin"]), updateEmpleado)
router.put("/empleados/baja/:id",auth,verificarRol(["admin"]),darBajaEmpleado)
router.put("/empleados/reactivar/:id",auth,verificarRol(["admin"]),reactivarEmpleado)


module.exports = router;
