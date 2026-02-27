/**
 * CLOUDINARY CONTROLLER
 * =====================
 * Controlador para gestión de uploads a Cloudinary
 */

const CloudinaryService = require("../services/CloudinaryService");
const ImagenesProductosService = require("../services/ImagenesProductosService");

class CloudinaryController {
  /**
   * Sube una imagen de producto a Cloudinary
   * POST /api/cloudinary/upload/:idProducto
   */
  async uploadProductImage(req, res) {
    try {
      const { idProducto } = req.params;
      const { orden, esPrincipal, altText } = req.body;

      // Validar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({ error: "No se recibió ningún archivo" });
      }

      // Obtener nombre del producto
      const ProductosRepository = require("../repositories/ProductosRepository");
      const producto = await ProductosRepository.findById(idProducto);
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      // Limpiar nombre y categoría para usar como public_id y carpeta
      const nombreProducto = producto.nombreProducto
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");
      const categoria = producto.categoria
        ? producto.categoria.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : "otros";
      // Subir a Cloudinary
      const cloudinaryResult = await CloudinaryService.uploadImage(
        req.file.buffer,
        {
          folder: `pixel-salud/productos/${categoria}`,
          public_id: `${nombreProducto}`,
        },
      );

      // Guardar en la base de datos
      const imagen = await ImagenesProductosService.create(
        parseInt(idProducto),
        {
          urlImagen: cloudinaryResult.url,
          orden: orden ? parseInt(orden) : 1,
          esPrincipal: esPrincipal === "true" || esPrincipal === true,
          altText: altText || `Imagen del producto ${idProducto}`,
        },
      );

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
      console.error("Error al subir imagen:", error);
      res.status(500).json({
        error: "Error al subir la imagen",
        details: error.message,
      });
    }
  }

  /**
   * Sube múltiples imágenes de producto a Cloudinary
   * POST /api/cloudinary/upload-multiple/:idProducto
   */
  async uploadMultipleProductImages(req, res) {
    try {
      const { idProducto } = req.params;
      const { altTextBase } = req.body;

      // Validar que se subieron archivos
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No se recibieron archivos" });
      }

      // Subir todas las imágenes a Cloudinary
      const uploadPromises = req.files.map((file, index) =>
        CloudinaryService.uploadImage(file.buffer, {
          folder: `pixel-salud/productos/${idProducto}`,
          public_id: `producto_${idProducto}_${Date.now()}_${index}`,
        }),
      );

      const cloudinaryResults = await Promise.all(uploadPromises);

      // Guardar todas en la base de datos
      const imagenesData = cloudinaryResults.map((result, index) => ({
        idProducto: parseInt(idProducto),
        urlImagen: result.url,
        orden: index + 1,
        esPrincipal: index === 0, // La primera es principal por defecto
        altText: altTextBase
          ? `${altTextBase} ${index + 1}`
          : `Imagen ${index + 1} del producto ${idProducto}`,
      }));

      const imagenes = await ImagenesProductosService.createMany(
        parseInt(idProducto),
        imagenesData,
      );

      res.status(201).json({
        message: `${imagenes.length} imágenes subidas exitosamente`,
        imagenes,
        cloudinary: cloudinaryResults.map((r) => ({
          url: r.url,
          publicId: r.publicId,
          size: r.size,
        })),
      });
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      res.status(500).json({
        error: "Error al subir las imágenes",
        details: error.message,
      });
    }
  }

  /**
   * Elimina una imagen de Cloudinary y la BD
   * DELETE /api/cloudinary/delete/:idImagen
   */
  async deleteProductImage(req, res) {
    try {
      const { idImagen } = req.params;

      // Obtener la imagen de la BD
      const imagen = await ImagenesProductosService.findById(idImagen);

      if (!imagen) {
        return res.status(404).json({ error: "Imagen no encontrada" });
      }

      // Extraer el publicId de Cloudinary
      const publicId = CloudinaryService.extractPublicId(imagen.urlImagen);

      // Eliminar de Cloudinary (si es una URL de Cloudinary)
      if (publicId) {
        await CloudinaryService.deleteImage(publicId);
      }

      // Eliminar de la BD
      await ImagenesProductosService.deleteById(idImagen);

      res.json({
        message: "Imagen eliminada exitosamente",
        idImagen,
      });
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      res.status(500).json({
        error: "Error al eliminar la imagen",
        details: error.message,
      });
    }
  }

  /**
   * Obtiene estadísticas de uso de Cloudinary
   * GET /api/cloudinary/stats
   */
  async getStats(req, res) {
    try {
      const stats = await CloudinaryService.getUsageStats();
      res.json(stats);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({
        error: "Error al obtener estadísticas",
        details: error.message,
      });
    }
  }

  /**
   * Genera una URL con transformaciones
   * POST /api/cloudinary/transform
   */
  async getTransformedUrl(req, res) {
    try {
      const { url, transformations } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL requerida" });
      }

      const publicId = CloudinaryService.extractPublicId(url);

      if (!publicId) {
        return res.status(400).json({ error: "URL de Cloudinary inválida" });
      }

      const transformedUrl = CloudinaryService.getTransformedUrl(
        publicId,
        transformations,
      );

      res.json({
        originalUrl: url,
        transformedUrl,
        transformations,
      });
    } catch (error) {
      console.error("Error al transformar URL:", error);
      res.status(500).json({
        error: "Error al transformar la URL",
        details: error.message,
      });
    }
  }
}

module.exports = new CloudinaryController();
