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

const DataRow = ({ label, children }) => (
  <div className="flex items-start gap-2 py-2">
    <span className="w-32 shrink-0 text-xs font-medium text-gray-500">
      {label}
    </span>
    <span className="flex-1 text-xs font-medium text-gray-800 break-words">
      {children}
    </span>
  </div>
);

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
      <pre className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-xs leading-relaxed text-gray-700 font-mono">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl max-h-[92vh]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Shield
                    size={17}
                    className="text-gray-700"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <h2
                    id="auditoria-modal-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Detalle de auditoria
                  </h2>
                  <p className="text-xs text-gray-500">
                    Registro #{auditoria.idAuditoria} · {formatearEvento(auditoria.evento)}
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

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getEventoBadgeColor(auditoria.evento)}`}
                >
                  {formatearEvento(auditoria.evento)}
                </span>
                <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 capitalize">
                  {auditoria.modulo}
                </span>
                {auditoria.accion && (
                  <span className="rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-medium text-orange-700">
                    {auditoria.accion}
                  </span>
                )}
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <Clock size={12} aria-hidden="true" /> Informacion general
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 divide-y divide-gray-100">
                  <DataRow label="Fecha/Hora">
                    {formatearFecha(auditoria.fechaHora)}
                  </DataRow>
                  {auditoria.entidadAfectada && (
                    <DataRow label="Entidad">
                      {auditoria.entidadAfectada}
                      {auditoria.idEntidad ? ` #${auditoria.idEntidad}` : ""}
                    </DataRow>
                  )}
                  {auditoria.descripcion && (
                    <DataRow label="Descripcion">
                      {auditoria.descripcion}
                    </DataRow>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <User size={12} aria-hidden="true" /> Usuario
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 divide-y divide-gray-100">
                  <DataRow label="Nombre">
                    {auditoria.nombreUsuario || "N/A"}
                  </DataRow>
                  <DataRow label="Email">
                    {auditoria.emailUsuario || "N/A"}
                  </DataRow>
                  <DataRow label="Rol">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRolBadgeColor(auditoria.tipoUsuario)}`}
                    >
                      {auditoria.tipoUsuario}
                      {auditoria.idUsuario ? ` #${auditoria.idUsuario}` : ""}
                    </span>
                  </DataRow>
                </div>
              </div>

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

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <Monitor size={12} aria-hidden="true" /> Metadata
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 divide-y divide-gray-100">
                  <DataRow label="Direccion IP">
                    {auditoria.ip || "N/A"}
                  </DataRow>
                  <DataRow label="User Agent">
                    <span className="text-gray-500 break-all">
                      {auditoria.userAgent || "N/A"}
                    </span>
                  </DataRow>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 px-5 py-3.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
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
