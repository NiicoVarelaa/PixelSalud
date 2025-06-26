const express = require('express');
const router = express.Router();
const { conection } = require('../config/database');

// Registro médico
router.post('/registroMedico', (req, res) => {
  const { nombre, apellido, email, especialidad, matricula, password } = req.body;

  const query = `
   INSERT INTO medicos (nombreMedico, apellidoMedico, email, especialidad, matricula, contraMedico)
VALUES (?, ?, ?, ?, ?, ?)

  `;

  conection.query(
    query,
    [nombre, apellido, email, especialidad || '', matricula, password],
    (err, result) => {
      if (err) {
        console.error('Error en registro médico:', err);
        return res.status(500).json({ error: 'Error al registrar el médico' });
      }
      res.json({ mensaje: 'Médico registrado con éxito', id: result.insertId });
    }
  );
});

// Login médico
router.post('/loginMedico', (req, res) => {
  const { email, contraMedico, matricula } = req.body;

  const query = `
    SELECT * FROM Medicos
    WHERE email = ? AND contraMedico = ? AND matricula = ?
  `;

  conection.query(query, [email, contraMedico, matricula], (err, results) => {
    if (err) {
      console.error('Error en login médico:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const medico = results[0];
    res.json({
      message: 'Login exitoso',
      nombre: medico.nombreMedico,
      id: medico.idMedico,
      matricula: medico.matricula,
    });
  });
});

module.exports = router;



