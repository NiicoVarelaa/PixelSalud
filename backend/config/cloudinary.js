const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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

  return true;
};

module.exports = {
  cloudinary,
  validateConfig,
};
