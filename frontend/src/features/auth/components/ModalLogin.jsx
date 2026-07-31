import { useCallback, useEffect, useId, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useModalLock } from "@hooks/useModalLock";
import { LogIn, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ModalLogin = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const loginButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleLogin = useCallback(() => {
    onClose();
    navigate("/login");
  }, [navigate, onClose]);

  useModalLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key === "Tab") {
        const focusable = [
          closeButtonRef.current,
          cancelButtonRef.current,
          loginButtonRef.current,
        ].filter(Boolean);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;

        if (event.shiftKey && current === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);

    const frame = requestAnimationFrame(() => {
      loginButtonRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleEscape);
      cancelAnimationFrame(frame);
      if (previouslyFocusedRef.current?.focus) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [handleClose, isOpen]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          onClick={handleOverlayClick}
          role="presentation"
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-xl sm:max-w-md sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-3 right-3 inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mb-4 flex items-center justify-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <LogIn className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>

            <h2
              id={titleId}
              className="text-center text-xl font-semibold text-gray-900"
            >
              ¡Un momento!
            </h2>

            <p
              id={descriptionId}
              className="mt-2 text-center text-sm leading-relaxed text-gray-600"
            >
              Para agregar productos al carrito, primero debes iniciar sesión.
            </p>

            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={handleClose}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-primary-700 bg-white px-4 py-2.5 text-sm font-medium text-primary-700 transition hover:bg-primary-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                ref={loginButtonRef}
                type="button"
                onClick={handleLogin}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-primary-700 bg-primary-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 cursor-pointer"
              >
                Iniciar sesión
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalLogin;
