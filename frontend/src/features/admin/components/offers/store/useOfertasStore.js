import { create } from "zustand";

export const useOfertasStore = create((set) => ({
  productos: [],
  idsProductosEnCampanas: [],
  cargando: false,
  busqueda: "",
  filtroCategoria: "todas",
  filtroDescuento: "todos",
  paginaActual: 1,
  itemsPorPagina: 6,

  setProductos: (productos) => set({ productos }),
  setIdsProductosEnCampanas: (ids) => set({ idsProductosEnCampanas: ids }),
  setCargando: (cargando) => set({ cargando }),
  setBusqueda: (busqueda) => set({ busqueda, paginaActual: 1 }),
  setFiltroCategoria: (filtroCategoria) =>
    set({ filtroCategoria, paginaActual: 1 }),
  setFiltroDescuento: (filtroDescuento) =>
    set({ filtroDescuento, paginaActual: 1 }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),
  setItemsPorPagina: (itemsPorPagina) =>
    set({ itemsPorPagina, paginaActual: 1 }),

  resetFiltros: () =>
    set({
      busqueda: "",
      filtroCategoria: "todas",
      filtroDescuento: "todos",
      paginaActual: 1,
    }),
}));
