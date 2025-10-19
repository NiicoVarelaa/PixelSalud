const { conection } = require("../config/database");

const crearCliente = (req, res) => {
  // Se agrega apellidoCliente que ahora es requerido en la nueva tabla
  const { nombreCliente, apellidoCliente, contraCliente, emailCliente, rol } = req.body;

  // Se ajusta la consulta para incluir los nuevos campos y nombres de columna correctos
  const consulta = `INSERT INTO Clientes 
    (nombreCliente, apellidoCliente, contraCliente, emailCliente, rol)
    VALUES (?, ?, ?, ?, ?)`;

  conection.query(
    consulta,
    [nombreCliente, apellidoCliente, contraCliente, emailCliente, rol],
    (err, results) => {
      if (err) {
        console.error("Error al crear el cliente:", err);
        // Mensaje de error más específico para emails duplicados
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "El correo electrónico ya está registrado." });
        }
        return res.status(500).json({ error: "Error interno al crear el cliente." });
      }
      res.status(201).json({ message: "Cliente creado correctamente", newId: results.insertId });
    }
  );
};

const borrarCliente = (req, res) => {
  const idCliente = req.params.idCliente;
  const consulta = "DELETE FROM Clientes WHERE idCliente = ?";

  conection.query(consulta, [idCliente], (err, results) => {
    if (err) {
      console.error("Error al borrar cliente:", err);
      return res.status(500).json({ error: "Error al borrar el cliente." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    res.status(200).json({ message: "Cliente eliminado correctamente." });
  });
};

const getClientes = (req, res) => {
  const consulta = "SELECT idCliente, nombreCliente, apellidoCliente, emailCliente, fecha_registro, hora_registro, rol FROM Clientes";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los clientes:", err);
      return res.status(500).json({ error: "Error al obtener los clientes." });
    }
    
    res.status(200).json(results);
  });
};

const getClienteById = (req, res) => {
    const idCliente = req.params.idCliente;
    // Seleccionamos todo excepto la contraseña por seguridad
    const consulta = "SELECT idCliente, nombreCliente, apellidoCliente, emailCliente, fecha_registro, hora_registro, rol FROM Clientes WHERE idCliente = ?";

    conection.query(consulta, [idCliente], (err, results) => {
        if (err) {
            console.error("Error al obtener el cliente:", err);
            return res.status(500).json({ error: "Error al obtener el cliente." });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado." });
        }
        res.status(200).json(results[0]);
    });
};


const updateCliente = (req, res) => {
  const idCliente = req.params.idCliente;
  // Se actualizan los nombres de las variables para coincidir con la BD
  const { nombreCliente, apellidoCliente, contraCliente, emailCliente, rol } = req.body;
  
  // Se ajusta la consulta con los nombres de columna correctos
  const consulta = `UPDATE Clientes SET 
    nombreCliente = ?, 
    apellidoCliente = ?, 
    contraCliente = ?, 
    emailCliente = ?, 
    rol = ? 
    WHERE idCliente = ?`;

  conection.query(
    consulta,
    [nombreCliente, apellidoCliente, contraCliente, emailCliente, rol, idCliente],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el cliente:", err);
        return res.status(500).json({ error: "Error al actualizar el cliente." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Cliente no encontrado." });
      }
      res.status(200).json({ message: "Cliente actualizado correctamente." });
    }
  );
};

module.exports = {
  crearCliente,
  borrarCliente,
  getClientes,
  getClienteById,
  updateCliente,
};