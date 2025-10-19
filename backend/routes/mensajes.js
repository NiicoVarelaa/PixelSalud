const express = require("express");
const router = express.Router();
const { crearMensaje } = require("../controllers/mensajes");

// Ruta para crear un nuevo mensaje
// POST /api/mensajes/crear
router.post("/crear", crearMensaje);

module.exports = router;