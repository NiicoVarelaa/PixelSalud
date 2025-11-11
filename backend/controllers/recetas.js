const { conection } = require("../config/database")

const getRecetas = (req, res) => {

    const consulta = `
      SELECT r.idReceta, r.dniCliente, r.cantidad, r.usada, r.fechaEmision,
             c.nombreCliente, c.apellidoCliente,
             m.nombreMedico, m.apellidoMedico,
             p.nombreProducto
      FROM Recetas r
      JOIN Clientes c ON r.dniCliente = c.dni
      JOIN Medicos m ON r.idMedico = m.idMedico
      JOIN Productos p ON r.idProducto = p.idProducto
      WHERE r.activo = true
      ORDER BY r.idReceta DESC
    `
    conection.query(consulta, (err, results) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).json({ error: "Error al obtener productos" });
        }
        res.json(results);
    });
}

const recetaUsada = (req, res) => {
    const { id } = req.params

    const consulta = `UPDATE Recetas SET usada = true WHERE idReceta = ?`

    conection.query(consulta, (err, results) => {
        if (err) {
            console.error("error al actualizar la receta")
            return res.status(500).json({ error: "Error al actualizar la receta" });
        }
        res.status(200).json({ message: "Receta dada de baja" });
    })
}

const crearReceta = (req, res) => {
    const { dniCliente, idMedico, idProducto, cantidad } = req.body;

    const consulta = `
      INSERT INTO Recetas (dniCliente, idMedico, idProducto, cantidad)
      VALUES (?, ?, ?, ?)
    `;

    conection.query(consulta, [dniCliente, idMedico, idProducto, cantidad], (err,results) => {
        if(err){
            console.error("error al crear la receta")
            return res.status(500).json({ error: "error al crear la receta"})
        }
        res.status(200).json({message:"receta creada"})
    })
}

const darBajaReceta = (req,res) => {
    const {id} = req.params

    const consulta = `UPDATE Recetas SET activo = false WHERE idReceta = ?`

    conection.query(consulta,(err,result)=> {
         if(err){
            console.error("error al crear la receta")
            return res.status(500).json({ error: "error al crear la receta"})
        }
        res.status(200).json({message:"receta creada"})
    })
}

