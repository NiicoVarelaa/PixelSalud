const { conection } = require("../config/database");
const bcrypt = require('bcrypt');

const login = (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: "El correo y la contraseña son obligatorios." });
  }

  // Se añade 'email' al SELECT para cada tabla
  const query = `
    (SELECT idCliente AS id, nombreCliente AS nombre, contraCliente AS contraGuardada, rol, 'cliente' AS tipo, emailCliente AS email FROM Clientes WHERE emailCliente = ?)
    UNION
    (SELECT idEmpleado AS id, nombreEmpleado AS nombre, contraEmpleado AS contraGuardada, rol, 'empleado' AS tipo, emailEmpleado AS email FROM Empleados WHERE emailEmpleado = ?)
    UNION
    (SELECT idAdmin AS id, nombreAdmin AS nombre, contraAdmin AS contraGuardada, rol, 'admin' AS tipo, emailAdmin AS email FROM admins WHERE emailAdmin = ?)
  `;

  conection.query(query, [email, email, email], async (err, results) => {
    if (err) {
      console.error("Error en la consulta de login:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const usuario = results[0];

    try {
      const esValida = await bcrypt.compare(contra, usuario.contraGuardada);

      if (!esValida) {
        return res.status(401).json({ error: "Contraseña incorrecta." });
      }

      res.status(200).json({
        message: `Login de ${usuario.tipo} exitoso.`,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          rol: usuario.rol,
          email: usuario.email // ¡AÑADIDO! Ahora enviamos el email.
        },
      });

    } catch (compareError) {
      console.error("Error al comparar contraseñas:", compareError);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  });
};

module.exports = { login };