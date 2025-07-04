const { conection } = require("../config/database");

// Crear nuevo usuario
const crearCliente = (req, res) => {
  const { nombreCliente, contraCliente, email, rol } = req.body;

  const consulta = `INSERT INTO Clientes 
    (nombreCliente, contraCliente, email, rol)
    VALUES (?, ?, ?, ?)`;
  conection.query(consulta, [nombreCliente, contraCliente, email, rol], (err, results) => {
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
  
  const idCliente = req.params.idCliente;
  const consulta = "DELETE FROM Clientes WHERE idCliente = ?";

  conection.query(consulta, [idCliente], (err, results) => {
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

const updateCliente = (req, res) => {
  const idCliente = req.params.idCliente;
  const { nombreCliente, contraCliente, email, rol } = req.body;
  const consulta = "UPDATE CLIENTES  SET NOMBRECLIENTE = ?, CONTRACLIENTE = ?, EMAIL = ?, ROL= ? WHERE IDCLIENTE = ?";

  conection.query(consulta,[nombreCliente, contraCliente, email, rol , idCliente], (err, results)=>{
    if(err){
      console.error("Error al actulizar el cliente", err)
      return res.status(500).json({error: "Error al querer actualizar un cliente"})
    }
    return res.status(200).json(results)
  })
}

// Desloguear cliente al cerrar sesión
const desloguearCliente = (req, res) => {
  const id = req.params.idCliente;

  const consulta = `UPDATE Clientes SET logueado = 0 WHERE idCliente = ?`; 


  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al desloguear al usuario:", err);
      return res.status(500).json({ error: "Error al desloguear al usuario" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario deslogueado correctamente" });
  });
};

module.exports = {
  crearCliente,
  actualizarLogueado,
  borrarCliente,
  getClientes,
  updateCliente,
  desloguearCliente
};
