import { create } from "zustand";

export const useOfertasStore = create((set) => ({
  // Estado
  productos: [],
  idsProductosEnCampanas: [],
  cargando: false,
  busqueda: "",
  filtroCategoria: "todas",
  filtroDescuento: "todos", // todos, 10, 15, 20, sin-oferta
  paginaActual: 1,
  itemsPorPagina: 10,

  // Acciones
  setProductos: (productos) => set({ productos }),
  setIdsProductosEnCampanas: (ids) => set({ idsProductosEnCampanas: ids }),
  setCargando: (cargando) => set({ cargando }),
  setBusqueda: (busqueda) => set({ busqueda, paginaActual: 1 }),
  setFiltroCategoria: (filtroCategoria) =>
    set({ filtroCategoria, paginaActual: 1 }),
  setFiltroDescuento: (filtroDescuento) =>
    set({ filtroDescuento, paginaActual: 1 }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),

  // Reset
  resetFiltros: () =>
    set({
      busqueda: "",
      filtroCategoria: "todas",
      filtroDescuento: "todos",
      paginaActual: 1,
    }),
}));
