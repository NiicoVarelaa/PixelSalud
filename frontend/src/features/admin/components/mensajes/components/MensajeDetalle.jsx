import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, Reply, Archive, Trash2, CheckCheck, MailOpen, Clock,
} from "lucide-react";
import { MensajeEstadoBadge } from "./MensajeEstadoBadge";
import { formatFecha } from "../utils/helpers";

/* Fila de metadato */
const MetaRow = ({ label, children }) => (
  <div className="flex items-start gap-2">
    <span className="w-14 shrink-0 text-xs text-gray-400">{label}</span>
    <span className="flex-1 text-xs font-medium text-gray-800 break-words">{children}</span>
  </div>
);

export const MensajeDetalle = ({
  mensaje,
  isOpen,
  onClose,
  onMarcarLeido,
  onResponder,
  onArchivar,
  onEliminar,
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

  if (!mensaje) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-title"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  <Mail size={17} className="text-green-700" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 id="detalle-title" className="truncate text-sm font-semibold text-gray-900">
                    {mensaje.asunto}
                  </h2>
                  <p className="text-xs text-gray-500">de {mensaje.nombre}</p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar detalle"
              >
                <X size={17} />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* Metadatos */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
                <MetaRow label="De">{mensaje.nombre}</MetaRow>
                <MetaRow label="Email">
                  <a
                    href={`mailto:${mensaje.email}`}
                    className="text-green-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                  >
                    {mensaje.email}
                  </a>
                </MetaRow>
                <MetaRow label="Fecha">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} aria-hidden="true" className="text-gray-400" />
                    {formatFecha(mensaje.fechaEnvio)}
                  </span>
                </MetaRow>
                <MetaRow label="Estado"><MensajeEstadoBadge estado={mensaje.estado} /></MetaRow>
                <MetaRow label="Leído">
                  {mensaje.leido
                    ? <span className="inline-flex items-center gap-1 text-green-600"><MailOpen size={12} aria-hidden="true" /> Sí</span>
                    : <span className="inline-flex items-center gap-1 text-gray-500"><Mail size={12} aria-hidden="true" /> No</span>
                  }
                </MetaRow>
              </div>

              {/* Cuerpo del mensaje */}
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Mensaje
                </p>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {mensaje.mensaje}
                </div>
              </div>

              {/* Respuesta existente */}
              {mensaje.respuesta && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-blue-500">
                    Respuesta enviada
                  </p>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {mensaje.respuesta}
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    Por {mensaje.respondidoPor || "Admin"} · {formatFecha(mensaje.fechaRespuesta)}
                  </p>
                </div>
              )}
            </div>

            {/* Footer: acciones */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 flex-shrink-0 bg-gray-50/70">
              {!mensaje.leido && (
                <button
                  type="button"
                  onClick={() => { onMarcarLeido(mensaje.idMensaje); onClose(); }}
                  className="inline-flex items-center gap-1.5 h-8 rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-semibold text-green-700 hover:bg-green-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  aria-label="Marcar como leído"
                >
                  <CheckCheck size={13} aria-hidden="true" /> Marcar leído
                </button>
              )}

              {mensaje.estado !== "respondido" && mensaje.estado !== "cerrado" && (
                <button
                  type="button"
                  onClick={() => { onClose(); onResponder(mensaje); }}
                  className="inline-flex items-center gap-1.5 h-8 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 hover:bg-blue-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  aria-label="Responder mensaje"
                >
                  <Reply size={13} aria-hidden="true" /> Responder
                </button>
              )}

              {mensaje.estado !== "cerrado" && (
                <button
                  type="button"
                  onClick={() => { onArchivar(mensaje.idMensaje); onClose(); }}
                  className="inline-flex items-center gap-1.5 h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                  aria-label="Archivar mensaje"
                >
                  <Archive size={13} aria-hidden="true" /> Archivar
                </button>
              )}

              <button
                type="button"
                onClick={async () => { const ok = await onEliminar(mensaje.idMensaje); if (ok) onClose(); }}
                className="inline-flex items-center gap-1.5 h-8 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 hover:bg-red-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label="Eliminar mensaje"
              >
                <Trash2 size={13} aria-hidden="true" /> Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};