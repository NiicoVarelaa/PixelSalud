const favoritosRepository = require("../repositories/FavoritosRepository");
const productosRepository = require("../repositories/ProductosRepository");
const { createNotFoundError, createValidationError } = require("../errors");

/**
 * Servicio para la lógica de negocio de Favoritos
 * Maneja la relación entre clientes y productos favoritos
 */
/**
 * Toggle (agregar/quitar) un producto de favoritos
 * @param {number} idCliente
 * @param {number} idProducto
 * @returns {Promise<Object>} { isFavorite: boolean, message: string }
 */
const toggleFavorito = async (idCliente, idProducto) => {
  // Verificar que el producto existe y está activo
  const producto = await productosRepository.findByIdWithOfertas(idProducto);

  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  if (!producto.activo) {
    throw createValidationError(
      "No se puede agregar a favoritos un producto inactivo",
    );
  }

  // Verificar si ya existe en favoritos
  const yaExiste = await favoritosRepository.exists(idCliente, idProducto);

  if (yaExiste) {
    // Eliminar de favoritos
    await favoritosRepository.deleteByClienteAndProducto(idCliente, idProducto);
    return {
      isFavorite: false,
      message: "Producto eliminado de favoritos",
    };
  } else {
    // Agregar a favoritos
    const idFavorito = await favoritosRepository.create(idCliente, idProducto);
    return {
      isFavorite: true,
      message: "Producto agregado a favoritos",
      idFavorito,
    };
  }
};

/**
 * Obtiene todos los favoritos de un cliente con detalles de productos
 * @param {number} idCliente
 * @returns {Promise<Array>}
 */
const obtenerFavoritosPorCliente = async (idCliente) => {
  const favoritos =
    await favoritosRepository.findAllByClienteWithProductos(idCliente);
  return favoritos;
};

/**
 * Verifica si un producto es favorito de un cliente
 * @param {number} idCliente
 * @param {number} idProducto
 * @returns {Promise<boolean>}
 */
const esFavorito = async (idCliente, idProducto) => {
  return await favoritosRepository.exists(idCliente, idProducto);
};

/**
 * Cuenta cuántos favoritos tiene un cliente
 * @param {number} idCliente
 * @returns {Promise<number>}
 */
const contarFavoritos = async (idCliente) => {
  return await favoritosRepository.countByCliente(idCliente);
};

module.exports = {
  toggleFavorito,
  obtenerFavoritosPorCliente,
  esFavorito,
  contarFavoritos,
};
