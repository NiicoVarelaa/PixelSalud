import { useEffect, useRef, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Clock,
  Monitor,
  Shield,
  FileText,
  ArrowLeftRight,
} from "lucide-react";
import {
  formatearFecha,
  getRolBadgeColor,
  getEventoBadgeColor,
  formatearEvento,
} from "../utils/helpers";

/* ── Fila de dato ── */
const DataRow = ({ label, children }) => (
  <div className="flex items-start gap-2 py-1.5">
    <span className="w-28 shrink-0 text-xs text-gray-400">{label}</span>
    <span className="flex-1 text-xs font-medium text-gray-800 break-words">
      {children}
    </span>
  </div>
);

/* ── Bloque de JSON ── */
const JsonBlock = ({ title, data, Icon, accentClass }) => {
  if (!data) return null;
  return (
    <div>
      <div
        className={`mb-1.5 flex items-center gap-1.5 text-xs font-semibold ${accentClass}`}
      >
        {createElement(Icon, { size: 13, "aria-hidden": "true" })}
        {title}
      </div>
      <pre className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-[11px] leading-relaxed text-gray-700 font-mono">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export const AuditoriaModal = ({ auditoria, isOpen, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!auditoria) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auditoria-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
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
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Shield
                    size={17}
                    className="text-gray-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <h2
                    id="auditoria-modal-title"
                    className="text-sm font-semibold text-gray-900 leading-none"
                  >
                    Detalle de auditoría
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    ID #{auditoria.idAuditoria}
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar modal"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* ── Evento + Módulo ── */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getEventoBadgeColor(auditoria.evento)}`}
                >
                  {formatearEvento(auditoria.evento)}
                </span>
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 capitalize">
                  {auditoria.modulo}
                </span>
                {auditoria.accion && (
                  <span className="rounded-md bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-medium text-orange-700">
                    {auditoria.accion}
                  </span>
                )}
              </div>

              {/* ── Info general ── */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 divide-y divide-gray-100">
                <DataRow
                  label={
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> Fecha/Hora
                    </span>
                  }
                >
                  {formatearFecha(auditoria.fechaHora)}
                </DataRow>
                {auditoria.entidadAfectada && (
                  <DataRow label="Entidad">
                    {auditoria.entidadAfectada}
                    {auditoria.idEntidad ? ` #${auditoria.idEntidad}` : ""}
                  </DataRow>
                )}
                {auditoria.descripcion && (
                  <DataRow label="Descripción">{auditoria.descripcion}</DataRow>
                )}
              </div>

              {/* ── Usuario ── */}
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <User size={12} aria-hidden="true" /> Usuario
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 divide-y divide-gray-100">
                  <DataRow label="Nombre">
                    {auditoria.nombreUsuario || "N/A"}
                  </DataRow>
                  <DataRow label="Email">
                    {auditoria.emailUsuario || "N/A"}
                  </DataRow>
                  <DataRow label="Rol">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getRolBadgeColor(auditoria.tipoUsuario)}`}
                    >
                      {auditoria.tipoUsuario}{" "}
                      {auditoria.idUsuario ? `#${auditoria.idUsuario}` : ""}
                    </span>
                  </DataRow>
                </div>
              </div>

              {/* ── JSON diffs ── */}
              {(auditoria.datosAnteriores || auditoria.datosNuevos) && (
                <div className="space-y-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <ArrowLeftRight size={12} aria-hidden="true" /> Cambios
                  </p>
                  <JsonBlock
                    title="Datos anteriores"
                    data={auditoria.datosAnteriores}
                    icon={FileText}
                    accentClass="text-orange-600"
                  />
                  <JsonBlock
                    title="Datos nuevos"
                    data={auditoria.datosNuevos}
                    icon={FileText}
                    accentClass="text-green-600"
                  />
                </div>
              )}

              {/* ── Metadata técnica ── */}
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <Monitor size={12} aria-hidden="true" /> Metadata
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 divide-y divide-gray-100">
                  <DataRow label="IP">{auditoria.ip || "N/A"}</DataRow>
                  <DataRow label="User Agent">
                    <span className="truncate block max-w-[280px] text-gray-500">
                      {auditoria.userAgent || "N/A"}
                    </span>
                  </DataRow>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-100 px-5 py-3.5 flex-shrink-0 bg-gray-50/70">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
