import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Reply, Send, Mail } from "lucide-react";

export const MensajeRespuesta = ({ mensaje, isOpen, onClose, onEnviar }) => {
  const [respuesta, setRespuesta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const textareaRef = useRef(null);
  const closeRef = useRef(null);

  const MAX_CHARS = 2000;
  const restantes = MAX_CHARS - respuesta.length;
  const puedeEnviar = respuesta.trim().length > 0 && restantes >= 0;

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const handleClose = () => {
    setRespuesta("");
    setEnviando(false);
    onClose();
  };

  const handleEnviar = async () => {
    if (!puedeEnviar || enviando) return;
    setEnviando(true);
    try {
      const ok = await onEnviar(mensaje.idMensaje, respuesta);
      if (ok) { setRespuesta(""); onClose(); }
    } finally {
      setEnviando(false);
    }
  };

  // Ctrl+Enter envía
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && puedeEnviar) {
      e.preventDefault();
      handleEnviar();
    }
  };

  if (!mensaje) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="respuesta-title"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <Reply size={17} className="text-blue-700" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="respuesta-title" className="text-sm font-semibold text-gray-900 leading-none">
                    Responder mensaje
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">a {mensaje.nombre}</p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar modal de respuesta"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* Contexto del mensaje original */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Mail size={12} aria-hidden="true" />
                  <span className="font-medium text-gray-700">{mensaje.nombre}</span>
                  <span>·</span>
                  <span>{mensaje.email}</span>
                </div>
                <p className="text-xs font-semibold text-gray-700">{mensaje.asunto}</p>
                <p className="text-xs text-gray-500 line-clamp-3 italic leading-relaxed">
                  {mensaje.mensaje}
                </p>
              </div>

              {/* Campo de respuesta */}
              <div>
                <label
                  htmlFor="respuesta-textarea"
                  className="mb-1.5 block text-xs font-semibold text-gray-600"
                >
                  Tu respuesta
                  <span className="ml-1 font-normal text-gray-400">(Ctrl+Enter para enviar)</span>
                </label>
                <textarea
                  id="respuesta-textarea"
                  ref={textareaRef}
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribí tu respuesta aquí..."
                  rows={6}
                  maxLength={MAX_CHARS}
                  aria-describedby="chars-counter"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400 leading-relaxed transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                <div
                  id="chars-counter"
                  className={`mt-1.5 text-right text-[11px] ${
                    restantes < 100 ? "text-orange-500" : "text-gray-400"
                  }`}
                  aria-live="polite"
                >
                  {restantes} caracteres restantes
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 flex-shrink-0 bg-gray-50/70">
              <button
                type="button"
                onClick={handleClose}
                className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEnviar}
                disabled={!puedeEnviar || enviando}
                className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label={enviando ? "Enviando respuesta..." : "Enviar respuesta"}
              >
                <Send size={14} aria-hidden="true" />
                {enviando ? "Enviando..." : "Enviar respuesta"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};