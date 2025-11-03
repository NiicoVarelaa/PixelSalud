const { conection } = require("../config/database");

// --- OBTENER EL CARRITO COMPLETO DE UN CLIENTE ---
// Se ha mejorado para que devuelva toda la información del producto, no solo los IDs.
const getCarrito = (req, res) => {
  const idCliente = req.params.idCliente;
  const consulta = `
    SELECT 
      c.idCarrito, 
      c.cantidad, 
      p.idProducto, 
      p.nombreProducto, 
      p.precio, 
      p.img,
      p.stock
    FROM Carrito c
    JOIN Productos p ON c.idProducto = p.idProducto
    WHERE c.idCliente = ?`;

  conection.query(consulta, [idCliente], (err, results) => {
    if (err) {
      console.error("Error al obtener el carrito:", err);
      return res.status(500).json({ error: "Error al obtener el carrito del cliente." });
    }
    // Devuelve un array con los productos del carrito
    res.status(200).json(results);
  });
};


// --- AÑADIR PRODUCTO AL CARRITO (O INCREMENTAR CANTIDAD) ---
// Lógica mejorada: Si el producto ya existe, aumenta la cantidad. Si no, lo inserta.
const addCarrito = (req, res) => {
  const { idProducto, idCliente } = req.body;

  // 1. Primero, verificamos si el producto ya está en el carrito de ese cliente.
  const checkQuery = "SELECT * FROM Carrito WHERE idProducto = ? AND idCliente = ?";
  
  conection.query(checkQuery, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al verificar el carrito:", err);
      return res.status(500).json({ error: "Error al agregar el producto." });
    }

    if (results.length > 0) {
      // 2. Si ya existe, actualizamos la cantidad (incrementamos en 1).
      const updateQuery = "UPDATE Carrito SET cantidad = cantidad + 1 WHERE idProducto = ? AND idCliente = ?";
      conection.query(updateQuery, [idProducto, idCliente], (err, updateResult) => {
        if (err) {
          console.error("Error al incrementar la cantidad:", err);
          return res.status(500).json({ error: "Error al actualizar el producto en el carrito." });
        }
        res.status(200).json({ message: "Cantidad del producto actualizada en el carrito." });
      });
    } else {
      // 3. Si no existe, lo insertamos con cantidad inicial de 1.
      const insertQuery = "INSERT INTO Carrito (idProducto, idCliente, cantidad) VALUES (?, ?, 1)";
      conection.query(insertQuery, [idProducto, idCliente], (err, insertResult) => {
        if (err) {
          console.error("Error al agregar el producto al carrito:", err);
          return res.status(500).json({ error: "Error al agregar el nuevo producto al carrito." });
        }
        res.status(201).json({ message: "Producto agregado correctamente al carrito.", idCarrito: insertResult.insertId });
      });
    }
  });
};


// --- ELIMINAR UN PRODUCTO ESPECÍFICO DEL CARRITO ---
// Se ha corregido para que requiera también el idCliente y sea más seguro.
const deleteProductoDelCarrito = (req, res) => {
  const { idProducto, idCliente } = req.params; // Se obtienen de los parámetros de la URL
  const consulta = "DELETE FROM Carrito WHERE idProducto = ? AND idCliente = ?";

  conection.query(consulta, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al eliminar el producto del carrito:", err);
      return res.status(500).json({ error: "Error al eliminar el producto del carrito." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito de este cliente." });
    }
    res.status(200).json({ message: "Producto eliminado correctamente del carrito." });
  });
};


// --- VACIAR TODO EL CARRITO DE UN CLIENTE ---
const vaciarCarrito = (req, res) => {
  const idCliente = req.params.idCliente;
  const consulta = "DELETE FROM Carrito WHERE idCliente = ?";

  conection.query(consulta, [idCliente], (err, results) => {
    if (err) {
      console.error("Error al vaciar el carrito:", err);
      return res.status(500).json({ error: "Error al vaciar el carrito." });
    }
    res.status(200).json({ message: "Carrito vaciado correctamente." });
  });
};


// --- INCREMENTAR LA CANTIDAD DE UN PRODUCTO ---
const incrementCarrito = (req, res) => {
  const { idProducto, idCliente } = req.body; 
  const consulta = `
    UPDATE Carrito 
    SET cantidad = cantidad + 1 
    WHERE idProducto = ? AND idCliente = ?
  `;

  conection.query(consulta, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al incrementar la cantidad:", err);
      return res.status(500).json({ error: "Error al incrementar la cantidad." });
    }
    res.status(200).json({ message: "Cantidad aumentada correctamente." });
  });
};


// --- DECREMENTAR LA CANTIDAD DE UN PRODUCTO ---
const decrementCarrito = (req, res) => {
  const { idProducto, idCliente } = req.body;
  const consulta = `
    UPDATE Carrito 
    SET cantidad = GREATEST(1, cantidad - 1)
    WHERE idProducto = ? AND idCliente = ?
  `;

  conection.query(consulta, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al decrementar la cantidad:", err);
      return res.status(500).json({ error: "Error al decrementar la cantidad." });
    }
    res.status(200).json({ message: "Cantidad disminuida correctamente." });
  });
};


module.exports = {
  getCarrito,
  addCarrito,
  deleteProductoDelCarrito,
  vaciarCarrito,
  incrementCarrito,
  decrementCarrito,
};