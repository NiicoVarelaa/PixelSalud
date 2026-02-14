const productosRepository = require("../repositories/ProductosRepository");
const { NotFoundError, ValidationError, ConflictError } = require("../errors");

/**
 * Service para la lógica de negocio de Productos
 */

/**
 * Obtiene todos los productos con información de ofertas
 * @returns {Promise<Array>}
 */
const obtenerProductos = async () => {
  return await productosRepository.findAllWithOfertas();
};

/**
 * Obtiene un producto por ID con información de ofertas
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object>}
 * @throws {NotFoundError} Si el producto no existe
 */
const obtenerProductoPorId = async (idProducto) => {
  const producto = await productosRepository.findByIdWithOfertas(idProducto);

  if (!producto) {
    throw new NotFoundError("Producto no encontrado");
  }

  return producto;
};

/**
 * Obtiene productos inactivos (dados de baja)
 * @returns {Promise<Array>}
 * @throws {NotFoundError} Si no hay productos inactivos
 */
const obtenerProductosInactivos = async () => {
  const productos = await productosRepository.findInactivos();

  if (productos.length === 0) {
    throw new NotFoundError("No hay productos dados de baja");
  }

  return productos;
};

/**
 * Busca productos por término
 * @param {string} term - Término de búsqueda
 * @returns {Promise<Array>}
 * @throws {ValidationError} Si el término es muy corto
 */
const buscarProductos = async (term) => {
  if (!term || term.length < 3) {
    throw new ValidationError(
      "El término de búsqueda debe tener al menos 3 caracteres",
    );
  }

  return await productosRepository.searchByName(term);
};

/**
 * Crea un nuevo producto
 * @param {Object} data - Datos del producto
 * @returns {Promise<Object>} Producto creado
 * @throws {ValidationError} Si faltan datos o son inválidos
 * @throws {ConflictError} Si el producto ya existe
 */
const crearProducto = async (data) => {
  // Validaciones de negocio
  if (data.precio < 0) {
    throw new ValidationError("El precio no puede ser negativo");
  }

  if (data.stock < 0) {
    throw new ValidationError("El stock no puede ser negativo");
  }

  // Verificar si ya existe un producto con el mismo nombre
  const existe = await productosRepository.exists({
    nombreProducto: data.nombreProducto,
  });

  if (existe) {
    throw new ConflictError("Ya existe un producto con ese nombre");
  }

  // Agregar activo = true por defecto
  const productoData = {
    ...data,
    activo: true,
  };

  const idProducto = await productosRepository.create(productoData);
  return await productosRepository.findByIdWithOfertas(idProducto);
};

/**
 * Actualiza un producto existente
 * @param {number} idProducto - ID del producto
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Producto actualizado
 * @throws {NotFoundError} Si el producto no existe
 * @throws {ValidationError} Si los datos son inválidos
 */
const actualizarProducto = async (idProducto, data) => {
  // Verificar que el producto existe
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw new NotFoundError("Producto no encontrado");
  }

  // Validaciones de negocio
  if (data.precio !== undefined && data.precio < 0) {
    throw new ValidationError("El precio no puede ser negativo");
  }

  if (data.stock !== undefined && data.stock < 0) {
    throw new ValidationError("El stock no puede ser negativo");
  }

  const actualizado = await productosRepository.update(idProducto, data);

  if (!actualizado) {
    throw new Error("Error al actualizar el producto");
  }

  return await productosRepository.findByIdWithOfertas(idProducto);
};

/**
 * Actualiza solo el estado activo de un producto
 * @param {number} idProducto - ID del producto
 * @param {boolean} activo - Nuevo estado
 * @returns {Promise<boolean>}
 * @throws {NotFoundError} Si el producto no existe
 */
const actualizarEstadoActivo = async (idProducto, activo) => {
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw new NotFoundError("Producto no encontrado");
  }

  return await productosRepository.updateActivo(idProducto, activo);
};

/**
 * Da de baja un producto (activo = false)
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 * @throws {NotFoundError} Si el producto no existe
 */
const darBajaProducto = async (idProducto) => {
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw new NotFoundError("Producto no encontrado");
  }

  return await productosRepository.darBaja(idProducto);
};

/**
 * Activa un producto (activo = true)
 * @param {number} idProducto - ID del producto
 * @returns {Promise<boolean>}
 * @throws {NotFoundError} Si el producto no existe
 */
const activarProducto = async (idProducto) => {
  const existe = await productosRepository.findById(idProducto);
  if (!existe) {
    throw new NotFoundError("Producto no encontrado");
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
