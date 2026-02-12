const carritoService = require("../services/CarritoService");

const getCarrito = async (req, res, next) => {
  try {
    const { idCliente } = req.params;
    const items = await carritoService.obtenerCarrito(idCliente);
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const addCarrito = async (req, res, next) => {
  try {
    const { idCliente, idProducto, cantidad } = req.body;
    const resultado = await carritoService.agregarProducto(
      idCliente,
      idProducto,
      cantidad,
    );

    const statusCode = resultado.accion === "creado" ? 201 : 200;
    res.status(statusCode).json(resultado);
  } catch (error) {
    next(error);
  }
};

const incrementCarrito = async (req, res, next) => {
  try {
    const { idCliente, idProducto } = req.body;
    const resultado = await carritoService.incrementarCantidad(
      idCliente,
      idProducto,
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const decrementCarrito = async (req, res, next) => {
  try {
    const { idCliente, idProducto } = req.body;
    const resultado = await carritoService.decrementarCantidad(
      idCliente,
      idProducto,
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const deleteProductoDelCarrito = async (req, res, next) => {
  try {
    const { idCliente, idProducto } = req.params;
    const resultado = await carritoService.eliminarProducto(
      idCliente,
      idProducto,
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const vaciarCarrito = async (req, res, next) => {
  try {
    const { idCliente } = req.params;
    const resultado = await carritoService.vaciarCarrito(idCliente);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCarrito,
  addCarrito,
  deleteProductoDelCarrito,
  vaciarCarrito,
  incrementCarrito,
  decrementCarrito,
};
