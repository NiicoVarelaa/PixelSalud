import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const CartConfirmDialog = ({
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-10000 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
      >
        <div className="flex items-center justify-center p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {title}
        </h3>

        <p className="text-gray-600 text-center mb-6">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CartConfirmDialog;
