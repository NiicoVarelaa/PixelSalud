import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Cerrar confirmacion"
      />

      <div className="relative w-full rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
          <AlertTriangle size={28} aria-hidden="true" />
        </div>

        <h3 className="text-center text-xl font-extrabold text-gray-800">
          {title}
        </h3>
        <p className="mt-2 text-center text-sm text-gray-500">{message}</p>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-11 rounded-xl bg-green-600 hover:bg-green-700 px-4 font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 cursor-pointer"
          >
            {confirmText}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-slate-600 hover:bg-slate-700 px-4 font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40 cursor-pointer"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
