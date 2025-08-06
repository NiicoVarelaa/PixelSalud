const { conection } = require("../config/database");

const getProductos = (req, res) => {
  const consulta = "SELECT * FROM Productos";

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }
    res.json(results);
  });
};

const getProducto = (req, res) => {
  const id = req.params.idProducto;
  const consulta = "SELECT * FROM Productos WHERE idProducto = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al obtener el producto" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(results[0]);
  });
};

const createProducto = (req, res) => {
  const { nombreProducto, descripcion, precio, img, categoria, stock } =
    req.body;
  const consulta = `
        INSERT INTO Productos (nombreProducto, descripcion, precio, img, categoria, stock) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  conection.query(
    consulta,
    [nombreProducto, descripcion, precio, img, categoria, stock],
    (err, results) => {
      if (err) {
        console.error("Error al crear el producto:", err);
        return res.status(500).json({ error: "Error al crear el producto" });
      }
      res.status(201).json({ message: "Producto creado correctamente" });
    }
  );
};

const updateProducto = (req, res) => {
  const id = req.params.idProducto;
  const { nombreProducto, descripcion, precio, img, categoria, stock } =
    req.body;

  const consulta = `
        UPDATE Productos 
        SET nombreProducto = ?, descripcion = ?, precio = ?, img = ?, categoria = ?, stock=?
        WHERE idProducto = ?
    `;

  conection.query(
    consulta,
    [nombreProducto, descripcion, precio, img, categoria, stock, id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el producto:", err);
        return res
          .status(500)
          .json({ error: "Error al actulizar el producto" });
      }
      res.status(200).json({ message: "Producto actualizado correctamente" });
    }
  );
};

const deleteProducto = (req, res) => {
  const id = req.params.idProducto;
  const consulta = "DELETE FROM Productos WHERE idProducto = ?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al actualizar el producto" });
    }
    res.status(200).json({ message: "Producto eliminado correctamente" });
  });
};

module.exports = {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
};
