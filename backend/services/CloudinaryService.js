const { cloudinary } = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "pixel-salud/productos",
      resource_type: "image",
      format: "webp",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:good" },
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
};

const uploadMultipleImages = async (files, options = {}) => {
  const uploadPromises = files.map((file, index) =>
    uploadImage(file.buffer, {
      ...options,
      public_id: options.publicIdPrefix
        ? `${options.publicIdPrefix}_${index + 1}`
        : undefined,
    }),
  );

  return Promise.all(uploadPromises);
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error al eliminar de Cloudinary:", error);
    throw error;
  }
};

const deleteMultipleImages = async (publicIds) => {
  const deletePromises = publicIds.map((publicId) => deleteImage(publicId));
  return Promise.all(deletePromises);
};

const extractPublicId = (url) => {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error al extraer public_id:", error);
    return null;
  }
};

const getTransformedUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    width: transformations.width || 800,
    height: transformations.height || 800,
    crop: transformations.crop || "limit",
    quality: transformations.quality || "auto:good",
    fetch_format: "auto",
  };

  return cloudinary.url(publicId, defaultTransformations);
};

const getUsageStats = async () => {
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
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  extractPublicId,
  getTransformedUrl,
  getUsageStats,
};
