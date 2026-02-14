const productosService = require("../services/ProductosService");

// ==========================================
// CONTROLADORES DE PRODUCTOS
// ==========================================

/**
 * Obtiene todos los productos con información de ofertas
 */
const getProductos = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un producto por ID con información de ofertas
 */
const getProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const producto = await productosService.obtenerProductoPorId(idProducto);
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene productos inactivos (dados de baja)
 */
const getProductoBajado = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductosInactivos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

/**
 * Busca productos por término de búsqueda
 */
const buscarProductos = async (req, res, next) => {
  try {
    const { term } = req.query;
    const productos = await productosService.buscarProductos(term);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo producto
 */
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

/**
 * Actualiza un producto existente
 */
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

/**
 * Actualiza solo el estado activo de un producto
 */
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

/**
 * Da de baja un producto (activo = false)
 */
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

/**
 * Activa un producto (activo = true)
 */
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

// ==========================================
// EXPORTACIONES
// ==========================================

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
