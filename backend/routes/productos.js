const express = require('express');
const { getProductos, getProducto, deleteProducto, updateProducto, createProducto } = require('../controllers/productos');

const router = express.Router();

// Peticiones
router.get('/productos', getProductos);
router.get('/productos/:idProducto', getProducto);
router.delete('/productos/eliminar/:idProducto', deleteProducto);
router.put('/productos/actualizar/:idProducto', updateProducto);
router.post('/productos/crear', createProducto)




module.exports = router;