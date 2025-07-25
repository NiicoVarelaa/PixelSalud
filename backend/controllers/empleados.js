const { conection } = require("../config/database")

const getEmpleados = (req, res) => {
    const consulta = "select * from Empleados"

    conection.query(consulta, (err, results) =>{
        if(err) throw err
        res.json(results)
    })
}

const createEmpleado = (req, res) =>{

    const {nombreEmpleado, emailEmpleado, contraEmpleado, rol} = req.body

    const consulta = "insert into empleados (nombreEmpleado, emailEmpleado, contraEmpleado, rol) values (?,?,?,?);"

    conection.query(consulta,[nombreEmpleado,emailEmpleado,contraEmpleado,rol],(err,result)=>{


        if (err) {
            console.error('Error al crear el empleado:', err);
            return res.status(500).json({ error: 'Error al crear el empleado' });
        }
        res.status(201).json({ message: 'Empleado creado correctamente'});
    })

}

const updateEmpleado = (req, res) => {
    

    const {nombreEmpleado, emailEmpleado, contraEmpleado, rol} = req.body
    const idEmpleado = req.params.idEmpleado

    const consulta = "update empleados set nombreEmpleado=?, emailEmpleado=?, contraEmpleado=?, rol=? where idEmpleado=?"

    conection.query(consulta, [nombreEmpleado, emailEmpleado, contraEmpleado, rol, idEmpleado], (err,results)=>{


        if (err) {
            console.error('Error al obtener el empleado:', err);
            return res.status(500).json({ error: 'Error al actulizar el empleado' });
        }
        res.status(200).json(results);
    })

}

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
    const idEmpleado = req.params.idEmpleado

    const consulta = "delete from Empleados where idEmpleado=?"

    conection.query(consulta, [idEmpleado],(err,results)=>{
        if (err) {
            console.error('Error al obtener el empleado:', err);
            return res.status(500).json({ error: 'Error al actualizar el empleado' });
        }
        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    })
}

module.exports = {getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado, actualizarLogueado, desloguearEmpleado} 