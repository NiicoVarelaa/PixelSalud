const { conection } = require("../config/database");
const { enviarConfirmacionCliente } = require("../helps/envioMail");

const crearMensaje = (req, res) => {
    const { idCliente, nombre, email, asunto, mensaje, fechaEnvio } = req.body;
    if (!idCliente || !nombre || !email || !mensaje) {
        return res.status(400).json({ error: "Faltan datos obligatorios (idCliente, nombre, email, mensaje)." });
    }
    if (typeof mensaje !== 'string' || mensaje.trim().length < 10 || mensaje.trim().length > 1000) {
        return res.status(400).json({ error: "El mensaje debe tener entre 10 y 1000 caracteres." });
    }
    // Si no se envía fechaEnvio, se usará el default de la base de datos
    const insertQuery = fechaEnvio
        ? `INSERT INTO MensajesClientes (idCliente, nombre, email, asunto, mensaje, fechaEnvio, estado) VALUES (?, ?, ?, ?, ?, ?, 'nuevo')`
        : `INSERT INTO MensajesClientes (idCliente, nombre, email, asunto, mensaje, estado) VALUES (?, ?, ?, ?, ?, 'nuevo')`;
    const params = fechaEnvio
        ? [idCliente, nombre, email, asunto || 'Sin Asunto', mensaje, fechaEnvio]
        : [idCliente, nombre, email, asunto || 'Sin Asunto', mensaje];
    conection.query(insertQuery, params, async (err, result) => {
        if (err) {
            console.error("Error al guardar el mensaje:", err);
            return res.status(500).json({ error: "Error interno al guardar el mensaje." });
        }
        // Enviar email de confirmación (no bloquear respuesta si falla)
        enviarConfirmacionCliente(email, nombre, asunto || 'Sin Asunto')
          .catch(e => console.error('Error enviando email de confirmación:', e));
        res.status(201).json({ message: "Mensaje recibido correctamente.", newId: result.insertId });
    });
};

const listarMensajes = (req, res) => {
    conection.query('SELECT * FROM MensajesClientes ORDER BY fechaEnvio DESC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los mensajes.' });
        }
        res.json(results);
    });
};

module.exports = {
    crearMensaje,
    listarMensajes
};