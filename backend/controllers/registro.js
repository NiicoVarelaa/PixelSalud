const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs")

const registrarCliente = async (req, res) => {
  
  const { nombreCliente, apellidoCliente,  contraCliente, emailCliente, dni} = req.body;

  if (!nombreCliente || !apellidoCliente || !contraCliente || !emailCliente || !dni) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }
  let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraCliente, salt);

  const query = `
    INSERT INTO Clientes (nombreCliente, apellidoCliente, contraCliente, emailCliente, dni)
    VALUES (?, ?, ?, ?, ?)`;

  conection.query(
    query,
    [nombreCliente, apellidoCliente, contraEncrip, emailCliente, dni],
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