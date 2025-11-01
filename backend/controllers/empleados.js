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


const getEmpleadosBajados = (req, res)=>{
  const consulta = "select * from empleados where activo = false"
   conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los empleados dados de baja:", err);
      return res.status(500).json({ error: "Error al obtener los empleados dados de baja" });
    }
    
    res.status(200).json(results);
  });
}

const getEmpleado = (req, res)=>{
  const id = req.params.id
  const consulta = "select * from empleados where idEmpleado=?"
  conection.query(consulta,[id],(err,results)=>{
    if (err) {
      console.error("Error al obtener empleado:", err);
      return res.status(500).json({ error: "Error al obtener empleado" });
    }
    
    res.status(200).json(results);
  })
}


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
  getEmpleadosBajados,
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  darBajaEmpleado,
  reactivarEmpleado
};
