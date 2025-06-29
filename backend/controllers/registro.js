const { conection } = require('../config/database');

const registrarCliente = (req, res) => {
  const { nombreCliente, apellidoCliente, email, contraCliente } = req.body;

  if (!nombreCliente || !apellidoCliente || !email || !contraCliente) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
  }

  const nombreCompleto = `${nombreCliente} ${apellidoCliente}`.trim();

  const query = `
    INSERT INTO Clientes (nombreCliente, email, contraCliente, receta, rol, logueado)
    VALUES (?, ?, ?, 0, 'cliente', 0)
  `;

  conection.query(query, [nombreCompleto, email, contraCliente], (err, result) => {
    if (err) {
      console.error('Error al registrar cliente:', err);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }
    res.json({ mensaje: 'Cliente registrado exitosamente' });
  });
};

module.exports = {
  registrarCliente,
};

