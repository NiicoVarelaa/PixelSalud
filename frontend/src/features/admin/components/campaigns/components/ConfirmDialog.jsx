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
  type = "warning", // warning, danger, info
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      bgColor: "from-yellow-500 to-orange-500",
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      confirmBg:
        "from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
    },
    danger: {
      bgColor: "from-red-500 to-pink-500",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      confirmBg:
        "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
    },
    info: {
      bgColor: "from-blue-500 to-purple-500",
      icon: AlertTriangle,
      iconColor: "text-blue-500",
      confirmBg:
        "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.bgColor} p-6 text-white`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="p-1 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700 text-base leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${config.confirmBg} text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? "Procesando..." : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
