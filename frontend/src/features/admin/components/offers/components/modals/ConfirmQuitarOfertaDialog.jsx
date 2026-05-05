import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useModalLock } from "@hooks/useModalLock";

export const ConfirmQuitarOfertaDialog = ({
  isOpen,
  isLoading,
  producto,
  onClose,
  onConfirm,
}) => {
  useModalLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        disabled={isLoading}
        aria-label="Cerrar confirmacion de quitar oferta"
      />

      <div className="relative w-full rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200">
          <AlertTriangle size={28} aria-hidden="true" />
        </div>

        <h3 className="text-center text-2xl font-extrabold text-gray-800">
          ¿Quitar oferta?
        </h3>
        <p className="mt-2 text-center text-sm text-gray-500">
          Se eliminara el descuento de
          {producto?.nombreProducto ? (
            <span className="font-semibold text-gray-700">
              {" "}
              {producto.nombreProducto}
            </span>
          ) : (
            " este producto"
          )}
          .
        </p>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-11 rounded-xl bg-red-600 px-4 font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? "Quitando..." : "Si, quitar"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-11 rounded-xl bg-slate-600 px-4 font-bold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
