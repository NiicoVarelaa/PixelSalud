import { useState, useMemo, useCallback, useEffect } from "react";

/**
 * Custom hook para manejar la paginación
 * @param {Array} items - Items a paginar
 * @param {number} itemsPerPage - Cantidad de items por página
 * @returns {Object} Estado y funciones de paginación
 */
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Calcular items de la página actual
  const paginatedItems = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return items.slice(firstIndex, lastIndex);
  }, [items, currentPage, itemsPerPage]);

  // Resetear a página 1 cuando cambian los items
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Handler para cambiar de página
  const goToPage = useCallback(
    (pageNumber) => {
      const validPage = Math.max(1, Math.min(pageNumber, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
  };
};
