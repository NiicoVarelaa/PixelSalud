const express = require("express");
const {
  getEmpleados,
  deleteEmpleado,
  updateEmpleado,
  createEmpleado,
  // 1. Se eliminan las importaciones de las funciones obsoletas
} = require("../controllers/empleados");

const router = express.Router();

// --- RUTAS ESTANDARIZADAS (Estilo RESTful) ---

// GET /api/empleados -> Obtiene todos los empleados
router.get("/empleados", getEmpleados);

// POST /api/empleados -> Crea un nuevo empleado
router.post("/empleados", createEmpleado);

// PUT /api/empleados/123 -> Actualiza el empleado con ID 123
router.put("/empleados/:idEmpleado", updateEmpleado);

// DELETE /api/empleados/123 -> Elimina el empleado con ID 123
router.delete("/empleados/:idEmpleado", deleteEmpleado);

// 2. Se eliminan las rutas para loguear y desloguear que ya no se usan
// router.put("/Empleados/loguear/:idEmpleado", actualizarLogueado);
// router.put("/Empleados/:idEmpleado/desloguear", desloguearEmpleado);

module.exports = router;