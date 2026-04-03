import { LogIn, UserPlus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ContactoAuthRequiredModal = ({
  isOpen,
  reason,
  onClose,
  onLogin,
  onRegister,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(event) => {
          if (event.target.id === "modal-backdrop") {
            onClose();
          }
        }}
        id="modal-backdrop"
        className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          aria-describedby="auth-modal-description"
          className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>

          <h3 id="auth-modal-title" className="text-lg font-semibold text-slate-900">
            Inicia sesión para continuar
          </h3>
          <p id="auth-modal-description" className="mt-2 text-sm text-slate-600">
            Para enviar una consulta sobre {reason || "pedido o receta"}, debes
            iniciar sesión o registrarte.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              onClick={onLogin}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary-700 bg-white px-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 active:bg-primary-100"
            >
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </button>
            <button
              onClick={onRegister}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary-700 bg-primary-700 px-3 text-sm font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 active:bg-primary-900"
            >
              <UserPlus className="h-4 w-4" />
              Registrarse
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ContactoAuthRequiredModal;
