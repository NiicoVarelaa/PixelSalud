const favoritosRepository = require("../repositories/FavoritosRepository");
const productosRepository = require("../repositories/ProductosRepository");
const { createNotFoundError, createValidationError } = require("../errors");

const toggleFavorito = async (idCliente, idProducto) => {
  const producto = await productosRepository.findByIdWithOfertas(idProducto);

  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  if (!producto.activo) {
    throw createValidationError(
      "No se puede agregar a favoritos un producto inactivo",
    );
  }

  const yaExiste = await favoritosRepository.exists(idCliente, idProducto);

  if (yaExiste) {
    await favoritosRepository.deleteByClienteAndProducto(idCliente, idProducto);
    return {
      isFavorite: false,
      message: "Producto eliminado de favoritos",
    };
  } else {
    const idFavorito = await favoritosRepository.create(idCliente, idProducto);
    return {
      isFavorite: true,
      message: "Producto agregado a favoritos",
      idFavorito,
    };
  }
};

const obtenerFavoritosPorCliente = async (idCliente) => {
  const favoritos =
    await favoritosRepository.findAllByClienteWithProductos(idCliente);
  return favoritos;
};

const esFavorito = async (idCliente, idProducto) => {
  return await favoritosRepository.exists(idCliente, idProducto);
};

const contarFavoritos = async (idCliente) => {
  return await favoritosRepository.countByCliente(idCliente);
};

module.exports = {
  toggleFavorito,
  obtenerFavoritosPorCliente,
  esFavorito,
  contarFavoritos,
};
