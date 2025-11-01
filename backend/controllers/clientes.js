const { conection } = require("../config/database");

const crearCliente = (req, res) => {
  const { nombreCliente, contraCliente, email, rol } = req.body;

  const consulta = `INSERT INTO Clientes 
    (nombreCliente, contraCliente, email, rol)
    VALUES (?, ?, ?, ?)`;

  conection.query(
    consulta,
    [nombreCliente, contraCliente, email, rol],
    (err, results) => {
      if (err) {
        console.error("Error al crear el usuario:", err);
        return res.status(500).json({ error: "Error al crear el usuario" });
      }
      res.status(201).json({ message: "Usuario creado correctamente" });
    }
  );
};

const getClienteBajados = (req, res) => {
  const consulta = "SELECT * FROM Clientes where activo = false";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios bajados:", err);
      return res.status(500).json({ error: "Error al obtener los usuarios bajados" });
    }
    
    res.status(200).json(results);
  });
};

const getClientes = (req, res) => {
  const consulta = "SELECT * FROM Clientes";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios:", err);
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
    
    res.status(200).json(results);
  });
};

const getCliente = (req, res)=>{
  const id = req.params.id
  const consulta = "select * from clientes where idCliente =?"
   conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el cliente:", err);
      return res.status(500).json({ error: "Error al obtener el cliente" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(results[0]);
  });
}

const updateCliente = (req, res) => {
  const idCliente = req.params.idCliente;
  const { nombreCliente, contraCliente, email, rol } = req.body;
  const consulta =
    "UPDATE CLIENTES  SET NOMBRECLIENTE = ?, CONTRACLIENTE = ?, EMAIL = ?, ROL= ? WHERE IDCLIENTE = ?";

  conection.query(
    consulta,
    [nombreCliente, contraCliente, email, rol, idCliente],
    (err, results) => {
      if (err) {
        console.error("Error al actulizar el cliente", err);
        return res
          .status(500)
          .json({ error: "Error al querer actualizar un cliente" });
      }
      return res.status(200).json(results);
    }
  );
};

const darBajaCliente = (req, res)=>{
  const id = req.params.id
  const consulta = "update clientes set activo = false where idCliente =?"
   conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al dar baja/eliminar al cliente:", err);
      return res.status(500).json({ error: "Error al dar baja/eliminar al cliente" });
    }
    res.status(201).json({ message: "Cliente dado de baja/eliminado con exito" });
  });
}

const activarCliente = (req, res)=>{
  const id = req.params.id
  const consulta = "update clientes set activo = true where idCliente =?"
   conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al reactivar al cliente:", err);
      return res.status(500).json({ error: "Error al reactivar al cliente" });
    }
    res.status(201).json({ message: "Cliente reactivado con exito" });
  });
}

module.exports = {
  getClientes,
  getClienteBajados,
  getCliente,
  crearCliente,
  updateCliente,
  darBajaCliente,
  activarCliente

};
