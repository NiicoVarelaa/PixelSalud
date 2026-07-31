import { useEffect } from "react";
import { Trash2 } from "lucide-react";

const ConfirmVaciarDialog = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer" onClick={onClose} aria-label="Cerrar" />
      <div className="relative w-full rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 ring-1 ring-red-200">
          <Trash2 size={28} aria-hidden="true" />
        </div>
        <h3 className="text-center text-2xl font-extrabold text-gray-800">¿Vaciar ticket?</h3>
        <p className="mt-2 text-center text-sm text-gray-500">Se eliminarán todos los productos del ticket.</p>
        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button type="button" onClick={onConfirm} className="h-11 rounded-xl bg-red-600 px-4 font-bold text-white transition-colors hover:bg-red-700 cursor-pointer">Sí, vaciar</button>
          <button type="button" onClick={onClose} className="h-11 rounded-xl bg-slate-600 px-4 font-bold text-white transition-colors hover:bg-slate-700 cursor-pointer">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmVaciarDialog;
