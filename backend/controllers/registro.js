const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs")

const registrarCliente = async (req, res) => {
  
  const { nombreCliente, apellidoCliente, emailCliente, contraCliente } = req.body;

  if (!nombreCliente || !apellidoCliente || !emailCliente || !contraCliente) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }
  let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraCliente, salt);

  const query = `
    INSERT INTO Clientes (nombreCliente, apellidoCliente, emailCliente, contraCliente)
    VALUES (?, ?, ?, ?)`;

  conection.query(
    query,
    [nombreCliente, apellidoCliente, emailCliente, contraEncrip],
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