const util = require("util");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { conection } = require("../config/database");

const query = util.promisify(conection.query).bind(conection);

const login = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;

    if (!email || !contrasenia) {
      return res
        .status(400)
        .json({ error: "El campo email o contraseña está vacío" });
    }

    const consultaAdmin = `
      SELECT idAdmin AS id, nombreAdmin AS nombre, apellidoAdmin AS apellido, 
             emailAdmin AS email, contraAdmin AS hash, rol
      FROM Admins WHERE emailAdmin = ? AND activo = TRUE
    `;

    const consultaMedico = `
      SELECT idMedico AS id, nombreMedico AS nombre, apellidoMedico AS apellido, 
             emailMedico AS email, contraMedico AS hash
             /* Asumiendo que no tiene columna 'rol' */
      FROM Medicos WHERE emailMedico = ?
    `;

    const consultaEmp = `
      SELECT idEmpleado AS id, nombreEmpleado AS nombre, apellidoEmpleado AS apellido, 
             emailEmpleado AS email, contraEmpleado AS hash, rol
      FROM Empleados WHERE emailEmpleado = ? AND activo = TRUE
    `;

    const consultaCli = `
      SELECT idCliente AS id, nombreCliente AS nombre, apellidoCliente AS apellido, 
             emailCliente AS email, contrCliente AS hash, rol
      FROM Clientes WHERE emailCliente = ?
    `;

    let user = null;
    let tipo = ""; 



    // 1. Buscar en Admins
    const admins = await query(consultaAdmin, [email]);
    if (admins.length > 0) {
      user = admins[0];
      tipo = "admin";
    } else {
      
      const medicos = await query(consultaMedico, [email]);
      if (medicos.length > 0) {
        user = medicos[0];
        tipo = "medico";
      } else {
        
        const empleados = await query(consultaEmp, [email]);
        if (empleados.length > 0) {
          user = empleados[0];
          tipo = "empleado";
        } else {
         
          const clientes = await query(consultaCli, [email]);
          if (clientes.length > 0) {
            user = clientes[0];
            tipo = "cliente";
          }
        }
      }
    }


    if (!user) {
      return res.status(400).json({ msg: "Email y/o contraseña incorrectos" });
    }

    const passCheck = await bcryptjs.compare(contrasenia, user.hash);
    if (!passCheck) {
      return res.status(400).json({ msg: "Email y/o contraseña incorrectos" });
    }


    let permisos = null;
    if (tipo === "admin") {
      const consultaPermisos = "SELECT * FROM Permisos WHERE idAdmin = ?";
      const permisosData = await query(consultaPermisos, [user.id]);
      if (permisosData.length > 0) {
        permisos = {
          crear_productos: permisosData[0].crear_productos,
          modificar_productos: permisosData[0].modificar_productos,
          modificar_ventasE: permisosData[0].modificar_ventasE,
          modificar_ventasO: permisosData[0].modificar_ventasO,
          ver_ventasTotalesE: permisosData[0].ver_ventasTotalesE,
          ver_ventasTotalesO: permisosData[0].ver_ventasTotalesO
        };
      }
    } else if (tipo === "empleado") {
      const consultaPermisos = "SELECT * FROM Permisos WHERE idEmpleado = ?";
      const permisosData = await query(consultaPermisos, [user.id]);
      if (permisosData.length > 0) {
        permisos = {
          crear_productos: permisosData[0].crear_productos,
          modificar_productos: permisosData[0].modificar_productos,
          modificar_ventasE: permisosData[0].modificar_ventasE,
          modificar_ventasO: permisosData[0].modificar_ventasO,
          ver_ventasTotalesE: permisosData[0].ver_ventasTotalesE,
          ver_ventasTotalesO: permisosData[0].ver_ventasTotalesO
        };
      }
    }
    
    const role = user.rol ? user.rol : tipo;

    const payload = {
      id: user.id,
      role: role,
      permisos: permisos, 
    };

    
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    return res.status(200).json({
      msg: "Inicio de sesión exitoso",
      tipo, 
      token,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: payload.role, 
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Server error", error });
  }
};

