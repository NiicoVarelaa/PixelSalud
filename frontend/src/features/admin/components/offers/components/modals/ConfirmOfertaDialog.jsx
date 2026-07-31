import { useEffect, useRef } from "react";
import { AlertTriangle, CircleCheck, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_CONFIG = {
  danger: {
    Icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconRing: "ring-red-200",
    iconColor: "text-red-600",
    confirmClass: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40",
    confirmText: "text-white",
  },
  success: {
    Icon: CircleCheck,
    iconBg: "bg-green-50",
    iconRing: "ring-green-200",
    iconColor: "text-green-600",
    confirmClass: "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500/40",
    confirmText: "text-white",
  },
};

export const ConfirmOfertaDialog = ({
  isOpen,
  isLoading = false,
  producto,
  onClose,
  onConfirm,
  title = "¿Quitar oferta?",
  message = "",
  confirmText = "Sí, quitar",
  type = "danger",
}) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, isLoading, onClose]);

  const { Icon, iconColor, confirmClass, confirmText: confirmTextColor } =
    TYPE_CONFIG[type] ?? TYPE_CONFIG.danger;

  const defaultMessage = producto?.nombreProducto
    ? `Se ${type === "danger" ? "eliminará" : "aplicará"} el descuento de${type === "danger" ? "" : "l"} ${producto.nombreProducto}`
    : `Se ${type === "danger" ? "eliminará" : "aplicará"} el descuento de este producto`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-oferta-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6 rounded-t-2xl"
          >
            <div className="flex items-center justify-end">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                aria-label="Cerrar"
              >
                <X size={15} />
              </button>
            </div>

            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-1 ${type === "danger" ? "bg-red-50 ring-red-200" : "bg-green-50 ring-green-200"}`}>
              <Icon size={28} className={iconColor} aria-hidden="true" />
            </div>

            <h3
              id="confirm-oferta-title"
              className="text-center text-2xl font-extrabold text-gray-800"
            >
              {title}
            </h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              {message || defaultMessage}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`h-11 rounded-xl px-4 font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2 ${confirmClass} ${confirmTextColor}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Procesando...
                  </>
                ) : (
                  confirmText
                )}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
