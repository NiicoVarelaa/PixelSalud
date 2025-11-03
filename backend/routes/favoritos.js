const express = require('express');
const router = express.Router();

const { 
    toggleFavorito, 
    obtenerFavoritosPorCliente 
} = require('../controllers/favoritos'); 

const auth = require("../middlewares/auth")
const {verificarRol} = require("../middlewares/verificarPermisos")

// Añade o quita un producto de favoritos. Espera idCliente y idProducto en el body.
router.post('/toggle',auth,verificarRol(["cliente"]), toggleFavorito);

// Obtiene todos los favoritos de un cliente específico por su ID en la URL.
router.get('/cliente/:idCliente',auth,verificarRol(["cliente"]), obtenerFavoritosPorCliente);


module.exports = router;