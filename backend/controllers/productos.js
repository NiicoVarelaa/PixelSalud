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

const getProductoBajado = (req, res)=>{
  const consulta = "select * from productos where activo = false"
  conection.query(consulta, (error, result)=>{
    if (error) {
       console.error("Error al obtener productos dados de baja:", error);
      return res.status(500).json({ error: "Error al obtener productos dados de baja" });
    }
    res.json(result);
  })
}

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

const darBajaProducto = (req, res) => {
  const id = req.params.id;
  const consulta = "update productos set activo = false where idProducto=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al eliminar/dar de baja al producto:", err);
      return res
        .status(500)
        .json({ error: "Error al eliminar/dar de baja al producto" });
    }
    res
      .status(201)
      .json({ message: "Productos dado de baja/eliminado con exito" });
  });
};

const activarProducto = (req, res) => {
  const id = req.params.id;
  const consulta = "update productos set activo = true where idProducto=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al activar de baja al producto:", err);
      return res
        .status(500)
        .json({ error: "Error al activar de baja al producto" });
    }
    res
      .status(201)
      .json({ message: "Productos activado con exito" });
  });
};

module.exports = {
  getProductos,
  getProducto,
  getProductoBajado,
  createProducto,
  updateProducto,
  darBajaProducto,
  activarProducto
};
