import { useEffect, useMemo, useState } from "react";
import {
  Upload,
  Check,
  AlertCircle,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Star,
  Trash2,
  GripVertical,
  Info,
} from "lucide-react";
import apiClient from "@utils/apiClient";

export default function UploadImagenes({
  idProducto,
  onUploadSuccess,
  maxFiles = 10,
}) {
  const [imagenes, setImagenes] = useState([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [draggingKey, setDraggingKey] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);

  const totalImagenes = imagenes.length;
  const nuevasImagenes = useMemo(
    () => imagenes.filter((img) => img.type === "new"),
    [imagenes],
  );

  const loadImagenesExistentes = async () => {
    if (!idProducto) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get(`/productos/${idProducto}/imagenes`);
      const existentes = Array.isArray(data)
        ? data.map((img) => ({
            key: `existing-${img.idImagen || Math.random().toString(36).slice(2)}`,
            type: "existing",
            idImagen: img.idImagen,
            urlImagen: img.urlImagen,
            altText: img.altText || `Imagen del producto ${idProducto}`,
            esPrincipal: Boolean(img.esPrincipal),
            orden: Number(img.orden) || 0,
            isLegacy: Boolean(img.isLegacy),
          }))
        : [];

      existentes.sort((a, b) => {
        if (a.esPrincipal && !b.esPrincipal) return -1;
        if (!a.esPrincipal && b.esPrincipal) return 1;
        return a.orden - b.orden;
      });

      setImagenes(existentes);
      setPendingDeleteIds([]);
    } catch (err) {
      console.error("Error cargando imágenes:", err);
      setError("No se pudieron cargar las imágenes existentes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImagenesExistentes();
    return () => {
      imagenes.forEach((img) => {
        if (img.type === "new" && img.previewUrl) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idProducto]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const currentCount = imagenes.length;
    if (currentCount + selectedFiles.length > maxFiles) {
      setError(`Máximo ${maxFiles} imágenes en total`);
      return;
    }

    const invalidFiles = selectedFiles.filter(
      (file) => file.size > 5 * 1024 * 1024,
    );
    if (invalidFiles.length > 0) {
      setError(
        `Algunos archivos son demasiado grandes. Máximo 5MB por archivo.`,
      );
      return;
    }

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
    const itemsNuevos = selectedFiles.map((file, index) => {
      const key = `new-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`;
      return {
        key,
        type: "new",
        file,
        previewUrl: URL.createObjectURL(file),
        urlImagen: null,
        altText: file.name,
        esPrincipal: false,
      };
    });

    setImagenes((prev) => {
      const sinPrincipal = prev.every((img) => !img.esPrincipal);
      if (prev.length === 0 || sinPrincipal) {
        itemsNuevos[0].esPrincipal = true;
      }
      return [...prev, ...itemsNuevos];
    });

    e.target.value = "";
  };

  const normalizePrincipal = (list) => {
    if (list.length === 0) return list;
    if (list.some((img) => img.esPrincipal)) return list;
    return list.map((img, index) => ({
      ...img,
      esPrincipal: index === 0,
    }));
  };

  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= imagenes.length) return;

    setImagenes((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const moveItemByKey = (sourceKey, targetKey) => {
    if (!sourceKey || !targetKey || sourceKey === targetKey) return;

    setImagenes((prev) => {
      const sourceIndex = prev.findIndex((img) => img.key === sourceKey);
      const targetIndex = prev.findIndex((img) => img.key === targetKey);

      if (sourceIndex < 0 || targetIndex < 0) return prev;

      const copy = [...prev];
      const [moved] = copy.splice(sourceIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const handleDragStart = (e, key) => {
    setDraggingKey(key);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", key);
  };

  const handleDragOver = (e, key) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverKey !== key) {
      setDragOverKey(key);
    }
  };

  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    const sourceKey = draggingKey || e.dataTransfer.getData("text/plain");
    moveItemByKey(sourceKey, targetKey);
    setDraggingKey(null);
    setDragOverKey(null);
  };

  const handleDragEnd = () => {
    setDraggingKey(null);
    setDragOverKey(null);
  };

  const setPrincipal = (key) => {
    setImagenes((prev) =>
      prev.map((img) => ({
        ...img,
        esPrincipal: img.key === key,
      })),
    );
  };

  const removeItem = (item) => {
    setImagenes((prev) => {
      const remaining = prev.filter((img) => img.key !== item.key);
      const normalized = normalizePrincipal(remaining);
      return normalized;
    });

    if (item.type === "new" && item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }

    if (item.type === "existing" && item.idImagen) {
      setPendingDeleteIds((prev) => [...prev, item.idImagen]);
    }
  };

  const handleGuardarCambios = async () => {
    if (imagenes.length === 0) {
      setError("Debe quedar al menos una imagen para el producto");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      for (const idImagen of pendingDeleteIds) {
        await apiClient.delete(`/cloudinary/delete/${idImagen}`);
      }

      const idByKey = new Map();

      for (let index = 0; index < imagenes.length; index += 1) {
        const item = imagenes[index];
        const orden = index + 1;

        if (item.type === "existing") {
          if (!item.idImagen) continue;
          idByKey.set(item.key, item.idImagen);
          continue;
        }

        const formData = new FormData();
        formData.append("imagen", item.file);
        formData.append("orden", String(orden));
        formData.append("esPrincipal", String(Boolean(item.esPrincipal)));
        formData.append("altText", item.altText || `Imagen ${orden}`);

        const response = await apiClient.post(
          `/cloudinary/upload/${idProducto}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const idImagenNueva = response?.data?.imagen?.idImagen;
        if (idImagenNueva) {
          idByKey.set(item.key, idImagenNueva);
        }
      }

      const reordenamientos = imagenes
        .map((item, index) => ({
          idImagen: idByKey.get(item.key),
          orden: index + 1,
        }))
        .filter((item) => Number.isInteger(item.idImagen));

      if (reordenamientos.length > 0) {
        await apiClient.patch(`/productos/${idProducto}/imagenes/reordenar`, {
          reordenamientos,
        });
      }

      const principal = imagenes.find((item) => item.esPrincipal);
      const idPrincipal = principal ? idByKey.get(principal.key) : null;
      if (idPrincipal) {
        await apiClient.patch(`/imagenes/${idPrincipal}/principal`);
      }

      nuevasImagenes.forEach((img) => {
        if (img.previewUrl) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });

      await loadImagenesExistentes();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error("Error al guardar imágenes:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al guardar los cambios de imágenes",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
          <Upload className="w-5 h-5" />
          Gestionar Imágenes
        </h3>
        <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          <Info className="w-3.5 h-3.5" />
          Arrastra y suelta para reordenar
        </div>
      </div>

      {/* Input de archivos */}
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-colors ${
            isSaving || totalImagenes >= maxFiles
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-primary-500 cursor-pointer"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-9 h-9 mb-2 text-gray-400" />
            <p className="mb-1 text-sm text-gray-600">
              <span className="font-semibold">Click para seleccionar</span> o
              arrastra aquí
            </p>
            <p className="text-xs text-gray-500 text-center px-2">
              PNG, JPG, GIF, WebP (máx. 5MB por archivo, hasta {maxFiles}{" "}
              imágenes)
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isSaving || totalImagenes >= maxFiles}
          />
        </label>
      </div>

      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          Cargando imágenes existentes...
        </div>
      )}

      {/* Mensajes */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            Cambios de imágenes guardados exitosamente
          </p>
        </div>
      )}

      {/* Lista de imágenes */}
      {imagenes.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            {imagenes.length} {imagenes.length === 1 ? "imagen" : "imágenes"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagenes.map((item, index) => {
              const preview =
                item.type === "new" ? item.previewUrl : item.urlImagen;
              return (
                <div
                  key={item.key}
                  draggable={!isSaving}
                  onDragStart={(e) => handleDragStart(e, item.key)}
                  onDragOver={(e) => handleDragOver(e, item.key)}
                  onDrop={(e) => handleDrop(e, item.key)}
                  onDragEnd={handleDragEnd}
                  className={`relative group border rounded-xl p-2.5 bg-white transition-all shadow-sm ${
                    draggingKey === item.key ? "opacity-60" : "opacity-100"
                  } ${
                    dragOverKey === item.key && draggingKey !== item.key
                      ? "ring-2 ring-primary-400 border-primary-300"
                      : ""
                  }`}
                >
                  <div className="absolute top-3 left-3 z-10 bg-white/95 border border-gray-200 rounded-md p-1 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5 text-gray-500" />
                  </div>

                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || isSaving}
                      className="bg-white/90 border rounded p-1 disabled:opacity-40"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === imagenes.length - 1 || isSaving}
                      className="bg-white/90 border rounded p-1 disabled:opacity-40"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPrincipal(item.key)}
                      disabled={isSaving}
                      className={`text-xs px-2 py-1 rounded-md inline-flex items-center gap-1 ${
                        item.esPrincipal
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      {item.esPrincipal ? "Principal" : "Marcar principal"}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      disabled={isSaving || item.isLegacy}
                      className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-40 inline-flex items-center gap-1"
                      title={
                        item.isLegacy ? "No editable (imagen legacy)" : "Quitar"
                      }
                    >
                      <Trash2 className="w-3 h-3" />
                      Quitar
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Orden: {index + 1} ·{" "}
                    {item.type === "existing" ? "Existente" : "Nueva"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón guardar */}
      {totalImagenes > 0 && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 pt-3 mt-5">
          <button
            onClick={handleGuardarCambios}
            disabled={isSaving || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando cambios...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Guardar orden y cambios de imágenes
              </>
            )}
          </button>
        </div>
      )}

      {/* Info adicional */}
      <div className="mt-4 text-xs text-gray-500 space-y-0.5">
        <p>ℹ️ Puedes mezclar imágenes existentes y nuevas en un mismo orden</p>
        <p>ℹ️ Define cuál será la imagen principal antes de guardar</p>
      </div>
    </div>
  );
}
