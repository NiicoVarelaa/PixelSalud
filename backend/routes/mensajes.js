const express = require("express");
const router = express.Router();
const { crearMensaje, listarMensajes } = require("../controllers/mensajes");

// Ruta para crear un nuevo mensaje
// POST /api/mensajes/crear
router.post("/crear", crearMensaje);

// Ruta para listar todos los mensajes
router.get("/", listarMensajes);

module.exports = router;