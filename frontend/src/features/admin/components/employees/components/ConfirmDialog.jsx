import { useEffect } from "react";
import { AlertTriangle, Power } from "lucide-react";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
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

  const isDanger = type === "danger";
  const isInfo = type === "info";

  const iconBg = isDanger
    ? "bg-red-50 text-red-600 ring-red-200"
    : isInfo
      ? "bg-blue-50 text-blue-600 ring-blue-200"
      : "bg-amber-50 text-amber-600 ring-amber-200";

  const confirmBg = isDanger
    ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40"
    : isInfo
      ? "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500/40"
      : "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500/40";

  const Icon = isDanger || isInfo ? Power : AlertTriangle;

  const handleConfirm = async () => {
    const result = await onConfirm();
    if (result !== false) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Cerrar confirmacion"
      />

      <div className="relative w-full rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-1 ${iconBg}`}
        >
          <Icon size={28} aria-hidden="true" />
        </div>

        <h3 className="text-center text-xl font-extrabold text-gray-800">
          {title}
        </h3>
        <p className="mt-2 text-center text-sm text-gray-500">{message}</p>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleConfirm}
            className={`h-11 rounded-xl px-4 font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${confirmBg}`}
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
