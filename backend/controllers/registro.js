const { conection } = require("../config/database");

const registrarCliente = (req, res) => {
  
  const { nombreCliente, apellidoCliente, email, contraCliente } = req.body;

  if (!nombreCliente || !apellidoCliente || !email || !contraCliente) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }

  const query = `
    INSERT INTO Clientes (nombreCliente, apellidoCliente, email, contraCliente, rol, logueado)
    VALUES (?, ?, ?, ?, 'cliente', 0)
    --           ^        ^ <-- ¡NUEVA COLUMNA!
  `;

  conection.query(
    query,
    [nombreCliente, apellidoCliente, email, contraCliente],
    (err, result) => {
      if (err) {
        console.error("Error al registrar cliente:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensaje: "El correo electrónico ya está registrado." });
        }
        return res.status(500).json({ mensaje: "Error del servidor" });
      }
      res.json({ mensaje: "Cliente registrado exitosamente" });
    }
  );
};

module.exports = {
  registrarCliente,
};