const { conection } = require('../config/database');

const login = (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  // Buscar en Clientes
  const queryCliente = 'SELECT idCliente AS id, nombreCliente AS nombre, contraCliente, rol FROM Clientes WHERE email = ?';
  conection.query(queryCliente, [email], (err, resultsCliente) => {
    if (err) {
      console.error('Error DB:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (resultsCliente.length > 0) {
      const cliente = resultsCliente[0];
      if (cliente.contraCliente !== contra) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      return res.json({
        message: 'Login exitoso',
        id: cliente.id,
        nombre: cliente.nombre,
        rol: cliente.rol || 'cliente',
      });
    }

    // Buscar en Empleados
    const queryEmpleado = 'SELECT idEmpleado AS id, nombreEmpleado AS nombre, contraEmpleado, rol FROM Empleados WHERE emailEmpleado = ?';
    conection.query(queryEmpleado, [email], (err, resultsEmpleado) => {
      if (err) {
        console.error('Error DB:', err);
        return res.status(500).json({ error: 'Error del servidor' });
      }

      if (resultsEmpleado.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const empleado = resultsEmpleado[0];
      if (empleado.contraEmpleado !== contra) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      return res.json({
        message: 'Login exitoso',
        id: empleado.id,
        nombre: empleado.nombre,
        rol: empleado.rol || 'empleado',
      });
    });
  });
};

module.exports = { login };
