import { ChevronLeft, ChevronRight } from "lucide-react";

const LIMITE_OPCIONES = [5, 10, 15, 20, 25, 50];

export const AuditoriaPagination = ({
  totalRegistros,
  offset,
  limite,
  onAnterior,
  onSiguiente,
  onCambiarLimite,
}) => {
  const esPrimera  = offset === 0;
  const puedeAvanzar = totalRegistros === limite;
  const paginaActual = Math.floor(offset / limite) + 1;
  const desde = offset + 1;
  const hasta = offset + totalRegistros;

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
      aria-label="Paginación de auditorías"
    >
      {/* Info + por página */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span aria-live="polite">
          <span className="font-semibold text-gray-700">{desde}–{hasta}</span> registros · página{" "}
          <span className="font-semibold text-gray-700">{paginaActual}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <label htmlFor="limite-pagina" className="text-gray-400">
            Por página:
          </label>
          <select
            id="limite-pagina"
            value={limite}
            onChange={(e) => onCambiarLimite(Number(e.target.value))}
            className="h-7 rounded-md border border-gray-200 bg-white px-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
            aria-label="Registros por página"
          >
            {LIMITE_OPCIONES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onAnterior}
          disabled={esPrimera}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={onSiguiente}
          disabled={!puedeAvanzar}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Página siguiente"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
};