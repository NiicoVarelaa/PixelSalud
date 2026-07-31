const cloudinaryService = require("../services/CloudinaryService");
const imagenesProductosService = require("../services/ImagenesProductosService");
const productosRepository = require("../repositories/ProductosRepository");

const uploadProductImage = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { orden, esPrincipal, altText } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    const producto = await productosRepository.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const nombreProducto = producto.nombreProducto
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    const categoria = producto.categoria
      ? producto.categoria.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
      : "otros";

    const cloudinaryResult = await cloudinaryService.uploadImage(
      req.file.buffer,
      {
        folder: `pixel-salud/productos/${categoria}`,
        public_id: `${nombreProducto}`,
      },
    );

    const imagen = await imagenesProductosService.create(parseInt(idProducto), {
      urlImagen: cloudinaryResult.url,
      orden: orden ? parseInt(orden) : 1,
      esPrincipal: esPrincipal === "true" || esPrincipal === true,
      altText: altText || `Imagen del producto ${idProducto}`,
    });

    res.status(201).json({
      message: "Imagen subida exitosamente",
      imagen,
      cloudinary: {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
        size: cloudinaryResult.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadMultipleProductImages = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { altTextBase } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No se recibieron archivos" });
    }

    const uploadPromises = req.files.map((file, index) =>
      cloudinaryService.uploadImage(file.buffer, {
        folder: `pixel-salud/productos/${idProducto}`,
        public_id: `producto_${idProducto}_${Date.now()}_${index}`,
      }),
    );

    const cloudinaryResults = await Promise.all(uploadPromises);

    const imagenesData = cloudinaryResults.map((result, index) => ({
      idProducto: parseInt(idProducto),
      urlImagen: result.url,
      orden: index + 1,
      esPrincipal: index === 0,
      altText: altTextBase
        ? `${altTextBase} ${index + 1}`
        : `Imagen ${index + 1} del producto ${idProducto}`,
    }));

    const imagenes = await imagenesProductosService.createMany(
      parseInt(idProducto),
      imagenesData,
    );

    res.status(201).json({
      message: `${imagenes.length} imágenes subidas exitosamente`,
      imagenes,
      cloudinary: cloudinaryResults.map((result) => ({
        url: result.url,
        publicId: result.publicId,
        size: result.size,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const deleteProductImage = async (req, res, next) => {
  try {
    const { idImagen } = req.params;

    const imagen = await imagenesProductosService.findById(idImagen);

    if (!imagen) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const publicId = cloudinaryService.extractPublicId(imagen.urlImagen);

    if (publicId) {
      await cloudinaryService.deleteImage(publicId);
    }

    await imagenesProductosService.deleteById(idImagen);

    res.json({
      message: "Imagen eliminada exitosamente",
      idImagen,
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await cloudinaryService.getUsageStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getTransformedUrl = async (req, res, next) => {
  try {
    const { url, transformations } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL requerida" });
    }

    const publicId = cloudinaryService.extractPublicId(url);

    if (!publicId) {
      return res.status(400).json({ error: "URL de Cloudinary inválida" });
    }

    const transformedUrl = cloudinaryService.getTransformedUrl(
      publicId,
      transformations,
    );

    res.json({
      originalUrl: url,
      transformedUrl,
      transformations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProductImage,
  uploadMultipleProductImages,
  deleteProductImage,
  getStats,
  getTransformedUrl,
};
