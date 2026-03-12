import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOfertasStore } from "../../store/useOfertasStore";
import { PaginationInfo } from "./PaginationInfo";
import { PaginationButton } from "./PaginationButton";
import { PageNumber } from "./PageNumber";
import { FirstLastButtons } from "./FirstLastButtons";
import { GoToPageInput } from "./GoToPageInput";
import { usePagination, getPaginationNumbers } from "./usePagination";

export const Pagination = () => {
  const {
    paginaActual,
    setPaginaActual,
    itemsPorPagina,
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    cargando,
  } = useOfertasStore();

  const { totalPaginas, productosFiltrados, inicio, fin, totalItems } =
    usePagination({
      productos,
      busqueda,
      filtroCategoria,
      filtroDescuento,
      paginaActual,
      itemsPorPagina,
    });

  const paginationNumbers = getPaginationNumbers(totalPaginas, paginaActual);

  if (cargando || productosFiltrados.length === 0) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-t-2 border-gray-200 px-4 py-5 sm:px-6 rounded-b-2xl"
      role="navigation"
      aria-label="Paginación de productos"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PaginationInfo inicio={inicio} fin={fin} totalItems={totalItems} />

        <div className="flex items-center justify-center gap-1.5 order-1 sm:order-2">
          <FirstLastButtons
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onFirstPage={() => setPaginaActual(1)}
            onLastPage={() => setPaginaActual(totalPaginas)}
          />

          <PaginationButton
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            icon={ChevronLeft}
            label="Anterior"
            showText
            className="h-10 px-3 sm:px-4"
            ariaLabel="Página anterior"
          />

          <div className="flex items-center gap-1" role="list">
            <AnimatePresence mode="wait">
              {paginationNumbers.map((num, idx) => (
                <PageNumber
                  key={num === "..." ? `ellipsis-${idx}` : num}
                  num={num}
                  isActive={num === paginaActual}
                  onClick={() => num !== "..." && setPaginaActual(num)}
                />
              ))}
            </AnimatePresence>
          </div>

          <PaginationButton
            onClick={() =>
              setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
            }
            disabled={paginaActual === totalPaginas}
            icon={ChevronRight}
            label="Siguiente"
            showText
            className="h-10 px-3 sm:px-4"
            ariaLabel="Página siguiente"
          />
        </div>
      </div>

      <GoToPageInput
        totalPaginas={totalPaginas}
        paginaActual={paginaActual}
        onChange={setPaginaActual}
      />
    </motion.nav>
  );
};
