/**
 * CLOUDINARY CONFIGURATION
 * ========================
 * Configuración del servicio de almacenamiento de imágenes en la nube
 */

const cloudinary = require("cloudinary").v2;

// Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Siempre usar HTTPS
});

// Verificar configuración al iniciar
const validateConfig = () => {
  const missingVars = [];

  if (!process.env.CLOUDINARY_CLOUD_NAME)
    missingVars.push("CLOUDINARY_CLOUD_NAME");
  if (!process.env.CLOUDINARY_API_KEY) missingVars.push("CLOUDINARY_API_KEY");
  if (!process.env.CLOUDINARY_API_SECRET)
    missingVars.push("CLOUDINARY_API_SECRET");

  if (missingVars.length > 0) {
    console.warn(
      "⚠️  Cloudinary no configurado correctamente. Variables faltantes:",
      missingVars.join(", "),
    );
    return false;
  }

  console.log("✅ Cloudinary configurado correctamente");
  return true;
};

module.exports = {
  cloudinary,
  validateConfig,
};
