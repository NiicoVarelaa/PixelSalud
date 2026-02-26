/**
 * CLOUDINARY SERVICE
 * ==================
 * Servicio para gestión de imágenes en Cloudinary
 */

const { cloudinary } = require("../config/cloudinary");
const streamifier = require("streamifier");

class CloudinaryService {
  /**
   * Sube una imagen a Cloudinary desde un buffer
   * @param {Buffer} fileBuffer - Buffer del archivo
   * @param {Object} options - Opciones de subida
   * @returns {Promise<Object>} - Datos de la imagen subida
   */
  async uploadImage(fileBuffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: options.folder || "pixel-salud/productos",
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" }, // Max 1200x1200
          { quality: "auto:good" }, // Optimización automática
          { fetch_format: "auto" }, // Formato automático (WebP si el navegador lo soporta)
        ],
        ...options,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Error al subir a Cloudinary:", error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              size: result.bytes,
            });
          }
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Sube múltiples imágenes a Cloudinary
   * @param {Array<Buffer>} files - Array de buffers de archivos
   * @param {Object} options - Opciones de subida
   * @returns {Promise<Array>} - Array con datos de las imágenes subidas
   */
  async uploadMultipleImages(files, options = {}) {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file.buffer, {
        ...options,
        public_id: options.publicIdPrefix
          ? `${options.publicIdPrefix}_${index + 1}`
          : undefined,
      }),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Elimina una imagen de Cloudinary
   * @param {String} publicId - ID público de la imagen en Cloudinary
   * @returns {Promise<Object>} - Resultado de la eliminación
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Error al eliminar de Cloudinary:", error);
      throw error;
    }
  }

  /**
   * Elimina múltiples imágenes de Cloudinary
   * @param {Array<String>} publicIds - Array de IDs públicos
   * @returns {Promise<Array>} - Resultados de las eliminaciones
   */
  async deleteMultipleImages(publicIds) {
    const deletePromises = publicIds.map((publicId) =>
      this.deleteImage(publicId),
    );
    return Promise.all(deletePromises);
  }

  /**
   * Extrae el public_id de una URL de Cloudinary
   * @param {String} url - URL de Cloudinary
   * @returns {String|null} - Public ID o null si no es una URL de Cloudinary
   */
  extractPublicId(url) {
    try {
      // Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
      // Extraer: folder/image
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Error al extraer public_id:", error);
      return null;
    }
  }

  /**
   * Genera una URL con transformaciones
   * @param {String} publicId - ID público de la imagen
   * @param {Object} transformations - Transformaciones a aplicar
   * @returns {String} - URL con transformaciones
   */
  getTransformedUrl(publicId, transformations = {}) {
    const defaultTransformations = {
      width: transformations.width || 800,
      height: transformations.height || 800,
      crop: transformations.crop || "limit",
      quality: transformations.quality || "auto:good",
      fetch_format: "auto",
    };

    return cloudinary.url(publicId, defaultTransformations);
  }

  /**
   * Obtiene estadísticas de uso de Cloudinary
   * @returns {Promise<Object>} - Estadísticas de la cuenta
   */
  async getUsageStats() {
    try {
      const result = await cloudinary.api.usage();
      return {
        storage: {
          used: result.storage.usage,
          limit: result.storage.limit,
          percentage: (
            (result.storage.usage / result.storage.limit) *
            100
          ).toFixed(2),
        },
        bandwidth: {
          used: result.bandwidth.usage,
          limit: result.bandwidth.limit,
          percentage: (
            (result.bandwidth.usage / result.bandwidth.limit) *
            100
          ).toFixed(2),
        },
        requests: result.requests,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  }
}

module.exports = new CloudinaryService();
