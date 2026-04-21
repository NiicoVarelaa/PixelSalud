import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { normalizeEstado } from "./utils/ventasOnlineTable.utils";

export const EstadoChip = ({ estado }) => {
  const estadoNormalizado = normalizeEstado(estado);

  if (estadoNormalizado === "retirado") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800"
        role="status"
      >
        <CheckCircle2 size={14} aria-hidden="true" />
        Retirado
      </span>
    );
  }

  if (estadoNormalizado === "pendiente") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"
        role="status"
      >
        <AlertCircle size={14} aria-hidden="true" />
        Pendiente
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
      role="status"
    >
      <XCircle size={14} aria-hidden="true" />
      Cancelado
    </span>
  );
};
