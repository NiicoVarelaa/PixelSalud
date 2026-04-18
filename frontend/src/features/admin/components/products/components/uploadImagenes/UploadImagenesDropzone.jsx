import { Image as ImageIcon, Upload } from "lucide-react";

export const UploadImagenesDropzone = ({
  isSaving,
  maxFiles,
  onChange,
  totalImagenes,
}) => {
  const disabled = isSaving || totalImagenes >= maxFiles;
  const restantes = Math.max(maxFiles - totalImagenes, 0);

  return (
    <label
      htmlFor="file-upload"
      className={`relative flex h-36 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-3 transition-all ${
        disabled
          ? "cursor-not-allowed border-gray-200 bg-gray-50"
          : "border-gray-300 bg-linear-to-b from-white to-gray-50 hover:border-primary-500 hover:shadow-sm"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity ${
          disabled
            ? ""
            : "bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_55%)] group-hover:opacity-100"
        }`}
      />

      <div className="z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-2 rounded-xl border border-gray-200 bg-white p-2.5">
          <ImageIcon className="h-6 w-6 text-gray-500" />
        </div>

        <p className="mb-1 text-sm text-gray-700">
          <span className="font-semibold">Seleccionar imágenes</span> o
          arrastrar aquí
        </p>

        <p className="text-xs text-gray-500">
          PNG, JPG, GIF, WebP (máx. 5MB por archivo)
        </p>

        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
          <Upload className="h-3.5 w-3.5" />
          Cupos disponibles: {restantes}
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={onChange}
        className="hidden"
        disabled={disabled}
      />
    </label>
  );
};
