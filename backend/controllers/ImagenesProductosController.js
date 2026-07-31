const imagenesService = require("../services/ImagenesProductosService");

const getImagenesProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const imagenes = await imagenesService.obtenerImagenesProducto(
      parseInt(idProducto),
    );
    res.json(imagenes);
  } catch (error) {
    next(error);
  }
};

const getImagenPrincipal = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const imagen = await imagenesService.obtenerImagenPrincipal(
      parseInt(idProducto),
    );
    res.json(imagen);
  } catch (error) {
    next(error);
  }
};

const addImagen = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const imagen = await imagenesService.agregarImagen(
      parseInt(idProducto),
      req.body,
    );
    res.status(201).json({
      message: "Imagen agregada correctamente",
      imagen,
    });
  } catch (error) {
    next(error);
  }
};

const addImagenes = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { imagenes } = req.body;
    const imagenesCreadas = await imagenesService.agregarImagenes(
      parseInt(idProducto),
      imagenes,
    );
    res.status(201).json({
      message: "Imágenes agregadas correctamente",
      imagenes: imagenesCreadas,
    });
  } catch (error) {
    next(error);
  }
};

const updateImagen = async (req, res, next) => {
  try {
    const { idImagen } = req.params;
    const imagen = await imagenesService.actualizarImagen(
      parseInt(idImagen),
      req.body,
    );
    res.json({
      message: "Imagen actualizada correctamente",
      imagen,
    });
  } catch (error) {
    next(error);
  }
};

const setPrincipal = async (req, res, next) => {
  try {
    const { idImagen } = req.params;
    const imagen = await imagenesService.establecerImagenPrincipal(
      parseInt(idImagen),
    );
    res.json({
      message: "Imagen principal establecida",
      imagen,
    });
  } catch (error) {
    next(error);
  }
};

const deleteImagen = async (req, res, next) => {
  try {
    const { idImagen } = req.params;
    await imagenesService.eliminarImagen(parseInt(idImagen));
    res.json({
      message: "Imagen eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

const deleteImagenesProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const cantidad = await imagenesService.eliminarImagenesProducto(
      parseInt(idProducto),
    );
    res.json({
      message: `${cantidad} imagen(es) eliminada(s) correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

const reordenarImagenes = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { reordenamientos } = req.body;
    const imagenes = await imagenesService.reordenarImagenes(
      parseInt(idProducto),
      reordenamientos,
    );
    res.json({
      message: "Imágenes reordenadas correctamente",
      imagenes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getImagenesProducto,
  getImagenPrincipal,
  addImagen,
  addImagenes,
  updateImagen,
  setPrincipal,
  deleteImagen,
  deleteImagenesProducto,
  reordenarImagenes,
};
