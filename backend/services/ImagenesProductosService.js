const imagenesRepository = require("../repositories/ImagenesProductosRepository");
const productosRepository = require("../repositories/ProductosRepository");
const { createNotFoundError, createValidationError } = require("../errors");

const obtenerImagenesProducto = async (idProducto) => {
  const producto = await productosRepository.findById(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  const imagenes = await imagenesRepository.findByProductoId(idProducto);

  if (imagenes.length === 0 && producto.img) {
    return [
      {
        idImagen: null,
        urlImagen: producto.img,
        orden: 1,
        esPrincipal: true,
        altText: producto.nombreProducto,
        isLegacy: true,
      },
    ];
  }

  return imagenes;
};

const obtenerImagenPrincipal = async (idProducto) => {
  const producto = await productosRepository.findById(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  const imagenPrincipal =
    await imagenesRepository.findPrincipalByProductoId(idProducto);

  if (!imagenPrincipal && producto.img) {
    return {
      idImagen: null,
      urlImagen: producto.img,
      orden: 1,
      esPrincipal: true,
      altText: producto.nombreProducto,
      isLegacy: true,
    };
  }

  return imagenPrincipal;
};

const agregarImagen = async (idProducto, data) => {
  if (typeof idProducto === "object" && idProducto.idProducto) {
    idProducto = idProducto.idProducto;
  }
  const producto = await productosRepository.findById(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  if (!data.urlImagen || data.urlImagen.trim() === "") {
    throw createValidationError("La URL de la imagen es requerida");
  }

  const idImagen = await imagenesRepository.create({
    idProducto,
    urlImagen: data.urlImagen,
    orden: data.orden || 1,
    esPrincipal: data.esPrincipal || false,
    altText: data.altText || producto.nombreProducto,
  });

  return imagenesRepository.findById(idImagen);
};

const agregarImagenes = async (idProducto, imagenes) => {
  const producto = await productosRepository.findById(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  if (!imagenes || imagenes.length === 0) {
    throw createValidationError("Debe proporcionar al menos una imagen");
  }

  for (const imagen of imagenes) {
    if (!imagen.urlImagen || imagen.urlImagen.trim() === "") {
      throw createValidationError(
        "Todas las imágenes deben tener una URL válida",
      );
    }
  }

  const ids = await imagenesRepository.createMany(idProducto, imagenes);

  return Promise.all(ids.map((id) => imagenesRepository.findById(id)));
};

const actualizarImagen = async (idImagen, data) => {
  const imagenExistente = await imagenesRepository.findById(idImagen);
  if (!imagenExistente) {
    throw createNotFoundError("Imagen no encontrada");
  }

  const actualizada = await imagenesRepository.update(idImagen, data);

  if (!actualizada) {
    throw new Error("Error al actualizar la imagen");
  }

  return imagenesRepository.findById(idImagen);
};

const establecerImagenPrincipal = async (idImagen) => {
  const imagen = await imagenesRepository.findById(idImagen);
  if (!imagen) {
    throw createNotFoundError("Imagen no encontrada");
  }

  await imagenesRepository.setPrincipal(idImagen);
  return imagenesRepository.findById(idImagen);
};

const eliminarImagen = async (idImagen) => {
  const imagen = await imagenesRepository.findById(idImagen);
  if (!imagen) {
    throw createNotFoundError("Imagen no encontrada");
  }

  const imagenes = await imagenesRepository.findByProductoId(imagen.idProducto);
  if (imagenes.length === 1) {
    throw createValidationError(
      "No se puede eliminar la única imagen del producto",
    );
  }

  const eliminada = await imagenesRepository.deleteById(idImagen);

  if (imagen.esPrincipal) {
    const imagenesRestantes = await imagenesRepository.findByProductoId(
      imagen.idProducto,
    );
    if (imagenesRestantes.length > 0) {
      await imagenesRepository.setPrincipal(imagenesRestantes[0].idImagen);
    }
  }

  return eliminada;
};

const eliminarImagenesProducto = async (idProducto) => {
  const producto = await productosRepository.findById(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  return imagenesRepository.deleteByProductoId(idProducto);
};

const obtenerImagenPorId = async (idImagen) => {
  return imagenesRepository.findById(idImagen);
};

const eliminarImagenPorId = async (idImagen) => {
  return imagenesRepository.deleteById(idImagen);
};

const reordenarImagenes = async (idProducto, reordenamientos) => {
  const producto = await productosRepository.findById(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  if (!reordenamientos || reordenamientos.length === 0) {
    throw createValidationError(
      "Debe proporcionar el nuevo orden de las imágenes",
    );
  }

  for (const item of reordenamientos) {
    const imagen = await imagenesRepository.findById(item.idImagen);
    if (!imagen || imagen.idProducto !== idProducto) {
      throw createValidationError(
        `La imagen ${item.idImagen} no pertenece al producto`,
      );
    }
  }

  await imagenesRepository.updateOrden(reordenamientos);
  return imagenesRepository.findByProductoId(idProducto);
};

module.exports = {
  obtenerImagenesProducto,
  obtenerImagenPrincipal,
  agregarImagen,
  agregarImagenes,
  actualizarImagen,
  establecerImagenPrincipal,
  eliminarImagen,
  eliminarImagenesProducto,
  reordenarImagenes,
  obtenerImagenPorId,
  eliminarImagenPorId,
  create: agregarImagen,
  createMany: agregarImagenes,
  findById: obtenerImagenPorId,
  deleteById: eliminarImagenPorId,
};
