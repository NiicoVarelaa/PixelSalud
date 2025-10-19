const { conection } = require("../config/database");
const bcrypt = require('bcrypt'); // Importamos bcrypt para hashear contraseñas

// --- OBTENER TODOS LOS EMPLEADOS (DE FORMA SEGURA) ---
const getEmpleados = (req, res) => {
    // Se seleccionan todos los campos EXCEPTO la contraseña por seguridad.
    const consulta = `
        SELECT 
            idEmpleado, nombreEmpleado, apellidoEmpleado, emailEmpleado, 
            fecha_registro, hora_registro, rol, activo, 
            crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO 
        FROM Empleados
    `;

    conection.query(consulta, (err, results) => {
        if (err) {
            console.error('Error al obtener empleados:', err);
            return res.status(500).json({ error: 'Error al obtener los empleados.' });
        }
        res.status(200).json(results);
    });
};

// --- CREAR UN NUEVO EMPLEADO (CON CONTRASEÑA HASHEADA) ---
const createEmpleado = async (req, res) => {
    // Se incluyen todos los campos de la nueva tabla
    const {
        nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado, rol,
        crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO
    } = req.body;

    if (!nombreEmpleado || !apellidoEmpleado || !emailEmpleado || !contraEmpleado) {
        return res.status(400).json({ error: 'Los campos nombre, apellido, email y contraseña son obligatorios.' });
    }

    try {
        // Hasheamos la contraseña antes de guardarla
        const saltRounds = 10;
        const contraHasheada = await bcrypt.hash(contraEmpleado, saltRounds);

        const consulta = `
            INSERT INTO Empleados 
            (nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado, rol, crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        conection.query(
            consulta,
            [nombreEmpleado, apellidoEmpleado, emailEmpleado, contraHasheada, rol || 'empleado', crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO],
            (err, result) => {
                if (err) {
                    console.error('Error al crear el empleado:', err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
                    }
                    return res.status(500).json({ error: 'Error al crear el empleado.' });
                }
                res.status(201).json({ message: 'Empleado creado correctamente', newId: result.insertId });
            }
        );
    } catch (hashError) {
        console.error("Error al hashear la contraseña:", hashError);
        return res.status(500).json({ error: "Error interno al procesar la contraseña." });
    }
};

// --- ACTUALIZAR UN EMPLEADO ---
const updateEmpleado = async (req, res) => {
    const idEmpleado = req.params.idEmpleado;
    const {
        nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado, rol, activo,
        crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO
    } = req.body;

    let contraHasheada;
    if (contraEmpleado) {
        // Solo hasheamos y actualizamos la contraseña si se proporciona una nueva
        const saltRounds = 10;
        contraHasheada = await bcrypt.hash(contraEmpleado, saltRounds);
    }

    // Se construye la consulta dinámicamente para actualizar solo los campos necesarios
    const fields = {
        nombreEmpleado, apellidoEmpleado, emailEmpleado, 
        ...(contraHasheada && { contraEmpleado: contraHasheada }), // Añade la contraseña solo si se cambió
        rol, activo, crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO
    };
    
    const consulta = "UPDATE Empleados SET ? WHERE idEmpleado = ?";

    conection.query(consulta, [fields, idEmpleado], (err, results) => {
        if (err) {
            console.error('Error al actualizar el empleado:', err);
            return res.status(500).json({ error: 'Error al actualizar el empleado.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }
        res.status(200).json({ message: 'Empleado actualizado correctamente.' });
    });
};

// --- ELIMINAR UN EMPLEADO ---
const deleteEmpleado = (req, res) => {
    const idEmpleado = req.params.idEmpleado;
    const consulta = "DELETE FROM Empleados WHERE idEmpleado = ?";

    conection.query(consulta, [idEmpleado], (err, results) => {
        if (err) {
            console.error('Error al eliminar el empleado:', err);
            return res.status(500).json({ error: 'Error al eliminar el empleado.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }
        res.status(200).json({ message: 'Empleado eliminado correctamente.' });
    });
};

// Se eliminan las funciones 'actualizarLogueado' y 'desloguearEmpleado' por ser obsoletas.

module.exports = {
    getEmpleados,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado
};