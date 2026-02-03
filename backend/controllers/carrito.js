const { conection } = require("../config/database");

const getCarrito = (req, res) => {
  const idCliente = req.params.idCliente;
  const consulta = `
    SELECT 
      c.idCarrito, 
      c.cantidad, 
      p.idProducto, 
      p.nombreProducto, 
      p.precio AS precioRegular,
      p.img,
      p.stock,
      o.porcentajeDescuento,
      CASE
          WHEN o.idOferta IS NOT NULL 
          THEN p.precio * (1 - o.porcentajeDescuento / 100)
          ELSE p.precio
      END AS precioFinal, 
      CASE
          WHEN o.idOferta IS NOT NULL 
          THEN TRUE
          ELSE FALSE
      END AS enOferta
      
    FROM Carrito c
    JOIN Productos p ON c.idProducto = p.idProducto
    LEFT JOIN 
        ofertas o ON p.idProducto = o.idProducto
        AND o.esActiva = 1 
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    WHERE c.idCliente = ?`;

  conection.query(consulta, [idCliente], (err, results) => {
    if (err) {
      console.error("Error al obtener el carrito:", err);
      return res.status(500).json({ error: "Error al obtener el carrito del cliente." });
    }
    res.status(200).json(results);
  });
};

const addCarrito = (req, res) => {
  const { idProducto, idCliente, cantidad } = req.body;
  const cantidadAgregar = Number(cantidad) > 0 ? Number(cantidad) : 1;

  const checkQuery = "SELECT * FROM Carrito WHERE idProducto = ? AND idCliente = ?";
  
  conection.query(checkQuery, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al verificar el carrito:", err);
      return res.status(500).json({ error: "Error al agregar el producto." });
    }

    if (results.length > 0) {
      const updateQuery = "UPDATE Carrito SET cantidad = cantidad + ? WHERE idProducto = ? AND idCliente = ?";
      conection.query(updateQuery, [cantidadAgregar, idProducto, idCliente], (err, updateResult) => {
        if (err) {
          console.error("Error al incrementar la cantidad:", err);
          return res.status(500).json({ error: "Error al actualizar el producto en el carrito." });
        }
        res.status(200).json({ message: "Cantidad del producto actualizada en el carrito." });
      });
    } else {
      const insertQuery = "INSERT INTO Carrito (idProducto, idCliente, cantidad) VALUES (?, ?, ?)";
      conection.query(insertQuery, [idProducto, idCliente, cantidadAgregar], (err, insertResult) => {
        if (err) {
          console.error("Error al agregar el producto al carrito:", err);
          return res.status(500).json({ error: "Error al agregar el nuevo producto al carrito." });
        }
        res.status(201).json({ message: "Producto agregado correctamente al carrito.", idCarrito: insertResult.insertId });
      });
    }
  });
};

const deleteProductoDelCarrito = (req, res) => {
  const { idProducto, idCliente } = req.params;
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