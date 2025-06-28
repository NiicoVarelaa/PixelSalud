// clientes.js
const express = require("express");
const {
  crearCliente,
  actualizarLogueado,
  borrarCliente,
  getClientes,
  desloguearCliente,
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

// Eliminar usuario
router.delete("/clientes/:idCliente", borrarCliente);

//

module.exports = router;