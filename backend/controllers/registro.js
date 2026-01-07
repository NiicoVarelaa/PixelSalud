const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs");

const registrarCliente = async (req, res) => {
  try {
    const { nombreCliente, apellidoCliente, contraCliente, emailCliente, dni } = req.body;

    // 1. Validaciones
    if (!nombreCliente || !apellidoCliente || !contraCliente || !emailCliente || !dni) {
      return res.status(400).json({ mensaje: "Faltan campos requeridos" });
    }

    // 2. Encriptación
    let salt = await bcryptjs.genSalt(10);
    let contraEncrip = await bcryptjs.hash(contraCliente, salt);

    // 3. Insertar en la DB (¡AGREGAMOS 'rol' y 'activo'!)
    // Esto es vital para que luego pueda hacer login y para respetar la estructura de la tabla.
    const query = `
      INSERT INTO Clientes (nombreCliente, apellidoCliente, contraCliente, emailCliente, dni, rol, activo)
      VALUES (?, ?, ?, ?, ?, 'cliente', 1)`;

    conection.query(
      query,
      [nombreCliente, apellidoCliente, contraEncrip, emailCliente, dni],
      (err, result) => {
        if (err) {
          // Muestra el error exacto de SQL en tu terminal de Backend
          console.error("Error SQL al registrar cliente:", err.sqlMessage || err);

          if (err.code === 'ER_DUP_ENTRY') {
            // Puede ser duplicado de Email O de DNI
            return res.status(409).json({ mensaje: "El correo electrónico o DNI ya están registrados." });
          }
          return res.status(500).json({ mensaje: "Error al guardar en la base de datos" });
        }
        
        res.status(201).json({ mensaje: "Cliente registrado exitosamente" });
      }
    );

  } catch (error) {
    console.error("Error interno en registrarCliente:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = {
  registrarCliente,
};