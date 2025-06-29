const express = require('express');
const router = express.Router();

const { registrarCliente } = require('../controllers/registro');

router.post('/registroCliente', registrarCliente);

module.exports = router;
