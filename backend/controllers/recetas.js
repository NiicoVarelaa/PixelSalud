const { conection } = require("../config/database")

// 1. Obtener SOLO las recetas del médico logueado
const getMisRecetas = (req, res) => {
    const { idMedico } = req.params; // Lo recibiremos desde el frontend (sacado del token)

    const consulta = `
      SELECT r.idReceta, r.dniCliente, r.cantidad, r.usada, r.fechaEmision,
             c.nombreCliente, c.apellidoCliente,
             p.nombreProducto
      FROM Recetas r
      JOIN Clientes c ON r.dniCliente = c.dni
      JOIN Productos p ON r.idProducto = p.idProducto
      WHERE r.idMedico = ? AND r.activo = true
      ORDER BY r.idReceta DESC
    `;

    conection.query(consulta, [idMedico], (err, results) => {
        if (err) {
            console.error("Error al obtener mis recetas:", err);
            return res.status(500).json({ error: "Error del servidor" });
        }
        res.json(results);
    });
}

// 2. Crear Receta (Igual, pero asegurate que los datos lleguen bien)
const crearReceta = (req, res) => {
    const { dniCliente, idMedico, idProducto, cantidad } = req.body;

    const consulta = `
      INSERT INTO Recetas (dniCliente, idMedico, idProducto, cantidad, fechaEmision)
      VALUES (?, ?, ?, ?, CURDATE()) 
    `;
    // Agregué CURDATE() explícito por si acaso, aunque tu tabla ya tiene default.

    conection.query(consulta, [dniCliente, idMedico, idProducto, cantidad], (err, results) => {
        if(err){
            console.error("Error al crear receta:", err.sqlMessage);
            // Si el error es por clave foránea (DNI no existe)
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: "El DNI del paciente no existe en el sistema." });
            }
            return res.status(500).json({ error: "Error al crear la receta" });
        }
        res.status(201).json({ message: "Receta creada exitosamente", idReceta: results.insertId })
    })
}

// 3. Dar de baja (Corregido el mensaje de error)
const darBajaReceta = (req,res) => {
    const {id} = req.params

    const consulta = `UPDATE Recetas SET activo = false WHERE idReceta = ?`

    conection.query(consulta, [id], (err, result)=> { // Faltaba poner [id] en el array
         if(err){
            console.error("Error al borrar receta:", err);
            return res.status(500).json({ error: "Error al eliminar la receta"})
        }
        res.status(200).json({message:"Receta eliminada correctamente"})
    })
}

// (Los otros controladores como recetaUsada podés dejarlos, aunque 'recetaUsada' 
// generalmente lo usa el Farmacéutico cuando vende, no el Médico).

module.exports = {
    getMisRecetas,
    crearReceta,
    darBajaReceta,
    // getRecetas // Este dejalo solo para el Admin si querés
}