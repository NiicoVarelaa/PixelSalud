const util = require("util");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { conection } = require("../config/database");

const query = util.promisify(conection.query).bind(conection);

const login = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;

    if (!email || !contrasenia) {
      return res.status(400).json({ error: "El campo email o contraseña está vacío" });
    }

    // Buscar en Empleados
    const consultaEmp = `
      SELECT idEmpleado AS id, nombreEmpleado AS nombre, apellidoEmpleado AS apellido, 
             emailEmpleado AS email, contraEmpleado AS hash, rolEmpleado AS rol,
             crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO
      FROM Empleados WHERE emailEmpleado = ?
    `;
    const empleados = await query(consultaEmp, [email]);

    let user = null;
    let tipo = "";

    if (empleados.length > 0) {
      user = empleados[0];
      tipo = "empleado";
    } else {

      // Buscar en Clientes
      const consultaCli = `
        SELECT idCliente AS id, nombreCliente AS nombre, apellidoCliente AS apellido, 
               emailCliente AS email, contrCliente AS hash
        FROM Clientes WHERE emailCliente = ?
      `;
      const clientes = await query(consultaCli, [email]);

      if (clientes.length > 0) {
        user = clientes[0];
        tipo = "cliente";
      }
    }

    if (!user) {
      return res.status(400).json({ msg: "Email y/o contraseña incorrectos" });
    }

    const passCheck = await bcryptjs.compare(contrasenia, user.hash);
    if (!passCheck) {
      return res.status(400).json({ msg: "Email y/o contraseña incorrectos" });
    }

    const payload = {
      id: user.id,
      role: tipo === "empleado" ? user.rol : "cliente",
      permisos:
        tipo === "empleado"
          ? {
              crear_productos: user.crear_productos,
              modificar_productos: user.modificar_productos,
              modificar_ventasE: user.modificar_ventasE,
              modificar_ventasO: user.modificar_ventasO,
            }
          : null,
    };

  
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "8h" });

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