import { estadoLabels, getEstadoColor } from "../utils/helpers";

export const MensajeEstadoBadge = ({ estado }) => {
  return (
    <span
      className={`inline-block text-xs px-2 py-1 rounded font-semibold ${getEstadoColor(estado)}`}
    >
      {estadoLabels[estado] || estado}
    </span>
  );
};
