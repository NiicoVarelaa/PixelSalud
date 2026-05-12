import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmAnularDialog = ({ isOpen, isLoading, onClose, onConfirm, idVenta }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape" && !isLoading) onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer" onClick={onClose} disabled={isLoading} aria-label="Cerrar" />
      <div className="relative w-full rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-1 ring-orange-200">
          <AlertTriangle size={28} aria-hidden="true" />
        </div>
        <h3 className="text-center text-2xl font-extrabold text-gray-800">¿Anular venta?</h3>
        <p className="mt-2 text-center text-sm text-gray-500">La venta #{idVenta} será anulada y el stock se devolverá.</p>
        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button type="button" onClick={onConfirm} disabled={isLoading} className="h-11 rounded-xl bg-red-600 px-4 font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
            {isLoading ? "Anulando..." : "Sí, anular"}
          </button>
          <button type="button" onClick={onClose} disabled={isLoading} className="h-11 rounded-xl bg-slate-600 px-4 font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAnularDialog;
