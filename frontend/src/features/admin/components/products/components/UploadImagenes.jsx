import { AlertCircle, Check, Info, Images, Upload } from "lucide-react";
import { UploadImagenesDropzone } from "./uploadImagenes/UploadImagenesDropzone";
import { UploadImagenesGallery } from "./uploadImagenes/UploadImagenesGallery";
import { useUploadImagenesManager } from "../hooks/useUploadImagenesManager";

export default function UploadImagenes({
  idProducto,
  onUploadSuccess,
  maxFiles = 10,
}) {
  const {
    dragOverKey,
    draggingKey,
    error,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDrop,
    handleFileSelect,
    handleGuardarCambios,
    imagenes,
    isLoading,
    isSaving,
    moveItem,
    nuevasImagenes,
    pendingDeleteCount,
    removeItem,
    setPrincipal,
    success,
    totalImagenes,
  } = useUploadImagenesManager({
    idProducto,
    maxFiles,
    onUploadSuccess,
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Images className="h-5 w-5" />
          Gestionar Imágenes
        </h3>
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
          <Info className="h-3.5 w-3.5" />
          Arrastra y suelta para reordenar
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-base font-semibold text-gray-900">
            {totalImagenes}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Nuevas</p>
          <p className="text-base font-semibold text-gray-900">
            {nuevasImagenes.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Pendientes de eliminar</p>
          <p className="text-base font-semibold text-gray-900">
            {pendingDeleteCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Límite</p>
          <p className="text-base font-semibold text-gray-900">{maxFiles}</p>
        </div>
      </div>

      <div className="mb-4">
        <UploadImagenesDropzone
          isSaving={isSaving}
          maxFiles={maxFiles}
          onChange={handleFileSelect}
          totalImagenes={totalImagenes}
        />
      </div>

      {isLoading && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          Cargando imágenes existentes...
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
          <p className="text-sm text-green-700">
            Cambios de imágenes guardados exitosamente
          </p>
        </div>
      )}

      <div className="mb-4">
        <UploadImagenesGallery
          dragOverKey={dragOverKey}
          draggingKey={draggingKey}
          imagenes={imagenes}
          isSaving={isSaving}
          moveItem={moveItem}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onRemove={removeItem}
          onSetPrincipal={setPrincipal}
        />
      </div>

      {totalImagenes > 0 && (
        <div className="sticky bottom-0 mt-5 border-t border-gray-200 bg-white/95 pt-3 backdrop-blur">
          <button
            type="button"
            onClick={handleGuardarCambios}
            disabled={isSaving || isLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-colors ${
              isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {isSaving ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Guardando cambios...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Guardar orden y cambios de imágenes
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 space-y-1 text-xs text-gray-500">
        <p className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Puedes mezclar imágenes existentes y nuevas en un mismo orden.
        </p>
        <p className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Define cuál será la imagen principal antes de guardar.
        </p>
      </div>
    </div>
  );
}
