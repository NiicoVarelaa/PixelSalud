const productosRepository = require("../repositories/ProductosRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
} = require("../errors");

const obtenerProductos = async () => {
  return await productosRepository.findAllWithOfertas();
};

const obtenerProductoPorId = async (idProducto) => {
  const producto = await productosRepository.findByIdWithOfertas(idProducto);

  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  return producto;
};

const obtenerProductosInactivos = async () => {
  const productos = await productosRepository.findInactivos();

  if (productos.length === 0) {
    throw createNotFoundError("No hay productos dados de baja");
  }

  return productos;
};

const buscarProductos = async (term) => {
  if (!term || term.length < 3) {
    throw createValidationError(
      "El término de búsqueda debe tener al menos 3 caracteres",
    );
  }

  return await productosRepository.searchByName(term);
};

const crearProducto = async (data) => {
  if (data.precio < 0) {
    throw createValidationError("El precio no puede ser negativo");
  }

  if (data.stock < 0) {
    throw createValidationError("El stock no puede ser negativo");
  }

  const existe = await productosRepository.exists({
    nombreProducto: data.nombreProducto,
  });

  if (existe) {
    throw createConflictError("Ya existe un producto con ese nombre");
  }

  const productoData = {
    ...data,
    activo: true,
  };

  const idProducto = await productosRepository.create(productoData);
  return await productosRepository.findByIdWithOfertas(idProducto);
};

const actualizarProducto = async (idProducto, data) => {
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw createNotFoundError("Producto no encontrado");
  }

  if (data.precio !== undefined && data.precio < 0) {
    throw createValidationError("El precio no puede ser negativo");
  }

  if (data.stock !== undefined && data.stock < 0) {
    throw createValidationError("El stock no puede ser negativo");
  }

  const actualizado = await productosRepository.update(idProducto, data);

  if (!actualizado) {
    throw new Error("Error al actualizar el producto");
  }

  return await productosRepository.findByIdWithOfertas(idProducto);
};

const actualizarEstadoActivo = async (idProducto, activo) => {
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw createNotFoundError("Producto no encontrado");
  }

  return await productosRepository.updateActivo(idProducto, activo);
};

const darBajaProducto = async (idProducto) => {
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw createNotFoundError("Producto no encontrado");
  }

  return await productosRepository.darBaja(idProducto);
};

const activarProducto = async (idProducto) => {
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw createNotFoundError("Producto no encontrado");
  }

  return await productosRepository.activar(idProducto);
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosInactivos,
  buscarProductos,
  crearProducto,
  actualizarProducto,
  actualizarEstadoActivo,
  darBajaProducto,
  activarProducto,
};
