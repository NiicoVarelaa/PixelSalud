import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
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
            {/* Header */}
            <div className="flex items-start gap-3 p-5 pb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50">
                <AlertTriangle size={17} className="text-orange-600" aria-hidden="true" />
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
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                aria-label="Cerrar diálogo"
              >
                <X size={15} />
              </button>
            </div>

            <p id="confirm-message" className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
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
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 h-9 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-semibold text-white active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
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