import { create } from "zustand";

export const useVentasOnlineStore = create((set) => ({
  ventas: [],
  productosDisponibles: [],
  cargando: false,
  filtro: "",
  filtroEstado: "todas",
  filtroOrden: "mas_nuevo",
  paginaActual: 1,
  itemsPorPagina: 5,

  setVentas: (ventas) => set({ ventas }),
  setProductosDisponibles: (productos) =>
    set({ productosDisponibles: productos }),
  setCargando: (cargando) => set({ cargando }),
  setFiltro: (filtro) => set({ filtro, paginaActual: 1 }),
  setFiltroEstado: (filtroEstado) => set({ filtroEstado, paginaActual: 1 }),
  setFiltroOrden: (filtroOrden) => set({ filtroOrden, paginaActual: 1 }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),

  updateVentaEstado: (idVentaO, nuevoEstado) => {
    set((state) => ({
      ventas: state.ventas.map((v) =>
        v.idVentaO === idVentaO ? { ...v, estado: nuevoEstado } : v,
      ),
    }));
  },
}));
