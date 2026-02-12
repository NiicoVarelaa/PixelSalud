const { favoritosService } = require("../services");

/**
 * Toggle de favoritos (agregar o quitar)
 */
const toggleFavorito = async (req, res, next) => {
  try {
    const { idProducto } = req.body;
    const idCliente = req.user.id;

    const resultado = await favoritosService.toggleFavorito(
      idCliente,
      idProducto,
    );

    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener favoritos de un cliente
 */
const obtenerFavoritosPorCliente = async (req, res, next) => {
  try {
    const idCliente = req.user.id;

    const favoritos =
      await favoritosService.obtenerFavoritosPorCliente(idCliente);

    res.json(favoritos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleFavorito,
  obtenerFavoritosPorCliente,
};
