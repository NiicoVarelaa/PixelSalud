import { create } from "zustand";

export const useVentasStore = create((set) => ({
  ventas: [],
  cargando: false,
  filtro: "",
  filtroEstado: "todas",
  filtroOrden: "mas_nuevo",
  paginaActual: 1,
  itemsPorPagina: 7,

  setVentas: (ventas) => set({ ventas }),
  setCargando: (cargando) => set({ cargando }),
  setFiltro: (filtro) => set({ filtro, paginaActual: 1 }),
  setFiltroEstado: (filtroEstado) => set({ filtroEstado, paginaActual: 1 }),
  setFiltroOrden: (filtroOrden) => set({ filtroOrden, paginaActual: 1 }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),
}));
