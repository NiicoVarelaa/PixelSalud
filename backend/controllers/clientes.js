const util = require("util")
const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs")
const query = util.promisify(conection.query).bind(conection);

const crearCliente =  async (req, res) => {
  const { nombreCliente,apellidoCliente, contraCliente, emailCliente, dni  } = req.body;

  let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraCliente, salt);

  const exist = "select * from clientes where emailCliente =?"

  const clienteExist = await query(exist, [emailCliente]);
  if (clienteExist[0]) {
    return res
      .status(409)
      .json({ error: "El usuario que intentas crear, ya se encuentra creado" });
  } 

  const consulta = `INSERT INTO Clientes 
    (nombreCliente, apellidoCliente, contraCliente, emailCliente, dni )
    VALUES (?, ?, ?, ?, ?)`;

  conection.query(
    consulta,
    [nombreCliente, apellidoCliente, contraEncrip, emailCliente, dni],
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
    if (results.length===0) {
      return res.status(404).json({error:"No hay clientes dados de baja"})
    }
    res.status(200).json(results);
  });
};

const getClientes = (req, res) => {
  const consulta = "SELECT idCliente, nombreCliente, apellidoCliente, emailCliente, fecha_registro, hora_registro, rol FROM Clientes";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los clientes:", err);
      return res.status(500).json({ error: "Error al obtener los clientes." });
    }
    if (results.length===0) {
      return res.status(404).json({error:"No hay clientes creados"})
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

const updateCliente = async (req, res) => {
  const idCliente = req.params.idCliente;
  const {  nombreCliente,apellidoCliente, contraCliente, emailCliente, dni  } = req.body;

   let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraCliente, salt);
  
  const consulta =
    "UPDATE CLIENTES  SET NOMBRECLIENTE = ?, APELLIDOCLIENTE=?, CONTRACLIENTE = ?, EMAILCLIENTE = ?, DNI= ? WHERE IDCLIENTE = ?";

  conection.query(
    consulta,
    [nombreCliente,apellidoCliente, contraEncrip, emailCliente, dni , idCliente],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el cliente:", err);
        return res.status(500).json({ error: "Error al actualizar el cliente." });
      }
       res.status(200).json({msg:"Empleado actualizado con exito", results});
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
