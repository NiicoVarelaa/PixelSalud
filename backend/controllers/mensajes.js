const { conection } = require("../config/database");

const crearMensaje = (req, res) => {
    const { idCliente, asunto, mensaje } = req.body;

    if (!idCliente || !mensaje) {
        return res.status(400).json({ error: "Faltan datos. El ID del cliente y el mensaje son obligatorios." });
    }

    const consulta = `
        INSERT INTO MensajesClientes (idCliente, asunto, mensaje) 
        VALUES (?, ?, ?)
    `;

    conection.query(consulta, [idCliente, asunto || 'Sin Asunto', mensaje], (err, result) => {
        if (err) {
            console.error("Error al guardar el mensaje:", err);
            return res.status(500).json({ error: "Error interno al guardar el mensaje." });
        }
        res.status(201).json({ message: "Mensaje recibido correctamente.", newId: result.insertId });
    });
};

module.exports = {
    crearMensaje
};