const { conection } = require("../config/database");
const bcrypt = require('bcrypt'); // Importa la librería

const registrarCliente = async (req, res) => { // La función ahora es 'async'
  const { nombreCliente, apellidoCliente, email, contraCliente } = req.body;

  if (!nombreCliente || !apellidoCliente || !email || !contraCliente) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // Hashea la contraseña
    const saltRounds = 10;
    const contraHasheada = await bcrypt.hash(contraCliente, saltRounds);

    const query = `
      INSERT INTO Clientes (nombreCliente, apellidoCliente, emailCliente, contraCliente)
      VALUES (?, ?, ?, ?)
    `;

    // Guarda la contraseña hasheada
    conection.query(
      query,
      [nombreCliente, apellidoCliente, email, contraHasheada],
      (err, result) => {
        if (err) {
          console.error("Error al registrar cliente:", err);
          if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({ error: "El correo electrónico ya está registrado." });
          }
          return res.status(500).json({ error: "Error interno del servidor al registrar el cliente." });
        }
        res.status(201).json({ message: "Cliente registrado exitosamente", idCliente: result.insertId });
      }
    );

  } catch (hashError) {
      console.error("Error al hashear la contraseña:", hashError);
      return res.status(500).json({ error: "Error interno al procesar el registro." });
  }
};

module.exports = {
  registrarCliente,
};