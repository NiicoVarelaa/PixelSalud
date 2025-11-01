const { conection } = require("../config/database");


const crearPermisosEmp = (req, res)=>{
    const id = req.params.id
    const consulta = "insert into permisos (crear_productos, modificar_productos, modiciar_ventasE, modificar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO, idEmppleado) values(?,?,?,?,?,?,)"
}