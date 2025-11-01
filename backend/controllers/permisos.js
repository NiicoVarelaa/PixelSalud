const { conection } = require("../config/database");


const crearPermisosEmp = (req, res)=>{
    const idEmpleado = req.params.id
    const {crear_productos, modificar_productos, modificar_ventasE, modifcar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO} = req.body
    const consulta = "insert into permisos (crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO, idEmpleado, idAdmin) values(?,?,?,?,?,?,?, NULL)"

    conection.query(consulta,[crear_productos, modificar_productos, modificar_ventasE, modifcar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO, idEmpleado], (error, result)=>{
        if (error) {
          console.error("Error al dar permisos al empleado:", error);
          return res.status(500).json({ error: "Error al dar permisos al empleado" });
        }
        res.status(201).json({ message: "Permisos concedidos correctamente" });
    })
}


const updatePermisosEmp = (req, res)=>{
    const idEmpleado = req.params.id
    const {crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO} = req.body
    const consulta = "update permisos set crear_productos=?, modificar_productos=?, modificar_ventasE=?, modifcar_ventasO=?, ver_ventasTotalesE=?, ver_ventasTotalesO=?, idAdmin=NULL where idEmpleado =?"

    conection.query(consulta,[crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO, idEmpleado], (error, result)=>{
        if (error) {
        console.error("Error al actualizar permisos al empleado:", error);
        return res
          .status(500)
          .json({ error: "Error al actualizar permisos al empleado" });
      }
      res.status(200).json({msg:"Permisos actualizados con exito", result});
    })
}

module.exports ={
    crearPermisosEmp,
    updatePermisosEmp
}