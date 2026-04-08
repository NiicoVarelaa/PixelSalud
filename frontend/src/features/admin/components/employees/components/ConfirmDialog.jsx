import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Info } from "lucide-react";

const TYPE_CONFIG = {
  warning: {
    Icon: AlertTriangle,
    iconBg: "bg-orange-50 border border-orange-200",
    iconColor: "text-orange-600",
    confirmCls: "bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-orange-500",
  },
  danger: {
    Icon: AlertTriangle,
    iconBg: "bg-red-50 border border-red-200",
    iconColor: "text-red-600",
    confirmCls: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500",
  },
  info: {
    Icon: Info,
    iconBg: "bg-green-50 border border-green-200",
    iconColor: "text-green-600",
    confirmCls: "bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500",
  },
};

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
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const { Icon, iconBg, iconColor, confirmCls } = TYPE_CONFIG[type] ?? TYPE_CONFIG.warning;

  const handleConfirm = async () => {
    const result = await onConfirm();
    if (result !== false) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-emp-title"
          aria-describedby="confirm-emp-message"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-3 p-5 pb-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon size={17} className={iconColor} aria-hidden="true" />
              </div>
              <div className="flex-1 pt-1 min-w-0">
                <h3 id="confirm-emp-title" className="text-sm font-semibold text-gray-900">
                  {title}
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                aria-label="Cerrar diálogo"
              >
                <X size={15} />
              </button>
            </div>

            <p id="confirm-emp-message" className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
              {message}
            </p>

            <div className="flex gap-2 border-t border-gray-100 px-5 py-3.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-9 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`flex-1 h-9 rounded-lg text-sm font-semibold active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${confirmCls}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};