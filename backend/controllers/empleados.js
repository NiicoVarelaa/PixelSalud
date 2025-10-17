const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs")

const getEmpleados = (req, res) => {
  const consulta = "select * from Empleados";

  conection.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
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
  } else {
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
  }
};

const updateEmpleado =  async(req, res) => {
  const { nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado} = req.body;
  const idEmpleado = req.params.idEmpleado;
  let salt = await bcryptjs.genSalt(10);
  let contraEncrip = await bcryptjs.hash(contraEmpleado, salt);
  const consulta =
    "update empleados set nombreEmpleado=?, apellidoEmpleado=?, emailEmpleado=?, contraEmpleado=? where idEmpleado=?";

  conection.query(
    consulta,
    [nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEncrip, idEmpleado],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el empleado:", err);
        return res
          .status(500)
          .json({ error: "Error al actulizar el empleado" });
      }
      res.status(200).json(results);
    }
  );
};

const actualizarLogueado = (req, res) => {
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
};

const deleteEmpleado = (req, res) => {
  const idEmpleado = req.params.idEmpleado;

  const consulta = "delete from Empleados where idEmpleado=?";

  conection.query(consulta, [idEmpleado], (err, results) => {
    if (err) {
      console.error("Error al obtener el empleado:", err);
      return res.status(500).json({ error: "Error al actualizar el empleado" });
    }
    res.status(200).json({ message: "Empleado eliminado correctamente" });
  });
};

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


module.exports = {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  actualizarLogueado,
  desloguearEmpleado,
};
