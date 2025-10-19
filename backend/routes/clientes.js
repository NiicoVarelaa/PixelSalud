const express = require("express");
const {
  getClientes,

  // Se añade getClienteById
  getClienteById, 
  crearCliente,
  updateCliente,
  borrarCliente,
  
  // Se eliminan actualizarLogueado y desloguearCliente porque ya no existen en el controlador
} = require("../controllers/clientes");

const router = express.Router();

// --- Rutas Recomendadas (Estilo RESTful) ---

// GET /api/clientes -> Obtiene todos los clientes
router.get("/clientes", getClientes);

// GET /api/clientes/123 -> Obtiene el cliente con ID 123
router.get("/clientes/:idCliente", getClienteById);

// POST /api/clientes -> Crea un nuevo cliente
router.post("/clientes", crearCliente);

// PUT /api/clientes/123 -> Actualiza el cliente con ID 123
router.put("/clientes/:idCliente", updateCliente);

// DELETE /api/clientes/123 -> Elimina el cliente con ID 123
router.delete("/clientes/:idCliente", borrarCliente);


module.exports = router;