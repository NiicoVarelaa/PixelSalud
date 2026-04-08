import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Info } from "lucide-react";
import { useEffect, useRef } from "react";

const TYPE_CONFIG = {
  warning: {
    Icon: AlertTriangle,
    iconBg: "bg-amber-50 border border-amber-200",
    iconColor: "text-amber-600",
    confirmClass: "bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-amber-500",
  },
  danger: {
    Icon: AlertTriangle,
    iconBg: "bg-red-50 border border-red-200",
    iconColor: "text-red-600",
    confirmClass: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500",
  },
  info: {
    Icon: Info,
    iconBg: "bg-green-50 border border-green-200",
    iconColor: "text-green-600",
    confirmClass: "bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500",
  },
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
  isProcessing = false,
}) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape" && !isProcessing) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, isProcessing, onClose]);

  const { Icon, iconBg, iconColor, confirmClass } = TYPE_CONFIG[type] ?? TYPE_CONFIG.warning;

  const handleConfirm = async () => {
    await onConfirm?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
          onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) onClose(); }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start gap-3 p-5 pb-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon size={17} className={iconColor} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 id="confirm-title" className="text-sm font-semibold text-gray-900">
                  {title}
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                aria-label="Cerrar"
              >
                <X size={15} />
              </button>
            </div>

            {/* Message */}
            <p id="confirm-message" className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-2 border-t border-gray-100 px-5 py-3.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 h-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`flex-1 h-9 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${confirmClass}`}
              >
                {isProcessing ? "Procesando..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
