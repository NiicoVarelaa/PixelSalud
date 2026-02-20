const productosService = require("../services/ProductosService");

const getProductos = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const getProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const producto = await productosService.obtenerProductoPorId(idProducto);
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

const getProductoBajado = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductosInactivos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const buscarProductos = async (req, res, next) => {
  try {
    const { term } = req.query;
    const productos = await productosService.buscarProductos(term);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const createProducto = async (req, res, next) => {
  try {
    const producto = await productosService.crearProducto(req.body);
    res.status(201).json({
      message: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
};

const updateProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const producto = await productosService.actualizarProducto(
      idProducto,
      req.body,
    );
    res.status(200).json({
      message: "Producto actualizado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductoActivo = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { activo } = req.body;
    await productosService.actualizarEstadoActivo(idProducto, activo);
    res.status(200).json({
      message: `Producto ${activo ? "activado" : "desactivado"} correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    await productosService.darBajaProducto(idProducto);
    res.status(200).json({
      message: "Producto dado de baja correctamente",
    });
  } catch (error) {
    next(error);
  }
};

const activarProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    await productosService.activarProducto(idProducto);
    res.status(200).json({
      message: "Producto activado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductos,
  getProductoBajado,
  getProducto,
  buscarProductos,
  createProducto,
  updateProducto,
  updateProductoActivo,
  deleteProducto,
  activarProducto,
};
