// clientes.js
const express = require("express");
const {
  getClientes,
  crearCliente,
  actualizarLogueado,
  desloguearCliente,
  updateCliente,
  borrarCliente
} = require("../controllers/clientes");

const router = express.Router();

// Obtener todos los usuarios
router.get("/clientes", getClientes);

// Crear nuevo usuario
router.post("/clientes/crear", crearCliente);

// Loguear usuario (logueado = 1 y los demás en 0)
router.put("/clientes/loguear/:idCliente", actualizarLogueado);

// Corrected logout route
router.put("/clientes/:idCliente/logout", desloguearCliente);

router.put("/clientes/actualizar/:idCliente", updateCliente)

// Eliminar usuario
router.delete("/clientes/eliminar/:idCliente", borrarCliente);

//

module.exports = router;