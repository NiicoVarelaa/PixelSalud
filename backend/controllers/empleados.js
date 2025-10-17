const util = require("util")
const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs")

const query = util.promisify(conection.query).bind(conection);

const getEmpleados = (req, res) => {
  const consulta = "select * from Empleados";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.status(200).json({msg:"Empleados traidos con exitos", results} );
  });
};



const createEmpleado = async (req, res) => {
  const { nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado } =req.body;

  let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraEmpleado, salt);

  const exist = "select * from empleados where emailEmpleado=?";

  const clienteExist = await query(exist, [emailEmpleado]);
  if (clienteExist[0]) {
    return res
      .status(409)
      .json({ error: "El usuario que intentas crear, ya se encuentra creado" });
  } 
    const consulta =
      "insert into empleados (nombreEmpleado, apellidoEmpleado,emailEmpleado, contraEmpleado) values (?,?,?,?);";

    conection.query(
      consulta,
      [nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEncrip],
      (err, result) => {
        if (err) {
          console.error("Error al crear el empleado:", err);
          return res.status(500).json({ error: "Error al crear el empleado" });
        }
        res.status(201).json({ message: "Empleado creado correctamente" });
      }
    );
  
};

const updateEmpleado =  async(req, res) => {
  const { nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado} = req.body;
  const id = req.params.id;
  let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraEmpleado, salt);
  const consulta =
    "update empleados set nombreEmpleado=?, apellidoEmpleado=?, emailEmpleado=?, contraEmpleado=? where idEmpleado=?";

  conection.query(
    consulta,
    [nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEncrip, id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el empleado:", err);
        return res
          .status(500)
          .json({ error: "Error al actulizar el empleado" });
      }
      res.status(200).json({msg:"Empleado actualizado con exito", results});
    }
  );
};

/* const actualizarLogueado = (req, res) => {
  const id = req.params.idEmpleado;

  // Primero deslogueamos a todos
  const desloguear = `UPDATE Empleados SET logueado = 0`;
  const loguear = `UPDATE Empleado SET logueado = 1 WHERE idEmpleado = ?`;

  conection.query(desloguear, (err) => {
    if (err) {
      console.error("Error al desloguear empleado:", err);
      return res.status(500).json({ error: "Error al actualizar logueado" });
    }

    conection.query(loguear, [id], (err, results) => {
      if (err) {
        console.error("Error al loguear al Empleado:", err);
        return res.status(500).json({ error: "Error al actualizar logueado" });
      }

      res.status(200).json({ message: "Empleado logueado correctamente" });
    });
  });
};

const desloguearEmpleado = (req, res) => {
  const id = req.params.idEmpleado;
  const consulta = `UPDATE Empleados SET logueado = 0 WHERE idEmpleado = ?`;

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al desloguear al Empleado:", err);
      return res.status(500).json({ error: "Error al desloguear al Empleado" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.status(200).json({ message: "Empleado deslogueado correctamente" });
  });
}; */

const permisoCrearProductoEmp = (req, res) => {
  const id = req.params.id;
  const consulta =
    "update empleados set crear_productos = true where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al dar permiso para crear productos:", error);
      return res
        .status(500)
        .json({ error: "Error  al dar permiso para crear productos" });
    }
    res
      .status(201)
      .json({ message: "Permiso para crear productos otorgado correctamente" });
  });
};

const quitarCrearProductoEmp = (req, res) => {
  const id = req.params.id;
  const consulta =
    "update empleados set crear_productos = false where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al quitar permiso para crear productos:", error);
      return res
        .status(500)
        .json({ error: "Error  al quitar permiso para crear productos" });
    }
    res
      .status(201)
      .json({ message: "Permiso quitado para crear productos correctamente" });
  });
};

const permisoModifProducEmp = (req, res) => {
  const id = req.params.id;
  const consulta =
    "update empleados set modificar_productos = true where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al dar permiso para modificar productos:", error);
      return res
        .status(500)
        .json({ error: "Error  al dar permiso para modificar productos" });
    }
    res
      .status(201)
      .json({
        message: "Permiso para modificar productos otorgado correctamente",
      });
  });
};

const quitarModifProducEmp = (req, res) => {
  const id = req.params.id;
  const consulta =
    "update empleados set modificar_productos = false where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al quitar permiso para modificar productos:", error);
      return res
        .status(500)
        .json({ error: "Error  al quitar permiso para modificar productos" });
    }
    res
      .status(201)
      .json({
        message: "Permiso quitado para modificar productos correctamente",
      });
  });
};


const permisoModifVentaE = (req, res) => {
  const id = req.params.id;
  const consulta =
    "update empleados set modificar_ventasE = true where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al dar permiso para modificar ventas:", error);
      return res
        .status(500)
        .json({ error: "Error  al dar permiso para modificar ventas" });
    }
    res
      .status(201)
      .json({
        message: "Permiso para modificar ventas otorgado correctamente",
      });
  });
};

const quitarModifVentaE = (req,res)=>{
    const id = req.params.id;
  const consulta =
    "update empleados set modificar_ventasE = false where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al quitar permiso para modificar ventas:", error);
      return res
        .status(500)
        .json({ error: "Error  al quitar permiso para modificar ventas" });
    }
    res
      .status(201)
      .json({
        message: "Permiso quitado para modificar ventas correctamente",
      });
  });  
}


const permisoModifVentaO = (req, res) => {
  const id = req.params.id;
  const consulta =
    "update empleados set modificar_ventasO = true where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al dar permiso para modificar ventas:", error);
      return res
        .status(500)
        .json({ error: "Error  al dar permiso para modificar ventas" });
    }
    res
      .status(201)
      .json({
        message: "Permiso para modificar ventas otorgado correctamente",
      });
  });
};

const quitarModifVentaO = (req,res)=>{
    const id = req.params.id;
  const consulta =
    "update empleados set modificar_ventasO = false where idEmpleado = ?";

  conection.query(consulta, [id], (error, result) => {
    if (error) {
      console.log("Error al quitar permiso para modificar ventas:", error);
      return res
        .status(500)
        .json({ error: "Error  al quitar permiso para modificar ventas" });
    }
    res
      .status(201)
      .json({
        message: "Permiso quitado para modificar ventas correctamente",
      });
  });  
}

const darBajaEmpleado = (req, res) => {
  const id = req.params.id;
  const consulta = "update empleados set activo = false where idEmpleado=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al eliminar/dar de baja al empleado:", err);
      return res
        .status(500)
        .json({ error: "Error al eliminar/dar de baja al empleado" });
    }
    res
      .status(201)
      .json({ message: "Empleado dado de baja/eliminado con exito" });
  });
};

const reactivarEmpleado = (req, res) => {
  const id = req.params.id;
  const consulta = "update empleados set activo = true where idEmpleado=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al reactivar al empleado:", err);
      return res.status(500).json({ error: "Error al reactivar al empleado" });
    }
    res.status(201).json({ message: "Empleado reactivado con exito" });
  });
};

module.exports = {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  permisoCrearProductoEmp,
  quitarCrearProductoEmp,
  permisoModifProducEmp,
  quitarModifProducEmp,
  permisoModifVentaE,
  quitarModifVentaE,
  permisoModifVentaO,
  quitarModifVentaO,
  darBajaEmpleado,
  reactivarEmpleado
};
