import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@utils/apiClient";

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const createExistingItem = (img, idProducto) => ({
  key: `existing-${img.idImagen || Math.random().toString(36).slice(2)}`,
  type: "existing",
  idImagen: img.idImagen,
  urlImagen: img.urlImagen,
  altText: img.altText || `Imagen del producto ${idProducto}`,
  esPrincipal: Boolean(img.esPrincipal),
  orden: Number(img.orden) || 0,
  isLegacy: Boolean(img.isLegacy),
});

const sortByPrincipalAndOrder = (a, b) => {
  if (a.esPrincipal && !b.esPrincipal) return -1;
  if (!a.esPrincipal && b.esPrincipal) return 1;
  return a.orden - b.orden;
};

const revokePreview = (item) => {
  if (item.type === "new" && item.previewUrl) {
    URL.revokeObjectURL(item.previewUrl);
  }
};

const normalizePrincipal = (list) => {
  if (list.length === 0) return list;
  if (list.some((img) => img.esPrincipal)) return list;

  return list.map((img, index) => ({
    ...img,
    esPrincipal: index === 0,
  }));
};

export const useUploadImagenesManager = ({
  idProducto,
  onUploadSuccess,
  maxFiles = 10,
}) => {
  const [imagenes, setImagenes] = useState([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [draggingKey, setDraggingKey] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);

  const imagenesRef = useRef([]);
  const successTimeoutRef = useRef(null);

  const totalImagenes = imagenes.length;
  const nuevasImagenes = useMemo(
    () => imagenes.filter((img) => img.type === "new"),
    [imagenes],
  );

  useEffect(() => {
    imagenesRef.current = imagenes;
  }, [imagenes]);

  const clearSuccessTimer = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
  }, []);

  const loadImagenesExistentes = useCallback(async () => {
    if (!idProducto) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get(`/productos/${idProducto}/imagenes`);

      const existentes = Array.isArray(data)
        ? data.map((img) => createExistingItem(img, idProducto))
        : [];

      existentes.sort(sortByPrincipalAndOrder);

      setImagenes(existentes);
      setPendingDeleteIds([]);
    } catch (err) {
      console.error("Error cargando imágenes:", err);
      setError("No se pudieron cargar las imágenes existentes");
    } finally {
      setIsLoading(false);
    }
  }, [idProducto]);

  useEffect(() => {
    loadImagenesExistentes();

    return () => {
      clearSuccessTimer();
      imagenesRef.current.forEach(revokePreview);
    };
  }, [clearSuccessTimer, loadImagenesExistentes]);

  const handleFileSelect = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files || []);
      if (selectedFiles.length === 0) return;

      if (totalImagenes + selectedFiles.length > maxFiles) {
        setError(`Máximo ${maxFiles} imágenes en total`);
        return;
      }

      if (selectedFiles.some((file) => file.size > MAX_FILE_SIZE_BYTES)) {
        setError(
          "Algunos archivos son demasiado grandes. Máximo 5MB por archivo.",
        );
        return;
      }

      if (
        selectedFiles.some((file) => !VALID_IMAGE_TYPES.includes(file.type))
      ) {
        setError("Solo se permiten imágenes (JPG, PNG, GIF, WebP)");
        return;
      }

      setError(null);

      const nuevosItems = selectedFiles.map((file, index) => ({
        key: `new-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
        type: "new",
        file,
        previewUrl: URL.createObjectURL(file),
        urlImagen: null,
        altText: file.name,
        esPrincipal: false,
      }));

      setImagenes((prev) => {
        const sinPrincipal = prev.every((img) => !img.esPrincipal);
        if (prev.length === 0 || sinPrincipal) {
          nuevosItems[0].esPrincipal = true;
        }

        return [...prev, ...nuevosItems];
      });

      event.target.value = "";
    },
    [maxFiles, totalImagenes],
  );

  const moveItem = useCallback((index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= imagenesRef.current.length) return;

    setImagenes((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  }, []);

  const moveItemByKey = useCallback((sourceKey, targetKey) => {
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
  }, []);

  const handleDragStart = useCallback((event, key) => {
    setDraggingKey(key);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", key);
  }, []);

  const handleDragOver = useCallback(
    (event, key) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      if (dragOverKey !== key) {
        setDragOverKey(key);
      }
    },
    [dragOverKey],
  );

  const handleDrop = useCallback(
    (event, targetKey) => {
      event.preventDefault();
      const sourceKey = draggingKey || event.dataTransfer.getData("text/plain");
      moveItemByKey(sourceKey, targetKey);
      setDraggingKey(null);
      setDragOverKey(null);
    },
    [draggingKey, moveItemByKey],
  );

  const handleDragEnd = useCallback(() => {
    setDraggingKey(null);
    setDragOverKey(null);
  }, []);

  const setPrincipal = useCallback((key) => {
    setImagenes((prev) =>
      prev.map((img) => ({
        ...img,
        esPrincipal: img.key === key,
      })),
    );
  }, []);

  const removeItem = useCallback((item) => {
    setImagenes((prev) => {
      const remaining = prev.filter((img) => img.key !== item.key);
      return normalizePrincipal(remaining);
    });

    revokePreview(item);

    if (item.type === "existing" && item.idImagen) {
      setPendingDeleteIds((prev) => [...prev, item.idImagen]);
    }
  }, []);

  const handleGuardarCambios = useCallback(async () => {
    if (imagenesRef.current.length === 0) {
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
      const imagenesActuales = imagenesRef.current;

      for (let index = 0; index < imagenesActuales.length; index += 1) {
        const item = imagenesActuales[index];
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

      const reordenamientos = imagenesActuales
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

      const principal = imagenesActuales.find((item) => item.esPrincipal);
      const idPrincipal = principal ? idByKey.get(principal.key) : null;
      if (idPrincipal) {
        await apiClient.patch(`/imagenes/${idPrincipal}/principal`);
      }

      nuevasImagenes.forEach(revokePreview);

      await loadImagenesExistentes();
      setSuccess(true);
      clearSuccessTimer();
      successTimeoutRef.current = setTimeout(() => setSuccess(false), 3000);

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
  }, [
    clearSuccessTimer,
    idProducto,
    loadImagenesExistentes,
    nuevasImagenes,
    onUploadSuccess,
    pendingDeleteIds,
  ]);

  return {
    error,
    draggingKey,
    dragOverKey,
    imagenes,
    isLoading,
    isSaving,
    nuevasImagenes,
    success,
    totalImagenes,
    pendingDeleteCount: pendingDeleteIds.length,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDrop,
    handleFileSelect,
    handleGuardarCambios,
    moveItem,
    removeItem,
    setPrincipal,
  };
};
