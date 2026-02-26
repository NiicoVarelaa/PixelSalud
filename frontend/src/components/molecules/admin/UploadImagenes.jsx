/**
 * COMPONENTE: UploadImagenes
 * ===========================
 * Componente para subir imágenes de productos a Cloudinary
 */

import { useState } from "react";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import apiClient from "@utils/apiClient";

export default function UploadImagenes({
  idProducto,
  onUploadSuccess,
  maxFiles = 10,
}) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Manejar selección de archivos
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validar cantidad máxima según prop
    if (selectedFiles.length > maxFiles) {
      setError(`Máximo ${maxFiles} imágenes por vez`);
      return;
    }

    // Validar tamaño (5MB por archivo)
    const invalidFiles = selectedFiles.filter(
      (file) => file.size > 5 * 1024 * 1024,
    );
    if (invalidFiles.length > 0) {
      setError(
        `Algunos archivos son demasiado grandes. Máximo 5MB por archivo.`,
      );
      return;
    }

    // Validar tipos
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidTypes = selectedFiles.filter(
      (file) => !validTypes.includes(file.type),
    );
    if (invalidTypes.length > 0) {
      setError("Solo se permiten imágenes (JPG, PNG, GIF, WebP)");
      return;
    }

    setError(null);
    setFiles(selectedFiles);

    // Crear previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // Eliminar archivo de la lista
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // Liberar memoria
      return prev.filter((_, i) => i !== index);
    });
  };

  // Subir imágenes
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Selecciona al menos una imagen");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();

      // Si es una sola imagen, usar endpoint single
      if (files.length === 1) {
        formData.append("imagen", files[0]);
        formData.append("orden", "1");
        formData.append("esPrincipal", "true");
        formData.append("altText", `Imagen del producto ${idProducto}`);

        const response = await apiClient.post(
          `/cloudinary/upload/${idProducto}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("Imagen subida:", response.data);
      } else {
        // Múltiples imágenes
        files.forEach((file) => {
          formData.append("imagenes", file);
        });
        formData.append("altTextBase", `Imagen del producto ${idProducto}`);

        const response = await apiClient.post(
          `/cloudinary/upload-multiple/${idProducto}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("Imágenes subidas:", response.data);
      }

      setSuccess(true);
      setFiles([]);
      setPreviews([]);

      // Notificar al componente padre
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error al subir imágenes:", err);
      setError(err.response?.data?.error || "Error al subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Subir Imágenes
      </h3>

      {/* Input de archivos */}
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click para seleccionar</span> o
              arrastra aquí
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP (máx. 5MB por archivo, hasta 10 imágenes)
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            {files.length === 1 ? "Imagen subida" : "Imágenes subidas"}{" "}
            exitosamente
          </p>
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {previews.length}{" "}
            {previews.length === 1
              ? "imagen seleccionada"
              : "imágenes seleccionadas"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de subida */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            uploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Subir {files.length} {files.length === 1 ? "imagen" : "imágenes"}
            </>
          )}
        </button>
      )}

      {/* Info adicional */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          ℹ️ Las imágenes se guardarán en Cloudinary con optimización automática
        </p>
        <p>ℹ️ La primera imagen será marcada como principal automáticamente</p>
      </div>
    </div>
  );
}
