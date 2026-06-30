import { useEffect, useRef, useState, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalLock } from "@hooks/useModalLock";
import {
  X,
  User,
  Clock,
  Shield,
  FileText,
  Hash,
  Network,
  ChevronDown,
  MapPin,
} from "lucide-react";
import {
  formatearFecha,
  getRolBadgeColor,
  getEventoBadgeColor,
  formatearEvento,
} from "../utils/helpers";

const SectionTitle = ({ icon, children }) => (
  <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
    {createElement(icon, { size: 12, "aria-hidden": "true" })}
    {children}
  </p>
);

const InfoCard = ({ children }) => (
  <div className="rounded-xl border border-gray-100 bg-white divide-y divide-gray-100">
    {children}
  </div>
);

const InfoRow = ({ label, value, icon, valueClass = "text-gray-900" }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    {icon && (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        {createElement(icon, { size: 12, className: "text-gray-500" })}
      </div>
    )}
    <div className="min-w-0 flex-1">
      <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400 mb-0.5">
        {label}
      </span>
      <span className={`block text-sm font-medium break-words ${valueClass}`}>
        {value}
      </span>
    </div>
  </div>
);

const CollapsibleJson = ({ data, title }) => {
  const [open, setOpen] = useState(false);
  if (!data) return null;
  let jsonStr;
  try {
    jsonStr =
      typeof data === "string" ? data : JSON.stringify(data, null, 2);
  } catch {
    jsonStr = String(data);
  }

  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <pre className="overflow-x-auto bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-700 font-mono max-h-48 border-t border-gray-100">
          {jsonStr}
        </pre>
      )}
    </div>
  );
};

export const AuditoriaModal = ({ auditoria, isOpen, onClose }) => {
  const closeRef = useRef(null);

  useModalLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
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
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl max-h-[92vh]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900">
                  <Shield size={16} className="text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2
                    id="auditoria-modal-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    {formatearEvento(auditoria.evento)}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {auditoria.fechaHora
                      ? formatearFecha(auditoria.fechaHora)
                      : ""}
                    <span className="text-gray-300 mx-1.5">·</span>
                    #{auditoria.idAuditoria}
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                aria-label="Cerrar modal"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {auditoria.modulo && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 capitalize">
                    {auditoria.modulo}
                  </span>
                )}
                {auditoria.accion && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-700">
                    {auditoria.accion}
                  </span>
                )}
              </div>

              {auditoria.descripcion && (
                <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                  <p className="text-sm font-medium text-blue-900">
                    {auditoria.descripcion}
                  </p>
                </div>
              )}

              <div>
                <SectionTitle icon={User}>Usuario</SectionTitle>
                <InfoCard>
                  <InfoRow
                    label="Nombre"
                    value={auditoria.nombreUsuario || "Sistema"}
                    icon={User}
                    valueClass={
                      auditoria.nombreUsuario
                        ? "text-gray-900"
                        : "text-gray-400 italic"
                    }
                  />
                  {auditoria.emailUsuario && (
                    <InfoRow label="Email" value={auditoria.emailUsuario} />
                  )}
                  <InfoRow
                    label="Rol"
                    icon={Shield}
                    value={
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRolBadgeColor(auditoria.tipoUsuario)}`}
                      >
                        {auditoria.tipoUsuario}
                        {auditoria.idUsuario ? ` #${auditoria.idUsuario}` : ""}
                      </span>
                    }
                  />
                </InfoCard>
              </div>

              {auditoria.entidadAfectada && (
                <div>
                  <SectionTitle icon={Hash}>Entidad afectada</SectionTitle>
                  <InfoCard>
                    <InfoRow
                      label="Entidad"
                      value={`${auditoria.entidadAfectada}${auditoria.idEntidad ? ` #${auditoria.idEntidad}` : ""}`}
                      icon={FileText}
                    />
                  </InfoCard>
                </div>
              )}

              {(auditoria.datosAnteriores || auditoria.datosNuevos) && (
                <div>
                  <SectionTitle icon={FileText}>Cambios</SectionTitle>
                  <InfoCard>
                    <CollapsibleJson
                      title="Datos anteriores"
                      data={auditoria.datosAnteriores}
                    />
                    <CollapsibleJson
                      title="Datos nuevos"
                      data={auditoria.datosNuevos}
                    />
                  </InfoCard>
                </div>
              )}

              {auditoria.ip && (
                <div>
                  <SectionTitle icon={Network}>Origen</SectionTitle>
                  <InfoCard>
                    <InfoRow
                      label="Direccion IP"
                      value={auditoria.ip}
                      icon={MapPin}
                      valueClass="text-xs font-mono text-gray-500"
                    />
                  </InfoCard>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-gray-100 px-5 py-3.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
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
