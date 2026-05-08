import PaginationProductos from "@features/admin/components/products/components/Pagination";

const LIMITE_OPCIONES = [6, 10, 15, 20, 25, 50];

export const AuditoriaPagination = ({
  totalRegistros,
  offset,
  limite,
  totalPaginas,
  onCambiarPagina,
  onCambiarLimite,
}) => {
  const paginaActual = Math.floor(offset / limite) + 1;
  const desde = offset + 1;
  const hasta = offset + totalRegistros;

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span aria-live="polite">
            <span className="font-semibold text-gray-700">
              {desde}–{hasta}
            </span>{" "}
            de {totalRegistros + offset} registros · pagina{" "}
            <span className="font-semibold text-gray-700">{paginaActual}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <label htmlFor="limite-pagina" className="text-gray-400">
              Por pagina:
            </label>
            <select
              id="limite-pagina"
              value={limite}
              onChange={(e) => onCambiarLimite(Number(e.target.value))}
              className="h-7 rounded-lg border border-gray-200 bg-gray-50 px-2 text-xs text-gray-700 cursor-pointer focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
              aria-label="Registros por pagina"
            >
              {LIMITE_OPCIONES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <PaginationProductos
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={onCambiarPagina}
          />
        </div>
      </div>
    </div>
  );
};
