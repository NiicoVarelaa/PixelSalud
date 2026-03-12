import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";

/**
 * Componente de diálogo de confirmación personalizado
 * Reemplaza SweetAlert2 con una solución nativa
 */
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
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      gradient: "from-yellow-500 to-orange-500",
      bgIcon: "bg-yellow-100",
      textIcon: "text-yellow-600",
      buttonBg:
        "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
    },
    danger: {
      icon: AlertCircle,
      gradient: "from-red-500 to-red-600",
      bgIcon: "bg-red-100",
      textIcon: "text-red-600",
      buttonBg: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    },
    info: {
      icon: Info,
      gradient: "from-blue-500 to-blue-600",
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
      buttonBg:
        "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
  };

  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  const handleConfirm = async () => {
    const result = await onConfirm();
    if (result !== false) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header con gradiente */}
              <div
                className={`bg-gradient-to-r ${config.gradient} px-6 py-4 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${config.bgIcon} p-2 rounded-lg`}>
                    <Icon className={config.textIcon} size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">{message}</p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${config.buttonBg} text-white font-medium rounded-lg transition-colors shadow-lg`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
