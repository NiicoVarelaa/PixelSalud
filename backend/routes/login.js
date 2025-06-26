const express = require('express');
const router = express.Router();
const { conection } = require('../config/database');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM clientes WHERE email = ? AND contraCliente = ?';

  conection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error en el servidor:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const cliente = results[0];
    res.json({ message: 'Login exitoso', nombre: cliente.nombreCliente, id: cliente.idCliente });
  });
});

module.exports = router;
