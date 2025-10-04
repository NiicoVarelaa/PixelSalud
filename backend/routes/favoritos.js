const express = require('express');

const router = express.Router();

const { 
    toggleFavorito, 
    obtenerFavoritosPorCliente 
} = require('../controllers/favoritos'); 

router.post('/toggle', toggleFavorito);
router.get('/cliente/:idCliente', obtenerFavoritosPorCliente);


module.exports = router;