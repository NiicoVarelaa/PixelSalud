import { estadoLabels, getEstadoColor } from "../utils/helpers";

/**
 * Badge de estado para mensajes.
 * Mantiene la función getEstadoColor del helper original.
 * Se añade `role="status"` para lectores de pantalla.
 */
export const MensajeEstadoBadge = ({ estado }) => {
  return (
    <span
      role="status"
      aria-label={`Estado: ${estadoLabels[estado] || estado}`}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${getEstadoColor(estado)}`}
    >
      {estadoLabels[estado] || estado}
    </span>
  );
};