import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const PerfilToast = ({ msg, type }) => {
  const isSuccess = type === "success";

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium border ${
        isSuccess
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2
          size={16}
          className="shrink-0 text-emerald-600"
          aria-hidden="true"
        />
      ) : (
        <AlertCircle
          size={16}
          className="shrink-0 text-red-500"
          aria-hidden="true"
        />
      )}
      {msg}
    </motion.div>
  );
};

export default PerfilToast;
