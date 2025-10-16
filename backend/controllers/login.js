const util = require("util")
const bcryptjs= require("bcryptjs")
const jwt = require("jsonwebtoken")
const { conection } = require("../config/database");


const query = util.promisify(conection.query).bind(conection)

const loginEmp = async(req,res)=>{
  try {
    const {emailEmpleado, contrEmpleado} = req.body;
    if(!emailEmpleado, !contrEmpleado){
      return res.status(400).json({error: "El campo Email o contrasenia esta vacio"})
    }
    const consulta = "select idEmpleado, nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado, rolEmpleado from Empleados where emailEmpleado = ?"
    const result = await query(consulta, [emailEmpleado])
    if(result.length===0){
      return res.status(400).json({msg: "Email y/o contrasenia incorrectos"})
    }
    const empleado = result[0]
    const passCheck = await bcryptjs.compare(contrEmpleado, empleado.contrEmpleado)
    if(!passCheck){
      return res.status(400).json({msg: "Email y/o contrasenia incorrectos"})
    }
    const payload ={
      id:empleado.idEmpleado,
      role:empleado.rol,
      crear_productos:empleado.crear_productos,
      modificar_productos:empleado.modificar_productos,
      modificar_ventasE:empleado.modificar_ventasE,
      modificar_ventasO:empleado.modificar_ventasO,
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY )
    return res.status(200).json({msg:"Logueado", token})
  } catch (error) {
     console.error("Error en loguear:", error);
      res.status(500).json({mensaje:"Server error",error})  
  }
}


module.exports= {
  loginEmp
}






























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