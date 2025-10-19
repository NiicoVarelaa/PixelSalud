const express = require('express');
const router = express.Router();

const { 
    toggleFavorito, 
    obtenerFavoritosPorCliente 
} = require('../controllers/favoritos'); 

// Añade o quita un producto de favoritos. Espera idCliente y idProducto en el body.
router.post('/toggle', toggleFavorito);

// Obtiene todos los favoritos de un cliente específico por su ID en la URL.
router.get('/cliente/:idCliente', obtenerFavoritosPorCliente);


module.exports = router;