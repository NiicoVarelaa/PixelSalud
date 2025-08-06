const { conection } = require("../config/database");

const login = (req, res) => {
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

module.exports = { login };