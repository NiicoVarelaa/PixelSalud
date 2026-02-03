const util = require("util");
const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto"); // Nativo de Node
const { enviarCorreoRecuperacion } = require("../helps/envioMail")

const query = util.promisify(conection.query).bind(conection);

// --- CREAR CLIENTE ---
const crearCliente = async (req, res) => {
  const { nombreCliente, apellidoCliente, contraCliente, emailCliente, dni } = req.body;

  let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraCliente, salt);

  const exist = "select * from clientes where emailCliente =?";

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

// --- GET CLIENTES BAJADOS ---
const getClienteBajados = (req, res) => {
  const consulta = "SELECT * FROM Clientes where activo = false";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios bajados:", err);
      return res.status(500).json({ error: "Error al obtener los usuarios bajados" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No hay clientes dados de baja" });
    }
    res.status(200).json(results);
  });
};

// --- GET CLIENTES ---
const getClientes = (req, res) => {
  const consulta = "SELECT idCliente, nombreCliente, apellidoCliente, emailCliente, dni, activo, rol FROM Clientes";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los clientes:", err);
      return res.status(500).json({ error: "Error al obtener los clientes." });
    }
    res.status(200).json(results);
  });
};

// --- GET UN CLIENTE ---
const getCliente = (req, res) => {
  const id = req.params.id;
  const consulta = "select * from clientes where idCliente =?";
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
};

// --- UPDATE CLIENTE ---
const updateCliente = async (req, res) => {
  const idCliente = req.params.idCliente;
  let {
    nombreCliente,
    apellidoCliente,
    contraCliente,
    emailCliente,
    dni,
    telefono,
    direccion,
  } = req.body;

  if (emailCliente) {
    const consultaEmail = "SELECT idCliente FROM clientes WHERE emailCliente = ? AND idCliente != ?";
    conection.query(consultaEmail, [emailCliente, idCliente], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al validar email." });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "El email ya está en uso por otro cliente." });
      }
      await continuarUpdate();
    });
  } else {
    await continuarUpdate();
  }

  async function continuarUpdate() {
    let campos = [];
    let valores = [];
    if (nombreCliente) { campos.push("NOMBRECLIENTE = ?"); valores.push(nombreCliente); }
    if (apellidoCliente) { campos.push("APELLIDOCLIENTE = ?"); valores.push(apellidoCliente); }
    if (typeof telefono !== "undefined") { campos.push("TELEFONO = ?"); valores.push(telefono); }
    if (typeof direccion !== "undefined") { campos.push("DIRECCION = ?"); valores.push(direccion); }
    if (emailCliente) { campos.push("EMAILCLIENTE = ?"); valores.push(emailCliente); }
    if (dni) { campos.push("DNI = ?"); valores.push(dni); }
    if (contraCliente) {
      let salt = await bcryptjs.genSalt(10);
      let contraEncrip = await bcryptjs.hash(contraCliente, salt);
      campos.push("CONTRACLIENTE = ?");
      valores.push(contraEncrip);
    }
    if (campos.length === 0) {
      return res.status(400).json({ error: "No se enviaron datos para actualizar." });
    }
    const consulta = `UPDATE CLIENTES SET ${campos.join(", ")} WHERE IDCLIENTE = ?`;
    valores.push(idCliente);
    conection.query(consulta, valores, (err, results) => {
      if (err) {
        console.error("Error al actualizar el cliente:", err);
        return res.status(500).json({ error: "Error al actualizar el cliente." });
      }
      res.status(200).json({ msg: "Cliente actualizado con éxito", results });
    });
  }
};

// --- BAJA CLIENTE ---
const darBajaCliente = (req, res) => {
  const id = req.params.id;
  const consulta = "update clientes set activo = false where idCliente =?";
  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al dar baja/eliminar al cliente:", err);
      return res.status(500).json({ error: "Error al dar baja/eliminar al cliente" });
    }
    res.status(201).json({ message: "Cliente dado de baja/eliminado con exito" });
  });
};

