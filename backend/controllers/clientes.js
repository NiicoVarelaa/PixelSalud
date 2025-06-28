const { conection } = require("../config/database");

// Crear nuevo usuario
const crearCliente = (req, res) => {
  const { nombreCliente, contraCliente, email, receta, rolCliente } = req.body;

  const consulta = `INSERT INTO Clientes 
    (nombreCliente, contraCliente, email, receta, rolCliente)
    VALUES (?, ?, ?, ?, ?)`;

  conection.query(consulta, [nombreCliente, contraCliente, email, receta, rolCliente], (err, results) => {
    if (err) {
      console.error("Error al crear el usuario:", err);
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
    res.status(201).json({ message: "Usuario creado correctamente" });
  });
};

// Actualizar el logueado a true para un usuario y desloguear a los demás
const actualizarLogueado = (req, res) => {
  
  const id = req.params.idCliente;

  // Primero deslogueamos a todos
  const desloguear = `UPDATE Clientes SET logueado = 0`;
  const loguear = `UPDATE Clientes SET logueado = 1 WHERE idCliente = ?`;

  conection.query(desloguear, (err) => {
    if (err) {
      console.error("Error al desloguear usuarios:", err);
      return res.status(500).json({ error: "Error al actualizar logueado" });
    }

    conection.query(loguear, [id], (err, results) => {
      if (err) {
        console.error("Error al loguear al usuario:", err);
        return res.status(500).json({ error: "Error al actualizar logueado" });
      }

      res.status(200).json({ message: "Usuario logueado correctamente" });
    });
  });
};

// Eliminar usuario por ID
const borrarCliente = (req, res) => {
  const id = req.params.idCliente;
  const consulta = "DELETE FROM Clientes WHERE idCliente = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al borrar usuario:", err);
      return res.status(500).json({ error: "Error al borrar usuario" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  });
};

// Obtener todos los usuarios
const  getClientes = (req, res) => {
  const consulta = "SELECT * FROM Clientes";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios:", err);
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }

    res.status(200).json(results);
  });
};

// Actualizar un cliente por ID
const actualizarCliente = (req, res) => {
  const id = req.params.id;
  const { nombreCliente, contraCliente, email, receta, rolCliente } = req.body;

  const consulta = `
    UPDATE Clientes SET 
      nombreCliente = ?, 
      contraCliente = ?, 
      email = ?, 
      receta = ?, 
      rolCliente = ? 
    WHERE idCliente = ?
  `;

  conection.query(
    consulta,
    [nombreCliente, contraCliente, email, receta, rolCliente, id],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el cliente:", err);
        return res.status(500).json({ error: "Error al actualizar el cliente" });
      }

      res.status(200).json({ message: "Cliente actualizado correctamente" });
    }
  );
};

module.exports = {
  crearCliente,
  actualizarLogueado,
  borrarCliente,
  getClientes,
  actualizarCliente,
};
