const express = require('express');
const { getProductos, getProducto, deleteProducto, updateProducto, createProducto } = require('../controllers/productos');

const router = express.Router();

// Peticiones
router.get('/productos', getProductos);
router.get('/productos/:id', getProducto);
router.delete('/productos/eliminar/:id', deleteProducto);
router.put('/productos/actualizar/:id', updateProducto);
router.post('/productos/crear', createProducto)




module.exports = router;