const express = require('express');
const router = express.Router();

const { 
    toggleFavorito, 
    obtenerFavoritosPorCliente 
} = require('../controllers/favoritos'); 

const auth = require("../middlewares/auth")
const {verificarRol} = require("../middlewares/verificarPermisos")

router.post('/toggle', auth, verificarRol(["cliente"]), toggleFavorito);
router.get('/', auth, verificarRol(["cliente"]), obtenerFavoritosPorCliente);


module.exports = router;