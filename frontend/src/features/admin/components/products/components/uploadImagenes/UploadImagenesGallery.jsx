import { GripVertical, Star, Trash2, Image as ImageIcon } from "lucide-react";

export const UploadImagenesGallery = ({
  dragOverKey,
  draggingKey,
  imagenes,
  isSaving,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onRemove,
}) => {
  if (imagenes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
        <ImageIcon className="mx-auto mb-2 h-7 w-7 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">
          Aún no cargaste imágenes
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Agregá al menos una imagen para visualizar el producto en catálogo.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {imagenes.length} {imagenes.length === 1 ? "imagen" : "imágenes"}
        </p>
        <p className="text-xs text-gray-500">Tip: arrastrá para reordenar</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {imagenes.map((item, index) => {
          const preview =
            item.type === "new" ? item.previewUrl : item.urlImagen;

          return (
            <article
              key={item.key}
              draggable={!isSaving}
              onDragStart={(e) => onDragStart(e, item.key)}
              onDragOver={(e) => onDragOver(e, item.key)}
              onDrop={(e) => onDrop(e, item.key)}
              onDragEnd={onDragEnd}
              className={`group relative rounded-2xl border bg-white p-2.5 shadow-sm transition-colors ${
                draggingKey === item.key ? "opacity-60" : "opacity-100"
              } ${
                dragOverKey === item.key && draggingKey !== item.key
                  ? "border-primary-300 ring-2 ring-primary-400"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="absolute left-3 top-3 z-10 rounded-md border border-gray-200 bg-white/95 p-1 cursor-grab active:cursor-grabbing">
                <GripVertical className="h-3.5 w-3.5 text-gray-500" />
              </div>

              <div className="absolute right-3 top-3 z-10 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white">
                #{index + 1}
              </div>

              <div className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-full rounded-lg border border-gray-200 object-cover"
                />

                {item.esPrincipal && (
                  <div className="absolute bottom-2 left-2 inline-flex items-center justify-center gap-1 rounded-full bg-yellow-100/95 px-2.5 py-1 text-xs font-semibold text-yellow-800 shadow-sm">
                    <Star className="h-3.5 w-3.5" />
                    Principal
                  </div>
                )}
              </div>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  disabled={isSaving || item.isLegacy}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40 cursor-pointer"
                  title={
                    item.isLegacy ? "No editable (imagen legacy)" : "Quitar"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Quitar
                </button>
              </div>

              <p className="mt-1 text-[11px] text-gray-500">
                Orden: {index + 1} ·{" "}
                {item.type === "existing" ? "Existente" : "Nueva"}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};
