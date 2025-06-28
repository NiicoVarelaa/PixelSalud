const { conection } = require("../config/database")

const getEmpleados = (req, res) => {
    const consulta = "select * from Empleados"

    conection.query(consulta, (err, results) =>{
        if(err) throw err
        res.json(results)
    })
}

const createEmpleado = (req, res) =>{
    const {nombreEmpleado, email, contraEmpleado, rolEmpleado} = req.body

    const consulta = "insert into empleados (nombreEmpleado, email, contraEmpleado, rolEmpleado) values (?,?,?,?);"

    conection.query(consulta,[nombreEmpleado,email,contraEmpleado,rolEmpleado],(err,result)=>{
        if (err) {
            console.error('Error al crear el empleado:', err);
            return res.status(500).json({ error: 'Error al crear el empleado' });
        }
        res.status(201).json({ message: 'Empleado creado correctamente'});
    })

}

const updateEmpleado = (req, res) => {
    
    const nombreEmpleado = req.body.nombreEmpleado
    const email = req.body.email
    const contraEmpleado = req.body.contraEmpleado
    const rolEmpleado = req.body.relEmpleado
    const {id} = req.params

    const consulta = "update empleados set nombreEmpleado=?, email=?, contraEmpleado=?, rolEmpleado=? where idEmpleado=?"

    conection.query(consulta, [nombreEmpleado, email, contraEmpleado, rolEmpleado, id], (err,results)=>{
        if (err) {
            console.error('Error al obtener el empleado:', err);
            return res.status(500).json({ error: 'Error al actulizar el empleado' });
        }
        res.status(200).json({ message: 'Empleado actualizado correctamente' });
    })

}

const deleteEmpleado = (req, res) => {
    const {id} = req.params

    const consulta = "delete from Empleados where idEmpleado=?"

    conection.query(consulta, [id],(err,results)=>{
        if (err) {
            console.error('Error al obtener el empleado:', err);
            return res.status(500).json({ error: 'Error al actualizar el empleado' });
        }
        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    })
}

module.exports = {getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado} 