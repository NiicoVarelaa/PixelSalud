const { conection } = require("../config/database")

// 1. Obtener SOLO las recetas del médico logueado
const getMisRecetas = (req, res) => {
    const { idMedico } = req.params; // Lo recibiremos desde el frontend (sacado del token)

    const consulta = `
      SELECT r.idReceta, r.dniCliente, r.cantidad, r.usada, r.fechaEmision,
             c.nombreCliente, c.apellidoCliente,
             p.nombreProducto, r.activo
      FROM Recetas r
      JOIN Clientes c ON r.dniCliente = c.dni
      JOIN Productos p ON r.idProducto = p.idProducto
      WHERE r.idMedico = ? 
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
// En controllers/recetas.js

const crearReceta = (req, res) => {
    // Ahora esperamos 'productos' que es un array: [{idProducto, cantidad}, ...]
    const { dniCliente, idMedico, productos } = req.body;

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: "No hay productos en la receta" });
    }

    // Preparamos los valores para insertar MULTIPLES filas de una
    // Cada fila es una receta independiente
    const valores = productos.map(prod => [
        dniCliente, 
        idMedico, 
        prod.idProducto, 
        prod.cantidad, 
        new Date() // fechaEmision
    ]);

    const consulta = `
      INSERT INTO Recetas (dniCliente, idMedico, idProducto, cantidad, fechaEmision)
      VALUES ?
    `;

    conection.query(consulta, [valores], (err, results) => {
        if(err){
            console.error("Error:", err);
            // Error de clave foránea (paciente no existe)
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                 return res.status(400).json({ error: "El DNI del paciente no es válido." });
            }
            return res.status(500).json({ error: "Error al crear las recetas" });
        }
        res.status(201).json({ 
            message: "Recetas emitidas exitosamente", 
            cantidad: results.affectedRows 
        });
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