// --- ACTIVAR CLIENTE ---
const activarCliente = (req, res) => {
  const id = req.params.id;
  const consulta = "update clientes set activo = true where idCliente =?";
  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al reactivar al cliente:", err);
      return res.status(500).json({ error: "Error al reactivar al cliente" });
    }
    res.status(201).json({ message: "Cliente reactivado con exito" });
  });
};

// --- BUSCAR POR DNI ---
const buscarClientePorDNI = (req, res) => {
  const { dni } = req.params;
  const consulta = "SELECT nombreCliente, apellidoCliente, dni FROM Clientes WHERE dni = ?";

  conection.query(consulta, [dni], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al buscar cliente" });
    if (results.length === 0) return res.status(404).json({ error: "Paciente no encontrado" });
    res.json(results[0]);
  });
};

// --- REGISTRO EXPRESS ---
const registrarPacienteExpress = async (req, res) => {
  const { nombre, apellido, dni, email } = req.body;

  if (!nombre || !apellido || !dni || !email) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    const contraHasheada = await bcryptjs.hash(dni.toString(), salt);

    const consulta = `
            INSERT INTO Clientes (nombreCliente, apellidoCliente, dni, emailCliente, contraCliente, rol, activo)
            VALUES (?, ?, ?, ?, ?, 'cliente', 1)
        `;

    conection.query(consulta, [nombre, apellido, dni, email, contraHasheada], (err, result) => {
      if (err) {
        console.error("Error al registrar paciente express:", err);
        if (err.code === "ER_DUP_ENTRY") {
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

// ========================================================
// --- NUEVAS FUNCIONES: RECUPERACIÓN DE CONTRASEÑA ---
// ========================================================

// 1. SOLICITAR (Recibe email -> Genera Token -> Manda Mail)
const olvideContrasena = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El email es obligatorio" });
  }

  try {
    // Buscar si existe el cliente
    const buscarQuery = "SELECT * FROM Clientes WHERE emailCliente = ?";
    const users = await query(buscarQuery, [email]);

    if (users.length === 0) {
      return res.status(404).json({ error: "No existe un usuario con este email" });
    }

    const usuario = users[0];

    // Generar Token y Fecha de Expiración (1 hora)
    const token = crypto.randomBytes(32).toString("hex");
    const expiracion = new Date(Date.now() + 3600000); // 1 hora desde ahora

    // Guardar en Base de Datos
    const updateQuery = "UPDATE Clientes SET tokenRecuperacion = ?, tokenExpiracion = ? WHERE idCliente = ?";
    await query(updateQuery, [token, expiracion, usuario.idCliente]);

    // Enviar Email
    await enviarCorreoRecuperacion(email, usuario.nombreCliente, token);

    res.json({ message: "Se ha enviado un correo con las instrucciones." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

// 2. RESTABLECER (Recibe token y nueva clave en BODY)
const nuevoPassword = async (req, res) => {
  const { token } = req.params; 
  const { nuevaPassword } = req.body; // <--- 1. Aquí la recibimos como 'nuevaPassword'

  if (!token || !nuevaPassword) {
      return res.status(400).json({ error: "Datos incompletos." });
  }

  try {
    // 1. Buscar usuario con ese token y que NO haya expirado
    const buscarToken = "SELECT * FROM Clientes WHERE tokenRecuperacion = ? AND tokenExpiracion > NOW()";
    const users = await query(buscarToken, [token]);

    if (users.length === 0) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const usuario = users[0];

    // 2. Hashear la nueva contraseña
    const salt = await bcryptjs.genSalt(10);
    
    // --- CORRECCIÓN AQUÍ ---
    // Antes decía 'newPassword', ahora usamos 'nuevaPassword' que es la variable correcta
    const contraEncrip = await bcryptjs.hash(nuevaPassword, salt); 

    // 3. Actualizar Password y borrar el token
    const updatePass = "UPDATE Clientes SET contraCliente = ?, tokenRecuperacion = NULL, tokenExpiracion = NULL WHERE idCliente = ?";
    await query(updatePass, [contraEncrip, usuario.idCliente]);

    res.json({ message: "Contraseña actualizada correctamente." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar la contraseña" });
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
  registrarPacienteExpress,
  olvideContrasena, 
  nuevoPassword     
};