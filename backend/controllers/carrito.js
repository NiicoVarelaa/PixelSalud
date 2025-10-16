const { conection } = require("../config/database");

const getCarrito = (req, res) => {
  const id = req.params.idCliente;
  const consulta = "select * from carrito where idCliente =?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al obtener el producto" });
    }

    res.json(results);
  });
};

const deleteCarrito = (req, res) => {
  const id = req.params.idProducto;
  const consulta = "delete from carrito where idProducto =?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al obtener el producto" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Productos no encontrados" });
    }
    res.json(results);
  });
};

const vaciarCarrito = (req, res) => {
  const id = req.params.idCliente;
  const consulta = "delete from carrito where idCliente=?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al vaciar el carrito:", err);
      return res.status(500).json({ error: "Error al vaciar el carrito" });
    }
    return res
      .status(201)
      .json({ message: "Productos eliminado correctamente" });
  });
};
const incrementCarrito = (req, res) => {
  const { idProducto, idCliente } = req.body; 

  const consulta = `
    UPDATE carrito 
    SET cantidad = cantidad + 1 
    WHERE idProducto = ? AND idCliente = ?
  `;

  conection.query(consulta, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al querer aumentar la cantidad", err);
      return res.status(500).json({ error: "Error al querer aumentar la cantidad del producto en el carrito" });
    }
    res.status(201).json({ message: "Se aumentó correctamente la cantidad del producto en el carrito" });
  });
};

const decrementCarrito = (req, res) => {
  const { idProducto, idCliente } = req.body;

  const consulta = `
    UPDATE carrito 
    SET cantidad = cantidad - 1 
    WHERE idProducto = ? AND idCliente = ? AND cantidad > 1
  `;

  conection.query(consulta, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al querer disminuir la cantidad", err);
      return res.status(500).json({ error: "Error al querer disminuir la cantidad del producto en el carrito" });
    }
    res.status(201).json({ message: "Se disminuyó correctamente la cantidad del producto en el carrito" });
  });
};


const addCarrito = (req, res) => {
  const { idProducto, idCliente } = req.body;
  const consulta = "insert into Carrito (idProducto,idCliente) values (?,?)";

  conection.query(consulta, [idProducto, idCliente], (err, results) => {
    if (err) {
      console.error("Error al agregar el producto al carrito", err);
      return res
        .status(500)
        .json({ error: "Error al agregar el producto al carrito" });
    }
    res
      .status(201)
      .json({ message: "Producto agregado correctamente al carrito" });
  });
};

module.exports = {
  addCarrito,
  getCarrito,
  deleteCarrito,
  incrementCarrito,
  decrementCarrito,
  vaciarCarrito,
};
