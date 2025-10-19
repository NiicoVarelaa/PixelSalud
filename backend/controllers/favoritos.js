// controllers/favoritos.js
const { conection } = require("../config/database");

// ===========================================
// FUNCIÓN 1: AGREGAR O ELIMINAR UN PRODUCTO A/DE FAVORITOS (Toggle)
// ===========================================
const toggleFavorito = (req, res) => {
    const { idCliente, idProducto } = req.body;

    if (!idCliente || !idProducto) {
        return res.status(400).json({
            message: "Faltan datos: ID de Cliente (idCliente) y ID de Producto (idProducto) son requeridos."
        });
    }

    // 1. Verificar si el producto ya está en favoritos
    const checkQuery = 'SELECT idFavorito FROM Favoritos WHERE idCliente = ? AND idProducto = ?';
    conection.query(checkQuery, [idCliente, idProducto], (err, rows) => {
        if (err) {
            console.error("Error al verificar favorito:", err);
            return res.status(500).json({ message: 'Error al verificar favorito.' });
        }

        if (rows.length > 0) {
            // Ya existe → eliminar
            const idFavorito = rows[0].idFavorito;
            const deleteQuery = 'DELETE FROM Favoritos WHERE idFavorito = ?';
            conection.query(deleteQuery, [idFavorito], (err2) => {
                if (err2) {
                    console.error("Error al eliminar favorito:", err2);
                    return res.status(500).json({ message: 'Error al eliminar favorito.' });
                }
                return res.status(200).json({
                    message: 'Producto eliminado de favoritos.',
                    isFavorite: false
                });
            });

        } else {
            // No existe → insertar
            const insertQuery = 'INSERT INTO Favoritos (idCliente, idProducto) VALUES (?, ?)';
            conection.query(insertQuery, [idCliente, idProducto], (err3, result) => {
                if (err3) {
                    console.error("Error al agregar favorito:", err3);
                    return res.status(500).json({ message: 'Error al agregar favorito.' });
                }
                return res.status(201).json({
                    message: 'Producto agregado a favoritos.',
                    isFavorite: true,
                    insertId: result.insertId
                });
            });
        }
    });
};

// ===========================================
// FUNCIÓN 2: OBTENER TODOS LOS PRODUCTOS FAVORITOS DE UN CLIENTE
// ===========================================
const obtenerFavoritosPorCliente = (req, res) => {
    const { idCliente } = req.params;

    const query = `
        SELECT 
            f.idFavorito,
            p.idProducto, 
            p.nombreProducto, 
            p.precio, 
            p.img,
            p.stock,
            p.categoria, 
            f.fechaAgregado
        FROM 
            Favoritos f
        JOIN 
            Productos p ON f.idProducto = p.idProducto
        WHERE 
            f.idCliente = ?
        ORDER BY 
            f.fechaAgregado DESC;
    `;

    conection.query(query, [idCliente], (err, favoritos) => {
        if (err) {
            console.error("Error al obtener favoritos:", err);
            return res.status(500).json({ message: 'Error al obtener favoritos.' });
        }
        
        // Se devuelve siempre un array, incluso si está vacío.
        return res.status(200).json(favoritos);
    });
};

module.exports = {
    toggleFavorito,
    obtenerFavoritosPorCliente
};