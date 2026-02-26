/**
 * MULTER MIDDLEWARE
 * =================
 * Middleware para manejo de uploads de archivos
 */

const multer = require("multer");

// Configuración de Multer para almacenamiento en memoria (buffer)
const storage = multer.memoryStorage();

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Tipos de imagen permitidos
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten: ${allowedMimeTypes.join(", ")}`,
      ),
      false,
    );
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
    files: 10, // Máximo 10 archivos por request
  },
});

// Middleware para una sola imagen
const uploadSingle = upload.single("imagen");

// Middleware para múltiples imágenes
const uploadMultiple = upload.array("imagenes", 10);

// Middleware personalizado con manejo de errores
const uploadSingleWithErrorHandler = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "El archivo es demasiado grande. Tamaño máximo: 5MB",
        });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          error: "Número de archivos excedido",
        });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Otro tipo de error (ej: tipo de archivo no permitido)
      return res.status(400).json({ error: err.message });
    }
    // Todo OK, continuar
    next();
  });
};

const uploadMultipleWithErrorHandler = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error:
            "Uno o más archivos son demasiado grandes. Tamaño máximo: 5MB por archivo",
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          error: "Demasiados archivos. Máximo: 10 archivos",
        });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadSingleWithErrorHandler,
  uploadMultipleWithErrorHandler,
};
