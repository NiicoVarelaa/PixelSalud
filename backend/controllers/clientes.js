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
  // ¡AGREGAMOS 'dni' y 'activo' AL SELECT!
  const consulta = "SELECT idCliente, nombreCliente, apellidoCliente, emailCliente, dni, activo, rol FROM Clientes";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los clientes:", err);
      return res.status(500).json({ error: "Error al obtener los clientes." });
    }
    // (Quitamos el if de length===0 para que devuelva array vacío si no hay nadie, es más seguro para el front)
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

const buscarClientePorDNI = (req, res) => {
    const { dni } = req.params;
    const consulta = "SELECT nombreCliente, apellidoCliente, dni FROM Clientes WHERE dni = ?";
    
    conection.query(consulta, [dni], (err, results) => {
        if (err) return res.status(500).json({ error: "Error al buscar cliente" });
        if (results.length === 0) return res.status(404).json({ error: "Paciente no encontrado" });
        res.json(results[0]);
    });
};

const registrarPacienteExpress = async (req, res) => {
    const { nombre, apellido, dni, email } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !dni || !email) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        // 1. Encriptamos el DNI para usarlo como contraseña
        const salt = await bcryptjs.genSalt(10);
        const contraHasheada = await bcryptjs.hash(dni.toString(), salt);

        // 2. Insertamos en la DB
        // Asumo que tu tabla es 'Clientes' y tiene estas columnas
        const consulta = `
            INSERT INTO Clientes (nombreCliente, apellidoCliente, dni, emailCliente, contraCliente, rol, activo)
            VALUES (?, ?, ?, ?, ?, 'cliente', 1)
        `;

        conection.query(consulta, [nombre, apellido, dni, email, contraHasheada], (err, result) => {
            if (err) {
                console.error("Error al registrar paciente express:", err);
                // Manejo de duplicados (DNI o Email ya existen)
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "El DNI o Email ya están registrados en el sistema." });
                }
                return res.status(500).json({ error: "Error interno al registrar paciente." });
            }

            res.status(201).json({ message: "Paciente registrado con éxito." });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor" });
    }
};

module.exports = {
  getClientes,
  getClienteBajados,
  getCliente,
  crearCliente,
  updateCliente,
  darBajaCliente,
  activarCliente,
  buscarClientePorDNI,
  registrarPacienteExpress
};