module.exports = { login };






























/* const login = (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const queryCliente =
    "SELECT idCliente AS id, nombreCliente AS nombre, contraCliente, rol FROM Clientes WHERE email = ?";
  conection.query(queryCliente, [email], async (err, resultsCliente) => {
    if (err) {
      console.error("Error DB:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (resultsCliente.length > 0) {
      const cliente = resultsCliente[0];
      if (cliente.contraCliente !== contra) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      try {
        await new Promise((resolve, reject) => {
          conection.query(`UPDATE Clientes SET logueado = 0`, (updateErr) => {
            if (updateErr) reject(updateErr);
            else resolve();
          });
        });

        await new Promise((resolve, reject) => {
          conection.query(
            `UPDATE Clientes SET logueado = 1 WHERE idCliente = ?`,
            [cliente.id],
            (updateErr) => {
              if (updateErr) reject(updateErr);
              else resolve();
            }
          );
        });

      } catch (updateError) {
        console.error(
          "Error al actualizar el estado de logueado:",
          updateError
        );
        return res
          .status(500)
          .json({ error: "Error al actualizar el estado de login" });
      }

      try {
        // Desloguear a todos los clientes primero 
        await new Promise((resolve, reject) => {
            conection.query(`UPDATE Clientes SET logueado = 0`, (updateErr) => {
                if (updateErr) reject(updateErr);
                else resolve();
            });
        });

        // Loguear al cliente actual
        await new Promise((resolve, reject) => {
            conection.query(`UPDATE Clientes SET logueado = 1 WHERE idCliente = ?`, [cliente.id], (updateErr) => {
                if (updateErr) reject(updateErr);
                else resolve();
            });
        });

        console.log(`Cliente con ID ${cliente.id} logueado y estado actualizado.`);
      } catch (updateError) {
          console.error('Error al actualizar el estado de logueado:', updateError);
          return res.status(500).json({ error: 'Error al actualizar el estado de login' });
      }

      return res.json({
        message: "Login exitoso",
        id: cliente.id,
        nombre: cliente.nombre,
        rol: cliente.rol || "cliente",
      });
    }

    const queryEmpleado =
      "SELECT idEmpleado AS id, nombreEmpleado AS nombre, contraEmpleado, rol FROM Empleados WHERE emailEmpleado = ?";
    conection.query(queryEmpleado, [email], async (err, resultsEmpleado) => {
      if (err) {
        console.error("Error DB:", err);
        return res.status(500).json({ error: "Error del servidor" });
      }

      if (resultsEmpleado.length === 0) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      if (resultsEmpleado.length > 0) {
        const Empleados = resultsEmpleado[0];
        if (Empleados.contraEmpleado !== contra) {
          return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        try {
          await new Promise((resolve, reject) => {
            conection.query(
              `UPDATE Empleados SET logueado = 0`,
              (updateErr) => {
                if (updateErr) reject(updateErr);
                else resolve();
              }
            );
          });

          await new Promise((resolve, reject) => {
            conection.query(
              `UPDATE Empleados SET logueado = 1 WHERE idEmpleado = ?`,
              [Empleados.id],
              (updateErr) => {
                if (updateErr) reject(updateErr);
                else resolve();
              }
            );
          });

        } catch (updateError) {
          console.error(
            "Error al actualizar el estado de logueado:",
            updateError
          );
          return res
            .status(500)
            .json({ error: "Error al actualizar el estado de login" });
        }

        return res.json({
          message: "Login exitoso",
          id: Empleados.id,
          nombre: Empleados.nombre,
          rol: Empleados.rol || "empleado",
        });
      }
    });
  });
};

module.exports = { login }; */