import { create } from "zustand";

export const useVentasStore = create((set) => ({
  // Estado
  ventas: [],
  cargando: false,
  filtro: "",
  filtroEstado: "todas",
  paginaActual: 1,
  itemsPorPagina: 8,

  // Acciones
  setVentas: (ventas) => set({ ventas }),
  setCargando: (cargando) => set({ cargando }),
  setFiltro: (filtro) => set({ filtro, paginaActual: 1 }),
  setFiltroEstado: (filtroEstado) => set({ filtroEstado, paginaActual: 1 }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),
}));
